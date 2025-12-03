# ⚡ Quick Reference Card

## 🚀 Start Here

```bash
# Clone repository
git clone https://github.com/keithlazer/keithlazer.github.io.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🧪 Testing Commands

### Run in Browser Console (F12)

**Accessibility Audit:**
```javascript
window.getA11yReport()
```
✅ Returns 10-point accessibility test results

**Performance Metrics:**
```javascript
window.getPerfMetrics()
```
✅ Returns Core Web Vitals (LCP, FID, CLS)

**Performance Report:**
```javascript
window.printPerfReport()
```
✅ Prints detailed performance breakdown

**Enable Lazy Loading:**
```javascript
window.enableLazyLoading()
```

**Prefetch Resources:**
```javascript
window.prefetchCriticalResources()
```

---

## 📁 Key Directories

```
/                    → Root HTML pages
/solutions/          → Solution pages (4 details)
/src/                → React SPA source
/src/pages/          → React page components
/src/components/     → Shared components
/css/                → Stylesheets
/js/                 → JavaScript files
```

---

## 📄 Key Files

| File | Purpose |
|------|---------|
| `index.html` | Homepage (ENHANCED) |
| `css/global.css` | Global styles (NEW) |
| `css/performance.css` | Performance optimization (NEW) |
| `js/seo-optimization.js` | Meta tag injection (NEW) |
| `js/a11y-mobile-test.js` | Accessibility audit (NEW) |
| `js/performance-tracking.js` | Web Vitals tracking (NEW) |
| `src/pages/Login.jsx` | Auth page (ENHANCED) |
| `src/components/auth/ProtectedRoute.jsx` | Route protection (ENHANCED) |

---

## 🔗 All 9 New Pages

1. `/solutions/` - Solutions hub
2. `/solutions/hospital-management.html` - Hospital solution
3. `/solutions/patient-engagement.html` - Patient engagement
4. `/solutions/telemedicine-platform.html` - Telemedicine
5. `/solutions/analytics-dashboard.html` - Analytics
6. `/benefits.html` - Benefits overview
7. `/faq.html` - FAQ
8. `/testimonials.html` - Success stories
9. `/doctors.html` - Provider directory
10. `/appointments.html` - Booking interface

---

## 🎯 Common Tasks

### Add New Page
1. Create HTML file with semantic structure
2. Link CSS files (global.css, page.css)
3. Add SEO config in `js/seo-optimization.js`
4. Link to navigation menu
5. Test: `window.getA11yReport()`

### Update Navigation
Edit `<nav>` in:
- `index.html`
- All 9 new pages

### Add Component (React)
1. Create `.jsx` file in `/src/components/`
2. Import in parent component
3. Add to `App.jsx` routes if page-level
4. Test in dev server: `npm run dev`

### Optimize Image
```html
<picture>
    <source srcset="/image.webp" type="image/webp">
    <source srcset="/image.png" type="image/png">
    <img src="/image.png" alt="Description" loading="lazy">
</picture>
```

---

## ✅ Quality Checklist

Before committing code:
- [ ] `window.getA11yReport()` shows all pass
- [ ] `window.getPerfMetrics()` shows good status
- [ ] No console errors (F12)
- [ ] Mobile menu works (768px breakpoint)
- [ ] Forms submit correctly
- [ ] All links work

---

## 🔍 Debugging

**Mobile menu not showing?**
- Check breakpoint at 768px in `css/global.css`
- Verify button has `aria-expanded` attribute

**SEO tags missing?**
- Check page config in `js/seo-optimization.js`
- Run `window.location.reload()` to refresh

**Performance slow?**
- Check `window.perfMetrics.resourceCounts`
- Look for unoptimized images
- Minify CSS/JS: `npm run build`

**Accessibility issues?**
- Run `window.getA11yReport()`
- Check alt text on images
- Verify form labels exist
- Test with keyboard (Tab key)

---

## 📊 Metrics Target

| Metric | Target | Check |
|--------|--------|-------|
| LCP | <2.5s | `window.perfMetrics.LCP` |
| FID | <100ms | `window.perfMetrics.FID` |
| CLS | <0.1 | `window.perfMetrics.CLS` |
| A11y | 10/10 | `window.a11yReport.score` |
| Mobile | Responsive | Test at 320px, 768px, 1024px |

---

## 🚀 Deploy

```bash
npm run build
git add .
git commit -m "Update: [description]"
git push origin main
# Wait 5 minutes for GitHub Pages
```

---

## 📚 Documentation

- **COMPLETION_REPORT.md** - Full project overview
- **IMPLEMENTATION_GUIDE.md** - How to guides
- **DEPLOYMENT_CHECKLIST.md** - Pre-deployment verification
- **PROJECT_COMPLETION.md** - Final summary
- **DELIVERY_DASHBOARD.md** - Visual status

---

## 🆘 Support

1. Check console for errors: `F12`
2. Run audit: `window.getA11yReport()`
3. Check metrics: `window.getPerfMetrics()`
4. Review docs in workspace root
5. Check git history: `git log --oneline`

---

**All 7 Deliverables Complete ✅**  
**Ready for Production 🚀**
