'use client'
import { useState } from 'react'

interface DownloadButtonProps {
  mp3Url: string
  pdfUrl: string
  title: string
  genre?: string  // Hacer genre opcional
}

export default function DownloadButton({ mp3Url, pdfUrl, title, genre }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleDownload = () => {
    if (downloading) return
    
    setDownloading(true)
    
    // Usar genre si está disponible, sino solo el título
    const prefix = genre ? `${genre} - ` : ''
    downloadFile(mp3Url, `${prefix}${title}.mp3`)
    
    setTimeout(() => {
      downloadFile(pdfUrl, `${prefix}${title}.pdf`)
      setDownloading(false)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    }, 500)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`text-xs px-2 py-1 rounded transition ${
        downloaded ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
      title="Descargar MP3 y PDF"
    >
      {downloaded ? '✓' : downloading ? '⏳' : '📥'}
    </button>
  )
}
