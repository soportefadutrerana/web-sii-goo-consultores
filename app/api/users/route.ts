import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/mail'; // Tu función de nodemailer
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// --- FUNCIÓN DE SEGURIDAD PARA VERIFICAR ADMIN ---
async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });
  
  return user?.role === 'admin' || user?.role === 'gestor';
}

// 1. GET - OBTENER LISTA DE USUARIOS
export async function GET() {
  try {
    if (!(await isAdmin())) {
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

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '403' }, { status: 403 });

    const body = await request.json();
    const { name, email, company, role } = body;

    // 1. Contraseña aleatoria y Token de recuperación (24 horas)
    const tempPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    // 2. CREAMOS EL USUARIO EN LA BASE DE DATOS
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        company,
        role: role || 'client',
        password: hashedPassword,
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      }
    });

    // 3. INTENTAMOS ENVIAR EL CORREO (Aislado en un bloque try/catch propio)
    try {
      await sendWelcomeEmail(email, name, resetToken);
      return NextResponse.json({ success: true, message: 'Usuario creado e invitación enviada' });
    } catch (emailError) {
      console.error('El usuario se guardó en la BD, pero el email falló:', emailError);
      
      // ⚠️ IMPORTANTE: Devolvemos un éxito (200 OK) para que la web cierre el popup
      // y actualice la lista de usuarios, ya que el usuario SÍ se ha creado.
      return NextResponse.json({ 
        success: true, 
        message: 'Usuario creado correctamente (pero falló el envío automático del correo)' 
      });
    }

  } catch (error: any) {
    console.error('Error general en POST:', error);
    
    // Si el usuario intentó registrar un correo que ya existe en la BD
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Error interno del servidor al crear usuario' }, { status: 500 });
  }
}

// 3. PUT - ACTUALIZAR USUARIO
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, email, company, phone, role, password } = body;

    const updateData: any = { name, email, company, phone, role };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: String(id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

// 4. DELETE - ELIMINAR USUARIO (AÑADIDO)
export async function DELETE(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}