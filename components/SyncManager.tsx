'use client'
import { useEffect, useState } from 'react'

export default function SyncManager() {
  const [isOnline, setIsOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    // Detectar estado de conexión
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => {
      setIsOnline(true)
      syncData()
    }
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const syncData = async () => {
    if (!navigator.onLine) return
    
    setSyncing(true)
    try {
      // Sincronizar géneros
      const res = await fetch('/api/genres')
      const data = await res.json()
      
      // Guardar en IndexedDB para offline
      const db = await openDB()
      const tx = db.transaction('genres', 'readwrite')
      await tx.store.put({ id: 'genres', data })
      await tx.done
      
    } catch (error) {
      console.error('Error sincronizando:', error)
    } finally {
      setSyncing(false)
    }
  }

  // Forzar sincronización manual
  useEffect(() => {
    if (isOnline) syncData()
  }, [isOnline])

  // Registrar sync periódico
  useEffect(() => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        reg.sync.register('sync-songs')
      })
    }
  }, [])

  return null
}
