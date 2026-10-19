# Instructions for coding assistants

This repository is the static website for SelNexa Health (www.selnexahealth.com), served by GitHub Pages. Read `README.md` first.

- Pages are plain HTML. The header, footer, forms and shared `<head>` tags live in `includes/` and are copied into the pages by `npm run build:site`. Edit `includes/`, never the stamped copies between `<!-- sx:... -->` markers.
- Stylesheets are bundled per page into `styles/bundles/` by the same build. Edit the source files in `styles/` and `css/`, then rebuild. Commit the generated pages and bundles.
- The Content Security Policy blocks inline scripts, `<style>` blocks, `style=""` attributes and anything loaded from another site. Put code in files under `js/` or `styles/`, and host fonts and images in `assets/`.
- Run `npm run check:site` before committing.

Content rules (see `AUDIT-FINDINGS.md` for the reasons):

- Publish only numbers that have been measured. Targets and projections must be labelled as such and never shown as stat cards.
- Do not name any facility as a pilot site or partner without written approval.
- Do not claim compliance with foreign health or privacy regimes. Data protection is described against Zimbabwe's Cyber and Data Protection Act and SI 155 of 2024.
- Say "health institutions", not "clinics".
- Do not invent content. Add missing material to `CONTENT-TODO.md` instead.
