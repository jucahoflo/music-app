import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Genre from '@/models/Genre';

export async function GET() {
  try {
    await connectDB();
    const genres = await Genre.find({});
    return NextResponse.json(genres);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}