'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion'; // Importamos framer-motion

export default function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-28 h-28 flex-shrink-0">
              <Image
                src="/logoRecortado.png"
                alt="Sii Goo Consultores"
                fill
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Sii Goo
              </span>
              <span className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
                CONSULTORES
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink href="/" isActive={isActive('/')}>
              Inicio
            </NavLink>
            <NavLink href="/servicios" isActive={isActive('/servicios')}>
              Servicios
            </NavLink>
            <NavLink href="/contabilidad-analitica" isActive={isActive('/contabilidad-analitica')}>
              Contabilidad Analítica
            </NavLink>
            <NavLink href="/reformas" isActive={isActive('/reformas')}>
              Empresas de Reformas
            </NavLink>
            <NavLink href="/contacto" isActive={isActive('/contacto')}>
              Contacto
            </NavLink>
          </div>

          {/* CTA / Acceso */}
          <div className="flex items-center gap-4">
            {status !== 'authenticated' && (
              <Link 
                href="/login" 
                className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 group"
              >
                <Lock className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600" />
              </Link>
            )}
            
            {status === 'authenticated' && (
              <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-wider">
                Modo Editor
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
  isActive
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative py-1 text-sm font-semibold transition-colors duration-300 group ${
        isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      {children}

      {/* Línea de hover: Nace del centro hacia afuera */}
      <motion.span
        className="absolute -bottom-1 left-0 h-0.5 bg-blue-600"
        initial={{ width: 0, left: "50%" }}
        whileHover={{ width: "100%", left: "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {isActive && (
        <motion.span 
          layoutId="activeLink"
          className="absolute -bottom-[30px] left-0 right-0 h-0.5 bg-blue-600"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}