# SelNexa Health website

Source for www.selnexahealth.com, a static site served by GitHub Pages from the `main` branch.

## Layout

| Path | What it holds |
|---|---|
| `*.html`, `blog/`, `resources/`, `solutions/` | The pages. Plain HTML, committed complete. |
| `includes/` | Header, footer, forms and shared `<head>` tags, written once and copied into every page. See `includes/README.md`. |
| `styles/` | Source stylesheets. `styles/bundles/` is generated: one file per set of stylesheets, without unused rules. |
| `css/` | Stylesheets for the blog and resources pages. |
| `js/` | `site-core.js` (header, modal, forms, widgets), `form-endpoints.js`, and small page scripts. |
| `assets/` | Images, fonts, videos and the pitch deck. |
| `tools/` | `build-site.mjs` (copies the shared parts in, builds the stylesheet bundles), `build-icons.py` (icon font subset), `cloudflare-wishlist-relay.js` (optional form relay). |
| `docs/` | Notes on the form relay, analytics, search visibility and link outreach. |
| `sw.js`, `offline.html`, `manifest.json` | Offline support. |

`_config.yml` lists the files GitHub Pages does not publish (internal documents and tooling). The repository is public, so excluded files are still visible on GitHub.

## Editing

After changing anything in `includes/`, `styles/`, `css/` or `js/`:

```
npm install
npm run build:site
npm run check:site
```

Commit the pages and `styles/bundles/` that the build changes. `check:site` exits with an error if any page or bundle is out of date.

To preview, serve the folder with any static server, for example `python -m http.server 8000`, and open http://localhost:8000. Pages use root-relative links, so serve from the repository root.

The Content Security Policy (`includes/csp.html`) allows scripts, styles, fonts and images from this site only. Inline `<script>`, `<style>` and `style=""` attributes are blocked, so put code in a file. If a form endpoint is set in `js/form-endpoints.js`, add its origin to `connect-src`.

## Content rules

`AUDIT-FINDINGS.md` records what was changed in the October 2026 rebuild and why. `CONTENT-TODO.md` lists content that needs a decision or source material before it can go on the site.
