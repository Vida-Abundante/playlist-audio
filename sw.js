self.addEventListener("install", () => {
  console.log("Vida Abundante instalada 🌸");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clients.claim();
});

// Cache básico
const CACHE = "VA-AUDIOS-v1";

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(event.request).then(resp => {
        return resp || fetch(event.request).then(networkResp => {
          // Cachea solo GET
          if (event.request.method === "GET") {
            cache.put(event.request, networkResp.clone());
          }
          return networkResp;
        });
      })
    )
  );
});
