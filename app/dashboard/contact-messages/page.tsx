'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, MailOpen, Phone, Building2, Calendar, User, X } from 'lucide-react';
import { toast } from 'sonner';

interface ContactMessage {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  servicio: string;
  mensaje: string;
  leido: boolean;
  createdAt: string;
}

export default function ContactMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchMessages();
    }
  }, [status, router]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        if (response.status === 403) {
          toast.error('No tienes permisos para ver estos mensajes');
          router.push('/dashboard');
        } else {
          toast.error('Error al cargar mensajes');
        }
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    // Marcar como leído si no está leído
    if (!message.leido) {
      try {
        const response = await fetch('/api/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: message.id }),
        });

        if (response.ok) {
          setMessages(messages.map(m =>
            m.id === message.id ? { ...m, leido: true } : m
          ));
          // Disparar evento para actualizar el contador en el sidebar
          window.dispatchEvent(new Event('unread-messages-changed'));
        }
      } catch (error) {
        console.error('Error al marcar mensaje como leído:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.leido).length;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mensajes de Contacto</h1>
        <p className="text-gray-600 mt-1">
          Gestiona los mensajes recibidos desde el formulario de contacto
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-red-500">{unreadCount} no leído{unreadCount !== 1 ? 's' : ''}</Badge>
          )}
        </p>
      </div>

      {/* Dialog para ver mensaje completo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Mensaje de {selectedMessage?.nombre}</span>
              {selectedMessage?.leido ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Leído
                </Badge>
              ) : (
                <Badge className="bg-blue-600">Nuevo</Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Recibido el {selectedMessage && formatDate(selectedMessage.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6 py-4">
              {/* Información del contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="font-semibold text-gray-900">{selectedMessage.nombre}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${selectedMessage.email}`} className="font-semibold text-blue-600 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                {selectedMessage.telefono && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <a href={`tel:${selectedMessage.telefono}`} className="font-semibold text-gray-900 hover:underline">
                        {selectedMessage.telefono}
                      </a>
                    </div>
                  </div>
                )}
                {selectedMessage.empresa && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Empresa</p>
                      <p className="font-semibold text-gray-900">{selectedMessage.empresa}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Servicio de interés */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-500 mb-1">Servicio de interés</p>
                <Badge className="bg-blue-600">{selectedMessage.servicio}</Badge>
              </div>

              {/* Mensaje */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Mensaje</p>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.mensaje}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lista de mensajes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-600" />
            Listado de Mensajes
          </CardTitle>
          <CardDescription>
            {messages.length} mensaje{messages.length !== 1 ? 's' : ''} en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MailOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay mensajes de contacto</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                    message.leido 
                      ? 'bg-white border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {message.leido ? (
                          <MailOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        )}
                        <h3 className="font-semibold text-gray-900 truncate">
                          {message.nombre}
                        </h3>
                        {!message.leido && (
                          <Badge className="bg-blue-600 text-xs">Nuevo</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600 truncate">
                          <span className="font-medium">Email:</span> {message.email}
                        </p>
                        {message.empresa && (
                          <p className="text-gray-600 truncate">
                            <span className="font-medium">Empresa:</span> {message.empresa}
                          </p>
                        )}
                        <p className="text-gray-600">
                          <span className="font-medium">Servicio:</span>{' '}
                          <Badge variant="outline" className="ml-1">{message.servicio}</Badge>
                        </p>
                        <p className="text-gray-600 line-clamp-2 mt-2">
                          {message.mensaje}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end space-y-2 flex-shrink-0">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
