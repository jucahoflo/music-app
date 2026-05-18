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
    const uploadsMp3Dir = path.join(process.cwd(), 'public/uploads/mp3');
    const uploadsPdfDir = path.join(process.cwd(), 'public/uploads/pdf');
    const publicMp3Dir = path.join(process.cwd(), 'public/mp3');
    const publicPdfDir = path.join(process.cwd(), 'public/pdf');
    const genreMp3Dir = path.join(publicMp3Dir, genreSlug);
    const genrePdfDir = path.join(publicPdfDir, genreSlug);

    await mkdir(uploadsMp3Dir, { recursive: true });
    await mkdir(uploadsPdfDir, { recursive: true });
    await mkdir(publicMp3Dir, { recursive: true });
    await mkdir(publicPdfDir, { recursive: true });
    await mkdir(genreMp3Dir, { recursive: true });
    await mkdir(genrePdfDir, { recursive: true });

    // Limpiar nombre del archivo
    const cleanName = (name: string) => name.replace(/\s/g, '_').replace(/[^\w\-_.]/g, '');
    const baseName = cleanName(mp3File.name.replace('.mp3', ''));

    // Guardar MP3
    const mp3FileName = `${baseName}.mp3`;
    const mp3Buffer = Buffer.from(await mp3File.arrayBuffer());
    await writeFile(path.join(uploadsMp3Dir, mp3FileName), mp3Buffer);
    await writeFile(path.join(publicMp3Dir, mp3FileName), mp3Buffer);
    await writeFile(path.join(genreMp3Dir, mp3FileName), mp3Buffer);

    // Guardar PDF
    const pdfFileName = `${baseName}.pdf`;
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(path.join(uploadsPdfDir, pdfFileName), pdfBuffer);
    await writeFile(path.join(publicPdfDir, pdfFileName), pdfBuffer);
    await writeFile(path.join(genrePdfDir, pdfFileName), pdfBuffer);

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
  } catch (err) {
    console.error('Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: 'Error al subir: ' + errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'API de canciones funcionando' });
}
