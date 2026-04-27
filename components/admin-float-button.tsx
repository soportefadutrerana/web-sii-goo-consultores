'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; //
import { LayoutDashboard } from 'lucide-react';

export default function AdminFloatButton() {
  const { data: session } = useSession();
  const pathname = usePathname(); //
  
  // Comprobamos si hay sesión y si el rol es admin
  const isAdmin = session?.user && (session.user as any).role === 'admin';

  // Si no es admin, O si la ruta ya empieza por "/dashboard", no mostramos el botón
  if (!isAdmin || pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link 
        href="/dashboard"
        className="group flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all border border-slate-700"
      >
        <LayoutDashboard className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        <span className="font-medium text-sm">Volver al Panel</span>
      </Link>
    </div>
  );
}