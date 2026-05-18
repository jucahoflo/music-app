import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mapeo de géneros con sus nombres y colores
const genresData = [
  { id: '1', name: 'Balada', slug: 'balada', color: 'from-pink-500 to-rose-500', icon: '🎵' },
  { id: '2', name: 'Pop', slug: 'pop', color: 'from-blue-500 to-cyan-500', icon: '🎤' },
  { id: '3', name: 'Rock', slug: 'rock', color: 'from-purple-500 to-indigo-500', icon: '🤘' },
  { id: '4', name: 'Bachata', slug: 'bachata', color: 'from-emerald-500 to-teal-500', icon: '💃' },
  { id: '5', name: 'Ranchera', slug: 'ranchera', color: 'from-amber-500 to-orange-500', icon: '🤠' },
  { id: '6', name: 'Merengues', slug: 'merengues', color: 'from-red-500 to-pink-500', icon: '🪘' },
  { id: '7', name: 'Bailables', slug: 'bailables', color: 'from-yellow-500 to-orange-400', icon: '💃' },
  { id: '8', name: 'Salsa', slug: 'salsa', color: 'from-green-500 to-lime-500', icon: '🕺' },
  { id: '9', name: 'Bolero', slug: 'bolero', color: 'from-slate-500 to-gray-500', icon: '🌹' },
  { id: '10', name: 'Madres', slug: 'madres', color: 'from-rose-400 to-pink-400', icon: '👩' },
  { id: '11', name: 'Padre', slug: 'padre', color: 'from-blue-400 to-indigo-400', icon: '👨' },
  { id: '12', name: 'Religiosa', slug: 'religiosa', color: 'from-violet-500 to-purple-500', icon: '⛪' },
  { id: '13', name: 'Agropecuaria Popular', slug: 'agropecuaria-popular', color: 'from-green-700 to-emerald-700', icon: '🌾' }
];

// Función para contar canciones en una carpeta de género
function getSongCount(genreSlug: string) {
  const mp3Dir = path.join(process.cwd(), 'public/mp3', genreSlug);
  
  try {
    if (fs.existsSync(mp3Dir)) {
      const files = fs.readdirSync(mp3Dir);
      return files.filter(f => f.endsWith('.mp3')).length;
    }
  } catch (error) {
    console.error('Error leyendo carpeta:', genreSlug, error);
  }
  
  return 0;
}

export async function GET() {
  // Agregar el contador de canciones a cada género
  const genresWithCount = genresData.map(genre => ({
    ...genre,
    songCount: getSongCount(genre.slug)
  }));
  
  return NextResponse.json(genresWithCount);
}
