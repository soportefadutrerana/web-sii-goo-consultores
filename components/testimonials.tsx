import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import EditableContent from '@/components/editable-content';

// 👇 Definimos las propiedades para que page.tsx no de error
interface TestimonialsProps {
  isAdmin?: boolean;
  dbContent?: Record<string, string>;
}

export default function Testimonials({ isAdmin = false, dbContent = {} }: TestimonialsProps) {
  
  // Textos de cabecera
  const title1 = dbContent.test_title_1 || "Lo que dicen ";
  const title2 = dbContent.test_title_2 || "nuestros clientes";
  const subtitle = dbContent.test_subtitle || "La confianza de nuestros clientes es nuestro mayor reconocimiento";

  // Preparamos los testimonios (los hacemos dinámicos)
  const testimonials = [
    {
      id: 1,
      name: dbContent.test_1_name || 'Carlos Martínez',
      position: dbContent.test_1_pos || 'Director',
      company: dbContent.test_1_comp || 'Reformas Martínez & Hijos',
      text: dbContent.test_1_text || 'Desde que trabajamos con SIi Goo Consultores, tenemos un control total sobre la rentabilidad de cada reforma. Su análisis por expediente nos ha permitido optimizar costes y mejorar nuestros márgenes significativamente.',
      rating: 5
    },
    {
      id: 2,
      name: dbContent.test_2_name || 'Ana García',
      position: dbContent.test_2_pos || 'Gerente',
      company: dbContent.test_2_comp || 'Construcciones García',
      text: dbContent.test_2_text || 'El servicio de contabilidad analítica es excepcional. Ahora sabemos exactamente qué proyectos son más rentables y podemos tomar decisiones con datos reales. El equipo es profesional y siempre disponible.',
      rating: 5
    },
    {
      id: 3,
      name: dbContent.test_3_name || 'Miguel Rodríguez',
      position: dbContent.test_3_pos || 'CEO',
      company: dbContent.test_3_comp || 'RenovaHogar',
      text: dbContent.test_3_text || 'Llevamos 3 años con ellos y no podríamos estar más satisfechos. La atención personalizada y su conocimiento del sector de reformas marca la diferencia. Son verdaderos partners estratégicos.',
      rating: 5
    },
    {
      id: 4,
      name: dbContent.test_4_name || 'Laura Sánchez',
      position: dbContent.test_4_pos || 'Propietaria',
      company: dbContent.test_4_comp || 'Reformas Integrales LS',
      text: dbContent.test_4_text || 'Los informes mensuales que recibimos son clarísimos y nos ayudan a planificar mejor. Hemos detectado varias áreas de mejora gracias a su análisis detallado. Totalmente recomendables.',
      rating: 5
    }
  ];

  // Números del Trust Badge
  const stat1_val = dbContent.test_stat1_val || "15+";
  const stat1_label = dbContent.test_stat1_label || "Años de experiencia";
  const stat2_val = dbContent.test_stat2_val || "100+";
  const stat2_label = dbContent.test_stat2_label || "Empresas asesoradas";
  const stat3_val = dbContent.test_stat3_val || "98%";
  const stat3_label = dbContent.test_stat3_label || "Clientes satisfechos";

  return (
    <section id="testimonios" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <EditableContent page="inicio" section="test_title_1" initialContent={title1} isAdmin={isAdmin}>
                <span>{title1}</span>
            </EditableContent>
            <EditableContent page="inicio" section="test_title_2" initialContent={title2} isAdmin={isAdmin}>
                <span className="text-blue-600">{title2}</span>
            </EditableContent>
          </h2>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto">
            <EditableContent page="inicio" section="test_subtitle" initialContent={subtitle} isAdmin={isAdmin} multiline={true}>
                <p>{subtitle}</p>
            </EditableContent>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-blue-100">
                <Quote className="w-12 h-12" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text Editable */}
              <div className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10">
                <EditableContent page="inicio" section={`test_${testimonial.id}_text`} initialContent={testimonial.text} isAdmin={isAdmin} multiline={true}>
                    <p>&ldquo;{testimonial.text}&rdquo;</p>
                </EditableContent>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-4 border-t border-gray-200 pt-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <EditableContent page="inicio" section={`test_${testimonial.id}_name`} initialContent={testimonial.name} isAdmin={isAdmin}>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                  </EditableContent>
                  <div className="text-sm text-gray-600">
                    <EditableContent page="inicio" section={`test_${testimonial.id}_pos`} initialContent={testimonial.position} isAdmin={isAdmin}>
                        <span>{testimonial.position}</span>
                    </EditableContent>
                    {" • "}
                    <EditableContent page="inicio" section={`test_${testimonial.id}_comp`} initialContent={testimonial.company} isAdmin={isAdmin}>
                        <span>{testimonial.company}</span>
                    </EditableContent>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge Editable */}
        <div className="mt-16 text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-3xl"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-8 sm:space-y-0 sm:space-x-8">
                
                <div className="text-center">
                  <EditableContent page="inicio" section="test_stat1_val" initialContent={stat1_val} isAdmin={isAdmin}>
                    <div className="text-4xl font-bold text-blue-600 mb-1">{stat1_val}</div>
                  </EditableContent>
                  <EditableContent page="inicio" section="test_stat1_label" initialContent={stat1_label} isAdmin={isAdmin}>
                    <div className="text-sm text-gray-600">{stat1_label}</div>
                  </EditableContent>
                </div>

                <div className="hidden sm:block w-px h-16 bg-gray-300"></div>
                
                <div className="text-center">
                  <EditableContent page="inicio" section="test_stat2_val" initialContent={stat2_val} isAdmin={isAdmin}>
                    <div className="text-4xl font-bold text-blue-600 mb-1">{stat2_val}</div>
                  </EditableContent>
                  <EditableContent page="inicio" section="test_stat2_label" initialContent={stat2_label} isAdmin={isAdmin}>
                    <div className="text-sm text-gray-600">{stat2_label}</div>
                  </EditableContent>
                </div>

                <div className="hidden sm:block w-px h-16 bg-gray-300"></div>
                
                <div className="text-center">
                  <EditableContent page="inicio" section="test_stat3_val" initialContent={stat3_val} isAdmin={isAdmin}>
                    <div className="text-4xl font-bold text-blue-600 mb-1">{stat3_val}</div>
                  </EditableContent>
                  <EditableContent page="inicio" section="test_stat3_label" initialContent={stat3_label} isAdmin={isAdmin}>
                    <div className="text-sm text-gray-600">{stat3_label}</div>
                  </EditableContent>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}