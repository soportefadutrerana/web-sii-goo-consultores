import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST - Subir archivo localmente
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const projectId = formData.get('projectId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;

    // Convertir el archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar el archivo en public/uploads
    const uploadPath = join(process.cwd(), 'public', 'uploads', uniqueFileName);
    await writeFile(uploadPath, buffer);

    // Crear registro en la base de datos
    const document = await prisma.document.create({
      data: {
        name: file.name,
        type: type || 'other',
        cloud_storage_path: `/uploads/${uniqueFileName}`,
        isPublic: false,
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy: 'client',
        userId: (session.user as any).id,
        projectId: projectId || null,
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
    console.error('Error al subir archivo:', error);
    return NextResponse.json(
      { error: 'Error al subir archivo' },
      { status: 500 }
    );
  }
}
