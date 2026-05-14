const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function testGridFS() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    
    // Listar archivos existentes
    const files = await bucket.find({}).toArray();
    console.log(`📁 Archivos en GridFS: ${files.length}`);
    
    files.forEach(file => {
      console.log(`  - ${file.filename} (${file.contentType})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testGridFS();
