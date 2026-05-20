const CACHE_NAME = 'music-offline-v1'

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
  )))
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  
  if (url.pathname.startsWith('/mp3/') || url.pathname.startsWith('/pdf/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => 
        cache.match(event.request).then(cached => 
          cached || fetch(event.request).then(response => {
            cache.put(event.request, response.clone())
            return response
          })
        )
      )
    )
  }
})
