(function () {
  var translations = {
    en: {
      "nav.home": "Home",
      "nav.solutions": "Solutions",
      "nav.caseStudies": "Case Studies",
      "nav.telemedicine": "Telemedicine",
      "nav.pricing": "Pricing",
      "nav.investors": "Investors",
      "nav.resources": "Resources",
      "nav.careers": "Careers",
      "nav.security": "Security & Compliance",
      "nav.contact": "Contact",
      "nav.bookDemo": "Book Demo",
      "nav.more": "More",
      "footer.quickLinks": "Quick Links",
      "hero.title": "Integrated Intelligence for African Healthcare",
      "hero.overline": "INTEGRATED INTELLIGENCE",
      "metrics.wait": "47% wait-time reduction",
      "metrics.cost": "62% cost reduction",
      "metrics.paperwork": "70% paperwork reduction",
      "metrics.duplicate": "60% fewer duplicate tests",
      "metrics.satisfaction": "94% patient satisfaction",
      "form.requestQuote": "Request custom quote",
      "search.placeholder": "Search pages"
    },
    sn: {
      "nav.home": "Kumba",
      "nav.solutions": "Mhinduro",
      "nav.caseStudies": "Nyaya dzeMiedzo",
      "nav.telemedicine": "Telemedicine",
      "nav.pricing": "Mitengo",
      "nav.investors": "Vanoisa Mari",
      "nav.resources": "Zvishandiso",
      "nav.careers": "Mabasa",
      "nav.security": "Chengetedzo neKutevedzera",
      "nav.contact": "Taura Nesu",
      "nav.bookDemo": "Bhuka Demo",
      "nav.more": "Zvimwe",
      "footer.quickLinks": "MaLink Ekukurumidza",
      "hero.title": "Hungwaru Hwakasanganiswa hweHutano hweAfrica",
      "hero.overline": "HUNGWARU HWAKASANGANISWA",
      "metrics.wait": "47% kuderedzwa kwenguva yekumirira",
      "metrics.cost": "62% kuderedzwa kwemari",
      "metrics.paperwork": "70% kuderedzwa kwe mapepa",
      "metrics.duplicate": "60% kuderedzwa kwemiedzo yakapetwa",
      "metrics.satisfaction": "94% kugutsikana kwevarwere",
      "form.requestQuote": "Kumbira mutengo wakasarudzika",
      "search.placeholder": "Tsvaga mapeji"
    },
    nd: {
      "nav.home": "Ekhaya",
      "nav.solutions": "Izixazululo",
      "nav.caseStudies": "Amacala Esifundo",
      "nav.telemedicine": "Telemedicine",
      "nav.pricing": "Intengo",
      "nav.investors": "Abatshali Bezimali",
      "nav.resources": "Izinsiza",
      "nav.careers": "Imisebenzi",
      "nav.security": "Ukuvikeleka Lokuthobela",
      "nav.contact": "Xhumana Lathi",
      "nav.bookDemo": "Bhukha iDemo",
      "nav.more": "Okunye",
      "footer.quickLinks": "AmaLink Asheshayo",
      "hero.title": "Ubuhlakani Obuhlanganisiwe Bezempilo eAfrica",
      "hero.overline": "UBUHLAKANI OBUHLANGANISIWE",
      "metrics.wait": "47% ukwehla kwesikhathi sokulinda",
      "metrics.cost": "62% ukwehla kwezindleko",
      "metrics.paperwork": "70% ukwehla kwemisebenzi yephepha",
      "metrics.duplicate": "60% ukwehla kokuphindaphinda ukuhlolwa",
      "metrics.satisfaction": "94% ukwaneliseka kweziguli",
      "form.requestQuote": "Cela intengo eyenziwe ngokwezifiso",
      "search.placeholder": "Sesha amakhasi"
    }
  };

  function resolveTranslation(lang, key) {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return null;
  }

  function translatePage(lang) {
    var targetLang = ["en", "sn", "nd"].indexOf(lang) >= 0 ? lang : "en";

    document.documentElement.setAttribute("lang", targetLang);
    localStorage.setItem("selnexa-language", targetLang);

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      var value = resolveTranslation(targetLang, key);
      if (value) {
        node.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      var placeholderKey = node.getAttribute("data-i18n-placeholder");
      var placeholderValue = resolveTranslation(targetLang, placeholderKey);
      if (placeholderValue) {
        node.setAttribute("placeholder", placeholderValue);
      }
    });
  }

  window.SelNexaI18n = {
    defaultLanguage: "en",
    supportedLanguages: ["en", "sn", "nd"],
    translations: translations,
    translatePage: translatePage,
    get: resolveTranslation
  };

  window.translatePage = translatePage;
})();
