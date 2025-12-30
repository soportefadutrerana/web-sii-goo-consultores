import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Obtener documentos
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

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    let documents;

    if (user.role === 'admin' || user.role === 'gestor') {
      // Admins y gestores ven todos los documentos
      documents = await prisma.document.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Clientes solo ven sus documentos
      documents = await prisma.document.findMany({
        where: {
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    return NextResponse.json(
      { error: 'Error al obtener documentos' },
      { status: 500 }
    );
  }
}

// POST - Crear documento (guardar metadata después de upload a S3)
export async function POST(request: NextRequest) {
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

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { name, type, cloud_storage_path, isPublic, projectId, fileSize } = data;

    if (!name || !cloud_storage_path) {
      return NextResponse.json(
        { error: 'Nombre y ruta de almacenamiento son obligatorios' },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        name,
        type: type || 'other',
        cloud_storage_path,
        isPublic: isPublic || false,
        userId: user.id,
        projectId: projectId || null,
        fileSize: fileSize || null,
        uploadedBy: user.role === 'client' ? 'client' : 'gestor',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error al crear documento:', error);
    return NextResponse.json(
      { error: 'Error al crear documento' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar documento
export async function DELETE(request: NextRequest) {
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

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID del documento es obligatorio' },
        { status: 400 }
      );
    }

    // Verificar permisos
    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    if (
      user.role !== 'admin' &&
      user.role !== 'gestor' &&
      existingDocument.userId !== user.id
    ) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar este documento' },
        { status: 403 }
      );
    }

    // Eliminar del S3 también
    try {
      const { deleteFile } = await import('@/lib/s3');
      await deleteFile(existingDocument.cloud_storage_path);
    } catch (s3Error) {
      console.error('Error al eliminar de S3:', s3Error);
      // Continuar con la eliminación de la DB aunque falle S3
    }

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Documento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    return NextResponse.json(
      { error: 'Error al eliminar documento' },
      { status: 500 }
    );
  }
}