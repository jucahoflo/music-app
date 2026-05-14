import { NextResponse } from 'next/server';

// Usuario administrador fijo
const ADMIN_USER = {
  username: 'jucahoflo',
  password: '123456',
  role: 'admin'
};

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Verificar si es el administrador
    const isAdmin = (username === ADMIN_USER.username && password === ADMIN_USER.password);
    
    // Crear respuesta con cookie
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        username: username, 
        role: isAdmin ? 'admin' : 'user' 
      } 
    });
    
    // Guardar rol en cookie
    response.cookies.set('user-role', isAdmin ? 'admin' : 'user', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    response.cookies.set('username', username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
