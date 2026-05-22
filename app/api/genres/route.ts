import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'next/server';

// Leer el archivo de canciones y contar por género
function getSongCounts(): Record<string, number> {
  const counts: Record<string, number> = {
    salsa: 0, bailables: 0, merengues: 0, balada: 0, pop: 0,
    rock: 0, bachata: 0, ranchera: 0, bolero: 0, madres: 0,
    padre: 0, religiosa: 0, 'agropecuaria-popular': 0
  };
  
  try {
    // Leer el archivo donde están las canciones
    const songsFilePath = path.join(process.cwd(), 'app/api/genres/[slug]/route.ts');
    const content = fs.readFileSync(songsFilePath, 'utf8');
    
    // Buscar cada género y contar sus canciones
    for (const genre of Object.keys(counts)) {
      // Patrón para encontrar el array del género
      const pattern = new RegExp(`${genre}: \\[([\\s\\S]*?)\\],`, 'i');
      const match = content.match(pattern);
      if (match) {
        const songsArray = match[1];
        // Contar los objetos en el array (cada objeto empieza con { id: )
        const count = (songsArray.match(/\{ id: '/g) || []).length;
        counts[genre] = count;
      }
    }
  } catch (error) {
    console.error('Error al contar canciones:', error);
  }
  
  return counts;
}

// Datos base de géneros (sin contadores)
const genresBase = [
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

export async function GET() {
  // Obtener contadores actualizados automáticamente
  const songCounts = getSongCounts();
  
  // Combinar datos base con contadores
  const genres = genresBase.map(genre => ({
    ...genre,
    songCount: songCounts[genre.slug] || 0
  }));
  
  return NextResponse.json(genres);
}
