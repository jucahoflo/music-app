import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (token) {
    return NextResponse.json({ username: 'jucahoflo', role: 'admin' });
  }
  return NextResponse.json({ role: 'guest' });
}
