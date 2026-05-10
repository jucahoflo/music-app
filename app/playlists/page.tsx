'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Menu from '@/components/Menu'
import BackButton from '@/components/BackButton'

interface Song {
  id: string
  title: string
  artist: string
  duration: string
  genreName: string
  genreSlug: string
  mp3Url: string
  pdfUrl: string
}

export default function PlaylistsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar canciones de todos los géneros
    const fetchAllSongs = async () => {
      try {
        // Obtener todos los géneros
        const genresRes = await fetch('/api/genres')
        const genres = await genresRes.json()
        
        let allSongs: Song[] = []
        
        // Para cada género, obtener sus canciones
        for (const genre of genres) {
          const songsRes = await fetch(`/api/genres/${genre.slug}`)
          const genreData = await songsRes.json()
          
          if (genreData.songs && genreData.songs.length > 0) {
            const songsWithGenre = genreData.songs.map((song: any) => ({
              ...song,
              genreName: genre.name,
              genreSlug: genre.slug
            }))
            allSongs = [...allSongs, ...songsWithGenre]
          }
        }
        
        // Ordenar alfabéticamente por título
        allSongs.sort((a, b) => a.title.localeCompare(b.title))
        
        setSongs(allSongs)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAllSongs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <div className="lg:pl-64">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-xl">Cargando canciones...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Menu />
      <div className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">📋 Lista de Canciones</h1>

          {songs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No hay canciones subidas aún</p>
              <Link
                href="/upload"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Subir primera canción
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">#</th>
                      <th className="px-6 py-3 text-left">Canción</th>
                      <th className="px-6 py-3 text-left">Artista</th>
                      <th className="px-6 py-3 text-left">Género</th>
                      <th className="px-6 py-3 text-left">Duración</th>
                      <th className="px-6 py-3 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {songs.map((song, index) => (
                      <tr key={song.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{song.title}</td>
                        <td className="px-6 py-4 text-gray-600">{song.artist}</td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/genres/${song.genreSlug}`}
                            className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition"
                          >
                            {song.genreName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{song.duration || '3:00'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => window.open(song.mp3Url, '_blank')}
                              className="text-blue-600 hover:text-blue-800 transition"
                              title="Reproducir"
                            >
                              ▶
                            </button>
                            <button
                              onClick={() => window.open(song.pdfUrl, '_blank')}
                              className="text-gray-600 hover:text-gray-800 transition"
                              title="Ver letra"
                            >
                              📄
                            </button>
                          </div>
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
