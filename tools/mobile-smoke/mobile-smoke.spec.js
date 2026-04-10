import { test, expect, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const outputDir = path.join(__dirname, 'screenshots');
const reportPath = path.join(__dirname, 'report.json');

const routes = [
  '/index.html',
  '/appointments.html',
  '/telemedicine.html',
  '/resources.html',
  '/resources/guides.html',
  '/blog.html',
  '/blog/future-healthcare-systems.html',
  '/solutions/index.html',
  '/solutions/hospital-management.html',
  '/privacy.html',
  '/terms.html',
  '/SelNexa%20Website/blog.html',
  '/SelNexa%20Website/index.html'
];

const viewportProfiles = [
  {
    id: 'iphone-se',
    contextOptions: {
      ...devices['iPhone SE']
    }
  },
  {
    id: 'vp390',
    contextOptions: {
      ...devices['iPhone 12'],
      viewport: { width: 390, height: 844 },
      screen: { width: 390, height: 844 }
    }
  },
  {
    id: 'android-landscape',
    contextOptions: {
      ...devices['Pixel 5'],
      viewport: { width: 640, height: 360 },
      screen: { width: 640, height: 360 }
    }
  }
];

function safeName(route) {
  const cleaned = route.replace(/^\//, '').replace(/\.html$/i, '') || 'root';
  return cleaned.replace(/[\\/%:?&=#.]+/g, '_');
}

function intersects(a, b) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

test('mobile smoke matrix', async ({ browser }) => {
  fs.mkdirSync(outputDir, { recursive: true });

  const results = [];

  for (const profile of viewportProfiles) {
    const context = await browser.newContext(profile.contextOptions);

    for (const route of routes) {
      const page = await context.newPage();
      const issues = [];
      const url = `${baseUrl}${route}`;

      try {
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        if (!response || !response.ok()) {
          issues.push(`http-${response ? response.status() : 'no-response'}`);
        }

        await page.waitForTimeout(250);

        const state = await page.evaluate(() => {
          const de = document.documentElement;
          const body = document.body;

          function getRect(selector) {
            const el = document.querySelector(selector);
            if (!el) return null;

            const style = getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) {
              return null;
            }

            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return null;

            return {
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height
            };
          }

          return {
            viewportWidth: window.innerWidth,
            overflowPx: Math.max(de.scrollWidth, body ? body.scrollWidth : 0) - window.innerWidth,
            rects: {
              bottomNav: getRect('.bottom-mobile-nav'),
              chatbotToggle: getRect('.chatbot-toggle'),
              mobileToggle: getRect('.mobile-menu-btn') || getRect('.hamburger'),
              themeToggle: getRect('.theme-toggle-btn'),
              languageSelector: getRect('.language-selector'),
              voiceSearch: getRect('.voice-search-btn')
            }
          };
        });

        if (state.overflowPx > 1) {
          issues.push(`horizontal-overflow-${Math.round(state.overflowPx)}px`);
        }

        const rects = state.rects;
        if (rects.bottomNav && rects.chatbotToggle && intersects(rects.bottomNav, rects.chatbotToggle)) {
          issues.push('chatbot-overlaps-bottom-nav');
        }

        const topControls = [rects.mobileToggle, rects.themeToggle, rects.languageSelector, rects.voiceSearch].filter(Boolean);
        if (topControls.length) {
          const maxRight = Math.max(...topControls.map((item) => item.right));
          if (maxRight > state.viewportWidth + 1) {
            issues.push(`top-controls-overflow-${Math.round(maxRight - state.viewportWidth)}px`);
          }
        }

        const baseName = `${profile.id}__${safeName(route)}`;
        await page.screenshot({
          path: path.join(outputDir, `${baseName}.png`),
          fullPage: true
        });

        const menuToggle = page.locator('.mobile-menu-btn, .hamburger').first();
        if (await menuToggle.count()) {
          await menuToggle.click({ timeout: 3000 });
          await page.waitForTimeout(220);

          const menuState = await page.evaluate(() => {
            const activeMenu = document.querySelector('.nav-menu.active, .nav-links.active');
            return {
              menuOpen: !!activeMenu,
              bodyLock: document.body.classList.contains('mobile-menu-open')
            };
          });

          if (!menuState.menuOpen) {
            issues.push('menu-did-not-open');
          }

          if (!menuState.bodyLock) {
            issues.push('menu-open-no-body-lock');
          }

          await page.screenshot({
            path: path.join(outputDir, `${baseName}__menu-open.png`),
            fullPage: false
          });

          await page.keyboard.press('Escape');
          await page.waitForTimeout(120);
        }
      } catch (error) {
        issues.push(`exception-${String(error.message || error).split('\n')[0].slice(0, 140)}`);
      }

      results.push({
        viewport: profile.id,
        route,
        issues
      });

      await page.close();
    }

    await context.close();
  }

  const failures = results.filter((entry) => entry.issues.length > 0);
  const summary = {
    totalChecks: results.length,
    pass: results.length - failures.length,
    fail: failures.length
  };

  fs.writeFileSync(reportPath, JSON.stringify({ summary, results }, null, 2));

  console.log(`SUMMARY total=${summary.totalChecks} pass=${summary.pass} fail=${summary.fail}`);
  for (const entry of failures) {
    console.log(`FAIL ${entry.viewport} ${entry.route} :: ${entry.issues.join(',')}`);
  }

  expect(failures, 'mobile smoke failures detected').toEqual([]);
});
