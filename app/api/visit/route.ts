import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.NEXTAUTH_SECRET || 'mi-secreto-super-seguro-2024';

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const user = jwt.verify(token, SECRET);
    return user.id;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { path: pagePath } = await request.json();
    const userId = await getUserId();
    
    await prisma.visit.create({
      data: {
        path: pagePath,
        userId: userId || undefined,
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
