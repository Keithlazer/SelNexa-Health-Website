# Design assets the site is waiting for

Every slot below works today with what the site has. Each one would look better with a purpose-made asset.

## How to deliver

- **Where:** drop files into `design-assets/incoming/`. Put illustrations in `design-assets/incoming/illustrations/`.
- **Processing:** run `node scripts/process-assets.mjs`. It gives each file a kebab-case name and:
  - optimises SVGs;
  - writes raster files as WebP and AVIF at 1x and 2x, into `assets/img/` or `assets/illustrations/`.
- **Format:** send raster art at 2x, the size given below. Send SVG where the art is flat.
- **Brand:** navy `#0A2463`, gold `#E8A020` and cream `#F9F5EE`. Montserrat is the only typeface. Any text in an image should also appear in the page.
- **Not accepted:**
  - Stock photography, stock illustration, and AI images of people or places presented as real.
  - Real patient data. Product screens must show the demo's synthetic data.
  - The name, logo or photograph of any health facility. No pilot site may be named until approvals are in place.
  - A single Canva icon used as a site icon. Icons come only from the Phosphor set in `assets/icons/sprite.svg`.

## Slots

| # | Slot | Size (2x) | Where it shows | What is there now |
|---|---|---|---|---|
| 1 | Blog cover: "Offline first: health software for institutions where the connection fails" | 1200 × 630 | The featured card on /blog.html, the "From the blog" strip on the homepage, and the post's Open Graph image | The Digital Health Week logo on a navy panel with the contour pattern; the sitewide `og-image.png` for sharing |
| 2 | Open Graph image, homepage | 1200 × 630 | Link previews on LinkedIn, WhatsApp and X | The sitewide `og-image.png`, also used on every other page |
| 3 | Open Graph image, Platform (`/features.html`) | 1200 × 630 | Link previews | `og-image.png` |
| 4 | Open Graph image, About | 1200 × 630 | Link previews | `og-image.png` |
| 5 | Open Graph image, Blog listing | 1200 × 630 | Link previews | `og-image.png` |
| 6 | Open Graph image, Data protection service | 1200 × 630 | Link previews | `og-image.png` |
| 7 | Open Graph image, Careers | 1200 × 630 | Link previews | `og-image.png` |
| 8 | Section illustration: About, "Where SelNexa began" | 1600 × 900 | Beside or above the founding story | Text only |
| 9 | Section illustration: Projects, "How we decide what to build" | 1600 × 900 | Above the decision criteria | Text only |
| 10 | Section illustration: Careers, "Young professionals pipeline" | 1600 × 900 | Above the three pipeline cards | Text only |
| 11 | Team portraits, all six: Keith Tafangombe, Natalie Masvikeni, Guide Chitewe, Dr Farisai Mawere, Simbarashe Hunzvi, Alton Matemera | 800 × 800 each, the same background and framing for all six | About, team section; Press, founder bios | 640px portraits whose backgrounds and crops differ |
| 12 | Platform screenshots at full resolution: provider dashboard, patient dashboard, workspace selection | 2400 px wide, from the demo build with synthetic data | Laptop frames on the homepage, the modules page, Hospital management and Features | Frames cut from the 720p demo videos (1176 px wide) |

For slots 2 to 7, keep the important content inside the central 1000 × 500 area of the 1200 × 630 frame. LinkedIn and WhatsApp crop the edges.
