'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BackButton from '@/components/BackButton'
import Menu from '@/components/Menu'

interface Song {
  id: string
  title: string
  artist: string
  duration: string
  mp3Url: string
  pdfUrl: string
}

interface Genre {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  songs: Song[]
}

export default function GenrePage() {
  const params = useParams()
  const genreName = params.genreName as string
  
  const [genre, setGenre] = useState<Genre | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [pdfWindow, setPdfWindow] = useState<Window | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(user => {
        setIsAdmin(user.role === 'admin')
      })
      .catch(() => {})
    
    fetch(`/api/genres/${genreName}`)
      .then(res => res.json())
      .then(data => {
        setGenre(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [genreName])

  const playSong = (song: Song) => {
    if (audio) {
      audio.pause()
    }
    if (pdfWindow && !pdfWindow.closed) {
      pdfWindow.close()
    }
    
    const newAudio = new Audio(song.mp3Url)
    setCurrentSong(song)
    newAudio.play()
    setIsPlaying(true)
    setAudio(newAudio)
    
    // Abrir PDF automáticamente
    const newPdfWindow = window.open(song.pdfUrl, '_blank')
    setPdfWindow(newPdfWindow)
    
    newAudio.onended = () => {
      setIsPlaying(false)
      setCurrentSong(null)
      if (newPdfWindow && !newPdfWindow.closed) {
        newPdfWindow.close()
      }
    }
  }

  const stopSong = () => {
    if (audio) {
      audio.pause()
      setIsPlaying(false)
      setCurrentSong(null)
    }
    if (pdfWindow && !pdfWindow.closed) {
      pdfWindow.close()
    }
  }

  const viewPdf = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank')
  }

  const deleteSong = async (songId: string) => {
    if (confirm('¿Eliminar esta canción?')) {
      const res = await fetch(`/api/songs/${songId}`, { method: 'DELETE' })
      if (res.ok) {
        window.location.reload()
      }
    }
  }

  const colors: Record<string, string> = {
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
    'Agropecuaria Popular': 'from-green-700 to-emerald-700',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <div className="lg:pl-64">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">Cargando...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!genre) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Menu />
      <div className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          
          <div 
            className="relative rounded-2xl p-8 mb-8 text-white overflow-hidden min-h-[200px] bg-cover bg-center"
            style={{
              backgroundImage: `url(/images/genres/${genre.slug}.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${colors[genre.name]} opacity-70`}></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">{genre.name}</h1>
              <p>{genre.songs.length} {genre.songs.length === 1 ? 'canción' : 'canciones'}</p>
            </div>
          </div>

          {genre.songs.length === 0 ? (
            <p className="text-center text-gray-500">No hay canciones en este género</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genre.songs.map((song) => (
                <div key={song.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900">{song.title}</h3>
                    <p className="text-gray-600">{song.artist}</p>
                    <p className="text-gray-400 text-sm mt-1">{song.duration || '3:00'}</p>
                  </div>
                  <div className="p-4 pt-0 flex gap-2">
                    {currentSong?.id === song.id && isPlaying ? (
                      <button
                        onClick={stopSong}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        ⏹ Detener
                      </button>
                    ) : (
                      <button
                        onClick={() => playSong(song)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        ▶ Reproducir
                      </button>
                    )}
                    <button
                      onClick={() => viewPdf(song.pdfUrl)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      📄 Ver Letra
                    </button>
                  </div>
                  {isAdmin && (
                    <div className="px-4 pb-4">
                      <button
                        onClick={() => deleteSong(song.id)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg text-sm transition"
                      >
                        🗑 Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {isAdmin && (
            <div className="mt-8 text-center">
              <a
                href="/upload"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                + Subir nueva canción
              </a>
            </div>
          )}
        </div>
      </div>
      
      {currentSong && isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <span className="font-bold">{currentSong.title}</span>
              <span className="text-gray-400 ml-2">- {currentSong.artist}</span>
            </div>
            <button onClick={stopSong} className="bg-red-600 px-4 py-2 rounded-lg">
              Detener
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
