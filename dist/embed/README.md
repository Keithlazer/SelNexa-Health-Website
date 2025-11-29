# SelNexa Embed — Integration Guide

Files:

- `selnexa-embed.js` — the bundled JavaScript (includes React + ReactDOM and component code)
- `selnexa-embed.css` — extracted CSS (Tailwind) scoped for the embed
- `demo.html` — local demo showing multiple embed instances

Quick paste integration

1. Copy `selnexa-embed.js` and `selnexa-embed.css` to your host site (e.g., `https://www.selnexahealth.com/assets/`).
2. Insert the following where you want the dashboard to appear:

```html
<link rel="stylesheet" href="/assets/selnexa-embed.css">
<div class="selnexa-dashboard-embed" data-type="provider"></div>
<script src="/assets/selnexa-embed.js"></script>
```

Notes
- You can add multiple embeds on the same page; each `.selnexa-dashboard-embed` will be mounted automatically.
- Supported `data-type` values: `patient`, `provider`, `admin`.

Tailwind scoping

- This embed build uses a dedicated Tailwind config (`tailwind.config.embed.js`) which scopes all generated utilities under the wrapper class `.selnexa-embed-root`.
- The embed runtime automatically adds that class to each embed container, so styles from the embed will not leak into the host site's global styles.

- Note: The embed CSS produced by the build is post-processed with `postcss-prefixwrap` and therefore wrapped under `.selnexa-embed-root` automatically. This guarantees scoping even though the project's main `tailwind.config.js` was not permanently changed.

Build & Rebuild

From the repo root:

```powershell
npm install
npm run build:embed
```

If you change Tailwind or the components and want a fresh embed bundle, re-run the command above and re-copy the generated assets to the host.

Troubleshooting

- If the embed shows unstyled content, ensure `selnexa-embed.css` and `selnexa-embed.js` are present and paths in the page are correct.
- If you prefer a smaller CSS file, create a minimal `src/embed.css` that imports only the Tailwind utilities/components you use and import that in `src/embed.tsx` instead of `src/index.css`, then rebuild.
