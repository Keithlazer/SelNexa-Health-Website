# SelNexa Health - Quick Start & Implementation Guide

## 📦 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/keithlazer/keithlazer.github.io.git
cd keithlazer.github.io
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🗂️ File Organization Guide

### Core Pages
- **Home**: `/index.html` - Main landing page
- **Solutions Hub**: `/solutions/index.html` - Overview of all solutions
- **Solutions Details**: `/solutions/{module}.html` - Administration, Procurement, Records, Analytics

### Information Pages
- **Benefits**: `/benefits.html` - Consolidated value proposition
- **FAQ**: `/faq.html` - Frequently asked questions
- **Testimonials**: `/testimonials.html` - Success stories & case studies
- **Doctors**: `/doctors.html` - Provider directory
- **Appointments**: `/appointments.html` - Booking interface

### React SPA Pages (Protected)
- **Login**: `/src/pages/Login.jsx` - Authentication
- **Dashboard**: `/src/pages/Dashboard.jsx` - Main dashboard
- **Patient Portal**: `/src/pages/PatientPortal.jsx` - Patient interface
- **Settings**: `/src/pages/Settings.jsx` - User settings

---

## 🎯 Common Tasks

### Add a New Static Page

1. **Create HTML file** in root or appropriate folder:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title | SelNexa Health</title>
    <meta name="description" content="Page description...">
    <link rel="canonical" href="https://www.selnexahealth.com/page.html">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/styles/home.css">
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header id="header">
        <!-- Navigation -->
    </header>
    <main id="main-content">
        <!-- Content -->
    </main>
    <footer class="footer">
        <!-- Footer -->
    </footer>
    <script src="/js/home.js" defer></script>
</body>
</html>
```

2. **Add to navigation** in existing pages

3. **Update SEO configuration** in `/js/seo-optimization.js`:
```javascript
const seoConfig = {
    '/page.html': {
        title: 'Your Page Title',
        description: 'Your description...',
        keywords: 'keyword1, keyword2'
    }
};
```

### Update Navigation Menu

Edit navigation links in:
- `/index.html` - Main navbar
- `/solutions/index.html` - Solutions pages
- All other HTML files

**Example structure:**
```html
<nav class="navbar">
    <a href="/" class="logo">SelNexa Health</a>
    <ul class="nav-links">
        <li><a href="/solutions/">Solutions</a></li>
        <li><a href="/benefits.html">Benefits</a></li>
        <li><a href="/contact.html">Contact</a></li>
    </ul>
</nav>
```

### Optimize Images

1. **Use modern formats** (WebP with PNG fallback):
```html
<picture>
    <source srcset="/image.webp" type="image/webp">
    <source srcset="/image.png" type="image/png">
    <img src="/image.png" alt="Description" loading="lazy">
</picture>
```

2. **Lazy load** below-fold images:
```html
<img src="/image.jpg" alt="Description" loading="lazy">
```

3. **Optimize files**:
```bash
# Using ImageMagick
convert image.png -quality 85 image.jpg
cwebp image.png -o image.webp
```

### Update Footer

Edit footer in:
- `/index.html`
- All other static pages

**Footer structure:**
```html
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-about">
                <!-- About section -->
            </div>
            <div class="footer-links">
                <!-- Links -->
            </div>
            <div class="footer-newsletter">
                <!-- Newsletter signup -->
            </div>
        </div>
    </div>
</footer>
```

---

## 🔍 Testing & QA

### Accessibility Testing
```javascript
// In browser console on any page
window.getA11yReport()
```

**Expected output:**
- ✓ Proper heading hierarchy
- ✓ All images have alt text
- ✓ All forms have labels
- ✓ Keyboard navigation works
- ✓ Font size ≥16px

### Performance Testing
```javascript
// In browser console
window.getPerfMetrics()
window.printPerfReport()
```

**Monitor:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

### SEO Check
```javascript
// Verify meta tags
document.querySelector('meta[name="description"]')?.content
document.title
document.querySelector('link[rel="canonical"]')?.href
```

### Mobile Testing
1. Use Chrome DevTools device emulation (F12)
2. Test breakpoints: 320px, 768px, 1024px
3. Verify touch targets are ≥44x44px
4. Check hamburger menu works

---

## 🔐 Security Checklist

Before deploying:
- [ ] All forms use HTTPS
- [ ] SSL certificate installed
- [ ] Security headers configured
- [ ] CSP policy in place
- [ ] No sensitive data in URLs
- [ ] Authentication properly secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled

### Add HTTPS to Forms
```html
<form action="https://formsubmit.co/your-email@domain.com" method="POST">
    <!-- HTTPS required -->
</form>
```

### Security Headers (.htaccess)
```apache
<IfModule mod_headers.c>
    Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline';"
</IfModule>
```

---

## 📈 Analytics Integration

### Google Analytics 4
Add to `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Core Web Vitals Monitoring
Add to `<head>`:
```html
<script src="/js/performance-tracking.js" defer></script>
```

Metrics automatically logged to console and available via:
```javascript
window.perfMetrics
```

---

## 🐛 Troubleshooting

### Mobile menu not working
- Check `/js/home.js` has mobile menu code
- Verify CSS breakpoint at 768px
- Ensure button has `aria-label` and `aria-expanded`

### Images not loading
- Check file paths are absolute (`/image.jpg` not `image.jpg`)
- Verify image files exist
- Use `<picture>` with fallbacks for modern formats

### SEO not updated
- Manually run: `window.location.reload()`
- Check `/js/seo-optimization.js` has page config
- Verify meta tags in browser DevTools

### Performance slow
- Check `window.perfMetrics` for bottlenecks
- Minify CSS/JS: `npm run build`
- Enable gzip compression on server
- Use CDN for assets

---

## 📚 Resources

### Documentation
- [COMPLETION_REPORT.md](./COMPLETION_REPORT.md) - Full project summary
- [README.md](./README.md) - General project info

### Tools
- **Lighthouse**: Chrome DevTools (F12)
- **WAVE**: Browser extension for accessibility
- **PageSpeed Insights**: https://pagespeed.web.dev
- **Schema Validator**: https://validator.schema.org

### Standards
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility
- [Core Web Vitals](https://web.dev/vitals/) - Performance
- [Open Graph](https://ogp.me/) - Social sharing
- [JSON-LD](https://json-ld.org/) - Structured data

---

## 🚀 Deployment Steps

1. **Prepare files**
   ```bash
   npm run build
   ```

2. **Run tests**
   ```bash
   # In browser console
   window.getA11yReport()
   window.getPerfMetrics()
   ```

3. **Deploy to GitHub Pages**
   ```bash
   git add .
   git commit -m "Production release"
   git push origin main
   ```

4. **Verify live**
   - Visit https://www.selnexahealth.com
   - Check all pages load
   - Verify mobile menu works
   - Test a form submission

5. **Monitor**
   - Check Google Search Console
   - Monitor Core Web Vitals
   - Review error logs

---

## 📞 Support

For issues or questions:
1. Check console for errors (F12)
2. Run accessibility audit: `window.getA11yReport()`
3. Check performance: `window.getPerfMetrics()`
4. Review COMPLETION_REPORT.md for detailed info

---

*Last Updated: December 3, 2025*
