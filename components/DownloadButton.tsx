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

  const downloadFile = async (url: string, filename: string, type: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error(`Error descargando ${type}:`, error)
      throw error
    }
  }

  const downloadForOffline = async () => {
    if (downloading || downloaded) return
    
    setDownloading(true)
    
    try {
      // Descargar MP3
      await downloadFile(mp3Url, `${title}.mp3`, 'MP3')
      
      // Descargar PDF
      await downloadFile(pdfUrl, `${title}.pdf`, 'PDF')
      
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al descargar los archivos')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      onClick={downloadForOffline}
      disabled={downloading}
      className={`text-xs px-2 py-1 rounded transition ${
        downloaded ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
      title="Descargar MP3 y PDF"
    >
      {downloaded ? '✓ Descargado' : downloading ? '⏳...' : '📥 Descargar'}
    </button>
  )
}
