'use client'
import { useEffect, useState } from 'react'
import { openDB, saveGenres } from '@/lib/db'

export default function SyncManager() {
  const [isOnline, setIsOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
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
      const res = await fetch('/api/genres')
      const data = await res.json()
      await saveGenres(data)
    } catch (error) {
      console.error('Error sincronizando:', error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    if (isOnline) syncData()
  }, [isOnline])

  return null
}
