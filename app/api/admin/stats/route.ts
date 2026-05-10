import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
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

export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
  
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath);
    
    // Total de visitas
    const totalVisits = db.prepare('SELECT COUNT(*) as count FROM Visit').get();
    
    // Visitas hoy
    const visitsToday = db.prepare("SELECT COUNT(*) as count FROM Visit WHERE DATE(visitedAt) = DATE('now')").get();
    
    // Usuarios registrados
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM User').get();
    
    // Usuarios últimos 7 días
    const newUsers = db.prepare("SELECT COUNT(*) as count FROM User WHERE DATE(createdAt) >= DATE('now', '-7 days')").get();
    
    // Lista de usuarios
    const users = db.prepare(`
      SELECT username, email, role, createdAt, lastLogin 
      FROM User 
      ORDER BY createdAt DESC
    `).all();
    
    // Visitas por página
    const visitsByPage = db.prepare(`
      SELECT path, COUNT(*) as visits 
      FROM Visit 
      WHERE path IS NOT NULL
      GROUP BY path 
      ORDER BY visits DESC
    `).all();
    
    db.close();
    
    return NextResponse.json({
      totalVisits: totalVisits?.count || 0,
      visitsToday: visitsToday?.count || 0,
      totalUsers: totalUsers?.count || 0,
      newUsers: newUsers?.count || 0,
      users: users || [],
      visitsByPage: visitsByPage || [],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      totalVisits: 0,
      visitsToday: 0,
      totalUsers: 0,
      newUsers: 0,
      users: [],
      visitsByPage: [] 
    });
  }
}
