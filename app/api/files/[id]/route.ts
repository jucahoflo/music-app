import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const MONGODB_URI = process.env.MONGODB_URI!;
    
    if (!mongoose.connection.readyState) {
      await mongoose.connect(MONGODB_URI);
    }
    
    const db = mongoose.connection.db!;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(params.id) }).toArray();
    
    if (!files || files.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    const file = files[0];
    const stream = bucket.openDownloadStream(new mongoose.Types.ObjectId(params.id));
    
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${file.filename}"`,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
