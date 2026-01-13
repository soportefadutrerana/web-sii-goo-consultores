import Navbar from '@/components/navbar';
import ContactForm from '@/components/contact-form';
import Footer from '@/components/footer';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactoPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Contact Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Solicite su <span className="text-blue-600">Consulta Gratuita</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra cómo podemos ayudar a optimizar la gestión y rentabilidad de su empresa
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¿Tiene preguntas?
                </h3>
                <p className="text-gray-600 mb-6">
                  Estamos aquí para ayudarle. Contáctenos y descubra cómo nuestros servicios pueden transformar la gestión de su empresa.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <ContactDetail
                  icon={<Mail className="w-6 h-6" />}
                  title="Email"
                  value="info@siigooconsultores.com"
                  href="mailto:info@siigooconsultores.com"
                />
                <ContactDetail
                  icon={<Phone className="w-6 h-6" />}
                  title="Teléfono"
                  value="+34 955 387 218"
                  href="tel:+34955387218"
                />
                <ContactDetail
                  icon={<MapPin className="w-6 h-6" />}
                  title="Dirección"
                  value="Callejón de Capachuelos 73, local 6, 41710, Utrera, Sevilla"
                />
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-2xl">
                <h4 className="text-xl font-bold mb-4">Horario de Atención</h4>
                <div className="space-y-2 text-blue-100">
                  <p><strong className="text-white">Lunes - Viernes:</strong> 9:00 - 18:00</p>
                  <p><strong className="text-white">Sábados:</strong> 10:00 - 14:00</p>
                  <p><strong className="text-white">Domingos:</strong> Cerrado</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
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
    <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-soft hover:shadow-soft-hover transition-all">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
        <div className="text-gray-900 font-medium">{value}</div>
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
