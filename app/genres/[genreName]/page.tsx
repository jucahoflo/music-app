'use client'
import { useEffect, useState, useRef } from 'react'
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
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const [pdfWindow, setPdfWindow] = useState<Window | null>(null)

  // Formatear tiempo (segundos a mm:ss)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calcular porcentaje de progreso
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    fetch(`/api/genres/${genreName}`)
      .then(res => res.json())
      .then(data => {
        setGenre(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [genreName])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause()
        audioRef.currentTime = 0
      }
      if (pdfWindow && !pdfWindow.closed) {
        pdfWindow.close()
      }
    }
  }, [audioRef, pdfWindow])

  const stopCurrentSong = () => {
    if (audioRef) {
      audioRef.pause()
      audioRef.currentTime = 0
      setIsPlaying(false)
      setCurrentSong(null)
      setCurrentTime(0)
    }
    if (pdfWindow && !pdfWindow.closed) {
      pdfWindow.close()
      setPdfWindow(null)
    }
  }

  const playSong = (song: Song) => {
    // Si ya está sonando la misma canción, la detenemos
    if (currentSong?.id === song.id && isPlaying) {
      stopCurrentSong()
      return
    }
    
    // Detener cualquier canción actual
    stopCurrentSong()
    
    // Crear nuevo audio
    const newAudio = new Audio(song.mp3Url)
    setCurrentSong(song)
    setAudioRef(newAudio)
    setCurrentTime(0)
    
    // Actualizar tiempo durante reproducción
    newAudio.addEventListener('timeupdate', () => {
      setCurrentTime(newAudio.currentTime)
    })
    
    newAudio.addEventListener('loadedmetadata', () => {
      setDuration(newAudio.duration)
    })
    
    newAudio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentSong(null)
      setCurrentTime(0)
      if (pdfWindow && !pdfWindow.closed) {
        pdfWindow.close()
        setPdfWindow(null)
      }
    })
    
    newAudio.play()
    setIsPlaying(true)
    
    // Abrir PDF automáticamente
    const newPdfWindow = window.open(song.pdfUrl, '_blank')
    setPdfWindow(newPdfWindow)
    
    newAudio.onerror = () => {
      alert(`Error: No se pudo reproducir ${song.title}`)
      stopCurrentSong()
    }
  }

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    const newTime = percent * duration
    audioRef.currentTime = newTime
    setCurrentTime(newTime)
  }

  const viewPdf = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank')
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
          <div className="flex items-center justify-center h-64">Cargando...</div>
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
          
          <div className={`bg-gradient-to-r ${colors[genre.name]} rounded-2xl p-8 mb-8 text-white`}>
            <h1 className="text-4xl font-bold mb-2">{genre.name}</h1>
            <p>{genre.songs?.length || 0} canciones</p>
          </div>

          {!genre.songs || genre.songs.length === 0 ? (
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
                    <button
                      onClick={() => playSong(song)}
                      className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                        currentSong?.id === song.id && isPlaying
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {currentSong?.id === song.id && isPlaying ? '⏹ Detener' : '▶ Reproducir'}
                    </button>
                    <button
                      onClick={() => viewPdf(song.pdfUrl)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      📄 Letra
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Reproductor flotante futurista */}
      {currentSong && isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-2xl z-50 border-t border-blue-500/30">
          <div className="container mx-auto">
            {/* Información de la canción */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-bold text-lg">{currentSong.title}</span>
                <span className="text-gray-400 ml-2">- {currentSong.artist}</span>
              </div>
              <div className="text-sm text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            {/* Barra de progreso futurista */}
            <div 
              className="relative h-2 bg-gray-700 rounded-full cursor-pointer group overflow-hidden"
              onClick={seekTo}
            >
              <div 
                className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            
            {/* Controles */}
            <div className="flex justify-center gap-4 mt-3">
              <button
                onClick={stopCurrentSong}
                className="bg-red-600 hover:bg-red-700 px-6 py-1.5 rounded-full text-sm transition flex items-center gap-2"
              >
                ⏹ Detener
              </button>
              {currentSong.pdfUrl && (
                <button
                  onClick={() => viewPdf(currentSong.pdfUrl)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-1.5 rounded-full text-sm transition flex items-center gap-2"
                >
                  📄 Ver Letra
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
