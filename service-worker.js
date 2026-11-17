/**
 * GuruStudy - Service Worker & Offline Cache Engine (Phase 10)
 * URL: https://gurustudy.webguruji.online
 */

const CACHE_NAME = 'gurustudy-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app/',
  '/app/index.html',
  '/app/css/styles.css',
  '/app/js/db-sync.js',
  '/app/js/syllabus-data.js',
  '/app/js/youtube_lectures_db.js',
  '/app/js/video-manager.js',
  '/app/js/timetable-engine.js',
  '/app/js/alarm-engine.js',
  '/app/js/focus-timer.js',
  '/app/js/analytics.js',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Cache-First strategy with Network Fallback for static assets
self.addEventListener('fetch', (event) => {
  // Do not cache downloads/APK files or Supabase API requests
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/downloads/') || url.hostname.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== 'basic'
        ) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/app/index.html');
        }
      });
    })
  );
});

// Push & Notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/app') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/app/');
      }
    })
  );
});
