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
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const genreSlug = formData.get('genreId') as string;
    const duration = formData.get('duration') as string;
    const mp3File = formData.get('mp3File') as File;
    const pdfFile = formData.get('pdfFile') as File;

      return NextResponse.json({ error: 'Faltan archivos' }, { status: 400 });
    }

    await mkdir('public/uploads/mp3', { recursive: true });
    await mkdir('public/uploads/pdf', { recursive: true });

    const mp3FileName = ;
    const mp3Buffer = Buffer.from(await mp3File.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/uploads/mp3', mp3FileName), mp3Buffer);

    const pdfFileName = ;
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/uploads/pdf', pdfFileName), pdfBuffer);

    return NextResponse.json({ 
      success: true,
      message: 'Canción subida exitosamente',
      song: {
        title,
        artist,
        genre: genreSlug,
        mp3Url: ,
        pdfUrl: 
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al subir: ' + error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'API funcionando' });
}
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

    await mkdir('public/uploads/mp3', { recursive: true });
    await mkdir('public/uploads/pdf', { recursive: true });

    const mp3FileName = Date.now() + '-' + mp3File.name.replace(/\s/g, '_');
    const mp3Buffer = Buffer.from(await mp3File.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/uploads/mp3', mp3FileName), mp3Buffer);

    const pdfFileName = Date.now() + '-' + pdfFile.name.replace(/\s/g, '_');
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public/uploads/pdf', pdfFileName), pdfBuffer);

    return NextResponse.json({ 
      success: true, 
      message: 'Cancion subida exitosamente',
      song: {
        title,
        artist,
        genre: genreSlug,
        mp3Url: '/uploads/mp3/' + mp3FileName,
        pdfUrl: '/uploads/pdf/' + pdfFileName
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al subir: ' + error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'API funcionando' });
}

