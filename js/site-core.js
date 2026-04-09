(function () {
  if (window.__selnexaCoreLoaded) {
    return;
  }
  window.__selnexaCoreLoaded = true;

  var THEME_KEY = "selnexa-theme";
  var LANG_KEY = "selnexa-language";
  var QUEUE_KEY = "selnexa-offline-form-queue";

  var analytics = window.selnexaAnalytics || {
    track: function (eventName, payload) {
      try {
        if (typeof window.plausible === "function") {
          window.plausible(eventName, { props: payload || {} });
        }
      } catch (err) {
        // noop
      }
      try {
        console.log("SelNexa analytics", eventName, payload || {});
      } catch (err) {
        // noop
      }
    }
  };
  window.selnexaAnalytics = analytics;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function normalizePath(href) {
    try {
      var url = new URL(href, window.location.origin);
      return url.pathname.replace(/\/$/, "") || "/";
    } catch (err) {
      return href;
    }
  }

  function hasHrefInMenu(menu, href) {
    var target = normalizePath(href);
    var links = menu.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i += 1) {
      if (normalizePath(links[i].getAttribute("href")) === target) {
        return true;
      }
    }
    return false;
  }

  function makeMenuItem(href, label, className) {
    var li = document.createElement("li");
    li.className = "nav-item";
    var link = document.createElement("a");
    link.href = href;
    link.className = className || "nav-link";
    link.textContent = label;
    li.appendChild(link);
    return li;
  }

  function enhanceNavigationMenus() {
    var menus = document.querySelectorAll(".nav-menu, .nav-links");
    if (!menus.length) {
      return;
    }

    var requiredLinks = [
      { href: "/case-studies.html", label: "Case Studies", key: "nav.caseStudies" },
      { href: "/telemedicine.html", label: "Telemedicine", key: "nav.telemedicine" },
      { href: "/pricing.html", label: "Pricing", key: "nav.pricing" },
      { href: "/investors.html", label: "Investors", key: "nav.investors" },
      { href: "/resources.html", label: "Resources", key: "nav.resources" },
      { href: "/careers.html", label: "Careers", key: "nav.careers" },
      { href: "/security-and-compliance.html", label: "Security & Compliance", key: "nav.security" }
    ];

    menus.forEach(function (menu) {
      if (menu.getAttribute("data-selnexa-nav-updated") === "true") {
        return;
      }

      requiredLinks.forEach(function (item) {
        if (!hasHrefInMenu(menu, item.href)) {
          var node = makeMenuItem(item.href, item.label, "nav-link");
          node.querySelector("a").setAttribute("data-i18n", item.key);

          var ctaNode = menu.querySelector(".cta-nav") ? menu.querySelector(".cta-nav").closest("li") : null;
          if (ctaNode && ctaNode.parentElement === menu) {
            menu.insertBefore(node, ctaNode);
          } else {
            menu.appendChild(node);
          }
        }
      });

      menu.setAttribute("data-selnexa-nav-updated", "true");
    });
  }

  function setupPrimaryMenuToggle() {
    var button = document.querySelector(".hamburger") || document.querySelector(".mobile-menu-btn");
    var menu = document.querySelector(".nav-menu") || document.querySelector(".nav-links");
    if (!button || !menu) {
      return;
    }

    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", expanded ? "false" : "true");
      menu.classList.toggle("active");
      menu.setAttribute("aria-hidden", expanded ? "true" : "false");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }
      menu.classList.remove("active");
      button.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    });

    var dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    dropdownToggles.forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        var parent = toggle.closest(".dropdown");
        if (!parent) {
          return;
        }
        var isOpen = parent.classList.contains("active");
        parent.classList.toggle("active", !isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });
  }

  function setupProgressBar() {
    var progress = document.querySelector(".navbar-progress");
    if (!progress) {
      return;
    }

    var updateProgress = function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, percent)) + "%";
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();
  }

  function applyTheme(themeValue) {
    var theme = themeValue === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      toggle.innerHTML = theme === "dark"
        ? '<i class="fas fa-sun" aria-hidden="true"></i><span class="sr-only">Switch to light mode</span>'
        : '<i class="fas fa-moon" aria-hidden="true"></i><span class="sr-only">Switch to dark mode</span>';
    }
  }

  function setupThemeToggle() {
    var container = document.querySelector(".navbar-container") || document.querySelector("header .container") || document.querySelector(".navbar .container");
    if (container && !container.querySelector("[data-theme-toggle]")) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "theme-toggle-btn";
      button.setAttribute("data-theme-toggle", "true");
      button.setAttribute("aria-label", "Toggle dark mode");
      button.setAttribute("aria-pressed", "false");
      container.appendChild(button);

      button.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }

    var storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme) {
      applyTheme(storedTheme);
      return;
    }

    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  function getTranslationBundle() {
    if (window.SelNexaI18n && window.SelNexaI18n.translations) {
      return window.SelNexaI18n;
    }

    return {
      translations: {
        en: {},
        sn: {},
        nd: {}
      }
    };
  }

  function resolveTranslation(lang, key) {
    var bundle = getTranslationBundle();
    var fallback = (bundle.translations.en && bundle.translations.en[key]) || null;
    return (bundle.translations[lang] && bundle.translations[lang][key]) || fallback;
  }

  function translatePage(lang) {
    var normalized = ["en", "sn", "nd"].indexOf(lang) >= 0 ? lang : "en";
    document.documentElement.setAttribute("lang", normalized);
    localStorage.setItem(LANG_KEY, normalized);

    var nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      var translated = resolveTranslation(normalized, key);
      if (translated) {
        node.textContent = translated;
      }
    });

    var placeholderNodes = document.querySelectorAll("[data-i18n-placeholder]");
    placeholderNodes.forEach(function (node) {
      var placeholderKey = node.getAttribute("data-i18n-placeholder");
      var translatedPlaceholder = resolveTranslation(normalized, placeholderKey);
      if (translatedPlaceholder) {
        node.setAttribute("placeholder", translatedPlaceholder);
      }
    });
  }

  function setupLanguageSelector() {
    var container = document.querySelector(".navbar-container") || document.querySelector("header .container") || document.querySelector(".navbar .container");
    if (!container || container.querySelector("#language-selector")) {
      var currentLang = localStorage.getItem(LANG_KEY) || "en";
      translatePage(currentLang);
      return;
    }

    var selector = document.createElement("select");
    selector.id = "language-selector";
    selector.className = "language-selector";
    selector.setAttribute("aria-label", "Select language");

    [
      { value: "en", label: "English" },
      { value: "sn", label: "Shona" },
      { value: "nd", label: "Ndebele" }
    ].forEach(function (optionData) {
      var option = document.createElement("option");
      option.value = optionData.value;
      option.textContent = optionData.label;
      selector.appendChild(option);
    });

    selector.addEventListener("change", function () {
      translatePage(selector.value);
    });

    container.appendChild(selector);

    var saved = localStorage.getItem(LANG_KEY) || "en";
    selector.value = saved;
    translatePage(saved);
  }

  function showToast(message) {
    var toast = document.createElement("div");
    toast.className = "selnexa-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(function () {
      toast.classList.add("visible");
    }, 20);
    window.setTimeout(function () {
      toast.classList.remove("visible");
      window.setTimeout(function () {
        toast.remove();
      }, 300);
    }, 2600);
  }

  function clearSearchHighlights() {
    document.querySelectorAll(".search-hit").forEach(function (node) {
      node.classList.remove("search-hit");
    });
  }

  function runPageSearch(query) {
    var cleaned = (query || "").trim().toLowerCase();
    if (!cleaned) {
      return;
    }

    clearSearchHighlights();

    var candidates = document.querySelectorAll("main h1, main h2, main h3, main p, main li, main a");
    for (var i = 0; i < candidates.length; i += 1) {
      var text = (candidates[i].textContent || "").toLowerCase();
      if (text.indexOf(cleaned) >= 0) {
        candidates[i].classList.add("search-hit");
        candidates[i].scrollIntoView({ behavior: "smooth", block: "center" });
        showToast("Found result for: " + query);
        analytics.track("voice_or_text_search", { query: query, matched: "true" });
        return;
      }
    }

    analytics.track("voice_or_text_search", { query: query, matched: "false" });
    showToast("No direct page match. Opening resources search.");
    window.location.href = "/resources.html?q=" + encodeURIComponent(query);
  }

  function setupVoiceSearch() {
    var container = document.querySelector(".navbar-container") || document.querySelector("header .container") || document.querySelector(".navbar .container");
    if (!container || container.querySelector(".voice-search-btn")) {
      return;
    }

    var button = document.createElement("button");
    button.type = "button";
    button.className = "voice-search-btn";
    button.setAttribute("aria-label", "Search with voice");
    button.innerHTML = '<i class="fas fa-microphone" aria-hidden="true"></i><span class="sr-only">Voice search</span>';
    container.appendChild(button);

    button.addEventListener("click", function () {
      var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Recognition) {
        var textQuery = window.prompt("Search SelNexa pages:");
        runPageSearch(textQuery || "");
        return;
      }

      var recognition = new Recognition();
      recognition.lang = document.documentElement.getAttribute("lang") || "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = function (event) {
        var transcript = event.results[0][0].transcript;
        runPageSearch(transcript);
      };
      recognition.onerror = function () {
        showToast("Voice search unavailable. Please type your query.");
      };
      recognition.start();
    });
  }

  function setupBottomNav() {
    if (document.querySelector(".bottom-mobile-nav")) {
      return;
    }

    var nav = document.createElement("nav");
    nav.className = "bottom-mobile-nav";
    nav.setAttribute("aria-label", "Mobile quick navigation");
    nav.innerHTML = [
      '<a href="/" aria-label="Home"><i class="fas fa-house" aria-hidden="true"></i><span data-i18n="nav.home">Home</span></a>',
      '<a href="/solutions/index.html" aria-label="Solutions"><i class="fas fa-layer-group" aria-hidden="true"></i><span data-i18n="nav.solutions">Solutions</span></a>',
      '<a href="/telemedicine.html" aria-label="Telemedicine"><i class="fas fa-video" aria-hidden="true"></i><span data-i18n="nav.telemedicine">Telemedicine</span></a>',
      '<a href="/case-studies.html" aria-label="Case studies"><i class="fas fa-chart-column" aria-hidden="true"></i><span data-i18n="nav.caseStudies">Case Studies</span></a>',
      '<a href="/resources.html" aria-label="More"><i class="fas fa-ellipsis" aria-hidden="true"></i><span data-i18n="nav.more">More</span></a>'
    ].join("");

    document.body.appendChild(nav);
  }

  function setupChatbot() {
    if (document.querySelector(".chatbot-toggle")) {
      return;
    }

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "chatbot-toggle";
    toggle.setAttribute("aria-label", "Open SelNexa assistant");
    toggle.innerHTML = '<i class="fas fa-comments" aria-hidden="true"></i>';

    var panel = document.createElement("section");
    panel.className = "chatbot-panel";
    panel.setAttribute("aria-label", "SelNexa chatbot");
    panel.innerHTML = [
      '<header><h2>SelNexa Assistant</h2><button type="button" class="chatbot-close" aria-label="Close chat">&times;</button></header>',
      '<div class="chatbot-messages"><p><strong>Assistant:</strong> I can answer FAQs, recommend modules by facility type, and help you schedule demos.</p></div>',
      '<div class="chatbot-controls">',
      '<label for="facility-recommendation">Facility Type</label>',
      '<select id="facility-recommendation">',
      '<option value="clinic">Community Clinic</option>',
      '<option value="hospital">Regional Hospital</option>',
      '<option value="network">Network / Government</option>',
      '</select>',
      '<button type="button" class="chatbot-recommend">Recommend Modules</button>',
      '<a href="/appointments.html" class="chatbot-demo-link">Schedule Demo</a>',
      '</div>'
    ].join("");

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
    });

    panel.querySelector(".chatbot-close").addEventListener("click", function () {
      panel.classList.remove("open");
    });

    panel.querySelector(".chatbot-recommend").addEventListener("click", function () {
      var value = panel.querySelector("#facility-recommendation").value;
      var message = "";
      if (value === "clinic") {
        message = "Recommended: AI Admin + Predictive Procurement for faster queue flow and cost control.";
      } else if (value === "hospital") {
        message = "Recommended: AI Admin + Procurement + Blockchain EHR + Analytics for full hospital workflows.";
      } else {
        message = "Recommended: Network License with all modules plus Telemedicine and unified analytics.";
      }

      var messages = panel.querySelector(".chatbot-messages");
      var item = document.createElement("p");
      item.innerHTML = "<strong>Assistant:</strong> " + message;
      messages.appendChild(item);
      messages.scrollTop = messages.scrollHeight;
      analytics.track("chatbot_recommendation", { facility_type: value });
    });
  }

  function addFooterRouteMap() {
    var footers = document.querySelectorAll("footer");
    if (!footers.length) {
      return;
    }

    footers.forEach(function (footer) {
      if (footer.querySelector(".footer-route-map")) {
        return;
      }

      var target = footer.querySelector(".footer-grid") || footer.querySelector(".footer-content") || footer.querySelector(".container") || footer;
      var block = document.createElement("section");
      block.className = "footer-route-map";
      block.innerHTML = [
        '<h4 data-i18n="footer.quickLinks">Quick Links</h4>',
        '<ul>',
        '<li><a href="/case-studies.html" data-i18n="nav.caseStudies">Case Studies</a></li>',
        '<li><a href="/telemedicine.html" data-i18n="nav.telemedicine">Telemedicine</a></li>',
        '<li><a href="/pricing.html" data-i18n="nav.pricing">Pricing</a></li>',
        '<li><a href="/investors.html" data-i18n="nav.investors">Investors</a></li>',
        '<li><a href="/resources.html" data-i18n="nav.resources">Resources</a></li>',
        '<li><a href="/careers.html" data-i18n="nav.careers">Careers</a></li>',
        '<li><a href="/security-and-compliance.html" data-i18n="nav.security">Security & Compliance</a></li>',
        '</ul>',
        '<div class="trust-badges" aria-label="Compliance badges">',
        '<span>SSL</span><span>HIPAA</span><span>GDPR</span><span>WCAG 2.1 AA</span>',
        '</div>'
      ].join("");
      target.appendChild(block);
    });
  }

  function setupAnimations() {
    var nodes = document.querySelectorAll(".animate-on-scroll, .reveal, [data-animate]");
    if (!nodes.length || !window.IntersectionObserver) {
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("animate-in");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function ensureSchedulingFields(form) {
    if (!form || form.querySelector("[name='booking_type']")) {
      return;
    }

    if (!form.classList.contains("appointment-form") && !form.classList.contains("demo-form") && form.id !== "appointmentForm") {
      return;
    }

    var container = document.createElement("div");
    container.className = "form-group";
    container.innerHTML = [
      '<label for="booking_type">Booking Type *</label>',
      '<select id="booking_type" name="booking_type" required>',
      '<option value="demo">Platform Demo</option>',
      '<option value="telemedicine">Telemedicine Appointment</option>',
      '</select>'
    ].join("");

    var submitButton = form.querySelector("button[type='submit']");
    if (submitButton && submitButton.parentElement === form) {
      form.insertBefore(container, submitButton);
    } else {
      form.appendChild(container);
    }

    if (!form.querySelector("input[name='g-recaptcha-response']")) {
      var recaptchaInput = document.createElement("input");
      recaptchaInput.type = "hidden";
      recaptchaInput.name = "g-recaptcha-response";
      recaptchaInput.value = "pending-client-token";
      form.appendChild(recaptchaInput);
    }
  }

  function queueFormSubmission(payload) {
    try {
      var queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
      queue.push(payload);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (err) {
      // noop
    }
  }

  function flushQueuedSubmissions() {
    var queue;
    try {
      queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    } catch (err) {
      queue = [];
    }

    if (!queue.length || !navigator.onLine) {
      return;
    }

    var pending = [];
    var chain = Promise.resolve();

    queue.forEach(function (item) {
      chain = chain.then(function () {
        if (!item.endpoint) {
          return;
        }

        return fetch(item.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.payload)
        }).catch(function () {
          pending.push(item);
        });
      });
    });

    chain.finally(function () {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(pending));
    });
  }

  function showFormNotice(form, message, state) {
    var existing = form.querySelector(".selnexa-form-notice");
    if (existing) {
      existing.remove();
    }

    var notice = document.createElement("p");
    notice.className = "selnexa-form-notice " + (state || "info");
    notice.textContent = message;
    form.appendChild(notice);

    window.setTimeout(function () {
      notice.remove();
    }, 5500);
  }

  function setupForms() {
    var forms = document.querySelectorAll(".demo-form, .contact-form, .appointment-form, #appointmentForm");
    if (!forms.length) {
      return;
    }

    forms.forEach(function (form) {
      if (form.getAttribute("data-selnexa-form-bound") === "true") {
        return;
      }

      ensureSchedulingFields(form);
      form.setAttribute("data-selnexa-form-bound", "true");

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var privacy = form.querySelector("input[name='privacy']");
        if (privacy && !privacy.checked) {
          showFormNotice(form, "Please accept the privacy policy before submitting.", "error");
          return;
        }

        var formData = new FormData(form);
        var payload = {};
        formData.forEach(function (value, key) {
          payload[key] = value;
        });

        var endpoint = form.getAttribute("action") || window.SELNEXA_SCHEDULING_ENDPOINT || "";
        var isTelemedicine = payload.booking_type === "telemedicine";

        analytics.track("form_submit", {
          form: form.id || form.className,
          booking_type: payload.booking_type || "unspecified"
        });

        if (!endpoint) {
          showFormNotice(
            form,
            isTelemedicine
              ? "Telemedicine request saved. Our team will confirm details and clinician availability shortly."
              : "Demo request saved. We will send a confirmation email shortly.",
            "success"
          );
          form.reset();
          return;
        }

        if (!navigator.onLine) {
          queueFormSubmission({ endpoint: endpoint, payload: payload });
          showFormNotice(form, "You are offline. The request was queued and will sync automatically.", "warning");
          form.reset();
          return;
        }

        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(function (response) {
          if (!response.ok) {
            throw new Error("Non-OK response");
          }
          showFormNotice(form, "Submission received. Check your email for confirmation.", "success");
          form.reset();
        }).catch(function () {
          queueFormSubmission({ endpoint: endpoint, payload: payload });
          showFormNotice(form, "Submission queued due to network issue. We will retry shortly.", "warning");
          form.reset();
        });
      });
    });

    window.addEventListener("online", flushQueuedSubmissions);
    flushQueuedSubmissions();
  }

  function setupPersonalizedTelemedicineDashboard() {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf("telemedicine") === -1) {
      return;
    }

    var isLoggedIn = !!(localStorage.getItem("selnexa-user") || localStorage.getItem("selnexa-auth") || localStorage.getItem("isAuthenticated"));
    if (!isLoggedIn || document.querySelector(".personalized-dashboard")) {
      return;
    }

    var anchor = document.querySelector("main");
    if (!anchor) {
      return;
    }

    var panel = document.createElement("section");
    panel.className = "personalized-dashboard animate-on-scroll";
    panel.innerHTML = [
      '<div class="container">',
      '<h2>Your Operations Snapshot</h2>',
      '<div class="dashboard-grid">',
      '<article><h3>Queue Metrics</h3><p>Average wait time down to 1.1 hours this week.</p></article>',
      '<article><h3>Inventory Alerts</h3><p>2 medium-risk medications flagged for reorder within 48 hours.</p></article>',
      '<article><h3>Analytics Highlights</h3><p>Readmission trend improved by 12% versus last month.</p></article>',
      '</div>',
      '</div>'
    ].join("");

    var firstSection = anchor.querySelector("section");
    if (firstSection && firstSection.nextSibling) {
      anchor.insertBefore(panel, firstSection.nextSibling);
    } else {
      anchor.appendChild(panel);
    }
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {
        // noop
      });
    });
  }

  function setupCtaTracking() {
    document.addEventListener("click", function (event) {
      var target = event.target.closest("a, button");
      if (!target) {
        return;
      }

      var isCta = target.classList.contains("btn") || target.classList.contains("cta-nav") || target.getAttribute("data-analytics") === "cta";
      if (isCta) {
        analytics.track("cta_click", {
          label: (target.textContent || "").trim(),
          href: target.getAttribute("href") || "button"
        });
      }
    });
  }

  onReady(function () {
    enhanceNavigationMenus();
    setupPrimaryMenuToggle();
    setupProgressBar();

    setupThemeToggle();
    setupLanguageSelector();
    setupVoiceSearch();

    setupBottomNav();
    setupChatbot();
    addFooterRouteMap();

    setupAnimations();
    setupForms();
    setupPersonalizedTelemedicineDashboard();
    setupCtaTracking();
    registerServiceWorker();
  });
})();
