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
    // Navigation preload: the page request starts while the worker boots.
    Promise.resolve(self.registration.navigationPreload?.enable()).catch(() => {})
      .then(() => caches.keys())
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return; // everything else: the browser as usual
  e.respondWith((async () => {
    try {
      const pre = await e.preloadResponse;
      if (pre) return pre;
      return await fetch(e.request);
    } catch {
      // Offline: the branded page, or a plain network error if it isn't
      // cached (respondWith(undefined) would throw).
      return (await caches.match(OFFLINE)) || Response.error();
    }
  })());
});
