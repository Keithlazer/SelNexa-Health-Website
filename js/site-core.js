/*
 * Shared behaviour for every page: header and mobile menu, demo modal, forms, small widgets.
 * Loaded with "defer" from the scripts partial (includes/scripts.html).
 */
(function () {
  "use strict";

  if (window.__selnexaCoreLoaded) {
    return;
  }
  window.__selnexaCoreLoaded = true;

  var CONTACT_EMAIL = "contact@selnexahealth.com";
  var WHATSAPP_DISPLAY = "+263 77 772 6065";
  var QUEUE_KEY = "selnexa-offline-form-queue";
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  // Reports events only if a privacy-friendly analytics script (such as Plausible) is added to the site later.
  function track(eventName, props) {
    try {
      if (typeof window.plausible === "function") {
        window.plausible(eventName, { props: props || {} });
      }
    } catch (err) {
      // ignore
    }
  }

  function storage() {
    try {
      return window.localStorage;
    } catch (err) {
      return null;
    }
  }

  /* ---------- Header: mobile menu, scrolled state, scroll progress ---------- */

  function setupHeader() {
    var header = document.querySelector("[data-sx-header]");
    if (!header) {
      return;
    }
    var toggle = header.querySelector(".sx-nav-toggle");
    var menu = header.querySelector("#sx-menu");
    var progress = header.querySelector(".sx-progress");
    header.setAttribute("data-menu-ready", "");

    function setOpen(open) {
      header.classList.toggle("is-open", open);
      if (toggle) {
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      }
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && header.classList.contains("is-open")) {
        setOpen(false);
        if (toggle) {
          toggle.focus();
        }
      }
    });

    if (menu) {
      menu.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
          setOpen(false);
        }
      });
    }

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1023) {
        setOpen(false);
      }
    });

    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || document.documentElement.scrollTop;
      header.classList.toggle("is-scrolled", y > 40);
      if (progress) {
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progress.style.width = (height > 0 ? Math.min(100, (y / height) * 100) : 0) + "%";
      }
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    // Only needed when the page loads already scrolled (back/forward). Reading the scroll height straight away
    // would force a full layout inside this startup task, so wait for the first frame.
    window.requestAnimationFrame(update);
  }

  /* ---------- Scroll reveal (skipped when the visitor prefers reduced motion) ---------- */

  function setupReveal() {
    var nodes = document.querySelectorAll(".animate-on-scroll, .reveal, [data-animate]");
    if (!nodes.length) {
      return;
    }
    function show(node) {
      node.classList.add("animate-in", "in-view", "visible", "revealed");
    }
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach(show);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  /* ---------- Logo strip: static list by default; scrolls (with a pause button) when motion is welcome ---------- */

  function setupMarquee() {
    if (reduceMotion) {
      return;
    }
    document.querySelectorAll("[data-marquee]").forEach(function (box) {
      var list = box.querySelector("ul");
      if (!list || box.classList.contains("is-animated")) {
        return;
      }
      var copy = list.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      copy.removeAttribute("aria-label");
      copy.querySelectorAll("a").forEach(function (link) {
        link.setAttribute("tabindex", "-1");
      });
      copy.querySelectorAll("img").forEach(function (img) {
        img.alt = "";
      });
      var track = document.createElement("div");
      track.className = "strip-track";
      list.parentNode.insertBefore(track, list);
      track.appendChild(list);
      track.appendChild(copy);

      var button = document.createElement("button");
      button.type = "button";
      button.className = "strip-toggle";
      button.textContent = "Pause logos";
      button.addEventListener("click", function () {
        var paused = box.classList.toggle("is-paused");
        button.textContent = paused ? "Play logos" : "Pause logos";
      });
      box.parentNode.insertBefore(button, box.nextSibling);
      box.classList.add("is-animated");
    });
  }

  /* ---------- Count-up numbers: reserved for measured results ---------- */

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target") || "0");
    if (Number.isNaN(target) || el.getAttribute("data-counter-complete") === "true") {
      return;
    }
    el.setAttribute("data-counter-complete", "true");
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = Number.isInteger(target) ? 0 : 1;
    if (reduceMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }
    var duration = parseInt(el.getAttribute("data-duration") || "1500", 10);
    var start = performance.now();
    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + (progress === 1 ? target.toFixed(decimals) : (target * eased).toFixed(decimals)) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  function setupCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) {
      return;
    }
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });
    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  /* ---------- Tabs (Platform modules, investor demo videos) ---------- */

  function setupModuleTabs() {
    var tabs = document.querySelectorAll(".module-tab[data-module]");
    if (!tabs.length) {
      return;
    }
    function select(tab) {
      var target = tab.getAttribute("data-module");
      tabs.forEach(function (button) {
        var active = button === tab;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", active ? "true" : "false");
        button.setAttribute("tabindex", active ? "0" : "-1");
      });
      document.querySelectorAll(".module-content[data-module-panel]").forEach(function (panel) {
        var shown = panel.getAttribute("data-module-panel") === target;
        panel.classList.toggle("active", shown);
        panel.hidden = !shown;
      });
    }
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        select(tab);
      });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (next) {
          event.preventDefault();
          select(next);
          next.focus();
        }
      });
    });
    var current = document.querySelector(".module-tab.active") || tabs[0];
    select(current);
  }

  function setupVideoTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".video-tab-controls .tab-btn[data-tab]"));
    function select(button) {
      var target = button.getAttribute("data-tab");
      var group = button.closest(".video-tabs") || document;
      group.querySelectorAll(".tab-btn[data-tab]").forEach(function (tab) {
        var selected = tab === button;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.setAttribute("tabindex", selected ? "0" : "-1");
      });
      group.querySelectorAll(".video-tab-content").forEach(function (panel) {
        var shown = panel.id === "tab-" + target;
        panel.classList.toggle("hidden", !shown);
        panel.hidden = !shown;
        var video = panel.querySelector("video");
        if (video && !shown) {
          video.pause();
        }
      });
    }
    tabs.forEach(function (button, index) {
      button.addEventListener("click", function () {
        select(button);
      });
      button.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (next) {
          event.preventDefault();
          select(next);
          next.focus();
        }
      });
    });
  }

  /* ---------- Module finder and WhatsApp button (styled in site-chrome.css) ---------- */

  var CHAT_ICON = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M20 11.5a7.5 7.5 0 0 1-11.1 6.6L4 19.5l1.4-4.4A7.5 7.5 0 1 1 20 11.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

  // Both floating widgets live in one labelled landmark so screen reader users can find them.
  function floatingRegion() {
    var region = document.querySelector(".sx-floats");
    if (!region) {
      region = document.createElement("aside");
      region.className = "sx-floats";
      region.setAttribute("aria-label", "Quick help");
      document.body.appendChild(region);
    }
    return region;
  }

  function setupModuleFinder() {
    if (document.querySelector(".sx-finder-toggle")) {
      return;
    }
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "sx-float sx-finder-toggle";
    toggle.setAttribute("aria-label", "Open module finder");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "module-finder");
    toggle.innerHTML = CHAT_ICON;

    var panel = document.createElement("section");
    panel.className = "sx-finder";
    panel.id = "module-finder";
    panel.hidden = true;
    panel.setAttribute("aria-labelledby", "module-finder-title");
    panel.innerHTML = [
      '<div class="sx-finder__head"><h2 id="module-finder-title">Module finder</h2><button type="button" class="sx-finder__close" aria-label="Close module finder">&times;</button></div>',
      '<div class="sx-finder__messages" aria-live="polite"><p>Tell us what kind of institution you run and we will suggest where to start.</p></div>',
      '<div class="sx-finder__controls">',
      '<label for="facility-recommendation">Institution type</label>',
      '<select id="facility-recommendation">',
      '<option value="centre">Health centre</option>',
      '<option value="hospital">Hospital</option>',
      '<option value="network">Network or government</option>',
      "</select>",
      '<button type="button" class="sx-finder__suggest">Suggest modules</button>',
      '<a href="/appointments.html" class="sx-finder__demo" data-demo-trigger>Book a demo</a>',
      "</div>"
    ].join("");

    var region = floatingRegion();
    region.appendChild(toggle);
    region.appendChild(panel);

    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close module finder" : "Open module finder");
    }
    toggle.addEventListener("click", function () {
      setOpen(panel.hidden);
      if (!panel.hidden) {
        panel.querySelector("select").focus();
      }
    });
    panel.querySelector(".sx-finder__close").addEventListener("click", function () {
      setOpen(false);
      toggle.focus();
    });
    panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.focus();
      }
    });
    panel.querySelector(".sx-finder__suggest").addEventListener("click", function () {
      var value = panel.querySelector("#facility-recommendation").value;
      var message = value === "centre"
        ? "Suggested start: Administration and Predictive Procurement."
        : value === "hospital"
        ? "Suggested start: all four modules (Administration, Predictive Procurement, Health Records and Real-Time Analytics)."
        : "Suggested start: a network licence covering every module, with analytics across sites.";
      var messages = panel.querySelector(".sx-finder__messages");
      var item = document.createElement("p");
      item.textContent = message;
      messages.appendChild(item);
      messages.scrollTop = messages.scrollHeight;
      track("module_finder", { institution_type: value });
    });
  }

  function setupWhatsApp() {
    if (document.querySelector(".sx-whatsapp")) {
      return;
    }
    var link = document.createElement("a");
    link.href = "https://wa.me/263777726065?text=Hi%2C%20I'm%20interested%20in%20learning%20more%20about%20the%20SelNexa%20Health%20Platform.";
    link.className = "sx-float sx-whatsapp";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Message SelNexa Health on WhatsApp (opens in a new tab)");
    var icon = document.createElement("img");
    icon.src = "/assets/whatsapp-icon.svg";
    icon.alt = "";
    icon.width = 28;
    icon.height = 28;
    link.appendChild(icon);
    floatingRegion().appendChild(link);
  }

  /* ---------- Demo modal ---------- */

  function preselectInterest(scope, value) {
    var select = scope.querySelector("select[name='interest']");
    if (!select || !value) {
      return;
    }
    for (var i = 0; i < select.options.length; i += 1) {
      if (select.options[i].value === value) {
        select.selectedIndex = i;
        return;
      }
    }
  }

  function focusables(container) {
    return Array.prototype.filter.call(
      container.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"),
      function (el) {
        return !el.closest(".sx-hp") && el.offsetParent !== null;
      }
    );
  }

  function setupDemoModal() {
    var dialog = document.getElementById("demo-modal");
    var canOpen = !!(dialog && typeof dialog.showModal === "function");
    var lastTrigger = null;

    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-demo-trigger]");
      if (!trigger || !canOpen) {
        return;
      }
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      event.preventDefault();
      lastTrigger = trigger;
      preselectInterest(dialog, trigger.getAttribute("data-interest"));
      dialog.showModal();
      var first = focusables(dialog).filter(function (el) {
        return el.matches("input, select, textarea");
      })[0];
      if (first) {
        first.focus();
      }
      track("demo_modal_open", { from: window.location.pathname });
    });

    if (!canOpen) {
      return;
    }

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });
    dialog.querySelectorAll("[data-modal-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        dialog.close();
      });
    });
    dialog.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") {
        return;
      }
      var items = focusables(dialog);
      if (!items.length) {
        return;
      }
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    dialog.addEventListener("close", function () {
      if (lastTrigger && document.body.contains(lastTrigger)) {
        lastTrigger.focus();
      }
    });
  }

  /* ---------- Forms ---------- */

  var FIELD_LABELS = {
    name: "Name",
    email: "Email",
    phone: "Phone",
    organisation: "Organisation",
    role: "Role",
    institution_type: "Institution type",
    country: "Country",
    interest: "Request",
    topic: "Topic",
    message: "Message"
  };

  function endpointFor(kind) {
    return window.SELNEXA_FORM_ENDPOINT || (kind === "updates" ? window.SELNEXA_WISHLIST_ENDPOINT : window.SELNEXA_SCHEDULING_ENDPOINT) || "";
  }

  function clearErrors(form) {
    form.querySelectorAll(".sx-error").forEach(function (node) {
      node.remove();
    });
    form.querySelectorAll("[aria-invalid]").forEach(function (field) {
      field.removeAttribute("aria-invalid");
      var described = (field.getAttribute("aria-describedby") || "").split(" ").filter(function (id) {
        return id && !/-error$/.test(id);
      }).join(" ");
      if (described) {
        field.setAttribute("aria-describedby", described);
      } else {
        field.removeAttribute("aria-describedby");
      }
    });
  }

  function errorText(field) {
    if (field.validity.valueMissing) {
      if (field.type === "checkbox") return "Please tick this box to continue.";
      if (field.tagName === "SELECT") return "Please choose an option.";
      return "Please fill in this field.";
    }
    if (field.validity.typeMismatch && field.type === "email") {
      return "Please enter an email address, like name@example.com.";
    }
    return field.validationMessage || "Please check this field.";
  }

  function validate(form) {
    clearErrors(form);
    var first = null;
    var count = 0;
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      if (field.closest(".sx-hp") || field.type === "hidden" || field.disabled || field.checkValidity()) {
        return;
      }
      count += 1;
      var id = (field.id || field.name) + "-error";
      var message = document.createElement("p");
      message.className = "sx-error";
      message.id = id;
      message.textContent = errorText(field);
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", ((field.getAttribute("aria-describedby") || "") + " " + id).trim());
      (field.closest(".sx-field") || field.parentNode).appendChild(message);
      if (!first) {
        first = field;
      }
    });
    if (first) {
      first.focus();
    }
    return count;
  }

  function collect(form) {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field.name || field.name === "website" || field.disabled) {
        return;
      }
      if (field.type === "checkbox") {
        data[field.name] = field.checked ? "yes" : "no";
      } else if (field.tagName === "SELECT") {
        data[field.name] = field.value ? field.options[field.selectedIndex].text : "";
      } else {
        data[field.name] = String(field.value || "").trim();
      }
    });
    return data;
  }

  function mailtoFor(kind, data) {
    var subject = kind === "demo"
      ? "Demo request" + (data.organisation ? " from " + data.organisation : "")
      : kind === "updates"
      ? "Please add me to SelNexa Health updates"
      : "Message from the website" + (data.topic ? ": " + data.topic : "");
    var lines = [];
    Object.keys(FIELD_LABELS).forEach(function (key) {
      if (data[key]) {
        lines.push(FIELD_LABELS[key] + ": " + data[key]);
      }
    });
    if (data.consent === "yes") {
      lines.push("", "I agree to SelNexa Health using these details to reply to me.");
    }
    lines.push("", "Sent from " + window.location.href);
    return "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function setStatus(form, text, state) {
    var status = form.querySelector(".sx-form__status") || form.querySelector(".capture-note");
    if (!status) {
      return;
    }
    status.className = status.classList.contains("capture-note") ? "capture-note" : "sx-form__status" + (state ? " is-" + state : "");
    status.textContent = text;
  }

  function showDone(form, title, paragraphs, mailto) {
    var box = document.createElement("div");
    box.className = "sx-form-done";
    box.setAttribute("tabindex", "-1");
    var heading = document.createElement("h3");
    heading.textContent = title;
    box.appendChild(heading);
    paragraphs.forEach(function (text) {
      var p = document.createElement("p");
      p.textContent = text;
      box.appendChild(p);
    });
    if (mailto) {
      var p = document.createElement("p");
      var link = document.createElement("a");
      link.href = mailto;
      link.textContent = "Open the email again";
      p.appendChild(link);
      box.appendChild(p);
    }
    form.hidden = true;
    form.parentNode.insertBefore(box, form.nextSibling);
    box.focus();
  }

  function queueSubmission(endpoint, data) {
    var store = storage();
    if (!store) return;
    try {
      var queue = JSON.parse(store.getItem(QUEUE_KEY) || "[]");
      queue.push({ endpoint: endpoint, payload: data });
      store.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (err) {
      // ignore
    }
  }

  function flushQueue() {
    var store = storage();
    if (!store || !navigator.onLine) return;
    var queue;
    try {
      queue = JSON.parse(store.getItem(QUEUE_KEY) || "[]");
    } catch (err) {
      queue = [];
    }
    if (!queue.length) return;
    var pending = [];
    var chain = Promise.resolve();
    queue.forEach(function (item) {
      chain = chain.then(function () {
        return fetch(item.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(item.payload),
          credentials: "omit"
        }).then(function (response) {
          if (!response.ok) pending.push(item);
        }).catch(function () {
          pending.push(item);
        });
      });
    });
    chain.then(function () {
      try {
        store.setItem(QUEUE_KEY, JSON.stringify(pending));
      } catch (err) {
        // ignore
      }
    });
  }

  function submit(form) {
    var kind = form.getAttribute("data-sx-form") || "contact";
    if (validate(form)) {
      setStatus(form, "Please correct the highlighted fields.", "error");
      return;
    }
    var trap = form.querySelector("input[name='website']");
    if (trap && trap.value) {
      return;
    }
    var data = collect(form);
    data.form = kind;
    data.page = window.location.pathname;
    data.submitted_at = new Date().toISOString();
    var mailto = mailtoFor(kind, data);
    var endpoint = endpointFor(kind);
    track("form_submit", { form: kind });

    if (!endpoint) {
      showDone(form, "Your email app should open now", [
        "We've put your details into a new email to " + CONTACT_EMAIL + ". Press send in your email app and it will reach us.",
        "If nothing opened, email " + CONTACT_EMAIL + " or message us on WhatsApp on " + WHATSAPP_DISPLAY + "."
      ], mailto);
      window.location.href = mailto;
      return;
    }

    if (!navigator.onLine) {
      queueSubmission(endpoint, data);
      showDone(form, "Saved on this device", [
        "You're offline. Your request is saved on this device and will be sent automatically when you're back online."
      ]);
      return;
    }

    var button = form.querySelector("[type='submit']");
    if (button) button.disabled = true;
    setStatus(form, "Sending...", "");
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
      credentials: "omit"
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      showDone(form, kind === "updates" ? "You're on the list" : "Thanks, it has reached us", [
        kind === "updates" ? "We'll email you when there is news on the first pilot." : "We'll reply by email."
      ]);
    }).catch(function () {
      if (button) button.disabled = false;
      setStatus(form, "We couldn't send this just now. Please try again, or email " + CONTACT_EMAIL + ".", "error");
    });
  }

  function setupForms() {
    document.querySelectorAll("form[data-sx-form]").forEach(function (form) {
      form.noValidate = true;
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        submit(form);
      });
    });
    var params = new URLSearchParams(window.location.search);
    var interest = params.get("interest") || params.get("type");
    if (interest) {
      document.querySelectorAll("form[data-sx-form='demo']").forEach(function (form) {
        preselectInterest(form, interest);
      });
    }
    var topic = params.get("topic");
    if (topic) {
      document.querySelectorAll("select[name='topic']").forEach(function (select) {
        for (var i = 0; i < select.options.length; i += 1) {
          if (select.options[i].value === topic) select.selectedIndex = i;
        }
      });
    }
    window.addEventListener("online", flushQueue);
    flushQueue();
  }

  /* ---------- Service worker and CTA tracking ---------- */

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {
        // ignore
      });
    });
  }

  function setupCtaTracking() {
    document.addEventListener("click", function (event) {
      var target = event.target.closest("a.btn, button.btn, .sx-cta, [data-track]");
      if (target) {
        // data-track names its own event, so a page's calls to action can be counted apart from demo requests.
        track(target.getAttribute("data-track") || "cta_click", { label: (target.textContent || "").trim(), href: target.getAttribute("href") || "button", page: window.location.pathname });
      }
    });
  }

  // Things the visitor can use straight away run first; extras wait until the browser is idle so they do not
  // lengthen the first busy period after the page appears.
  var whenIdle = window.requestIdleCallback
    ? function (fn) { window.requestIdleCallback(fn, { timeout: 2500 }); }
    : function (fn) { window.setTimeout(fn, 200); };

  onReady(function () {
    setupHeader();
    setupDemoModal();
    setupForms();
    setupModuleTabs();
    setupVideoTabs();
    setupReveal();
    setupCounters();
    setupCtaTracking();
    whenIdle(setupMarquee);
    whenIdle(setupModuleFinder);
    whenIdle(setupWhatsApp);
    registerServiceWorker();
  });
})();
