/**
 * SEO & Meta Tags Injection
 * Dynamically ensures all pages have proper SEO meta tags and security headers
 */

(function() {
    'use strict';

    // SEO Configuration for each page
    const seoConfig = {
        '/': {
            title: 'SelNexa Health | Youth-Led Healthcare Innovation In Africa',
            description: 'SelNexa Health builds sustainable healthcare systems for Africa. Our first initiative is the offline-first SelNexa Health Platform.',
            keywords: 'healthcare, AI, Africa, telemedicine, healthcare technology',
        },
        '/solutions/': {
            title: 'Platform Modules | SelNexa Health Platform',
            description: 'Modules inside the SelNexa Health Platform: administration, procurement, clinical records, analytics, and telemedicine.',
            keywords: 'healthcare solutions, procurement, clinical records, analytics, telemedicine',
        },
        '/solutions/administration.html': {
            title: 'AI-Powered Administration | SelNexa Health',
            description: 'Streamline patient registration, scheduling, and record organization with AI-powered healthcare administration.',
            keywords: 'healthcare administration, patient registration, appointment scheduling, workflow automation',
        },
        '/solutions/procurement.html': {
            title: 'Procurement Optimization | SelNexa Health',
            description: 'AI-driven inventory forecasting and supply chain optimization. Prevent stockouts, reduce waste, and save thousands monthly.',
            keywords: 'healthcare procurement, inventory management, supply chain, cost reduction',
        },
        '/solutions/records.html': {
            title: 'Health Records Module | SelNexa Health Platform',
            description: 'Secure, interoperable electronic health records with offline access, consent controls, and tamper-evident audit trails.',
            keywords: 'electronic health records, EHR, HIPAA compliance, patient data security, offline health records',
        },
        '/solutions/analytics.html': {
            title: 'Analytics & Insights | SelNexa Health',
            description: 'Real-time healthcare analytics dashboards to monitor KPIs, track patient outcomes, and drive data-driven decisions.',
            keywords: 'healthcare analytics, business intelligence, dashboards, KPI tracking, patient outcomes',
        },
        '/benefits.html': {
            title: 'Benefits | SelNexa Health Platform',
            description: '40% cost reduction, 70% fewer errors, improved patient outcomes, and staff focused on care.',
            keywords: 'healthcare benefits, cost reduction, error elimination, patient outcomes',
        },
        '/faq.html': {
            title: 'FAQ | SelNexa Health – Common Questions',
            description: 'Frequently asked questions about SelNexa Health. Learn about security, compliance, integration, and support.',
            keywords: 'FAQ, support, HIPAA, security, compliance, integration',
        },
        '/testimonials.html': {
            title: 'Testimonials | SelNexa Health – Healthcare Success Stories',
            description: 'Read success stories from hospitals and clinics using SelNexa Health. See real-world ROI and patient impact.',
            keywords: 'testimonials, case studies, healthcare success stories, patient outcomes',
        },
        '/doctors.html': {
            title: 'Healthcare Providers | SelNexa Health',
            description: 'Connect with experienced doctors and specialists. Book in-person or telemedicine consultations.',
            keywords: 'doctors, healthcare providers, specialists, consultations, telemedicine',
        },
        '/appointments.html': {
            title: 'Book Platform Demo | SelNexa Health Platform',
            description: 'Schedule a SelNexa Health Platform demo or implementation planning call.',
            keywords: 'appointment booking, schedule consultation, healthcare appointments, telemedicine',
        },
    };

    // Get current page path
    function getCurrentPath() {
        return window.location.pathname.replace(/\.html$/, '');
    }

    // Inject or update meta tag
    function setMetaTag(name, content, property = false) {
        const attr = property ? 'property' : 'name';
        let tag = document.querySelector(`meta[${attr}="${name}"]`);
        
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attr, name);
            document.head.appendChild(tag);
        }
        
        tag.setAttribute('content', content);
    }

    // Inject Security Headers (as meta tags - server should set actual headers)
    function injectSecurityHeaders() {
        setMetaTag('X-UA-Compatible', 'IE=edge');
        setMetaTag('X-Content-Type-Options', 'nosniff');
        setMetaTag('referrer', 'strict-origin-when-cross-origin');
        
        // Add Content Security Policy meta tag (informational)
        setMetaTag('Content-Security-Policy', "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:;");
    }

    // Inject SEO meta tags
    function injectSeoTags() {
        const path = getCurrentPath();
        const config = seoConfig[path] || seoConfig['/'];
        
        // Core SEO tags
        setMetaTag('title', config.title);
        setMetaTag('description', config.description);
        setMetaTag('keywords', config.keywords);
        
        // Open Graph tags
        setMetaTag('og:title', config.title, true);
        setMetaTag('og:description', config.description, true);
        setMetaTag('og:type', 'website', true);
        setMetaTag('og:url', window.location.href, true);
        setMetaTag('og:site_name', 'SelNexa Health', true);
        setMetaTag('og:image', '/assets/selnexa-logo.svg?v=1', true);
        
        // Twitter Card tags
        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:title', config.title);
        setMetaTag('twitter:description', config.description);
        setMetaTag('twitter:image', '/assets/selnexa-logo.svg?v=1');
        
        // Additional SEO
        setMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large');
        setMetaTag('language', 'en');
        
        // Update title in document head
        document.title = config.title;
    }

    // Add JSON-LD structured data for rich snippets
    function injectStructuredData() {
        const path = getCurrentPath();
        
        let data = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'SelNexa Health',
            'url': 'https://www.selnexahealth.com/',
            'logo': 'https://www.selnexahealth.com/assets/selnexa-logo.svg',
            'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': '+263777726065',
                'contactType': 'customer service',
                'email': 'info@selnexahealth.com'
            },
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': '2157 Clifton Close, New Marlborough',
                'addressLocality': 'Harare',
                'addressCountry': 'ZW'
            },
            'sameAs': [
                'https://www.linkedin.com/company/selnexa/',
                'https://twitter.com/SelNexaHealth',
                'https://www.facebook.com/SelNexaHealth'
            ]
        };
        
        // Add breadcrumb for non-homepage
        if (path !== '/') {
            data = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Home',
                        'item': 'https://www.selnexahealth.com/'
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': document.title,
                        'item': window.location.href
                    }
                ]
            };
        }
        
        let script = document.querySelector('script[type="application/ld+json"]:last-of-type');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(data);
    }

    // Add security badges (informational)
    function addSecurityBadges() {
        const badges = `
                <div class="security-badges" style="margin: 1rem 0; font-size: 0.875rem; color: #666;">
                <span style="display: inline-block; margin-right: 1rem;"><i class="fas fa-lock" aria-hidden="true"></i> HIPAA-Compliant</span>
                <span style="display: inline-block; margin-right: 1rem;"><i class="fas fa-shield-alt" aria-hidden="true"></i> SSL/TLS Encrypted</span>
                <span style="display: inline-block;">✓ Data Protected</span>
            </div>
        `;
        
        // Add to footer if it exists
        const footer = document.querySelector('footer');
        if (footer && !footer.innerHTML.includes('security-badges')) {
            footer.insertAdjacentHTML('afterbegin', badges);
        }
    }

    // Monitor performance metrics
    function trackWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('[PERF] LCP:', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('[PERF] LCP tracking not available');
            }
            
            // First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        console.log('[PERF] FID:', entry.processingDuration);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.log('[PERF] FID tracking not available');
            }
        }
    }

    // Run on page load
    document.addEventListener('DOMContentLoaded', function() {
        injectSeoTags();
        injectSecurityHeaders();
        injectStructuredData();
        addSecurityBadges();
        trackWebVitals();
    });

    // Log SEO compliance
    console.log('[SEO] Page:', getCurrentPath());
    console.log('[SEO] Title:', document.title);
    console.log('[SEO] Description:', document.querySelector('meta[name="description"]')?.content);
})();
