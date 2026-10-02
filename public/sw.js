// Kreyòl Ayisyen — service worker
// Strategy: never cache API routes or auth routes (dynamic, per-user, sensitive).
// Static assets (_next/static, icons, fonts): cache-first.
// Navigations (HTML pages): network-first, falling back to cache, then to /offline.

const CACHE_VERSION = "kreyol-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGES_CACHE = `${CACHE_VERSION}-pages`;

const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [OFFLINE_URL, "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("kreyol-") && key !== STATIC_CACHE && key !== PAGES_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isApiOrAuthRequest(url) {
  return url.pathname.startsWith("/api/");
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/favicon.ico"
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (["localhost", "127.0.0.1"].includes(self.location.hostname)) return;
  if (isApiOrAuthRequest(url)) return; // always network, never cached

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const cache = await caches.open(PAGES_CACHE);
          cache.put(request, response.clone());
          return response;
        } catch {
          const cache = await caches.open(PAGES_CACHE);
          const cached = await cache.match(request);
          return cached || (await caches.match(OFFLINE_URL));
        }
      })()
    );
  }
});

// Badging API & Push Notifications em segundo plano
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "SET_BADGE") {
    const count = Number(event.data.count) || 0;
    if ("setAppBadge" in self.registration) {
      if (count > 0) {
        self.registration.setAppBadge(count).catch(() => {});
      } else {
        self.registration.clearAppBadge().catch(() => {});
      }
    }
  } else if (event.data.type === "CLEAR_BADGE") {
    if ("clearAppBadge" in self.registration) {
      self.registration.clearAppBadge().catch(() => {});
    }
  }
});

self.addEventListener("push", (event) => {
  let data = { title: "Kreyòl Ayisyen", body: "Nova atualização disponível!", count: 1 };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    // fallback se não for json
  }

  const options = {
    body: data.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { url: data.url || "/dashboard" },
    tag: data.url || "kreyol-update",
  };
  const count = Math.max(0, Math.floor(Number(data.count) || 0));

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title, options),
      count > 0 && "setAppBadge" in self.registration
        ? self.registration.setAppBadge(count).catch(() => {})
        : Promise.resolve(),
    ])
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/dashboard", self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(targetUrl);
      })
      .then(() => {
        if ("clearAppBadge" in self.registration) {
          return self.registration.clearAppBadge().catch(() => {});
        }
      })
  );
});
