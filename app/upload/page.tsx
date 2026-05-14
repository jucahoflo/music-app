'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@/components/Menu'
import BackButton from '@/components/BackButton'

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(user => {
        if (user.role === 'admin') {
          setIsAdmin(true)
        } else {
          router.push('/')
        }
        setChecking(false)
      })
      .catch(() => {
        router.push('/login')
      })
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/songs', { 
        method: 'POST', 
        body: formData 
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setSuccess('✅ Canción subida exitosamente')
        e.currentTarget.reset()
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 2000)
      } else {
        setError(data.error || 'Error al subir la canción')
      }
    } catch (error) {
      setError('Error de conexión al servidor')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <div className="lg:pl-64">
          <div className="flex items-center justify-center h-64">Verificando permisos...</div>
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
          
          <h1 className="text-3xl font-bold text-center mb-8">Subir Nueva Canción</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Título *</label>
              <input type="text" name="title" required className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Artista *</label>
              <input type="text" name="artist" required className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Género *</label>
              <select name="genreId" required className="w-full px-4 py-2 border rounded-lg">
                <option value="">Selecciona un género</option>
                <option value="balada">Balada</option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="bachata">Bachata</option>
                <option value="ranchera">Ranchera</option>
                <option value="merengues">Merengues</option>
                <option value="bailables">Bailables</option>
                <option value="salsa">Salsa</option>
                <option value="bolero">Bolero</option>
                <option value="madres">Madres</option>
                <option value="padre">Padre</option>
                <option value="religiosa">Religiosa</option>
                <option value="agropecuaria-popular">Agropecuaria Popular</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Duración (ej: 3:45)</label>
              <input type="text" name="duration" placeholder="3:45" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Archivo MP3 *</label>
              <input type="file" name="mp3File" accept=".mp3" required className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Letra en PDF *</label>
              <input type="file" name="pdfFile" accept=".pdf" required className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Subiendo...' : 'Subir Canción'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
