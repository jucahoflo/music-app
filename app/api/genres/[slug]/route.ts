import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Song from '@/models/Song';

const MONGODB_URI = process.env.MONGODB_URI!;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

const staticSongsData: Record<string, any[]> = {
  salsa: [{ 
    id: '1', 
    title: 'EL PRESO', 
    artist: 'FRUKO', 
    duration: '4:30', 
    mp3Url: '/uploads/mp3/1778342428932-EL%20PRESO.mp3', 
    pdfUrl: '/uploads/pdf/1778342429011-EL%20PRESO.pdf' 
  }],
  bailables: [
    { id: '2', title: 'AGOBIO', artist: 'Combo', duration: '3:45', 
      mp3Url: '/uploads/mp3/1778351373525-AGOBIO.mp3', 
      pdfUrl: '/uploads/pdf/1778351373601-AGOBIO.pdf' },
    { id: '3', title: 'CONFUNDIDO', artist: 'Combo', duration: '3:50', 
      mp3Url: '/uploads/mp3/1778360755859-Confundido.mp3', 
      pdfUrl: '/uploads/pdf/1778360755888-CONFUNDIDO.pdf' }
  ]
};

const genresMap: Record<string, string> = {
  'balada': '1', 'pop': '2', 'rock': '3', 'bachata': '4',
  'ranchera': '5', 'merengues': '6', 'bailables': '7', 'salsa': '8',
  'bolero': '9', 'madres': '10', 'padre': '11', 'religiosa': '12',
  'agropecuaria-popular': '13'
};

const genreNames: Record<string, string> = {
  '1': 'Balada', '2': 'Pop', '3': 'Rock', '4': 'Bachata',
  '5': 'Ranchera', '6': 'Merengues', '7': 'Bailables', '8': 'Salsa',
  '9': 'Bolero', '10': 'Madres', '11': 'Padre', '12': 'Religiosa',
  '13': 'Agropecuaria Popular'
};

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    
    const genreId = genresMap[params.slug];
    let songs: any[] = [];
    
    if (genreId) {
      const dbSongs = await Song.find({ genreId }).sort({ createdAt: -1 });
      songs = dbSongs.map(song => ({
        id: song._id.toString(),
        title: song.title,
        artist: song.artist,
        duration: song.duration || '3:00',
        mp3Url: `/api/files/${song.mp3FileId}`,
        pdfUrl: `/api/files/${song.pdfFileId}`,
      }));
    }
    
    if (songs.length === 0 && staticSongsData[params.slug]) {
      songs = staticSongsData[params.slug];
    }
    
    const genre = {
      id: genreId || '0',
      name: genreNames[genreId || ''] || params.slug,
      slug: params.slug,
      songs: songs,
    };
    
    return NextResponse.json(genre);
  } catch (error) {
    const fallbackGenre = {
      id: '0',
      name: params.slug,
      slug: params.slug,
      songs: staticSongsData[params.slug] || []
    };
    return NextResponse.json(fallbackGenre);
  }
}
