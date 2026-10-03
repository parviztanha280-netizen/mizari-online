const CACHE = "mizari-v5";

const ASSETS = [
  "./",
  "./login.html",
  "./index.html",
  "./style.css",
  "./api.js",
  "./config.js",
  "./realtime.js",
  "./map.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) {
          return cached;
        }

        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }

            const copy = response.clone();

            caches.open(CACHE)
              .then(cache => cache.put(event.request, copy))
              .catch(() => {});

            return response;
          })
          .catch(() => caches.match("./login.html"));
      })
  );
});

self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }

  event.waitUntil(
    self.registration.showNotification(
      "میزاری آنلاین",
      {
        body: data.message || "وضعیت سفر تغییر کرد",
        dir: "rtl"
      }
    )
  );
});
