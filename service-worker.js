self.addEventListener("install", (e) => {
  console.log("Service Worker instalado 🌸");
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker activado ✨");
});

self.addEventListener("fetch", (event) => {
  // Passthrough: no cache agresivo para evitar complejidad.
  // Podés agregar caching aquí si querés más offline.
});
