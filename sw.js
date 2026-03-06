self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// ✅ subí versión cuando cambies cosas importantes
const CACHE = "VA-AUDIOS-v2";

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // ✅ borrar caches viejos
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : Promise.resolve())));
    await clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Solo tu sitio GH Pages
  // (si tenés recursos externos, no los fuerces a cachear acá)
  // if (url.origin !== self.location.origin) return;

  // ✅ 1) Navegación (index.html): NETWORK FIRST (si hay internet, trae lo nuevo)
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: "no-store" });
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match(req);
        return cached || new Response("Sin conexión", { status: 503 });
      }
    })());
    return;
  }

  // ✅ 2) devocionales.json: NETWORK FIRST (para ver audios nuevos)
  if (url.pathname.endsWith("/devocionales.json")) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: "no-store" });
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match(req);
        return cached || new Response("[]", { headers: { "Content-Type":"application/json" } });
      }
    })());
    return;
  }

  // ✅ 3) MP3 e imágenes: CACHE FIRST (rápido) con fallback a red
  if (url.pathname.endsWith(".mp3") || url.pathname.endsWith(".png") || url.pathname.endsWith(".jpg") || url.pathname.endsWith(".jpeg") || url.pathname.endsWith(".webp")) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    })());
    return;
  }

  // ✅ 4) Resto: STALE WHILE REVALIDATE simple
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const fetchPromise = fetch(req).then((fresh) => {
      cache.put(req, fresh.clone());
      return fresh;
    }).catch(() => cached);
    return cached || fetchPromise;
  })());
});
