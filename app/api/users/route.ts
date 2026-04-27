import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET - Obtener lista de usuarios (Ya lo tenías, se mantiene)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'gestor')) {
      return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

// PUT - ACTUALIZAR USUARIO (NUEVO)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Seguridad: Solo admin puede editar a otros
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, email, company, phone, role, password } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    // 2. Preparar datos de actualización
    const updateData: any = {
      name,
      email,
      company,
      phone,
      role,
    };

    // 3. Si se incluye contraseña, la encriptamos antes de guardar
    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // 4. Actualizar en la base de datos
    const updatedUser = await prisma.user.update({
      where: { id: String(id) },
      data: updateData,
      select: { // No devolvemos la contraseña por seguridad
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      user: updatedUser
    });

  } catch (error: any) {
    console.error('Error al actualizar usuario:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'El email ya está en uso por otro usuario' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}