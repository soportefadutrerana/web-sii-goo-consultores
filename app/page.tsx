// app/page.tsx
import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import About from '@/components/about';
import Testimonials from '@/components/testimonials';
import Link from 'next/link';
import { Calculator, FileText, Building2, ArrowRight } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react'; 
import EditableContent from '@/components/editable-content';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';
import VisibilityControl from '@/components/VisibilityControl';
import { Star } from 'lucide-react';
export default async function Home() {

  // --- LÓGICA DEL CMS ---
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'admin';

  let dbContent: Record<string, string> = {};
  
  try {
    const rawContent = await prisma.siteContent.findMany({
      where: { page: 'inicio' }
    });

    dbContent = rawContent.reduce((acc: any, item: { section: string; content: string }) => {
      acc[item.section] = item.content;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error cargando contenido del CMS:", error);
  }

  // --- PREPARAMOS LOS TEXTOS DE LA SECCIÓN DE SERVICIOS ---
  const sectionTitle1 = dbContent.services_title_1 || "Descubra nuestras ";
  const sectionTitle2 = dbContent.services_title_2 || "Soluciones";
  const sectionSubtitle = dbContent.services_subtitle || "Explore nuestros servicios especializados y encuentre la solución perfecta para su empresa";

  const services = [
    {
      id: 1,
      icon: <Calculator className="w-10 h-10" />,
      title: dbContent.service_1_title || 'Contabilidad Analítica',
      description: dbContent.service_1_desc || 'Análisis detallado de rentabilidad por proyecto y centro de coste',
      link: '/contabilidad-analitica',
      featured: true
    }, 
    {
      id: 2,
      icon: <FileText className="w-10 h-10" />,
      title: dbContent.service_2_title || 'Servicios de Gestoría',
      description: dbContent.service_2_desc || 'Asesoría fiscal, laboral, contable y gestión administrativa integral',
      link: '/servicios',
      featured: false
    },
    {
      id: 3,
      icon: <Building2 className="w-10 h-10" />,
      title: dbContent.service_3_title || 'Empresas de Reformas',
      description: dbContent.service_3_desc || 'Especialización en el sector de reformas con análisis por expediente',
      link: '/reformas',
      featured: false
    }
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="relative">
        <Hero isAdmin={isAdmin} dbContent={dbContent} />
        <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 md:h-2 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-10"></div>
      </div>

      <About isAdmin={isAdmin} dbContent={dbContent} />

      {/* SECCIÓN DE SERVICIOS EDITABLE */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Cabecera de la sección */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <EditableContent page="inicio" section="services_title_1" initialContent={sectionTitle1} isAdmin={isAdmin}>
                <span>{sectionTitle1}</span>
              </EditableContent>
              <EditableContent page="inicio" section="services_title_2" initialContent={sectionTitle2} isAdmin={isAdmin}>
                <span className="text-blue-600">{sectionTitle2}</span>
              </EditableContent>
            </h2>
            <div className="text-xl text-gray-600 max-w-3xl mx-auto">
              <EditableContent page="inicio" section="services_subtitle" initialContent={sectionSubtitle} isAdmin={isAdmin} multiline={true}>
                <p>{sectionSubtitle}</p>
              </EditableContent>
            </div>
          </div>

          {/* Tarjetas de Servicios */}
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full ${
                  service.featured
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl'
                    : 'bg-gray-50 hover:bg-white shadow-soft hover:shadow-soft-hover'
                }`}
              >
            
            
                {service.featured && (
  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#D4AF37] via-[#FFFACD] to-[#F9E076] text-[#403400] text-[11px] font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10 border-2 border-white">
    <Star className="w-3 h-3 fill-[#403400]" />
    <span className="tracking-wide">DESTACADO</span>
  </div>
)}

                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                    service.featured
                      ? 'bg-white/20 text-white'
                      : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600'
                  }`}
                >
                  {service.icon}
                </div>

                {/* Título de la tarjeta editable */}
                <EditableContent page="inicio" section={`service_${service.id}_title`} initialContent={service.title} isAdmin={isAdmin}>
                  <h3 className={`text-2xl font-bold mb-3 ${service.featured ? 'text-white' : 'text-gray-900'}`}>
                    {service.title}
                  </h3>
                </EditableContent>
                
                {/* Descripción de la tarjeta editable */}
                <div className="flex-grow">
                  <EditableContent page="inicio" section={`service_${service.id}_desc`} initialContent={service.description} isAdmin={isAdmin} multiline={true}>
                    <p className={`mb-6 ${service.featured ? 'text-blue-100' : 'text-gray-600'}`}>
                      {service.description}
                    </p>
                  </EditableContent>
                </div>

                {/* Botón de enlace */}
                <Link href={service.link} className={`flex items-center space-x-2 font-medium mt-auto pt-4 ${
                  service.featured ? 'text-white hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
                }`}>
                  <span>Más información</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN TESTIMONIOS --- */}
{(dbContent.test_section_status !== 'hidden' || isAdmin) && (
  <div className="relative mt-12">
    
    {/* El nuevo botón de control para el Admin */}
    <VisibilityControl 
      page="inicio" 
      section="test_section" 
      isVisible={dbContent.test_section_status !== 'hidden'} 
      isAdmin={isAdmin} 
    />

    <div className={dbContent.test_section_status === 'hidden' && isAdmin ? 'opacity-40 grayscale' : ''}>
      <Testimonials isAdmin={isAdmin} dbContent={dbContent} />
    </div>
  </div>
)}
    </main>
  );
}