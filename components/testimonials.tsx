import Image from 'next/image';
import { Quote, Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Carlos Martínez',
      position: 'Director',
      company: 'Reformas Martínez & Hijos',
      text: 'Desde que trabajamos con SIi Goo Consultores, tenemos un control total sobre la rentabilidad de cada reforma. Su análisis por expediente nos ha permitido optimizar costes y mejorar nuestros márgenes significativamente.',
      rating: 5
    },
    {
      name: 'Ana García',
      position: 'Gerente',
      company: 'Construcciones García',
      text: 'El servicio de contabilidad analítica es excepcional. Ahora sabemos exactamente qué proyectos son más rentables y podemos tomar decisiones con datos reales. El equipo es profesional y siempre disponible.',
      rating: 5
    },
    {
      name: 'Miguel Rodríguez',
      position: 'CEO',
      company: 'RenovaHogar',
      text: 'Llevamos 3 años con ellos y no podríamos estar más satisfechos. La atención personalizada y su conocimiento del sector de reformas marca la diferencia. Son verdaderos partners estratégicos.',
      rating: 5
    },
    {
      name: 'Laura Sánchez',
      position: 'Propietaria',
      company: 'Reformas Integrales LS',
      text: 'Los informes mensuales que recibimos son clarísimos y nos ayudan a planificar mejor. Hemos detectado varias áreas de mejora gracias a su análisis detallado. Totalmente recomendables.',
      rating: 5
    }
  ];

  return (
    <section id="testimonios" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Lo que dicen <span className="text-blue-600">nuestros clientes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La confianza de nuestros clientes es nuestro mayor reconocimiento
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials?.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-blue-100">
                <Quote className="w-12 h-12" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...(Array(testimonial?.rating ?? 0) ?? [])]?.map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10">
                &ldquo;{testimonial?.text}&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center space-x-4 border-t border-gray-200 pt-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial?.name?.charAt(0) ?? 'U'}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial?.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial?.position} • {testimonial?.company}
                  </div>
                </div>
              </div>
            </div>
          )) ?? []}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-3xl"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">15+</div>
                  <div className="text-sm text-gray-600">Años de experiencia</div>
                </div>
                <div className="w-px h-16 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">100+</div>
                  <div className="text-sm text-gray-600">Empresas asesoradas</div>
                </div>
                <div className="w-px h-16 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">98%</div>
                  <div className="text-sm text-gray-600">Clientes satisfechos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
