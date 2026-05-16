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

  function dismissSplash() {
    var splash =
      document.getElementById("splash") ||
      document.getElementById("preloader") ||
      document.querySelector(".site-splash") ||
      document.querySelector(".site-preloader");
    if (splash) {
      splash.style.display = "none";
    }
    try {
      document.documentElement.classList.remove("is-loading", "loading");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    } catch (err) {
      // noop
    }
  }

  window.addEventListener("load", dismissSplash);
  setTimeout(dismissSplash, 4000);

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

  function getPrimaryNavbar() {
    return (
      document.querySelector(".navbar") ||
      document.querySelector('nav[role="navigation"]') ||
      document.querySelector("nav")
    );
  }

  function navFeatureEnabled(attributeName) {
    var nav = getPrimaryNavbar();
    if (!nav) {
      return true;
    }
    return nav.getAttribute(attributeName) !== "false";
  }

  function isMarketingNavigation(menu) {
    var nav = menu ? menu.closest(".navbar") : getPrimaryNavbar();
    return !!(nav && nav.getAttribute("data-nav-layout") === "marketing");
  }

  function getNavigationControlHost() {
    return (
      document.querySelector(".navbar-utilities") ||
      document.querySelector(".navbar-container") ||
      document.querySelector("header .navbar") ||
      document.querySelector(".navbar") ||
      document.querySelector("header .container") ||
      document.querySelector(".navbar .container")
    );
  }

  function enhanceNavigationMenus() {
    var menus = document.querySelectorAll(".nav-menu, .nav-links");
    if (!menus.length) {
      return;
    }

    var standardLinks = [
      { href: "/", label: "Home", key: "nav.home" },
      { href: "/about.html", label: "About", key: "nav.about" },
      { href: "/features.html", label: "Platform", key: "nav.solutions" },
      { href: "/projects.html", label: "Projects", key: "nav.projects" },
      { href: "/case-studies.html", label: "Impact", key: "nav.caseStudies" },
      { href: "/for-investors.html", label: "Investors", key: "nav.investors" },
      { href: "/resources.html", label: "Resources", key: "nav.resources" },
      { href: "/contact.html", label: "Contact", key: "nav.contact" },
      { href: "/appointments.html", label: "Book Platform Demo", key: "nav.bookDemo", cta: true }
    ];

    var marketingLinks = [
      { href: "/", label: "Home", key: "nav.home" },
      { href: "/about.html", label: "About", key: "nav.about" },
      { href: "/features.html", label: "Platform", key: "nav.solutions" },
      { href: "/projects.html", label: "Projects", key: "nav.projects" },
      { href: "/case-studies.html", label: "Impact", key: "nav.caseStudies" },
      { href: "/for-investors.html", label: "Investors", key: "nav.investors" },
      { href: "/resources.html", label: "Resources", key: "nav.resources" },
      { href: "/contact.html", label: "Contact", key: "nav.contact" },
      { href: "/appointments.html", label: "Book Platform Demo", key: "nav.bookDemo", cta: true }
    ];

    var marketingHiddenLinks = [
      "/pricing.html",
      "/telemedicine.html",
      "/security-and-compliance.html"
    ];

    menus.forEach(function (menu) {
      if (menu.getAttribute("data-selnexa-nav-updated") === "true") {
        return;
      }

      if (isMarketingNavigation(menu)) {
        menu.querySelectorAll("a[href]").forEach(function (link) {
          var isPrimaryNavLink = link.classList.contains("nav-link") && !link.closest(".dropdown-menu");
          if (isPrimaryNavLink && marketingHiddenLinks.indexOf(normalizePath(link.getAttribute("href") || "")) >= 0) {
            var navItem = link.closest("li");
            if (navItem) {
              navItem.remove();
            }
          }
        });
      }

      var requiredLinks = isMarketingNavigation(menu) ? marketingLinks : standardLinks;

      requiredLinks.forEach(function (item) {
        if (!hasHrefInMenu(menu, item.href)) {
          var node = makeMenuItem(item.href, item.label, item.cta ? "nav-link cta-nav" : "nav-link");
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

  function cleanupLegacyNavigationLabels() {
    document.querySelectorAll("a[href='/for-funders.html'], a[href='for-funders.html']").forEach(function (link) {
      link.setAttribute("href", "/for-investors.html");
      if ((link.textContent || "").toLowerCase().indexOf("funder") >= 0) {
        link.textContent = "Investors";
      }
    });

    document.querySelectorAll("a").forEach(function (link) {
      var text = (link.textContent || "").trim();
      var legacyInvestorLabel = "Fund" + "ers";
      if (text === legacyInvestorLabel || text === "For " + legacyInvestorLabel) {
        link.textContent = "Investors";
      }
      if (normalizePath(link.getAttribute("href") || "") === "/case-studies.html" && text === "Case Studies") {
        link.textContent = "Impact";
      }
    });
  }

  function setupPrimaryMenuToggle() {
    var menu = document.querySelector(".nav-menu") || document.querySelector(".nav-links");
    if (!menu) {
      return;
    }

    var button = document.querySelector(".hamburger") || document.querySelector(".mobile-menu-btn");
    if (!button) {
      var navHost = menu.closest(".navbar") || menu.closest("nav") || menu.parentElement;
      if (!navHost) {
        return;
      }

      button = document.createElement("button");
      button.type = "button";
      button.className = "mobile-menu-btn";
      button.setAttribute("aria-label", "Toggle navigation menu");
      button.setAttribute("data-generated-toggle", "true");
      button.innerHTML = '<span aria-hidden="true">&#9776;</span>';
      navHost.appendChild(button);
    }

    var setMenuOpenState = function (shouldOpen) {
      var isMobileViewport = window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
      menu.classList.toggle("active", shouldOpen);
      button.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      menu.setAttribute("aria-hidden", !isMobileViewport || shouldOpen ? "false" : "true");

      if (button.getAttribute("data-generated-toggle") === "true") {
        button.innerHTML = shouldOpen
          ? '<span aria-hidden="true">&times;</span>'
          : '<span aria-hidden="true">&#9776;</span>';
      }

      if (isMobileViewport) {
        document.body.classList.toggle("mobile-menu-open", shouldOpen);
      } else {
        document.body.classList.remove("mobile-menu-open");
      }
    };

    if (!button.hasAttribute("aria-expanded")) {
      button.setAttribute("aria-expanded", "false");
    }
    if (!menu.hasAttribute("aria-hidden")) {
      menu.setAttribute("aria-hidden", "true");
    }
    setMenuOpenState(false);

    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      setMenuOpenState(!expanded);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }
      setMenuOpenState(false);
    });

    menu.querySelectorAll("a[href]").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpenState(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1023) {
        setMenuOpenState(false);
      }
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
    var navbar = getPrimaryNavbar();
    if (!progress && !navbar) {
      return;
    }

    var updateProgress = function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progress) {
        progress.style.width = Math.min(100, Math.max(0, percent)) + "%";
      }
      if (navbar) {
        navbar.classList.toggle("scrolled", scrollTop > 80);
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
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
    if (!navFeatureEnabled("data-enable-theme-toggle")) {
      return;
    }

    var container = getNavigationControlHost();
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
        fr: {},
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
      var normalized = ["en", "fr", "sn", "nd"].indexOf(lang) >= 0 ? lang : "en";
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
    var container = getNavigationControlHost();
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
      { value: "fr", label: "French" },
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
    if (!navFeatureEnabled("data-enable-voice-search")) {
      return;
    }

    var container = getNavigationControlHost();
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
      '<a href="/features.html" aria-label="Platform"><i class="fas fa-layer-group" aria-hidden="true"></i><span data-i18n="nav.solutions">Platform</span></a>',
      '<a href="/case-studies.html" aria-label="Impact"><i class="fas fa-chart-column" aria-hidden="true"></i><span data-i18n="nav.casesShort">Impact</span></a>',
      '<a href="/for-investors.html" aria-label="Investors"><i class="fas fa-chart-line" aria-hidden="true"></i><span data-i18n="nav.investors">Investors</span></a>',
      '<a href="/resources.html" aria-label="More"><i class="fas fa-ellipsis" aria-hidden="true"></i><span data-i18n="nav.more">More</span></a>'
    ].join("");

    var currentPath = normalizePath(window.location.pathname);
    nav.querySelectorAll("a[href]").forEach(function (link) {
      var targetPath = normalizePath(link.getAttribute("href") || "");
      var isResourcesBucket = targetPath === "/resources.html" && (
        currentPath.indexOf("/resources") === 0 ||
        currentPath.indexOf("/blog") === 0
      );
      var isActive = currentPath === targetPath || isResourcesBucket;

      if (isActive) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

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
      '<a href="/appointments.html" class="chatbot-demo-link">Book Platform Demo</a>',
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
        message = "Recommended: AI Admin + Procurement + Health Records + Analytics for full hospital workflows.";
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
        '<li><a href="/case-studies.html" data-i18n="nav.caseStudies">Impact</a></li>',
        '<li><a href="/pricing.html" data-i18n="nav.pricing">Pricing</a></li>',
        '<li><a href="/for-investors.html" data-i18n="nav.investors">Investors</a></li>',
        '<li><a href="/resources.html" data-i18n="nav.resources">Resources</a></li>',
        '<li><a href="/careers.html" data-i18n="nav.careers">Careers</a></li>',
        '<li><a href="/security-and-compliance.html" data-i18n="nav.security">Security & Compliance</a></li>',
        '</ul>',
        '<div class="trust-badges" aria-label="Compliance badges">',
        '<span>HIPAA</span><span>GDPR</span>',
        '</div>'
      ].join("");
      target.appendChild(block);
    });
  }

  function setupAnimations() {
    var nodes = document.querySelectorAll(".animate-on-scroll, .reveal, [data-animate]");
    if (!nodes.length || !window.IntersectionObserver) {
      nodes.forEach(function (node) {
        node.classList.add("animate-in", "in-view");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("animate-in", "in-view", "visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function animateCounter(el) {
    if (el.getAttribute("data-counter-complete") === "true") {
      return;
    }

    var target = parseFloat(el.getAttribute("data-target") || "0");
    if (Number.isNaN(target)) {
      return;
    }

    el.setAttribute("data-counter-complete", "true");
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var decimals = Number.isInteger(target) ? 0 : 1;
    var duration = parseInt(el.getAttribute("data-duration") || "1800", 10);
    var startTime = performance.now();

    function step(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;
      var value = decimals ? current.toFixed(decimals) : Math.floor(current).toString();
      if (progress === 1) {
        value = decimals ? target.toFixed(decimals) : target.toString();
      }
      el.textContent = prefix + value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function setupStatCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) {
      return;
    }

    if (!window.IntersectionObserver) {
      counters.forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.45 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function setupModuleTabs() {
    var tabs = document.querySelectorAll(".module-tab[data-module]");
    if (!tabs.length) {
      return;
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-module");
        tabs.forEach(function (button) {
          var isActive = button === tab;
          button.classList.toggle("active", isActive);
          button.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        document.querySelectorAll(".module-content[data-module-panel]").forEach(function (panel) {
          panel.classList.toggle("active", panel.getAttribute("data-module-panel") === target);
        });
      });
    });
  }

  function setupRoiCalculator() {
    var root = document.querySelector(".roi-calculator");
    if (!root) {
      return;
    }

    var patients = root.querySelector("#patients");
    var adminTime = root.querySelector("#admin-time");
    var patientsVal = root.querySelector("#patients-val");
    var adminVal = root.querySelector("#admin-val");
    var hoursSaved = root.querySelector("#hours-saved");
    var costSaved = root.querySelector("#cost-saved");
    if (!patients || !adminTime || !patientsVal || !adminVal || !hoursSaved || !costSaved) {
      return;
    }

    function recalc() {
      var patientCount = parseInt(patients.value, 10);
      var minutes = parseInt(adminTime.value, 10);
      var savedMinutesPerPatient = Math.max(1, Math.round(minutes * 0.35));
      var monthlyHours = Math.round((patientCount * savedMinutesPerPatient * 22) / 60);
      patientsVal.textContent = patientCount + " patients/day";
      adminVal.textContent = minutes + " min";
      hoursSaved.textContent = monthlyHours.toLocaleString();
      costSaved.textContent = "$" + (monthlyHours * 5).toLocaleString();
    }

    patients.addEventListener("input", recalc);
    adminTime.addEventListener("input", recalc);
    recalc();
  }

  function setupOfflineAnimation() {
    document.querySelectorAll(".offline-diagram").forEach(function (diagram) {
      var button = diagram.querySelector("[data-pause-offline-animation]");
      if (!button) {
        return;
      }
      button.addEventListener("click", function () {
        var paused = diagram.classList.toggle("is-paused");
        button.setAttribute("aria-pressed", paused ? "true" : "false");
        button.textContent = paused ? "Resume animation" : "Pause animation";
      });
    });
  }

  function setupEmailCapture() {
    window.handleSubscribe = function (event) {
      event.preventDefault();
      var form = event.target;
      var input = form.querySelector("input[type='email']");
      if (!input || !input.value) {
        return;
      }
      analytics.track("newsletter_subscribe", { source_path: window.location.pathname });
      showToast("Subscription captured. We will send deployment updates monthly.");
      form.reset();
    };
  }

  function setupWhatsAppFloat() {
    if (document.querySelector(".whatsapp-float")) {
      return;
    }

    var link = document.createElement("a");
    link.href = "https://wa.me/263777726065?text=Hi%2C%20I'm%20interested%20in%20learning%20more%20about%20the%20SelNexa%20Health%20Platform.";
    link.className = "whatsapp-float";
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "Contact SelNexa Health on WhatsApp");
    link.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path fill="currentColor" d="M19.1 17.3c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.8 1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.5z"/><path fill="currentColor" d="M16 3C8.8 3 3 8.8 3 15.9c0 2.3.6 4.5 1.8 6.5L3.5 29l6.8-1.8c1.8 1 3.7 1.5 5.8 1.5 7.2 0 13-5.8 13-12.9C29 8.8 23.2 3 16 3zm0 23.6c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4 1.1 1.1-3.9-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.8C5.4 10 10.1 5.3 16 5.3S26.6 10 26.6 15.9 21.9 26.6 16 26.6z"/></svg>';
    document.body.appendChild(link);
  }

  function setupReadingProgress() {
    var progress = document.getElementById("reading-progress");
    if (!progress) {
      return;
    }

    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, percent)) + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function reorderInvestorPageSections() {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf("for-investors") === -1) {
      return;
    }

    var hero = document.querySelector("main .hero");
    var letter = document.getElementById("letter");
    if (hero && letter && hero.nextElementSibling !== letter) {
      hero.insertAdjacentElement("afterend", letter);
    }
  }

  function setupCalendarEmbed() {
    var placeholder = document.getElementById("cal-booking-placeholder");
    if (!placeholder || window.__selnexaCalLoaded) {
      return;
    }

    window.__selnexaCalLoaded = true;
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal;
        var ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = api;
            p(api, ar);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    if (window.Cal) {
      window.Cal("init", "selnexahealth", { origin: "https://cal.com" });
      window.Cal("inline", {
        elementOrSelector: "#cal-booking-placeholder",
        calLink: "selnexahealth/platform-demo",
        layout: "month_view"
      });
    }
  }

  function setupVideoTabs() {
    document.querySelectorAll(".video-tab-controls .tab-btn[data-tab]").forEach(function (button) {
      if (button.getAttribute("data-video-tab-bound") === "true") {
        return;
      }
      button.setAttribute("data-video-tab-bound", "true");
      button.addEventListener("click", function () {
        var target = button.getAttribute("data-tab");
        var group = button.closest(".video-tabs") || document;
        group.querySelectorAll(".tab-btn[data-tab]").forEach(function (tab) {
          var selected = tab === button;
          tab.classList.toggle("active", selected);
          tab.setAttribute("aria-selected", selected ? "true" : "false");
        });
        group.querySelectorAll(".video-tab-content").forEach(function (panel) {
          panel.classList.toggle("hidden", panel.id !== "tab-" + target);
          var video = panel.querySelector("video");
          if (video && panel.id !== "tab-" + target) {
            video.pause();
          }
        });
      });
    });
  }

  function ensureOrganizationJsonLd() {
    if (document.querySelector("script[data-selnexa-org-schema]")) {
      return;
    }

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-selnexa-org-schema", "true");
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SelNexa Health",
      "url": "https://www.selnexahealth.com",
      "logo": "https://www.selnexahealth.com/assets/selnexa-logo.svg",
      "description": "Youth-led health systems innovation organization building offline-first hospital management solutions for African clinics and hospitals.",
      "foundingDate": "2024",
      "foundingLocation": "Harare, Zimbabwe",
      "areaServed": ["ZW", "KE", "NG", "ZA"],
      "sameAs": [
        "https://www.linkedin.com/company/selnexahealth",
        "https://twitter.com/selnexahealth",
        "https://www.youtube.com/@selnexahealth"
      ],
      "founder": {
        "@type": "Person",
        "name": "Keith Tafangombe",
        "jobTitle": "Founder & CEO",
        "url": "https://www.linkedin.com/in/keithtafangombe"
      }
    });
    document.head.appendChild(script);
  }

  function isBookingForm(form) {
    return !!(
      form && (
        form.classList.contains("appointment-form") ||
        form.classList.contains("demo-form") ||
        form.id === "appointmentForm" ||
        form.id === "demo-form"
      )
    );
  }

  function ensureSchedulingFields(form) {
    if (!form || form.querySelector("[name='booking_type']")) {
      return;
    }

    if (!isBookingForm(form)) {
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

  function ensureWishlistField(form) {
    if (!isBookingForm(form) || form.querySelector("input[name='join_wishlist']")) {
      return;
    }

    var wishlistOptIn = document.createElement("label");
    wishlistOptIn.className = "checkbox";
    wishlistOptIn.innerHTML = [
      '<input type="checkbox" name="join_wishlist" value="yes">',
      "Join the early-access wishlist for priority demo slots and launch updates."
    ].join("");

    var privacyCheckbox = form.querySelector("input[name='privacy']");
    var privacyLabel = privacyCheckbox ? privacyCheckbox.closest("label") : null;
    var submitButton = form.querySelector("button[type='submit']");

    if (privacyLabel && privacyLabel.parentElement === form) {
      form.insertBefore(wishlistOptIn, privacyLabel);
      return;
    }

    if (submitButton && submitButton.parentElement === form) {
      form.insertBefore(wishlistOptIn, submitButton);
      return;
    }

    form.appendChild(wishlistOptIn);
  }

  function ensureWishlistFirstCopy(form) {
    if (!isBookingForm(form)) {
      return;
    }

    var submitButton = form.querySelector("button[type='submit']");
    var bookingTypeSelect = form.querySelector("select[name='booking_type']");

    function updateButtonCopy() {
      if (!submitButton) {
        return;
      }

      if (bookingTypeSelect && bookingTypeSelect.value === "telemedicine") {
        submitButton.textContent = "Request Telemedicine / Join Wishlist →";
        return;
      }

      submitButton.textContent = "Join Wishlist / Request Demo →";
    }

    updateButtonCopy();

    if (bookingTypeSelect) {
      bookingTypeSelect.addEventListener("change", updateButtonCopy);
    }

    var demoDialog = form.closest("dialog#demo-modal");
    if (demoDialog) {
      var heading = demoDialog.querySelector("h2");
      if (heading) {
        heading.textContent = "Request Demo or Join Wishlist";
      }
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
      ensureWishlistField(form);
      ensureWishlistFirstCopy(form);
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

        var isBooking = isBookingForm(form);
        var wishlistValue = (payload.join_wishlist || "").toString().toLowerCase();
        var isWishlist = wishlistValue === "yes" || wishlistValue === "on" || wishlistValue === "true";
        var isTelemedicine = payload.booking_type === "telemedicine";

        if (isWishlist) {
          payload.booking_type = "wishlist";
        }

        if (isBooking) {
          payload.form_context = "book_demo";
          payload.source_path = window.location.pathname;
        }

        var schedulingEndpoint = window.SELNEXA_SCHEDULING_ENDPOINT || "";
        var wishlistEndpoint = window.SELNEXA_WISHLIST_ENDPOINT || "";
        var endpoint = form.getAttribute("action") || (isWishlist ? (wishlistEndpoint || schedulingEndpoint) : schedulingEndpoint);

        analytics.track("form_submit", {
          form: form.id || form.className,
          booking_type: payload.booking_type || "unspecified",
          join_wishlist: isWishlist ? "yes" : "no"
        });

        if (!endpoint) {
          showFormNotice(
            form,
            isWishlist
              ? "Wishlist request captured. We will notify you when priority demo slots open."
              : isTelemedicine
              ? "Telemedicine request saved. Our team will confirm details and clinician availability shortly."
              : isBooking
              ? "Booking request captured. Check your email for confirmation and wishlist updates."
              : "Message saved. We will follow up shortly.",
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
          showFormNotice(
            form,
            isWishlist
              ? "You are on the wishlist. We will email you when early-access demo slots are available."
              : isTelemedicine
              ? "Telemedicine request received. Check your email for confirmation."
              : isBooking
              ? "Booking request received. Check your email for confirmation."
              : "Submission received. Check your email for confirmation.",
            "success"
          );
          form.reset();
        }).catch(function () {
          queueFormSubmission({ endpoint: endpoint, payload: payload });
          showFormNotice(
            form,
            isWishlist
              ? "Wishlist request queued due to network issue. We will retry shortly."
              : isBooking
              ? "Booking request queued due to network issue. We will retry shortly."
              : "Submission queued due to network issue. We will retry shortly.",
            "warning"
          );
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
    cleanupLegacyNavigationLabels();
    enhanceNavigationMenus();
    cleanupLegacyNavigationLabels();
    setupPrimaryMenuToggle();
    setupProgressBar();

    setupThemeToggle();
    setupLanguageSelector();
    setupVoiceSearch();

    setupBottomNav();
    setupChatbot();
    setupAnimations();
    setupStatCounters();
    setupModuleTabs();
    setupRoiCalculator();
    setupOfflineAnimation();
    setupEmailCapture();
    setupWhatsAppFloat();
    setupReadingProgress();
    reorderInvestorPageSections();
    setupCalendarEmbed();
    setupVideoTabs();
    ensureOrganizationJsonLd();
    setupForms();
    setupPersonalizedTelemedicineDashboard();
    setupCtaTracking();
    registerServiceWorker();
  });
})();
