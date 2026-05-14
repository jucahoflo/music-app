import mongoose from 'mongoose';

let gridFSBucket: any = null;

export async function getGridFSBucket() {
  if (!gridFSBucket) {
    const db = mongoose.connection.db;
    if (!db) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    gridFSBucket = new (require('mongodb').GridFSBucket)(mongoose.connection.db, {
      bucketName: 'uploads'
    });
  }
  return gridFSBucket;
}
