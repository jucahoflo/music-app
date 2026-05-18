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

    // Crear carpeta del género si no existe
    await mkdir(`public/mp3/${genreSlug}`, { recursive: true });
    await mkdir(`public/pdf/${genreSlug}`, { recursive: true });

    // Limpiar nombre del archivo
    const cleanName = (name: string) => name.replace(/\s/g, '_').replace(/[^\w\-_.]/g, '');
    const baseName = cleanName(mp3File.name.replace('.mp3', ''));

    // Guardar MP3
    const mp3FileName = `${baseName}.mp3`;
    const mp3Buffer = Buffer.from(await mp3File.arrayBuffer());
    await writeFile(path.join(process.cwd(), `public/mp3/${genreSlug}`, mp3FileName), mp3Buffer);

    // Guardar PDF
    const pdfFileName = `${baseName}.pdf`;
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(path.join(process.cwd(), `public/pdf/${genreSlug}`, pdfFileName), pdfBuffer);

    return NextResponse.json({ 
      success: true, 
      message: 'Canción subida exitosamente',
      song: {
        title,
        artist,
        genre: genreSlug,
        mp3Url: `/mp3/${genreSlug}/${mp3FileName}`,
        pdfUrl: `/pdf/${genreSlug}/${pdfFileName}`
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al subir: ' + error.message }, { status: 500 });
  }
}
