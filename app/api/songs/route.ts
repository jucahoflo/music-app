import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Respuesta simple para verificar que la API funciona
  return NextResponse.json({ 
    status: 'ok', 
    message: 'API de canciones funcionando',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const artist = formData.get('artist');
    
    // Por ahora solo devolvemos los datos recibidos
    return NextResponse.json({ 
      success: true, 
      message: 'Canción recibida',
      data: { title, artist }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Error al procesar la solicitud' 
    }, { status: 500 });
  }
}
