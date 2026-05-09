import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      include: { _count: { select: { songs: true } } }
    })
    return NextResponse.json(genres)
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
