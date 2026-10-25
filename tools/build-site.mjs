#!/usr/bin/env node
// Stamps the shared partials in /includes into every page, between marker comments such as
//   <!-- sx:header --> ... <!-- /sx:header -->
// The output is committed, so GitHub Pages serves complete HTML and nothing depends on JavaScript.
//
//   node tools/build-site.mjs           update every page
//   node tools/build-site.mjs --check   exit with code 1 if any page is out of date
//
// Edit the files in /includes, never the stamped copies in the pages.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PurgeCSS } from "purgecss";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const includes = path.join(root, "includes");
const checkOnly = process.argv.includes("--check");

// {{v:path/to/file}} in a partial becomes a short hash of that file, so a changed script or stylesheet
// gets a new URL and the service worker cannot pair new HTML with an old cached copy.
const hashes = new Map();
function version(rel) {
  if (!hashes.has(rel)) {
    const text = fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n");
    hashes.set(rel, crypto.createHash("sha256").update(text).digest("hex").slice(0, 10));
  }
  return hashes.get(rel);
}

const read = (name) =>
  fs.readFileSync(path.join(includes, name), "utf8")
    .replace(/\r\n/g, "\n")
    .trimEnd()
    .replace(/\{\{v:([^}]+)\}\}/g, (m, rel) => version(rel));

// Open Graph and Twitter tags, built from the page's own <title>, meta description and canonical URL so they
// cannot drift apart. Blog posts are "article", everything else "website".
const SOCIAL_IMAGE = "https://www.selnexahealth.com/og-image.png";
function social(page, html) {
  const pick = (re) => ((html.match(re) || [])[1] || "").replace(/"/g, "&quot;");
  const title = pick(/<title>([^<]*)<\/title>/);
  const description = pick(/<meta name="description" content="([^"]*)"/);
  const url = pick(/<link rel="canonical" href="([^"]*)"/);
  if (!title || !description || !url) throw new Error(`${page}: social tags need a <title>, a meta description and a canonical link`);
  return [
    `<meta property="og:type" content="${page.startsWith("blog/") ? "article" : "website"}">`,
    '<meta property="og:site_name" content="SelNexa Health">',
    '<meta property="og:locale" content="en_GB">',
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${SOCIAL_IMAGE}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    "<meta property=\"og:image:alt\" content=\"SelNexa Health: health service management that keeps working when the network doesn't.\">",
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${SOCIAL_IMAGE}">`,
  ].join("\n");
}

// Stylesheet bundles. Each page lists its own stylesheets in the opening marker,
//   <!-- sx:styles /styles/main.css /styles/site-uniform.css --> ... <!-- /sx:styles -->
// and gets one <link> to a file in styles/bundles/ holding those files followed by the shared site-chrome.css
// and icons.css, named by a hash of its content. One request instead of five or six, and no @import chains.
// Rules that match nothing in the pages using the bundle, the scripts or the partials are dropped (PurgeCSS).
const SHARED_STYLES = ["styles/site-chrome.css", "styles/icons.css"];
const BUNDLE_DIR = "styles/bundles";
const bundles = new Map();

function concatStyles(list, pages) {
  const files = [...list.split(/\s+/).filter(Boolean).map((p) => p.replace(/^\//, "")), ...SHARED_STYLES];
  const text = files.map((rel) => {
    let css = fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n");
    // Pages list site-uniform.css themselves, after these files, so the old import is redundant.
    css = css.replace(/^@import url\(['"]?\/styles\/site-uniform\.css['"]?\);[ \t]*\n/m, "");
    if (/@import/.test(css)) throw new Error(`${pages[0]}: ${rel} uses @import, which a bundle cannot keep`);
    for (const m of css.matchAll(/url\(\s*([^)]*?)\s*\)/g)) {
      const target = m[1].replace(/^['"]|['"]$/g, "");
      if (!/^(data:|\/|https?:|#)/.test(target)) throw new Error(`${pages[0]}: ${rel} has a relative url(${target}), which would break in a bundle`);
    }
    return `/* ---- ${rel} ---- */\n${css.trim()}\n`;
  }).join("\n");
  return { files, text };
}

// Class and attribute names that scripts add at run time, so they never appear in the HTML.
const SAFELIST = {
  standard: [/^is-/, /^has-/, /^sx-/, "visible", "revealed", "animate-in", "in-view", "active", "hidden", "open", "show", "reveal", "animate-on-scroll"],
  greedy: [/\[/],
};
const scriptsAndPartials = [
  ...fs.readdirSync(path.join(root, "js")).filter((f) => f.endsWith(".js")).map((f) => ({ raw: fs.readFileSync(path.join(root, "js", f), "utf8"), extension: "js" })),
  ...fs.readdirSync(includes).filter((f) => f.endsWith(".html")).map((f) => ({ raw: fs.readFileSync(path.join(includes, f), "utf8"), extension: "html" })),
];
async function buildBundle(list, pages, htmlByPage) {
  const { files, text } = concatStyles(list, pages);
  // SX_NO_PURGE=1 keeps every rule (used to check that purging changes nothing visible).
  const [purged] = process.env.SX_NO_PURGE ? [{ css: text }] : await new PurgeCSS().purge({
    content: [...pages.map((p) => ({ raw: htmlByPage.get(p), extension: "html" })), ...scriptsAndPartials],
    css: [{ raw: text }],
    safelist: SAFELIST,
    fontFace: false,
    keyframes: false,
    variables: false,
  });
  const body = `/* Generated by tools/build-site.mjs from ${files.join(", ")}, without rules no page using it matches. Edit those files, not this one. */\n${purged.css.trim()}\n`;
  const name = `${BUNDLE_DIR}/${crypto.createHash("sha256").update(body).digest("hex").slice(0, 12)}.css`;
  bundles.set(name, body);
  return name;
}

const PARTIALS = {
  csp: () => read("csp.html"),
  social: (page, html) => social(page, html),
  head: () => read("head.html"),
  "skip-link": () => read("skip-link.html"),
  header: (page) => markCurrent(read("site-header.html"), page),
  footer: () => read("site-footer.html"),
  "demo-modal": () => read("demo-modal.html").replace("{{demo-form}}", read("demo-form.html")),
  "demo-form": () => read("demo-form.html"),
  "contact-form": () => read("contact-form.html"),
  scripts: () => read("scripts.html"),
};

// Which top-level nav item each page belongs to.
function sectionFor(page) {
  if (page === "features.html" || page.startsWith("solutions/") || page === "pricing.html" || page === "telemedicine.html" || page === "faq.html") return "platform";
  if (page.startsWith("services/")) return "services";
  if (page === "projects.html") return "projects";
  if (page === "case-studies.html" || page === "impact.html") return "impact";
  if (page === "about.html" || page === "careers.html" || page === "press.html") return "about";
  if (page === "contact.html") return "contact";
  if (page === "appointments.html") return "demo";
  return null;
}

function markCurrent(html, page) {
  const section = sectionFor(page);
  if (!section) return html;
  return html.replace(new RegExp(`(<a [^>]*data-nav="${section}")`), '$1 aria-current="page"');
}

function listPages() {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const rel = dir ? `${dir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (["blog", "resources", "services", "solutions"].includes(rel)) walk(rel);
        continue;
      }
      if (entry.name.endsWith(".html")) out.push(rel);
    }
  };
  walk("");
  return out.sort();
}

let stale = 0;
let updated = 0;
const STYLES_RE = /^([ \t]*)<!-- sx:styles ([^>]*?) -->[\s\S]*?<!-- \/sx:styles -->/m;
const pageStates = [];
const htmlByPage = new Map();
const groups = new Map(); // stylesheet list -> pages using it

// 1. Stamp the partials into every page.
for (const page of listPages()) {
  const file = path.join(root, page);
  const original = fs.readFileSync(file, "utf8");
  if (!original.includes("<!-- sx:")) continue;
  const eol = original.includes("\r\n") ? "\r\n" : "\n";
  let html = original.replace(/\r\n/g, "\n");
  if (html.includes("<!-- sx:head -->") && !/<!-- sx:styles [^>]+-->/.test(html)) {
    throw new Error(`${page}: has the shared head but no <!-- sx:styles ... --> marker, so it would miss site-chrome.css`);
  }
  for (const [name, render] of Object.entries(PARTIALS)) {
    const re = new RegExp(`^([ \\t]*)(<!-- sx:${name} -->)[\\s\\S]*?(<!-- /sx:${name} -->)`, "gm");
    if (!re.test(html)) continue;
    const content = render(page, html);
    // Indent the partial to match its marker, leaving blank lines empty.
    html = html.replace(re, (m, indent, open, close) => {
      const body = content.split("\n").map((line) => (line ? indent + line : line)).join("\n");
      return `${indent}${open}\n${body}\n${indent}${close}`;
    });
  }
  const styles = html.match(STYLES_RE);
  if (styles) {
    const list = styles[2].trim();
    if (!groups.has(list)) groups.set(list, []);
    groups.get(list).push(page);
  }
  htmlByPage.set(page, html);
  pageStates.push({ page, file, original, eol });
}

// 2. One purged bundle per distinct stylesheet list.
const bundleFor = new Map();
for (const [list, pages] of groups) bundleFor.set(list, await buildBundle(list, pages, htmlByPage));

// 3. Link each page to its bundle and write what changed.
for (const { page, file, original, eol } of pageStates) {
  let html = htmlByPage.get(page).replace(STYLES_RE, (m, indent, list) =>
    `${indent}<!-- sx:styles ${list.trim()} -->\n${indent}<link rel="stylesheet" href="/${bundleFor.get(list.trim())}">\n${indent}<!-- /sx:styles -->`);
  html = html.replace(/\n/g, eol);
  if (html !== original) {
    if (checkOnly) {
      console.log(`out of date: ${page}`);
      stale += 1;
    } else {
      fs.writeFileSync(file, html);
      updated += 1;
    }
  }
}

// Write bundles that changed and remove bundles no page uses any more.
const bundleDir = path.join(root, BUNDLE_DIR);
if (!checkOnly) fs.mkdirSync(bundleDir, { recursive: true });
let bundlesWritten = 0;
for (const [name, body] of bundles) {
  const file = path.join(root, name);
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null;
  if (current === body) continue;
  if (checkOnly) {
    console.log(`out of date: ${name}`);
    stale += 1;
  } else {
    fs.writeFileSync(file, body);
    bundlesWritten += 1;
  }
}
for (const f of fs.existsSync(bundleDir) ? fs.readdirSync(bundleDir) : []) {
  const name = `${BUNDLE_DIR}/${f}`;
  if (bundles.has(name)) continue;
  if (checkOnly) {
    console.log(`unused: ${name}`);
    stale += 1;
  } else {
    fs.unlinkSync(path.join(bundleDir, f));
  }
}

if (checkOnly) {
  if (stale) {
    console.log(`${stale} file(s) need "node tools/build-site.mjs"`);
    process.exit(1);
  }
  console.log(`all pages up to date (${bundles.size} stylesheet bundles)`);
} else {
  console.log(`updated ${updated} page(s); ${bundles.size} stylesheet bundles, ${bundlesWritten} written`);
}
