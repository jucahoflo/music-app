const CACHE_NAME = 'music-v2'
const OFFLINE_URL = '/'

// Archivos a cachear durante la instalación
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/api/genres',
  '/offline.html'
]

// Instalación - cachear archivos esenciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

// Activar - tomar control inmediato
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch - servir desde caché primero
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  
  // Para navegación (páginas)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL)
        })
    )
    return
  }
  
  // Para API, MP3, PDF
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  )
})
