const mongoose = require('mongoose');

const uri = 'mongodb://music_admin:Music123456@cluster0-shard-00-00.ag3i6vf.mongodb.net:27017,cluster0-shard-00-01.ag3i6vf.mongodb.net:27017,cluster0-shard-00-02.ag3i6vf.mongodb.net:27017/music?replicaSet=atlas-jhbywb-shard-0&ssl=true&authSource=admin';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
