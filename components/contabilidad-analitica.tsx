import Image from 'next/image';
import { PieChart, BarChart3, FileSpreadsheet, Target, Clock, TrendingUp } from 'lucide-react';
import EditableContent from '@/components/editable-content';
import EditableImage from '@/components/editable-image';

interface ContabilidadProps {
  isAdmin?: boolean;
  dbContent?: Record<string, string>;
}

export default function ContabilidadAnalitica({ isAdmin = false, dbContent = {} }: ContabilidadProps) {
  
  // Textos de cabecera
  const badgeText = dbContent.cont_badge || "Producto Estrella";
  const title1 = dbContent.cont_title_1 || "Contabilidad ";
  const title2 = dbContent.cont_title_2 || "Analítica";
  const subtitle = dbContent.cont_subtitle || "La herramienta que transforma datos en decisiones inteligentes para maximizar la rentabilidad de su negocio";

  // Imagen y Contenido Principal
  const mainImg = dbContent.cont_main_img || "https://cdn.abacus.ai/images/70617915-021e-43a1-ae1a-69d879db7216.png";
  const mainTitle = dbContent.cont_main_t || "Conozca la verdadera rentabilidad de cada proyecto";
  const p1 = dbContent.cont_p1 || "Nuestro servicio de contabilidad analítica va más allá de la contabilidad tradicional. Le proporcionamos un análisis exhaustivo que desglosa ingresos y costes por proyecto, centro de coste o línea de negocio.";
  const p2 = dbContent.cont_p2 || "Con esta información, podrá identificar qué áreas de su empresa son más rentables, dónde se pueden optimizar recursos y cómo mejorar sus márgenes de beneficio.";

  // Beneficios (Sistema de comas)
  const benefitsRaw = dbContent.cont_benefits_list || "Visibilidad total de la rentabilidad de cada proyecto, Detección temprana de desviaciones presupuestarias, Optimización de recursos y reducción de costes, Mejora en la planificación de futuros proyectos";
  const benefitsArray = benefitsRaw.split(',').map(b => b.trim()).filter(b => b !== "");

  // Características (Features)
  const features = [
    { id: 1, icon: <PieChart className="w-6 h-6" />, t: dbContent.cont_feat_1_t || 'Análisis por Proyecto', d: dbContent.cont_feat_1_d || 'Desglose detallado de ingresos y costes por cada expediente o proyecto' },
    { id: 2, icon: <BarChart3 className="w-6 h-6" />, t: dbContent.cont_feat_2_t || 'Rentabilidad Real', d: dbContent.cont_feat_2_d || 'Identifique qué proyectos generan más beneficios y cuáles necesitan optimización' },
    { id: 3, icon: <FileSpreadsheet className="w-6 h-6" />, t: dbContent.cont_feat_3_t || 'Informes Personalizados', d: dbContent.cont_feat_3_d || 'Reportes adaptados a sus necesidades con la información que realmente importa' },
    { id: 4, icon: <Target className="w-6 h-6" />, t: dbContent.cont_feat_4_t || 'Control de Costes', d: dbContent.cont_feat_4_d || 'Seguimiento en tiempo real de gastos por centro de coste o departamento' },
    { id: 5, icon: <Clock className="w-6 h-6" />, t: dbContent.cont_feat_5_t || 'Datos en Tiempo Real', d: dbContent.cont_feat_5_d || 'Acceso actualizado a la información financiera de sus proyectos' },
    { id: 6, icon: <TrendingUp className="w-6 h-6" />, t: dbContent.cont_feat_6_t || 'Toma de Decisiones', d: dbContent.cont_feat_6_d || 'Base sólida de datos para decisiones estratégicas fundamentadas' }
  ];

  // CTA
  const ctaTitle = dbContent.cont_cta_t || "¿Listo para conocer la rentabilidad real de su negocio?";
  const ctaDesc = dbContent.cont_cta_d || "Solicite una consulta gratuita y descubra cómo la contabilidad analítica puede transformar su gestión empresarial";

  return (
    <section id="contabilidad-analitica" className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 text-left">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <EditableContent page="contabilidad" section="cont_badge" initialContent={badgeText} isAdmin={isAdmin}>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <CalculatorIcon className="w-4 h-4" />
              <span>{badgeText}</span>
            </div>
          </EditableContent>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <EditableContent page="contabilidad" section="cont_title_1" initialContent={title1} isAdmin={isAdmin}>
              <span>{title1}</span>
            </EditableContent>
            <EditableContent page="contabilidad" section="cont_title_2" initialContent={title2} isAdmin={isAdmin}>
              <span className="text-blue-600">{title2}</span>
            </EditableContent>
          </h2>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto">
            <EditableContent page="contabilidad" section="cont_subtitle" initialContent={subtitle} isAdmin={isAdmin} multiline={true}>
              <p>{subtitle}</p>
            </EditableContent>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Editable */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">
            <EditableImage 
              page="contabilidad"
              section="cont_main_img"
              initialContent={mainImg}
              isAdmin={isAdmin}
              alt="Dashboard de contabilidad analítica"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <EditableContent page="contabilidad" section="cont_main_t" initialContent={mainTitle} isAdmin={isAdmin} multiline={true}>
              <h3 className="text-3xl font-bold text-gray-900">{mainTitle}</h3>
            </EditableContent>
            <EditableContent page="contabilidad" section="cont_p1" initialContent={p1} isAdmin={isAdmin} multiline={true}>
              <p className="text-lg text-gray-700 leading-relaxed">{p1}</p>
            </EditableContent>
            <EditableContent page="contabilidad" section="cont_p2" initialContent={p2} isAdmin={isAdmin} multiline={true}>
              <p className="text-lg text-gray-700 leading-relaxed">{p2}</p>
            </EditableContent>

           {/* Key Benefits List */}
<div className="bg-white rounded-xl p-6 shadow-soft border border-blue-50">
  
  {/* 👇 AHORA EDITABLE 👇 */}
  <div className="mb-4 text-center">
    <EditableContent 
      page="contabilidad" 
      section="cont_benefits_title" 
      initialContent={dbContent.cont_benefits_title || "Beneficios Clave"} 
      isAdmin={isAdmin}
    >
      <h4 className="text-xl font-bold text-gray-900">{dbContent.cont_benefits_title || "Beneficios Clave"}</h4>
    </EditableContent>
  </div>

  <EditableContent page="contabilidad" section="cont_benefits_list" initialContent={benefitsRaw} isAdmin={isAdmin} multiline={true}>
    <div className="grid sm:grid-cols-2 gap-3">
      {benefitsArray.map((benefit, index) => (
        <div key={index} className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm text-gray-700">{benefit}</span>
        </div>
      ))}
    </div>
  </EditableContent>
</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <EditableContent page="contabilidad" section={`cont_feat_${feature.id}_t`} initialContent={feature.t} isAdmin={isAdmin}>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.t}</h4>
              </EditableContent>
              <EditableContent page="contabilidad" section={`cont_feat_${feature.id}_d`} initialContent={feature.d} isAdmin={isAdmin} multiline={true}>
                <p className="text-gray-600 text-sm">{feature.d}</p>
              </EditableContent>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl">
            <EditableContent page="contabilidad" section="cont_cta_t" initialContent={ctaTitle} isAdmin={isAdmin} multiline={true}>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{ctaTitle}</h3>
            </EditableContent>
            <EditableContent page="contabilidad" section="cont_cta_d" initialContent={ctaDesc} isAdmin={isAdmin} multiline={true}>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">{ctaDesc}</p>
            </EditableContent>
            <a href="/contacto" className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Solicitar Consulta Gratuita
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Icono local para evitar conflictos
function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}