const Database = require('better-sqlite3');
const db = new Database('prisma/dev.db');

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS Genre (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    color TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const genres = [
  ['Balada', 'balada', 'from-pink-500 to-rose-500', '🎵'],
  ['Pop', 'pop', 'from-blue-500 to-cyan-500', '🎤'],
  ['Rock', 'rock', 'from-purple-500 to-indigo-500', '🤘'],
  ['Bachata', 'bachata', 'from-emerald-500 to-teal-500', '💃'],
  ['Ranchera', 'ranchera', 'from-amber-500 to-orange-500', '🤠'],
  ['Merengues', 'merengues', 'from-red-500 to-pink-500', '🪘'],
  ['Bailables', 'bailables', 'from-yellow-500 to-orange-400', '💃'],
  ['Salsa', 'salsa', 'from-green-500 to-lime-500', '🕺'],
  ['Bolero', 'bolero', 'from-slate-500 to-gray-500', '🌹'],
  ['Madres', 'madres', 'from-rose-400 to-pink-400', '👩'],
  ['Padre', 'padre', 'from-blue-400 to-indigo-400', '👨'],
  ['Religiosa', 'religiosa', 'from-violet-500 to-purple-500', '⛪']
];

const stmt = db.prepare('INSERT OR IGNORE INTO Genre (name, slug, color, icon) VALUES (?, ?, ?, ?)');

console.log('🌱 Insertando géneros...');
for (const g of genres) {
  stmt.run(g[0], g[1], g[2], g[3]);
  console.log('✅', g[0]);
}

console.log('🎉 12 géneros creados!');

// Verificar
const count = db.prepare('SELECT COUNT(*) as total FROM Genre').get();
console.log('Total en BD:', count.total);

db.close();
