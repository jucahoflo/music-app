import { NextResponse } from 'next/server'
import Database from 'better-sqlite3';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)
    
    const genres = db.prepare(`
      SELECT g.*, COUNT(s.id) as songCount
      FROM Genre g
      LEFT JOIN Song s ON s.genreId = g.id
      GROUP BY g.id
      ORDER BY g.name
    `).all()
    
    db.close()
    
    return NextResponse.json(genres)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
