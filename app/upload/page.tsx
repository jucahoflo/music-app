'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/songs', { method: 'POST', body: formData })
      if (res.ok) {
        alert('Canción subida exitosamente')
        router.push('/')
      } else {
        alert('Error al subir')
      }
    } catch (error) {
      alert('Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <Link href="/" className="text-blue-600 mb-6 inline-block">← Volver</Link>
        <h1 className="text-3xl font-bold text-center mb-8">Subir Nueva Canción</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
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
              <option value="">Selecciona</option>
              <option value="balada">Balada</option><option value="pop">Pop</option><option value="rock">Rock</option>
              <option value="bachata">Bachata</option><option value="ranchera">Ranchera</option>
              <option value="merengues">Merengues</option><option value="bailables">Bailables</option>
              <option value="salsa">Salsa</option><option value="bolero">Bolero</option>
              <option value="madres">Madres</option><option value="padre">Padre</option>
              <option value="religiosa">Religiosa</option>
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
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50">
            {loading ? 'Subiendo...' : 'Subir Canción'}
          </button>
        </form>
      </div>
    </div>
  )
}
