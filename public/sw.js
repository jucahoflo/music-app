const CACHE_NAME = 'music-v1'
const API_CACHE = 'music-api-v1'
const FILES_CACHE = 'music-files-v1'

// Archivos a cachear en la instalación
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/api/genres',
  '/api/genres/salsa',
  '/api/genres/bailables',
  '/api/genres/merengues'
]

// Instalación - cachear archivos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(FILES_CACHE)
    ])
  )
  self.skipWaiting()
})

// Activar - limpiar caché viejo
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME && key !== API_CACHE && key !== FILES_CACHE)
        .map(key => caches.delete(key))
    ))
  )
  self.clients.claim()
})

// Interceptar peticiones
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  
  // API - caché primero, luego internet
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then(async cache => {
        const cached = await cache.match(event.request)
        if (cached) return cached
        
        const response = await fetch(event.request)
        if (response.ok) cache.put(event.request, response.clone())
        return response
      })
    )
    return
  }
  
  // MP3 y PDF - caché primero
  if (url.pathname.startsWith('/mp3/') || url.pathname.startsWith('/pdf/')) {
    event.respondWith(
      caches.open(FILES_CACHE).then(async cache => {
        const cached = await cache.match(event.request)
        if (cached) return cached
        
        const response = await fetch(event.request)
        if (response.ok) cache.put(event.request, response.clone())
        return response
      })
    )
    return
  }
  
  // HTML, CSS, JS - red luego caché
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})

// Sincronización en segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'sync-songs') {
    event.waitUntil(syncSongs())
  }
})

async function syncSongs() {
  const cache = await caches.open(API_CACHE)
  const response = await fetch('/api/genres')
  if (response.ok) {
    await cache.put('/api/genres', response.clone())
  }
}
