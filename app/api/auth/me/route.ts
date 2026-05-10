import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user-role')?.value || 'guest';
  const username = cookieStore.get('username')?.value || 'Invitado';
  
  return NextResponse.json({ 
    username: username,
    role: userRole,
    isAdmin: userRole === 'admin'
  });
}
