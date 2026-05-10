import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Verificar si es el administrador
    const isAdmin = (username === 'jucahoflo' && password === '123456');
    
    // Respuesta con el rol
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        username: username, 
        role: isAdmin ? 'admin' : 'user' 
      } 
    });
    
    // Guardar el rol en una cookie simple
    response.cookies.set('user-role', isAdmin ? 'admin' : 'user', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    response.cookies.set('username', username, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
