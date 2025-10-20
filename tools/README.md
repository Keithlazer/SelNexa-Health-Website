A small static accessibility scanner (Node.js). It performs quick checks on all HTML files in the repo:

Checks:
- Missing alt attributes on <img>
- Icon-only anchors/buttons without aria-label or sr-only text
- Inline style attributes
- Presence of role="menubar"

Run:

1. Ensure Node.js is installed.
2. In the workspace root run:

   node tools/a11y-scan.js

Output:
- Writes JSON report to tools/a11y-report.json

Notes:
- This is a lightweight static scan and does not replace a full a11y tool like axe or Pa11y.
