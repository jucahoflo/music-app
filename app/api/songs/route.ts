import { NextResponse } from 'next/server';

// Datos de ejemplo para la API
const sampleSongs = [
  { id: '1', title: 'EL PRESO', artist: 'FRUKO', genre: 'salsa' },
  { id: '2', title: 'AGOBIO', artist: 'Combo', genre: 'bailables' },
];

export async function GET() {
  // Esta API devuelve una lista de canciones de ejemplo
  return NextResponse.json(sampleSongs);
}

export async function POST() {
  // Por ahora, solo confirmamos que la petición se recibió
  return NextResponse.json({ message: 'API de canciones funcionando correctamente' });
}
