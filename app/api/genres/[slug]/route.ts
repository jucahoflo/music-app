import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mapeo de géneros
const genresList: Record<string, any> = {
  salsa: { id: '8', name: 'Salsa', slug: 'salsa' },
  bailables: { id: '7', name: 'Bailables', slug: 'bailables' },
  balada: { id: '1', name: 'Balada', slug: 'balada' },
  pop: { id: '2', name: 'Pop', slug: 'pop' },
  rock: { id: '3', name: 'Rock', slug: 'rock' },
  bachata: { id: '4', name: 'Bachata', slug: 'bachata' },
  ranchera: { id: '5', name: 'Ranchera', slug: 'ranchera' },
  merengues: { id: '6', name: 'Merengues', slug: 'merengues' },
  bolero: { id: '9', name: 'Bolero', slug: 'bolero' },
  madres: { id: '10', name: 'Madres', slug: 'madres' },
  padre: { id: '11', name: 'Padre', slug: 'padre' },
  religiosa: { id: '12', name: 'Religiosa', slug: 'religiosa' },
  'agropecuaria-popular': { id: '13', name: 'Agropecuaria Popular', slug: 'agropecuaria-popular' }
};

// Canciones estáticas predefinidas
const staticSongsData: Record<string, any[]> = {
  salsa: [{ 
    id: '1', 
    title: 'EL PRESO', 
    artist: 'FRUKO', 
    duration: '4:30', 
    mp3Url: '/mp3/salsa/EL_PRESO.mp3', 
    pdfUrl: '/pdf/salsa/EL_PRESO.pdf' 
  }],
  bailables: [
    { 
      id: '2', 
      title: 'AGOBIO', 
      artist: 'Combo de las Estrellas', 
      duration: '3:45', 
      mp3Url: '/mp3/bailables/AGOBIO.mp3', 
      pdfUrl: '/pdf/bailables/AGOBIO.pdf' 
    },
    { 
      id: '3', 
      title: 'CONFUNDIDO', 
      artist: 'Combo de las Estrellas', 
      duration: '3:50', 
      mp3Url: '/mp3/bailables/CONFUNDIDO.mp3', 
      pdfUrl: '/pdf/bailables/CONFUNDIDO.pdf' 
    }
  ]
};

// Leer canciones manuales de las carpetas
function getManualSongs(genreSlug: string) {
  const mp3Dir = path.join(process.cwd(), 'public/mp3', genreSlug);
  const pdfDir = path.join(process.cwd(), 'public/pdf', genreSlug);
  const songs: any[] = [];
  
  try {
    if (fs.existsSync(mp3Dir)) {
      const files = fs.readdirSync(mp3Dir);
      const mp3Files = files.filter(f => f.endsWith('.mp3') && !f.includes('EL_PRESO') && !f.includes('AGOBIO') && !f.includes('CONFUNDIDO'));
      
      mp3Files.forEach((mp3File, index) => {
        const pdfFile = mp3File.replace('.mp3', '.pdf');
        const pdfPath = path.join(pdfDir, pdfFile);
        
        let title = mp3File.replace('.mp3', '').replace(/_/g, ' ');
        title = title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        
        songs.push({
          id: `manual_${genreSlug}_${index}`,
          title: title,
          artist: 'Usuario',
          duration: '3:00',
          mp3Url: `/mp3/${genreSlug}/${mp3File}`,
          pdfUrl: fs.existsSync(pdfPath) ? `/pdf/${genreSlug}/${pdfFile}` : '#'
        });
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  return songs;
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const genre = genresList[params.slug];
  
  if (!genre) {
    return NextResponse.json({ songs: [] });
  }
  
  // Combinar canciones
  const staticSongs = staticSongsData[params.slug] || [];
  const manualSongs = getManualSongs(params.slug);
  
  // Evitar duplicados por título
  const existingTitles = new Set(staticSongs.map(s => s.title));
  const newManualSongs = manualSongs.filter(s => !existingTitles.has(s.title));
  
  const allSongs = [...staticSongs, ...newManualSongs];
  
  return NextResponse.json({
    id: genre.id,
    name: genre.name,
    slug: genre.slug,
    songs: allSongs
  });
}
