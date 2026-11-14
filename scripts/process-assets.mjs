// Turns design files dropped into design-assets/incoming/ into site-ready assets.
//   node scripts/process-assets.mjs            process everything in incoming/
//   node scripts/process-assets.mjs --dry-run  say what would be written
//
// Names become kebab-case ("Blog Cover - Offline First.png" -> blog-cover-offline-first).
// - SVG files are optimised with SVGO and written to assets/illustrations/<name>.svg.
// - Raster files (PNG, JPEG, WebP, TIFF) are treated as 2x artwork. Each is written to assets/img/ at 2x (its own
//   width) and 1x (half width), as WebP and AVIF: <name>-1x.webp, <name>-2x.webp, <name>-1x.avif, <name>-2x.avif.
//   Put illustrations in incoming/illustrations/ to send their raster versions to assets/illustrations/ instead.
// - Files in incoming/icons/, and files named after a SelNexa site icon, are skipped: site icons come only from the sprite (assets/icons/sprite.svg, built from
//   design-assets/icons/ by tools/build-icons.mjs), never from a single exported icon file.
// The incoming files are left in place; delete them once the output is committed.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { optimize } from "svgo";
import { root } from "./pages.mjs";

const dry = process.argv.includes("--dry-run");
const incoming = path.join(root, "design-assets", "incoming");
const kebab = (name) => name.toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const out = [];
const siteIcons = new Set([...fs.readFileSync(path.join(root, "design-assets", "icons", "selnexa", "selnexa-icons-sprite.svg"), "utf8")
  .matchAll(/<symbol id="([a-z0-9-]+)"/g)].map((m) => m[1]));

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

for (const file of walk(incoming)) {
  const rel = path.relative(incoming, file).replace(/\\/g, "/");
  const ext = path.extname(file).toLowerCase();
  const name = kebab(path.basename(file));
  if (rel.startsWith("icons/") || siteIcons.has(name) || name === "selnexa-icons-sprite") {
    console.log(`skip ${rel}: site icons come from the sprite, see design-assets/icons/selnexa/`);
    continue;
  }
  if (rel === ".gitkeep" || rel.endsWith("README.md")) continue;
  const illustration = rel.startsWith("illustrations/");
  if (ext === ".svg") {
    const target = path.join(root, "assets", "illustrations", `${name}.svg`);
    const { data } = optimize(fs.readFileSync(file, "utf8"), { multipass: true, plugins: ["preset-default", "removeDimensions"] });
    out.push([target, Buffer.from(data)]);
    continue;
  }
  if (![".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"].includes(ext)) { console.log(`skip ${rel}: not an image`); continue; }
  const dir = path.join(root, "assets", illustration ? "illustrations" : "img");
  const meta = await sharp(file).metadata();
  for (const [scale, width] of [["2x", meta.width], ["1x", Math.round(meta.width / 2)]]) {
    const base = sharp(file).resize({ width, withoutEnlargement: true });
    out.push([path.join(dir, `${name}-${scale}.webp`), await base.clone().webp({ quality: 82, effort: 6 }).toBuffer()]);
    out.push([path.join(dir, `${name}-${scale}.avif`), await base.clone().avif({ quality: 55, effort: 6 }).toBuffer()]);
  }
}

for (const [target, data] of out) {
  console.log(`${dry ? "would write" : "write"} ${path.relative(root, target).replace(/\\/g, "/")} (${Math.round(data.length / 1024)} KB)`);
  if (!dry) { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, data); }
}
if (!out.length) console.log("nothing to process in design-assets/incoming/");
