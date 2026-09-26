/*
 * Service Worker – macht die Seite offline-fähig und installierbar (PWA).
 * Strategie: erst Netzwerk (damit neue Gedanken sofort erscheinen), sonst Cache.
 * Bei Änderungen an den Dateien die Versionsnummer erhöhen.
 */
const CACHE = "my-thought-v1";
const FILES = [
  "./",
  "index.html",
  "css/style.css",
  "js/thoughts.js",
  "js/app.js",
  "manifest.webmanifest",
  "icons/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
