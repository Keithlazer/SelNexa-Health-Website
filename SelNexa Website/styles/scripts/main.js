// scripts/main.js

/**
 * Toggle between light and dark themes and persist choice in localStorage.
 */
function initThemeToggle() {
  const btns = document.querySelectorAll('[data-action="toggle-theme"]');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', saved);

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });
}

/**
 * Smoothly scroll anchor links to their target sections.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetID = this.getAttribute('href');
      const targetEl = document.querySelector(targetID);
      if (!targetEl) return;
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/**
 * Fade in elements with the .fade-in class when they enter the viewport.
 */
function initFadeInObserver() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Initialize all behaviors once DOM is ready.
 */
window.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSmoothScroll();
  initFadeInObserver();
});
