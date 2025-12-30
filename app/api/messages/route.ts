import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Obtener mensajes
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

    let messages;

    if (user.role === 'admin' || user.role === 'gestor') {
      // Admins y gestores ven todos los mensajes
      messages = await prisma.message.findMany({
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Clientes solo ven sus mensajes (enviados o recibidos)
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: user.id },
            { receiverId: user.id },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return NextResponse.json(
      { error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}

// POST - Enviar mensaje
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
    const { subject, content, receiverId } = data;

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Asunto y contenido son obligatorios' },
        { status: 400 }
      );
    }

    // Si no se especifica receiverId, buscar un gestor/admin
    let finalReceiverId = receiverId;
    
    if (!finalReceiverId) {
      const gestor = await prisma.user.findFirst({
        where: {
          role: { in: ['gestor', 'admin'] },
        },
      });

      if (!gestor) {
        return NextResponse.json(
          { error: 'No hay gestor disponible' },
          { status: 400 }
        );
      }

      finalReceiverId = gestor.id;
    }

    const message = await prisma.message.create({
      data: {
        subject,
        content,
        senderId: user.id,
        receiverId: finalReceiverId,
        read: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}

// PUT - Marcar mensaje como leído
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del mensaje es obligatorio' },
        { status: 400 }
      );
    }

    const message = await prisma.message.update({
      where: { id },
      data: { read: true },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error al marcar mensaje como leído:', error);
    return NextResponse.json(
      { error: 'Error al marcar mensaje como leído' },
      { status: 500 }
    );
  }
}