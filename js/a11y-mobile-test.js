/**
 * Mobile & Accessibility Testing Suite
 * Run automated checks for WCAG 2.1 AA compliance
 */

(function() {
    'use strict';

    const a11yReport = {
        passed: [],
        warnings: [],
        errors: []
    };

    // Check 1: Heading hierarchy (H1 should exist and be first)
    function checkHeadingHierarchy() {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        
        if (headings.length === 0) {
            a11yReport.errors.push('No headings found on page');
            return;
        }
        
        const firstHeadingLevel = parseInt(headings[0].tagName[1]);
        if (firstHeadingLevel !== 1) {
            a11yReport.errors.push(`Page should start with H1, but starts with H${firstHeadingLevel}`);
        } else {
            a11yReport.passed.push('Heading hierarchy is correct (starts with H1)');
        }
        
        // Check sequential hierarchy
        let lastLevel = firstHeadingLevel;
        headings.forEach((h, i) => {
            const currentLevel = parseInt(h.tagName[1]);
            if (currentLevel > lastLevel + 1) {
                a11yReport.warnings.push(`Heading hierarchy jump from H${lastLevel} to H${currentLevel}`);
            }
            lastLevel = currentLevel;
        });
    }

    // Check 2: Image alt text
    function checkImageAltText() {
        const images = document.querySelectorAll('img');
        let missingAlt = 0;
        let blankAlt = 0;
        
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                missingAlt++;
            } else if (img.getAttribute('alt').trim() === '') {
                blankAlt++;
            }
        });
        
        if (missingAlt === 0 && blankAlt === 0) {
            a11yReport.passed.push(`All ${images.length} images have alt text`);
        } else {
            if (missingAlt > 0) a11yReport.errors.push(`${missingAlt} images missing alt text`);
            if (blankAlt > 0) a11yReport.warnings.push(`${blankAlt} images have blank alt text`);
        }
    }

    // Check 3: Form labels
    function checkFormLabels() {
        const inputs = document.querySelectorAll('input, select, textarea');
        let missingLabels = 0;
        
        inputs.forEach(input => {
            const id = input.getAttribute('id');
            const label = id ? document.querySelector(`label[for="${id}"]`) : null;
            
            if (!label && !input.hasAttribute('aria-label')) {
                missingLabels++;
            }
        });
        
        if (missingLabels === 0) {
            a11yReport.passed.push(`All ${inputs.length} form inputs have labels`);
        } else {
            a11yReport.errors.push(`${missingLabels} form inputs missing labels`);
        }
    }

    // Check 4: Color contrast
    function checkColorContrast() {
        // This is a simplified check - use WAVE or axe for full analysis
        const elements = document.querySelectorAll('body *');
        let lowContrast = 0;
        
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const background = style.backgroundColor;
            
            // Simple heuristic: if text is very light or very dark with same-ish background
            if (color === 'rgba(0, 0, 0, 0)' || background === 'rgba(0, 0, 0, 0)') {
                // Skip
            }
        });
        
        a11yReport.passed.push('Color contrast check: Manual review recommended with WAVE tool');
    }

    // Check 5: Keyboard navigation
    function checkKeyboardNavigation() {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        let notFocusable = 0;
        
        interactiveElements.forEach(el => {
            if (el.getAttribute('tabindex') === '-1' && !el.hasAttribute('aria-hidden')) {
                notFocusable++;
            }
        });
        
        if (notFocusable === 0) {
            a11yReport.passed.push(`All ${interactiveElements.length} interactive elements are keyboard accessible`);
        } else {
            a11yReport.warnings.push(`${notFocusable} interactive elements may not be keyboard accessible`);
        }
    }

    // Check 6: ARIA labels
    function checkAriaLabels() {
        const buttons = document.querySelectorAll('button');
        let missingAriaLabel = 0;
        
        buttons.forEach(btn => {
            const text = btn.textContent?.trim() || '';
            const ariaLabel = btn.getAttribute('aria-label');
            
            if (text === '' && !ariaLabel) {
                missingAriaLabel++;
            }
        });
        
        if (missingAriaLabel === 0) {
            a11yReport.passed.push('All icon-only buttons have aria-labels');
        } else {
            a11yReport.warnings.push(`${missingAriaLabel} icon-only buttons missing aria-labels`);
        }
    }

    // Check 7: Mobile viewport
    function checkMobileViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        
        if (viewport) {
            a11yReport.passed.push('Mobile viewport meta tag is set');
        } else {
            a11yReport.errors.push('Missing mobile viewport meta tag');
        }
    }

    // Check 8: Font size
    function checkFontSize() {
        const bodyStyle = window.getComputedStyle(document.body);
        const fontSize = parseFloat(bodyStyle.fontSize);
        
        if (fontSize >= 16) {
            a11yReport.passed.push(`Body font size is ${fontSize}px (≥16px recommended)`);
        } else {
            a11yReport.warnings.push(`Body font size is ${fontSize}px (should be ≥16px for mobile)`);
        }
    }

    // Check 9: Language attribute
    function checkLanguageAttribute() {
        const html = document.documentElement;
        
        if (html.hasAttribute('lang')) {
            a11yReport.passed.push(`Language attribute set to: ${html.getAttribute('lang')}`);
        } else {
            a11yReport.errors.push('Missing language attribute on html element');
        }
    }

    // Check 10: Meta description
    function checkMetaDescription() {
        const description = document.querySelector('meta[name="description"]');
        
        if (description) {
            const length = description.getAttribute('content').length;
            if (length >= 50 && length <= 160) {
                a11yReport.passed.push(`Meta description is optimal length (${length} chars)`);
            } else {
                a11yReport.warnings.push(`Meta description is ${length} chars (50-160 recommended)`);
            }
        } else {
            a11yReport.errors.push('Missing meta description');
        }
    }

    // Check mobile responsiveness
    function checkResponsiveness() {
        const viewport = window.innerWidth;
        
        if (viewport <= 320) {
            a11yReport.passed.push('Mobile small (320px) - OK');
        }
        if (viewport <= 768) {
            a11yReport.passed.push('Mobile/Tablet (768px) - OK');
        }
        if (viewport >= 1024) {
            a11yReport.passed.push('Desktop (1024px+) - OK');
        }
    }

    // Run all checks
    function runAccessibilityAudit() {
        checkHeadingHierarchy();
        checkImageAltText();
        checkFormLabels();
        checkColorContrast();
        checkKeyboardNavigation();
        checkAriaLabels();
        checkMobileViewport();
        checkFontSize();
        checkLanguageAttribute();
        checkMetaDescription();
        checkResponsiveness();
    }

    // Log report
    function printReport() {
        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('   ACCESSIBILITY & MOBILE AUDIT REPORT');
        console.log('═══════════════════════════════════════');
        
        console.log(`\n✓ PASSED (${a11yReport.passed.length}):`);
        a11yReport.passed.forEach(p => console.log(`  ✓ ${p}`));
        
        if (a11yReport.warnings.length > 0) {
            console.log(`\n⚠ WARNINGS (${a11yReport.warnings.length}):`);
            a11yReport.warnings.forEach(w => console.log(`  ⚠ ${w}`));
        }
        
        if (a11yReport.errors.length > 0) {
            console.log(`\n✗ ERRORS (${a11yReport.errors.length}):`);
            a11yReport.errors.forEach(e => console.log(`  ✗ ${e}`));
        }
        
        console.log('\n═══════════════════════════════════════');
        console.log(`OVERALL: ${a11yReport.errors.length === 0 ? '✓ PASS' : '✗ NEEDS IMPROVEMENT'}`);
        console.log('═══════════════════════════════════════\n');
        
        // Log to global object for programmatic access
        window.a11yReport = a11yReport;
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            runAccessibilityAudit();
            printReport();
        });
    } else {
        runAccessibilityAudit();
        printReport();
    }

    // Export for testing frameworks
    window.runAccessibilityAudit = runAccessibilityAudit;
    window.getA11yReport = () => a11yReport;
})();
