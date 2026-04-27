'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Linkedin, Facebook } from 'lucide-react';
import { Lock as LockIcon } from 'lucide-react';

// Interfaz para recibir los datos de la base de datos
interface FooterProps {
  isAdmin?: boolean;
  dbContent?: Record<string, string>;
}

// Dentro de Footer.tsx
export default function Footer({ isAdmin = false, dbContent = {} }: FooterProps) {
  
  // Usamos los nombres EXACTOS que hemos visto en tu consola
  const email = dbContent.cont_mail || "info@siigooconsultores.com";
  const phone = dbContent.cont_tel || "+34 955 387 218";
  
  const address = dbContent.cont_adr || "Callejón de Capachuelos 73, local 6, 41710, Utrera, Sevilla";

  return (
    // ... resto del HTML del footer
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Sii Goo Consultores"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none">Sii Goo Consultores</span>
                <span className="text-xs text-gray-400 leading-none mt-1">Gestoría y Contabilidad Analítica</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Servicios profesionales de gestoría especializada en contabilidad analítica.
              Ayudamos a empresas de reformas y construcción a optimizar su rentabilidad mediante análisis detallado de proyectos.
            </p>
          </div>

          {/* Contact Info - SINCRONIZADO */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <div className="space-y-3">
              {/* Email dinámico */}
              <a href={`mailto:${email}`} className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{email}</span>
              </a>
              
              {/* Teléfono dinámico */}
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{phone}</span>
              </a>
              
              {/* Dirección dinámica */}
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Enlaces</h4>
            <nav className="space-y-2">
              <FooterLink href="/#servicios">Servicios</FooterLink>
              <FooterLink href="/#contabilidad-analitica">Contabilidad Analítica</FooterLink>
              <FooterLink href="/#reformas">Empresas de Reformas</FooterLink>
              <FooterLink href="/#contacto">Contacto</FooterLink>
            </nav>
          </div>
        </div>

        {/* Barra de Acceso y Copyright Inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-12 border-t border-gray-100/10">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Sii Goo Consultores. Todos los derechos reservados.
          </div>

          <div className="flex items-center space-x-6">
            {/* Redes Sociales */}
            <div className="flex items-center space-x-4">
              <SocialLink href="#" icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" />
              <SocialLink href="#" icon={<Facebook className="w-4 h-4" />} label="Facebook" />
              <SocialLink href="#" icon={<XLogo className="w-4 h-4" />} label="Twitter" />
            </div>

            {/* Acceso Panel */}
            <Link 
              href="/login" 
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-all text-xs border border-white/5"
            >
              <LockIcon className="w-3 h-3" /> 
              <span>Acceso</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Componentes auxiliares
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
      className="w-8 h-8 bg-white/5 rounded flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all hover:scale-110"
    >
      {icon}
    </a>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}