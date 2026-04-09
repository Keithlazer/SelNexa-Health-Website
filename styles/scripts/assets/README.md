This folder contains logo assets used across the site.

Feature screenshot slots now reference these files:

- admin dashboard screenshot: `admin-dashboard-screenshot.png`
- queue management screenshot: `queue-management-interface.png`
- EHR screenshot: `ehr-system-screenshot.png`

Place those files in this folder to populate the homepage and features page image sections.

To generate optimized raster variants (WebP/AVIF and @2x) locally using ImageMagick:

magick "selnexa-logo-full.jpg" -resize 180 "selnexa-logo.webp"
magick "selnexa-logo-full.jpg" -resize 360 "selnexa-logo@2x.webp"
magick "selnexa-logo-full.jpg" -resize 180 "selnexa-logo.avif"
magick "selnexa-logo-full.jpg" -resize 360 "selnexa-logo@2x.avif"
magick "selnexa-logo-full.jpg" -resize 180 -quality 85 "selnexa-logo.jpg"

If you don't have ImageMagick locally, use the `generate-assets` GitHub Action workflow to produce these files from `SelNexa Health Logo Full.jpg`.
