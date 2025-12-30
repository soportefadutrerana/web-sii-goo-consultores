import Link from 'next/link';
import { FileText, Calculator, Building2 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="#hero" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              SG
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-none">SIi Goo</span>
              <span className="text-xs text-gray-600 leading-none">Consultores</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="#servicios" icon={<FileText className="w-4 h-4" />}>
              Servicios
            </NavLink>
            <NavLink href="#contabilidad-analitica" icon={<Calculator className="w-4 h-4" />}>
              Contabilidad Analítica
            </NavLink>
            <NavLink href="#reformas" icon={<Building2 className="w-4 h-4" />}>
              Empresas de Reformas
            </NavLink>
            <Link
              href="#contacto"
              className="ml-4 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contacto
            </Link>
            <Link
              href="/login"
              className="ml-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              Acceso Cliente
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Acceso
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
