export async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('musicDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('genres')) {
        db.createObjectStore('genres', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('songs')) {
        db.createObjectStore('songs', { keyPath: 'id' })
      }
    }
  })
}

export async function saveGenres(genres: any[]) {
  const db = await openDB() as IDBDatabase
  const tx = db.transaction('genres', 'readwrite')
  const store = tx.objectStore('genres')
  await store.put({ id: 'genres', data: genres })
  return tx.done
}

export async function getGenres() {
  const db = await openDB() as IDBDatabase
  return new Promise((resolve) => {
    const tx = db.transaction('genres', 'readonly')
    const store = tx.objectStore('genres')
    const request = store.get('genres')
    request.onsuccess = () => resolve(request.result?.data || [])
  })
}
