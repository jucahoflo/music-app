'use client'
import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'caches' in window) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW error:', err))
    }
  }, [])

  return null
}
