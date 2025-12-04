// This file previously contained CSS code, which is not valid in a JavaScript (.js) file.
// Please move all CSS code to a .css file (e.g., main.css) in your styles directory.
// Only JavaScript code should be placed here.
// ============================================
// SELNEXAHEALTH - MAIN JAVASCRIPT
// ============================================

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    initializeNavigation();
    initializeScrollAnimations();
    initializeScrollProgress();
    initializeFormHandling();
    initializeInteractions();
});

// ============================================
// PARTICLE ANIMATION
// ============================================

function initializeParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 180, 216, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// NAVIGATION
// ============================================

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', 
                hamburger.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
        });
    }
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Mobile dropdown menus
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 767) {
                e.preventDefault();
                const dropdown = toggle.parentElement;
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(d => {
                d.classList.remove('active');
            });
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initializeScrollAnimations() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Fade in up animations for sections
    const fadeElements = document.querySelectorAll(
        '.problem-card, .bento-item, .stat-card, .africa-card, .tech-card'
    );
    
    fadeElements.forEach((el, index) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1
        });
    });
    
    // Animate timeline steps
    const timelineSteps = document.querySelectorAll('.timeline-step');
    timelineSteps.forEach((step, index) => {
        gsap.from(step, {
            scrollTrigger: {
                trigger: '.how-it-works',
                start: 'top 60%'
            },
            opacity: 0,
            y: 20,
            duration: 0.5,
            delay: index * 0.2
        });
    });
    
    // Animate stat numbers
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const finalValue = stat.textContent.replace(/\D/g, '');
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 80%'
            },
            textContent: 0,
            duration: 2,
            snap: { textContent: 1 },
            onUpdate: function() {
                stat.textContent = Math.ceil(this.targets()[0].textContent) + 
                    (stat.textContent.includes('%') ? '%' : 
                     stat.textContent.includes('K') ? 'K+' : '');
            }
        });
    });
    
    // Feature blocks parallax
    const featureBlocks = document.querySelectorAll('.feature-block');
    featureBlocks.forEach(block => {
        gsap.from(block, {
            scrollTrigger: {
                trigger: block,
                start: 'top 70%'
            },
            opacity: 0,
            x: (index) => index % 2 === 0 ? -50 : 50,
            duration: 0.8
        });
    });
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================

function initializeScrollProgress() {
    const progressBar = document.querySelector('.navbar-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ============================================
// FORM HANDLING
// ============================================

function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateForm(data)) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showNotification('Thank you! We\'ll be in touch soon.', 'success');
                form.reset();
                
                // Close modal if in one
                const modal = form.closest('dialog');
                if (modal) {
                    modal.close();
                }
            } catch (error) {
                showNotification('An error occurred. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    });
}

function validateForm(data) {
    const requiredFields = ['name', 'email'];
    return requiredFields.every(field => data[field] && data[field].trim());
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#06D6A0' : type === 'error' ? '#FF6B6B' : '#00B4D8'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// INTERACTIONS & MICRO-INTERACTIONS
// ============================================

function initializeInteractions() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.05,
                overwrite: 'auto'
            });
        });
        
        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                overwrite: 'auto'
            });
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.problem-card, .bento-item, .africa-card, .tech-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -8,
                boxShadow: '0 10px 40px rgba(0, 180, 216, 0.2)',
                overwrite: 'auto'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                overwrite: 'auto'
            });
        });
    });
    
    // Modal interactions
    const modals = document.querySelectorAll('dialog');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.close();
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Link animations
    const links = document.querySelectorAll('.btn-link');
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                x: 4,
                color: '#90E0EF'
            });
        });
        
        link.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                x: 0,
                color: '#00B4D8'
            });
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Keyboard navigation for modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('dialog[open]');
        openModals.forEach(modal => modal.close());
    }
});

// Focus management for modals
document.querySelectorAll('dialog').forEach(modal => {
    modal.addEventListener('showModal', () => {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// ANIMATIONS KEYFRAMES (CSS-in-JS)
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// ANALYTICS & TRACKING
// ============================================

// Track CTA clicks
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                'button_text': btn.textContent,
                'button_type': btn.className
            });
        }
    });
});

// Track form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'form_id': form.id || 'unknown'
            });
        }
    });
});

// ============================================
// SERVICE WORKER REGISTRATION (Optional)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, app will still work
        });
    });
}
