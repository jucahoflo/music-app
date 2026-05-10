import { NextResponse } from 'next/server'
import Database from 'better-sqlite3';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)
    
    const genre = db.prepare(`
      SELECT * FROM Genre WHERE slug = ?
    `).get(params.slug)
    
    if (!genre) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    
    const songs = db.prepare(`
      SELECT * FROM Song WHERE genreId = ? ORDER BY createdAt DESC
    `).all(genre.id)
    
    db.close()
    
    return NextResponse.json({
      ...genre,
      songs: songs
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
