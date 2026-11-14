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
// and design-system.css, named by a hash of its content. One request instead of five or six, and no @import chains.
// Rules that match nothing in the pages using the bundle, the scripts or the partials are dropped (PurgeCSS).
// The page stylesheets (main.css, site-uniform.css and the rest) go inside one cascade layer, "legacy". Unlayered
// rules beat layered ones whatever their specificity, so the shared files below, and design-system.css above all,
// set the look without fighting old selectors like `.section-header h2`. @font-face rules are moved out of the layer.
const SHARED_STYLES = ["styles/site-chrome.css", "styles/design-system.css"];
const BUNDLE_DIR = "styles/bundles";
const bundles = new Map();

function concatStyles(list, pages) {
  const pageFiles = list.split(/\s+/).filter(Boolean).map((p) => p.replace(/^\//, ""));
  const files = [...pageFiles, ...SHARED_STYLES];
  const fontFaces = [];
  const wrap = (rel, css) => {
    if (!pageFiles.includes(rel)) return css;
    const body = css.replace(/@font-face\s*\{[^}]*\}\s*/g, (m) => { fontFaces.push(m.trim()); return ""; });
    return `@layer legacy {\n${body}\n}`;
  };
  const text = files.map((rel) => {
    let css = fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n");
    // Pages list site-uniform.css themselves, after these files, so the old import is redundant.
    css = css.replace(/^@import url\(['"]?\/styles\/site-uniform\.css['"]?\);[ \t]*\n/m, "");
    if (/@import/.test(css)) throw new Error(`${pages[0]}: ${rel} uses @import, which a bundle cannot keep`);
    for (const m of css.matchAll(/url\(\s*([^)]*?)\s*\)/g)) {
      const target = m[1].replace(/^['"]|['"]$/g, "");
      if (!/^(data:|\/|https?:|#)/.test(target)) throw new Error(`${pages[0]}: ${rel} has a relative url(${target}), which would break in a bundle`);
    }
    return `/* ---- ${rel} ---- */\n${wrap(rel, css.trim())}\n`;
  }).join("\n");
  return { files, text: `${[...new Set(fontFaces)].join("\n")}\n${text}` };
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

// The About page team cards, built from data/team.json so names, roles and bios are kept in one place.
const escapeHtml = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function renderTeam() {
  const { team } = JSON.parse(fs.readFileSync(path.join(root, "data", "team.json"), "utf8"));
  return team.map((p) => {
    const photo = `/assets/team/${p.photo}`;
    const lines = [
      '<div class="team-card animate-on-scroll">',
      '  <div class="team-photo-wrap">',
      `    <picture><source type="image/webp" srcset="${photo}-320.webp 320w, ${photo}-640.webp 640w" sizes="(max-width: 917px) 242px, (max-width: 1235px) 27vw, 326px"><img src="${photo}-320.png" alt="${escapeHtml(`${p.name}, ${p.role} at SelNexa Health`)}" class="team-photo" width="320" height="320" loading="lazy" decoding="async"></picture>`,
      '    <div class="team-photo-ring"></div>',
      "  </div>",
      `  <h3>${escapeHtml(p.name)}</h3>`,
      `  <p class="team-role">${escapeHtml(p.role)}</p>`,
    ];
    if (p.focus) lines.push(`  <p class="team-role">${escapeHtml(p.focus)}</p>`);
    lines.push(`  <p class="team-bio">${escapeHtml(p.bio)}</p>`);
    if (p.note) lines.push(`  <p class="team-leadership-note">${escapeHtml(p.note)}</p>`);
    if (p.linkedin) lines.push(`  <p><a class="standalone-link" href="${escapeHtml(p.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn Profile →</a></p>`);
    lines.push("</div>");
    return lines.join("\n");
  }).join("\n\n");
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
  "trace-divider": () => read("trace-divider.html"),
  "sdg-note": () => read("sdg-note.html"),
  team: () => renderTeam(),
  faqpage: (page, html) => renderFaqPage(page, html),
  "blog-list": () => renderBlogList(),
  "blog-strip": () => renderBlogStrip(),
  share: (page, html) => renderShare(page, html),
};

// ---------- Blog ----------
// data/posts.json lists the posts, newest first. Reading time is worked out from each post's .article-body text at
// 220 words a minute, and stamped into the post's own byline wherever it has <!-- read-time -->…<!-- /read-time -->.
const SPRITE = "/assets/icons/sprite.svg";
const posts = JSON.parse(fs.readFileSync(path.join(root, "data", "posts.json"), "utf8")).posts;
function readingMinutes(url) {
  const file = path.join(root, url.replace(/^\//, ""));
  const html = fs.readFileSync(file, "utf8");
  const start = html.indexOf('class="article-measure article-body"');
  if (start < 0) throw new Error(`${url}: no .article-body to time`);
  const end = html.indexOf('class="article-discuss', start);
  const words = html.slice(start, end > 0 ? end : undefined).replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ")
    .split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  return Math.max(1, Math.round(words / 220));
}
const longDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
function postMeta(p) {
  return `<p class="ds-post__meta"><time datetime="${p.date}">${longDate(p.date)}</time><span>${readingMinutes(p.url)} min read</span></p>`;
}
function postCover(p, featured) {
  if (!p.cover) return "";
  const c = p.cover;
  const img = `<img src="${c.src}" alt="${escapeHtml(c.alt || "")}" width="${c.width}" height="${c.height}"${featured ? "" : ' loading="lazy"'} decoding="async">`;
  return `<a class="ds-post__cover ds-post__cover--${c.kind}" href="${p.url}" tabindex="-1" aria-hidden="true">${img}</a>`;
}
function postCard(p, { featured = false, heading = "h3" } = {}) {
  return [
    `<article class="ds-post${featured ? " ds-post--featured" : ""}">`,
    `  ${postCover(p, featured)}`,
    '  <div class="ds-post__body">',
    p.label ? `    <p class="ds-eyebrow">${escapeHtml(p.label)}</p>` : "",
    `    <${heading} class="ds-post__title"><a href="${p.url}">${escapeHtml(p.title)}</a></${heading}>`,
    `    ${postMeta(p)}`,
    `    <p>${escapeHtml(p.summary)}</p>`,
    `    <a class="ds-link ds-link--arrow" href="${p.url}">Read the article<span class="sr-only">: ${escapeHtml(p.title)}</span></a>`,
    "  </div>",
    "</article>",
  ].filter(Boolean).join("\n");
}
function renderBlogList() {
  if (!posts.length) {
    return '<div class="ds-empty"><h2>No articles yet</h2><p>The first article is on its way. <a href="/#updates">Follow the build</a> to hear when it is published.</p></div>';
  }
  const [first, ...rest] = posts;
  const out = [postCard(first, { featured: true, heading: "h2" })];
  out.push('<h2 class="ds-blog__more">More articles</h2>');
  if (rest.length) out.push('<div class="ds-grid ds-blog__grid">', ...rest.map((p) => postCard(p)), "</div>");
  else out.push('<div class="ds-empty"><p>More articles are on the way. <a href="/#updates">Follow the build</a> to hear when the next one is published.</p></div>');
  return out.join("\n");
}
function renderBlogStrip() {
  const latest = posts.slice(0, 3);
  if (!latest.length) return "";
  return [
    '<section class="ds-section ds-section--white" id="from-the-blog" aria-labelledby="blog-strip-title">',
    '  <div class="ds-container">',
    '    <div class="ds-section-head ds-section-head--split">',
    '      <div>',
    '        <p class="ds-eyebrow">From the blog</p>',
    '        <h2 id="blog-strip-title">Notes from the build</h2>',
    "      </div>",
    '      <a class="ds-link ds-link--arrow" href="/blog.html">All articles</a>',
    "    </div>",
    `    <div class="ds-grid${latest.length === 1 ? " ds-blog__single" : ""}">`,
    ...latest.map((p) => postCard(p, { featured: latest.length === 1 })),
    "    </div>",
    "  </div>",
    "</section>",
  ].join("\n");
}
// Share links for a post, built from its canonical URL and its <h1>.
function renderShare(page, html) {
  const url = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const title = ((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "").replace(/<[^>]+>/g, "").trim();
  if (!url || !title) throw new Error(`${page}: share links need a canonical URL and an h1`);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const link = (href, icon, label, track) =>
    `  <a class="ds-share__link" href="${href}" target="_blank" rel="noopener noreferrer" data-track="${track}"><svg class="ds-i" aria-hidden="true" focusable="false"><use href="${SPRITE}#${icon}-line"></use></svg>${label}</a>`;
  return [
    '<div class="ds-share" aria-label="Share this article" role="group">',
    '  <p class="ds-share__label">Share</p>',
    link(`https://www.linkedin.com/sharing/share-offsite/?url=${u}`, "linkedin-logo", "LinkedIn", "share_linkedin"),
    link(`https://x.com/intent/post?url=${u}&amp;text=${t}`, "x-logo", "X", "share_x"),
    link(`https://wa.me/?text=${t}%20${u}`, "whatsapp-logo", "WhatsApp", "share_whatsapp"),
    `  <button type="button" class="ds-share__link" data-copy-link="${url}"><svg class="ds-i" aria-hidden="true" focusable="false"><use href="${SPRITE}#link-line"></use></svg>Copy link</button>`,
    '  <span class="ds-share__status" role="status" aria-live="polite"></span>',
    "</div>",
  ].join("\n");
}
// Sections alternate cream and white down each page. The build sets ds-section--cream or ds-section--white on every
// top-level <section> in <main>, skipping heroes and navy bands, so a page never stacks two of the same.
const SURFACE_SKIP = /\b(hero|page-hero|solution-hero|guides-hero|webinars-hero|resources-hero|ds-band--navy|ds-cta|top-banner)\b/;
function alternateSurfaces(html) {
  const start = html.indexOf("<main");
  const end = html.indexOf("</main>", start);
  if (start < 0 || end < 0) return html;
  let main = html.slice(start, end);
  let depth = 0;
  let n = 0;
  let inArticle = 0; // sections inside an <article> (a blog post's own parts) are left alone
  main = main.replace(/<article\b[^>]*>|<\/article>|<section\b([^>]*)>|<\/section>/g, (tag, attrs) => {
    if (tag.startsWith("<article")) { inArticle += 1; return tag; }
    if (tag === "</article>") { inArticle -= 1; return tag; }
    if (tag === "</section>") { depth -= 1; return tag; }
    depth += 1;
    if (depth !== 1 || inArticle) return tag;
    const cls = (attrs.match(/class="([^"]*)"/) || [])[1] || "";
    if (SURFACE_SKIP.test(cls)) return tag;
    const surface = n++ % 2 === 0 ? "ds-section--cream" : "ds-section--white";
    const next = `${cls.replace(/\s*\bds-section--(cream|white)\b/g, "").trim()} ${surface}`.trim();
    return /class="/.test(attrs) ? tag.replace(/class="[^"]*"/, `class="${next}"`) : tag.replace("<section", `<section class="${next}"`);
  });
  return html.slice(0, start) + main + html.slice(end);
}

function stampReadTime(page, html) {
  if (!html.includes("<!-- read-time -->")) return html;
  const minutes = readingMinutes(`/${page}`);
  return html.replace(/<!-- read-time -->[\s\S]*?<!-- \/read-time -->/g, `<!-- read-time -->${minutes} min read<!-- /read-time -->`);
}

// FAQPage structured data, built from the page's own accordion so the two always say the same thing. Each question
// is a <details> in .ds-faq: the <summary> heading is the question and .ds-faq__answer is the answer.
function renderFaqPage(page, html) {
  const text = (s) => s.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").replace(/ ([.,;:])/g, "$1").trim();
  const items = [...html.matchAll(/<details[^>]*>\s*<summary[^>]*>\s*<h[23][^>]*>([\s\S]*?)<\/h[23]>[\s\S]*?<\/summary>\s*<div class="ds-faq__answer">([\s\S]*?)<\/div>\s*<\/details>/g)];
  if (!items.length) throw new Error(`${page}: has <!-- sx:faqpage --> but no .ds-faq questions`);
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([, q, a]) => ({ "@type": "Question", name: text(q), acceptedAnswer: { "@type": "Answer", text: text(a) } })),
  };
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
}

// Which top-level nav item each page belongs to.
function sectionFor(page) {
  if (page === "features.html" || page.startsWith("solutions/") || page === "pricing.html" || page === "telemedicine.html") return "platform";
  if (page.startsWith("services/")) return "services";
  if (page === "projects.html") return "projects";
  if (page === "case-studies.html" || page === "impact.html") return "impact";
  if (page === "about.html" || page === "careers.html" || page === "press.html" || page === "faq.html") return "about";
  if (page === "blog.html" || page.startsWith("blog/")) return "blog";
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

// Figures shown on several pages live once in data/facts.json. A page marks each use inline as
//   <!-- fact:sync_target -->95%<!-- /fact -->
// and the build fills in the current value, so a figure can only be changed in one place.
const facts = JSON.parse(fs.readFileSync(path.join(root, "data", "facts.json"), "utf8"));
function stampFacts(page, html) {
  return html.replace(/<!-- fact:([a-z_]+) -->[\s\S]*?<!-- \/fact -->/g, (m, key) => {
    if (!(key in facts) || key.startsWith("_")) throw new Error(`${page}: unknown fact "${key}" (add it to data/facts.json)`);
    return `<!-- fact:${key} -->${facts[key]}<!-- /fact -->`;
  });
}
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
  html = stampFacts(page, html);
  html = stampReadTime(page, html);
  html = alternateSurfaces(html);
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
