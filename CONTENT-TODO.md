# Content to supply or confirm

One line per item. Each needs information only Keith can give. The site shows none of these as placeholders.

## Approvals and people

- [ ] Facility names: once written approval exists for the Q3 2024 validation facility or the next pilot facility, the names can go back in these places (both names are in this repository's git history before this branch): `index.html` (the "Next pilot site" row and the Zimbabwe line under the map), `about.html` (2026 timeline entry), `impact.html` ("Facilities in active pilot" row), `case-studies.html` ("Next: our first measured pilot" card and the paragraph starting "When the pilot goes live"), `for-investors.html` (hero subtitle and the founding paragraph), `solutions/hospital-management.html` ("Confirmed next pilot" and "Q3 2024 proof of concept" cards), `blog/ai-healthcare-africa.html` ("Proof of concept in Zimbabwe" section), `resources/guides.html` (the validation note card).
- [ ] Next pilot wording: the brief said "a district hospital in Zimbabwe"; the site says "a public hospital in Zimbabwe". Confirm or correct.
- [ ] Dr Farisai Mawere: supply registration body, specialty and institutional affiliation for her About page bio, and confirm her title (the pitch deck says "Health Liaison", the site says "Chief Medical Officer").
- [ ] Advisors: names, roles and written consent for each, to restore the Advisory Network section on the About page.
- [ ] Team photographs: the About page now serves the six cut-out portraits as small WebP files made from the old 0.6 to 1.4 MB SVG wrappers. Confirm each person is happy for their photo to be published, and send the original photos if you want sharper versions.
- [ ] Old logo file: `SelNexa Health Logo Full 2.JPG` was a different, older logo (red heart, serif type) with a ® mark. It has been removed from the repository (recoverable from git history). Confirm whether the trade mark is registered before using ® anywhere, and send a full logo (mark plus name) in the current design for the press kit.
- [ ] Pitch deck page 11: confirm permission to show the Zimbabwe government emblem under "past sponsors and collaborators".
- [ ] Git history: decide whether to rewrite history to remove the two facility names from past commits (needs a force push; the repository is public).

## Messaging decisions

- [ ] Homepage headline: choose one. Option 1 is live now.
  1. Hospital software that keeps running when the power and the network don't.
  2. Register patients, update records and order stock, with or without a connection.
  3. Patient records and stock control that hold up through power cuts and dropped networks.
  The supporting line stays the same for all three: "The SelNexa Health Platform runs registration, records, procurement, billing and reporting for health institutions. It keeps working offline and syncs when the connection comes back."
- [ ] Pricing plan "Community Clinic" was renamed "Health Centre" (rule 5). Confirm the name.

## Claims to confirm or remove

- [ ] Savings calculator: removed from the Platform page. Confirm it stays removed, or supply measured admin-time figures to rebuild it with every input editable.
- [ ] Homepage pilot terms: confirm "30-day guided pilot", "no upfront commitment" and "local implementation support".
- [ ] Telemedicine: confirm a telemedicine beta exists and which of its listed features are built (low-bandwidth video, AI-assisted triage, remote monitoring for chronic conditions, Shona and Ndebele interfaces). If not, remove `telemedicine.html`, its pricing mention, `blog/selnexa-telemedicine-zimbabwe.html`, the footer link and the "Access to the telemedicine beta" option in `includes/demo-form.html`.
- [ ] Mental Health Detection project on the Projects page: confirm it is a real research project (the brief lists only the Platform, ContraWise and maternal health).
- [ ] "Independent feasibility assessment" on the Impact page ("How We Compare"): who carried it out, and can it be named?
- [ ] Security and Compliance page: confirm the status shown for each row, especially cross-border transfer checks (shown as in progress) and data residency (shown as built).
- [ ] Module features beyond the platform description: analytics (readmission risk, disease progression, mortality and infection tracking, Tableau and Power BI export), procurement (automatic purchase orders, supplier portals), administration (AI time-slot suggestions, automatic record filing). Confirm each is built, or remove it.
- [ ] Investor page: confirm "AI procurement engine tuned to African disease burden and seasonality".
- [ ] Platform page: the "Africa CDC 5Cs" section lists four Cs. Confirm the framework's name and the fifth.
- [ ] Pricing page: confirm "outcome-linked discounts for public-sector facilities", "local currency billing in Kenya (KES)" and "we price on outcomes". The "quote within 48 hours" promise was dropped when the quote links moved to the demo form; add a response time back only if you can keep it.
- [ ] Use of funds: the investor page says 40/25/20/15; the pitch deck says USD 80K / 45K / 25K (53/30/17). Which is current?
- [ ] Pricing model: the deck mentions tiered plans "based on user limits"; the site says no seat licenses. Reconcile.
- [ ] Financial model: the 2026 projection (3 live facilities, USD 52.3K) can no longer happen. Supply an updated model.
- [ ] Market data: the "2-3x growth by 2028 (Gartner, 2024)" claim was removed because I could not find it. Supply the source if it exists.
- [ ] Whitepapers on `resources/whitepapers.html` dated January to March 2024: confirm they exist and can be sent on request, or remove them.
- [ ] Implementation guides on `resources/guides.html` ("available by request", "pilot-ready draft"): confirm they exist.

## Data protection compliance service page (`/services/data-protection`)

- [x] Inspection date: the page says inspections "will begin" on 1 September 2026, as Keith decided on 25 October 2026. Source: Veritas Bill Watch 27/2026 (28 July 2026), reporting POTRAZ Regulatory Notice 2 of 2026. If you have the notice itself, it can replace or join the Veritas link.
- [x] "The practical risk is an order to stop processing until compliant" stays as a risk assessment, not a legal claim, as Keith decided on 25 October 2026. No source is cited for it.
- [ ] Every other legal claim on the page was checked against the SI 155 text: licence for anyone who determines purposes and means (s 4(1)); tiers from 50 data subjects (s 6); six months from promulgation on 13 September 2024 (s 4(5)); 12-month validity and renewal at least 3 months before expiry (s 5); Form DP2 (s 12(2)); certification course (s 13(2)); 24 and 72 hour breach notification (s 17); level 11 or seven years for processing without a licence (s 4(6)); level 7 or two years for not appointing a DPO (s 12(6)). POTRAZ as the authority is shown on the SI's own forms. No action needed unless the law changes; update the "as at" date when you next review.
- [ ] Analytics: both "Book a readiness call" links send a `dp_readiness_call` event and the "See what inspectors check" link sends `dp_inspector_checks`, but the site has no analytics installed, so nothing is recorded yet. Enquiries are still distinguishable without it: the contact form arrives with the topic "Data protection compliance" and the subject "Message from the website: Data protection compliance".
- [ ] Positioning (the open question in the build spec): the page sits under its own Services menu item and the Platform stays the lead story everywhere else. The About page, homepage and investor page are unchanged and do not mention the service. Decide whether the About page and investor page should say SelNexa runs a compliance service, and how.
- [ ] SelNexa's own status: the page does not say SelNexa is licensed, certified or acting as anyone's data protection officer. Tell me when any of those becomes true and whether it should appear.

## Contact and operations

- [ ] Before this branch goes live, confirm contact@selnexahealth.com receives mail. Every form on the site falls back to opening an email to that address, and the footer, contact page and structured data all show it. (The site and deck used seven addresses before; only the privacy policy still gives a different one, keithtafangombe@selnexahealth.com.)
- [ ] Forms: to receive submissions without relying on the visitor's email app, deploy `tools/cloudflare-wishlist-relay.js` as a Cloudflare Worker (it needs a Resend API key and a FORM_TO_EMAIL address), then put its URL in `js/form-endpoints.js`. Instructions are at the top of the relay file.
- [ ] Contact page street address: confirm it should be public.
- [ ] About page: LinkedIn blocks automated link checks, so open the four team members' LinkedIn links by hand.
- [ ] Demo booking calendar: `cal.com/selnexahealth` does not exist. Set one up if you want a calendar on the booking page; the form works without it.
- [ ] Demo videos: the published copies now mask the two real hospitals used as demo facilities and two mobile numbers shown for the demo patient and her emergency contact. Before recording new demos, change the Platform's seed data to fictional facility names and `+263 77 000 0000`-style numbers. The unmasked originals are still in `SelNexa Website/` and in git history, both visible on GitHub because the repository is public.
- [ ] Before adding any outside service (analytics, an embedded calendar or video, a chat widget), add its host to `includes/csp.html` and rebuild, or the browser will block it.
- [ ] Privacy policy: have it reviewed against the Cyber and Data Protection Act, and name the form processor once forms are connected.
- [ ] Terms of service: add governing law and have them reviewed.

## Site structure

- [ ] Two pairs of pages overlap: `impact.html` ("Results Matrix") with `case-studies.html` (the Impact page in the menu), and `solutions/index.html` ("All modules") with `features.html` (Platform). Both pairs are linked from the footer for now. Merge them or keep both?
- [ ] The language selector (French, Shona, Ndebele) was removed because it translated only menu labels. Translated pages would need full translations.
- [ ] The phone-only bottom bar (Home, Platform, Impact, Contact, Demo) was removed because it duplicated the header menu. Say if you want it back.

## Repository

- [ ] Deleted files are still in the public git history. The repository is public, and earlier commits still hold the files removed during this work, among them the project proposal PDFs, the original demo videos (which show two real hospitals and two mobile numbers), the React demo app and the old internal reports. Removing them from history means rewriting it and force-pushing, which this work did not do. Decide whether that is needed, or whether the repository should be made private (GitHub Pages on a private repository needs a paid plan).
