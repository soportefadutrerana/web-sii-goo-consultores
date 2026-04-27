import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Obtener servicios ordenados por prioridad y manual
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [
        { destacado: 'desc' }, // 1º Los destacados arriba
        { orden: 'asc' },      // 2º Por su posición manual
        { createdAt: 'asc' }   // 3º Por antigüedad
      ],
    });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}

// PATCH - Reordenamiento masivo (Solo Admin)
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json(); 

    await prisma.$transaction(
      body.map((item: any) => 
        prisma.service.update({
          where: { id: item.id },
          data: { orden: item.orden }
        })
      )
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al reordenar' }, { status: 500 });
  }
}

// POST - Crear un nuevo servicio (Solo Admin)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { titulo, descripcion, icono, puntos, destacado, orden } = body;

    const newService = await prisma.service.create({
      data: { 
        titulo, 
        descripcion, 
        icono, 
        puntos, 
        destacado: destacado || false,
        orden: orden || 0 // Guardamos el orden enviado
      },
    });

    return NextResponse.json(newService);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 });
  }
}

// PUT - Actualizar un servicio existente (Solo Admin)
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, titulo, descripcion, icono, puntos, destacado, orden } = body;

    const updatedService = await prisma.service.update({
      where: { id },
      data: { 
        titulo, 
        descripcion, 
        icono, 
        puntos, 
        destacado,
        orden // Mantenemos el orden al editar
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}