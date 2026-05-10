import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import Database from 'better-sqlite3';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = 'mi-secreto-super-seguro-2024';

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
    console.log('=== INICIANDO SUBIDA ===');
    
    // Verificar si es admin
    if (!await isAdmin()) {
      console.log('No autorizado - no es admin');
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const genreSlug = formData.get('genreId') as string;
    const duration = formData.get('duration') as string;
    const mp3File = formData.get('mp3File') as File;
    const pdfFile = formData.get('pdfFile') as File;

    console.log('Datos:', { title, artist, genreSlug, duration });
    console.log('MP3:', mp3File?.name, mp3File?.size);
    console.log('PDF:', pdfFile?.name, pdfFile?.size);

    if (!mp3File || !pdfFile) {
      console.log('Faltan archivos');
      return NextResponse.json({ error: 'Faltan archivos' }, { status: 400 });
    }

    // Crear directorios
    await mkdir('public/uploads/mp3', { recursive: true });
    await mkdir('public/uploads/pdf', { recursive: true });

    // Guardar MP3
    const mp3FileName = `${Date.now()}-${mp3File.name}`;
    const mp3Buffer = Buffer.from(await mp3File.arrayBuffer());
    const mp3Path = path.join(process.cwd(), 'public/uploads/mp3', mp3FileName);
    await writeFile(mp3Path, mp3Buffer);
    console.log('MP3 guardado:', mp3Path);

    // Guardar PDF
    const pdfFileName = `${Date.now()}-${pdfFile.name}`;
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const pdfPath = path.join(process.cwd(), 'public/uploads/pdf', pdfFileName);
    await writeFile(pdfPath, pdfBuffer);
    console.log('PDF guardado:', pdfPath);

    // Conectar a SQLite
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath);
    
    // Obtener el genreId desde el slug
    const genre = db.prepare('SELECT id FROM Genre WHERE slug = ?').get(genreSlug);
    
    if (!genre) {
      console.log('Género no encontrado:', genreSlug);
      return NextResponse.json({ error: 'Género no encontrado' }, { status: 400 });
    }

    // Insertar canción
    const stmt = db.prepare(`
      INSERT INTO Song (id, title, artist, duration, mp3Url, pdfUrl, genreId, playCount)
      VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, 0)
    `);
    
    stmt.run(title, artist, duration || null, `/uploads/mp3/${mp3FileName}`, `/uploads/pdf/${pdfFileName}`, genre.id);
    
    db.close();
    console.log('Canción guardada en BD');

    return NextResponse.json({ success: true, message: 'Canción subida exitosamente' }, { status: 201 });
  } catch (error) {
    console.error('Error detallado:', error);
    return NextResponse.json({ error: 'Error al subir la canción: ' + error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath);
    
    const songs = db.prepare(`
      SELECT s.*, g.name as genreName, g.slug as genreSlug 
      FROM Song s 
      JOIN Genre g ON s.genreId = g.id 
      ORDER BY s.createdAt DESC
    `).all();
    
    db.close();
    return NextResponse.json(songs);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
