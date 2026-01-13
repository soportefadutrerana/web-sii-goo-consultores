import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Obtener contador de mensajes no leídos
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ count: 0 });
    }

    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({
      where: { email: userEmail! },
      select: { role: true }, // Solo seleccionar el campo necesario
    });

    if (!user || (user.role !== 'admin' && user.role !== 'gestor')) {
      return NextResponse.json({ count: 0 });
    }

    // Consulta optimizada usando count directo
    const count = await prisma.contactForm.count({
      where: {
        leido: false,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error al obtener contador de mensajes no leídos:', error);
    return NextResponse.json({ count: 0 });
  }
}
