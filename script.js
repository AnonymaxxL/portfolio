const DEFAULT_LANG = "fr";
const buttons = document.querySelectorAll(".lang button");

function setLanguage(lang) {
  if (!translations[lang]) lang = DEFAULT_LANG;

  const locale = lang === "zh" ? "zh-CN" : lang;
  const messages = translations[lang];
  const isNotFoundPage = document.body.dataset.page === "not-found";
  const title = isNotFoundPage ? messages.notfound_document_title : messages.document_title;
  const description = isNotFoundPage ? messages.notfound_meta_description : messages.meta_description;

  document.documentElement.lang = locale;
  document.title = title;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = title;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[property="og:image:alt"]').content = messages.meta_social_image_alt;
  document.querySelector('meta[name="twitter:title"]').content = title;
  document.querySelector('meta[name="twitter:description"]').content = description;
  document.querySelector('meta[name="twitter:image:alt"]').content = messages.meta_social_image_alt;
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

const navLinks = document.querySelectorAll(".nav a");
const navTargets = Array.from(navLinks, (link) => document.querySelector(link.hash));

function setActiveNavigation(sectionId) {
  navLinks.forEach((link) => {
    if (link.hash === `#${sectionId}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveNavigation(link.hash.slice(1)));
});

if (window.IntersectionObserver) {
  const activeSections = new Set();
  const navigationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activeSections.add(entry.target);
      else activeSections.delete(entry.target);
    });

    const activeSection = Array.from(activeSections)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    if (activeSection) setActiveNavigation(activeSection.id);
  }, { rootMargin: "-20% 0px -70% 0px" });

  navTargets.forEach((target) => {
    if (target) navigationObserver.observe(target);
  });
}

const revealTargets = document.querySelectorAll(
  ".hero > *, .section > h2, .section > p, .section > .grid > *, .section > .skills-grid > *, .contact-actions"
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (window.IntersectionObserver && !reduceMotion) {
  revealTargets.forEach((target, index) => {
    target.classList.add("reveal-on-scroll");
    target.style.setProperty("--reveal-delay", `${Math.min(index % 5, 3) * 70}ms`);
  });
  document.body.classList.add("reveal-enabled");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => revealObserver.observe(target));
}

const contactForm = document.querySelector(".contact-form");
if (contactForm) contactForm.addEventListener("submit", () => {
  const subject = contactForm.querySelector('[name="subject"]').value.trim();
  contactForm.querySelector('[name="_subject"]').value = subject;
});

document.getElementById("year").textContent = new Date().getFullYear();
setLanguage(detectLanguage());
