// Viteo's service worker (scope /pitch/viteo/): makes the prototype
// installable and gives it a branded offline screen. Pages always come from
// the network first (so a new deploy is never hidden behind a cache); only
// when the network fails does a navigation fall back to the offline page.
const CACHE = "viteo-offline-v1";
const OFFLINE = "/pitch/viteo/offline.html";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([OFFLINE, "/pitch/viteo/icon-192.png"])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return; // everything else: the browser as usual
  e.respondWith(fetch(e.request).catch(() => caches.match(OFFLINE)));
});
