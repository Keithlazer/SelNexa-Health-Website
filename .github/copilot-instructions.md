# Copilot Instructions for keithlazer.github.io

## Project Overview
This repository powers the Selnexa Health website, combining static HTML pages, custom CSS/JS, and a React-based SPA in `src/`. The site includes healthcare content, calculators, and a telemedicine portal.

## Architecture & Key Directories
- **Root HTML files**: Main site pages (`index.html`, `about.html`, etc.) are static and reference assets in `/css`, `/js`, and `/resources`.
- **`src/`**: Contains a React app (SPA) for advanced features (patient portal, dashboard, etc.). Entry: `src/main.jsx`. Components are organized by domain (e.g., `auth/`, `layout/`, `pages/`).
- **`js/`**: Standalone scripts for legacy/static pages (e.g., `chatbot.js`, `calculators.js`).
- **`css/`**: Custom styles for static pages. React SPA uses `src/index.css` and `styles/main.css`.
- **`SelNexa Website/`**: Archive of older site version; do not update unless migrating content.
- **`styles/scripts/assets/`**: Logo and image assets. See asset README for optimization commands.

## Developer Workflows
- **Build React SPA**: Use Vite (`vite.config.js`).
  - Install deps: `npm install`
  - Dev server: `npm run dev`
  - Build: `npm run build`
- **Static site**: No build step; edit HTML/CSS/JS directly.
- **Asset generation**: Use ImageMagick locally (see `styles/scripts/assets/README.md`) or the `generate-assets` GitHub Action.

## Conventions & Patterns
- **React SPA**: Use functional components, hooks, and `store/` for state management (Pinia-like pattern).
- **Routing**: SPA routes in `src/pages/`, static pages use direct HTML links.
- **Styling**: Tailwind (`tailwind.config.js`) for SPA, custom CSS for static pages.
- **Legacy JS**: Avoid mixing React and legacy JS; keep logic separate.
- **Assets**: Reference images from `styles/scripts/assets/` for new content.

## Integration Points
- **Service Worker**: `sw.js` for offline support.
- **Manifest**: `manifest.json` for PWA features.
- **Sitemap/robots**: SEO files in root.

## Examples
- To add a new React page: create in `src/pages/`, add route in `src/App.jsx`.
- To update a static page: edit the corresponding HTML in root.
- To optimize a logo: follow commands in `styles/scripts/assets/README.md`.

## Additional Notes
- Do not edit files in `SelNexa Website/` unless migrating legacy content.
- Keep SPA and static site logic separate.
- Reference assets and styles from their respective folders for consistency.

---
_If any section is unclear or missing, please provide feedback for further refinement._
