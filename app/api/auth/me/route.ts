import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  // Usuario administrador
  if (token === 'admin-token') {
    return NextResponse.json({ 
      username: 'jucahoflo', 
      role: 'admin',
      isAdmin: true 
    });
  }
  
  // Usuario normal registrado
  if (token === 'user-token') {
    return NextResponse.json({ 
      username: 'usuario', 
      role: 'user',
      isAdmin: false 
    });
  }
  
  // Invitado no autenticado
  return NextResponse.json({ 
    username: 'Invitado', 
    role: 'guest',
    isAdmin: false 
  });
}
