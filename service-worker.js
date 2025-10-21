const CACHE_NAME = 'playlist-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './IconoPlaylist.png',
  // Puedes agregar más archivos como audios si quieres que estén disponibles offline
];

// Instalar el service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activar el service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Interceptar fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Aquí podrías devolver una página offline personalizada si querés
    })
  );
});
