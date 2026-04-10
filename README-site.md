This repository contains the SelNexa Health static site.

Quick preview

1. From repo root run:

   python -m http.server 8000

2. Open http://localhost:8000 in your browser.

What I changed (summary)

- Replaced the header/footer text logo with responsive <picture> markup and used SVG/raster fallbacks located in `styles/scripts/assets/`.
- Added preloads and noscript fallback for critical CSS and JS in `index.html`.
- Improved nav accessibility (role, aria-label) and mobile menu keyboard handling in `js/home.js`.

Logo assets

- `styles/scripts/assets/selnexa-logo.svg` (canonical production logo)

Image optimization

No raster generation is required for the current site logo because it is SVG-based.

If you need raster derivatives for external channels, export from `styles/scripts/assets/selnexa-logo.svg`.

If you'd like me to generate and commit raster exports for specific channels, say which formats and target sizes you want.

Tool availability note:
- This environment may not have ImageMagick/libavif/ffmpeg installed by default.
- If conversion tools are missing, install ImageMagick (Windows) or libavif and
   run the provided PowerShell commands from the repository root.

Suggested next steps

- Compute SRI hashes for CDN assets and replace TODO placeholders in `index.html`.
- Add automated Lighthouse checks in CI.

Security headers and CSP

It's best to set security headers (CSP, Strict-Transport-Security, X-Frame-Options, Referrer-Policy, etc.) at the hosting level. Example minimal CSP (adjust to your exact asset hosts):

Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self';

Note: If you use inline scripts or styles, you'll need to add nonces or hashes; evaluate which approach fits your deployment.

