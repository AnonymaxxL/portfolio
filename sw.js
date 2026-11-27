// Réseau d'abord : les mises à jour du site arrivent sans attendre.
// La copie en cache ne sert que si la connexion est coupée.
const CACHE = "yra-portfolio-v2";
const FILES = [
  "./", "index.html", "style.css", "translations.js", "script.js",
  "site.webmanifest", "logo.svg", "favicon.svg", "photo.jpg.jpeg",
  "icon-192.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith("yra-portfolio-") && key !== CACHE)
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== location.origin) return;

  event.respondWith(
    fetch(request, { cache: "no-cache" })
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, copy)));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request, { ignoreSearch: true });
        return cached || Response.error();
      })
  );
});
