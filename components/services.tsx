import { Calculator, FileText, Users, Briefcase, ClipboardList, TrendingUp } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Calculator className="w-10 h-10" />,
      title: 'Contabilidad Analítica',
      description: 'Análisis detallado de rentabilidad por proyecto, centro de coste o línea de negocio',
      benefits: ['Control de costes', 'Informes personalizados', 'Toma de decisiones basada en datos'],
      featured: true
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: 'Asesoría Fiscal',
      description: 'Gestión integral de obligaciones fiscales y optimización tributaria',
      benefits: ['Declaraciones de impuestos', 'Planificación fiscal', 'Asesoramiento personalizado']
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: 'Asesoría Laboral',
      description: 'Gestión completa de nóminas, contratos y relaciones laborales',
      benefits: ['Nóminas y seguros sociales', 'Contratos laborales', 'Gestión de altas y bajas']
    },
    {
      icon: <Briefcase className="w-10 h-10" />,
      title: 'Asesoría Contable',
      description: 'Llevanza de contabilidad y presentación de cuentas anuales',
      benefits: ['Contabilidad general', 'Cuentas anuales', 'Libros oficiales']
    },
    {
      icon: <ClipboardList className="w-10 h-10" />,
      title: 'Gestión Administrativa',
      description: 'Tramitación de documentación y gestiones ante organismos públicos',
      benefits: ['Certificados digitales', 'Licencias y permisos', 'Gestión de ayudas']
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: 'Análisis Financiero',
      description: 'Estudios de viabilidad y análisis de situación económico-financiera',
      benefits: ['Ratios financieros', 'Presupuestos', 'Planes de negocio']
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestros <span className="text-blue-600">Servicios</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluciones integrales de gestoría para impulsar el crecimiento de su empresa
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service, index) => (
            <div
              key={index}
              className={`relative group rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                service?.featured
                  ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl'
                  : 'bg-gray-50 hover:bg-white shadow-soft hover:shadow-soft-hover'
              }`}
            >
              {service?.featured && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ Destacado
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  service?.featured
                    ? 'bg-white/20 text-white'
                    : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600'
                }`}
              >
                {service?.icon}
              </div>

              {/* Title & Description */}
              <h3
                className={`text-2xl font-bold mb-3 ${
                  service?.featured ? 'text-white' : 'text-gray-900'
                }`}
              >
                {service?.title}
              </h3>
              <p
                className={`mb-6 ${
                  service?.featured ? 'text-blue-100' : 'text-gray-600'
                }`}
              >
                {service?.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2">
                {service?.benefits?.map((benefit, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <svg
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        service?.featured ? 'text-blue-200' : 'text-blue-600'
                      }`}
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
                    <span
                      className={`text-sm ${
                        service?.featured ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {benefit}
                    </span>
                  </li>
                )) ?? []}
              </ul>
            </div>
          )) ?? []}
        </div>
      </div>
    </section>
  );
}
