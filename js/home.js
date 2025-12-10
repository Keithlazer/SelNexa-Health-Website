// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Configurable form endpoint (set window.SELNEXA_FORM_ENDPOINT = 'https://...')
  const FORM_ENDPOINT = typeof window.SELNEXA_FORM_ENDPOINT === 'string' ? window.SELNEXA_FORM_ENDPOINT : '';

  // Progressive performance: ensure non-critical images use lazy loading
  document.querySelectorAll('img:not([loading])').forEach(img => {
    // Skip likely above-the-fold hero/logo images
    const isHero = img.closest('.hero') || img.closest('header');
    if (!isHero) img.setAttribute('loading', 'lazy');
  });
  // Mobile menu toggle with ARIA
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.getElementById('primary-nav') || document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('active');
      // Keep screen readers informed
      navLinks.setAttribute('aria-hidden', String(expanded));
      // When opening, move focus to first link for keyboard users
      if (!expanded) {
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        // When closing, return focus to the menu button
        this.focus();
      }
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          navLinks.setAttribute('aria-hidden', 'true');
          mobileMenuBtn.querySelector('i')?.classList?.add('fa-bars');
          mobileMenuBtn.querySelector('i')?.classList?.remove('fa-times');
          mobileMenuBtn.focus();
        }
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
  // Utility: queue submissions offline and retry when online
  function queueSubmission(endpoint, payload) {
    try {
      const key = 'selnexa:queuedSubmissions';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push({ endpoint, payload, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch (_) {}
  }

  async function flushQueue() {
    const key = 'selnexa:queuedSubmissions';
    let list = [];
    try { list = JSON.parse(localStorage.getItem(key) || '[]'); } catch (_) {}
    if (!list.length || !navigator.onLine) return;
    const remaining = [];
    for (const item of list) {
      try {
        await fetch(item.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload)
        });
      } catch (err) {
        remaining.push(item);
      }
    }
    localStorage.setItem(key, JSON.stringify(remaining));
  }
  window.addEventListener('online', flushQueue);

  // Add honeypot field to forms
  function ensureHoneypot(form) {
    if (!form) return;
    if (!form.querySelector('input[name="company"]')) {
      const hp = document.createElement('input');
      hp.type = 'text';
      hp.name = 'company';
      hp.autocomplete = 'off';
      hp.tabIndex = -1;
      hp.ariaHidden = 'true';
      hp.style.position = 'absolute';
      hp.style.left = '-10000px';
      form.appendChild(hp);
    }
  }

  // Generic AJAX form handler for forms using FormSubmit.co or any POST endpoint
  function attachAjaxForms() {
    document.querySelectorAll('form[data-ajax="true"]').forEach(form => {
      ensureHoneypot(form);
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        // Basic client validation: ensure required fields are present
        const requiredMissing = Array.from(this.querySelectorAll('[required]')).some(inp => {
          return !(inp.value && inp.value.toString().trim());
        });
        const notice = document.createElement('p');
        notice.style.marginTop = '10px';
        this.appendChild(notice);
        if (requiredMissing) {
          notice.textContent = 'Please complete all required fields.';
          notice.style.color = 'red';
          setTimeout(() => notice.remove(), 5000);
          return;
        }
        // Honeypot check
        if (formData.get('company')) {
          notice.textContent = 'Submission blocked.';
          notice.style.color = 'red';
          return;
        }

        // Determine endpoint
        const action = this.getAttribute('action') || window.SELNEXA_FORM_ENDPOINT || '';
        if (!action) {
          notice.textContent = 'Form endpoint not configured.';
          notice.style.color = 'red';
          return;
        }

        // Convert FormData to JSON-friendly object
        const payload = {};
        formData.forEach((v, k) => { payload[k] = v; });

        try {
          if (!navigator.onLine) throw new Error('offline');
          const resp = await fetch(action, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
          });
          if (resp.ok) {
            notice.textContent = 'Thank you — your submission was received.';
            notice.style.color = 'green';
            this.reset();
          } else {
            // For FormSubmit, a redirect may return 200 but non-JSON; fall back to success message
            notice.textContent = 'Submission received (non-200 response).';
            notice.style.color = 'orange';
            this.reset();
          }
        } catch (err) {
          // Offline or network error: queue
          queueSubmission(action, payload);
          notice.textContent = 'Saved offline. We will submit when you are online.';
          notice.style.color = 'orange';
        }
        setTimeout(() => notice.remove(), 7000);
      });
    });
  }

  // Attach AJAX forms on DOM ready
  attachAjaxForms();

  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    ensureHoneypot(appointmentForm);
    appointmentForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      // Basic validation
      const fullName = this.querySelector('#fullName')?.value?.trim();
      const email = this.querySelector('#email')?.value?.trim();
      const phone = this.querySelector('#phone')?.value?.trim();
      const doctor = this.querySelector('#doctor')?.value;
      const date = this.querySelector('#appointmentDate')?.value;
      const time = this.querySelector('.time-slot.selected')?.textContent?.trim();
      const reason = this.querySelector('#reason')?.value?.trim();
      const honey = this.querySelector('input[name="company"]')?.value;

      const notice = document.createElement('p');
      notice.style.marginTop = '10px';
      this.appendChild(notice);

      if (honey) { // bot detected
        notice.textContent = 'Submission blocked.';
        notice.style.color = 'red';
        return;
      }
      if (!fullName || !email || !phone || !doctor || !date || !time) {
        notice.textContent = 'Please complete all required fields.';
        notice.style.color = 'red';
        return;
      }

      const payload = { type: 'appointment', fullName, email, phone, doctor, date, time, reason };

      if (FORM_ENDPOINT) {
        try {
          if (!navigator.onLine) throw new Error('offline');
          await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          notice.textContent = 'Appointment scheduled successfully!';
          notice.style.color = 'green';
          this.reset();
        } catch (err) {
          queueSubmission(FORM_ENDPOINT, payload);
          notice.textContent = 'Saved offline. We will submit when you are online.';
          notice.style.color = 'orange';
        }
      } else {
        notice.textContent = 'Appointment scheduled (demo). Backend not configured yet.';
        notice.style.color = 'green';
        this.reset();
      }
      setTimeout(() => notice.remove(), 5000);
    });
  }

  // Email sending function using FormSubmit.co API
  const sendFormToEmail = async (form) => {
    const formData = new FormData(form);
    
    try {
      const response = await fetch('https://formsubmit.co/ajax/keithtafangombe@gmail.com', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      console.error('Form submission error:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle contact forms with AJAX submission
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(form => {
    // Skip if already handled by main.js (forms with IDs)
    if (form.id) return;
    
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Remove any existing messages
      const existingMessage = this.querySelector('.form-message');
      if (existingMessage) existingMessage.remove();
      
      // Show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      // Send form data via AJAX
      const result = await sendFormToEmail(this);
      
      // Show result message
      const message = document.createElement('div');
      message.className = 'form-message';
      message.style.cssText = 'padding: 15px; margin-top: 15px; border-radius: 5px;';
      
      if (result.success) {
        message.style.background = '#10b981';
        message.style.color = 'white';
        message.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
        this.reset();
      } else {
        message.style.background = '#ef4444';
        message.style.color = 'white';
        message.textContent = 'Sorry, there was an error sending your message. Please try again or contact us directly.';
      }
      
      this.appendChild(message);
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      
      // Remove message after 5 seconds
      setTimeout(() => {
        message.remove();
      }, 5000);
    });
  });

  // Legacy handler for forms without FormSubmit (keep for backward compatibility)
  const contactFormLegacy = document.querySelector('.contact-form:not([action*="formsubmit.co"])');
  if (contactFormLegacy) {
    ensureHoneypot(contactFormLegacy);
    contactFormLegacy.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = this.querySelector('#contact-name')?.value?.trim() || this.querySelector('#name')?.value?.trim();
      const email = this.querySelector('#contact-email')?.value?.trim() || this.querySelector('#email')?.value?.trim();
      const subject = this.querySelector('#contact-subject')?.value?.trim() || 'Contact Form Submission';
      const message = this.querySelector('#contact-message')?.value?.trim() || this.querySelector('#message')?.value?.trim();
      const honey = this.querySelector('input[name="company"]')?.value;
      const notice = document.createElement('p');
      notice.style.marginTop = '10px';
      this.appendChild(notice);

      if (honey) {
        notice.textContent = 'Submission blocked.';
        notice.style.color = 'red';
        return;
      }
      if (!name || !email || !message) {
        notice.textContent = 'Please complete all required fields.';
        notice.style.color = 'red';
        return;
      }

      const payload = { type: 'contact', name, email, subject, message };
      if (FORM_ENDPOINT) {
        try {
          if (!navigator.onLine) throw new Error('offline');
          await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          notice.textContent = 'Your message has been sent successfully!';
          notice.style.color = 'green';
          this.reset();
        } catch (err) {
          queueSubmission(FORM_ENDPOINT, payload);
          notice.textContent = 'Saved offline. We will submit when you are online.';
          notice.style.color = 'orange';
        }
      } else {
        notice.textContent = 'Message sent (demo). Backend not configured yet.';
        notice.style.color = 'green';
        this.reset();
      }
      setTimeout(() => notice.remove(), 5000);
    });
  }

  // Try flushing queued submissions on load
  flushQueue();

  // Cookie consent banner
  if (!localStorage.getItem('selnexa:cookiesAccepted')) {
    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.bottom = '0';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.background = '#1a1a2e';
    banner.style.color = '#fff';
    banner.style.padding = '14px 20px';
    banner.style.zIndex = '3000';
    banner.style.display = 'flex';
    banner.style.justifyContent = 'space-between';
    banner.style.alignItems = 'center';
    banner.innerHTML = '<span>We use cookies for essential functionality and anonymous analytics. <a href="/privacy.html" style="color:#ffd166">Learn more</a>.</span>' +
      '<button id="cookieAccept" class="btn" style="margin-left:12px;">Accept</button>';
    document.body.appendChild(banner);
    banner.querySelector('#cookieAccept').addEventListener('click', () => {
      localStorage.setItem('selnexa:cookiesAccepted', '1');
      banner.remove();
    });
  }
});




