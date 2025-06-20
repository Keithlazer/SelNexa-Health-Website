// Theme toggle
document.getElementById('theme-toggle').onclick = function() {
  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};
// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));
// Lazy-load images
const imgs = document.querySelectorAll('img[loading="lazy"]');
imgs.forEach(img => { img.onload = () => img.classList.add('loaded'); });
// Analytics stub
window.analytics = { track: (event, data) => { console.log('Analytics:', event, data); } };
// Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('ServiceWorker registered'))
      .catch(err => console.log('ServiceWorker registration failed:', err));
  });
}

// Dark Mode Toggle
const darkModeToggle = document.createElement('button');
darkModeToggle.className = 'dark-mode-toggle';
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = darkModeToggle.querySelector('i');
  icon.classList.toggle('fa-moon');
  icon.toggleAttribute('fa-sun');
});

// AI Chatbot
class Chatbot {
  constructor() {
    this.messages = [];
    this.intents = {
      'symptom': ['I have a headache', 'I feel feverish', 'I have a cough'],
      'appointment': ['I need to book an appointment', 'Schedule a visit'],
      'emergency': ['This is an emergency', 'I need urgent care']
    };
  }

  async processMessage(message) {
    // Simple intent matching
    for (const [intent, phrases] of Object.entries(this.intents)) {
      if (phrases.some(phrase => message.toLowerCase().includes(phrase))) {
        return this.getResponse(intent);
      }
    }
    return "I'm not sure I understand. Could you please rephrase?";
  }

  getResponse(intent) {
    const responses = {
      'symptom': "I understand you're experiencing symptoms. Would you like to schedule a consultation with one of our doctors?",
      'appointment': "I can help you schedule an appointment. What day works best for you?",
      'emergency': "If this is a medical emergency, please call emergency services immediately at 911."
    };
    return responses[intent] || "I'm here to help. Could you provide more details?";
  }
}

// Initialize chatbot
const chatbot = new Chatbot();
const chatWindow = document.createElement('div');
chatWindow.className = 'chat-window';
document.body.appendChild(chatWindow);

// 3D Anatomy Viewer
class AnatomyViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.init();
  }

  init() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
    
    // Add basic lighting
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(light);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    this.scene.add(directionalLight);

    // Add a simple cube as placeholder
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0xe63946 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.camera.position.z = 5;

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}

// Health Calculator
class HealthCalculator {
  static calculateBMI(weight, height) {
    return (weight / (height * height)).toFixed(1);
  }

  static calculateRiskScore(age, weight, height, smoking, exercise) {
    let score = 0;
    score += age > 50 ? 2 : 1;
    score += this.calculateBMI(weight, height) > 25 ? 2 : 0;
    score += smoking ? 3 : 0;
    score += exercise ? -1 : 0;
    return score;
  }
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
  observer.observe(element);
});

// Internationalization
const i18n = {
  translations: {
    en: {
      welcome: 'Welcome to SelNexa Health',
      bookAppointment: 'Book an Appointment',
      emergency: 'Emergency'
    },
    es: {
      welcome: 'Bienvenido a SelNexa Health',
      bookAppointment: 'Reservar una Cita',
      emergency: 'Emergencia'
    },
    fr: {
      welcome: 'Bienvenue à SelNexa Health',
      bookAppointment: 'Prendre Rendez-vous',
      emergency: 'Urgence'
    }
  },
  currentLang: 'en',
  
  setLanguage(lang) {
    this.currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.translations[lang][key];
    });
  }
};

// Initialize language switcher
const langSwitcher = document.createElement('select');
langSwitcher.innerHTML = `
    <option value="en">English</option>
    <option value="es">Español</option>
    <option value="fr">Français</option>
`;
langSwitcher.addEventListener('change', (e) => i18n.setLanguage(e.target.value));
document.querySelector('.navbar').appendChild(langSwitcher);

// Accessibility Checker
class AccessibilityChecker {
  static runAudit() {
    const issues = [];
    
    // Check images for alt text
    document.querySelectorAll('img').forEach(img => {
      if (!img.alt) issues.push('Image missing alt text: ' + img.src);
    });
    
    // Check color contrast
    const textElements = document.querySelectorAll('p, span, div');
    textElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = style.backgroundColor;
      // Add contrast checking logic here
    });
    
    // Check ARIA labels
    document.querySelectorAll('[role]').forEach(el => {
      if (!el.getAttribute('aria-label')) {
        issues.push('Element with role missing aria-label: ' + el.outerHTML);
      }
    });
    
    console.log('Accessibility Audit Results:', issues);
    return issues;
  }
}

// Add hidden audit button
const auditButton = document.createElement('button');
auditButton.style.display = 'none';
auditButton.textContent = 'Run Accessibility Audit';
auditButton.addEventListener('click', () => AccessibilityChecker.runAudit());
document.body.appendChild(auditButton);

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D viewer if container exists
  const viewerContainer = document.getElementById('anatomy-viewer');
  if (viewerContainer) {
    new AnatomyViewer('anatomy-viewer');
  }
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(btn => {
  btn.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    faqQuestions.forEach(q => q.setAttribute('aria-expanded', 'false'));
    document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
    if (!expanded) {
      this.setAttribute('aria-expanded', 'true');
      this.nextElementSibling.style.display = 'block';
    }
  });
});

// Newsletter Signup Dummy Handler
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    newsletterForm.reset();
  });
}

// Callback Form Dummy Handler
const callbackForm = document.querySelector('.footer-callback form');
if (callbackForm) {
  callbackForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('We will call you back soon!');
    callbackForm.reset();
  });
}

// Blog/News Loading Spinner
const blogSpinner = document.getElementById('blog-spinner');
const blogFeed = document.getElementById('blog-feed');
if (blogSpinner && blogFeed) {
  blogSpinner.style.display = 'block';
  setTimeout(() => {
    blogSpinner.style.display = 'none';
    blogFeed.style.display = 'grid';
  }, 1200);
}

// Expanded Theme Switcher
const themeSelect = document.getElementById('themeSelect');
const darkModeToggle = document.getElementById('darkModeToggle');
function applyTheme(theme) {
  document.body.classList.remove('theme-health', 'theme-tech', 'theme-classic');
  if (theme && theme !== 'default') {
    document.body.classList.add('theme-' + theme);
  }
}
if (themeSelect) {
  // Load saved theme
  const savedTheme = localStorage.getItem('themeSelect');
  if (savedTheme) {
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);
  } else {
    // System theme detection
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      darkModeToggle.checked = true;
      document.body.classList.add('dark-mode');
    }
  }
  themeSelect.addEventListener('change', function() {
    localStorage.setItem('themeSelect', this.value);
    applyTheme(this.value);
  });
}
// Dark mode toggle
if (darkModeToggle) {
  darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  });
}
// Accessibility: Keyboard navigation for FAQ
faqQuestions.forEach(btn => {
  btn.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = this.parentElement.nextElementSibling?.querySelector('.faq-question');
      if (next) next.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = this.parentElement.previousElementSibling?.querySelector('.faq-question');
      if (prev) prev.focus();
    }
  });
}); 