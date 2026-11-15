const DEFAULT_LANG = "fr";
const buttons = document.querySelectorAll(".lang button");

function setLanguage(lang) {
  if (!translations[lang]) lang = DEFAULT_LANG;

  const locale = lang === "zh" ? "zh-CN" : lang;
  const messages = translations[lang];

  document.documentElement.lang = locale;
  document.title = messages.document_title;
  document.querySelector('meta[name="description"]').content = messages.meta_description;
  document.querySelector('meta[property="og:title"]').content = messages.document_title;
  document.querySelector('meta[property="og:description"]').content = messages.meta_description;
  document.querySelector('meta[name="twitter:title"]').content = messages.document_title;
  document.querySelector('meta[name="twitter:description"]').content = messages.meta_description;
  document.querySelector('meta[property="og:locale"]').content = {
    fr: "fr_FR",
    en: "en_US",
    es: "es_ES",
    zh: "zh_CN"
  }[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (messages[key] !== undefined) el.textContent = messages[key];
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.dataset.i18nAriaLabel;
    if (messages[key] !== undefined) el.setAttribute("aria-label", messages[key]);
  });

  buttons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  try { localStorage.setItem("lang", lang); } catch (e) { /* stockage indisponible */ }
}

function detectLanguage() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved) return saved;
  } catch (e) {}
  const browser = (navigator.language || "fr").slice(0, 2);
  return translations[browser] ? browser : DEFAULT_LANG;
}

buttons.forEach((b) => b.addEventListener("click", () => setLanguage(b.dataset.lang)));

const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", () => {
  const subject = contactForm.querySelector('[name="subject"]').value.trim();
  contactForm.querySelector('[name="_subject"]').value = subject;
});

document.getElementById("year").textContent = new Date().getFullYear();
setLanguage(detectLanguage());
