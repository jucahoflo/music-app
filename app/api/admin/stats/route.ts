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
    const user = jwt.verify(token, SECRET) as { role: string };
    return user.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const totalVisits = await prisma.visit.count();
    const visitsToday = await prisma.visit.count({
      where: {
        visitedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const totalUsers = await prisma.user.count();
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const visitsByPage = await prisma.visit.groupBy({
      by: ['path'],
      _count: { path: true },
    });

    return NextResponse.json({
      totalVisits,
      visitsToday,
      totalUsers,
      newUsers,
      users,
      visitsByPage: visitsByPage.map((v) => ({ path: v.path, visits: v._count.path })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
