import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.NEXTAUTH_SECRET || 'mi-secreto-super-seguro-2024';

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return false;
  try {
    const user = jwt.verify(token, SECRET);
    return user.role === 'admin';
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!await isAdmin()) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const genreSlug = formData.get('genreId') as string;
    const duration = formData.get('duration') as string;
    const mp3File = formData.get('mp3File') as File;
    const pdfFile = formData.get('pdfFile') as File;

    if (!mp3File || !pdfFile) {
      return NextResponse.json({ error: 'Faltan archivos' }, { status: 400 });
    }

    await mkdir('public/uploads/mp3', { recursive: true });
    await mkdir('public/uploads/pdf', { recursive: true });

    const mp3FileName = `${Date.now()}-${mp3File.name}`;
    const mp3Buffer = Buffer.from(await mp3File.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/uploads/mp3', mp3FileName), mp3Buffer);

    const pdfFileName = `${Date.now()}-${pdfFile.name}`;
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/uploads/pdf', pdfFileName), pdfBuffer);

    const genre = await prisma.genre.findUnique({
      where: { slug: genreSlug }
    });

    if (!genre) {
      return NextResponse.json({ error: 'Género no encontrado' }, { status: 400 });
    }

    await prisma.song.create({
      data: {
        title,
        artist,
        duration: duration || null,
        mp3Url: `/uploads/mp3/${mp3FileName}`,
        pdfUrl: `/uploads/pdf/${pdfFileName}`,
        genreId: genre.id,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al subir' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      include: { genre: true }
    });
    return NextResponse.json(songs);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
