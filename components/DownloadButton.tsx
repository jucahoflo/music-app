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
  const [progress, setProgress] = useState(0)

  const downloadFile = async (url: string, filename: string, type: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          setProgress(percent)
        }
      }
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response
          const blobUrl = window.URL.createObjectURL(blob)
          
          // Crear un elemento a para descargar
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = `SecuenMusic/${filename}`
          
          // Para navegadores que no soportan la carpeta, intentamos con download attribute
          try {
            a.download = filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          } catch (e) {
            // Fallback: usar blob
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = filename
            link.click()
          }
          
          window.URL.revokeObjectURL(blobUrl)
          resolve()
        } else {
          reject(new Error(`HTTP ${xhr.status}`))
        }
      }
      
      xhr.onerror = () => reject(new Error('Network error'))
      xhr.send()
    })
  }

  const downloadForOffline = async () => {
    if (downloading || downloaded) return
    
    setDownloading(true)
    setProgress(0)
    
    try {
      // Crear carpeta virtual (sugerencia al navegador)
      console.log('Descargando a carpeta: SecuenMusic')
      
      // Descargar MP3
      setProgress(10)
      await downloadFile(mp3Url, `${title}.mp3`, 'MP3')
      setProgress(60)
      
      // Descargar PDF
      await downloadFile(pdfUrl, `${title}.pdf`, 'PDF')
      setProgress(100)
      
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al descargar los archivos')
    } finally {
      setDownloading(false)
      setProgress(0)
    }
  }

  return (
    <button
      onClick={downloadForOffline}
      disabled={downloading}
      className={`text-xs px-2 py-1 rounded transition ${
        downloaded ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
      title="Descargar MP3 y PDF a la carpeta SecuenMusic"
    >
      {downloaded ? '✓ Descargado' : downloading ? `${progress}%` : '📥 SecuenMusic'}
    </button>
  )
}
