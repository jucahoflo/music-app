import { NextResponse } from 'next/server';

const songsData: Record<string, any[]> = {
  salsa: [
    { id: '1', title: 'EL PRESO', artist: 'FRUKO', duration: '4:30', mp3Url: '/mp3/EL_PRESO.mp3', pdfUrl: '/pdf/EL_PRESO.pdf' },
    { id: '4', title: 'ANA MILE', artist: 'GRUPO NICHE', duration: '4:15', mp3Url: '/mp3/ANA_MILE.mp3', pdfUrl: '/pdf/ANA_MILE.pdf' }
  ],
  bailables: [
    { id: '2', title: 'AGOBIO', artist: 'Combo', duration: '3:45', mp3Url: '/mp3/AGOBIO.mp3', pdfUrl: '/pdf/AGOBIO.pdf' },
    { id: '3', title: 'CONFUNDIDO', artist: 'Combo', duration: '3:50', mp3Url: '/mp3/CONFUNDIDO.mp3', pdfUrl: '/pdf/CONFUNDIDO.pdf' },
    { id: '5', title: 'LA ZENAIDA', artist: 'ARMANDO HERNÁNDEZ', duration: '3:00', mp3Url: '/mp3/LA_ZENAIDA.mp3', pdfUrl: '/pdf/LA_ZENAIDA.pdf' }
  ],
  merengues: [
    { id: '6', title: 'SI_ME_DEJAS_NO_VALE', artist: 'LA MAQUINA', duration: '3:45', mp3Url: '/mp3/SI_ME_DEJAS_NO_VALE.mp3', pdfUrl: '/pdf/SI_ME_DEJAS_NO_VALE.pdf' }
  ],
  balada: [],
  pop: [],
  rock: [],
  bachata: [],
  ranchera: [],
  bolero: [],
  madres: [],
  padre: [],
  religiosa: [],
  'agropecuaria-popular': []
};

const genresList: Record<string, any> = {
  salsa: { id: '8', name: 'Salsa', slug: 'salsa', songs: songsData.salsa || [] },
  bailables: { id: '7', name: 'Bailables', slug: 'bailables', songs: songsData.bailables || [] },
  merengues: { id: '6', name: 'Merengues', slug: 'merengues', songs: songsData.merengues || [] },
  balada: { id: '1', name: 'Balada', slug: 'balada', songs: songsData.balada || [] },
  pop: { id: '2', name: 'Pop', slug: 'pop', songs: songsData.pop || [] },
  rock: { id: '3', name: 'Rock', slug: 'rock', songs: songsData.rock || [] },
  bachata: { id: '4', name: 'Bachata', slug: 'bachata', songs: songsData.bachata || [] },
  ranchera: { id: '5', name: 'Ranchera', slug: 'ranchera', songs: songsData.ranchera || [] },
  bolero: { id: '9', name: 'Bolero', slug: 'bolero', songs: songsData.bolero || [] },
  madres: { id: '10', name: 'Madres', slug: 'madres', songs: songsData.madres || [] },
  padre: { id: '11', name: 'Padre', slug: 'padre', songs: songsData.padre || [] },
  religiosa: { id: '12', name: 'Religiosa', slug: 'religiosa', songs: songsData.religiosa || [] },
  'agropecuaria-popular': { id: '13', name: 'Agropecuaria Popular', slug: 'agropecuaria-popular', songs: songsData['agropecuaria-popular'] || [] }
};

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const genre = genresList[params.slug];
  return NextResponse.json(genre || { songs: [] });
}
