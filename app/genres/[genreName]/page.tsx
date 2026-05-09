import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getGenre(slug: string) {
  return prisma.genre.findUnique({
    where: { slug },
    include: { songs: true }
  })
}

export default async function GenrePage({ params }: { params: { genreName: string } }) {
  const genre = await getGenre(params.genreName)
  if (!genre) notFound()

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">← Volver</Link>
        <div className={`bg-gradient-to-r ${colors[genre.name]} rounded-2xl p-8 mb-8 text-white`}>
          <div className="text-7xl mb-4">{genre.icon}</div>
          <h1 className="text-4xl font-bold mb-2">{genre.name}</h1>
          <p>{genre.songs.length} canciones</p>
        </div>
        {genre.songs.length === 0 ? (
          <p className="text-center text-gray-500">No hay canciones aún</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {genre.songs.map((song) => (
              <div key={song.id} className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-bold text-lg">{song.title}</h3>
                <p className="text-gray-600">{song.artist}</p>
                <p className="text-gray-400 text-sm mt-1">{song.duration}</p>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Reproducir</button>
                  <button className="flex-1 bg-gray-600 text-white py-2 rounded-lg">Ver Letra</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
