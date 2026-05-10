import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    
    // Simular registro exitoso
    return NextResponse.json({ 
      success: true, 
      message: 'Usuario registrado exitosamente (modo demo)' 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
