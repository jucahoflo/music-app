'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import DownloadButton from '@/components/DownloadButton'
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

let globalAudio: HTMLAudioElement | null = null
let globalPdfWindow: Window | null = null

export default function GenrePage() {
  const params = useParams()
  const genreName = params.genreName as string
  
  const [genre, setGenre] = useState<Genre | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [animationBars, setAnimationBars] = useState<number[]>(Array(30).fill(5))
  
  const animationRef = useRef<number>()
  const intervalRef = useRef<NodeJS.Timeout>()

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(user => setIsAdmin(user.role === 'admin'))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setAnimationBars(prev => prev.map(() => Math.random() * 60 + 10))
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      setAnimationBars(Array(30).fill(5))
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying])

  useEffect(() => {
    if (globalAudio && globalAudio.src && !globalAudio.paused) {
      const songId = globalAudio.getAttribute('data-song-id') || ''
      const songTitle = globalAudio.getAttribute('data-song-title') || ''
      const songArtist = globalAudio.getAttribute('data-song-artist') || ''
      const songDuration = globalAudio.getAttribute('data-song-duration') || ''
      const songPdfUrl = globalAudio.getAttribute('data-song-pdf') || ''
      
      setCurrentSong({
        id: songId,
        title: songTitle,
        artist: songArtist,
        duration: songDuration,
        mp3Url: globalAudio.src,
        pdfUrl: songPdfUrl
      })
      setIsPlaying(true)
      setDuration(globalAudio.duration || 0)
      setCurrentTime(globalAudio.currentTime || 0)
      
      const audioElement = globalAudio
      const updateTime = () => {
        if (audioElement) {
          setCurrentTime(audioElement.currentTime)
        }
      }
      audioElement.addEventListener('timeupdate', updateTime)
      return () => audioElement.removeEventListener('timeupdate', updateTime)
    }
  }, [])

  useEffect(() => {
    fetch(`/api/genres/${genreName}`)
      .then(res => res.json())
      .then(data => {
        setGenre(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [genreName])

  // Detectar cuando el PDF está abierto y agregar botón flotante
  useEffect(() => {
    if (globalPdfWindow && !globalPdfWindow.closed) {
      // Crear un intervalo para verificar si el PDF sigue abierto
      intervalRef.current = setInterval(() => {
        if (globalPdfWindow && globalPdfWindow.closed) {
          clearInterval(intervalRef.current)
        }
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [globalPdfWindow])

  const stopCurrentSong = () => {
    if (globalAudio) {
      globalAudio.pause()
      globalAudio.currentTime = 0
      globalAudio.src = ''
      globalAudio = null
    }
    setIsPlaying(false)
    setCurrentSong(null)
    setCurrentTime(0)
    setDuration(0)
    if (globalPdfWindow && !globalPdfWindow.closed) {
      globalPdfWindow.close()
      globalPdfWindow = null
    }
  }

  const playSong = (song: Song) => {
    if (currentSong?.id === song.id && isPlaying) {
      stopCurrentSong()
      return
    }
    
    if (globalAudio) {
      globalAudio.pause()
      globalAudio.currentTime = 0
      globalAudio = null
    }
    if (globalPdfWindow && !globalPdfWindow.closed) {
      globalPdfWindow.close()
      globalPdfWindow = null
    }
    
    const audio = new Audio()
    audio.src = song.mp3Url
    audio.volume = volume
    audio.setAttribute('data-song-id', song.id)
    audio.setAttribute('data-song-title', song.title)
    audio.setAttribute('data-song-artist', song.artist)
    audio.setAttribute('data-song-duration', song.duration)
    audio.setAttribute('data-song-pdf', song.pdfUrl)
    
    setCurrentSong(song)
    setCurrentTime(0)
    setDuration(0)
    
    const onCanPlay = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Error:', err))
    }
    
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentSong(null)
      setCurrentTime(0)
      if (globalPdfWindow && !globalPdfWindow.closed) globalPdfWindow.close()
      globalAudio = null
    }
    
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    
    audio.load()
    
    globalAudio = audio
    
    // Abrir PDF y agregar botón flotante
    if (song.pdfUrl && song.pdfUrl !== '#') {
      globalPdfWindow = window.open(song.pdfUrl, '_blank')
    }
  }

  const regresarMenu = () => {
    // Cerrar PDF si está abierto
    if (globalPdfWindow && !globalPdfWindow.closed) {
      globalPdfWindow.close()
      globalPdfWindow = null
    }
    // Navegar al inicio
    window.location.href = '/'
  }

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!globalAudio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    globalAudio.currentTime = percent * duration
    setCurrentTime(percent * duration)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (globalAudio) globalAudio.volume = newVolume
  }

  const viewPdf = (pdfUrl: string) => {
    if (pdfUrl && pdfUrl !== '#') {
      globalPdfWindow = window.open(pdfUrl, '_blank')
    }
  }

  const colors: Record<string, string> = {
    Salsa: 'from-green-500 to-lime-500',
    Bailables: 'from-yellow-500 to-orange-400',
    Merengues: 'from-red-500 to-pink-500',
    Balada: 'from-pink-500 to-rose-500',
    Pop: 'from-blue-500 to-cyan-500',
    Rock: 'from-purple-500 to-indigo-500',
    Bachata: 'from-emerald-500 to-teal-500',
    Ranchera: 'from-amber-500 to-orange-500',
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
          
          <div className={`bg-gradient-to-r ${colors[genre.name] || 'from-gray-500 to-gray-600'} rounded-2xl p-8 mb-8 text-white`}>
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
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => playSong(song)}
                      className={`w-full py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                        currentSong?.id === song.id && isPlaying
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {currentSong?.id === song.id && isPlaying ? '⏹ Detener' : '▶ Reproducir'}
                    </button>
                    <button
                      onClick={() => viewPdf(song.pdfUrl)}
                      className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      📄 Ver Letra
                    <div className="mt-2">
                      <DownloadButton mp3Url={song.mp3Url} pdfUrl={song.pdfUrl} title={song.title} />
                    </div>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar esta canción?')) {
                            alert('Función en desarrollo')
                          }
                        }}
                        className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg text-sm transition"
                      >
                        🗑 Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {currentSong && isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-2xl z-50 border-t border-blue-500/30">
          <div className="container mx-auto">
            <div className="flex justify-center items-center gap-0.5 h-12 mb-2">
              {animationBars.map((height, i) => (
                <div key={i} className="w-1.5 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-75" style={{ height: `${height}%`, maxHeight: '48px' }} />
              ))}
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-bold text-lg">{currentSong.title}</span>
                <span className="text-gray-400 ml-2">- {currentSong.artist}</span>
              </div>
              <div className="text-sm text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="relative h-2 bg-gray-700 rounded-full cursor-pointer group overflow-hidden mb-2" onClick={seekTo}>
              <div className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-100" style={{ width: `${progressPercent}%` }} />
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-2">
              <button onClick={stopCurrentSong} className="bg-red-600 hover:bg-red-700 px-6 py-1.5 rounded-full text-sm transition">⏹ Detener</button>
              <div className="flex items-center gap-2">
                <span className="text-sm">🔊</span>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-24 h-1 bg-gray-600 rounded-lg accent-blue-500" />
              </div>
              <button onClick={() => viewPdf(currentSong.pdfUrl)} className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-full text-sm transition">📄 Ver Letra</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
