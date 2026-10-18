# Content to supply or confirm

One line per item. Each needs information only Keith can give. The site shows none of these as placeholders.

## Approvals and people

- [ ] Next pilot facility: once written approval exists, restore its name at every HTML comment reading "Facility name withheld until written approval is in hand" (the name is in this repository's git history before this branch).
- [ ] Next pilot wording: the brief said "a district hospital in Zimbabwe"; the site says "a public hospital in Zimbabwe". Confirm or correct.
- [ ] Dr Farisai Mawere: supply registration body, specialty and institutional affiliation for her About page bio, and confirm her title (the pitch deck says "Health Liaison", the site says "Chief Medical Officer").
- [ ] Advisors: names, roles and written consent for each, to restore the Advisory Network section on the About page.
- [ ] Team photographs: original photos with each person's consent to publish (current portraits are illustrations wrapped in SVG files of 0.6 to 1.4 MB each).
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
- [ ] Telemedicine: confirm a telemedicine beta exists and which of its listed features are built (low-bandwidth video, AI-assisted triage, remote monitoring for chronic conditions, Shona and Ndebele interfaces). If not, remove `telemedicine.html`, its pricing mention and `blog/selnexa-telemedicine-zimbabwe.html`.
- [ ] Mental Health Detection project on the Projects page: confirm it is a real research project (the brief lists only the Platform, ContraWise and maternal health).
- [ ] "Independent feasibility assessment" on the Impact page ("How We Compare"): who carried it out, and can it be named?
- [ ] Security and Compliance page: confirm the status shown for each row, especially cross-border transfer checks (shown as in progress) and data residency (shown as built).
- [ ] Module features beyond the platform description: analytics (readmission risk, disease progression, mortality and infection tracking, Tableau and Power BI export), procurement (automatic purchase orders, supplier portals), administration (AI time-slot suggestions, automatic record filing). Confirm each is built, or remove it.
- [ ] Investor page: confirm "AI procurement engine tuned to African disease burden and seasonality".
- [ ] Platform page: the "Africa CDC 5Cs" section lists four Cs. Confirm the framework's name and the fifth.
- [ ] Pricing page: confirm "request a quote within 48 hours", "outcome-linked discounts for public-sector facilities", "local currency billing in Kenya (KES)" and "we price on outcomes".
- [ ] Use of funds: the investor page says 40/25/20/15; the pitch deck says USD 80K / 45K / 25K (53/30/17). Which is current?
- [ ] Pricing model: the deck mentions tiered plans "based on user limits"; the site says no seat licenses. Reconcile.
- [ ] Financial model: the 2026 projection (3 live facilities, USD 52.3K) can no longer happen. Supply an updated model.
- [ ] Market data: the "2-3x growth by 2028 (Gartner, 2024)" claim was removed because I could not find it. Supply the source if it exists.
- [ ] Whitepapers on `resources/whitepapers.html` dated January to March 2024: confirm they exist and can be sent on request, or remove them.
- [ ] Implementation guides on `resources/guides.html` ("available by request", "pilot-ready draft"): confirm they exist.

## Contact and operations

- [ ] Forms: no form on the site sends anywhere (the endpoints are empty). Supply a form endpoint (the Cloudflare relay in `tools/` or a FormSubmit address) so demo requests and messages reach you.
- [ ] Public email: the site and deck use seven addresses (contact@, info@, sales@, support@ and keithtafangombe@selnexahealth.com, keithtafangombe@gmail.com, support@selnexa.health). Choose the public one and confirm it receives mail.
- [ ] Demo booking calendar: `cal.com/selnexahealth` does not exist. Set one up if you want a calendar on the booking page; the form works without it.
- [ ] Demo videos: the patient demo shows "Harare Central Hospital" and the provider demo "Mpilo Central Hospital" as demo facilities. Rename the demo facilities in the Platform's seed data before recording again.
- [ ] Privacy policy: have it reviewed against the Cyber and Data Protection Act, and name the form processor once forms are connected.
- [ ] Terms of service: add governing law and have them reviewed.

## Repository

- [ ] `src/` React demo app is not deployed and contains placeholder product content (stats, ROI tool, telemedicine). Keep or delete?
- [ ] `SelNexa Website/` holds archived copies of assets (about 120 MB, including both demo videos and a 24 MB PDF). Keep or delete?
