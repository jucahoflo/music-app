import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: genres, error } = await supabase
      .from('Genre')
      .select('*');
    
    if (error) {
      console.error('Error:', error);
      return NextResponse.json([], { status: 500 });
    }
    
    return NextResponse.json(genres || []);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
