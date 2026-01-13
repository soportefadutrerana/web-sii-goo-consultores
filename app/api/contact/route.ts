import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST - Crear nuevo mensaje de contacto
export async function POST(request: NextRequest) {
  try {
    const body = await request?.json?.();
    
    const { nombre, email, telefono, empresa, servicio, mensaje } = body ?? {};

    // Validate required fields
    if (!nombre || !email || !servicio || !mensaje) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex?.test?.(email ?? '')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Save to database
    const contactForm = await prisma?.contactForm?.create?.({
      data: {
        nombre: nombre ?? '',
        email: email ?? '',
        telefono: telefono ?? null,
        empresa: empresa ?? null,
        servicio: servicio ?? '',
        mensaje: mensaje ?? '',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Formulario enviado correctamente',
        id: contactForm?.id ?? null
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al procesar formulario de contacto:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

// GET - Obtener mensajes de contacto (solo para gestores/admins)
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
    const user = await prisma.user.findUnique({
      where: { email: userEmail! },
    });

    if (!user || (user.role !== 'admin' && user.role !== 'gestor')) {
      return NextResponse.json(
        { error: 'No tienes permisos para ver estos mensajes' },
        { status: 403 }
      );
    }

    const messages = await prisma.contactForm.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes de contacto:', error);
    return NextResponse.json(
      { error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}

// PUT - Marcar mensaje como leído
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({
      where: { email: userEmail! },
    });

    if (!user || (user.role !== 'admin' && user.role !== 'gestor')) {
      return NextResponse.json(
        { error: 'No tienes permisos' },
        { status: 403 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID del mensaje es obligatorio' },
        { status: 400 }
      );
    }

    const message = await prisma.contactForm.update({
      where: { id },
      data: { leido: true },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error al marcar mensaje como leído:', error);
    return NextResponse.json(
      { error: 'Error al actualizar mensaje' },
      { status: 500 }
    );
  }
}
