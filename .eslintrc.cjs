module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    "SelNexa Website/",
    "test-results/",
    "src/",
    "js/webinars.js"
  ],
  rules: {}
};
