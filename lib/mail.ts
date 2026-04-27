// lib/mail.ts
import nodemailer from 'nodemailer';

// Usamos EXACTAMENTE la misma configuración que en tu formulario de contacto
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { 
    rejectUnauthorized: false 
  }
});

/**
 * Envía un correo de bienvenida con link de activación para que el usuario ponga su contraseña
 */
export const sendWelcomeEmail = async (email: string, name: string, token: string) => {
  // Asegúrate de que NEXTAUTH_URL está en tu .env (ej: http://localhost:3000)
  const activateUrl = `${process.env.NEXTAUTH_URL}/auth/set-password?token=${token}`;

  const mailOptions = {
    from: `"Sii Goo Consultores" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Bienvenido a Sii Goo Consultores - Configura tu cuenta',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Sii Goo Consultores</h1>
          <p style="margin-top: 10px; font-size: 14px; opacity: 0.9;">Gestoría y Contabilidad Analítica</p>
        </div>
        <div style="padding: 30px; color: #374151; line-height: 1.6;">
          <h2 style="color: #111827; margin-top: 0;">¡Hola, ${name}!</h2>
          <p>
            Se ha creado tu cuenta profesional en nuestro portal. Para empezar a gestionar tus proyectos y documentos, 
            es necesario que configures tu contraseña de acceso personalizada.
          </p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${activateUrl}" style="background-color: #2563eb; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Configurar mi contraseña
            </a>
          </div>
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 8px; font-size: 14px;">
            <strong>🔒 Por tu seguridad:</strong> Este enlace es de un solo uso y caducará en 24 horas.
          </div>
          <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="font-size: 13px; color: #6b7280; text-align: center; margin: 0;">
              Si no esperabas este correo, puedes ignorarlo con seguridad.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};