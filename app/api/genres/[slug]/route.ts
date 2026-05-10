import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const genres = [
    { id: '1', name: 'Balada', slug: 'balada', songs: [] },
    { id: '2', name: 'Pop', slug: 'pop', songs: [] },
    { id: '3', name: 'Rock', slug: 'rock', songs: [] },
    { id: '4', name: 'Bachata', slug: 'bachata', songs: [] },
    { id: '5', name: 'Ranchera', slug: 'ranchera', songs: [] },
    { id: '6', name: 'Merengues', slug: 'merengues', songs: [] },
    { id: '7', name: 'Bailables', slug: 'bailables', songs: [] },
    { id: '8', name: 'Salsa', slug: 'salsa', songs: [] },
    { id: '9', name: 'Bolero', slug: 'bolero', songs: [] },
    { id: '10', name: 'Madres', slug: 'madres', songs: [] },
    { id: '11', name: 'Padre', slug: 'padre', songs: [] },
    { id: '12', name: 'Religiosa', slug: 'religiosa', songs: [] },
    { id: '13', name: 'Agropecuaria Popular', slug: 'agropecuaria-popular', songs: [] }
  ];
  
  const genre = genres.find(g => g.slug === params.slug);
  return NextResponse.json(genre || { error: 'No encontrado', songs: [] });
}
