'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Menu from '@/components/Menu'
import BackButton from '@/components/BackButton'
import DownloadButton from '@/components/DownloadButton'
import PdfViewerModal from '@/components/PdfViewerModal'

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

export default function PlaylistsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [animationBars, setAnimationBars] = useState<number[]>(Array(30).fill(5))
  const [showPdf, setShowPdf] = useState<{ url: string; title: string } | null>(null)
  
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
    const fetchSongs = async () => {
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
    fetchSongs()
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
    
    const audio = new Audio()
    audio.src = song.mp3Url
    audio.volume = volume
    
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
    }
    
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    
    audio.load()
    
    globalAudio = audio
    
    // Abrir PDF en modal
    if (song.pdfUrl && song.pdfUrl !== '#') {
      setShowPdf({ url: song.pdfUrl, title: song.title })
    }
  }

  const closePdf = () => {
    setShowPdf(null)
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

  const viewPdf = (pdfUrl: string, title: string) => {
    setShowPdf({ url: pdfUrl, title })
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
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">📋 Lista de Canciones</h1>

          {songs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No hay canciones subidas aún</p>
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
                              onClick={() => playSong(song)}
                              className={`px-3 py-1 rounded text-sm transition ${
                                currentSong?.id === song.id && isPlaying
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              {currentSong?.id === song.id && isPlaying ? '⏹' : '▶'}
                            </button>
                            <button
                              onClick={() => viewPdf(song.pdfUrl, song.title)}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition"
                            >
                              📄
                            </button>
                            <DownloadButton mp3Url={song.mp3Url} pdfUrl={song.pdfUrl} title={song.title} genre={song.genreName} />
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
              <button onClick={() => viewPdf(currentSong.pdfUrl, currentSong.title)} className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-full text-sm transition">📄 Ver Letra</button>
            </div>
          </div>
        </div>
      )}
      
      {showPdf && (
        <PdfViewerModal pdfUrl={showPdf.url} title={showPdf.title} onClose={closePdf} />
      )}
    </div>
  )
}
