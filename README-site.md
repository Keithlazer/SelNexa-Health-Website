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

- `styles/scripts/assets/selnexa-logo.svg` (preferred)
- `styles/scripts/assets/selnexa-logo-full.svg` (fallback)
- `styles/scripts/assets/SelNexa Health Logo Full.jpg` (raster fallback)

Image optimization (generate AVIF/WebP + 2x raster)

To avoid spaces in filenames and simplify URLs, rename the source file locally first (PowerShell):

Rename-Item "styles/scripts/assets/SelNexa Health Logo Full.jpg" "styles/scripts/assets/selnexa-logo-full.jpg"

Then run these commands from the repo root to generate optimized variants from the renamed source.

# Create WebP (1x and 2x)
magick "styles/scripts/assets/selnexa-logo-full.jpg" -resize 180 "styles/scripts/assets/selnexa-logo.webp"
magick "styles/scripts/assets/selnexa-logo-full.jpg" -resize 360 "styles/scripts/assets/selnexa-logo@2x.webp"

# Create AVIF (1x and 2x)
magick "styles/scripts/assets/selnexa-logo-full.jpg" -resize 180 "styles/scripts/assets/selnexa-logo.avif"
magick "styles/scripts/assets/selnexa-logo-full.jpg" -resize 360 "styles/scripts/assets/selnexa-logo@2x.avif"

# Optional optimized JPEG fallback
magick "styles/scripts/assets/selnexa-logo-full.jpg" -resize 180 -quality 85 "styles/scripts/assets/selnexa-logo.jpg"

Notes:

- Adjust `-resize` values to suit the header pixel density on your design.
- If your ImageMagick has direct AVIF support you can use `magick`; otherwise install `avifenc` from libavif and use it to encode AVIF.
- After generating these files, verify they appear in `styles/scripts/assets/` and reload the site.

Suggested next steps

- Compute SRI hashes for CDN assets and replace TODO placeholders in `index.html`.
- Add automated Lighthouse checks in CI.

Security headers and CSP

It's best to set security headers (CSP, Strict-Transport-Security, X-Frame-Options, Referrer-Policy, etc.) at the hosting level. Example minimal CSP (adjust to your exact asset hosts):

Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self';

Note: If you use inline scripts or styles, you'll need to add nonces or hashes; evaluate which approach fits your deployment.

