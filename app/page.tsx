import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import About from '@/components/about';
import Testimonials from '@/components/testimonials';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Calculator, FileText, Building2, ArrowRight } from 'lucide-react';

export default function Home() {
  const services = [
    {
      icon: <Calculator className="w-10 h-10" />,
      title: 'Contabilidad Analítica',
      description: 'Análisis detallado de rentabilidad por proyecto y centro de coste',
      link: '/contabilidad-analitica',
      featured: true
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: 'Servicios de Gestoría',
      description: 'Asesoría fiscal, laboral, contable y gestión administrativa integral',
      link: '/servicios',
      featured: false
    },
    {
      icon: <Building2 className="w-10 h-10" />,
      title: 'Empresas de Reformas',
      description: 'Especialización en el sector de reformas con análisis por expediente',
      link: '/reformas',
      featured: false
    }
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />

      {/* Services Overview with Links */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Descubra nuestras <span className="text-blue-600">Soluciones</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore nuestros servicios especializados y encuentre la solución perfecta para su empresa
            </p>
          </div>

          {/* Services Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.link}
                className={`group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                  service.featured
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl'
                    : 'bg-gray-50 hover:bg-white shadow-soft hover:shadow-soft-hover'
                }`}
              >
                {service.featured && (
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    ⭐ Destacado
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                    service.featured
                      ? 'bg-white/20 text-white'
                      : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600'
                  }`}
                >
                  {service.icon}
                </div>

                {/* Title & Description */}
                <h3
                  className={`text-2xl font-bold mb-3 ${
                    service.featured ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {service.title}
                </h3>
                <p
                  className={`mb-6 ${
                    service.featured ? 'text-blue-100' : 'text-gray-600'
                  }`}
                >
                  {service.description}
                </p>

                {/* CTA */}
                <div className={`flex items-center space-x-2 font-medium ${
                  service.featured ? 'text-white' : 'text-blue-600'
                }`}>
                  <span>Más información</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <Footer />
    </main>
  );
}
