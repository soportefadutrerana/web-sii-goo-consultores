import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Obtener usuarios disponibles para enviar mensajes
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail! },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    let availableUsers;

    if (currentUser.role === 'client') {
      // Clientes solo pueden enviar mensajes a gestores/admins
      availableUsers = await prisma.user.findMany({
        where: {
          role: { in: ['gestor', 'admin'] },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          company: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    } else {
      // Gestores/admins pueden enviar mensajes a cualquiera excepto a sí mismos
      availableUsers = await prisma.user.findMany({
        where: {
          id: { not: currentUser.id },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          company: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    }

    return NextResponse.json(availableUsers);
  } catch (error) {
    console.error('Error al obtener usuarios disponibles:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios disponibles' },
      { status: 500 }
    );
  }
}
