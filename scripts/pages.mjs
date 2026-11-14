// The public pages to audit: every URL in sitemap.xml, plus any other HTML page in the repository that is not a
// redirect stub or a partial (so pages missing from the sitemap are still checked).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function listPages() {
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const fromSitemap = [...sitemap.matchAll(/<loc>https:\/\/www\.selnexahealth\.com(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
  const extra = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const rel = dir ? `${dir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (["blog", "resources", "services", "solutions"].includes(rel)) walk(rel);
        continue;
      }
      if (!entry.name.endsWith(".html")) continue;
      const html = fs.readFileSync(path.join(root, rel), "utf8");
      if (html.includes('http-equiv="refresh"')) continue;
      const canonical = (html.match(/<link rel="canonical" href="https:\/\/www\.selnexahealth\.com(\/[^"]*)"/) || [])[1];
      const url = canonical || `/${rel}`;
      if (!fromSitemap.includes(url)) extra.push(url);
    }
  };
  walk("");
  return [...fromSitemap, ...extra.filter((u, i, a) => a.indexOf(u) === i)];
}

// A file-system-safe name for a URL path.
export const slug = (url) => (url === "/" ? "home" : url.replace(/^\/|\/$/g, "").replace(/[/.]/g, "_"));
