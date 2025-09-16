const CACHE_NAME = 'ibias-v1'
const STATIC_CACHE = 'ibias-static-v1'
const DYNAMIC_CACHE = 'ibias-dynamic-v1'

// Assets to cache for offline access
const STATIC_ASSETS = [
  '/',
  '/auth',
  '/manifest.json',
  '/icon-192x192.svg',
  '/icon-512x512.svg'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE
            })
            .map((cacheName) => {
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone)
              })
          }
          return response
        })
        .catch(() => {
          // Serve from cache when offline
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Fallback to auth page for navigation requests
              if (url.pathname.includes('/auth')) {
                return caches.match('/auth')
              }
              return caches.match('/')
            })
        })
    )
    return
  }

  // Handle other requests (API, assets, etc.)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        
        return fetch(request)
          .then((response) => {
            // Cache successful responses for static assets
            if (response.status === 200 && 
                (request.destination === 'script' || 
                 request.destination === 'style' || 
                 request.destination === 'image')) {
              const responseClone = response.clone()
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone)
                })
            }
            return response
          })
          .catch(() => {
            // Return a basic offline response for failed requests
            if (request.destination === 'document') {
              return new Response(
                '<html><body><h1>You are offline</h1><p>Please check your connection and try again.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              )
            }
          })
      })
  )
})

// Handle background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform any background sync operations here
      console.log('Background sync triggered')
    )
  }
})

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.svg',
      badge: '/icon-192x192.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})