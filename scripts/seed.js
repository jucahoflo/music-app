const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://music_admin:Music123456@cluster0.ag3i6vf.mongodb.net/music?retryWrites=true&w=majority';

// Definir esquemas directamente en el seed
const GenreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String },
  color: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

const Genre = mongoose.models.Genre || mongoose.model('Genre', GenreSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const genres = [
  { name: 'Balada', slug: 'balada', color: 'from-pink-500 to-rose-500', icon: '🎵' },
  { name: 'Pop', slug: 'pop', color: 'from-blue-500 to-cyan-500', icon: '🎤' },
  { name: 'Rock', slug: 'rock', color: 'from-purple-500 to-indigo-500', icon: '🤘' },
  { name: 'Bachata', slug: 'bachata', color: 'from-emerald-500 to-teal-500', icon: '💃' },
  { name: 'Ranchera', slug: 'ranchera', color: 'from-amber-500 to-orange-500', icon: '🤠' },
  { name: 'Merengues', slug: 'merengues', color: 'from-red-500 to-pink-500', icon: '🪘' },
  { name: 'Bailables', slug: 'bailables', color: 'from-yellow-500 to-orange-400', icon: '💃' },
  { name: 'Salsa', slug: 'salsa', color: 'from-green-500 to-lime-500', icon: '🕺' },
  { name: 'Bolero', slug: 'bolero', color: 'from-slate-500 to-gray-500', icon: '🌹' },
  { name: 'Madres', slug: 'madres', color: 'from-rose-400 to-pink-400', icon: '👩' },
  { name: 'Padre', slug: 'padre', color: 'from-blue-400 to-indigo-400', icon: '👨' },
  { name: 'Religiosa', slug: 'religiosa', color: 'from-violet-500 to-purple-500', icon: '⛪' },
  { name: 'Agropecuaria Popular', slug: 'agropecuaria-popular', color: 'from-green-700 to-emerald-700', icon: '🌾' }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Insertar géneros
    for (const genre of genres) {
      await Genre.findOneAndUpdate(
        { slug: genre.slug },
        genre,
        { upsert: true, new: true }
      );
      console.log(`✅ ${genre.name}`);
    }
    
    // Insertar admin (contraseña: 123456)
    const hashedPassword = bcrypt.hashSync('123456', 10);
    await User.findOneAndUpdate(
      { username: 'jucahoflo' },
      { username: 'jucahoflo', email: 'jucahoflo@music.com', password: hashedPassword, role: 'admin' },
      { upsert: true, new: true }
    );
    console.log('✅ Usuario admin creado');
    
    console.log('🎉 Seed completado');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();
