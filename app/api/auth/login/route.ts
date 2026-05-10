import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = 'mi-secreto-super-seguro-2024';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath);
    
    const user = db.prepare('SELECT * FROM User WHERE username = ?').get(username);
    db.close();
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no existe' }, { status: 401 });
    }
    
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json({ 
      success: true, 
      user: { username: user.username, role: user.role } 
    });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
