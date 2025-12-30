import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

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
