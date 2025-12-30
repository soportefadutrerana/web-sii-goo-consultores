import Image from 'next/image';
import { Target, Users, Award, TrendingUp } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Especialización',
      description: 'Expertos en contabilidad analítica y gestión de proyectos para empresas exigentes'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Atención Personalizada',
      description: 'Cada cliente recibe un servicio adaptado a sus necesidades específicas'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Experiencia',
      description: 'Años de trayectoria respaldando el éxito de nuestros clientes'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Resultados',
      description: 'Enfoque en optimización de costes y mejora de rentabilidad'
    }
  ];

  return (
    <section id="sobre-nosotros" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sobre <span className="text-blue-600">Nosotros</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos su aliado estratégico en la gestión empresarial con enfoque en análisis y resultados
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://cdn.abacus.ai/images/8bb06726-d77e-437c-bfae-098ac2f216e2.png"
              alt="Equipo SIi Goo Consultores"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Profesionales comprometidos con el éxito de su empresa
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              En <strong className="text-blue-600">SIi Goo Consultores</strong>, nos especializamos en proporcionar servicios de gestoría integral con un enfoque distintivo en <strong>contabilidad analítica</strong>.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Nuestra misión es ayudar a las empresas a tomar decisiones informadas mediante el análisis detallado de sus proyectos, permitiéndoles optimizar recursos y maximizar rentabilidad.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Trabajamos especialmente con empresas de reformas y construcción, donde nuestro análisis por expediente marca la diferencia entre el éxito y el estancamiento.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values?.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                {value?.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{value?.title}</h4>
              <p className="text-gray-600">{value?.description}</p>
            </div>
          )) ?? []}
        </div>
      </div>
    </section>
  );
}
