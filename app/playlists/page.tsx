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
}

export default function PlaylistsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/songs')
      .then(res => res.json())
      .then(data => {
        setSongs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <div className="lg:pl-64">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">Cargando canciones...</div>
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
              <p className="text-gray-500">No hay canciones subidas aún</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">Canción</th>
                    <th className="px-6 py-3 text-left">Artista</th>
                    <th className="px-6 py-3 text-left">Género</th>
                    <th className="px-6 py-3 text-left">Duración</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
