import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: { songs: true }
        }
      }
    });
    return NextResponse.json(genres);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}