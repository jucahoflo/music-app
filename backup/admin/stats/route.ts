import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.NEXTAUTH_SECRET || 'mi-secreto-super-seguro-2024';

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return false;
  try {
    const user = jwt.verify(token, SECRET);
    return user.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    // Verificar admin
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Obtener estadísticas
    const [totalVisits, visitsToday, totalUsers, newUsers, users, visitsByPage] = await Promise.all([
      prisma.visit.count(),
      prisma.visit.count({
        where: {
          visitedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.visit.groupBy({
        by: ['path'],
        _count: { path: true }
      })
    ]);

    return NextResponse.json({
      totalVisits,
      visitsToday,
      totalUsers,
      newUsers,
      users,
      visitsByPage: visitsByPage.map(v => ({ path: v.path, visits: v._count.path }))
    });
  } catch (error) {
    console.error('Error en stats:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
