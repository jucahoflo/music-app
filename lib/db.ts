export function openDB(): Promise<IDBDatabase> {
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

export function saveGenres(genres: any[]): Promise<void> {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('genres', 'readwrite')
      const store = tx.objectStore('genres')
      const request = store.put({ id: 'genres', data: genres })
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
      
      tx.onerror = () => reject(tx.error)
      tx.oncomplete = () => resolve()
    })
  })
}

export function getGenres(): Promise<any[]> {
  return openDB().then(db => {
    return new Promise((resolve) => {
      const tx = db.transaction('genres', 'readonly')
      const store = tx.objectStore('genres')
      const request = store.get('genres')
      
      request.onsuccess = () => resolve(request.result?.data || [])
    })
  })
}
