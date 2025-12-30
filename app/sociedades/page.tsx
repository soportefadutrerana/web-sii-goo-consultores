import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Building2, Globe, Shield, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const countries = [
  {
    name: "España",
    entity: "Sociedad Limitada (SL) / Sociedad Anónima (SA)",
    time: "2-3 semanas",
    capital: "3.000€ (SL) / 60.000€ (SA)",
    tax: "25%",
    benefits: ["Acceso al mercado europeo", "Sistema legal robusto", "Imagen corporativa sólida"],
    color: "from-red-500 to-yellow-500"
  },
  {
    name: "Estados Unidos (LLC)",
    entity: "Limited Liability Company",
    time: "1-2 semanas",
    capital: "Sin mínimo",
    tax: "0-21% federal + estatal",
    benefits: ["Protección de activos", "Flexibilidad fiscal", "Facilidad de gestión"],
    color: "from-blue-600 to-red-600"
  },
  {
    name: "Dubai (UAE)",
    entity: "Free Zone Company / Mainland Company",
    time: "2-4 semanas",
    capital: "Variable según Free Zone",
    tax: "0% (Free Zone)",
    benefits: ["Sin impuestos corporativos", "100% propiedad extranjera", "Confidencialidad"],
    color: "from-amber-500 to-orange-600"
  },
  {
    name: "Estonia",
    entity: "OÜ (Osaühing)",
    time: "1 semana",
    capital: "2.500€",
    tax: "20% (solo dividendos distribuidos)",
    benefits: ["E-Residency digital", "Gestión 100% online", "Acceso UE"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Polonia",
    entity: "Sp. z o.o.",
    time: "2-3 semanas",
    capital: "5.000 PLN (~1.200€)",
    tax: "19% (9% para PYMES)",
    benefits: ["Costes operativos bajos", "Mano de obra cualificada", "Mercado en crecimiento"],
    color: "from-red-600 to-white"
  },
  {
    name: "Países Bajos",
    entity: "BV (Besloten Vennootschap)",
    time: "1-2 semanas",
    capital: "0,01€ (mínimo legal)",
    tax: "15-25.8%",
    benefits: ["Red de tratados fiscales", "Reputación internacional", "Hub logístico europeo"],
    color: "from-orange-500 to-blue-600"
  },
  {
    name: "Colombia",
    entity: "SAS (Sociedad por Acciones Simplificada)",
    time: "1-2 semanas",
    capital: "Sin mínimo",
    tax: "35%",
    benefits: ["Acceso mercado latinoamericano", "Proceso simplificado", "Incentivos para inversión"],
    color: "from-yellow-400 to-blue-600"
  }
];

export default function SociedadesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
            }}></div>
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center">
              <Globe className="w-20 h-20 mx-auto mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Constitución de Sociedades Internacionales
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
                Expandimos su negocio globalmente con soluciones legales y fiscales optimizadas en los principales mercados del mundo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                  <Link href="/registro" className="flex items-center">
                    Consulta Gratuita
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <a href="#paises" className="flex items-center">
                    Ver Destinos
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why International */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué Constituir una Sociedad Internacional?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Optimice su carga fiscal, proteja sus activos y acceda a nuevos mercados
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <BenefitCard
                icon={<Shield className="w-12 h-12" />}
                title="Protección de Activos"
                description="Estructura legal sólida que protege su patrimonio personal y empresarial"
                color="blue"
              />
              <BenefitCard
                icon={<TrendingUp className="w-12 h-12" />}
                title="Optimización Fiscal"
                description="Aproveche tratados internacionales y regímenes fiscales favorables"
                color="green"
              />
              <BenefitCard
                icon={<Globe className="w-12 h-12" />}
                title="Expansión Global"
                description="Acceso a mercados internacionales y credibilidad corporativa"
                color="purple"
              />
            </div>
          </div>
        </section>

        {/* Countries */}
        <section id="paises" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Destinos Disponibles
              </h2>
              <p className="text-xl text-gray-600">
                Seleccione el país que mejor se adapte a sus necesidades empresariales
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {countries.map((country, idx) => (
                <CountryCard key={idx} country={country} />
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nuestro Proceso
              </h2>
              <p className="text-xl text-gray-600">
                Le acompañamos en cada paso del camino
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Consulta Inicial", desc: "Análisis de necesidades y selección de jurisdicción" },
                { step: "02", title: "Documentación", desc: "Preparación y gestión de toda la documentación necesaria" },
                { step: "03", title: "Constitución", desc: "Registro oficial y obtención de licencias" },
                { step: "04", title: "Soporte Continuo", desc: "Asesoramiento fiscal y contable permanente" }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">
              ¿Listo para Expandir su Negocio Globalmente?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Nuestros expertos le guiarán en cada paso del proceso de constitución internacional
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                <Link href="/registro">
                  Solicitar Consulta Gratuita
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <a href="#contacto">
                  Contactar Ahora
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function BenefitCard({ icon, title, description, color }: any) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <div className={`w-16 h-16 bg-gradient-to-br ${colors[color as keyof typeof colors]} rounded-xl flex items-center justify-center text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function CountryCard({ country }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6">
      <div className={`h-32 bg-gradient-to-br ${country.color} rounded-xl mb-6 flex items-center justify-center`}>
        <Building2 className="w-16 h-16 text-white" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{country.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{country.entity}</p>

      <div className="space-y-3 mb-6">
        <InfoRow label="Tiempo" value={country.time} />
        <InfoRow label="Capital mínimo" value={country.capital} />
        <InfoRow label="Impuesto" value={country.tax} />
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Ventajas:</p>
        <ul className="space-y-2">
          {country.benefits.map((benefit: string, idx: number) => (
            <li key={idx} className="flex items-start text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <Link href="/registro">
          Más Información
        </Link>
      </Button>
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}:</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}