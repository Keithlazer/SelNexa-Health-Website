self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('selnexa-v1').then(cache => cache.addAll([
      '/', '/index.html', '/css/main.css', '/js/main.js', '/assets/selnexa-logo-full.png'
    ]))
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
}); 