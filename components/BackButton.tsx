'use client'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  
  return (
    <button
      onClick={() => router.push('/')}
      className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition mb-6"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Regresar al menú
    </button>
  )
}
