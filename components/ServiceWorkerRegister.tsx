'use client'
import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'caches' in window) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW registrado:', reg))
          .catch(err => console.error('SW error:', err))
      })
    }
  }, [])

  return null
}
