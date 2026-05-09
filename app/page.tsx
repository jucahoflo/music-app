'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Genre {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  _count?: { songs: number }
}

export default function HomePage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/genres')
      .then(res => res.json())
      .then(data => {
        setGenres(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const colors: { [key: string]: string } = {
    Balada: 'from-pink-500 to-rose-500',
    Pop: 'from-blue-500 to-cyan-500',
    Rock: 'from-purple-500 to-indigo-500',
    Bachata: 'from-emerald-500 to-teal-500',
    Ranchera: 'from-amber-500 to-orange-500',
    Merengues: 'from-red-500 to-pink-500',
    Bailables: 'from-yellow-500 to-orange-400',
    Salsa: 'from-green-500 to-lime-500',
    Bolero: 'from-slate-500 to-gray-500',
    Madres: 'from-rose-400 to-pink-400',
    Padre: 'from-blue-400 to-indigo-400',
    Religiosa: 'from-violet-500 to-purple-500',
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Cargando géneros...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">🎵 MUSIC</h1>
          <p className="text-gray-600 text-lg">Organiza tu biblioteca musical por géneros</p>
          <Link href="/upload" className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
            + Subir nueva canción
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {genres.map((genre) => (
            <Link key={genre.id} href={`/genres/${genre.slug}`}>
              <div className={`bg-gradient-to-br ${colors[genre.name] || 'from-gray-500 to-gray-600'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
                <div className="text-6xl mb-4">{genre.icon || '🎵'}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{genre.name}</h3>
                <span className="text-sm text-white/90">{genre._count?.songs || 0} canciones</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
