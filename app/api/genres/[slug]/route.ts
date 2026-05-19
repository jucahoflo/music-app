import { NextResponse } from 'next/server';

const songsData: Record<string, any[]> = {
  salsa: [
    { 
      id: '1', 
      title: 'EL PRESO', 
      artist: 'FRUKO', 
      duration: '4:30', 
      mp3Url: '/mp3/1778342428932-EL_PRESO.mp3', 
      pdfUrl: '/pdf/1778342429011-EL_PRESO.pdf' 
    },
    { 
      id: '4', 
      title: 'ANA MILE', 
      artist: 'GRUPO NICHE', 
      duration: '4:15', 
      mp3Url: '/mp3/1779127199003-ANA_MILE.mp3', 
      pdfUrl: '/pdf/1779127199044-ANA_MILE.pdf' 
    }
  ],
  bailables: [
    { 
      id: '2', 
      title: 'AGOBIO', 
      artist: 'Combo', 
      duration: '3:45', 
      mp3Url: '/mp3/1778351373525-AGOBIO.mp3', 
      pdfUrl: '/pdf/1778351373601-AGOBIO.pdf' 
    },
    { 
      id: '3', 
      title: 'CONFUNDIDO', 
      artist: 'Combo', 
      duration: '3:50', 
      mp3Url: '/mp3/1778360755859-Confundido.mp3', 
      pdfUrl: '/pdf/1778360755888-CONFUNDIDO.pdf' 
    }
  ]
};

const genresList: Record<string, any> = {
  salsa: { id: '8', name: 'Salsa', slug: 'salsa', songs: songsData.salsa || [] },
  bailables: { id: '7', name: 'Bailables', slug: 'bailables', songs: songsData.bailables || [] },
  balada: { id: '1', name: 'Balada', slug: 'balada', songs: [] },
  pop: { id: '2', name: 'Pop', slug: 'pop', songs: [] },
  rock: { id: '3', name: 'Rock', slug: 'rock', songs: [] },
  bachata: { id: '4', name: 'Bachata', slug: 'bachata', songs: [] },
  ranchera: { id: '5', name: 'Ranchera', slug: 'ranchera', songs: [] },
  merengues: { id: '6', name: 'Merengues', slug: 'merengues', songs: [] },
  bolero: { id: '9', name: 'Bolero', slug: 'bolero', songs: [] },
  madres: { id: '10', name: 'Madres', slug: 'madres', songs: [] },
  padre: { id: '11', name: 'Padre', slug: 'padre', songs: [] },
  religiosa: { id: '12', name: 'Religiosa', slug: 'religiosa', songs: [] },
  'agropecuaria-popular': { id: '13', name: 'Agropecuaria Popular', slug: 'agropecuaria-popular', songs: [] }
};

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const genre = genresList[params.slug];
  return NextResponse.json(genre || { songs: [] });
}
