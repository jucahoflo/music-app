'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Menu from '@/components/Menu'
import BackButton from '@/components/BackButton'

interface Genre {
  id: string
  name: string
  slug: string
  songCount: number
}

interface Song {
  id: string
  title: string
  artist: string
  genreName: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [genres, setGenres] = useState<Genre[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [totalSongs, setTotalSongs] = useState(0)
  const [totalGenres, setTotalGenres] = useState(0)

  useEffect(() => {
    // Verificar si es admin
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(user => {
        if (user.role === 'admin') {
          setIsAdmin(true)
        } else {
          router.push('/')
        }
      })
      .catch(() => router.push('/login'))

    // Cargar géneros
    fetch('/api/genres')
      .then(res => res.json())
      .then(data => {
        setGenres(data)
        setTotalGenres(data.length)
        // Calcular total de canciones
        const total = data.reduce((acc: number, genre: Genre) => acc + (genre.songCount || 0), 0)
        setTotalSongs(total)
      })
      .catch(console.error)

    // Cargar canciones de todos los géneros
    const fetchAllSongs = async () => {
      const genresRes = await fetch('/api/genres')
      const genresData = await genresRes.json()
      const allSongs: Song[] = []
      
      for (const genre of genresData) {
        const songsRes = await fetch(`/api/genres/${genre.slug}`)
        const genreData = await songsRes.json()
        if (genreData.songs) {
          genreData.songs.forEach((song: any) => {
            allSongs.push({
              ...song,
              genreName: genre.name
            })
          })
        }
      }
      setSongs(allSongs)
      setLoading(false)
    }
    
    fetchAllSongs()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <div className="lg:pl-64">
          <div className="flex items-center justify-center h-64">Cargando estadísticas...</div>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  // Calcular estadísticas adicionales
  const genresWithSongs = genres.filter(g => (g.songCount || 0) > 0).length
  const emptyGenres = totalGenres - genresWithSongs
  const mostSongsGenre = [...genres].sort((a, b) => (b.songCount || 0) - (a.songCount || 0))[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <Menu />
      <div className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>
          
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="text-3xl mb-2">🎵</div>
              <div className="text-3xl font-bold">{totalSongs}</div>
              <div className="text-sm opacity-90">Canciones totales</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="text-3xl mb-2">📀</div>
              <div className="text-3xl font-bold">{totalGenres}</div>
              <div className="text-sm opacity-90">Géneros disponibles</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="text-3xl mb-2">🎤</div>
              <div className="text-3xl font-bold">{genresWithSongs}</div>
              <div className="text-sm opacity-90">Géneros con canciones</div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-3xl font-bold">{mostSongsGenre?.name || 'Ninguno'}</div>
              <div className="text-sm opacity-90">Género con más canciones</div>
            </div>
          </div>
          
          {/* Tabla de géneros */}
          <div className="bg-white rounded-xl shadow-md mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">📊 Distribución por Género</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Género</th>
                    <th className="px-6 py-3 text-left">Canciones</th>
                    <th className="px-6 py-3 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {genres.map((genre) => (
                    <tr key={genre.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{genre.name}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-blue-600">{genre.songCount || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        {genre.songCount > 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Activo</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">Vacío</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Lista de canciones */}
          {songs.length > 0 && (
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">🎵 Últimas Canciones</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">Canción</th>
                      <th className="px-6 py-3 text-left">Artista</th>
                      <th className="px-6 py-3 text-left">Género</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {songs.slice(0, 5).map((song) => (
                      <tr key={song.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{song.title}</td>
                        <td className="px-6 py-4 text-gray-600">{song.artist}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{song.genreName}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
