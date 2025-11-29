const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const prefixwrap = require('postcss-prefixwrap');

const distDir = path.resolve(__dirname, '..', 'dist', 'embed');
const cssFile = path.join(distDir, 'selnexa-embed.css');

async function run() {
  if (!fs.existsSync(cssFile)) {
    console.error('Embed CSS not found:', cssFile);
    process.exit(1);
  }

  const css = fs.readFileSync(cssFile, 'utf8');

  try {
    const result = await postcss([
      prefixwrap('.selnexa-embed-root', { ignoreFiles: [] }),
    ]).process(css, { from: cssFile, to: cssFile });

    fs.writeFileSync(cssFile, result.css, 'utf8');
    if (result.map) fs.writeFileSync(cssFile + '.map', result.map.toString(), 'utf8');
    console.log('Post-processed embed CSS and wrapped selectors with .selnexa-embed-root');
  } catch (err) {
    console.error('postprocess failed', err);
    process.exit(1);
  }
}

run();
