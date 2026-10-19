# Shared page parts

The header, footer, demo modal, forms and a few `<head>` tags are written once here and copied into every page by `tools/build-site.mjs`. The copies are committed, so GitHub Pages serves complete HTML and nothing depends on JavaScript.

| File | Goes where |
|---|---|
| `csp.html` | Top of `<head>`: Content Security Policy and referrer policy (GitHub Pages cannot send these as headers) |
| (generated) `social` | After the canonical link: Open Graph and Twitter tags, built from the page's title, description and canonical URL |
| `head.html` | End of `<head>`: icons, manifest, theme colour, font preload, `styles/site-chrome.css`, `styles/icons.css`, Organization structured data |
| `skip-link.html` | First thing in `<body>` |
| `site-header.html` | Header and main navigation. The build marks the current section with `aria-current="page"` |
| `site-footer.html` | Footer |
| `demo-modal.html` | The "Book a demo" dialog. `{{demo-form}}` is replaced with `demo-form.html` |
| `demo-form.html` | The demo request form (also used directly on `appointments.html`) |
| `contact-form.html` | The form on `contact.html` |
| `scripts.html` | `js/form-endpoints.js` and `js/site-core.js` |

In a page, each part sits between two markers, for example `<!-- sx:footer -->` and `<!-- /sx:footer -->`. Anything between the markers is overwritten on the next build.

To change the header, footer or forms:

1. Edit the file in this folder, not the copy in a page.
2. Run `npm run build:site` (or `node tools/build-site.mjs`).
3. Commit the partial and the updated pages together.

`npm run check:site` exits with an error if any page is out of date.

`{{v:path}}` in a partial becomes a short hash of that file, so a changed stylesheet or script gets a new URL and visitors' service workers fetch the new copy.

Forms: while `window.SELNEXA_FORM_ENDPOINT` in `js/form-endpoints.js` is empty, every form opens a pre-filled email to contact@selnexahealth.com. Set it to a form relay URL to receive submissions as JSON POSTs instead, and add that URL's origin to `connect-src` in `csp.html`.

The Content Security Policy allows scripts, styles, fonts, images and media from this site only. Anything added later from another host (an analytics script, an embedded video, a booking calendar) needs its host added to the matching directive in `csp.html`, or the browser will block it. Inline `<script>` blocks, `onclick` attributes, `<style>` blocks and `style` attributes are blocked too; put code in `js/` and styles in `styles/`.

Icons come from `styles/icons.css`, a subset of Font Awesome built by `tools/build-icons.py`. After using a new `fa-` icon on a page, run that script again (instructions at the top of the file).
