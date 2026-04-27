import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/db'; // Ajusta esta ruta si tu archivo prisma.ts está en otro lado

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  try {

    const content = await prisma.siteContent.findMany({
      where: page ? { page } : undefined,
    });
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error GET /api/content:', error);
    return NextResponse.json({ error: 'Error al obtener el contenido' }, { status: 500 });
  }
}

// 2. PUT: Guardar o actualizar contenido (Protegido, solo admin)
export async function PUT(request: Request) {
  // Verificamos que el usuario haya iniciado sesión
  const session = await getServerSession();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { page, section, type, content } = body;

    // Validación básica
    if (!page || !section || content === undefined) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Prisma "upsert": Esta es la magia. 
    // Si la combinación (page + section) ya existe, la ACTUALIZA. 
    // Si no existe, la CREA nueva.
    const updatedContent = await prisma.siteContent.upsert({
      where: {
        page_section: {
          page: page,
          section: section,
        },
      },
      update: {
        content: content,
        type: type || 'text',
      },
      create: {
        page: page,
        section: section,
        type: type || 'text',
        content: content,
      },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error PUT /api/content:', error);
    return NextResponse.json({ error: 'Error al guardar el contenido' }, { status: 500 });
  }
}