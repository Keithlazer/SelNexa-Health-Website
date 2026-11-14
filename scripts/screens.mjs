// Full-page screenshots of every public page at 375, 768, 1280 and 1440px.
//   node scripts/screens.mjs before     -> audit/before/<page>@<width>.png
//   node scripts/screens.mjs after      -> audit/after/<page>@<width>.png
// Serves the repository itself (GitHub Pages path rules) on a local port; needs `npx playwright install chromium`.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { listPages, root, slug } from "./pages.mjs";
import { serve } from "./serve.mjs";

const label = process.argv[2] || "before";
const widths = [375, 768, 1280, 1440];
const outDir = path.join(root, "audit", label);
fs.mkdirSync(outDir, { recursive: true });

const port = 8790;
const server = await serve(root, port);
const browser = await chromium.launch();
const pages = listPages();
let count = 0;
for (const url of pages) {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}${url}`, { waitUntil: "networkidle" });
    // Show scroll-revealed content and lay out every section, so the screenshot shows the whole page as read.
    await page.evaluate(() => {
      document.documentElement.classList.add("sx-show-all");
      document.querySelectorAll(".reveal, .animate-on-scroll, .hero-animate, [data-animate]").forEach((el) => el.classList.add("visible", "revealed", "animate-in", "in-view"));
      document.getAnimations().forEach((a) => { try { a.finish(); } catch (e) { /* ignore */ } });
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${slug(url)}@${width}.png`), fullPage: true });
    await context.close();
    count += 1;
  }
  process.stdout.write(`${url} `);
}
await browser.close();
server.close();
console.log(`\n${count} screenshots in audit/${label}/`);
