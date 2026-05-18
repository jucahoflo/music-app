import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';

async function isAdmin() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user-role')?.value;
  return userRole === 'admin';
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
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

    // Crear directorios
    await mkdir('public/uploads/mp3', { recursive: true });
    await mkdir('public/uploads/pdf', { recursive: true });
    await mkdir('public/mp3', { recursive: true });
    await mkdir('public/pdf', { recursive: true });

    // Guardar MP3
    const mp3FileName = `${Date.now()}-${mp3File.name.replace(/\s/g, '_')}`;
    const mp3Buffer = Buffer.from(await mp3File.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/uploads/mp3', mp3FileName), mp3Buffer);
    await writeFile(path.join(process.cwd(), 'public/mp3', mp3FileName), mp3Buffer);

    // Guardar PDF
    const pdfFileName = `${Date.now()}-${pdfFile.name.replace(/\s/g, '_')}`;
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/uploads/pdf', pdfFileName), pdfBuffer);
    await writeFile(path.join(process.cwd(), 'public/pdf', pdfFileName), pdfBuffer);

    return NextResponse.json({ 
      success: true, 
      message: 'Canción subida exitosamente',
      song: {
        title,
        artist,
        genre: genreSlug,
        mp3Url: `/mp3/${mp3FileName}`,
        pdfUrl: `/pdf/${pdfFileName}`
      }
    });
  } catch (err) {
    console.error('Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: 'Error al subir: ' + errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'API funcionando' });
}
