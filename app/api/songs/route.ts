import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API de songs funcionando' });
}

export async function POST() {
  return NextResponse.json({ success: true, message: 'Canción recibida (modo prueba)' });
}
