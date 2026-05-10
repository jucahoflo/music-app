import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const SECRET = 'mi-secreto-super-seguro-2024';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }
    
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json({ 
      success: true, 
      user: { username: user.username, role: user.role } 
    });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 604800,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
