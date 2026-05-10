'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Registrar visita cada vez que cambia la página
    const registerVisit = async () => {
      try {
        await fetch('/api/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pathname }),
        })
      } catch (error) {
        console.error('Error registrando visita:', error)
      }
    }
    
    registerVisit()
  }, [pathname])

  return null
}
