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
