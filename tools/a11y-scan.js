const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const report = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walk(full);
    } else if (/\.html?$/.test(e.name)) {
      scanFile(full);
    }
  }
}

function scanFile(filePath) {
  const rel = path.relative(root, filePath);
  const text = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // 1) missing alt on <img>
  const imgRegex = /<img[^>]*>/gi;
  let m;
  while ((m = imgRegex.exec(text))) {
    const tag = m[0];
    if (!/\salt\s*=/.test(tag)) {
      issues.push({ type: 'img-missing-alt', index: m.index, snippet: tag.trim() });
    }
  }

  // 2) icon-only anchors or buttons without aria-label or sr-only
  // find anchors with <i class="..."> inside and ensure aria-label or contains sr-only span
  const anchorIconRegex = /<a[^>]*>(?:\s*)<i[^>]*>.*?<\/i>(?:[\s\S]*?)<\/a>/gi;
  while ((m = anchorIconRegex.exec(text))) {
    const tag = m[0];
    const hasAria = /aria-label=/.test(tag);
    const hasSr = /class=\"[^\"]*sr-only[^\"]*\"/.test(tag) || /<span[^>]*class=['\"][^'\"]*sr-only/.test(tag);
    if (!hasAria && !hasSr) {
      issues.push({ type: 'icon-link-no-label', index: m.index, snippet: tag.trim() });
    }
  }

  // 3) inline style attributes
  const inlineStyleRegex = /style=\"[^\"]*\"/gi;
  while ((m = inlineStyleRegex.exec(text))) {
    issues.push({ type: 'inline-style', index: m.index, snippet: m[0] });
  }

  // 4) role="menubar"
  if (/role=\"menubar\"/.test(text) || /role=\'menubar\'/.test(text)) {
    issues.push({ type: 'menubar-role', snippet: 'role=\"menubar\" found' });
  }

  if (issues.length) report.push({ file: rel.replace(/\\/g, '/'), issues });
}

walk(root);
const out = { generated: new Date().toISOString(), issues: report };
fs.writeFileSync(path.join(root, 'tools', 'a11y-report.json'), JSON.stringify(out, null, 2));
console.log('Scan complete. Wrote tools/a11y-report.json');
