'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@/components/Menu'
import BackButton from '@/components/BackButton'

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(user => {
        if (user.role === 'admin') {
          setIsAdmin(true)
        } else {
          router.push('/')
        }
        setLoading(false)
      })
      .catch(() => {
        router.push('/login')
      })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <div className="lg:pl-64">
          <div className="flex items-center justify-center h-64">Cargando...</div>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Menu />
      <div className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta de estadísticas */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">📊 Estadísticas</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Géneros disponibles:</span>
                  <span className="font-bold text-blue-600">13</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Canciones totales:</span>
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Administrador:</span>
                  <span className="font-bold text-green-600">jucahoflo</span>
                </div>
              </div>
            </div>
            
            {/* Tarjeta de acciones */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">⚙️ Acciones Rápidas</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/upload')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                >
                  + Subir nueva canción
                </button>
                <button
                  onClick={() => router.push('/playlists')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  📋 Ver todas las canciones
                </button>
              </div>
            </div>
          </div>
          
          {/* Información de canciones */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">🎵 Canciones Disponibles</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">EL PRESO - FRUKO</span>
                <span className="text-sm text-gray-500">Salsa</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">AGOBIO - Combo</span>
                <span className="text-sm text-gray-500">Bailables</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">CONFUNDIDO - Combo</span>
                <span className="text-sm text-gray-500">Bailables</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
