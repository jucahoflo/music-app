import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Genre from '@/models/Genre';
import Song from '@/models/Song';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const genre = await Genre.findOne({ slug: params.slug });
    const songs = await Song.find({ genreId: genre?._id.toString() });
    return NextResponse.json({ ...genre?.toObject(), songs });
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}