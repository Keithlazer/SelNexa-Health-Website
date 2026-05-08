(function () {
  var translations = {
    en: {
      "nav.home": "Home",
      "nav.solutions": "Platform",
      "nav.caseStudies": "Impact",
      "nav.telemedicine": "Telemedicine",
      "nav.telemedShort": "Telemed",
      "nav.casesShort": "Cases",
      "nav.pricing": "Pricing",
      "nav.investors": "Funders",
      "nav.resources": "Resources",
      "nav.careers": "Careers",
      "nav.security": "Security & Compliance",
      "nav.contact": "Contact",
      "nav.bookDemo": "Book Platform Demo",
      "nav.more": "More",
      "footer.quickLinks": "Quick Links",
      "hero.title": "SelNexa Health Platform for African Healthcare",
      "hero.overline": "SELNEXA HEALTH PLATFORM",
      "metrics.wait": "47% wait-time reduction",
      "metrics.cost": "62% cost reduction",
      "metrics.paperwork": "70% paperwork reduction",
      "metrics.duplicate": "60% fewer duplicate tests",
      "metrics.satisfaction": "94% patient satisfaction",
      "form.requestQuote": "Request custom quote",
      "search.placeholder": "Search pages"
    },
    fr: {
      "nav.home": "Accueil",
      "nav.solutions": "Plateforme",
      "nav.caseStudies": "Études de cas",
      "nav.telemedicine": "Télémédecine",
      "nav.telemedShort": "Téléméd",
      "nav.casesShort": "Cas",
      "nav.pricing": "Tarifs",
      "nav.investors": "Bailleurs",
      "nav.resources": "Ressources",
      "nav.careers": "Carrières",
      "nav.security": "Sécurité & conformité",
      "nav.contact": "Contact",
      "nav.bookDemo": "Démo plateforme",
      "nav.more": "Plus",
      "footer.quickLinks": "Liens rapides",
      "hero.title": "Une intelligence intégrée pour la santé en Afrique",
      "hero.overline": "INTELLIGENCE INTÉGRÉE",
      "metrics.wait": "47% de réduction du temps d'attente",
      "metrics.cost": "62% de réduction des coûts",
      "metrics.paperwork": "70% de réduction des tâches papier",
      "metrics.duplicate": "60% de tests en double en moins",
      "metrics.satisfaction": "94% de satisfaction des patients",
      "form.requestQuote": "Demander un devis personnalisé",
      "search.placeholder": "Rechercher des pages"
    },
    sn: {
      "nav.home": "Kumba",
      "nav.solutions": "Platform",
      "nav.caseStudies": "Nyaya dzeMiedzo",
      "nav.telemedicine": "Telemedicine",
      "nav.telemedShort": "Telemed",
      "nav.casesShort": "Nyaya",
      "nav.pricing": "Mitengo",
      "nav.investors": "Vatsigiri",
      "nav.resources": "Zvishandiso",
      "nav.careers": "Mabasa",
      "nav.security": "Chengetedzo neKutevedzera",
      "nav.contact": "Taura Nesu",
      "nav.bookDemo": "Bhuka Platform Demo",
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
      "nav.telemedShort": "Telemed",
      "nav.casesShort": "Amacala",
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
    var targetLang = ["en", "fr", "sn", "nd"].indexOf(lang) >= 0 ? lang : "en";

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
    supportedLanguages: ["en", "fr", "sn", "nd"],
    translations: translations,
    translatePage: translatePage,
    get: resolveTranslation
  };

  window.translatePage = translatePage;
})();
