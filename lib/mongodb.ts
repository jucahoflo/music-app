import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:lqmfPSxnuaOFKGYhYbmUkodSietKsxLG@mongodb.railway.internal:27017/music?retryWrites=true&w=majority';

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(() => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
