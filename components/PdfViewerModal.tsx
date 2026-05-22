'use client'
import { useState } from 'react'

interface PdfViewerModalProps {
  pdfUrl: string
  title: string
  onClose: () => void
}

export default function PdfViewerModal({ pdfUrl, title, onClose }: PdfViewerModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Barra superior con botón de regreso */}
      <div className="bg-gray-800 text-white p-3 flex items-center gap-3 sticky top-0">
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
        >
          ←
        </button>
        <span className="font-medium truncate flex-1">{title} - Letra</span>
        <a
          href={pdfUrl}
          download={`${title}.pdf`}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm"
        >
          📥
        </a>
      </div>
      
      {/* Visor PDF */}
      <iframe
        src={pdfUrl}
        className="w-full h-full flex-1"
        title={title}
      />
    </div>
  )
}
