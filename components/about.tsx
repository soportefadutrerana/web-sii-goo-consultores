import Image from 'next/image';
import { Target, Users, Award, TrendingUp } from 'lucide-react';
import EditableContent from '@/components/editable-content';
import EditableImage from '@/components/editable-image';

interface AboutProps {
  isAdmin?: boolean;
  dbContent?: Record<string, string>;
}

export default function About({ isAdmin = false, dbContent = {} }: AboutProps) {
  
  // Textos de la cabecera
  const title1 = dbContent.about_title_1 || "Sobre ";
  const title2 = dbContent.about_title_2 || "Nosotros";
  const subtitle = dbContent.about_subtitle || "Somos su aliado estratégico en la gestión empresarial con enfoque en análisis y resultados";

  // Textos del contenido principal
  const mainTitle = dbContent.about_main_title || "Profesionales comprometidos con el éxito de su empresa";
  const p1 = dbContent.about_p1 || "En SIi Goo Consultores, nos especializamos en proporcionar servicios de gestoría integral con un enfoque distintivo en contabilidad analítica.";
  const p2 = dbContent.about_p2 || "Nuestra misión es ayudar a las empresas a tomar decisiones informadas mediante el análisis detallado de sus proyectos, permitiéndoles optimizar recursos y maximizar rentabilidad.";
  const p3 = dbContent.about_p3 || "Trabajamos especialmente con empresas de reformas y construcción, donde nuestro análisis por expediente marca la diferencia entre el éxito y el estancamiento.";

  // Imagen
  const aboutImg = dbContent.about_image || "https://cdn.abacus.ai/images/8bb06726-d77e-437c-bfae-098ac2f216e2.png";

  // Valores (los preparamos para ser editables)
  const val1_t = dbContent.about_val1_t || "Especialización";
  const val1_d = dbContent.about_val1_d || "Expertos en contabilidad analítica y gestión de proyectos para empresas exigentes";
  
  const val2_t = dbContent.about_val2_t || "Atención Personalizada";
  const val2_d = dbContent.about_val2_d || "Cada cliente recibe un servicio adaptado a sus necesidades específicas";
  
  const val3_t = dbContent.about_val3_t || "Experiencia";
  const val3_d = dbContent.about_val3_d || "Años de trayectoria respaldando el éxito de nuestros clientes";
  
  const val4_t = dbContent.about_val4_t || "Resultados";
  const val4_d = dbContent.about_val4_d || "Enfoque en optimización de costes y mejora de rentabilidad";

  return (
    <section id="sobre-nosotros" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <EditableContent page="inicio" section="about_title_1" initialContent={title1} isAdmin={isAdmin}>
              <span>{title1}</span>
            </EditableContent>
            <EditableContent page="inicio" section="about_title_2" initialContent={title2} isAdmin={isAdmin}>
              <span className="text-blue-600">{title2}</span>
            </EditableContent>
          </h2>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto">
            <EditableContent page="inicio" section="about_subtitle" initialContent={subtitle} isAdmin={isAdmin} multiline={true}>
              <p>{subtitle}</p>
            </EditableContent>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">
            <EditableImage 
              page="inicio"
              section="about_image"
              initialContent={aboutImg}
              isAdmin={isAdmin}
              alt="Equipo SIi Goo Consultores"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <EditableContent page="inicio" section="about_main_title" initialContent={mainTitle} isAdmin={isAdmin} multiline={true}>
              <h3 className="text-3xl font-bold text-gray-900">{mainTitle}</h3>
            </EditableContent>

            <div className="space-y-4">
               <EditableContent page="inicio" section="about_p1" initialContent={p1} isAdmin={isAdmin} multiline={true}>
                 <p className="text-lg text-gray-700 leading-relaxed">{p1}</p>
               </EditableContent>
               
               <EditableContent page="inicio" section="about_p2" initialContent={p2} isAdmin={isAdmin} multiline={true}>
                 <p className="text-lg text-gray-700 leading-relaxed">{p2}</p>
               </EditableContent>

               <EditableContent page="inicio" section="about_p3" initialContent={p3} isAdmin={isAdmin} multiline={true}>
                 <p className="text-lg text-gray-700 leading-relaxed">{p3}</p>
               </EditableContent>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Valor 1 */}
          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Target className="w-8 h-8" />
            </div>
            <EditableContent page="inicio" section="about_val1_t" initialContent={val1_t} isAdmin={isAdmin}>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{val1_t}</h4>
            </EditableContent>
            <EditableContent page="inicio" section="about_val1_d" initialContent={val1_d} isAdmin={isAdmin} multiline={true}>
              <p className="text-gray-600">{val1_d}</p>
            </EditableContent>
          </div>

          {/* Valor 2 */}
          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Users className="w-8 h-8" />
            </div>
            <EditableContent page="inicio" section="about_val2_t" initialContent={val2_t} isAdmin={isAdmin}>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{val2_t}</h4>
            </EditableContent>
            <EditableContent page="inicio" section="about_val2_d" initialContent={val2_d} isAdmin={isAdmin} multiline={true}>
              <p className="text-gray-600">{val2_d}</p>
            </EditableContent>
          </div>

          {/* Valor 3 */}
          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Award className="w-8 h-8" />
            </div>
            <EditableContent page="inicio" section="about_val3_t" initialContent={val3_t} isAdmin={isAdmin}>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{val3_t}</h4>
            </EditableContent>
            <EditableContent page="inicio" section="about_val3_d" initialContent={val3_d} isAdmin={isAdmin} multiline={true}>
              <p className="text-gray-600">{val3_d}</p>
            </EditableContent>
          </div>

          {/* Valor 4 */}
          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <EditableContent page="inicio" section="about_val4_t" initialContent={val4_t} isAdmin={isAdmin}>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{val4_t}</h4>
            </EditableContent>
            <EditableContent page="inicio" section="about_val4_d" initialContent={val4_d} isAdmin={isAdmin} multiline={true}>
              <p className="text-gray-600">{val4_d}</p>
            </EditableContent>
          </div>
        </div>
      </div>
    </section>
  );
}