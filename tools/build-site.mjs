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

const PARTIALS = {
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
        if (["blog", "resources", "solutions"].includes(rel)) walk(rel);
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
for (const page of listPages()) {
  const file = path.join(root, page);
  const original = fs.readFileSync(file, "utf8");
  if (!original.includes("<!-- sx:")) continue;
  const eol = original.includes("\r\n") ? "\r\n" : "\n";
  let html = original.replace(/\r\n/g, "\n");
  for (const [name, render] of Object.entries(PARTIALS)) {
    const re = new RegExp(`^([ \\t]*)(<!-- sx:${name} -->)[\\s\\S]*?(<!-- /sx:${name} -->)`, "gm");
    if (!re.test(html)) continue;
    const content = render(page);
    // Indent the partial to match its marker, leaving blank lines empty.
    html = html.replace(re, (m, indent, open, close) => {
      const body = content.split("\n").map((line) => (line ? indent + line : line)).join("\n");
      return `${indent}${open}\n${body}\n${indent}${close}`;
    });
  }
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

if (checkOnly) {
  if (stale) {
    console.log(`${stale} page(s) need "node tools/build-site.mjs"`);
    process.exit(1);
  }
  console.log("all pages up to date");
} else {
  console.log(`updated ${updated} page(s)`);
}
