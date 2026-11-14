// Automated page audit. Writes audit/<label>.json and prints a summary per page.
//   node scripts/audit.mjs [label] [--only /about.html,/faq.html]
// Checks, per page:
//   all widths (375, 768, 1280, 1440): horizontal overflow and the elements causing it, words split across lines,
//     cards with large empty areas, text under 14px
//   1280 and 375: axe-core violations (colour contrast, alt text, names, ...), headings (one h1, no skipped levels,
//     Title Case, <br> inside headings), emoji and symbol characters used as icons, icon-font use, focus styles,
//     console errors and failed requests, internal links that 404, meta tags that disagree, header and footer markup
//   375: the mobile menu opens, traps nothing it shouldn't, and closes on Escape
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { chromium } from "playwright";
import { listPages, root } from "./pages.mjs";
import { serve } from "./serve.mjs";

const args = process.argv.slice(2);
const label = args.find((a) => !a.startsWith("--") && !a.startsWith("/")) || "before";
const onlyAt = args.indexOf("--only");
const only = onlyAt >= 0 ? args[onlyAt + 1].split(",") : null;
const widths = [375, 768, 1280, 1440];
const port = 8791;
const base = `http://localhost:${port}`;
const axeSource = fs.readFileSync(path.join(root, "node_modules/axe-core/axe.min.js"), "utf8");

const server = await serve(root, port);
const browser = await chromium.launch();
const pages = (only || listPages());
const report = {};
const linkStatus = new Map();

async function checkLink(href) {
  if (linkStatus.has(href)) return linkStatus.get(href);
  const res = await fetch(base + href, { method: "GET" }).catch(() => ({ status: 0 }));
  linkStatus.set(href, res.status);
  return res.status;
}

// Runs in the page: layout checks that apply at every width.
function layoutChecks() {
  const vw = document.documentElement.clientWidth;
  const describe = (el) => {
    const cls = typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${cls}`;
  };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && !el.closest("[hidden], dialog:not([open]), .sr-only, .visually-hidden, .sx-hp");
  };
  const out = { overflow: document.documentElement.scrollWidth - vw, wide: [], splits: [], emptyCards: [], small: [] };

  // Elements poking past the right edge (not inside a scroll container that is meant to scroll).
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) {
      let scroller = el.parentElement;
      let clipped = false;
      while (scroller && scroller !== document.body) {
        const o = getComputedStyle(scroller).overflowX;
        if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") { clipped = true; break; }
        scroller = scroller.parentElement;
      }
      if (!clipped) out.wide.push(`${describe(el)} ${Math.round(r.left)}..${Math.round(r.right)}`);
      else if (o_isHidden(scroller) && el.closest("h1,h2,h3,h4,p,li,a,button,span") && el.textContent.trim()) out.wide.push(`clipped text ${describe(el)} "${el.textContent.trim().slice(0, 40)}"`);
    }
  }
  function o_isHidden(s) { const o = getComputedStyle(s).overflowX; return o === "hidden" || o === "clip"; }
  out.wide = [...new Set(out.wide)].slice(0, 8);

  // Words broken across two lines (a word whose characters land on different lines), ignoring hyphenated words
  // that break at the hyphen and URLs/emails.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let node;
  while ((node = walker.nextNode())) {
    const el = node.parentElement;
    if (!el || !node.textContent.trim() || !visible(el) || el.closest("script, style, svg, code, pre")) continue;
    const re = /[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ'’]{3,}/g;
    let m;
    while ((m = re.exec(node.textContent))) {
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0);
      if (rects.length > 1 && Math.abs(rects[0].top - rects[rects.length - 1].top) > 4) {
        out.splits.push(`"${m[0]}" in ${describe(el)}`);
      }
    }
  }
  out.splits = [...new Set(out.splits)].slice(0, 10);

  // Cards whose content leaves a big empty band at the bottom (fixed heights or stretched grid items).
  for (const card of document.querySelectorAll("[class*='card'], [class*='tile'], [class*='item']")) {
    if (!visible(card) || card.children.length === 0) continue;
    const cs = getComputedStyle(card);
    if (cs.display === "inline" || cs.display === "contents") continue;
    const r = card.getBoundingClientRect();
    if (r.height < 120 || r.width > vw * 0.9) continue;
    let bottom = r.top;
    for (const child of card.children) {
      if (!visible(child) || getComputedStyle(child).position === "absolute") continue;
      bottom = Math.max(bottom, child.getBoundingClientRect().bottom);
    }
    const gap = r.bottom - bottom - parseFloat(cs.paddingBottom) - parseFloat(cs.borderBottomWidth);
    if (gap > 72) out.emptyCards.push(`${describe(card)} ${Math.round(gap)}px empty${cs.height !== "auto" && /height/.test(card.getAttribute("style") || "") ? " (inline height)" : ""}`);
  }
  out.emptyCards = [...new Set(out.emptyCards)].slice(0, 8);

  // Text under 14px (elements with their own text).
  const smallSet = new Map();
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el)) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < 14) {
      const key = `${size.toFixed(1)}px ${describe(el)}`;
      smallSet.set(key, (smallSet.get(key) || 0) + 1);
    }
  }
  out.small = [...smallSet].map(([k, n]) => `${k}${n > 1 ? ` x${n}` : ""}`).slice(0, 12);
  return out;
}

// Runs in the page: structure and content checks.
function contentChecks() {
  const headings = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter((h) => h.getClientRects().length && !h.closest("dialog:not([open])"));
  const levels = headings.map((h) => Number(h.tagName[1]));
  const skips = [];
  levels.forEach((l, i) => { if (i && l > levels[i - 1] + 1) skips.push(`h${levels[i - 1]} -> h${l} "${headings[i].textContent.trim().slice(0, 50)}"`); });
  const minor = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "with", "vs"]);
  const titleCase = headings.filter((h) => {
    const words = h.textContent.trim().replace(/\s+/g, " ").split(" ").filter((w) => /^[A-Za-z]/.test(w));
    if (words.length < 3) return false;
    const rest = words.slice(1).filter((w) => !minor.has(w.toLowerCase()));
    const caps = rest.filter((w) => /^[A-Z][a-z]/.test(w));
    return rest.length >= 2 && caps.length / rest.length >= 0.6;
  }).map((h) => `${h.tagName.toLowerCase()} "${h.textContent.trim().replace(/\s+/g, " ").slice(0, 70)}"`);
  const brInHeadings = headings.filter((h) => h.querySelector("br")).map((h) => `"${h.textContent.trim().slice(0, 50)}"`);

  const text = document.body.innerText;
  const emoji = [...new Set(text.replace(/[©®™]/g, "").match(/[\p{Extended_Pictographic}✓✔✗✘★☆●•·→←]/gu) || [])];
  const emDash = (document.querySelector("main") || document.body).innerText.split("\n").filter((l) => l.includes("—")).map((l) => l.trim().slice(0, 80)).slice(0, 6);
  const iconFont = document.querySelectorAll("i[class*='fa-'], span[class*='fa-'], .fa, .fas, .far, .fab").length;
  const imgs = [...document.querySelectorAll("img")];
  const noAlt = imgs.filter((i) => !i.hasAttribute("alt")).map((i) => i.getAttribute("src"));
  const notLazy = imgs.filter((i) => i.getAttribute("loading") !== "lazy" && i.getBoundingClientRect().top > window.innerHeight * 1.5).map((i) => i.getAttribute("src"));
  const rasterNotModern = imgs.map((i) => i.currentSrc || i.src).filter((s) => /\.(png|jpe?g)(\?|$)/i.test(s) && !/sdg|logo|favicon/i.test(s));
  const meta = (sel, attr = "content") => document.querySelector(sel)?.getAttribute(attr) || null;
  const m = {
    title: document.title,
    description: meta('meta[name="description"]'),
    canonical: meta('link[rel="canonical"]', "href"),
    ogTitle: meta('meta[property="og:title"]'),
    ogDescription: meta('meta[property="og:description"]'),
    ogUrl: meta('meta[property="og:url"]'),
    ogImage: meta('meta[property="og:image"]'),
    twTitle: meta('meta[name="twitter:title"]'),
    twDescription: meta('meta[name="twitter:description"]'),
  };
  const metaIssues = [];
  if (!m.description) metaIssues.push("no meta description");
  if (!m.canonical) metaIssues.push("no canonical");
  if (!m.ogImage) metaIssues.push("no og:image");
  if (m.ogUrl && m.canonical && m.ogUrl !== m.canonical) metaIssues.push(`og:url ${m.ogUrl} != canonical ${m.canonical}`);
  if (m.ogTitle && m.twTitle && m.ogTitle !== m.twTitle) metaIssues.push("og:title differs from twitter:title");
  if (m.ogDescription && m.twDescription && m.ogDescription !== m.twDescription) metaIssues.push("og:description differs from twitter:description");
  if (m.description && m.ogDescription && m.description !== m.ogDescription) metaIssues.push("meta description differs from og:description");
  if (m.description && (m.description.length > 160 || m.description.length < 70)) metaIssues.push(`description length ${m.description.length}`);

  const norm = (el) => (el ? el.outerHTML.replace(/\s+aria-current="[^"]*"/g, "").replace(/\s+class="([^"]*)"/g, (s, c) => ` class="${c.split(/\s+/).filter((x) => !/active|current/.test(x)).join(" ")}"`).replace(/\s+/g, " ") : "");
  const header = document.querySelector("header.site-header, body > header, header");
  const footer = document.querySelector("footer.site-footer, body > footer, footer");
  const navLinks = header ? [...header.querySelectorAll("nav a")].map((a) => a.textContent.trim().replace(/\s+/g, " ")).filter(Boolean) : [];
  const current = header ? [...header.querySelectorAll("[aria-current]")].map((a) => a.textContent.trim()) : [];
  const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter((h) => h.startsWith("/") && !h.startsWith("//")).map((h) => h.split("#")[0]).filter(Boolean);
  const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { const d = JSON.parse(s.textContent); return [].concat(d["@graph"] || d).map((x) => x["@type"]).join(","); } catch (e) { return "INVALID"; } });
  return {
    h1: levels.filter((l) => l === 1).length, skips, titleCase, brInHeadings, emoji, emDash, iconFont, noAlt, notLazy,
    raster: [...new Set(rasterNotModern)], metaIssues, navLinks, current,
    headerHash: norm(header), footerHash: norm(footer), links: [...new Set(links)], jsonld,
  };
}

for (const url of pages) {
  const entry = { widths: {}, errors: [] };
  report[url] = entry;
  for (const width of widths) {
    const phone = width < 800;
    const context = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, isMobile: phone, hasTouch: phone, bypassCSP: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push("js: " + e.message));
    page.on("console", (msg) => { if (msg.type() === "error") errors.push("console: " + msg.text()); });
    page.on("response", (r) => { if (r.url().startsWith(base) && r.status() >= 400 && !r.url().endsWith(url)) errors.push(`http ${r.status()} ${r.url().slice(base.length)}`); });
    await page.goto(base + url, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.classList.add("sx-show-all");
      document.querySelectorAll(".reveal, .animate-on-scroll, .hero-animate, [data-animate]").forEach((el) => el.classList.add("visible", "revealed", "animate-in", "in-view"));
    });
    await page.waitForTimeout(1200);
    await page.evaluate(() => document.getAnimations().forEach((a) => { try { a.finish(); } catch (e) { /* ignore */ } }));
    const w = await page.evaluate(layoutChecks);

    if (width === 1280 || width === 375) {
      const c = await page.evaluate(contentChecks);
      await page.addScriptTag({ content: axeSource });
      c.axe = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ["violations"] })).violations.map((v) => `${v.id} [${v.impact}] x${v.nodes.length}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`));
      // Focus styles: tab through the first focusable elements and check something visible changes.
      c.noFocusStyle = [];
      for (let i = 0; i < 12; i += 1) {
        await page.keyboard.press("Tab");
        const r = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== "none");
          return ring ? null : `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}"`;
        });
        if (r) c.noFocusStyle.push(r);
      }
      if (phone) {
        c.menu = await page.evaluate(async () => {
          const toggle = document.querySelector(".nav-toggle, .menu-toggle, [aria-controls][aria-expanded]");
          if (!toggle) return "no menu toggle";
          const tr = toggle.getBoundingClientRect();
          if (!tr.width) return "toggle hidden at 375";
          toggle.click();
          await new Promise((r) => setTimeout(r, 450));
          const menu = document.getElementById(toggle.getAttribute("aria-controls"));
          const open = toggle.getAttribute("aria-expanded") === "true";
          const links = menu ? [...menu.querySelectorAll("a")].filter((a) => a.getBoundingClientRect().height > 0) : [];
          const offscreen = links.filter((a) => { const r = a.getBoundingClientRect(); return r.right > innerWidth || r.left < 0; }).length;
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
          await new Promise((r) => setTimeout(r, 450));
          const closed = toggle.getAttribute("aria-expanded") === "false";
          return `${open ? "opens" : "DOES NOT OPEN"}, ${links.length} links visible${offscreen ? `, ${offscreen} off screen` : ""}, ${closed ? "Escape closes" : "Escape DOES NOT close"}`;
        });
      }
      const bad = [];
      for (const href of c.links) { const s = await checkLink(href); if (s >= 400 || s === 0) bad.push(`${href} (${s})`); }
      c.brokenLinks = bad;
      delete c.links;
      entry[width === 1280 ? "desktop" : "phone"] = c;
    }
    entry.widths[width] = w;
    entry.errors.push(...errors.map((e) => `@${width} ${e}`));
    await context.close();
  }
  entry.errors = [...new Set(entry.errors.map((e) => e.replace(/^@\d+ /, "")))];
  process.stdout.write(`${url} `);
}
await browser.close();
server.close();

// Header and footer consistency: group pages by normalised markup.
const groups = (key) => {
  const g = {};
  for (const [url, e] of Object.entries(report)) {
    if (!e.desktop) continue;
    const h = createHash("sha1").update(e.desktop[key]).digest("hex").slice(0, 8);
    (g[h] = g[h] || []).push(url);
  }
  return g;
};
const summary = { headers: groups("headerHash"), footers: groups("footerHash") };
for (const e of Object.values(report)) for (const k of ["desktop", "phone"]) if (e[k]) { delete e[k].headerHash; delete e[k].footerHash; }
fs.mkdirSync(path.join(root, "audit"), { recursive: true });
fs.writeFileSync(path.join(root, "audit", `${label}.json`), JSON.stringify({ summary, report }, null, 1));
console.log(`\nwrote audit/${label}.json`);
