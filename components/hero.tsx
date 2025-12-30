import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="https://cdn.abacus.ai/images/af2bed7f-8ed6-4cb5-a131-8b0c0cfdca22.png"
            alt="Oficina profesional SIi Goo Consultores"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/90 to-blue-700/85"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>Especialistas en Contabilidad Analítica</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Gestoría Profesional con
            <br />
            <span className="text-blue-300">Contabilidad Analítica</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Optimizamos la gestión de su empresa con análisis detallado de proyectos y servicios integrales de asesoría fiscal, laboral y contable
          </p>

          {/* Key Points */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white">
            {[
              'Análisis de rentabilidad por proyecto',
              'Control de costes en tiempo real',
              'Informes personalizados'
            ].map((point, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <span className="text-sm md:text-base font-medium">{point}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="#contacto"
              className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Solicitar Consulta</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#servicios"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
            >
              Nuestros Servicios
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
