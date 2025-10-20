// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', 
                mobileMenuBtn.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
        });
    }

    // Sticky Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Testimonial Carousel
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialNav = document.querySelectorAll('.testimonial-nav button');
    
    testimonialNav.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove active class from all slides and buttons
            testimonialSlides.forEach(slide => slide.classList.remove('active'));
            testimonialNav.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to current slide and button
            testimonialSlides[index].classList.add('active');
            button.classList.add('active');
        });
    });

    // Auto rotate testimonials
    let testimonialIndex = 0;
    setInterval(() => {
        testimonialIndex = (testimonialIndex + 1) % testimonialSlides.length;
        testimonialNav[testimonialIndex].click();
    }, 5000);

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Animated Stats Counter
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('#about');
    const statItems = document.querySelectorAll('.stats-bar .stat-number');
    let statsAnimated = false;
    let barStatsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        
        const statsSectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;
        
        if (statsSectionPos < screenPos) {
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                let count = 0;
                const duration = 2000; // in milliseconds
                const increment = target / (duration / 20);
                
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        count = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.round(count);
                }, 20);
            });
            
            statsAnimated = true;
        }
    }

    function animateBarStats() {
        if (barStatsAnimated) return;
        
        const statsBar = document.querySelector('.stats-bar');
        const statsBarPos = statsBar.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;
        
        if (statsBarPos < screenPos) {
            statItems.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                let count = 0;
                const duration = 2000; // in milliseconds
                const increment = target / (duration / 20);
                
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        count = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.round(count);
                }, 20);
            });
            
            barStatsAnimated = true;
        }
    }

    window.addEventListener('scroll', () => {
        animateStats();
        animateBarStats();
    });

    // Initialize animations on page load
    window.addEventListener('load', () => {
        animateBarStats();
    });

    // FAQ Accordion Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach((question, index) => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach((otherQuestion, otherIndex) => {
                if (otherIndex !== index) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('show');
                }
            });
            
            // Toggle current FAQ item
            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('show');
            
            // Announce to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = isExpanded ? 'FAQ answer collapsed' : 'FAQ answer expanded';
            document.body.appendChild(announcement);
            setTimeout(() => document.body.removeChild(announcement), 1000);
        });
        
        // Keyboard support for FAQ
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
});
