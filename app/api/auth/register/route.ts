import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    await prisma.user.create({
      data: { username, email, password: hashedPassword, role: 'user' },
    });
    
    return NextResponse.json({ success: true, message: 'Usuario registrado' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
