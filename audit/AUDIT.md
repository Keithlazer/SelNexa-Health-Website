# UI/UX audit, ui-refresh branch

Started 14 November 2026 on `ui-refresh`, branched from `main` at c5ba879.

## How this audit was made

- `node scripts/screens.mjs before` takes full-page screenshots of all 31 public pages at 375, 768, 1280 and 1440px into `audit/before/` (124 files, 63 MB). They are kept out of git and are rebuilt by running the script again.
- `node scripts/audit.mjs before` writes `audit/before.json`. It checks:
  - **Every width:** horizontal overflow, words split across lines, cards with empty bands, and text under 14px.
  - **375 and 1280px:**
    - axe-core 4.10.3, which covers contrast, alt text, accessible names and ARIA.
    - Heading count, order and casing.
    - Emoji and symbol characters, and icon-font use.
    - Focus rings, found by pressing Tab through the first 12 stops.
    - Console errors and failed requests.
    - Every internal link.
    - Meta tag agreement.
    - Header and footer markup, compared across pages.
  - **375px only:** the mobile menu opens and closes on Escape.
- Both scripts start their own local server (`scripts/serve.mjs`), which follows GitHub Pages' path rules.
- Section close-ups were reviewed by eye at 1280px.

Severity: **High** means it breaks reading or trust, or misstates a fact. **Medium** means it is visibly inconsistent or below the brief's standards. **Low** means polish.

## What is already sound (no change needed)

- No horizontal overflow at any width on any page.
- No console errors, failed requests or broken internal links.
- axe-core reports no violations on any page at 375 or 1280px.
- Exactly one H1 on every page, and no skipped heading levels.
- Every image has alt text. Every focus stop tested shows a visible ring, except the two native `<video>` controls on Home and Investors.
- The header and footer markup is identical on all 30 pages that use them. offline.html has neither, by design.
- The mobile menu opens on every page at 375px, shows all 7 links, and closes on Escape.
- No em dashes in body copy.

## Site-wide issues

| # | Issue | Severity | Planned fix (phase) |
|---|---|---|---|
| S1 | Icon font ("SelNexa Icons", a Font Awesome subset in `styles/icons.css`): 53 different glyphs on 16 pages. The brief rules out icon fonts. Several glyphs are a poor fit, such as `fa-unlock` for "Results Matrix" and `fa-bolt` for accountability. | Medium | Replace with a Phosphor 2.1.1 SVG sprite (`assets/icons/sprite.svg`), then delete `icons.css` and the font file (2) |
| S2 | Text under 13px. The header tagline "OFFLINE FIRST HEALTH SOFTWARE" is 9.6px on phones and 10.6px on desktop. Section eyebrows are 11–11.2px, status tags 11.5px, three footer lines 12.8px, and article captions and labels 11.5–12px. | High | Small-text token, 13–14px minimum (1) |
| S3 | Headings in Title Case on most pages (for example "Our Mission And Vision", "Leave No One Behind", "Contact Our Team", "How We Compare", "Still Have Questions?") | Medium | Sentence case everywhere. Proper nouns, product names and job titles keep their capitals (3, 5) |
| S4 | Eyebrows are inconsistent. Three styles are in use: `.section-label` boxed in a gold outline, `.hero-overline` in teal capitals, and `.story-eyebrow`. On About, the "Inclusion & equity" eyebrow sits on the card's top border. | Medium | One eyebrow style, never clipped (1) |
| S5 | Cards stretch to the tallest card in their row, leaving 70–390px of empty white at the bottom. This shows on About (team, timeline), Careers, Contact, Features, Press, Data protection and Home (the partner CTA card). A three-column grid also leaves a fourth card orphaned on its own row (Features 5Cs, Careers roles and "How we work"). | High | Base card with no fixed heights. Grids use `auto-fit` with even counts: 2×2, or four across at 1280px and up (1, 3) |
| S6 | "A · B · C" proof lines with an orange dot (Home mission cards, Features modules, Projects) | Medium | Pill chips (1, 3) |
| S7 | Arrow characters (→) typed into link and button text on 17 pages | Low | Keep. They are text, not icons, and screen readers skip them in practice. The design system draws the arrow with CSS on `.text-link` so new copy doesn't need the character (1) |
| S8 | The nav has no Blog link, and the highlighted item is inconsistent: Careers highlights About, FAQ highlights Platform, and Blog highlights nothing. | Medium | Add Blog between About and Contact, with `aria-current` on blog pages (4) |
| S9 | Section surfaces are uneven. Some pages stack three cream sections in a row, and the dark hero is the only navy band. | Low | Alternate cream and white sections, and give each long page one deep navy band with the contour pattern (1, 5) |
| S10 | Two product screenshots on Features and Hospital management (queue-management-interface.png, ehr-system-screenshot.png) are PNG only. The audit also flagged the team portraits and the author avatar, but they already serve WebP with a PNG fallback: lazy images report no `currentSrc` until they load, which caused the false flag. | Medium | Replace the two product screenshots with WebP frames from the provider demo video (5) |
| S11 | The native `<video>` controls on Home and Investors show no focus ring | Low | Add a focus ring on `video:focus-visible` (1) |

## Per page

### Home `/`
- **High:** The mission paragraph cites "just over 22 health workers per 10,000 people in 2022" from Modern Ghana. WHO's Regional Office for Africa gives "approximately 23 doctors, nurses and midwives per 10 000 population" for 2022 (see "Fact checks"). **Fix:** WHO wording and WHO links (3).
- **Medium:** The four mission cards use mismatched icons (bolt, earth, unlock, handshake) at 20px, have Title Case in two headings ("African-First Thinking", "Complementary, Not Competitive"), and end with orange-dot proof lines. **Fix:** Brief icons (arrows-clockwise, globe-hemisphere-east, list-checks, puzzle-piece) in 48px tiles, chips, and sentence case (3).
- **Medium:** The partner CTA card has 73px of empty space at 1280px. **Fix:** Cards size to their content (1).
- **Medium:** "Work With Us" is in Title Case. **Fix:** Sentence case (5).
- **Low:** The flagship section has no product image. **Fix:** Add a laptop-framed frame from the demo video (5).
- **Missing:** No "From the blog" strip. **Fix:** Add one above "Follow the build" (4).

### About `/about.html`
- **High:** "Our Mission And Vision" has no vision statement. The three items are plain text with 14px icons, and the values are run together in one paragraph. **Fix:** Rename it "Mission, thesis and values", with icon tiles, Mission and Thesis cards, and a four-tile Values grid (wrench, shield-check, handshake, chart-line-up). No vision statement is written; see the open questions (3).
- **Medium:** "Leave No One Behind" is in Title Case with "Inclusive Digital Access", and its eyebrow sits on the card border. **Fix:** Sentence case, device and scales icons, the principle line set as a pull quote, and the eyebrow moved inside the card (3).
- **High:** The Company timeline heading is teal (#004c4c), not navy. The cards sit off-centre, leaving the right third empty at 1280px. The dot overlaps the year, and cards have up to 217px of empty space. **Fix:** Navy heading, a centred horizontal track on desktop with dots above the cards, gold years and icons (flag, code, flask, map-pin), and a vertical track on mobile (3).
- **Medium:** Team cards have 139–388px of empty space at 1280px, because bios vary in length. **Fix:** Cards size to their content in an auto-fit grid (1).
- **Low:** The founding story uses a spaced hyphen as a dash ("…became difficult - which is exactly…"). **Fix:** Rewrite as two sentences (5).
- **Low:** "Our Leadership Team" and "Join SelNexa Health's Work" are in Title Case (5).

### Careers `/careers.html`
- **High:** Words split mid-word at 1440px ("Implementation", "Francophone") because the three-column job cards are too narrow for 1.375rem headings. **Fix:** Two-column job grid, `overflow-wrap: break-word` with no `break-all`, and the H3 scale from the brief (3).
- **Medium:** "Status: Applications opening soon." repeats on all four job cards and again as a disabled button. **Fix:** One banner, "Applications opening soon", with a "Get notified" mailto link (3).
- **Medium:** The department sits in a bold label line. Roles have no icons. "Data Scientist - Clinical Analytics" uses a spaced hyphen. **Fix:** Department chip, role icons (code, stethoscope, chart-scatter, translate), and the title "Data Scientist, Clinical Analytics" (3).
- **Medium:** The Careers mission and values differ from About's. Careers lists three values (Pragmatism, Sovereignty, Impact) and a different mission sentence. About lists four values (Pragmatism, Sovereignty, Partnership, Impact). **Fix:** Use About's mission sentence and four values, so the site states one mission (3). This copies existing approved text; nothing new is written.
- **Medium:** Orphan cards. "How we work" has four cards in a three-column grid, and Open Roles has four in three columns. **Fix:** Even grids (1).
- **Low:** "How We Work" (h2) and "How we work" (h2) are both on the page. **Fix:** Rename the first card "How we work together" (3).

### FAQ `/faq.html`
- **Medium:** Six questions are shown open as plain text, with no disclosure. **Fix:** `<details>`/`<summary>` accordion with plus and minus icons and the first question open. Six questions don't need category headings. The FAQPage JSON-LD is kept in step (3).
- **Medium:** The hero is a 700px navy block with a 300px empty band at 1280px. **Fix:** Shared compact page hero (5).
- **Medium:** An answer links to "Security and Compliance page", but the page has been renamed Security. **Fix:** Rename the link "Security page" (3).
- **Low:** "Common Questions About SelNexa Health" and "Still Have Questions?" are in Title Case (3).
- **Medium:** The nav highlights Platform. **Fix:** Highlight About, the parent in the footer's Company group (4).

### Features `/features.html`
- **High:** The "Africa CDC 5Cs" section presents Connectivity, Climate, Capacity and Collaboration as Africa CDC's "5Cs", but there are only four, and the bracketed subtitles sit inside the H3s. Three columns orphan the fourth card. The Capacity card cites Modern Ghana for the workforce figure. **Fix:** Retitle it "Four principles behind the Platform" and present the principles as SelNexa's own, with gold subtitle labels, icons (cell-signal-low, cloud-lightning, users-three, handshake), WHO sources, the confirmed Africa CDC New Public Health Order link, and four columns at 1280px and up, 2×2 below, one on phones (3).
- **Medium:** The comparison table uses ✓ and ✗ characters. **Fix:** Status chips ("Yes", "No", "Partial") with icons (5).
- **Medium:** Module tab buttons use 13.3px text. **Fix:** 15px (1).
- **Medium:** Two PNG product screenshots (queue-management-interface.png, ehr-system-screenshot.png). **Fix:** WebP frames from the demo video, in a laptop frame (5).
- **Low:** "Platform Modules" and "Ready to evaluate the SelNexa Health Platform?" are mixed case. **Fix:** Sentence case (5).

### Blog `/blog.html`
- **High:** The meta description, og:description and twitter:description promise articles on "AI in health institutions, and telemedicine in Zimbabwe", which do not exist. **Fix:** Rewrite them to describe what is published (4).
- **Medium:** One small card with the event logo, and no featured treatment. **Fix:** Featured card (cover, date, reading time, title, summary), an automatic grid, and an empty state (4).
- **Low:** "Healthcare Innovation Blog" is in Title Case and uses the "innovation" register. **Fix:** "Blog" with a plain subtitle (4).

### Blog post `/blog/offline-first.html`
- **Medium:** Labels and captions at 11.5–12px. **Fix:** Small-text token (1).
- **Medium:** No share links and no Article JSON-LD. The author line does not use the brief's form. **Fix:** "Keith Tafangombe, Founder and CEO" with date and reading time, share links (LinkedIn, X, WhatsApp, copy link), a "Back to blog" link, a "Book a demo" panel and Article JSON-LD (4).
- **Low:** The author avatar is a PNG. **Fix:** WebP (5).

### Appointments `/appointments.html`
- **Medium:** Emoji as icons (💼, 📅). **Fix:** Phosphor icons (2).
- **Low:** "Evaluate the SelNexa Health Platform" is in Title Case (5).

### Contact `/contact.html`
- **Medium:** The problem cards have 137–186px of empty space. **Fix:** Cards size to their content (1).
- **Low:** "Contact Our Team" and "Other Ways to Reach Us" are in Title Case (5).
- **Medium:** The form uses mixed field sizes. **Fix:** Labels above fields, 48px inputs, focus and error states, and the honeypot kept (5).

### Case studies `/case-studies.html`
- **Low:** "Where The Platform Stands Today", "How We Compare" and "What We'll Measure, and Who Verifies It" are in Title Case (5).
- **Medium:** 11.5px status tags. **Fix:** Chip token (1).

### Impact `/impact.html`
- **Low:** "Our Results Matrix" is in Title Case. **Fix:** Sentence case (5).
- **Medium:** 11.5px status tags. **Fix:** Chip token (1).

### Investors `/for-investors.html`
- **Low:** Title Case in seven headings. **Fix:** Sentence case (5).
- **Medium:** The page uses icon fonts and 11.5px "Projection" tags. **Fix:** Sprite and chips (1, 2).
- **Low:** The video has no focus ring (S11).

### Press `/press.html`
- **Medium:** Cards have 74–131px of empty space. **Fix:** Cards size to their content (1).

### Projects `/projects.html`
- **Low:** Title Case in seven headings, for example "Current And Upcoming Projects". **Fix:** Sentence case. Project names keep their capitals (5).
- **Medium:** Orange-dot proof lines. **Fix:** Chips (1).

### Resources `/resources.html`, Guides, Webinars, White papers
- **Medium:** Thin pages listing upcoming material, with icon fonts and 12.8–13.3px tags and filter buttons. **Fix:** Sprite, chips, and a tidy "coming soon" state (2, 5).
- **Low:** Title Case in most card headings. **Fix:** Sentence case (5).

### Security `/security`
- **Medium:** Fourteen 11.5px status tags. **Fix:** Chip token (1).
- **Low:** It has no icons in the trust section. **Fix:** lock-key, fingerprint and shield-check tiles (5).

### Data protection `/services/data-protection`
- **Medium:** The price cards have 107–210px of empty space. **Fix:** Cards size to their content, with an even grid (1).

### Solutions: index, Administration, Analytics, Hospital management, Procurement, Records
- **Medium:** Eight icon-font icons per page, and Title Case in nearly every H3 (for example "Automated Patient Registration", "Budget & Cost Analytics"). **Fix:** Module icons (clipboard-text, package, files, chart-bar, video-camera, hospital), and sentence case (2, 5).
- **Medium:** The Hospital management benefit card has 154px of empty space at 768px (1).

### Telemedicine `/telemedicine.html`
- **Low:** Five H2s in Title Case. **Fix:** Sentence case (5).
- **Medium:** The page uses icon fonts (2).

### Privacy, Terms
- **Low:** "No Medical Advice" is in Title Case (5).

### 404 `/404.html`
- **Medium:** Five emoji used as link icons (🏠, ℹ, ✨, 📚, 📞). **Fix:** Phosphor icons (2).
- **Low:** It has no og:image. That is harmless, because 404 pages are not shared; noted only.

### Offline `/offline.html`
- **Low:** It has no canonical, no og:image and a short description. This is intended: it is the service worker's fallback and is never indexed. It has no change except the type tokens.

## Fact checks for Phase 3

### Zimbabwe health workforce density
- **What the site says:** "just over 22 health workers per 10,000 people in 2022, less than half WHO's benchmark of 45", sourced to Modern Ghana, a news site. It appears on Home, Features and Solutions: Administration.
- **What WHO says:** WHO Regional Office for Africa, "Zimbabwe strengthens health workforce to advance universal health coverage" (1 July 2026): "In 2022, the country had approximately 23 doctors, nurses and midwives per 10 000 population". The same article calls this "less than half of the WHO-recommended threshold" and later cites a "benchmark of 45 per 10 000 population".
- **WHO's threshold:** *Global Strategy on Human Resources for Health: Workforce 2030*, Annex 1, gives "an indicative threshold of an aggregate density of 4.45 physicians, nurses and midwives per 1000 population", which is 44.5 per 10,000. The same annex says this "does not represent a planning target for countries".
- **Decision:** Use WHO's figure: "about 23 doctors, nurses and midwives per 10,000 people in 2022". Use 44.5 as the threshold. Say "about half", not "less than half", because 23 / 44.5 = 52%. Link both WHO sources.
- **Removed:** "Just over 22". I couldn't trace it to a WHO primary source. It may come from Zimbabwe's 2022 Health Labour Market Analysis, which counts all health workers rather than doctors, nurses and midwives. (Open question 2.)

### New Public Health Order
- **Source confirmed:** Africa CDC, "The New Public Health Order: Africa's health security Agenda" (4 April 2023), https://africacdc.org/news-item/the-new-public-health-order-africas-health-security-agenda/.
- **The five pillars:** "Strengthened public health institutions", "Strengthened public health workforce", "Expanded manufacturing of vaccines, diagnostics and therapeutics", "Increased domestic resources for health security" and "Respectful and action-oriented partnerships".
- **The Platform supports four:** institutions, workforce, domestic resources and partnerships. It does not cover manufacturing.

## Phase log

- **Phase 0:** Audit, screenshots and scripts. Committed.
- **Phases 1 to 3:** Committed together, because the design system, the icon sprite and the rebuilt sections share the same generated pages and stylesheet bundles.
  - **Phase 1, design system** (`styles/design-system.css`, loaded last on every page)
    - The build now wraps the page stylesheets in a cascade layer, `@layer legacy`. The design system's unlayered rules therefore win without `!important`.
    - Old teal heading and nav tokens now point at navy.
    - It adds the type scale, the cream, white and navy surfaces (with an original contour pattern, `assets/patterns/contour.svg`, at 5%), one eyebrow style, one card, icon tiles, chips, buttons, links, focus rings, a pull quote, a banner, the accordion, the timeline, tables, forms and device frames.
    - Text under 13px is gone. The one exception is the SDG captions: their text was resized and the icons and disclaimer left untouched.
    - Gold text on light grounds uses #8a5800 (6.0:1 on white), because the brand gold #E8A020 passes only on navy (6.6:1).
  - **Phase 2, icons**
    - The icon font and `styles/icons.css` were deleted. Phosphor Icons 2.1.1 are drawn from one sprite, `assets/icons/sprite.svg`, with the licence alongside it.
    - `tools/build-icons.mjs` builds the sprite from the icons the pages reference.
    - **Naming:** the brief writes `#name`. Duotone symbols for card tiles used `#name`, and regular symbols for inline UI used `#name-line`, so one sprite held both weights. The SelNexa icon set replaced this; see "Icon set" below.
    - **Brief icons:** every icon named in the brief exists in 2.1.1, so no substitutions were needed.
    - **Emoji replaced:** 🏠 house, ℹ️ info, ✨ squares-four, 📚 article, 📞 phone, 💼 tag ("Pricing discussion") and 📅 calendar-check.
    - **Icon-font mappings:** user-md to stethoscope, file-medical to file-text, arrow-up to trend-up, user-shield to user-circle-check, and boxes to package.
  - **Phase 3, sections**
    - Home mission cards.
    - Features design principles, with WHO and Africa CDC sources. The `#five-cs` anchor is kept for old links.
    - About: mission, thesis and values; Leave no one behind on a navy band; the timeline.
    - The FAQ accordion. Its FAQPage JSON-LD is now generated from the accordion by the build (`<!-- sx:faqpage -->`).
    - Careers.
    - The workforce figure now follows WHO on Home, Features and Administration.
- **Phase 4, blog**
  - **Navigation:** "Blog" sits between About and Contact, marked current on blog.html and every page under blog/. The FAQ now marks About, its group in the footer.
  - **Header width:** with eight items it no longer fits at 1024px; "Book a demo" was cut off. Nav text stays at 15.2px, and the header switches to its menu button below 1200px instead (`site-chrome.css` and `site-core.js`). Checked at 1024 (menu button), 1200, 1280 and 1440 (full nav).
  - **One list of posts:** `data/posts.json` drives the listing (featured card, then a grid, with an empty state while there is only one post) and the homepage "From the blog" strip, placed above "Follow the build".
  - **Reading time:** computed from the article text at 220 words a minute. The post said "5 min read"; the count gives 4.
  - **Post template:**
    - The author line now reads "Keith Tafangombe, Founder and CEO".
    - Share links (LinkedIn, X, WhatsApp, copy link) are generated from the canonical URL. Copy link was tested: it writes the URL and announces "Link copied".
    - "Back to blog" sits at the top and the bottom, with a navy "Book a demo" panel above the bottom link.
    - Body text is 18px with 1.7 line height, at no more than 68ch.
    - The existing BlogPosting JSON-LD (a kind of Article) is kept.
  - **Meta:** the blog.html description, og:description and twitter:description no longer promise articles on AI or telemedicine.
  - **Heroes:** inner-page heroes now fit their content. They were 88% of the screen tall, with a large empty band; the homepage keeps its tall hero.
- **Phase 5, every other page**
  - **Sentence case:** 195 headings and button labels, with names, job titles, project and product names kept.
  - **Screenshots:** Platform screenshots cut from the demo videos (WebP and AVIF, 640px and full width) go in laptop frames on the home flagship section, the modules page and Hospital management. The Features module screenshots are framed too.
  - **Comparison table:** status chips with icons (Yes, No, Varies) replace the ✓ and ✗ characters. The feature names are now row headers.
  - **Navy bands:** every closing call to action is a deep navy band, so each long page has one. The Data protection page's closing section joined them.
  - **Alternation:** the build alternates cream and white down every page.
  - **Phone gutters:** sections that have a container no longer add 32px of their own padding on phones.
  - **Old overrides removed:** `!important` button colours that beat the design system are gone, and bare `.btn` links now have a variant. A legacy `transition: all` had delayed link focus rings by 0.3s; links now transition only their colours.
  - **Card heights:** cards with very different contents (team, contact methods, the top cards on Careers) size to their content.
  - **Thin pages:** Guides, Webinars and White papers list material that is "available by request" or "scheduled by request". That is their "coming soon" state, now tidy, with chips and icons.
- **Phase 6, assets**
  - `scripts/process-assets.mjs` uses sharp and SVGO to turn `design-assets/incoming/` into kebab-case WebP and AVIF at 1x and 2x, plus optimised SVG. Files in `incoming/icons/` are refused.
  - `design-assets/ASSET_REQUESTS.md` lists twelve slots with sizes. Nothing has arrived yet.
- **Phase 7:** see below.
- **Icon set, after Phase 7.** Keith's icon brief (`design-assets/icons/selnexa/README.md`) assigns 74 named icons to content slots.
  - The 74 icons are Phosphor 2.1.1 regular icons under SelNexa names. The source sprite is in `design-assets/icons/selnexa/`, and `tools/build-icons.mjs` copies the ones the pages use into `assets/icons/sprite.svg`, with `LICENSE-phosphor.txt` beside it.
  - **Placed:** 73 of the 74, each in the slot the brief names. On pages where a slot had no icon before (Security, Data protection, investors, Impact, Features specifications, the blog byline), the icons sit in small 36px tiles at the start of each row, so every row in a table has one.
  - **Not placed:** `timeline-incorporated`. The About timeline has no incorporation entry, and the site does not state an incorporation date anywhere. Keith decided to leave the timeline as it is (open question 7).
  - **Added text:** three key points under the home hero's buttons ("Works without internet", "Keeps running in power cuts", "Patient data stays in Zimbabwe"), which repeat claims the site already makes. The Data protection page lists what Full compliance includes, with an icon per item; the card's sentence now points to that list.
  - **One style:** every other icon on the site, including slots the brief does not list, is now Phosphor regular (`#name-line`), so the duotone weight is gone. Tiles are the brief's pale gold square with a navy icon on every surface, including the navy bands.
  - **Share buttons:** LinkedIn, X and WhatsApp use each company's logo in its brand colour (`design-assets/icons/brands/`, paths from Simple Icons, CC0). Copy link uses `blog-copy-link`.
  - **Phones:** in tables, a row's icon sits above its label, so the description column keeps its width.

## Phase 7: verification

### How it was checked

- `node scripts/audit.mjs after` reruns every Phase 0 check on all 31 pages. Its results are in `audit/after.json`, which is kept out of git.
- `node scripts/screens.mjs after` takes 124 screenshots into `audit/after/`. These were compared with `audit/before/` page by page.
- Lighthouse (mobile, simulated throttling) ran three times per page on a local copy of the site, and the table shows the median. The JSON reports are in `audit/lighthouse/`, which is kept out of git.

### Results

| Check (31 pages, 4 widths) | Before | After |
|---|---|---|
| Horizontal overflow | 0 | 0 |
| Words split mid-word | 2 (Careers, 1440px) | 0 |
| Text under 13px (element instances) | 975 on 30 pages | 0 |
| Cards with 120px or more of empty space | 27 | 6 (rows of like cards kept level: principles, modules, a benefit card) |
| axe-core violations (375 and 1280px) | 0 | 0 |
| Console errors or failed requests | 0 | 0 |
| Broken internal links | 0 | 0 |
| Pages without exactly one H1, or with skipped levels | 0 | 0 |
| Pages using the icon font | 16 | 0 |
| Pages with emoji or symbol icons | 3 | 0 |
| Title Case headings | 107 | 19, all names, job titles or product names |
| Header markup identical on every page | 30 of 30 | 30 of 30, Blog present and marked current on blog pages |
| Focus stops without a visible ring | 2 (video controls) | 2, the same native video controls, which draw their own ring |

Keyboard focus was checked on the homepage. All 38 stops show a 3px ring: navy on light grounds, gold on dark ones, and navy on white cards inside dark bands. The header and demo dialog use navy, because gold on cream is only 2:1.

The before and after screenshots were compared page by page. No page lost content.

### Lighthouse (mobile, median of three runs)

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Performance runs |
|---|---|---|---|---|---|---|---|---|
| Home | 58 | 100 | 100 | 100 | 3.4 s | 3.9 s | 0 | 58 / 54 / 62 |
| About | 61 | 100 | 100 | 100 | 2.8 s | 4.3 s | 0 | 60 / 61 / 62 |
| Blog | 61 | 100 | 100 | 100 | 2.7 s | 5.0 s | 0 | 62 / 61 / 61 |
| Blog post | 61 | 100 | 100 | 100 | 3.0 s | 2.4 s | 0 | 61 / 61 / 66 |
| Careers | 65 | 100 | 100 | 100 | 2.7 s | 2.6 s | 0 | 66 / 61 / 65 |
| FAQ | 62 | 100 | 100 | 100 | 2.7 s | 5.0 s | 0 | 62 / 65 / 61 |
| Features | 65 | 100 | 100 | 100 | 2.9 s | 1.9 s | 0.007 | 68 / 65 / 61 |

**Performance is below the 90 target on this machine, and the cause is the machine.**

- Lighthouse rated the test machine at a benchmark index of 420 to 576; a typical desktop scores about 1,500. Mobile mode then slows the CPU four times more.
- Most of the blocking time is "Other" work that Lighthouse cannot attribute to the page. On the blog listing that was 4.7 of its 5 seconds.
- To separate the machine from the change, the unchanged `main` branch (c5ba879) was measured straight after, under the same conditions:

| Page | `main`, performance (runs) | `ui-refresh`, performance (runs) |
|---|---|---|
| Home | 62 (62 / 72 / 62) | 61 (62 / 61 / 61) |
| Blog | 68 (73 / 63 / 68) | 63 (62 / 63 / 63) |
| Features | 62 (75 / 62 / 62) | 64 (64 / 65 / 63) |

- The two branches overlap within the run-to-run spread. The refresh does not appear to have made the site slower, but this machine cannot show whether it reaches 90.
- The only failing audit, back/forward cache, gives the reason "CacheLimitPrunedOnCriticalMemoryPressure", which Lighthouse marks "Not actionable".
- **Next step:** measure the live site with PageSpeed Insights after merging. That measurement decides the 90 target.

## Summary by page

| Page | What changed |
|---|---|
| Home | WHO workforce figures with WHO sources. Four mission cards with Phosphor tiles, chips and even heights. A provider dashboard screenshot in a laptop frame. A "From the blog" strip. The navy call to action. Sentence case. |
| About | "Mission, thesis and values": two cards and four value tiles, with no vision statement written. "Leave no one behind" on a navy band, with a pull quote. A centred timeline with dots above the cards, vertical on phones. A compact hero. The dash in the founding story removed. |
| Features | "Four principles behind the Platform" with gold labels, WHO and Africa CDC sources, and four across at 1280px and wider. Framed module screenshots. The comparison table uses status chips. The navy call to action. |
| Careers | One "Applications opening soon" banner with "Get notified". Role icons, department chips, and a 2×2 grid with no split words. "Data Scientist, Clinical Analytics". About's mission and values. |
| FAQ | An accordion with plus and minus icons and the first question open. FAQPage JSON-LD generated from it. The link now reads "Security page". |
| Blog | A featured card, a grid that grows from `data/posts.json`, an empty state, and a corrected description. |
| Blog post | Author line, reading time, share links (copy link tested), Back to blog, a demo panel, and 18px body text at 1.7 line height. |
| Solutions (6 pages) | Phosphor icons. Feature grids instead of single stacked columns. Benefits beside their icons. Sentence case. Screenshots on the modules page and Hospital management. |
| Resources, Guides, Webinars, White papers | Phosphor icons, chips, sentence case and navy calls to action. These pages hold material "available by request" or "scheduled by request". That is their "coming soon" state, now tidy and consistent. |
| Contact, Appointments, Press, Impact, Case studies, Security, Data protection, Projects, Investors, Telemedicine, Privacy, Terms, 404 | Type scale, cards, chips, sentence case, alternating surfaces and the navy call to action. On Appointments and the 404 page, emoji were replaced by icons. On Telemedicine, the card headings are sized as cards, so they no longer split. |

## Not verified

- **Real devices.** Everything was checked in headless Chromium at 375, 768, 1280 and 1440px. It was not checked in Safari, Firefox or on a real phone. `text-wrap` and `:has()` are progressive enhancements: older browsers wrap headings normally and keep the 32px section padding on phones.
- **Live Lighthouse.** The scores above come from a local server on a busy machine. GitHub Pages compression and caching will change them.
- **Share links.** LinkedIn, X and WhatsApp open their own share pages, which need a published URL to preview. Only copy link was exercised.

## Open questions for Keith

1. **Vision statement.** About has "Mission, thesis and values" and no vision. Send a vision statement and it becomes a third card beside the mission and the thesis.
2. **Zimbabwe workforce figure.** The site now says "about 23 doctors, nurses and midwives per 10,000 people in 2022" (WHO Regional Office for Africa, 1 July 2026), against WHO's indicative threshold of 44.5 (Workforce 2030).
   - The old "just over 22" isn't in either WHO source.
   - Note that 23 against 44.5 is about half. WHO's own article says "less than half", but it doesn't say which threshold it used.
3. **Careers mission and values.** Careers now uses About's mission sentence and four values. Say if Careers should keep its own wording.
4. **Asset slots.** `design-assets/ASSET_REQUESTS.md` lists twelve slots, each with a size: a blog cover, six Open Graph images, three section illustrations, team portraits and full-resolution Platform screenshots. Nothing has arrived in `design-assets/incoming/` yet.
5. **Reading time.** The post said "5 min read". Counted at 220 words a minute, the article body comes to 4 minutes, and the site now shows that.
6. **Title tags.** Some `<title>` tags are still in Title Case, for example "Health Software That Keeps Running Offline". The brief's sentence-case rule covers headings, so the titles were left as they are. Say if they should match.
7. **Incorporation date.** Resolved: Keith decided the timeline stays as it is, starting with the founding in Harare in 2024 Q1. No incorporation entry is added, and `timeline-incorporated` stays unused.
