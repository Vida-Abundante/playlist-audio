self.addEventListener("install", (event) => {
  console.log("Service Worker INSTALADO 💗");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker ACTIVADO ✨");
  clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("va-cache-v2").then((cache) =>
      cache.match(event.request).then((resp) => {
        return (
          resp ||
          fetch(event.request).then((response) => {
            if (event.request.url.startsWith("https://vida-abundante.github.io/")) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
        );
      })
    )
  );
});
