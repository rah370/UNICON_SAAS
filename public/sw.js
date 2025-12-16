// Service Worker for offline functionality
const CACHE_NAME = "unicon-saas-v5"; // Updated to force cache refresh - Dec 14 2024 - Messages simplified with color coding
const OFFLINE_URL = "/offline.html";

// Files to cache for offline functionality
const CACHE_URLS = [
  "/",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  "/UNICON.png",
  "/offline.html",
];

// Install event - cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(CACHE_URLS);
      })
      .catch((error) => {
        console.log("Cache install failed:", error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith("http")) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Don't cache JavaScript files - always fetch from network for fresh code
  if (url.pathname.endsWith('.js') || url.pathname.includes('/src/') || url.pathname.includes('/assets/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Only use cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Only cache static assets, not dynamic content
        if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|ico|css|woff|woff2|ttf|eot)$/)) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }

        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            // If both cache and network fail, show offline page for navigation requests
            if (!cachedResponse && event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
            return cachedResponse;
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get offline actions from IndexedDB
    const offlineActions = await getOfflineActions();

    for (const action of offlineActions) {
      try {
        await syncAction(action);
        await removeOfflineAction(action.id);
      } catch (error) {
        console.log("Failed to sync action:", action, error);
      }
    }
  } catch (error) {
    console.log("Background sync failed:", error);
  }
}

// Helper functions for offline data management
async function getOfflineActions() {
  // This would typically use IndexedDB
  return [];
}

async function syncAction(action) {
  // Sync individual action to server
  const response = await fetch("/api/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(action),
  });

  if (!response.ok) {
    throw new Error("Sync failed");
  }
}

async function removeOfflineAction(actionId) {
  // Remove synced action from offline storage
  console.log("Removing synced action:", actionId);
}

// Push notification handling
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New notification from UNICON",
    icon: "/UNICON.png",
    badge: "/UNICON.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View",
        icon: "/UNICON.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/UNICON.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("UNICON Notification", options)
  );
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});
