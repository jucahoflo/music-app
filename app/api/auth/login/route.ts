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
    
    // Verificar credenciales
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      // Crear respuesta con cookie de autenticación
      const response = NextResponse.json({ 
        success: true, 
        user: { username: ADMIN_USER.username, role: ADMIN_USER.role } 
      });
      
      // Establecer cookie para mantener la sesión
      response.cookies.set('token', 'admin-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/',
      });
      
      return response;
    }
    
    // Usuario normal (siempre acepta)
    const response = NextResponse.json({ 
      success: true, 
      user: { username: username || 'usuario', role: 'user' } 
    });
    
    response.cookies.set('token', 'user-token', {
      httpOnly: true,
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
