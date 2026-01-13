'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/user');
      if (response.ok) {
        const user = await response.json();
        setUserData(user);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al cargar los datos del usuario');
        console.error('Error al cargar datos de usuario:', errorData);
      }
    } catch (error) {
      setError('Error de conexión al cargar los datos del usuario');
      console.error('Error al cargar datos de usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleName = (role: string) => {
    const roles: { [key: string]: string } = {
      client: 'Cliente',
      gestor: 'Gestor',
      admin: 'Administrador',
    };
    return roles[role] || role;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userData && !loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Información de tu perfil y cuenta</p>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se pudieron cargar los datos del usuario
              </h3>
              <p className="text-gray-600 mb-4">
                {error || 'Hubo un problema al intentar cargar tu información.'}
              </p>
              <button
                onClick={fetchUserData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Información de tu perfil y cuenta</p>
      </div>

      <div className="space-y-6">
        {/* Información del Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Información del Perfil
            </CardTitle>
            <CardDescription>
              Datos de tu cuenta en Sii Goo Consultores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                  <p className="text-lg text-gray-900 mt-1">{userData?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Correo Electrónico</label>
                  <p className="text-lg text-gray-900 mt-1">{userData?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Empresa</label>
                  <p className="text-lg text-gray-900 mt-1">
                    {userData?.company || <span className="text-gray-400">No especificada</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono</label>
                  <p className="text-lg text-gray-900 mt-1">
                    {userData?.phone || <span className="text-gray-400">No especificado</span>}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Rol</label>
                  <p className="text-lg text-gray-900 mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {getRoleName(userData?.role || '')}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Miembro Desde</label>
                  <p className="text-lg text-gray-900 mt-1">{formatDate(userData?.createdAt || '')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de la Plataforma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Información de la Plataforma
            </CardTitle>
            <CardDescription>
              Detalles sobre tu uso de la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">¿Necesitas ayuda?</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Nuestro equipo está disponible para asistirte con cualquier consulta sobre la plataforma o tus servicios.
                </p>
                <div className="space-y-2 text-sm text-blue-900">
                  <p><strong>Email:</strong> info@siigooconsultores.com</p>
                  <p><strong>Teléfono:</strong> +34 955 387 218</p>
                  <p><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Funciones Disponibles</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Dashboard con análisis de rentabilidad
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Gestión de proyectos y contabilidad analítica
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Subida y descarga de documentos
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Sistema de mensajería con tu gestor
                  </li>
                  {(userData?.role === 'gestor' || userData?.role === 'admin') && (
                    <>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Acceso a todos los proyectos y clientes
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Gestión completa de documentos
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}