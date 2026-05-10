import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, user: { username: 'jucahoflo', role: 'admin' } });
  response.cookies.set('token', 'demo-token', { httpOnly: true, maxAge: 604800, path: '/' });
  return response;
}
