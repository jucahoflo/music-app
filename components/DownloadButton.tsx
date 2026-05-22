'use client'
import { useState } from 'react'

interface DownloadButtonProps {
  mp3Url: string
  pdfUrl: string
  title: string
}

export default function DownloadButton({ mp3Url, pdfUrl, title }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const downloadFile = (url: string, filename: string) => {
    try {
      // Crear enlace temporal para descargar
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error descargando:', error)
      // Fallback: abrir en nueva pestaña
      window.open(url, '_blank')
    }
  }

  const handleDownload = async () => {
    if (downloading) return
    
    setDownloading(true)
    
    // Descargar MP3 primero
    downloadFile(mp3Url, `${title}.mp3`)
    
    // Esperar un poco y descargar PDF
    setTimeout(() => {
      downloadFile(pdfUrl, `${title}.pdf`)
      setDownloading(false)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    }, 500)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`text-xs px-2 py-1 rounded transition-all duration-200 ${
        downloaded 
          ? 'bg-green-600 text-white' 
          : downloading 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
      title="Descargar MP3 y PDF"
    >
      {downloaded ? '✓' : downloading ? '⏳' : '📥'}
    </button>
  )
}
