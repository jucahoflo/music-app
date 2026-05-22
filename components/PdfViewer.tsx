'use client'
import { useState } from 'react'

interface PdfViewerProps {
  pdfUrl: string
  title: string
  onClose: () => void
}

export default function PdfViewer({ pdfUrl, title, onClose }: PdfViewerProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
      {/* Barra superior */}
      <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg text-sm"
          >
            ✕ Cerrar
          </button>
          <span className="text-sm truncate max-w-[200px]">{title} - Letra</span>
        </div>
        <a
          href={pdfUrl}
          download={`${title}.pdf`}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm"
        >
          📥 Descargar
        </a>
      </div>
      
      {/* Visor PDF */}
      <iframe
        src={pdfUrl}
        className="w-full h-full"
        title={title}
      />
    </div>
  )
}
