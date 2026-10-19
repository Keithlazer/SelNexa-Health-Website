# Performance before and after

Measured in October 2026. "Before" is the `main` branch as it stood when this work started (commit `21c14f9`, the version that was live). "After" is this branch at the end of Phase 4. Every number here was measured; nothing is estimated.

## How it was measured

- Lighthouse 12, mobile, simulated throttling: 300 ms round trip, 700 kbps down, 4x CPU slowdown (slower than Lighthouse's default, to match a weak 3G connection). Three runs per page; the tables give the median run. Run on the same Windows machine for every local measurement.
- Local copies were served by a small static server that behaves like GitHub Pages (same file layout, no compression). The live site was measured at https://www.selnexahealth.com, which GitHub serves compressed.
- Page weight: headless Chrome at 390 x 844, cache and service worker off, bytes as transferred, counting everything requested before the page finished loading ("first load") and then after scrolling to the bottom so lazy images load ("after scroll").
- The "after" figures can only be measured locally until the branch is merged. Measure the live site again after merging.

## Lighthouse

Times in milliseconds. LCP is largest contentful paint, FCP first contentful paint, TBT total blocking time, CLS cumulative layout shift.

### Homepage

| | Performance | FCP | LCP | TBT | CLS | Accessibility | Best practices | SEO |
|---|---|---|---|---|---|---|---|---|
| Before, live site | 57 | 8,005 | 14,310 (no LCP found in 1 of 3 runs) | 55 | 0.022 | 98 | 100 | 100 |
| Before, local copy | 0 (no LCP found in any run) | 7,605 | none | n/a | 0 | 98 | 100 | 100 |
| After, local copy | 80 | 2,427 | 3,512 | 147 | 0 | 100 | 100 | 100 |

Before, Lighthouse often found no largest contentful paint at all, because the hero text and image stayed transparent until a script faded them in. When it did find one, it was 14.3 seconds.

### About

| | Performance | FCP | LCP | TBT | CLS | Accessibility | Best practices | SEO |
|---|---|---|---|---|---|---|---|---|
| Before, live site | 64 | 3,954 | 7,337 | 104 | 0 | 94 | 100 | 92 |
| Before, local copy | 62 | 3,563 | 6,772 | 74 | 0 | 94 | 100 | 92 |
| After, local copy | 77 | 2,427 | 3,036 | 493 | 0 | 100 | 100 | 100 |

### Platform (features.html)

| | Performance | FCP | LCP | TBT | CLS | Accessibility | Best practices | SEO |
|---|---|---|---|---|---|---|---|---|
| Before, live site | 63 | 3,775 | 7,408 | 115 | 0 | 92 | 100 | 92 |
| Before, local copy | 62 | 3,563 | 6,777 | 93 | 0 | 92 | 100 | 92 |
| After, local copy | 84 | 2,090 | 3,313 | 255 | 0 | 100 | 100 | 100 |

### What these numbers do and do not show

- Largest contentful paint is still above Google's 2.5 second "good" threshold on all three pages under this throttling. The largest element is now the page headline, which waits for the stylesheet and the font over a 700 kbps connection. Each page now makes one stylesheet request and preloads one 29 KB font; the remaining time is mostly the network itself.
- Total blocking time went up (About: 74 to 493 ms; Platform: 93 to 255 ms; homepage: 55 to 147 ms). Before, most of the script work happened before the first paint, where Lighthouse does not count it. Now the page paints about a second earlier and the same start-up work lands after it. Start-up work was moved to idle time to reduce this. TBT also varied between runs on this machine (About ranged from 431 to 517 ms in the final runs and measured 234 ms in an earlier run of nearly the same build).
- The Lighthouse runs were made before the last change in Phase 4, a few lines of CSS that fix the hero text colours. That change adds no requests.

## Page weight

Kilobytes transferred. Requests and third-party bytes are for the first load. "HTML, CSS, JS" is the code alone, without images, fonts or video. Redirect pages were measured as the browser sees them, so after the change they include the page they redirect to.

| Page | Before, first load | After, first load | Before, after scroll | After, after scroll | Before, HTML, CSS, JS | After, HTML, CSS, JS | Before, requests | After, requests | Before, third-party | After, third-party |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 3,735 | 170 | 7,939 | 227 | 166 | 36 | 31 | 25 | 295 | 0 |
| `about.html` | 635 | 75 | 4,172 | 195 | 74 | 34 | 13 | 8 | 27 | 0 |
| `features.html` | 633 | 99 | 812 | 99 | 72 | 32 | 13 | 11 | 27 | 0 |
| `case-studies.html` | 809 | 66 | 809 | 66 | 65 | 32 | 15 | 7 | 204 | 0 |
| `impact.html` | 648 | 73 | 648 | 73 | 38 | 26 | 15 | 10 | 38 | 0 |
| `projects.html` | 614 | 78 | 634 | 78 | 45 | 31 | 14 | 10 | 1 | 0 |
| `for-investors.html` | 1,282 | 133 | 1,282 | 142 | 90 | 30 | 21 | 11 | 336 | 0 |
| `resources.html` | 809 | 66 | 809 | 66 | 64 | 31 | 15 | 8 | 204 | 0 |
| `pricing.html` | 809 | 65 | 809 | 65 | 64 | 31 | 15 | 7 | 205 | 0 |
| `careers.html` | 809 | 66 | 809 | 66 | 64 | 31 | 15 | 7 | 205 | 0 |
| `contact.html` | 630 | 71 | 630 | 71 | 70 | 30 | 13 | 8 | 27 | 0 |
| `appointments.html` | 656 | 71 | 656 | 71 | 95 | 30 | 15 | 8 | 51 | 0 |
| `security-and-compliance.html` | 808 | 65 | 808 | 65 | 63 | 30 | 15 | 7 | 204 | 0 |
| `privacy.html` | 310 | 56 | 310 | 56 | 28 | 22 | 9 | 7 | 0 | 0 |
| `terms.html` | 309 | 56 | 309 | 56 | 28 | 21 | 9 | 7 | 0 | 0 |
| `faq.html` | 631 | 65 | 631 | 65 | 71 | 30 | 13 | 7 | 27 | 0 |
| `press.html` | 636 | 60 | 636 | 60 | 38 | 25 | 12 | 7 | 38 | 0 |
| `blog.html` | 632 | 72 | 632 | 72 | 72 | 31 | 13 | 9 | 27 | 0 |
| `telemedicine.html` | 808 | 71 | 808 | 71 | 63 | 30 | 15 | 8 | 204 | 0 |
| `benefits.html` (now a redirect) | 631 | 100 | 631 | 100 | 71 | 33 | 13 | 12 | 27 | 0 |
| `testimonials.html` (now a redirect) | 484 | 67 | 484 | 67 | 55 | 32 | 12 | 8 | 166 | 0 |
| `doctors.html` (now a redirect) | 478 | 171 | 478 | 228 | 50 | 37 | 11 | 26 | 166 | 0 |
| `portal.html` (now a redirect) | 310 | 72 | 310 | 72 | 29 | 31 | 9 | 9 | 0 | 0 |
| `404.html` | 625 | 66 | 625 | 66 | 65 | 25 | 12 | 8 | 27 | 0 |
| `solutions/` | 763 | 67 | 763 | 67 | 55 | 26 | 15 | 8 | 166 | 0 |
| `solutions/administration.html` | 763 | 67 | 763 | 67 | 54 | 26 | 14 | 8 | 166 | 0 |
| `solutions/analytics.html` | 483 | 67 | 483 | 67 | 54 | 26 | 12 | 8 | 166 | 0 |
| `solutions/procurement.html` | 483 | 67 | 483 | 67 | 54 | 26 | 12 | 8 | 166 | 0 |
| `solutions/records.html` | 483 | 67 | 483 | 67 | 54 | 26 | 12 | 8 | 166 | 0 |
| `solutions/hospital-management.html` | 926 | 67 | 926 | 83 | 55 | 27 | 16 | 8 | 166 | 0 |
| `resources/guides.html` | 329 | 69 | 329 | 69 | 48 | 28 | 14 | 9 | 0 | 0 |
| `resources/webinars.html` | 328 | 74 | 328 | 74 | 47 | 28 | 14 | 11 | 0 | 0 |
| `resources/whitepapers.html` | 328 | 68 | 328 | 68 | 46 | 27 | 14 | 9 | 0 | 0 |
| `blog/ai-healthcare-africa.html` | 488 | 62 | 488 | 62 | 59 | 27 | 13 | 7 | 166 | 0 |
| `blog/future-healthcare-systems.html` | 680 | 102 | 680 | 102 | 43 | 27 | 14 | 10 | 0 | 0 |
| `blog/selnexa-telemedicine-zimbabwe.html` | 315 | 60 | 315 | 60 | 34 | 25 | 10 | 7 | 0 | 0 |
| `blog/telemedicine-zimbabwe.html` (now a redirect) | 488 | 72 | 488 | 72 | 60 | 31 | 14 | 10 | 166 | 0 |
| `blog/why-ai-diagnostics-matter.html` | 315 | 60 | 315 | 60 | 34 | 25 | 10 | 7 | 0 | 0 |
| All 38 | 25,901 | 2,922 | 33,842 | 3,181 | | | | | | |

No page now loads anything from another site. Before, 29 of the 38 pages loaded fonts, icons or scripts from Google Fonts, cdnjs or jsDelivr.

## Where the savings came from

- Images that were PNGs wrapped in SVG files (logo 670 KB on every page, team portraits up to 1.4 MB each, the Africa map 5.9 MB) replaced with sized WebP and PNG files.
- Font Awesome (about 250 KB), GSAP, ScrollTrigger and Swiper removed; icon font files of 8 KB in their place, holding only the icons the site uses.
- Google Fonts replaced with one self-hosted 29 KB font file.
- Five to seven stylesheets per page joined into one, without the rules no page uses: 8 to 19 KB compressed.
- Demo videos re-encoded from 22.5 MB and 67.7 MB to 2.1 MB and 4.9 MB; they load only when played.

Details of each change are in `AUDIT-FINDINGS.md`, Phase 4.
