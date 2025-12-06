// --- Forzar actualización inmediata del Service Worker ---
self.addEventListener("install", (event) => {
  console.log("Service Worker instalado 💗");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activado ✨");
  clients.claim();
});

// --- Cache simple para funcionamiento offline ---
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("va-cache").then((cache) =>
      cache.match(event.request).then((resp) => {
        return (
          resp ||
          fetch(event.request).then((response) => {
            // Solo cachea archivos del repo de GitHub Pages
            if (
              event.request.url.startsWith("https://vida-abundante.github.io/")
            ) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
        );
      })
    )
  );
});
