'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Menu from '@/components/Menu'

interface Genre {
  id: string
  name: string
  slug: string
  songCount: number
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

  const colors: Record<string, string> = {
    Balada: 'from-pink-900/70 to-rose-900/70',
    Pop: 'from-blue-900/70 to-cyan-900/70',
    Rock: 'from-purple-900/70 to-indigo-900/70',
    Bachata: 'from-emerald-900/70 to-teal-900/70',
    Ranchera: 'from-amber-900/70 to-orange-900/70',
    Merengues: 'from-red-900/70 to-pink-900/70',
    Bailables: 'from-yellow-800/70 to-orange-800/70',
    Salsa: 'from-green-900/70 to-lime-900/70',
    Bolero: 'from-slate-800/70 to-gray-800/70',
    Madres: 'from-rose-900/70 to-pink-900/70',
    Padre: 'from-blue-900/70 to-indigo-900/70',
    Religiosa: 'from-violet-900/70 to-purple-900/70',
    'Agropecuaria Popular': 'from-green-800/70 to-emerald-800/70',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <div className="lg:pl-64">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Cargando géneros...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Menu />
      <div className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">MUSIC</h1>
            <p className="text-gray-600 text-lg">Organiza tu biblioteca musical por géneros</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {genres.map((genre) => (
              <Link key={genre.id} href={`/genres/${genre.slug}`}>
                <div 
                  className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer min-h-[200px] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(/images/genres/${genre.slug}.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors[genre.name] || 'from-black/70 to-black/70'}`}></div>
                  <div className="relative p-6 h-full min-h-[200px] flex flex-col justify-end">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{genre.name}</h3>
                      <div className="flex items-center gap-2 text-white/90">
                        <span className="text-sm bg-black/30 px-2 py-1 rounded-full">
                          {genre.songCount || 0} {genre.songCount === 1 ? 'canción' : 'canciones'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
