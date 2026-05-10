import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Genre from '@/models/Genre';
import Song from '@/models/Song';

export async function GET() {
  try {
    await connectDB();
    const genres = await Genre.find({});
    
    const genresWithCount = await Promise.all(
      genres.map(async (genre) => {
        const songCount = await Song.countDocuments({ genreId: genre._id.toString() });
        return {
          id: genre._id,
          name: genre.name,
          slug: genre.slug,
          color: genre.color,
          icon: genre.icon,
          songCount,
        };
      })
    );
    
    return NextResponse.json(genresWithCount);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
