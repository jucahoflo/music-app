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

  const downloadForOffline = async () => {
    if (downloading || downloaded) return
    
    setDownloading(true)
    
    try {
      const cache = await caches.open('music-offline-v1')
      await cache.add(mp3Url)
      await cache.add(pdfUrl)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch (error) {
      console.error('Error:', error)
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
      title="Guardar para escuchar sin internet"
    >
      {downloaded ? '✓' : downloading ? '⏳' : '📥'}
    </button>
  )
}
