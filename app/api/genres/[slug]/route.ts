import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const genres = [
    { id: '1', name: 'Balada', slug: 'balada', color: 'from-pink-500 to-rose-500', icon: '🎵', songs: [] },
    { id: '2', name: 'Pop', slug: 'pop', color: 'from-blue-500 to-cyan-500', icon: '🎤', songs: [] },
    { id: '3', name: 'Rock', slug: 'rock', color: 'from-purple-500 to-indigo-500', icon: '🤘', songs: [] },
    { id: '4', name: 'Bachata', slug: 'bachata', color: 'from-emerald-500 to-teal-500', icon: '💃', songs: [] },
    { id: '5', name: 'Ranchera', slug: 'ranchera', color: 'from-amber-500 to-orange-500', icon: '🤠', songs: [] },
    { id: '6', name: 'Merengues', slug: 'merengues', color: 'from-red-500 to-pink-500', icon: '🪘', songs: [] },
    { id: '7', name: 'Bailables', slug: 'bailables', color: 'from-yellow-500 to-orange-400', icon: '💃', songs: [] },
    { id: '8', name: 'Salsa', slug: 'salsa', color: 'from-green-500 to-lime-500', icon: '🕺', songs: [] },
    { id: '9', name: 'Bolero', slug: 'bolero', color: 'from-slate-500 to-gray-500', icon: '🌹', songs: [] },
    { id: '10', name: 'Madres', slug: 'madres', color: 'from-rose-400 to-pink-400', icon: '👩', songs: [] },
    { id: '11', name: 'Padre', slug: 'padre', color: 'from-blue-400 to-indigo-400', icon: '👨', songs: [] },
    { id: '12', name: 'Religiosa', slug: 'religiosa', color: 'from-violet-500 to-purple-500', icon: '⛪', songs: [] },
    { id: '13', name: 'Agropecuaria Popular', slug: 'agropecuaria-popular', color: 'from-green-700 to-emerald-700', icon: '🌾', songs: [] }
  ];
  
  const genre = genres.find(g => g.slug === params.slug);
  return NextResponse.json(genre || { error: 'No encontrado' });
}
