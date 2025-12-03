/**
 * Performance Optimization & Web Vitals Monitoring
 * Tracks Core Web Vitals and provides performance insights
 */

(function() {
    'use strict';

    const perfMetrics = {
        cwv: {}, // Core Web Vitals
        custom: {}
    };

    // ===== CORE WEB VITALS TRACKING =====

    // 1. Largest Contentful Paint (LCP)
    function trackLCP() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    const lcpValue = lastEntry.renderTime || lastEntry.loadTime;
                    perfMetrics.cwv.lcp = lcpValue;
                    
                    // Log status
                    let status = 'good';
                    if (lcpValue > 4000) status = 'poor';
                    else if (lcpValue > 2500) status = 'fair';
                    
                    console.log(`[LCP] ${lcpValue.toFixed(0)}ms - ${status}`);
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('[PERF] LCP not available:', e.message);
            }
        }
    }

    // 2. First Input Delay (FID)
    function trackFID() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        perfMetrics.cwv.fid = entry.processingDuration;
                        
                        let status = 'good';
                        if (entry.processingDuration > 300) status = 'poor';
                        else if (entry.processingDuration > 100) status = 'fair';
                        
                        console.log(`[FID] ${entry.processingDuration.toFixed(0)}ms - ${status}`);
                    });
                });
                observer.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.log('[PERF] FID not available:', e.message);
            }
        }
    }

    // 3. Cumulative Layout Shift (CLS)
    function trackCLS() {
        let clsValue = 0;
        
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            perfMetrics.cwv.cls = clsValue;
                            
                            let status = 'good';
                            if (clsValue > 0.25) status = 'poor';
                            else if (clsValue > 0.1) status = 'fair';
                            
                            console.log(`[CLS] ${clsValue.toFixed(3)} - ${status}`);
                        }
                    }
                });
                observer.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.log('[PERF] CLS not available:', e.message);
            }
        }
    }

    // ===== ADDITIONAL PERFORMANCE METRICS =====

    // Navigation Timing
    function trackNavigationTiming() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const navigation = window.performance.navigation;
            
            // Wait for page load
            window.addEventListener('load', function() {
                const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                const connectTime = timing.responseEnd - timing.requestStart;
                const renderTime = timing.domComplete - timing.domLoading;
                
                perfMetrics.custom.pageLoadTime = pageLoadTime;
                perfMetrics.custom.connectTime = connectTime;
                perfMetrics.custom.renderTime = renderTime;
                
                console.log(`[PERF] Page Load: ${pageLoadTime}ms`);
                console.log(`[PERF] Connect: ${connectTime}ms`);
                console.log(`[PERF] Render: ${renderTime}ms`);
            });
        }
    }

    // Resource Timing
    function trackResourceTiming() {
        if (window.performance && window.performance.getEntriesByType) {
            window.addEventListener('load', function() {
                const resources = window.performance.getEntriesByType('resource');
                const grouped = {
                    scripts: [],
                    stylesheets: [],
                    images: [],
                    fonts: [],
                    other: []
                };
                
                resources.forEach(resource => {
                    const size = resource.transferSize || 0;
                    const duration = resource.duration;
                    
                    if (resource.name.includes('.js')) {
                        grouped.scripts.push({ name: resource.name, size, duration });
                    } else if (resource.name.includes('.css')) {
                        grouped.stylesheets.push({ name: resource.name, size, duration });
                    } else if (/\.(png|jpg|gif|webp|svg)/.test(resource.name)) {
                        grouped.images.push({ name: resource.name, size, duration });
                    } else if (/\.(woff|woff2|ttf)/.test(resource.name)) {
                        grouped.fonts.push({ name: resource.name, size, duration });
                    } else {
                        grouped.other.push({ name: resource.name, size, duration });
                    }
                });
                
                console.log('[RESOURCES]', grouped);
                perfMetrics.custom.resources = grouped;
            });
        }
    }

    // Memory Usage (if available)
    function trackMemoryUsage() {
        if (performance.memory) {
            setInterval(function() {
                const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
                const limit = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
                perfMetrics.custom.memory = { used: `${used}MB`, limit: `${limit}MB` };
            }, 5000);
        }
    }

    // ===== IMAGE OPTIMIZATION HELPERS =====

    // Lazy load images
    function enableLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
            console.log('[PERF] Lazy loading enabled for', images.length, 'images');
        }
    }

    // Prefetch critical resources
    function prefetchCriticalResources() {
        const criticalResources = [
            '/css/global.css',
            '/js/home.js',
            '/fonts/inter.woff2'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
        
        console.log('[PERF] Prefetched', criticalResources.length, 'critical resources');
    }

    // ===== PERFORMANCE REPORT =====

    function printPerformanceReport() {
        const reportDelay = 5000; // Wait 5 seconds for all metrics
        
        setTimeout(() => {
            console.log('');
            console.log('═══════════════════════════════════════');
            console.log('     CORE WEB VITALS REPORT');
            console.log('═══════════════════════════════════════');
            
            if (perfMetrics.cwv.lcp) {
                console.log(`LCP (Largest Contentful Paint): ${perfMetrics.cwv.lcp.toFixed(0)}ms`);
            }
            if (perfMetrics.cwv.fid !== undefined) {
                console.log(`FID (First Input Delay): ${perfMetrics.cwv.fid.toFixed(0)}ms`);
            }
            if (perfMetrics.cwv.cls !== undefined) {
                console.log(`CLS (Cumulative Layout Shift): ${perfMetrics.cwv.cls.toFixed(3)}`);
            }
            
            console.log('\n═══════════════════════════════════════');
            console.log('  CUSTOM METRICS');
            console.log('═══════════════════════════════════════');
            console.log('Page Load Time:', perfMetrics.custom.pageLoadTime, 'ms');
            console.log('Connect Time:', perfMetrics.custom.connectTime, 'ms');
            console.log('Render Time:', perfMetrics.custom.renderTime, 'ms');
            
            if (performance.memory) {
                console.log('Memory Usage:', perfMetrics.custom.memory?.used, '/', perfMetrics.custom.memory?.limit);
            }
            
            console.log('\n═══════════════════════════════════════\n');
            
            // Export globally
            window.perfMetrics = perfMetrics;
        }, reportDelay);
    }

    // ===== INITIALIZATION =====

    function init() {
        trackLCP();
        trackFID();
        trackCLS();
        trackNavigationTiming();
        trackResourceTiming();
        trackMemoryUsage();
        
        // Defer until after page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                enableLazyLoading();
                prefetchCriticalResources();
                printPerformanceReport();
            });
        } else {
            enableLazyLoading();
            prefetchCriticalResources();
            printPerformanceReport();
        }
    }

    // Start tracking immediately
    init();
    
    // Export for manual testing
    window.getPerfMetrics = () => perfMetrics;
    window.printPerfReport = printPerformanceReport;
})();
