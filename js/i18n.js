const translations = {
  en: { welcome: 'Welcome to SelNexa Health!' },
  es: { welcome: '¡Bienvenido a SelNexa Health!' },
  fr: { welcome: 'Bienvenue chez SelNexa Health!' }
};
export function setLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
  });
} 