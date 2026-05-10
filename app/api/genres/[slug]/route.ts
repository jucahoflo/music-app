import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const genre = await prisma.genre.findUnique({
      where: { slug: params.slug },
      include: { songs: true }
    });
    return NextResponse.json(genre);
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}
