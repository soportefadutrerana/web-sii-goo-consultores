import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePresignedUploadUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

// POST - Generar URL presignada para subir archivo
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { fileName, contentType, isPublic } = data;

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'fileName y contentType son obligatorios' },
        { status: 400 }
      );
    }

    const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(
      fileName,
      contentType,
      isPublic || false
    );

    return NextResponse.json({ uploadUrl, cloud_storage_path });
  } catch (error) {
    console.error('Error al generar URL presignada:', error);
    return NextResponse.json(
      { error: 'Error al generar URL presignada' },
      { status: 500 }
    );
  }
}