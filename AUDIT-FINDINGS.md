# Audit findings

Branch `site-rebuild-2026-10`, October 2026. Line numbers refer to the files on `main` at commit `21c14f9`, before any change on this branch.

This file does not name the facility where the Q3 2024 proof of concept ran, the facility confirmed as the next pilot site, or the two foreign compliance regimes removed under rule 4. They are called "the Q3 2024 validation facility", "the next pilot facility" and "the US and EU compliance badges" below, so a search of the repository for those names comes back empty.

## Read this before merging

- **The GitHub repository is public** (`Keithlazer/SelNexa-Health-Website`). This file and `CONTENT-TODO.md` will be readable by anyone on GitHub once the branch is pushed. They are kept off the website itself by `_config.yml`, but that does not make them private.
- **Git history still contains the removed names.** Every commit before this branch includes the Q3 2024 validation facility and the next pilot facility in page source. Removing them from history needs a history rewrite and a force push, which the brief rules out. Your call; see `CONTENT-TODO.md`.
- **Nothing has been pushed or deployed.** All work is committed locally on this branch.

## Phase 1. Compliance and credibility

### Publishing scope

| Location | Finding | Action |
|---|---|---|
| Site root (no `_config.yml`) | GitHub Pages runs Jekyll, so every tracked file was public, including internal `.md` files rendered as pages (for example `/SITE_AUDIT_REPORT.html`), `dist/`, `SelNexa Website/`, the React source in `src/`, and `modern-design-demo.html`. Several of these named the Q3 2024 validation facility or carried invented content. | Added `_config.yml` that excludes internal documents, archived material, source and tooling from the published site. Files stay in the repository. |
| `dist/` (whole folder) | Stale Vite build of an older homepage, publicly served at `/dist/`. Named the next pilot facility (`dist/index.html:765`, `:855`) and showed the US and EU compliance badges. Nothing linked to it. | Deleted. Added `dist/` to `.gitignore`. |
| `SelNexa Website/index.html.bak` | Old homepage backup, publicly served, with invented patient testimonials (lines 1579-1591). | Deleted. The rest of `SelNexa Website/` is excluded from publishing but kept. |
| `assets/Untitled_Document.md` | 659 KB pasted terminal session log, publicly served, naming the Q3 2024 validation facility 15 times. | Deleted. |
| `FINAL_VERIFICATION_CHECKLIST.md`, `STRATEGIC_REFINEMENTS_SUMMARY.md`, `SITE_AUDIT_REPORT.md:492` | Internal notes from an earlier pass whose strategy was to lead with the Q3 2024 validation facility. Publicly served. | Facility name replaced with a neutral reference and a dated note added at the top of each. Now excluded from publishing. |

### 1.1 Q3 2024 validation facility

| File:line | Finding | Action |
|---|---|---|
| `case-studies.html:7`, `:216` | Meta description and JSON-LD description named the facility. | Rewritten without it. |
| `case-studies.html:59`, `:219` | Tab link and JSON-LD breadcrumb pointed to an anchor named after the facility's province and named the facility. | Anchor is now `#validation-2024`, label "Q3 2024 Validation". |
| `case-studies.html:97-111` | Section built around the facility, plus four alias anchors left over from earlier invented case studies (`#bulawayo`, `#analytics-pilot`, `#procurement-sa`, `#ehr-project`). | Replaced with a section about the validation work itself: controlled testing of core workflows in a working facility in Q3 2024, what it confirmed about the write queue, how it shaped the hardening work, and why no number is attached. No facility, province or identifying detail. Alias anchors removed and the links to them deleted (see 1.7). |
| `about.html:190` | Founder bio said Keith architected the proof of concept at the facility. | Bio rewritten without the facility. |
| `about.html:278` | Timeline entry for 2024 Q3 named the facility. | Now "Controlled testing of core Platform workflows in a working health facility." |
| `for-investors.html:75`, `:234` | Hero subtitle and founders' letter named the facility. | Rewritten. |
| `solutions/hospital-management.html:146`, `:175-176` | Benefit card and "validation snapshot" heading named the facility. | Rewritten. |
| `blog/ai-healthcare-africa.html:106` | Named the facility. | Rewritten. |
| `js/mapdata.js:52` | Unused map data file (no map library loads it) saying "Pilot active with [facility] context". Publicly served. | Deleted. |
| Seven placeholder "partner" logos in `styles/scripts/assets/` (`harare-central-logo.svg`, `johannesburg-clinic-group-logo.svg`, `lagos-health-grid-logo.svg`, `nairobi-carenet-logo.svg`, `partner-1.svg`, `partner-2.svg`, and one named after a town in the validation facility's province), plus two copies in `assets/` | Unreferenced placeholder logos implying partners that do not exist. | Deleted. |
| `src/pages/Home.jsx:540` | React demo app (not deployed) carried three invented testimonials, one attributed to a district facility in the same province. | Replaced with a single clearly labelled placeholder. The rest of `src/` is flagged in `CONTENT-TODO.md`. |
| Product imagery | Checked every screenshot, the hero mockup and frames from both demo videos (OCR every two seconds). Neither facility appears in any image or video frame. | No action needed for these two names. See "Product imagery" below for other real hospital names. |
| Pitch deck PDF (`assets/selnexa-health-pitch-deck.pdf`) | Text and images checked. Neither facility appears. | No change. |

### 1.2 Next pilot facility

The brief's replacement wording was "a district hospital in Zimbabwe". I used "a public hospital in Zimbabwe" because, as far as I can tell, the facility is a provincial rather than a district hospital, and "public hospital" is true either way. Change it back if I'm wrong. Every location carries an HTML comment: `Facility name withheld until written approval is in hand. Restore it here once approval exists (see CONTENT-TODO.md).`

| File:line | Action |
|---|---|
| `index.html:764` (deployment pipeline stat card), `index.html:854` (Zimbabwe market line) | Unnamed, comment added. |
| `case-studies.html:60`, `:93`, `:116`, `:137`, `:220` | Unnamed throughout; section heading is now "Next: our first measured pilot". |
| `for-investors.html:75`, `:234`, `:415` (a `hidden` FAQ block still present in the page source) | Unnamed; the hidden block was deleted. |
| `solutions/hospital-management.html:156`, `:176` | Unnamed. |
| `blog/ai-healthcare-africa.html:106` | Unnamed. |
| `resources/guides.html:79` | Card rewritten as a validation note linking to the Impact page. |
| `about.html:281`, `impact.html` | New status text describes the first pilot without a name; comments added. |

### Product imagery (rule 3)

| Asset | Finding | Action |
|---|---|---|
| `assets/queue-management-interface.png` (+ `.webp`, `.avif`) | Facility selector reads "Demo - Harare Central Hospital", a real hospital. Used on four pages. | Field repainted to read "Demo facility". |
| `assets/ehr-system-screenshot.png` (+ `.webp`, `.avif`) | Shows "Facility Demo - Harare Central Hospital" and two realistic Zimbabwean mobile numbers for a demo patient and her emergency contact. | Facility changed to "Sample Hospital"; both numbers replaced with `+263 77 000 0000` / `000 0000` in case they belong to real people. |
| `assets/dashboard-hero.svg` (3.2 MB) | The tilted phone in the hero mockup shows the same real hospital name. | Rendered to WebP at 480/800/1200 px with the field blurred; homepage now uses those. The SVG and two copies were deleted. |
| Both demo videos | Patient demo shows "Demo - Harare Central Hospital"; provider demo shows "Demo - Mpilo Central Hospital". Both are real hospitals used as demo data. | Not changed in Phase 1. Flagged in `CONTENT-TODO.md`; see Phase 4 for what was done when the videos were re-encoded. |
| `assets/africa-map` (was `Africa Map.svg`, 6 MB) | The image has a key baked in: Zimbabwe "Pilot active", others "in active talks". No pilot is active. | Re-rendered as WebP/PNG (46 KB) with the key removed. The HTML legend now says "First pilot, pending approval" and "Early conversations", with dot colours matched to the map. |
| Unreferenced duplicate screenshots in `styles/scripts/assets/` and `assets/Dashboard svg.svg` | Same real hospital name in pixels. | Deleted. |

### 1.3 Compliance signals

| File:line | Finding | Action |
|---|---|---|
| Footers: `index.html:1008-1011`, `case-studies.html:184-187`, `features.html:247`, `security-and-compliance.html:148-153`, `appointments.html:221`, `resources.html:226-231`, `pricing.html:209-214`, `careers.html:207-212`, `telemedicine.html:160-165`, `solutions/index.html:221-226`, `solutions/administration.html:231-234`, `solutions/analytics.html:207-210`, `solutions/procurement.html:207-210`, `solutions/records.html:207-210` | US and EU compliance badges, often with "SSL" and "WCAG 2.1 AA" badges beside them. | Replaced in every footer with three plain lines (not badges): aligned with Zimbabwe's Cyber and Data Protection Act and SI 155 of 2024; ISO/IEC 27001 and SOC 2 control mapping in progress; data residency configurable, in-country or regional. |
| `js/site-core.js:656` | Injected the same badges at runtime into any footer without a "quick links" block. | Injected block now carries the three accurate lines. |
| `js/seo-optimization.js:34`, `:49`, `:193` | Unused script (no page loads it), publicly served, injecting a "[US regime]-Compliant" badge. | Deleted. |
| `appointments.html:151` | Consent checkbox named after the US regime. | Renamed `data_consent`. |
| `pricing.html:123` | "[US regime] readiness checklist". | Now a data protection readiness checklist for Zimbabwe's Cyber and Data Protection Act. |
| `resources/guides.html:124` | Guide tagged with the US regime. | Tag is now "Data protection". |
| `doctors.html:459`, `testimonials.html:252` | Compliance claims inside invented content. | Pages replaced (see 1.7). |
| `src/pages/Login.jsx:259` | React demo app login footer claimed US-regime compliance. | Claim removed. |
| Act name | The brief says "Zimbabwe Data Protection Act". The statute is the Cyber and Data Protection Act [Chapter 12:07]; SI 155 of 2024 is made under its section 32. Checked against the gazette text. | Used the statutory name everywhere. |
| `security-and-compliance.html:56-118` | Controls listed under "Certified / active controls", described as "active in current deployments and reviewed in operating governance cycles". Nothing is certified and nothing is deployed. "WCAG 2.1 AA accessibility baseline" listed as active with no audit behind it. The resources link promised downloadable security material that does not exist. | Page rewritten as two status tables: built into the Platform (TLS, AES-256, RBAC, tamper-evident audit trails, consent-aware access, configurable residency, SI 155 breach workflow), and in progress or planned (data controller licensing and DPO, DPIA, ISO/IEC 27001 and SOC 2 mapping, cross-border transfer checks, independent penetration test, WCAG 2.1 AA as a target, reviewer evidence pack). The page now says plainly that no control has been independently audited and no certification is held. Breach windows (24 hours to the Authority, 72 hours to affected people where risk is high) checked against SI 155 of 2024, section 17. Row statuses need your confirmation (`CONTENT-TODO.md`). |
| `privacy.html:21`, `:23` | Claimed "essential cookies and anonymous analytics" with a cookie banner. There is no banner and no analytics; the site sets no cookies. Used the US term "PHI". | Rewritten to describe what the site does (browser storage for settings and offline form queuing), ask people not to put health information in forms, and name the Cyber and Data Protection Act with access, correction and deletion requests. Needs legal review (`CONTENT-TODO.md`). |
| `terms.html` | No foreign jurisdiction or regulator referenced. No governing-law clause. | No content change. Governing law flagged for legal review. |

### 1.4 Targets presented as results

One convention now applies everywhere, defined in `styles/site-uniform.css`: measured results may use stat cards, but only once a pilot has reported; engineering and design targets are rows in a `.spec-table`, each labelled "Target" in the row; projections appear only on the investor page, as tables or charts.

| File:line | Finding | Action |
|---|---|---|
| `index.html:753-778` | Three stat cards with count-up animation: "1 pilot context documented", "95%", "< 4". | Spec table: next pilot site (status), offline continuity (target), sync over 2G (target). |
| `about.html:310-336` | Four stat cards for design targets. | Spec table with "Target" in each row. |
| `case-studies.html:73-93` | Four stat cards for "engineering targets for first deployment". | Spec table with "Target" in each row. |
| `impact.html:73-84` | Stat cards claiming "1 facility in active pilot" (false) and "4 countries in active deployment talks", an evaluation "expected Q3 2026" (now past), and "0 undisclosed failures". | Status table with accurate values; incident log reworded (no deployments, so no incidents). |
| `for-investors.html:119-140` | Animated counters: "$4.69B" attributed to Grand View Research, "1.2B+ underserved patients" (no source), "2x growth (Gartner, 2024)" (could not verify), "70%+ market gap" (no source). | Single external-estimate row quoting Grand View Research as published: USD 3.8 billion in 2023, 23.4% CAGR 2024-2030, about USD 16.6 billion by 2030 (report published February 2024). The $4.69B figure appears to be the 2023 value grown one year, not a Grand View number. The other three rows were removed. |
| `for-investors.html:295-315` | Financial "cards" mixing the raise, targets and model projections, headed "Current Validation". | One table with each row tagged Raising, Target or Projection, and a note that the model dates from May 2026. |
| `features.html:116`, `:133`, `:150` | "Design target" lines already labelled in text. | No change. |

### 1.5 Savings calculator

`features.html:157-183` and `js/site-core.js:769-799` produced staff hours saved and a monthly dollar value at an assumed $5 an hour, from an assumed 35% saving that was never measured. `js/roi-calculator.js` (a second, unused calculator titled "Calculate Your Clinic's Savings") was loaded on the homepage (`index.html:1031`). Both removed, as the brief prefers. Confirmation requested in `CONTENT-TODO.md`.

### 1.6 About page

| File:line | Finding | Action |
|---|---|---|
| `about.html:233-237` | Credential note saying the CMO's registration body, specialty and affiliation were pending verification, plus a generic "leadership note". | Note removed; bio trimmed to her title and role. The pitch deck lists her as "Health Liaison", not CMO; flagged. |
| `about.html:286-308` | Advisory Network section with three unnamed seats. | Section removed. |
| `about.html:375` (footer) | "Clinic Analytics". | Now "Real-Time Analytics". |

### 1.7 Pages outside the original review

**Replaced with redirect stubs** (`noindex`, meta refresh, canonical to the target; GitHub Pages cannot send a real 301):

| Page | What it contained | Now redirects to |
|---|---|---|
| `benefits.html` | Indexed page claiming "4 healthcare facilities across 2 African countries", "50 patients served", "31% faster triage documentation (pilot tracking, Q1 2026)", "22% fewer emergency stock requests". None of it happened. | `/features.html` |
| `testimonials.html` | Six invented testimonials from named people at named places, "$4.2M savings delivered", "2,500+ professionals", "12 countries", "1M+ records on blockchain". | `/case-studies.html` |
| `doctors.html` | Six invented doctor profiles with invented qualifications (hidden by CSS but in the source), a "consultations" claim and a US-regime compliance claim. | `/` |
| `blog/telemedicine-zimbabwe.html` | An invented doctor quote, an invented patient whose melanoma was caught "through our platform", and invented outcomes (85% less travel, 300% more consultations, 40% better adherence). | `/blog.html` |
| `for-funders.html` | Already a meta-refresh redirect, but the full page content (including "1 pilot context documented") was still in the source. | `/for-investors.html` |

**Fixed in place:**

| File:line | Finding | Action |
|---|---|---|
| `solutions/index.html:81`, `:97`, `:129` | "31% faster triage-to-documentation (pilot tracking, Q1 2026)", "22% fewer emergency stock requests (pilot tracking, Q1 2026)", "7% increase in patient conversions". No pilot has run. | Restated as design goals. |
| `solutions/index.html:107-113` | "End-to-end encryption", "full security". | TLS in transit and AES-256 at rest, as the security baseline states. |
| `solutions/records.html:67-74` | "Military-grade" and "end-to-end" encryption; "seamless data exchange with any EHR". | Restated as TLS plus AES-256, and FHIR R4 alignment with the named integration pathways. |
| `solutions/*.html` "Case Study Teaser" sections | Hypothetical scenarios presented under a case-study heading, each linking to a "full scenario" on the Impact page that did not exist. | Retitled "Example scenario", labelled as hypothetical, links removed. |
| `solutions/administration.html`, `procurement.html`, `records.html`, `analytics.html` benefit lists | Outcome claims stated as fact ("Workforce Capacity Expanded", "reduce expiries", "reduces no-shows"). | Restated as design intent. Feature-existence claims beyond the platform description you gave me are listed in `CONTENT-TODO.md`. |
| `index.html:788` | "Africa carries 25% of the world's disease burden... 3% of healthcare workers and 1% of global health expenditure", unattributed and slightly off. | Attributed to WHO's World Health Report 2006 with its figures: 24%, 3%, less than 1%. |
| `index.html:803`, `features.html:69` | "Only 23% of people live near a facility". No source found. | Removed. |
| `index.html:803`, `features.html:77`, `solutions/administration.html:55`, `blog/ai-healthcare-africa.html:69` | "1.55 healthcare workers per 1,000 people" unattributed, and in the blog "2.3 per 1,000 compared to the global average of 4.45". | WHO figure stated precisely: 1.55 doctors, nurses and midwives per 1,000 people in the African Region (2018 data); 4.45 is WHO's benchmark for universal health coverage, not a global average. |
| `index.html:809-810` | Results Matrix "backed by independent evaluation". No evaluation has happened. | Now says the indicators are public and the evaluation is planned. |
| `index.html:836-837`, `:846-847` | "In active talks with facilities across four markets"; map legend "Pilot active". | Rewritten: Zimbabwe first pilot pending approval; early conversations in Kenya, Nigeria and South Africa. |
| `index.html:927` | "Setup time: ~2 weeks". Unmeasured. | Removed. The pilot terms beside it are flagged. |
| `projects.html:65` | Platform labelled "ACTIVE". | "PRE-DEPLOYMENT". |
| `projects.html:99`, `:117` | Mental health and NCD statistics without sources, one slightly misquoted. | Attributed to WHO and restated as WHO publishes them. |
| `projects.html:121` | Procurement module "reducing vaccine-preventable illness across partner networks". There are no partner networks. | Restated as what the module could support. |
| `press.html:59` | "Stage: active pilot deployment". | Pre-deployment; first pilot pending approval. |
| `faq.html:64`, `:74`, `:94`, `:104`, `:114` | "Fully operational within 2 weeks", "we undergo regular security reviews", "most facilities see ROI within 6 months", "free 30-day trial with no credit card", "24/7 local support... via phone, email, and chat", "integrates seamlessly... our team handles all integration work". | Each answer restated from what is known. |
| `pricing.html:233-260` | Product JSON-LD described a "blockchain EHR" and marked all three plans "InStock". | Accurate description; availability `PreOrder`. |
| `telemedicine.html:59`, `:68`, `:123` | "Review Pilot Outcomes" (there are none), "end-to-end encryption", "deploy... in weeks". | Fixed. Whether the telemedicine beta exists at all is flagged. |
| `appointments.html:58-63`, `:154` | Embedded cal.com calendar returns 404 (`cal.com/selnexahealth` does not exist); a hidden field sent the literal string "pending-client-token" as a reCAPTCHA response; the page claimed "Protected by reCAPTCHA and queued for secure calendar synchronization". | Calendar, fake token and claim removed. `js/site-core.js` no longer injects the fake token into other forms. |
| `js/site-core.js:1305-1340` | For any visitor with a login flag in local storage, injected an "Operations Snapshot" on the telemedicine page with invented figures ("wait time down to 1.1 hours", "readmission trend improved by 12%"). | Function deleted. |
| `js/i18n.js:21-25` and equivalents in three other languages | Translation strings carrying invented metrics ("47% wait-time reduction", "62% cost reduction", "94% patient satisfaction"). Not displayed on any page but publicly served. | Removed. |
| `blog.html:91-155` | Listing paired titles with the wrong articles, repeated the invented "31%" result, advertised a "rural clinic" case study, showed visitors a developer note ("CMS Migration Ready"), and offered Shona and Ndebele filters with no posts in either. | Listing rebuilt to match the four real articles and the dates in them. |
| `blog/ai-healthcare-africa.html:87`, `:103`, `:142-146` | "AI driven administrative solutions are streamlining operations across African healthcare facilities"; "Real World Impact"; "join the AI healthcare revolution". | Restated to what is being built. |
| `resources.html:95-96`, `:119-120`, `:131-137`, `:148-156`, `:168-173`, `:190-191` | "Pilot Efficiency Whitepaper" with outcomes from pilots; a "telemedicine checklist" that does not exist; webinars implying customers ("how hospital networks use predictive ordering to eliminate stockouts"); a "FHIR API Reference" that links to HL7's public spec; demo notes "under review for facility confidentiality" while the videos are public; "pilot findings" from the removed blog post. | Each card restated or replaced with a real resource. |
| `resources/whitepapers.html:130-191` | Two invented implementation case studies; two webinar "recordings" with no evidence they exist; an always-empty "Recommended for you, based on your previous downloads" panel. | Case studies replaced with the real validation note; sessions listed as on request; panel removed. |
| `resources/webinars.html:111-157` | Two "past" webinars with recordings, presented by an "Analytics Team" and a "Security Team". | Removed with the Past tab. |
| `js/webinars.js:1-4` | Corrupted first lines (`aq`, `*****`, `+*`) made the file a syntax error, so the webinar filters never worked. | Fixed. |
| `js/resource-tracking.js` | Placeholder "recommendation engine" that threw a TypeError on every resources page load. | Deleted with the panel it served. |
| `resources/guides.html:155-160`, `:172-180` | Pagination buttons for pages 2 and 3 that do not exist; empty "recommended" panel. | Removed. |
| `case-studies.html:67-72` | Pre-existing contrast bug made the "What's Validated" heading and text white on pale green. | Fixed in `styles/site-uniform.css`. |

**Flagged, not changed (Phase 1)** (all in `CONTENT-TODO.md`): telemedicine beta and its features; the Mental Health Detection project; the "independent feasibility assessment" on the Impact page; homepage pilot terms (30-day guided pilot, no upfront commitment); pricing promises (48-hour quotes, outcome-linked discounts, Kenyan shilling billing); whitepapers and guides dated 2024 that may not exist; Africa CDC "5Cs" framework on the Platform page lists only four; module features beyond the platform description; the use-of-funds split differing between site and deck; the 2026 revenue projection; investor-page "AI procurement engine tuned to African disease burden".

## Phase 2. Positioning and messaging

### 2.1 Identity

The site described SelNexa three ways. It now says one thing everywhere: SelNexa Health is a Zimbabwean software company building offline-first systems for health institutions.

| File:line | Was | Now |
|---|---|---|
| `index.html:7`, `:23-29` (meta, Open Graph, Twitter) | "professional collective of African trailblazers and co-architects of the New Public Health Order" | Leads with what the product does (see 2.3). |
| `index.html:620` (top banner) | "A professional collective of African health leaders and young professionals co-architecting the New Public Health Order" | The company line. |
| `index.html:633` (brand tag in the header) | "Health systems innovation" | "Offline-first health software". |
| `index.html:789-790` (mission) | "operates as a professional collective of African trailblazers", "filling the 'strategic absence' of youth" | Short founding line; the collective and youth story moved to the About page. |
| `index.html:1109`, `js/site-core.js:974` (Organization JSON-LD) | "professional collective..." / "Youth-led health systems innovation organization" | Company line. |
| `about.html:6-7`, `:64-66` | "African Healthcare Innovation Organization", "professional collective of African health systems leaders" | Company headline and a plain description of what the company builds. The collective and youth-led story is now a paragraph in the founding narrative on the same page. |
| `about.html:178`, `:273` | "long-term African health systems organization", "ORGANIZATION TIMELINE" | "The clinicians, engineers and operators building SelNexa Health", "COMPANY TIMELINE". |
| `press.html:42`, `:50`, `:71` | "Zimbabwe-based professional collective", "the organization's product strategy" | Company line and boilerplate. |
| `projects.html:48`, `contact.html:51`, `:57`, `faq.html:51`, `blog.html:51`, `resources.html:56`, `resources/whitepapers.html:38` | "organization", "organizational work" | Company wording. |
| Footers: `features.html:243`, `projects.html:151`, `for-investors.html:462` | "Zimbabwe-based health systems innovation organization", "offline-first hospital management product in pre-deployment readiness" | Company line (footers are rebuilt in Phase 3). |

### 2.2 Homepage hero

| File:line | Change |
|---|---|
| `index.html:671-673` | "Co-architecting Africa's New Public Health Order." replaced by "Hospital software that keeps running when the power and the network don't." Two alternatives are in `CONTENT-TODO.md` for you to choose from. |
| `index.html:675` | Supporting line now names the product and what it covers: registration, records, procurement, billing and reporting, offline with sync. |
| `index.html:677-678` | Primary button is "Book a demo"; secondary is "Watch the demo". |
| `index.html:694` | Floating badge "Est. 2024 · Active" now reads "Pre-deployment". |
| `index.html:784` | The New Public Health Order framing moved down to the mission section heading, with a short, accurate description of what Africa CDC's New Public Health Order calls for. |
| `index.html:119-126`, `:584-591` | Hero title size reduced (desktop maximum 68px to 56px) so the longer headline fits in about four lines. Same font and weight. |

### 2.3 Titles and meta descriptions

Every indexable page has a new title (60 characters or fewer) and meta description (140 to 160 characters) that says what the page is, using the terms a buyer would search for: health service management, offline-first, hospitals, health institutions, Zimbabwe, Africa, FHIR, DHIS2. Existing Open Graph and Twitter tags were updated to match. The homepage title was "SelNexa Health | New Public Health Order Co-Architects" and is now "Offline-First Health Service Management | SelNexa Health". Pages without social tags get them in Phase 4.

### 2.4 Homepage reweighted for health institutions

`index.html:914-951` ("Work With Us") gave facilities, partners and investors equal cards. Facilities now take two thirds of the row with the primary "Book a demo" button; partners have a smaller card; investors get one quiet line linking to `for-investors.html`. The USD 4.69B market figure, the USD 150K seed amount and the "moat" framing are no longer on the homepage. The pipeline button "Apply for Pilot Access" became "Book a demo" so there is one action (see 3.2).

### 2.5 Product and module naming

- Product category: "health service management platform for health institutions" everywhere. Replaced "offline-first hospital management" and "hospital management system" in headings, meta, footers and body copy (`features.html:6-7`, `:49-50`; `index.html:826-827`; `projects.html:67`; `press.html:50`; `solutions/index.html:55`; `solutions/hospital-management.html:6-7`, `:48`, `:206`; all footer project links).
- Modules: Administration, Predictive Procurement, Health Records, Real-Time Analytics (plus Telemedicine, labelled beta). "AI Administration" is now "Administration" in every nav, footer, tab, card, form option, pricing row and chatbot message; the AI capability is described inside the module text. The slug `solutions/administration.html` already matched, so no redirect was needed. "Procurement Optimization", "Procurement Intelligence", "Unified Health Records", "Secure Health Records", "Analytics & Reporting" and "Analytics" were brought into line.
- Rule 5: removed "Clinic" as a facility type from every form and modal, renamed the "Community Clinic" pricing plan to "Health Centre" (`pricing.html:75`, `:113-115`, `:245`), changed the chatbot's options, and replaced "clinic discovery" on the Projects page (`projects.html:78`). "Clinical" and "clinician" are different words and stay.
- `js/site-core.js:571-629`: the floating widget called itself "SelNexa Assistant" and said it could answer FAQs. It is a three-option module picker, so it is now labelled "Module finder" and its suggestions no longer promise outcomes.
- `about.html:125`: "Silicon Valley 'ports'" (apparently a typo) rewritten.

**Flagged, not changed (Phase 2):** headline choice; the "Health Centre" plan name.

## Phase 3. Navigation, conversion and shared page parts

### 3.1 Navigation

| Location | Finding | Action |
|---|---|---|
| Header of every page, in five variants: `index.html:616-660`; `about.html:26-55` and the other pages on `main.css`; `solutions/records.html:22-48` and the other pages on `home.css`; `resources/guides.html:16-30` and the other resources pages; `blog/ai-healthcare-africa.html:30-52` | Eight or nine top-level items (Home, About, Platform, Projects, Impact, Investors, Resources, Contact, "Book Platform Demo") in different orders; one blog template had Home, Solutions, About, Blog, Investors, Contact instead. `js/site-core.js` then added a dark-mode toggle, a language selector and a voice-search button. On the `home.css` pages "Book Platform Demo" wrapped onto three lines at 1366px. The resources pages and `blog/future-healthcare-systems.html` showed the logo at full size, filling the first screen. At 768px the menu and the added buttons pushed five pages 166 to 371px wider than the screen. | One header for every page (`includes/site-header.html`): Platform, Projects, Impact, About, Contact, and a "Book a demo" button. The current section is marked with `aria-current="page"`. Investors, Resources, Blog, FAQ, Careers and Press moved to the footer. No page now scrolls sideways at 1366, 768 or 390px. |
| Mobile menu | Built differently in each template. | A `<button>` with `aria-expanded` and `aria-controls`, closed with Escape (focus returns to the button), 48px link rows. Without JavaScript the links show as a wrapped row instead of a menu that cannot open. |
| Mobile bottom bar (`js/site-core.js`, `setupBottomNav`) | A second navigation on phones (Home, Platform, Impact, Contact, Demo) with a different set of items from the header. | Removed. Every destination is in the header menu. |
| Language selector (`js/i18n.js`) | Offered French, Shona and Ndebele but translated only about twenty menu and button labels per language; page text stayed in English. | Removed with `js/i18n.js`. The `hreflang` alternates in page heads are handled in Phase 4. |

### 3.2 One action, one modal, forms that reach someone

**Labels.** "Book Platform Demo" (every header and most footers), "Request Pilot Demo" (`index.html:1037`, `:1073`), "Request Demo or Join Wishlist" and "Join Wishlist / Request Demo" (`about.html:409`, `:442` and the same modal on other pages), "Join Wishlist / Request Booking" (`appointments.html:155`), "Request Demo" (`solutions/hospital-management.html:52`, `:224`) and "See the Platform in action" (`case-studies.html`) are now "Book a demo" everywhere. Every one of these links points to `/appointments.html` and carries `data-demo-trigger`: with JavaScript it opens the modal, without it (or with a modifier-click) it opens the booking page.

**Modal.** Each page carried its own copies of up to two dialogs, `#demo-modal` and `#contact-modal` (for example `index.html:1034-1100`, `about.html:406-470`, `for-investors.html:517-552`), with different titles, fields and buttons, opened by inline `onclick` handlers. There is now one dialog (`includes/demo-modal.html`) holding the same form as `/appointments.html`. Opening it moves focus to the first field; Tab stays inside it; Escape, the close button or a click on the backdrop close it; focus returns to the button that opened it. Buttons can preselect the request: "Request a quote" on the pricing page selects "A quote for our institution", "Apply for Beta Access" on the telemedicine page selects the telemedicine beta.

**Forms before this phase:**

| Form | Where submissions went | What the visitor saw | Required fields, privacy, countries |
|---|---|---|---|
| Booking form, `appointments.html:61-156` | Nowhere. `action=""` and `SELNEXA_SCHEDULING_ENDPOINT` was empty. | After filling in up to 13 fields: "This form is not connected yet. Please email contact@selnexahealth.com". What they typed was not kept. | Asterisks in label text, explained nowhere. Phone, "consultation mode" and "preferred time window" were required. Privacy checkbox with no link to the policy. Six named countries plus "Other". |
| Demo modal on most pages | Nowhere, same handler | Same notice | Privacy checkbox with no link. Four countries: Zimbabwe, Nigeria, Kenya, South Africa. |
| Contact modal ("Contact Sales") and the investor version | Nowhere | Same notice | No privacy consent. |
| `contact.html:59-76` | Nowhere | Same notice | Privacy checkbox with no link. |
| Quote form, `pricing.html:147-165` | Nowhere | Same notice | Privacy checkbox with no link. |
| `solutions/hospital-management.html:207-225` | Nowhere. The inputs had no `name` attributes, so a connected endpoint would have received an empty submission. | Nothing | No consent. |
| Updates sign-up, `index.html:958`, `case-studies.html:148` | Nowhere (`handleSubscribe` with an empty endpoint) | A toast: "Updates signup is not connected yet" | No visible label, no privacy link. Promised "~1 email per month" and "quarterly notes". |
| `portal.html:17-29` | A patient-portal sign-in for a portal that does not exist. Both buttons only showed "Portal access is not enabled". No page linked to it. | | |

**Forms now.** Three forms share one handler in `js/site-core.js`:

- Demo request (`includes/demo-form.html`), on `appointments.html` and in the modal everywhere else. Required: name, email, institution, institution type, country, what they want, consent. Optional: phone or WhatsApp, role, message. Country list: Zimbabwe, then every other African country, then "Outside Africa". Institution types use "health institution" terms (public hospital, mission or private hospital, health centre, network, ministry, NGO or funder, other).
- Contact (`includes/contact-form.html`), on `contact.html`. Required: name, email, topic, message, consent. The topic is preselected from the link, so "Schedule an investor call" on the investor page opens the form with "Investment" chosen.
- Updates sign-up, on the homepage and the Impact page: one email field with a visible label, a privacy link and no promise about frequency.
- Every form marks required fields with an asterisk, explains it at the top (the asterisk is hidden from screen readers; the inputs carry `required`), and links the consent box to the privacy policy.
- On submit, each problem field gets a message tied to it with `aria-describedby` and `aria-invalid`, focus moves to the first one, and a status line is announced.
- Delivery: if `window.SELNEXA_FORM_ENDPOINT` in `js/form-endpoints.js` is set, the form posts JSON there and shows a success or error message; offline submissions are kept on the device and sent when the connection returns. The endpoint is empty today, so the form opens the visitor's email app with a pre-filled message to contact@selnexahealth.com, and the page shows the address and the WhatsApp number in case nothing opens. Without JavaScript the same forms submit through `mailto:`.
- `tools/cloudflare-wishlist-relay.js`, the Cloudflare Worker meant to receive these submissions, required a `name` field the sign-up form doesn't have, read old field names, and passed the email provider's error text back to the browser. It now accepts the new payload, caps the body size even when no length header is sent, and keeps provider errors in the Worker log. Tested with simulated requests; not deployed.

**Other conversion fixes:**

| File:line | Finding | Action |
|---|---|---|
| `pricing.html:81`, `:91`, `:101` | "Request a quote within 48 hours" linked to the on-page form. | "Request a quote" opens the demo form with the quote request selected. The 48-hour promise was not kept (it was flagged as unconfirmed in Phase 1; see `CONTENT-TODO.md`). |
| `pricing.html:145` | "Talk to sales". There is no sales team. | "Contact us". |
| `for-investors.html:58`, `:80-81`, `:445-446` | "Schedule Investor Call" in the page's own nav and two buttons, all opening the contact modal. | Links to the contact form with "Investment" selected. |
| `contact.html:109` | Listed a personal Gmail address. | contact@selnexahealth.com, and the phone number became a tappable link. |
| `appointments.html:206-207`, `contact.html:132-133`, `404.html:54-55`, `:105-106`, `faq.html:128-129`, `blog.html:166` | Buttons that navigated with `onclick="window.location.href=..."` or opened a modal with inline script. | Ordinary links. |
| `appointments.html:31` | "Use this secure form..." under the heading "UNIFIED SCHEDULING". | Plain description of what happens after sending; overline "BOOK A DEMO". |
| `for-investors.html:31` and the founders' letter | A reading-progress bar, and the letter moved above the market section by script after load. | Bar removed (the header has its own progress line). The letter now sits after the hero in the HTML, so the order no longer depends on JavaScript. |
| `manifest.json` | Shortcuts "Book Appointment", "Case Studies", "Telemedicine", "Contact Us"; description "healthcare infrastructure for African health systems". | Shortcuts "Book a demo", "Platform", "Impact", "Contact"; description matches the category phrase. |
| `portal.html` | Fake sign-in form (see above). | Redirect stub to the contact page, like the other retired pages. |

### 3.3 One header and one footer on every page

- **Build step.** `tools/build-site.mjs` copies the shared parts in `includes/` (head tags, skip link, header, footer, demo modal and form, contact form, scripts) into every page between marker comments such as `<!-- sx:footer -->`. The pages stay complete static HTML, so nothing depends on JavaScript and GitHub Pages needs no build. `npm run build:site` updates the pages; `npm run check:site` fails if any page is out of date. `includes/README.md` explains how to edit them.
- **Footers.** Each template had its own footer with its own links. Nineteen pages, `includes/footer.html` and `js/site-core.js` linked to X and YouTube profiles or a LinkedIn company URL (`/company/selnexahealth`), all of which return 404. The new footer carries the company line, Harare, contact@selnexahealth.com, the LinkedIn page that exists (`/company/selnexa-health`), Platform, Projects, Company and Data protection columns, the three compliance lines from Phase 1 and the legal name.
- **Organization structured data.** Two static blocks (`index.html:1103-1131`, `for-investors.html:554-570`) listed the dead profiles and a `sales@` address, and `js/site-core.js` injected a third version at runtime. One block now ships in the head of every page, with the legal name, founder, Harare address, contact email and the working LinkedIn page.
- **Skip link and main landmark.** Every page now starts with the same skip link and has `<main id="main-content">`. The id was added on `privacy.html`, `terms.html` and the three resources pages; the article on `blog/future-healthcare-systems.html` is now wrapped in `<main>`.
- **Script that deleted page elements.** `index.html:1184-1225` ran for four seconds after load and removed any fixed or absolutely positioned element with a z-index of 900 or more. That would have deleted the skip link and the floating buttons. Removed.
- **Floating widgets.** The module finder and WhatsApp button looked different on each template (teal on some, red to navy on others). On `blog/ai-healthcare-africa.html` they had no styles at all: the finder's text and the mobile bottom bar printed below the footer, and the finder's heading was pinned over the site header by a `header { position: fixed }` rule meant for the old header. Their Font Awesome icons were blank on pages that don't load Font Awesome, and the WhatsApp icon file had the logo in a small part of a wide canvas, so it rendered tiny. Both widgets are now styled once in `styles/site-chrome.css` with inline SVG icons, grouped in a labelled `aside`; the finder opens and closes with `aria-expanded`, Escape and focus return. The WhatsApp button uses a cropped copy of the icon (`assets/whatsapp-icon.svg`) on a darker green so the white icon passes 3:1.
- **Old rules that fought the new header.** Removed `header { position: fixed }` from `styles/home.css` and `styles/selnexa-main.css` (it also pinned article headers), each template's widget rules, and 85px of bottom padding on phones that only existed for the bottom bar.
- **Deleted.** `js/main.js`, `js/home.js`, `js/i18n.js`, `js/selnexa-main.js`, `js/ai-config.js`, `js/include-loader.js` (no page used it), `js/performance-tracking.js` and `js/service-worker.js` (a second service worker that nothing registered), `includes/header.html`, `includes/footer.html`. `js/site-core.js` was rewritten around the new header, modal and forms, without the theme toggle, voice search, translation, toast notices and runtime footer and menu rewriting.
- **Service worker.** `sw.js` precached `/js/main.js`, `/js/home.js` and `/js/i18n.js`; with those files gone, one missing file would have made every install fail. The list now names only files that exist, the cache version is bumped, and the shared CSS and JS URLs carry a content hash so a returning visitor's service worker cannot pair new pages with an old cached script.
- **Home-screen icon.** Three pages pointed `apple-touch-icon` at the SVG logo, which iOS ignores. Every page now links a 180px PNG (`assets/apple-touch-icon.png`).

### 3.4 Links

- **Project links.** The footer's ContraWise and Maternal Health links go to `/projects.html#contrawise` and `#maternal-health`. The project cards now carry those ids, plus `#platform` and `#mental-health`.
- **Internal link check.** All 41 HTML files: every `href`, `src`, `srcset`, `poster`, Open Graph image, meta refresh and JSON-LD URL resolved the way GitHub Pages resolves them, and every `#anchor` checked against the ids on the target page, including `#platform-demo-transcript`, `#updates-signup` and `#validation-2024`. No broken links or anchors. Every sitemap entry exists and none is a redirect stub.
- **External link check.** 26 URLs. All respond except four LinkedIn personal profiles on the About page (LinkedIn answers automated requests with status 999, so they need checking by hand) and the Facebook share link on one blog post (rejects scripts, works in a browser).
- **Pages left without links.** With the old navigation gone, `solutions/index.html` (5 inbound links on `main`) and `resources/whitepapers.html` (6) had none, and the telemedicine page had two. The footer now links "All modules" and "Telemedicine (beta)", and the Whitepapers section of `resources.html` links the library. Two pages had no inbound links on `main` either: `solutions/hospital-management.html` (now "For hospitals" in the footer) and `impact.html` (now "Results Matrix").

### Verification (Phase 3)

- `node tools/build-site.mjs --check`: every page current.
- All 33 pages at 1366, 768 and 390px in headless Chrome: no script errors, no failed requests, no horizontal scrolling, one `h1` per page.
- Interaction checks: the modal opens from the keyboard without leaving the page, focus moves in, stays in and comes back, Escape closes it; an empty submit marks seven fields and announces the problem; the pricing button preselects the quote request; a valid submit shows the email fallback with the right subject and body; the sign-up form validates and falls back the same way; the phone menu opens and closes with 48px rows; the module finder opens, takes focus and closes with Escape; with JavaScript off, all six header links show, the footer is present and the forms submit by email.
- axe-core on nine pages covering all five templates, plus the open modal: no violations in the header, footer, modal, forms or floating widgets. The page-content issues it found are fixed in Phase 4.

**Flagged, not changed (Phase 3):** contact@selnexahealth.com must receive mail, since every form falls back to it; the street address on the contact page; the privacy policy's contact address; overlap between `impact.html` and `case-studies.html`, and between `solutions/index.html` and `features.html`. All in `CONTENT-TODO.md`.

## Phase 4. Performance, file names, accessibility, SEO, security, mobile

Measurements before and after are in `BEFORE-AFTER.md`.

### 4.1 Performance

| Location | Finding | Action |
|---|---|---|
| `index.html:625-635` (hero), `index.html:996-1043` (inline script), `styles/site-uniform.css:610-619` | The homepage hero text and image sat inside a `reveal` block that stayed transparent until `js/site-core.js` ran, and an inline script then faded each hero line in from opacity 0 over up to 1.75 s. Lighthouse could not find a largest contentful paint on the local copy at all, and measured 14.3 s on the live site. | Hero, top banner and hero image are visible from the first paint. The hero keeps a short slide-in, without the fade. The inline script is gone. |
| `styles/site-uniform.css:479-498`, `styles/grid-typography-system.css:202-212`, `index.html:526-527`, the Africa map card | Every section marked `reveal` or `animate-on-scroll` was invisible without JavaScript, on every page. | They start hidden only when scripting is on and the visitor has not asked for reduced motion (`@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`). Without JavaScript, or in browsers that do not support that query, everything shows. |
| Page heads on 18 pages | Google Fonts loaded Inter and Space Grotesk on 11 pages, although no stylesheet uses them; every stylesheet names Montserrat, which loaded on only some pages. | Montserrat is self-hosted: one variable-weight file cut down to Latin characters, punctuation and the kerning and ligature features (29 KB, `font-display: swap`, preloaded), declared once in `styles/site-chrome.css`. All Google Fonts links and preconnects removed. Licence in `assets/fonts/LICENSE-montserrat.txt`. |
| Stylesheets on every page | Five to seven stylesheet requests per page, some loaded through `@import` chains (each import waits for the file before it), 17 to 34 KB compressed, most of it rules no page on the site uses. | Each page lists its stylesheets in a marker comment; `tools/build-site.mjs` joins them with the shared `site-chrome.css` and `icons.css` into one file in `styles/bundles/`, named by a hash of its content, and drops rules that match nothing in the pages using that file, the scripts or the shared parts (PurgeCSS, with a list of class names scripts add at run time). One request per page, 8 to 19 KB compressed. Checked by rendering all 33 pages with and without the unused-rule removal at 1366 and 390 px, one screen at a time: no differences. The source stylesheets are unchanged and stay the place to edit. |
| `css/webinars.css` | The first line was corrupted (`+++++*******************+-11/`), which turned the first rule into garbage, and a stray `}` near the end. | Both fixed. The first rule targeted a class no page uses and was removed. |
| Script start-up | Once the page painted early, the work `js/site-core.js` did at start-up (reading layout for the sticky header, building the floating widgets) landed after first paint and showed up as blocking time. | The header's first measurement waits for the next frame, and the floating widgets, logo strip and other non-essential parts are set up when the browser is idle. |
| Font Awesome from cdnjs on 15 pages (about 100 KB of CSS and a 147 KB font on the homepage) | Nine other pages used Font Awesome icons without loading it, so their icons were blank. Six pages loaded it and used no icons. | `tools/build-icons.py` builds a subset of the 59 icons the site uses (6 KB, plus 1 KB for the three brand icons and the one regular icon) and `styles/icons.css`, loaded on every page. The subset is renamed "SelNexa Icons" because the font licence reserves the name "Font Awesome". Licence in `assets/fonts/LICENSE-icons.txt`. |
| GSAP on 9 pages, ScrollTrigger and Swiper (CSS and JS) on the homepage | Nothing called GSAP or ScrollTrigger. Swiper ran only the integration logo strip. | All removed. The logo strip is a plain list; `js/site-core.js` turns it into a CSS-animated strip with a "Pause logos" button (WCAG 2.2.2) unless the visitor prefers reduced motion. |
| `index.html:44-52` | `main.css` and `grid-typography-system.css` linked twice. | Duplicates removed. The 516-line inline `<style>` block moved to `styles/home-page.css` (see 4.5). |
| Logo (`assets/selnexa-logo.svg`, 670 KB) | A PNG wrapped in an SVG, loaded on every page as the header logo and as the favicon. | Header uses a 128 px WebP (4 KB) with a PNG fallback; favicon is `favicon.ico` (16, 32 and 48 px); app icons are 192 and 512 px PNGs, with a maskable version. Structured data points to a 452 px PNG. The SVG stays for the press kit. |
| Team portraits (`assets/team/*.svg`, 0.6 to 1.4 MB each, 4.3 MB in total) | PNG cut-outs wrapped in SVG, shown at 210 px or less. | WebP at 320 and 640 px (8 to 21 KB each, transparency kept) with a PNG fallback and `srcset`. |
| Integration logos (`assets/*.svg`, up to 164 KB each) | PNGs wrapped in 2000 px SVGs, shown at 68 px. | 136 px WebP and PNG (1 to 3 KB each) in `assets/integrations/`. |
| Screenshots on `features.html`, `solutions/hospital-management.html`, `blog/future-healthcare-systems.html` | PNG only, although AVIF and WebP copies already existed. | `<picture>` with AVIF, WebP and PNG. |
| Demo videos (22.5 MB and 67.7 MB, 1080p at 60 fps) | Very large for a phone on a metered connection. They also showed two real hospitals as demo facilities (see Phase 1) and two realistic mobile numbers for the demo patient and her emergency contact. | Re-encoded at 720p, 30 fps, H.264 with fast start: 2.1 MB and 4.9 MB, in `assets/video/`. Hospital names and the two numbers are masked wherever they appear: frames were read with OCR ten times a second to place the masks, then the output was read again at fifteen frames a second (3,532 frames) and none of the names or numbers was found. Posters are frames from each video (WebP, 30 KB); `preload="none"`, width and height set. |
| Every `<img>` | Most had no width or height, and images below the first screen were not lazy-loaded. | Width and height on every image; `loading="lazy"` and `decoding="async"` below the first screen. The homepage hero image loads normally rather than with high priority, because the largest element on a phone screen is the headline, which needs the font and stylesheet first. |
| Unused and duplicate assets | `assets/Africa Map.svg` (5.9 MB, still published with the old "Pilot active" key baked in), four duplicate team portraits, a duplicate logo SVG, a duplicate pitch-deck PDF, the old WhatsApp SVG, an unused doodle SVG. | Deleted (recoverable from git history). |
| `css/blog.css` | Empty file (one byte), so `blog/future-healthcare-systems.html` had no article styles: the author's logo showed at 764 px and the related-article images at full width. | Article styles written using the site's colours. |

### 4.2 File names

Every published file with a space or capital letter in its name was renamed or replaced: SDG icons (`sdg-3.svg`, `sdg-9.svg`, `sdg-17.svg`), integration logos (`assets/integrations/*.webp|png`), team portraits (`assets/team/<name>-320|640.webp`), videos (`assets/video/provider-demo.mp4`, `patient-demo.mp4`), the refined logo (`selnexa-logo-refined.svg`) and the ContraWise artwork (`contrawise-logo.svg`). `SelNexa Health Logo Full 2.JPG` is an older logo with a ® mark; it is no longer linked or published (see `CONTENT-TODO.md`). The only remaining file with spaces, the project proposal PDF, was already excluded from publishing.

### 4.3 Accessibility

| Location | Finding | Action |
|---|---|---|
| All pages | axe-core found 189 colour-contrast failures across 33 pages at two widths. Causes: a bright cyan (`#00b4d8`, 2.1 to 2.5:1) used for links, labels and outline buttons; white text on the amber buttons (2.2:1); the older red (`#e63946`) and grey (`#6c757d`) of the `home.css` pages (3.8 to 4.3:1); 70% teal section labels (4.2:1). | Text uses a deeper shade of the same cyan (`#0e7490`, 4.9:1 on cream); amber buttons have dark text (8.4:1); the red and grey are a shade darker (`#d62839`, `#5c636a`); section labels are solid teal. The bright cyan stays for icons, borders and backgrounds. No failures remain. |
| Hero sections on `about.html`, `appointments.html`, `blog.html`, `contact.html`, `faq.html`, `features.html`, `for-investors.html` and the six `solutions/` pages | axe-core cannot measure text over a gradient, so these did not show up in its report; checked by eye. On the seven dark heroes the subtitle was charcoal and the outline button dark teal on dark blue, both close to invisible, and the subtitle sat off-centre under a left-aligned heading. On the solutions pages the subtitle was white on a near-white background. All of this was already the case on the live site. | Light subtitle and outline button on the dark heroes, subtitle aligned with the heading, dark grey subtitle on the solutions pages (`styles/site-uniform.css`, end of file). The homepage hero, which has its own styles, is unchanged. |
| Links in running text | Once darkened, links in paragraphs were distinguishable from body text by colour alone. | Underlined. |
| `faq.html:59-109` | The FAQ "accordion" was a set of `div`s with inline `onclick` handlers whose styles live in a stylesheet the page does not load; the answers were always visible and the arrows did nothing. | Questions are `h2` headings, answers stay visible, the dead handlers and arrows are gone. |
| `features.html:125-165`, `for-investors.html:344-356` | Tab widgets without `aria-controls`, `tabpanel` roles or labels; the video tabs had no arrow-key support. | Complete tab markup; both widgets move with the arrow keys and keep one tab in the Tab order. |
| `resources/guides.html:79-100` | Search box, category buttons and a sort menu with no script behind them; the search button and sort menu had no accessible name. | Search and category filter work (`js/guides.js`, results announced to screen readers); the sort menu (which offered "Most Popular" with no data) removed; names added. The Q3 2024 validation note was badged "Case Study"; it now says "Validation note". |
| Heading order on 8 pages | `h3` or `h4` directly under the page `h1` or an `h2` (pricing, terms, three resources pages, five solutions pages). | Levels corrected; visually hidden `h2`s where a list had no heading; promoted headings keep their previous size. |
| `index.html:583` | The top banner sat outside any landmark. | Named region. |
| Below-the-fold content | Hidden without JavaScript (see 4.1). | Fixed. |
| Logo strip | Moving content with no way to stop it. | Pause button; no motion with reduced motion. |
| Images | Checked every `img`: alt text present everywhere; decorative images (avatars beside a name, related-article thumbnails beside their title) now have empty alt text. | |

After these changes axe-core reports no violations on any of the 33 pages at 1366 and 390 px.

### 4.4 SEO

| Location | Finding | Action |
|---|---|---|
| 31 indexable pages | Open Graph and Twitter tags on 2 pages in full, partly on 7, missing on the rest. The shared image said "Pilot-ready platform" and used the old positioning. | The build step writes a complete set on every indexable page from the page's own title, description and canonical URL, so they cannot drift. New 1200 x 630 `og-image.png` in the same layout, with current wording. |
| Structured data | Organization now on every page (Phase 3). The Platform page had a minimal SoftwareApplication with an invalid category; the FAQ, About and blog pages had none or broken ones (two blog posts listed the company as a Person and used relative logo URLs; one carried the same block twice); `case-studies.html` had a "Report" with list items, which is not valid; `pricing.html` had a Product with no prices, which search engines report as an error. | SoftwareApplication (features), FAQPage (built from the visible questions and answers), Person for the founder (About), BlogPosting on all four posts. The Report and Product blocks removed. |
| `hreflang` alternates on 7 pages | Pointed to `?lang=fr`, `?lang=sn` and `?lang=nd` versions that never existed. | Removed. |
| `sitemap.xml` | Last-modified dates from August. | Regenerated from each page's canonical URL (32 URLs, stubs excluded). |
| Canonicals, `robots.txt`, `www` | Already consistent: every page has an absolute `https://www.` canonical, `robots.txt` allows everything and points to the sitemap, GitHub redirects the bare domain to `www`. | No change. |
| `404.html` | Uses root-absolute links throughout, so it works at any depth. | No change beyond the shared chrome. |

### 4.5 Security

| Location | Finding | Action |
|---|---|---|
| Response headers | GitHub Pages sends HSTS (one year) and nothing else of note. It cannot send a Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy or Permissions-Policy. | A Content-Security-Policy and referrer policy are set by `<meta>` at the top of every page (`includes/csp.html`): scripts, styles, fonts, images and media from this site only, no inline script or style, forms may post to this site or `mailto:`. Checked in a browser: an injected inline script and a CDN script are both refused. |
| Inline code | Inline scripts on `blog.html`, `resources.html` and `investors.html`, and a 516-line inline `<style>` on the homepage. | Moved to `js/blog-filter.js`, `js/resources-search.js` and `styles/home-page.css`; the redirect stub relies on its meta refresh. No inline handlers remain. |
| Client-side secrets | Searched every published file and every tracked file for API keys, tokens, private keys and internal URLs. | None found. `js/form-endpoints.js` holds only an empty endpoint; the form relay keeps its API key in Cloudflare. |

Headers GitHub Pages cannot send, for use if the site moves to a host that allows them or is put behind Cloudflare:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' mailto:; frame-ancestors 'none'; upgrade-insecure-requests
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

`frame-ancestors` and `X-Frame-Options` (protection against the site being framed) only work as headers, so they are not in the meta tag.

### 4.6 Mobile

| Location | Finding | Action |
|---|---|---|
| `resources/guides.html`, `resources/webinars.html` | 22 px wider than a 360 px screen: card grids with a fixed 350 px minimum column. | Columns can shrink to the screen width. |
| Same pages | The search boxes were white-on-white (styled for a dark hero whose colours are never defined) and their icon was invisible. | Visible white field with a border and a teal icon. |
| All pages | Tap targets under 44 x 44 px: standalone "→" links (19 px tall), selects and search inputs (19 px), filter and tab buttons (32 to 39 px), the search icon button (18 x 21 px), short footer links such as "FAQ" (31 px wide), the integration logos (42 px), the skip link (40 px). | All at least 44 px. Links inside sentences are exempt and left as they are. |
| Phone floating buttons | On a 390 px phone the WhatsApp and module finder buttons cover the ends of the full-width "Watch the demo" button on the first screen. This was already the case before this work. | Not changed; flagged here. |

After these changes no page scrolls sideways at 360, 390, 768 or 1366 px, and the tap-target check finds nothing under 44 px apart from links inside sentences.

## Repository cleanup

Requested during the work: remove redundant files. 143 files (155 MB) deleted, each checked first for references from any published page, script, stylesheet, the service worker or the build. All are recoverable from git history.

| Removed | Why |
|---|---|
| `src/`, `vite.config.*`, `tailwind.config.*`, `build/`, `.eslintrc.cjs`, the Vite logs, and the React, Vite, Tailwind and ESLint packages in `package.json` | A React demo app that was never deployed, and its tooling. |
| `SelNexa Website/`, `styles/scripts/`, `assets/SelNexa Health Platform Project Proposal - Copy.pdf`, `SelNexa Health Logo Full 2.JPG` | Archived copies of old assets: original videos, proposal PDFs, an old logo. Already excluded from publishing. |
| 14 internal reports in the root (`COMPLETION_REPORT.md`, `SITE_AUDIT_REPORT.md` and others) and `README-site.md` | Notes from earlier passes that describe pages, scripts and claims that no longer exist. Replaced by this file, `CONTENT-TODO.md`, `BEFORE-AFTER.md` and a new `README.md`. |
| `js/a11y-mobile-test.js`, `calculators.js`, `chatbot.js`, `clear-sw.js`, `symptom-checker.js`, `worldmap.js`; `css/main.css`, `global.css`, `performance.css`, `symptom-checker.css`, `article.css`; `styles/critical.css`; `patch.css` | Loaded by no page. |
| `modern-design-demo.html`, `llms.txt` (empty), `CNAME.txt`, `docs/CNAME` | A design test page, an empty file, and copies of `CNAME`. |
| `test-results/`, `tools/mobile-smoke/`, `tools/a11y-scan.js` and its report | Old screenshots and a scanner that no longer ran. |
| Five GitHub workflows (`clean-printed-css`, `fix-selnexa-printed-css`, `generate-assets`, `run-all`, `formsubmit-test`) and `.github/scripts/clean_html.py` | Manual workflows written for the old file layout. Four of them rewrite files and push to the repository; the fifth posts a test message to a personal email address through a form service the site no longer uses. The Lighthouse workflow is kept. |

Also: `LINK_OUTREACH.md` and `SEO_GUIDE.md` moved to `docs/`; `README.md`, `assets/README.md` and `.github/copilot-instructions.md` rewritten to describe the site as it now is; `_config.yml` and `.gitignore` trimmed to match. Removing the unused scripts changed what the unused-rule removal sees, so the stylesheet bundles were rebuilt and every page compared screen by screen with the Phase 4 commit at 1366 and 390 px.

The files are gone from the current tree but remain in the public history (see `CONTENT-TODO.md`, Repository).
