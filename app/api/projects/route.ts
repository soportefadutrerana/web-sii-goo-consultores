import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET - Obtener proyectos
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

    let projects;

    if (user.role === 'admin' || user.role === 'gestor') {
      // Admins y gestores ven todos los proyectos
      projects = await prisma.project.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Clientes solo ven sus proyectos
      projects = await prisma.project.findMany({
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return NextResponse.json(
      { error: 'Error al obtener proyectos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo proyecto
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
    const { name, type, status, budget, income, expenses, userId } = data;

    // Validaciones
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Nombre y tipo son obligatorios' },
        { status: 400 }
      );
    }

    // Determinar el userId final
    let finalUserId = user.id;
    
    // Si es gestor/admin y se especifica userId, usar ese
    if ((user.role === 'admin' || user.role === 'gestor') && userId) {
      finalUserId = userId;
    }

    const project = await prisma.project.create({
      data: {
        name,
        type,
        status: status || 'activo',
        startDate: new Date(),
        budget: budget ? parseFloat(budget) : 0,
        totalIncome: income ? parseFloat(income) : 0,
        totalExpenses: expenses ? parseFloat(expenses) : 0,
        netProfit: (income ? parseFloat(income) : 0) - (expenses ? parseFloat(expenses) : 0),
        profitMargin: income && parseFloat(income) > 0 
          ? ((parseFloat(income) - parseFloat(expenses)) / parseFloat(income)) * 100
          : 0,
        userId: finalUserId,
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
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    return NextResponse.json(
      { error: 'Error al crear proyecto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar proyecto
export async function PUT(request: NextRequest) {
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
    const { id, name, type, status, budget, income, expenses } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del proyecto es obligatorio' },
        { status: 400 }
      );
    }

    // Verificar permisos
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    if (
      user.role !== 'admin' &&
      user.role !== 'gestor' &&
      existingProject.userId !== user.id
    ) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar este proyecto' },
        { status: 403 }
      );
    }

    const incomeValue = income !== undefined ? parseFloat(income) : existingProject.totalIncome;
    const expensesValue = expenses !== undefined ? parseFloat(expenses) : existingProject.totalExpenses;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(status && { status }),
        ...(budget !== undefined && { budget: parseFloat(budget) }),
        ...(income !== undefined && { totalIncome: incomeValue }),
        ...(expenses !== undefined && { totalExpenses: expensesValue }),
        netProfit: incomeValue - expensesValue,
        profitMargin: incomeValue > 0 
          ? ((incomeValue - expensesValue) / incomeValue) * 100
          : 0,
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
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar proyecto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar proyecto
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
        { error: 'ID del proyecto es obligatorio' },
        { status: 400 }
      );
    }

    // Verificar permisos
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    if (
      user.role !== 'admin' &&
      user.role !== 'gestor' &&
      existingProject.userId !== user.id
    ) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar este proyecto' },
        { status: 403 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar proyecto' },
      { status: 500 }
    );
  }
}