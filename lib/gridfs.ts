import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let gridFSBucket: GridFSBucket | null = null;

export async function getGridFSBucket() {
  if (!gridFSBucket) {
    const db = mongoose.connection.db;
    if (!db) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    gridFSBucket = new GridFSBucket(mongoose.connection.db!, {
      bucketName: 'uploads'
    });
  }
  return gridFSBucket;
}

export async function uploadFile(file: Buffer, filename: string, mimeType: string) {
  const bucket = await getGridFSBucket();
  const uploadStream = bucket.openUploadStream(filename, {
    contentType: mimeType,
    metadata: { uploadDate: new Date() }
  });
  
  return new Promise((resolve, reject) => {
    uploadStream.on('error', reject);
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.end(file);
  });
}

export async function getFileUrl(fileId: string) {
  return `/api/files/${fileId}`;
}
