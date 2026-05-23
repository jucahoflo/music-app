import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

async function isAdmin() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user-role')?.value;
  return userRole === 'admin';
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const url = new URL(request.url);
    const mp3Path = url.searchParams.get('mp3Path');
    const pdfPath = url.searchParams.get('pdfPath');
    const genreSlug = url.searchParams.get('genre');
    const songId = params.id;

    console.log('🗑️ Eliminando:', { songId, genreSlug, mp3Path, pdfPath });

    // 1. Eliminar del archivo de datos
    const genresFilePath = path.join(process.cwd(), 'app/api/genres/[slug]/route.ts');
    let content = fs.readFileSync(genresFilePath, 'utf8');

    // Buscar y eliminar la línea de la canción
    const lines = content.split('\n');
    const newLines = [];
    let found = false;

    for (const line of lines) {
      if (line.includes(`id: '${songId}'`) && !found) {
        found = true;
        continue; // Saltar esta línea
      }
      newLines.push(line);
    }

    content = newLines.join('\n');

    // Limpiar comas sobrantes
    content = content.replace(/,(\s*\n\s*\])/g, '$1');
    content = content.replace(/,(\s*,)/g, ',');

    fs.writeFileSync(genresFilePath, content);
    console.log('✅ Eliminado del código');

    // 2. Eliminar archivos MP3 y PDF
    if (mp3Path) {
      const fullMp3Path = path.join(process.cwd(), 'public', mp3Path);
      if (fs.existsSync(fullMp3Path)) {
        fs.unlinkSync(fullMp3Path);
        console.log('✅ MP3 eliminado');
      }
    }

    if (pdfPath) {
      const fullPdfPath = path.join(process.cwd(), 'public', pdfPath);
      if (fs.existsSync(fullPdfPath)) {
        fs.unlinkSync(fullPdfPath);
        console.log('✅ PDF eliminado');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
