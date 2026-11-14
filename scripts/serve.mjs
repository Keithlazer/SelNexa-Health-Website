// A small static server that resolves paths the way GitHub Pages does: /page serves page.html, /dir/ serves
// dir/index.html, and unknown paths get 404.html. Used by the screenshot and audit scripts.
//   import { serve } from "./serve.mjs"; const server = await serve(rootDir, 8765); ... server.close();
//   node scripts/serve.mjs [port]   (serves the repository root)
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif",
  ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2", ".mp4": "video/mp4", ".pdf": "application/pdf",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
};

export function serve(root, port) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const full = path.join(root, urlPath);
    const candidates = urlPath.endsWith("/") ? [path.join(full, "index.html")] : [full, `${full}.html`, path.join(full, "index.html")];
    let file = candidates.find((c) => c.startsWith(root) && fs.existsSync(c) && fs.statSync(c).isFile());
    let status = 200;
    if (!file) {
      file = path.join(root, "404.html");
      status = 404;
    }
    res.writeHead(status, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const port = Number(process.argv[2] || 8765);
  await serve(root, port);
  console.log(`serving ${root} on http://localhost:${port}`);
}
