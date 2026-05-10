const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
  { name: 'Religiosa', slug: 'religiosa', color: 'from-violet-500 to-purple-500', icon: '⛪' }
];

async function main() {
  console.log('🌱 Creando géneros...');
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: {},
      create: genre
    });
    console.log('✅', genre.name);
  }
  console.log('🎉 Listo!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
