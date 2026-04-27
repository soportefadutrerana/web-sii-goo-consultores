import Image from 'next/image';
import { Building2, ClipboardCheck, PieChart, FileText, TrendingUp, CheckCircle2 } from 'lucide-react';
import EditableContent from '@/components/editable-content';
import EditableImage from '@/components/editable-image';

interface ReformasProps {
  isAdmin?: boolean;
  dbContent?: Record<string, string>;
}

export default function EspecializationReformas({ isAdmin = false, dbContent = {} }: ReformasProps) {
  
  // Textos de cabecera
  const badgeText = dbContent.ref_badge || "Sector Especializado";
  const title1 = dbContent.ref_title_1 || "Empresas de ";
  const title2 = dbContent.ref_title_2 || "Reformas";
  const subtitle = dbContent.ref_subtitle || "Soluciones especializadas para el sector de reformas y construcción con análisis por expediente";

  // Contenido Principal
  const mainTitle = dbContent.ref_main_t || "Gestión especializada para empresas de reformas y construcción";
  const p1 = dbContent.ref_p1 || "Entendemos los desafíos únicos del sector de reformas: múltiples proyectos simultáneos, costes variables, gestión de subcontratistas y la necesidad de mantener márgenes rentables en cada obra.";
  const p2 = dbContent.ref_p2 || "Nuestro servicio de contabilidad analítica por expediente le permite conocer la rentabilidad exacta de cada reforma, identificar desviaciones a tiempo y tomar decisiones informadas.";
  const mainImg = dbContent.ref_main_img || "https://cdn.abacus.ai/images/febf887f-d93c-41d6-a9cf-104bfe71c077.png";

  // Tarjetas de servicios internos (usando el sistema de IDs para que sean editables)
  const services = [
    {
      id: 1,
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: dbContent.ref_serv_1_t || 'Gestión de Proyectos',
      desc: dbContent.ref_serv_1_d || 'Seguimiento completo de cada obra desde el presupuesto hasta la finalización'
    },
    {
      id: 2,
      icon: <PieChart className="w-8 h-8" />,
      title: dbContent.ref_serv_2_t || 'Análisis por Expediente',
      desc: dbContent.ref_serv_2_d || 'Rentabilidad detallada de cada proyecto de reforma para optimizar recursos'
    },
    {
      id: 3,
      icon: <FileText className="w-8 h-8" />,
      title: dbContent.ref_serv_3_t || 'Control de Costes',
      desc: dbContent.ref_serv_3_d || 'Monitorización de gastos en tiempo real para evitar desviaciones presupuestarias'
    },
    {
      id: 4,
      icon: <TrendingUp className="w-8 h-8" />,
      title: dbContent.ref_serv_4_t || 'Informes de Rentabilidad',
      desc: dbContent.ref_serv_4_d || 'Análisis comparativo entre proyectos para identificar áreas de mejora'
    }
  ];

  // Beneficios (Sistema de comas)
  const benefitsRaw = dbContent.ref_benefits_list || 'Control total sobre márgenes de cada reforma, Detección temprana de sobrecostes, Optimización de precios en futuros proyectos, Gestión eficiente de múltiples obras simultáneas, Informes claros para toma de decisiones, Mejora continua de rentabilidad';
  const benefitsArray = benefitsRaw.split(',').map(b => b.trim()).filter(b => b !== "");

  const benefitsTitle = dbContent.ref_ben_title || "¿Por qué las empresas de reformas nos eligen?";
  const benefitsDesc = dbContent.ref_ben_desc || "Porque entendemos su negocio y proporcionamos la información que necesita para crecer de forma rentable y sostenible.";

  return (
    <section id="reformas" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 text-left">
          <EditableContent page="reformas" section="ref_badge" initialContent={badgeText} isAdmin={isAdmin}>
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <Building2 className="w-4 h-4" />
              <span>{badgeText}</span>
            </div>
          </EditableContent>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <EditableContent page="reformas" section="ref_title_1" initialContent={title1} isAdmin={isAdmin}>
              <span>{title1}</span>
            </EditableContent>
            <EditableContent page="reformas" section="ref_title_2" initialContent={title2} isAdmin={isAdmin}>
              <span className="text-blue-600">{title2}</span>
            </EditableContent>
          </h2>
          
          <div className="text-xl text-gray-600 max-w-3xl mx-auto">
            <EditableContent page="reformas" section="ref_subtitle" initialContent={subtitle} isAdmin={isAdmin} multiline={true}>
              <p>{subtitle}</p>
            </EditableContent>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <EditableContent page="reformas" section="ref_main_t" initialContent={mainTitle} isAdmin={isAdmin} multiline={true}>
              <h3 className="text-3xl font-bold text-gray-900">{mainTitle}</h3>
            </EditableContent>
            
            <EditableContent page="reformas" section="ref_p1" initialContent={p1} isAdmin={isAdmin} multiline={true}>
              <p className="text-lg text-gray-700 leading-relaxed">{p1}</p>
            </EditableContent>
            
            <EditableContent page="reformas" section="ref_p2" initialContent={p2} isAdmin={isAdmin} multiline={true}>
              <p className="text-lg text-gray-700 leading-relaxed">{p2}</p>
            </EditableContent>

            {/* Sub-Servicios */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {services.map((service) => (
                <div key={service.id} className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200 shadow-sm">
                  <div className="text-blue-600 mb-3">{service.icon}</div>
                  <EditableContent page="reformas" section={`ref_serv_${service.id}_t`} initialContent={service.title} isAdmin={isAdmin}>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">{service.title}</h4>
                  </EditableContent>
                  <EditableContent page="reformas" section={`ref_serv_${service.id}_d`} initialContent={service.desc} isAdmin={isAdmin} multiline={true}>
                    <p className="text-gray-600 text-xs leading-relaxed">{service.desc}</p>
                  </EditableContent>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen Editable */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl min-h-[350px]">
            <EditableImage 
              page="reformas"
              section="ref_main_img"
              initialContent={mainImg}
              isAdmin={isAdmin}
              alt="Proyecto de reforma profesional"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-blue-950 to-blue-700 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <EditableContent page="reformas" section="ref_ben_title" initialContent={benefitsTitle} isAdmin={isAdmin} multiline={true}>
                <h3 className="text-3xl font-bold text-white mb-4 text-center md:text-left">{benefitsTitle}</h3>
              </EditableContent>
              <EditableContent page="reformas" section="ref_ben_desc" initialContent={benefitsDesc} isAdmin={isAdmin} multiline={true}>
                <p className="text-gray-300 text-lg mb-6 text-center md:text-left">{benefitsDesc}</p>
              </EditableContent>
            </div>

            <div className="space-y-3">
              <EditableContent page="reformas" section="ref_benefits_list" initialContent={benefitsRaw} isAdmin={isAdmin} multiline={true}>
                <div className="space-y-3">
                  {benefitsArray.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/5">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </EditableContent>
              {isAdmin && <p className="text-[10px] text-blue-200 mt-2 italic opacity-70">Separa cada beneficio con una coma (,)</p>}
            </div>
          </div>

          <div className="mt-8 text-center">
            <a href="/contacto" className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              Solicitar Análisis de su Empresa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}