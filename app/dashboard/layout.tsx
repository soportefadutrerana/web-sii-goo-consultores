"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  Building2, LogOut, Menu, X, Home, FolderOpen, MessageSquare, Settings, FileText, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated") {
      fetchUserRole();
    }
  }, [status, router]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const user = await response.json();
        const role = user.role || 'client';
        setUserRole(role);
      }
    } catch (error) {
      console.error('Error al obtener rol:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/contact/unread-count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error al obtener contador de mensajes no leídos:', error);
    }
  };

  // Cargar el contador inicial y actualizar periódicamente
  useEffect(() => {
    if (userRole === 'admin' || userRole === 'gestor') {
      // Carga inicial
      fetchUnreadCount();

      // Actualizar cada 60 segundos (reducido de 30 para mejor rendimiento)
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 60000);

      // Escuchar evento de cambio en mensajes no leídos
      const handleUnreadChange = () => {
        fetchUnreadCount();
      };
      window.addEventListener('unread-messages-changed', handleUnreadChange);

      return () => {
        clearInterval(interval);
        window.removeEventListener('unread-messages-changed', handleUnreadChange);
      };
    }
  }, [userRole]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-all duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 border-r border-slate-700/50`}>
        <div className="h-full flex flex-col backdrop-blur-xl">
          {/* Header / Logo */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-slate-700/50 shadow-xl">
                <Image
                  src="/logo1.jpeg"
                  alt="Sii Goo Consultores"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xl font-bold text-white tracking-tight">
                  Sii Goo
                </span>
                <span className="text-xs text-slate-400 font-medium">Consultores</span>
              </div>
            </div>

            {/* User Info Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-3 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              <div className="relative flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-sm">
                      {((session.user as any).name || session.user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {(session.user as any).name || session.user?.email}
                  </p>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-400">En línea</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {/* Main Section */}
            <div className="mb-6">
              <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Principal</p>
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setSidebarOpen(false);
                }}
                className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Home className={`w-5 h-5 transition-transform duration-200 ${isActive('/dashboard') ? '' : 'group-hover:scale-110'}`} />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Work Section */}
            <div className="mb-6">
              <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trabajo</p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    router.push('/dashboard/projects');
                    setSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive('/dashboard/projects')
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <FolderOpen className={`w-5 h-5 transition-transform duration-200 ${isActive('/dashboard/projects') ? '' : 'group-hover:scale-110'}`} />
                  <span>Proyectos</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/dashboard/documents');
                    setSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive('/dashboard/documents')
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <FileText className={`w-5 h-5 transition-transform duration-200 ${isActive('/dashboard/documents') ? '' : 'group-hover:scale-110'}`} />
                  <span>Documentos</span>
                </button>
              </div>
            </div>

            {/* Communication Section */}
            <div className="mb-6">
              <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Comunicación</p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    router.push('/dashboard/messages');
                    setSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive('/dashboard/messages')
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <MessageSquare className={`w-5 h-5 transition-transform duration-200 ${isActive('/dashboard/messages') ? '' : 'group-hover:scale-110'}`} />
                  <span>Mensajes</span>
                </button>
                {(userRole === 'admin' || userRole === 'gestor') && (
                  <button
                    onClick={() => {
                      router.push('/dashboard/contact-messages');
                      setSidebarOpen(false);
                    }}
                    className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive('/dashboard/contact-messages')
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Mail className={`w-5 h-5 transition-transform duration-200 ${isActive('/dashboard/contact-messages') ? '' : 'group-hover:scale-110'}`} />
                      <span>Mensajes de Contacto</span>
                    </div>
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 shadow-lg shadow-red-500/30 animate-pulse">
                        {unreadCount}
                      </Badge>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Settings Section */}
            <div>
              <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sistema</p>
              <button
                onClick={() => {
                  router.push('/dashboard/settings');
                  setSidebarOpen(false);
                }}
                className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive('/dashboard/settings')
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Settings className={`w-5 h-5 transition-transform duration-200 ${isActive('/dashboard/settings') ? '' : 'group-hover:scale-110'}`} />
                <span>Configuración</span>
              </button>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-700/50">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="group w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-30 border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex-1 lg:hidden"></div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {(session.user as any).company || 'Mi Cuenta'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
