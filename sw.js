const CACHE_VERSION = "2026-10-19-v4";
const STATIC_CACHE = `selnexa-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `selnexa-dynamic-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

// Every entry must exist: one missing file makes the whole install fail.
// Stylesheet bundles and the shared JS carry a content hash (see tools/build-site.mjs) and are cached on first use.
// home.css is only here for offline.html, the one page that still links a stylesheet directly.
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/features.html",
  "/case-studies.html",
  "/telemedicine.html",
  "/pricing.html",
  "/for-investors.html",
  "/resources.html",
  "/careers.html",
  "/security-and-compliance.html",
  "/appointments.html",
  "/contact.html",
  "/offline.html",
  "/styles/home.css",
  "/manifest.json",
  "/favicon.ico",
  "/assets/selnexa-logo-128.webp",
  "/assets/selnexa-logo-128.png",
  "/assets/fonts/montserrat-latin-var.woff2",
  "/assets/fonts/icons-solid.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, DYNAMIC_CACHE].includes(key))
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  const cache = await caches.open(DYNAMIC_CACHE);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || caches.match(OFFLINE_URL);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkFetch;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.destination === "image") {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (["style", "script", "font"].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
