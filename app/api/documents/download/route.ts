import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { getFileUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

// GET - Obtener URL de descarga
export async function GET(request: NextRequest) {
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

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos
    if (
      user.role !== 'admin' &&
      user.role !== 'gestor' &&
      document.userId !== user.id
    ) {
      return NextResponse.json(
        { error: 'No tienes permisos para descargar este documento' },
        { status: 403 }
      );
    }

    const downloadUrl = await getFileUrl(document.cloud_storage_path, document.isPublic);

    return NextResponse.json({ downloadUrl, name: document.name });
  } catch (error) {
    console.error('Error al obtener URL de descarga:', error);
    return NextResponse.json(
      { error: 'Error al obtener URL de descarga' },
      { status: 500 }
    );
  }
}