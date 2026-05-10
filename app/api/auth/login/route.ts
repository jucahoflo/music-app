import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Temporal - solo acepta credenciales fijas
    if (username === 'jucahoflo' && password === '123456') {
      const response = NextResponse.json({ success: true, user: { username: 'jucahoflo', role: 'admin' } });
      response.cookies.set('token', 'fake-token', { httpOnly: true, maxAge: 604800, path: '/' });
      return response;
    }
    
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
