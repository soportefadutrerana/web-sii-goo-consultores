import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                SG
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none">SIi Goo Consultores</span>
                <span className="text-xs text-gray-400 leading-none">Gestoría y Contabilidad Analítica</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Servicios profesionales de gestoría especializada en contabilidad analítica. 
              Ayudamos a empresas de reformas y construcción a optimizar su rentabilidad mediante análisis detallado de proyectos.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <div className="space-y-3">
              <a href="mailto:info@siigoo.com" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">info@siigoo.com</span>
              </a>
              <a href="tel:+34900000000" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">+34 900 000 000</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Madrid, España</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Enlaces</h4>
            <nav className="space-y-2">
              <FooterLink href="#servicios">Servicios</FooterLink>
              <FooterLink href="#contabilidad-analitica">Contabilidad Analítica</FooterLink>
              <FooterLink href="#reformas">Empresas de Reformas</FooterLink>
              <FooterLink href="#contacto">Contacto</FooterLink>
            </nav>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {new Date()?.getFullYear?.()} SIi Goo Consultores. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-4">
              <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
              <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} label="Facebook" />
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} label="Twitter" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200"
    >
      {children}
    </Link>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all hover:scale-110"
    >
      {icon}
    </a>
  );
}
