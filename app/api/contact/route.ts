import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import nodemailer from 'nodemailer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST - Guardar mensaje, enviar notificación al Admin y Auto-respuesta al Cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, empresa, servicio, mensaje } = body;

    // 1. Guardar en Base de Datos
    await prisma.contactForm.create({
      data: { nombre, email, telefono, empresa, servicio, mensaje },
    });

    // Configurar el transporte SMTP 
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    // --- EMAIL 1: DISEÑO PARA EL ADMINISTRADOR 
    const adminMailOptions = {
      from: `"Sii Goo Web" <${process.env.SMTP_USER}>`,
      to: "info@siigooconsultores.com",
      replyTo: email,
      subject: `📩 Nuevo Lead: ${servicio} - ${nombre}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin:0; font-size: 24px;">Sii Goo Consultores</h1>
          </div>
          <div style="padding: 30px;">
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0 0 10px 0;"><strong>Nombre:</strong> ${nombre}</p>
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0 0 10px 0;"><strong>Teléfono:</strong> ${telefono || '—'}</p>
              <p style="margin: 0;"><strong>Empresa:</strong> ${empresa || 'Particular'}</p>
            </div>
            <h3 style="color: #1e40af; margin-top: 25px;">Servicio de interés: ${servicio}</h3>
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-top: 10px; font-style: italic; color: #475569;">
              ${mensaje.replace(/\n/g, '<br>')}
            </div>
            <div style="text-align: center; margin-top: 25px;">
              <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Responder al cliente</a>
            </div>
          </div>
        </div>
      `,
    };

    // --- EMAIL 2: DISEÑO DE AUTO-RESPUESTA PARA EL CLIENTE 
    const clientMailOptions = {
      from: `"Sii Goo Consultores" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `¡Hemos recibido tu mensaje correctamente!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 40px; text-align: center; color: white;">
            <div style="font-size: 50px; margin-bottom: 10px;">✓</div>
            <h1 style="margin: 0; font-size: 28px;">¡Mensaje Recibido!</h1>
          </div>
          <div style="padding: 30px; color: #374151; line-height: 1.6;">
            <p>Hola <strong>${nombre}</strong>,</p>
            <p>Hemos recibido tu mensaje sobre <strong>"${servicio}"</strong> correctamente.</p>
            <p>Nuestro equipo revisará tu consulta y te responderemos en las <strong>próximas 24 horas</strong> (de lunes a viernes en horario laboral).</p>
            
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0 0 10px 0;"><strong>💡 Mientras tanto:</strong></p>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4b5563;">
                <li>Revisa tu bandeja de spam por si nuestra respuesta llega allí</li>
                <li>Si tu consulta es urgente, puedes llamarnos directamente al <strong>+34 955 387 218</strong></li>
              </ul>
            </div>

            <p>Gracias por contactar con <strong>Sii Goo Consultores</strong>.</p>
            
            <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              <p style="margin-bottom: 5px;">Saludos cordiales,</p>
              <p style="font-weight: bold; color: #111827; margin: 0;">Equipo de Sii Goo Consultores</p>
            </div>
          </div>
        </div>
      `
    };

    // Ejecutar ambos envíos en paralelo
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error en proceso de contacto:", error.message);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

// GET - Obtener mensajes de contacto para el Dashboard
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const messages = await prisma.contactForm.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 });
  }
}

// PUT - Marcar mensaje como leído
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const { id } = await request.json();
    const message = await prisma.contactForm.update({
      where: { id },
      data: { leido: true },
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar mensaje' }, { status: 500 });
  }
}