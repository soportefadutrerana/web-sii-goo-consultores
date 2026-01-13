import Image from 'next/image';
import { PieChart, BarChart3, FileSpreadsheet, Target, Clock, TrendingUp } from 'lucide-react';

export default function ContabilidadAnalitica() {
  const features = [
    {
      icon: <PieChart className="w-6 h-6" />,
      title: 'Análisis por Proyecto',
      description: 'Desglose detallado de ingresos y costes por cada expediente o proyecto'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Rentabilidad Real',
      description: 'Identifique qué proyectos generan más beneficios y cuáles necesitan optimización'
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      title: 'Informes Personalizados',
      description: 'Reportes adaptados a sus necesidades con la información que realmente importa'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Control de Costes',
      description: 'Seguimiento en tiempo real de gastos por centro de coste o departamento'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Datos en Tiempo Real',
      description: 'Acceso actualizado a la información financiera de sus proyectos'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Toma de Decisiones',
      description: 'Base sólida de datos para decisiones estratégicas fundamentadas'
    }
  ];

  const benefits = [
    'Visibilidad total de la rentabilidad de cada proyecto',
    'Detección temprana de desviaciones presupuestarias',
    'Optimización de recursos y reducción de costes',
    'Mejora en la planificación de futuros proyectos',
    'Mayor control sobre márgenes de beneficio',
    'Información precisa para negociaciones con clientes'
  ];

  return (
    <section id="contabilidad-analitica" className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            <Calculator className="w-4 h-4" />
            <span>Producto Estrella</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contabilidad <span className="text-blue-600">Analítica</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La herramienta que transforma datos en decisiones inteligentes para maximizar la rentabilidad de su negocio
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://cdn.abacus.ai/images/70617915-021e-43a1-ae1a-69d879db7216.png"
              alt="Dashboard de contabilidad analítica"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Conozca la verdadera rentabilidad de cada proyecto
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Nuestro servicio de <strong className="text-blue-600">contabilidad analítica</strong> va más allá de la contabilidad tradicional. Le proporcionamos un análisis exhaustivo que desglosa ingresos y costes por proyecto, centro de coste o línea de negocio.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Con esta información, podrá identificar qué áreas de su empresa son más rentables, dónde se pueden optimizar recursos y cómo mejorar sus márgenes de beneficio.
            </p>

            {/* Key Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Beneficios Clave:</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits?.slice(0, 4)?.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                )) ?? []}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white mb-4">
                {feature?.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{feature?.title}</h4>
              <p className="text-gray-600 text-sm">{feature?.description}</p>
            </div>
          )) ?? []}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿Listo para conocer la rentabilidad real de su negocio?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Solicite una consulta gratuita y descubra cómo la contabilidad analítica puede transformar su gestión empresarial
            </p>
            <a
              href="/contacto"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              Solicitar Consulta Gratuita
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Calculator({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}
