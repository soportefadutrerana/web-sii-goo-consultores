import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // 1. Buscamos al usuario que tenga ese token y que no haya expirado
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // El token debe ser mayor a la fecha actual
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'El enlace es inválido o ha expirado' },
        { status: 400 }
      );
    }

    // 2. Encriptamos la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Actualizamos al usuario y LIMPIAMOS el token para que no se use dos veces
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Contraseña actualizada' });
  } catch (error) {
    console.error('Error en set-password:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}