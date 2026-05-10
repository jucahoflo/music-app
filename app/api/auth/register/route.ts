import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    
    console.log('Registro intentado:', username);
    
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath);
    
    // Verificar si el usuario ya existe
    const existing = db.prepare('SELECT * FROM User WHERE username = ? OR email = ?').get(username, email);
    if (existing) {
      db.close();
      return NextResponse.json({ error: 'Usuario o email ya existe' }, { status: 400 });
    }
    
    // Hash de contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Insertar usuario
    const stmt = db.prepare(`
      INSERT INTO User (id, username, email, password, role)
      VALUES (lower(hex(randomblob(16))), ?, ?, ?, 'user')
    `);
    stmt.run(username, email, hashedPassword);
    
    db.close();
    
    console.log('Registro exitoso:', username);
    return NextResponse.json({ success: true, message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
