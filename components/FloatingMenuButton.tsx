'use client'
import { useEffect, useState } from 'react'

export default function FloatingMenuButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Detectar cuando se abre un PDF
    const checkPdfWindow = () => {
      // Esta función se ejecuta periódicamente para detectar ventanas PDF
    }
    
    const interval = setInterval(() => {
      // Verificar si hay una ventana PDF abierta
      // (implementación simplificada)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const goBack = () => {
    window.location.href = '/'
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 right-4 z-[100]">
      <button
        onClick={goBack}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        title="Regresar al menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
    </div>
  )
}
