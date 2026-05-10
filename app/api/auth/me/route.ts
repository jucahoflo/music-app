import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET || 'mi-secreto-super-seguro-2024';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    return NextResponse.json({ role: 'guest' });
  }
  
  try {
    const user = jwt.verify(token, SECRET) as { id: string; username: string; email: string; role: string };
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ role: 'guest' });
  }
}
