import { NextResponse } from 'next/server';

// Datos estáticos de respaldo
const staticSongs = [
  { id: '1', title: 'EL PRESO', artist: 'FRUKO', duration: '4:30', mp3Url: '/uploads/mp3/el-preso.mp3', pdfUrl: '/uploads/pdf/el-preso.pdf' }
];

const genresData = {
  'balada': { id: '1', name: 'Balada', slug: 'balada', songs: [] },
  'pop': { id: '2', name: 'Pop', slug: 'pop', songs: [] },
  'rock': { id: '3', name: 'Rock', slug: 'rock', songs: [] },
  'bachata': { id: '4', name: 'Bachata', slug: 'bachata', songs: [] },
  'ranchera': { id: '5', name: 'Ranchera', slug: 'ranchera', songs: [] },
  'merengues': { id: '6', name: 'Merengues', slug: 'merengues', songs: [] },
  'bailables': { id: '7', name: 'Bailables', slug: 'bailables', songs: staticSongs },
  'salsa': { id: '8', name: 'Salsa', slug: 'salsa', songs: staticSongs },
  'bolero': { id: '9', name: 'Bolero', slug: 'bolero', songs: [] },
  'madres': { id: '10', name: 'Madres', slug: 'madres', songs: [] },
  'padre': { id: '11', name: 'Padre', slug: 'padre', songs: [] },
  'religiosa': { id: '12', name: 'Religiosa', slug: 'religiosa', songs: [] },
  'agropecuaria-popular': { id: '13', name: 'Agropecuaria Popular', slug: 'agropecuaria-popular', songs: [] }
};

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const genre = genresData[params.slug as keyof typeof genresData];
  return NextResponse.json(genre || { songs: [], error: 'No encontrado' });
}
