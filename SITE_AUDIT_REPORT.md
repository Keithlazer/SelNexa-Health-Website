# SelNexa Health Site Audit

Run date: 2026-07-02  
Workspace: `keithlazer.github.io.worktrees/copilot-worktree-2026-05-11T11-29-45`

## Scope And Method

This audit covered the static marketing site and subpages, excluding `node_modules`, `dist`, and the backup `SelNexa Website` folder unless noted.

Checks performed:

- Crawled 44 HTML files.
- Compared live-looking pages against `sitemap.xml`.
- Ran `npm run build` and `npm run lint`.
- Crawled internal links, missing local assets, and fragment anchors.
- Reviewed forms, metadata, canonical URLs, Open Graph coverage, page titles, and headings.
- Captured representative Chrome screenshots at 1440x1100 and 390x844.
- Reviewed content for credibility, overclaims, placeholder patterns, and AI-generated signals.

Generated visual evidence:

- `test-results/audit-screens/desktop_index.html.png`
- `test-results/audit-screens/mobile_index.html.png`
- `test-results/audit-screens/mobile_about.html.png`
- `test-results/audit-screens/mobile_features.html.png`
- `test-results/audit-screens/mobile_for-investors.html.png`
- `test-results/audit-screens/desktop_for-investors.html.png`

## Executive Summary

The site has strong raw material: a clearer newer story around African health systems infrastructure, offline-first operation, M&E discipline, pilots, and named team members. The biggest problem is that the site is not internally consistent. Newer pages describe SelNexa as pilot-stage or pre-deployment, while older pages claim mature traction, client testimonials, active provider networks, daily appointment volume, millions in savings, and 12-country deployment. That contradiction is the most obvious "AI-generated" signal because it looks like multiple generated templates were stitched together without one source of truth.

The second major issue is mobile quality. Several first-view screenshots show clipped hero text, low contrast, off-screen content, clipped controls, and bottom navigation overflow. This undermines trust immediately on the device class the site says it is designed for.

The third major issue is conversion reliability. Most forms either have no `action` or an empty `action`, while the shared JavaScript shows a success message even when no backend endpoint exists. Unless production injects endpoints externally, leads can be silently lost.

The fourth issue is crawl hygiene. There are broken internal links, missing assets, missing anchors, incomplete sitemap coverage, inconsistent canonical URLs, missing Open Graph images, and public demo/stub pages.

## Highest Priority Fixes

1. Establish one public truth state.
   If SelNexa is pilot-stage/pre-deployment, remove or noindex pages that claim active scale, named provider networks, verified client savings, 12 countries, 150K daily appointments, 1M blockchain records, or hundreds of active leaders.

2. Fix mobile first-view rendering across all primary pages.
   The homepage, about, platform, and investor pages currently show clipped headings/body copy or clipped controls at 390px. Treat this as a launch blocker.

3. Wire forms to real endpoints or stop pretending submissions succeeded.
   Empty endpoints plus success messages are worse than no form.

4. Remove or quarantine legacy/generated templates.
   `doctors.html`, `testimonials.html`, `modern-design-demo.html`, `portal.html`, and some resource/blog pages look like unverified generated templates.

5. Fix broken links, missing images, and missing anchors.
   These are fast to repair and will immediately reduce the AI-generated feel.

6. Align sitemap, canonical URLs, and page inventory.
   Current sitemap and canonical strategy conflict.

7. Optimize heavy assets.
   Current asset sizes contradict the low-bandwidth/offline-first positioning.

## P0 Findings

### 1. The Site Contradicts Itself On Product Maturity

Evidence that the current canonical story is pilot-stage:

- `index.html:666` says "Pilot deployment to be implemented soon · Sites TBA".
- `case-studies.html:56` says the pilot is active and observations are "not verified outcomes".
- `case-studies.html:97` says observations "should not be used as final impact claims".
- `for-investors.html:246` says the platform is in a "pre-deployment stage".
- `about.html:303` says deployment/reliability metrics are "targets", not reported outcomes.

Evidence that older pages claim mature traction:

- `testimonials.html:142-144` claims 40 percent procurement cost cuts, eliminated stockouts, USD 180,000 annual savings, 70 percent fewer medical errors, and 50 percent faster check-in.
- `testimonials.html:171-173` claims no-shows dropped from 25 percent to 8 percent.
- `testimonials.html:293-314` claims 2,500+ professionals, USD 4.2M savings, 98 percent satisfaction, 12 countries, 150K daily appointments, and 1M blockchain records.
- `testimonials.html:324` says "Join hundreds of healthcare leaders".
- `doctors.html:237-388` presents a provider directory with doctors, availability, credentials, and booking links.

Why this matters:

- Investors, health systems, and partners will notice the contradiction.
- It creates legal and reputational exposure if the mature-traction claims are not documented.
- It reads like AI-generated filler because the numbers are large, rounded, and not sourced.

Recommended fix:

- Pick one truth model for public pages: "pilot/pre-deployment with early observations" appears to be the more credible version.
- Remove `testimonials.html` from navigation and sitemap unless every quote, author, facility, and metric is verified and permissioned.
- Replace mature claims with an "Evidence Status" pattern: `Observed`, `Target`, `Under evaluation`, `Verified by`.
- Add citation notes for every metric.

### 2. Mobile Hero Rendering Looks Broken

Observed in screenshots:

- `mobile_index.html.png`: hero H1 is too large for the viewport; body copy is clipped horizontally; bottom mobile navigation appears to lose the fifth item; the language selector is clipped.
- `mobile_about.html.png`: heading is cut off on the right and has poor contrast.
- `mobile_features.html.png`: heading is cut off on the right and the CTA reads as low contrast.
- `mobile_for-investors.html.png`: hero copy and second CTA are clipped or low contrast.

Likely contributing CSS:

- `styles/site-uniform.css:33` sets `--text-hero: clamp(2.2rem, 5vw, 3.4rem)`.
- `styles/site-uniform.css:554-557` applies this globally to `.hero-title`, `.page-title`, and `.hero h1`.
- `styles/home.css:82` sets older template hero H1s to `4rem`.
- `index.html:584-587` applies a mobile homepage-specific hero title override.
- `styles/site-uniform.css:103` forces nav links to bright cyan `#07d0c3 !important`, which hurts contrast on light surfaces and contributes to mixed visual quality.

Recommended fix:

- Add a global mobile hero rule for `max-width: 430px` using `font-size: clamp(2rem, 9vw, 2.55rem)`, `line-height: 0.98-1.08`, and `overflow-wrap: normal` for headings.
- Ensure `.hero-content`, `.container`, `.hero-shell`, buttons, and controls use `max-width: 100%` without hidden horizontal overflow as a band-aid.
- Remove or reduce `!important` nav color overrides.
- Re-test at 320, 375, 390, 430, 768, and 1024 widths.

### 3. Forms Can Show Success Without Sending Data

Evidence:

- `js/form-endpoints.js:8-9` sets `window.SELNEXA_SCHEDULING_ENDPOINT` and `window.SELNEXA_WISHLIST_ENDPOINT` to empty strings by default.
- `js/site-core.js:1190-1191` reads those endpoint values.
- `js/site-core.js:1200` branches when no endpoint exists.
- `js/site-core.js:1201-1212` shows success messages and resets the form without sending anything.
- `js/site-core.js:810` shows "Subscription captured" for email capture without a backend.
- `appointments.html:61`, `pricing.html:147`, `index.html:1036`, `index.html:1080`, and `contact.html:59` expose forms with empty or missing action behavior.

Audit count:

- 23 forms without usable `action` across crawled HTML.

Why this matters:

- Lead capture may silently fail.
- The site gives users a false sense of completion.
- This is a conversion and trust issue, not just a technical issue.

Recommended fix:

- Configure production endpoints explicitly before launch.
- If endpoint is absent, show "This form is not connected yet. Please email/WhatsApp us" instead of success.
- Add a test that submits each public form in staging and verifies a backend record or email delivery.
- Do not store sensitive patient or medical data in static-site local storage queues.

### 4. Public Stub Pages Undermine Credibility

High-risk pages:

- `portal.html` has no H1/meta description/canonical and is a local demo login stub.
- `portal.html:36-51` comments "Simple portal stub" and displays "Signed in (demo)" plus a fake `Dr. Smith` appointment.
- `modern-design-demo.html` is a design demo page with inline style-heavy sample components.
- `doctors.html` presents a provider directory with generic doctors and `href="#"` profile links.
- `testimonials.html` presents generic/unsourced success stories and statistics.

Recommended fix:

- Add `<meta name="robots" content="noindex,nofollow">` to any stub/demo page that must remain in the repo.
- Remove these pages from navigation, footer, sitemap, and internal links unless they are real production surfaces.
- Prefer deleting `modern-design-demo.html` from production entirely.

### 5. Performance Contradicts Low-Bandwidth Positioning

Build output and asset scan:

- `assets/Selnexa Patient Demo Video.mp4`: 64.54 MB.
- `assets/SelNexa Provider Demo Video.mp4`: 21.48 MB.
- `assets/SelNexa Health.pdf` and `assets/selnexa-health-pitch-deck.pdf`: 23.59 MB each.
- `assets/Africa Map.svg`: 5.75 MB.
- `assets/dashboard-hero.svg`: 3.05 MB.
- `assets/selnexa-logo.svg`: about 0.65 MB.
- `assets/Guide Chitewe svg.svg`: 1.38 MB.

`npm run build` passed but reported very large bundled assets:

- `Africa Map` SVG around 6 MB.
- `dashboard-hero` SVG around 3.2 MB.
- Provider demo video around 22.5 MB.

Why this matters:

- The brand promises low-bandwidth/offline-first operation.
- The website itself should model that constraint.

Recommended fix:

- Replace large SVGs with optimized SVG, AVIF/WebP, or simplified vector maps.
- Compress MP4s and provide poster images, lazy loading, transcripts, and "download video" links.
- Do not load large video assets on the homepage by default.
- Set per-page performance budgets, especially for mobile.

## P1 Findings

### 6. Broken Internal Links And Missing Assets

Internal crawl found 16 missing local destinations/assets:

- `blog/future-healthcare-systems.html` links to missing `blog/digital-transformation.html`.
- `blog/future-healthcare-systems.html` links to missing `blog/healthcare-analytics.html`.
- `blog/future-healthcare-systems.html` references missing `assets/author.jpg`, `assets/blog1.jpg`, `assets/blog2.jpg`, and `assets/blog3.jpg`.
- `doctors.html` links to `/solutions/telemedicine.html`, but telemedicine is at `/telemedicine.html`.
- `resources/webinars.html` references missing `assets/speaker1.jpg` through `assets/speaker4.jpg`.
- `resources/guides.html` references missing `js/guides.js`.
- Resource pages link to `../blog/`, but there is no `blog/index.html`.

Direct evidence:

- `blog/future-healthcare-systems.html:57`, `66`, `137-142`, `172`.
- `resources/webinars.html:76`, `99`, `124`, `147`, `191`.
- `resources/guides.html:225`.
- `doctors.html:428`.

Recommended fix:

- Replace missing images with real assets or remove the image blocks.
- Change `/solutions/telemedicine.html` to `/telemedicine.html`.
- Change `../blog/` links to `/blog.html`.
- Remove related article cards unless the articles exist.

### 7. Many Anchor Links Point Nowhere

Internal anchor crawl found 50 missing fragment targets. High-value examples:

- `index.html` links to `/resources.html#platform-demo-transcript`, but that anchor does not exist.
- `for-investors.html` links to `/resources.html#provider-demo-transcript` and `#patient-demo-transcript`, but those anchors do not exist.
- Solution pages link to case-study anchors that do not exist:
  - `/case-studies.html#bulawayo`
  - `/case-studies.html#analytics-pilot`
  - `/case-studies.html#procurement-sa`
  - `/case-studies.html#ehr-project`
- Older pages link to homepage anchors that no longer exist:
  - `/#beta`
  - `/#contact`
  - `/#about`
  - `/#features`
  - `/#doctors`

Recommended fix:

- Add actual anchored sections where these links should land, or update links to real pages.
- Add an automated link check to CI.

### 8. Sitemap Is Incomplete And Includes Redirect Noise

Pages present but not in `sitemap.xml`:

- `/benefits.html`
- `/doctors.html`
- `/faq.html`
- `/for-funders.html`
- `/modern-design-demo.html`
- `/portal.html`
- `/privacy.html`
- `/resources/guides.html`
- `/resources/webinars.html`
- `/resources/whitepapers.html`
- `/solutions/hospital-management.html`
- `/solutions/index.html`
- `/terms.html`
- `/testimonials.html`

Also, `sitemap.xml:58` includes `/investors.html`, which is only a redirect page to `/for-investors.html`.

Recommended fix:

- Decide which pages are production pages.
- Add production pages to the sitemap.
- Remove noindex/demo/stub/redirect pages from the sitemap.
- Include `privacy.html` and `terms.html` if they remain public and indexable.

### 9. Canonical URLs Conflict With Static Hosting

Several files canonicalize to extensionless paths:

- `about.html` -> `https://www.selnexahealth.com/about`
- `features.html` -> `https://www.selnexahealth.com/features`
- `appointments.html` -> `https://www.selnexahealth.com/appointments`
- `contact.html` -> `https://www.selnexahealth.com/contact`
- `blog.html` -> `https://www.selnexahealth.com/blog`
- `faq.html` -> `https://www.selnexahealth.com/faq`
- `for-investors.html` -> `https://www.selnexahealth.com/for-investors`

Local static server check returned 404 for `/about`, `/features`, and `/for-investors`; only `/solutions/` worked because it maps to `solutions/index.html`.

Why this matters:

- Search engines may be told that the canonical URL is a 404.
- Sitemap uses `.html` URLs while canonicals often omit `.html`.

Recommended fix:

- Either implement extensionless routing redirects on hosting, or use `.html` canonical URLs consistently.
- Align sitemap, `og:url`, canonical tags, and internal links.

### 10. Metadata And Social Sharing Are Incomplete

Audit counts:

- 7 pages lack meta descriptions.
- 12 pages lack canonical tags.
- 41 pages lack `og:image`.
- 9 pages still use `meta name="keywords"`.

Examples:

- `privacy.html`, `terms.html`, `portal.html`, `offline.html`, and `modern-design-demo.html` lack meta descriptions.
- `resources/guides.html`, `resources/webinars.html`, `resources/whitepapers.html`, `solutions/hospital-management.html`, `privacy.html`, and `terms.html` lack canonical tags.
- Most pages lack social images.

Recommended fix:

- Add page-specific descriptions for every public page.
- Remove `meta keywords`; it is outdated and often signals low-quality SEO generation.
- Add one high-quality OG image per major page type.
- Add a small metadata test that checks title, description length, canonical, and OG tags.

### 11. Accessibility Claims Are Overstated

Documentation claims:

- `README.md:13` claims "WCAG 2.1 AAA compliance".
- `README.md:192` has a "WCAG 2.1 AAA Compliance" section.
- `README.md:402` says "Production Ready".
- `PROJECT_COMPLETION.md:416` claims WCAG AA compliance achieved.

Actual audit state:

- `tools/a11y-report.json:17` admits it is a lightweight static scan and recommends axe/Pa11y.
- Running `node tools/a11y-scan.js` fails because the repo uses `"type": "module"` but the script uses CommonJS `require`.
- The visual screenshots show contrast and clipping issues.
- 95 buttons lack explicit `type` attributes. This is not always fatal, but it is sloppy in pages with forms.

Recommended fix:

- Replace "AAA compliant" claims with "accessibility work in progress" until verified.
- Rename `tools/a11y-scan.js` to `.cjs` or convert it to ESM.
- Add axe or Pa11y runtime checks for representative pages.
- Run keyboard-only checks for mobile nav, dialogs, tabs, forms, and dropdowns.

### 12. Security/Compliance Claims Need Evidence Or Softer Language

Risky claims/signals:

- HIPAA and GDPR badges appear in footers across pages.
- `doctors.html:411` says consultations are HIPAA-compliant.
- `testimonials.html:251-253` claims blockchain records are more secure and a 100 percent compliance audit pass.
- `pricing.html:238` describes blockchain EHR, analytics, and telemedicine as an integrated offer.

Why this matters:

- HIPAA, GDPR, PHI, patient records, and telemedicine claims are high-trust/high-liability.
- If these are not independently audited or contractually supported, soften the language.

Recommended fix:

- Replace badges with specific statements: "Designed with controls for audit logging, encryption, access control, and data residency planning."
- Add a real compliance page with what is implemented, planned, and not yet certified.
- Avoid saying "HIPAA compliant" unless there is a documented compliance program and BAA workflow.

## P2 Findings

### 13. Visual System Feels Assembled From Multiple Templates

Examples:

- Newer primary pages use a dark teal/amber system.
- Older pages use red/blue gradients from `styles/home.css`.
- Some pages use Inter/Space Grotesk; others use Montserrat; older pages use Segoe UI.
- `testimonials.html` and `doctors.html` are styled like generic SaaS templates rather than the newer SelNexa brand.
- `manifest.json:9` still uses red `theme_color: "#e63946"` while the newer brand is teal/amber.

Recommended fix:

- Declare a single current design system.
- Delete or quarantine older styles where possible.
- Create one shared header/footer and page shell.
- Stop relying on runtime JS to patch navigation into pages.

### 14. Homepage Positioning Is Strong But Too Abstract In Places

Strong elements:

- Offline-first health infrastructure.
- African health systems constraints.
- Pilot-stage transparency.
- M&E framing.
- Named team and founder story.

Weak elements:

- "Co-architecting Africa's New Public Health Order" is bold but abstract for a first-time visitor.
- The hero should say exactly what the product does sooner: registration, queue/admin workflows, records continuity, procurement monitoring, offline sync.
- `index.html:666` says "Sites TBA", which feels unfinished. Better: "Pilot partner announcements pending facility approval" or remove until public.

Recommended fix:

- Keep the mission language, but pair it with a concrete one-sentence product description above the fold.
- Replace "Sites TBA" with a professionally bounded evidence label.

### 15. Copy Has Repeated AI-Generated Phrases

The content repeatedly uses broad phrases such as:

- "transform"
- "revolution"
- "comprehensive"
- "seamless"
- "empower"
- "leverage"
- "cutting-edge"
- "world-class"
- "AI-powered"

Count sample across HTML:

- `transform`: 56 occurrences.
- `future`: 43 occurrences.
- `transforming`: 15 occurrences.
- `revolution`: 12 occurrences.
- `AI-powered`: 11 occurrences.
- `comprehensive`: 8 occurrences.
- `seamless`: 8 occurrences.

Recommended fix:

- Replace vague claims with operational specifics:
  - Instead of "transform hospital operations", say "keep registration, queue visibility, procurement monitoring, and records lookup usable when connectivity drops".
  - Instead of "AI-powered", say what model/workflow does, what it does not decide, and who reviews it.
  - Instead of "seamless integration", say "FHIR-ready export/import, CSV fallback, and guided migration".

### 16. Blog And Resource Dates Are Stale Or Inconsistent

Examples:

- `blog.html:75-76` filters by November/December 2024.
- `blog/future-healthcare-systems.html:53` shows March 15, 2024.
- `resources/whitepapers.html` lists multiple 2024 resources.
- Newer pilot claims reference Q1/Q3 2026.

Recommended fix:

- Add an editorial review date.
- Remove stale "upcoming" webinars unless they are current.
- Label archived resources clearly.
- Refresh resource hub dates to match the current public story.

### 17. Some Language Is Awkward Or Distracting

Examples:

- `about.html:125` says "high-bandwidth Silicon Valley 'ports'." This reads like a typo or awkward generated phrase. It likely means "imports".
- "Presentation-stage technology" at `about.html:152` is a good idea but needs clearer wording.
- "New Public Health Order" can work, but only if the page explains the concrete link to Africa CDC priorities without sounding like borrowed institutional language.

Recommended fix:

- Run a human editorial pass over about, homepage, investor, and platform pages.
- Prefer plain, concrete language over rhetorical language.

## Page-Level Recommendations

### Homepage: `index.html`

Keep:

- Offline-first positioning.
- Pilot transparency.
- Integration logos.
- Mission/pipeline/evidence sections.

Fix:

- Mobile hero overflow and contrast.
- Replace "Sites TBA" with a professional evidence label or remove it.
- Ensure all CTA targets exist.
- Add transcript anchors if linking to transcript summaries.
- Reduce loaded assets.

### About: `about.html`

Keep:

- Named leadership and founder context.
- Timeline and African infrastructure rationale.

Fix:

- Mobile hero clipping.
- Rewrite awkward "Silicon Valley 'ports'" phrase.
- Shorten long bios where they sound resume-like.
- Add clearer proof for "Manicaland District Hospital" proof-of-concept.

### Platform: `features.html` and `solutions/index.html`

Keep:

- Module framing.
- ROI calculator concept.
- FHIR/offline-first messaging.

Fix:

- Mobile hero clipping.
- Add screenshots or short videos that are optimized and real.
- Separate implemented capabilities from planned/beta capabilities.
- Avoid "seamless" unless integration details are specific.

### Case Studies / Impact: `case-studies.html`, `impact.html`

Keep:

- The caution around unverified outcomes is credible.
- The M&E framing is the strongest antidote to AI-generated claims.

Fix:

- Add the missing case-study anchors used by solution pages, or remove those links.
- Add a clear evidence table:
  - claim
  - source
  - status
  - date
  - reviewer
  - limitations

### Investors: `for-investors.html`

Keep:

- Seed ask clarity.
- Pre-deployment/pilot-stage framing.
- Founders' letter.

Fix:

- Mobile hero clipping and low-contrast secondary CTA.
- Ensure pitch deck/video links are optimized and trackable.
- Add proof gates for market sizing and assumptions.
- Remove any contradiction with testimonials page.

### Doctors: `doctors.html`

Recommended action:

- Remove, noindex, or fully rebuild.

Problems:

- Generic provider cards.
- `href="#"` profile links.
- Booking links point to nonexistent `/#beta`.
- Telemedicine CTA points to `/solutions/telemedicine.html`, which does not exist.
- HIPAA-compliant consultation claim is risky.

### Testimonials: `testimonials.html`

Recommended action:

- Remove, noindex, or replace with verified pilot evidence.

Problems:

- Looks like generated testimonial filler.
- Contains large unsourced metrics.
- Contradicts pilot-stage narrative.
- Uses old visual system.

### Portal: `portal.html`

Recommended action:

- Noindex immediately or remove from production.

Problems:

- Demo stub signs users in locally.
- Fake appointment appears after submit.
- No real authentication.
- No meta/canonical.

### Privacy And Terms: `privacy.html`, `terms.html`

Fix:

- Add H1 elements instead of only section-title H2.
- Add meta descriptions and canonical URLs.
- Remove old nav anchors to nonexistent homepage sections.
- Add effective date, jurisdiction, controller/contact, data retention, subprocessors, security practices, user rights, and medical/PHI handling details.
- Get legal review before relying on them.

### Blog And Resources

Fix:

- Remove stale placeholder webinars and missing speaker images.
- Replace `href="#"` download/register buttons with real links or disabled states.
- Fix `../blog/` links.
- Replace generic article author names/assets with real authors and sources.
- Add `noindex` to thin placeholder resource pages until complete.

## Technical Hygiene

### Build And Lint

Result:

- `npm run build` passed.
- `npm run lint` passed.

Build warnings:

- Vite could not bundle `/js/roi-calculator.js` and `/js/main.js` from `index.html` because they are not module scripts.

Recommendation:

- Decide whether static pages are source of truth or Vite is source of truth.
- Avoid mixing build-managed assets and hand-authored static scripts unless intentional.

### Service Worker

Evidence:

- `sw.js:1` uses `CACHE_VERSION = "2026-04-09-v1"`.
- Current edited files are from May 2026 in the working tree.
- `js/service-worker.js` is a second older service worker implementation using `selnexa-v1`.
- `js/site-core.js:1306` registers `/sw.js`.

Recommended fix:

- Delete or archive the old `js/service-worker.js` if unused.
- Bump `sw.js` cache version on deployment.
- Add a cache-busting release process.
- Be careful caching HTML in a fast-moving marketing site.

### CDN Dependencies

Observation:

- Many pages load Font Awesome, GSAP, Swiper, and Google Fonts via CDN.
- No Subresource Integrity attributes were found.

Recommended fix:

- Self-host critical assets or add SRI where possible.
- Keep animation libraries only where used.
- Use system fonts or subset fonts for low-bandwidth performance.

## AI-Generated Signals To Remove

These are the patterns most likely to make a reviewer think the site was AI-generated:

1. Contradictory stage claims across pages.
2. Large exact-looking metrics without citations.
3. Generic names, generic facilities, and generic quotes.
4. Placeholder links (`href="#"`) on production-looking resources.
5. Missing assets in articles and webinars.
6. Mixed design systems from multiple templates.
7. Repetitive phrases such as "transform", "revolution", "comprehensive", and "seamless".
8. Overbroad claims about AI, blockchain, HIPAA, GDPR, and world-class healthcare.
9. Footer/nav links pointing to sections that no longer exist.
10. Documentation claiming "Production Ready" and "WCAG AAA" while runtime issues remain.

## Recommended 2-Week Repair Plan

### Day 1-2: Truth And Page Inventory

- Decide which pages are production, noindex, redirect, or delete.
- Remove/noindex `portal.html`, `modern-design-demo.html`, `doctors.html`, and `testimonials.html` unless made real.
- Choose the canonical public stage: pilot/pre-deployment vs active-scale.

### Day 3-5: Mobile And Navigation

- Fix global mobile hero sizing and container overflow.
- Repair language/theme controls.
- Confirm bottom nav renders all five items at 320-430px.
- Standardize header/footer across all production pages.

### Day 6-7: Forms And Conversion

- Wire scheduling and wishlist endpoints.
- Add visible fallback contact path when endpoints are absent.
- Verify every public form by receiving a test submission.

### Day 8-9: Links, Sitemap, Metadata

- Fix missing internal links/assets/anchors.
- Align `.html` vs extensionless canonical strategy.
- Rebuild sitemap from production page inventory.
- Add descriptions, canonical tags, and OG images.

### Day 10-12: Content Credibility Rewrite

- Rewrite homepage, platform, about, case studies, investor, and resources around a single evidence model.
- Add citations or remove unsupported claims.
- Replace generic "AI" copy with concrete workflows and oversight boundaries.

### Day 13-14: Performance And Accessibility Verification

- Optimize heavy assets.
- Fix `tools/a11y-scan.js` or replace with axe/Pa11y.
- Run mobile screenshot checks at 320/375/390/430/768.
- Run keyboard and screen-reader smoke checks.

## Acceptance Criteria Before Launch

- No public page has clipped text at 320px, 375px, 390px, 430px, 768px, or desktop widths.
- No production page contains `href="#"` unless it is a deliberately inert control with correct ARIA handling.
- No form reports success unless a request was actually sent or intentionally queued.
- No public page claims verified outcomes without a citation or evidence status label.
- Sitemap contains only production indexable pages.
- Canonical URLs resolve with HTTP 200.
- All internal links and fragment anchors resolve.
- No missing local assets.
- All public pages have title, meta description, canonical URL, and Open Graph image.
- Service worker cache version is current.
- Accessibility audit runs successfully in CI or a documented local workflow.
- Page weight is consistent with the site's low-bandwidth promise.

