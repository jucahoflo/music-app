import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = 'mi-secreto-super-seguro-2024';

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const user = jwt.verify(token, SECRET);
    return user.id;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { path: pagePath } = await request.json();
    const userId = await getUserId();
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath);
    
    const stmt = db.prepare(`
      INSERT INTO Visit (id, path, userId)
      VALUES (lower(hex(randomblob(16))), ?, ?)
    `);
    
    stmt.run(pagePath, userId);
    db.close();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
