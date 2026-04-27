import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import EditableContent from '@/components/editable-content';
import EditableImage from '@/components/editable-image';

interface HeroProps {
  isAdmin?: boolean;
  dbContent?: Record<string, string>;
}

export default function Hero({ isAdmin = false, dbContent = {} }: HeroProps) {
  
  // Textos Generales
  const badgeText = dbContent.hero_badge || "Especialistas en Contabilidad Analítica";
  const title1 = dbContent.hero_title_1 || "Gestoría Profesional con";
  const title2 = dbContent.hero_title_2 || "Contabilidad Analítica";
  const subtitle = dbContent.hero_subtitle || "Optimizamos la gestión de su empresa con análisis detallado de proyectos y servicios integrales de asesoría fiscal, laboral y contable";
  
  // 👇 1. Añadimos las variables para los 3 puntos con el TIC 👇
  const point1 = dbContent.hero_point_1 || "Análisis de rentabilidad por proyecto";
  const point2 = dbContent.hero_point_2 || "Control de costes en tiempo real";
  const point3 = dbContent.hero_point_3 || "Informes personalizados";

  // Imagen de fondo
  const heroImage = dbContent.hero_bg_image || "https://cdn.abacus.ai/images/af2bed7f-8ed6-4cb5-a131-8b0c0cfdca22.png";

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          
          <EditableImage 
            page="inicio"
            section="hero_bg_image"
            initialContent={heroImage}
            isAdmin={isAdmin}
            alt="Oficina profesional SIi Goo Consultores"
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/90 to-blue-700/85 pointer-events-none"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <EditableContent page="inicio" section="hero_badge" initialContent={badgeText} isAdmin={isAdmin}>
              <span>{badgeText}</span>
            </EditableContent>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            <EditableContent page="inicio" section="hero_title_1" initialContent={title1} isAdmin={isAdmin}>
              {title1}
            </EditableContent>
            <br />
            <EditableContent page="inicio" section="hero_title_2" initialContent={title2} isAdmin={isAdmin}>
              <span className="text-blue-300">{title2}</span>
            </EditableContent>
          </h1>

          {/* Subtitle */}
          <div className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            <EditableContent page="inicio" section="hero_subtitle" initialContent={subtitle} isAdmin={isAdmin} multiline={true}>
              <p>{subtitle}</p>
            </EditableContent>
          </div>

          {/* 👇 2. AQUÍ ESTÁ EL CAMBIO PARA LOS 3 PUNTOS 👇 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white">
            
            {/* Punto 1 */}
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-300 flex-shrink-0" />
              <EditableContent page="inicio" section="hero_point_1" initialContent={point1} isAdmin={isAdmin}>
                <span className="text-sm md:text-base font-medium">{point1}</span>
              </EditableContent>
            </div>

            {/* Punto 2 */}
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-300 flex-shrink-0" />
              <EditableContent page="inicio" section="hero_point_2" initialContent={point2} isAdmin={isAdmin}>
                <span className="text-sm md:text-base font-medium">{point2}</span>
              </EditableContent>
            </div>

            {/* Punto 3 */}
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-300 flex-shrink-0" />
              <EditableContent page="inicio" section="hero_point_3" initialContent={point3} isAdmin={isAdmin}>
                <span className="text-sm md:text-base font-medium">{point3}</span>
              </EditableContent>
            </div>

          </div>
          {/* 👆 FIN DEL CAMBIO DE LOS 3 PUNTOS 👆 */}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contacto"
              className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Solicitar Consulta</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/servicios"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
            >
              Nuestros Servicios
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </section>
  );
}