import Image from 'next/image';
import { Building2, ClipboardCheck, PieChart, FileText, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function EspecializationReformas() {
  const services = [
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: 'Gestión de Proyectos',
      description: 'Seguimiento completo de cada obra desde el presupuesto hasta la finalización'
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: 'Análisis por Expediente',
      description: 'Rentabilidad detallada de cada proyecto de reforma para optimizar recursos'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Control de Costes',
      description: 'Monitorización de gastos en tiempo real para evitar desviaciones presupuestarias'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Informes de Rentabilidad',
      description: 'Análisis comparativo entre proyectos para identificar áreas de mejora'
    }
  ];

  const benefits = [
    'Control total sobre márgenes de cada reforma',
    'Detección temprana de sobrecostes',
    'Optimización de precios en futuros proyectos',
    'Gestión eficiente de múltiples obras simultáneas',
    'Informes claros para toma de decisiones',
    'Mejora continua de rentabilidad'
  ];

  return (
    <section id="reformas" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            <Building2 className="w-4 h-4" />
            <span>Sector Especializado</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Empresas de <span className="text-blue-600">Reformas</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluciones especializadas para el sector de reformas y construcción con análisis por expediente
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Gestión especializada para empresas de reformas y construcción
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Entendemos los desafíos únicos del sector de reformas: múltiples proyectos simultáneos, costes variables, gestión de subcontratistas y la necesidad de mantener márgenes rentables en cada obra.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Nuestro servicio de <strong className="text-blue-600">contabilidad analítica por expediente</strong> le permite conocer la rentabilidad exacta de cada reforma, identificar desviaciones a tiempo y tomar decisiones informadas.
            </p>

            {/* Services */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {services?.map((service, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200 hover:shadow-lg transition-shadow"
                >
                  <div className="text-blue-600 mb-3">{service?.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2 text-sm">{service?.title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{service?.description}</p>
                </div>
              )) ?? []}
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://cdn.abacus.ai/images/febf887f-d93c-41d6-a9cf-104bfe71c077.png"
              alt="Proyecto de reforma profesional"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                ¿Por qué las empresas de reformas nos eligen?
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Porque entendemos su negocio y proporcionamos la información que necesita para crecer de forma rentable y sostenible.
              </p>
            </div>

            <div className="space-y-3">
              {benefits?.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white text-sm">{benefit}</span>
                </div>
              )) ?? []}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <a
              href="/contacto"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Solicitar Análisis de su Empresa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
