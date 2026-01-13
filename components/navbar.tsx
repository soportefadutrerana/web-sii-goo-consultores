'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

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
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Sii Goo Consultores"
                fill
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold text-gray-900">
                Sii Goo
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">
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

          {/* CTA Button */}
          <div className="flex items-center">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              Acceso Cliente
            </Link>
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
      className={`relative text-sm font-medium transition-colors ${
        isActive
          ? 'text-blue-600'
          : 'text-gray-700 hover:text-gray-900'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-blue-600"></span>
      )}
    </Link>
  );
}
