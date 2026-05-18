'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Song {
  id: string
  title: string
  artist: string
  genreName: string
  genreSlug: string
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Song[]>([])
  const [showResults, setShowResults] = useState(false)
  const [allSongs, setAllSongs] = useState<Song[]>([])
  const router = useRouter()

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
                id: song.id,
                title: song.title,
                artist: song.artist,
                genreName: genre.name,
                genreSlug: genre.slug
              })
            })
          }
        }
        setAllSongs(songs)
      } catch (error) {
        console.error('Error fetching songs:', error)
      }
    }
    fetchAllSongs()
  }, [])

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = allSongs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setResults(filtered.slice(0, 5))
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [searchTerm, allSongs])

  const handleSongClick = (song: Song) => {
    setSearchTerm('')
    setShowResults(false)
    router.push(`/genres/${song.genreSlug}`)
  }

  return (
    <div className="relative px-4 py-2">
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Buscar canciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
      
      {showResults && results.length > 0 && (
        <div className="absolute left-4 right-4 mt-1 bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
          {results.map((song) => (
            <button
              key={song.id}
              onClick={() => handleSongClick(song)}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 transition flex items-center justify-between"
            >
              <div>
                <div className="text-white text-sm font-medium">{song.title}</div>
                <div className="text-gray-400 text-xs">{song.artist}</div>
              </div>
              <span className="text-xs text-gray-500">{song.genreName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
