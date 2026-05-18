'use client'
import { useEffect, useState, useRef } from 'react'
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

// Audio global para persistencia
let globalAudio: HTMLAudioElement | null = null
let globalPdfWindow: Window | null = null

export default function PlaylistsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [animationBars, setAnimationBars] = useState<number[]>(Array(30).fill(5))
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [autoPlay, setAutoPlay] = useState(true)
  
  const animationRef = useRef<number>()

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  // Animación del ecualizador
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

  // Restaurar audio al cargar
  useEffect(() => {
    if (globalAudio && globalAudio.src && !globalAudio.paused) {
      const songId = globalAudio.getAttribute('data-song-id') || ''
      const songTitle = globalAudio.getAttribute('data-song-title') || ''
      const songArtist = globalAudio.getAttribute('data-song-artist') || ''
      const songDuration = globalAudio.getAttribute('data-song-duration') || ''
      const songPdfUrl = globalAudio.getAttribute('data-song-pdf') || ''
      const songIndex = parseInt(globalAudio.getAttribute('data-song-index') || '-1')
      
      setCurrentSong({
        id: songId,
        title: songTitle,
        artist: songArtist,
        duration: songDuration,
        genreName: '',
        genreSlug: '',
        mp3Url: globalAudio.src,
        pdfUrl: songPdfUrl
      })
      setCurrentIndex(songIndex)
      setIsPlaying(true)
      setDuration(globalAudio.duration || 0)
      setCurrentTime(globalAudio.currentTime || 0)
      
      const updateTime = () => setCurrentTime(globalAudio.currentTime)
      globalAudio.addEventListener('timeupdate', updateTime)
      return () => globalAudio.removeEventListener('timeupdate', updateTime)
    }
  }, [])

  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        const genresRes = await fetch('/api/genres')
        const genres = await genresRes.json()
        let allSongs: Song[] = []
        
        for (const genre of genres) {
          const songsRes = await fetch(`/api/genres/${genre.slug}`)
          const genreData = await songsRes.json()
          if (genreData.songs) {
            genreData.songs.forEach((song: any) => {
              allSongs.push({
                ...song,
                genreName: genre.name,
                genreSlug: genre.slug
              })
            })
          }
        }
        setSongs(allSongs)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllSongs()
  }, [])

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
      globalAudio = null
    }
    if (globalPdfWindow && !globalPdfWindow.closed) {
      globalPdfWindow.close()
      globalPdfWindow = null
    }
    
    globalAudio = new Audio()
    globalAudio.src = song.mp3Url
    globalAudio.volume = volume
    globalAudio.setAttribute('data-song-id', song.id)
    globalAudio.setAttribute('data-song-title', song.title)
    globalAudio.setAttribute('data-song-artist', song.artist)
    globalAudio.setAttribute('data-song-duration', song.duration)
    globalAudio.setAttribute('data-song-pdf', song.pdfUrl)
    globalAudio.setAttribute('data-song-index', index.toString())
    
    setCurrentSong(song)
    setCurrentIndex(index)
    setCurrentTime(0)
    setDuration(0)
    
    const onCanPlay = () => {
      globalAudio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Error:', err))
    }
    
    const onTimeUpdate = () => setCurrentTime(globalAudio.currentTime)
    const onLoadedMetadata = () => setDuration(globalAudio.duration)
    const onEnded = () => {
      if (autoPlay && currentIndex < songs.length - 1) {
        const nextIndex = currentIndex + 1
        playSong(songs[nextIndex], nextIndex)
      } else {
        setIsPlaying(false)
        setCurrentSong(null)
        setCurrentIndex(-1)
        setCurrentTime(0)
        if (globalPdfWindow && !globalPdfWindow.closed) globalPdfWindow.close()
        globalAudio = null
      }
    }
    
    globalAudio.addEventListener('canplay', onCanPlay)
    globalAudio.addEventListener('timeupdate', onTimeUpdate)
    globalAudio.addEventListener('loadedmetadata', onLoadedMetadata)
    globalAudio.addEventListener('ended', onEnded)
    
    globalAudio.load()
    
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
            <h1 className="text-3xl font-bold text-gray-800">📋 Lista de Reproducción</h1>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-4 py-2 rounded-lg transition ${
                autoPlay ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
              }`}
            >
              {autoPlay ? '🔁 Auto-play ON' : '⏹ Auto-play OFF'}
            </button>
          </div>

          {songs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No hay canciones disponibles</p>
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
                      <tr key={song.id} className={`hover:bg-gray-50 transition ${currentIndex === index && isPlaying ? 'bg-blue-50' : ''}`}>
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
                              onClick={() => playSong(song, index)}
                              className={`px-3 py-1 rounded-lg text-sm transition ${
                                currentIndex === index && isPlaying
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              {currentIndex === index && isPlaying ? '⏹ Detener' : '▶ Reproducir'}
                            </button>
                            <button
                              onClick={() => viewPdf(song.pdfUrl)}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition"
                            >
                              📄 Letra
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
      
      {/* Reproductor flotante igual al de género */}
      {currentSong && isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-2xl z-50 border-t border-blue-500/30">
          <div className="container mx-auto">
            <div className="flex justify-center items-center gap-0.5 h-12 mb-2">
              {animationBars.map((height, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-75"
                  style={{ height: `${height}%`, maxHeight: '48px' }}
                />
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
            
            <div 
              className="relative h-2 bg-gray-700 rounded-full cursor-pointer group overflow-hidden mb-2"
              onClick={seekTo}
            >
              <div 
                className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-2">
              <button
                onClick={stopCurrentSong}
                className="bg-red-600 hover:bg-red-700 px-6 py-1.5 rounded-full text-sm transition"
              >
                ⏹ Detener
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-gray-600 rounded-lg accent-blue-500"
                />
              </div>
              
              <button
                onClick={() => viewPdf(currentSong.pdfUrl)}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-full text-sm transition"
              >
                📄 Ver Letra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
