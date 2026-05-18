'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
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

let globalAudio: HTMLAudioElement | null = null
let globalPdfWindow: Window | null = null

export default function PlaylistPage() {
  const router = useRouter()
  const [allSongs, setAllSongs] = useState<Song[]>([])
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [animationBars, setAnimationBars] = useState<number[]>(Array(30).fill(5))
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [playlistName, setPlaylistName] = useState('Mi Playlist')
  const [isEditingName, setIsEditingName] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  
  const animationRef = useRef<number>()

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

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
    const fetchAllSongs = async () => {
      try {
        const genresRes = await fetch('/api/genres')
        const genres = await genresRes.json()
        let songs: Song[] = []
        
        for (const genre of genres) {
          const songsRes = await fetch(`/api/genres/${genre.slug}`)
          const genreData = await songsRes.json()
          if (genreData.songs) {
            genreData.songs.forEach((song: any) => {
              songs.push({
                ...song,
                genreName: genre.name,
                genreSlug: genre.slug
              })
            })
          }
        }
        setAllSongs(songs)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllSongs()
  }, [])

  useEffect(() => {
    const savedPlaylist = localStorage.getItem('userPlaylist')
    if (savedPlaylist) {
      try {
        setPlaylist(JSON.parse(savedPlaylist))
      } catch (e) {
        console.error('Error cargando playlist:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (playlist.length > 0) {
      localStorage.setItem('userPlaylist', JSON.stringify(playlist))
    }
  }, [playlist])

  const addToPlaylist = (song: Song) => {
    if (!playlist.some(s => s.id === song.id)) {
      setPlaylist([...playlist, song])
    }
  }

  const removeFromPlaylist = (index: number) => {
    const newPlaylist = [...playlist]
    newPlaylist.splice(index, 1)
    setPlaylist(newPlaylist)
    if (currentIndex === index) {
      stopCurrentSong()
    } else if (currentIndex > index) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const moveUp = (index: number) => {
    if (index > 0) {
      const newPlaylist = [...playlist]
      ;[newPlaylist[index - 1], newPlaylist[index]] = [newPlaylist[index], newPlaylist[index - 1]]
      setPlaylist(newPlaylist)
      if (currentIndex === index) {
        setCurrentIndex(index - 1)
      } else if (currentIndex === index - 1) {
        setCurrentIndex(index)
      }
    }
  }

  const moveDown = (index: number) => {
    if (index < playlist.length - 1) {
      const newPlaylist = [...playlist]
      ;[newPlaylist[index + 1], newPlaylist[index]] = [newPlaylist[index], newPlaylist[index + 1]]
      setPlaylist(newPlaylist)
      if (currentIndex === index) {
        setCurrentIndex(index + 1)
      } else if (currentIndex === index + 1) {
        setCurrentIndex(index)
      }
    }
  }

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
    setCurrentIndex(-1)
    if (globalPdfWindow && !globalPdfWindow.closed) {
      globalPdfWindow.close()
      globalPdfWindow = null
    }
  }

  const playSong = (song: Song, index: number) => {
    if (currentIndex === index && isPlaying) {
      stopCurrentSong()
      return
    }
    
    if (globalAudio) {
      globalAudio.pause()
      globalAudio.currentTime = 0
      globalAudio.src = ''
      globalAudio = null
    }
    if (globalPdfWindow && !globalPdfWindow.closed) {
      globalPdfWindow.close()
      globalPdfWindow = null
    }
    
    // Crear nuevo audio
    const audio = new Audio()
    audio.src = song.mp3Url
    audio.volume = volume
    
    setCurrentSong(song)
    setCurrentIndex(index)
    setCurrentTime(0)
    setDuration(0)
    
    // Eventos
    const onCanPlay = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Error:', err))
    }
    
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    
    // Evento ended: cuando termina la canción
    const onEnded = () => {
      console.log('Canción terminada, autoPlay:', autoPlay, 'currentIndex:', index, 'total:', playlist.length)
      
      if (autoPlay && index < playlist.length - 1) {
        const nextIndex = index + 1
        const nextSong = playlist[nextIndex]
        console.log('Reproduciendo siguiente:', nextSong.title)
        playSong(nextSong, nextIndex)
      } else {
        setIsPlaying(false)
        setCurrentSong(null)
        setCurrentIndex(-1)
        setCurrentTime(0)
        if (globalPdfWindow && !globalPdfWindow.closed) globalPdfWindow.close()
        globalAudio = null
      }
    }
    
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    
    audio.load()
    
    // Guardar referencia global
    if (globalAudio) {
      globalAudio.pause()
      globalAudio.src = ''
    }
    globalAudio = audio
    
    // Abrir PDF
    globalPdfWindow = window.open(song.pdfUrl, '_blank')
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
    if (pdfUrl && pdfUrl !== '#') window.open(pdfUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Menu />
        <div className="lg:pl-64">
          <div className="flex items-center justify-center h-64">Cargando canciones...</div>
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
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              {isEditingName ? (
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyPress={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-3xl font-bold text-gray-800 cursor-pointer hover:text-blue-600"
                  onClick={() => setIsEditingName(true)}
                >
                  📋 {playlistName}
                </h1>
              )}
              <span className="text-sm text-gray-500">({playlist.length} canciones)</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                  autoPlay 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {autoPlay ? '🔁 Auto-play ON' : '⏹ Auto-play OFF'}
              </button>
              <button
                onClick={() => setPlaylist([])}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
              >
                Vaciar Playlist
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel izquierdo - Canciones disponibles */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-gray-800 text-white">
                <h2 className="font-bold">🎵 Canciones Disponibles</h2>
                <p className="text-xs opacity-75">Haz clic en + para agregar a tu playlist</p>
              </div>
              <div className="max-h-[450px] overflow-y-auto">
                {allSongs.map((song) => (
                  <div key={song.id} className="p-3 border-b hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="text-sm text-gray-500">{song.artist} • {song.genreName}</div>
                    </div>
                    <button
                      onClick={() => addToPlaylist(song)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                    >
                      + Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Panel derecho - Tu Playlist */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-purple-800 text-white">
                <h2 className="font-bold">🎧 Tu Playlist</h2>
                <p className="text-xs opacity-75">↑↓ reordenar | ▶ reproducir | ✕ eliminar</p>
              </div>
              <div className="max-h-[450px] overflow-y-auto">
                {playlist.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    🎵 Agrega canciones para crear tu playlist
                  </div>
                ) : (
                  playlist.map((song, index) => (
                    <div key={song.id} className={`p-3 border-b hover:bg-gray-50 transition ${currentIndex === index && isPlaying ? 'bg-blue-100' : ''}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium">
                            {index + 1}. {song.title}
                            {autoPlay && currentIndex === index && isPlaying && (
                              <span className="ml-2 text-xs text-green-600">▶ Reproduciendo</span>
                            )}
                            {autoPlay && index < playlist.length - 1 && currentIndex === index && isPlaying && (
                              <span className="ml-2 text-xs text-blue-600">⏭ Siguiente: {playlist[index + 1]?.title}</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{song.artist} • {song.duration}</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded disabled:opacity-50 text-sm"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveDown(index)}
                            disabled={index === playlist.length - 1}
                            className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded disabled:opacity-50 text-sm"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => playSong(song, index)}
                            className={`px-3 py-1 rounded-lg text-sm transition ${
                              currentIndex === index && isPlaying
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {currentIndex === index && isPlaying ? '⏹' : '▶'}
                          </button>
                          <button
                            onClick={() => removeFromPlaylist(index)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reproductor flotante */}
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
                {autoPlay && currentIndex < playlist.length - 1 && (
                  <span className="ml-2 text-xs text-green-400">⏭ Siguiente: {playlist[currentIndex + 1]?.title}</span>
                )}
              </div>
              <div className="text-sm text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="relative h-2 bg-gray-700 rounded-full cursor-pointer group overflow-hidden mb-2" onClick={seekTo}>
              <div className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-100" style={{ width: `${progressPercent}%` }} />
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-2">
              <button onClick={stopCurrentSong} className="bg-red-600 hover:bg-red-700 px-6 py-1.5 rounded-full text-sm">⏹ Detener</button>
              <div className="flex items-center gap-2">
                <span className="text-sm">🔊</span>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-24 h-1 bg-gray-600 rounded-lg accent-blue-500" />
              </div>
              <button onClick={() => viewPdf(currentSong.pdfUrl)} className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-full text-sm">📄 Ver Letra</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
