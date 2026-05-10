import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const songs = await prisma.song.findMany({ include: { genre: true } });
    return NextResponse.json(songs);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
