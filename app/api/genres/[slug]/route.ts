import { NextResponse } from 'next/server';

// Base de datos de canciones por género con archivos reales
const songsDatabase: Record<string, any[]> = {
  'salsa': [
    { 
      id: '1', 
      title: 'EL PRESO', 
      artist: 'FRUKO', 
      duration: '4:30', 
      mp3Url: '/uploads/mp3/1778342428932-EL PRESO.mp3', 
      pdfUrl: '/uploads/pdf/1778342429011-EL PRESO.pdf' 
    }
  ],
  'bailables': [
    { 
      id: '2', 
      title: 'AGOBIO', 
      artist: 'Combo de las Estrellas', 
      duration: '3:45', 
      mp3Url: '/uploads/mp3/1778351373525-AGOBIO.mp3', 
      pdfUrl: '/uploads/pdf/1778351373601-AGOBIO.pdf' 
    },
    { 
      id: '3', 
      title: 'CONFUNDIDO', 
      artist: 'Combo de las Estrellas', 
      duration: '3:50', 
      mp3Url: '/uploads/mp3/1778360755859-Confundido.mp3', 
      pdfUrl: '/uploads/pdf/1778360755888-CONFUNDIDO.pdf' 
    }
  ],
  'balada': [],
  'pop': [],
  'rock': [],
  'bachata': [],
  'ranchera': [],
  'merengues': [],
  'bolero': [],
  'madres': [],
  'padre': [],
  'religiosa': [],
  'agropecuaria-popular': []
};

const genresData: Record<string, any> = {
  'balada': { id: '1', name: 'Balada', slug: 'balada', songs: songsDatabase['balada'] },
  'pop': { id: '2', name: 'Pop', slug: 'pop', songs: songsDatabase['pop'] },
  'rock': { id: '3', name: 'Rock', slug: 'rock', songs: songsDatabase['rock'] },
  'bachata': { id: '4', name: 'Bachata', slug: 'bachata', songs: songsDatabase['bachata'] },
  'ranchera': { id: '5', name: 'Ranchera', slug: 'ranchera', songs: songsDatabase['ranchera'] },
  'merengues': { id: '6', name: 'Merengues', slug: 'merengues', songs: songsDatabase['merengues'] },
  'bailables': { id: '7', name: 'Bailables', slug: 'bailables', songs: songsDatabase['bailables'] },
  'salsa': { id: '8', name: 'Salsa', slug: 'salsa', songs: songsDatabase['salsa'] },
  'bolero': { id: '9', name: 'Bolero', slug: 'bolero', songs: songsDatabase['bolero'] },
  'madres': { id: '10', name: 'Madres', slug: 'madres', songs: songsDatabase['madres'] },
  'padre': { id: '11', name: 'Padre', slug: 'padre', songs: songsDatabase['padre'] },
  'religiosa': { id: '12', name: 'Religiosa', slug: 'religiosa', songs: songsDatabase['religiosa'] },
  'agropecuaria-popular': { id: '13', name: 'Agropecuaria Popular', slug: 'agropecuaria-popular', songs: songsDatabase['agropecuaria-popular'] }
};

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const genre = genresData[params.slug];
  if (!genre) {
    return NextResponse.json({ error: 'Género no encontrado', songs: [] }, { status: 404 });
  }
  
  return NextResponse.json(genre);
}
