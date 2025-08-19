// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle with ARIA
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.getElementById('primary-nav') || document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('active');
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  // Header scroll effect and Back to top button
  const header = document.querySelector('header');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function() {
    if (header) {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    if (backToTop) {
      backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
    }
  });
  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Smooth scrolling for anchor links and close mobile menu
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Testimonial carousel with pause on hover/focus
  (function initTestimonials() {
    const container = document.querySelector('.testimonial-container');
    if (!container) return;
    const slides = container.querySelectorAll('.testimonial-slide');
    const navButtons = document.querySelectorAll('.testimonial-nav button');
    let currentSlide = 0;
    let intervalId;

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      navButtons.forEach(btn => btn.classList.remove('active'));
      slides[index].classList.add('active');
      if (navButtons[index]) navButtons[index].classList.add('active');
      currentSlide = index;
    }

    navButtons.forEach((button, index) => {
      button.addEventListener('click', () => showSlide(index));
    });

    function start() {
      intervalId = setInterval(() => {
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        showSlide(next);
      }, 8000);
    }
    function stop() { clearInterval(intervalId); }

    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);
    container.addEventListener('focusin', stop);
    container.addEventListener('focusout', start);

    showSlide(0);
    start();
  })();

  // Appointment date picker
  if (window.flatpickr) {
    window.flatpickr('#appointmentDate', {
      minDate: 'today',
      dateFormat: 'Y-m-d',
      disable: [date => (date.getDay() === 0 || date.getDay() === 6)]
    });
  }

  // Time slot selection
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', function() {
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  // Tracker functionality with ARIA labels preserved
  const addItemBtn = document.getElementById('add-item');
  const clearTrackerBtn = document.getElementById('clear-tracker');
  const trackerItems = document.getElementById('tracker-items');
  if (addItemBtn && trackerItems) {
    addItemBtn.addEventListener('click', function() {
      const newItemInput = document.getElementById('new-item');
      const text = (newItemInput?.value || '').trim();
      if (text) {
        const li = document.createElement('li');
        li.className = 'tracker-item';
        li.innerHTML = '<div class="item-text"></div>'+
                       '<div class="item-actions">'+
                       '<button class="complete-btn" type="button" aria-label="Mark item complete"><i class="fas fa-check" aria-hidden="true"></i></button>'+
                       '<button class="delete-btn" type="button" aria-label="Delete item"><i class="fas fa-trash" aria-hidden="true"></i></button>'+
                       '</div>';
        li.querySelector('.item-text').textContent = text;
        trackerItems.appendChild(li);
        if (newItemInput) newItemInput.value = '';
      }
    });
  }
  if (clearTrackerBtn && trackerItems) {
    clearTrackerBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to clear all items?')) trackerItems.innerHTML = '';
    });
  }

  // Form submissions with inline success state (replace alerts)
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const notice = document.createElement('p');
      notice.textContent = 'Appointment scheduled successfully!';
      notice.style.color = 'green';
      this.appendChild(notice);
      setTimeout(() => notice.remove(), 4000);
      this.reset();
    });
  }

  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const notice = document.createElement('p');
      notice.textContent = 'Your message has been sent successfully!';
      notice.style.color = 'green';
      this.appendChild(notice);
      setTimeout(() => notice.remove(), 4000);
      this.reset();
    });
  }
});


