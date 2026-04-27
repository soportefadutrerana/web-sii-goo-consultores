import Navbar from '@/components/navbar';
import ContactForm from '@/components/contact-form';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import EditableContent from '@/components/editable-content';

export default async function ContactoPage() {
  // --- LÓGICA DEL CMS ---
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'admin';

  let dbContent: Record<string, string> = {};
  
  try {
    const rawContent = await prisma.siteContent.findMany({
      where: { page: 'contacto' } 
    });

    dbContent = rawContent.reduce((acc: any, item: { section: string; content: string }) => {
      acc[item.section] = item.content;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error cargando contenido de contacto:", error);
  }

  // Valores por defecto
  const title1 = dbContent.cont_t1 || "Solicite su ";
  const title2 = dbContent.cont_t2 || "Consulta Gratuita";
  const subtitle = dbContent.cont_sub || "Descubra cómo podemos ayudar a optimizar la gestión y rentabilidad de su empresa";
  
  const qTitle = dbContent.cont_q_t || "¿Tiene preguntas?";
  const qDesc = dbContent.cont_q_d || "Estamos aquí para ayudarle. Contáctenos y descubra cómo nuestros servicios pueden transformar la gestión de su empresa.";

  const contactEmail = dbContent.cont_mail || "info@siigooconsultores.com";
  const contactPhone = dbContent.cont_tel || "+34 955 387 218";
  const contactAddr = dbContent.cont_addr || "Callejón de Capachuelos 73, local 6, 41710, Utrera, Sevilla";
  
  const hoursTitle = dbContent.cont_hours_t || "Horario de Atención";
  const hoursDetail = dbContent.cont_hours_d || "9:00 - 18:00";

  return (
    <main className="min-h-screen text-left">
      <Navbar />

      <section className="pt-32 pb-20 bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <EditableContent page="contacto" section="cont_t1" initialContent={title1} isAdmin={isAdmin}>
                <span>{title1}</span>
              </EditableContent>
              <EditableContent page="contacto" section="cont_t2" initialContent={title2} isAdmin={isAdmin}>
                <span className="text-blue-600">{title2}</span>
              </EditableContent>
            </h2>
            <div className="text-xl text-gray-600 max-w-3xl mx-auto">
              <EditableContent page="contacto" section="cont_sub" initialContent={subtitle} isAdmin={isAdmin} multiline={true}>
                <p>{subtitle}</p>
              </EditableContent>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <EditableContent page="contacto" section="cont_q_t" initialContent={qTitle} isAdmin={isAdmin}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{qTitle}</h3>
                </EditableContent>
                <EditableContent page="contacto" section="cont_q_d" initialContent={qDesc} isAdmin={isAdmin} multiline={true}>
                  <p className="text-gray-600 mb-6">{qDesc}</p>
                </EditableContent>
              </div>

              {/* Contact Details Editables */}
              <div className="space-y-4">
                <EditableContent page="contacto" section="cont_mail" initialContent={contactEmail} isAdmin={isAdmin}>
                  <ContactDetail
                    icon={<Mail className="w-6 h-6" />}
                    title="Email"
                    value={contactEmail}
                    href={`mailto:${contactEmail}`}
                  />
                </EditableContent>

                <EditableContent page="contacto" section="cont_tel" initialContent={contactPhone} isAdmin={isAdmin}>
                  <ContactDetail
                    icon={<Phone className="w-6 h-6" />}
                    title="Teléfono"
                    value={contactPhone}
                    href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                  />
                </EditableContent>

                <EditableContent page="contacto" section="cont_addr" initialContent={contactAddr} isAdmin={isAdmin} multiline={true}>
                  <ContactDetail
                    icon={<MapPin className="w-6 h-6" />}
                    title="Dirección"
                    value={contactAddr}
                  />
                </EditableContent>
              </div>

              {/* Business Hours Editable */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-2xl">
                <EditableContent page="contacto" section="cont_hours_t" initialContent={hoursTitle} isAdmin={isAdmin}>
                  <h4 className="text-xl font-bold mb-4">{hoursTitle}</h4>
                </EditableContent>
                <div className="space-y-2 text-blue-100">
                  <EditableContent page="contacto" section="cont_hours_d" initialContent={hoursDetail} isAdmin={isAdmin}>
                    <p><strong className="text-white">Lunes - Viernes:</strong> {hoursDetail}</p>
                  </EditableContent>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 h-fit">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function ContactDetail({
  icon,
  title,
  value,
  href
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-soft hover:shadow-soft-hover transition-all w-full border border-gray-50">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
        <div className="text-gray-900 font-medium break-words">{value}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block group">
        {content}
      </a>
    );
  }

  return content;
}