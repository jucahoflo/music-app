import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const SECRET = process.env.NEXTAUTH_SECRET || 'mi-secreto-super-seguro-2024';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const user = await prisma.user.findUnique({ where: { username } });
    
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }
    
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json({ success: true, user: { username: user.username, role: user.role } });
    response.cookies.set('token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 604800, path: '/' });
    
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
