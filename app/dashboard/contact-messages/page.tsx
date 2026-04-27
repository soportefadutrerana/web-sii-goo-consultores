'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, MailOpen, Phone, Building2, Calendar, User, X, ArrowRight } from 'lucide-react';
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

    if (!message.leido) {
      try {
        const response = await fetch('/api/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: message.id }),
        });
        
        if (response.ok) {
          setMessages(prevMessages => 
            prevMessages.map(m => m.id === message.id ? { ...m, leido: true } : m)
          );
          window.dispatchEvent(new Event('unread-messages-changed'));
        }
      } catch (error) {
        console.error('Error al marcar como leído:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden border-none">
          {selectedMessage && (
            <div className="flex flex-col w-full">
              {/* CABECERA DEGRADADA PROFESIONAL */}
              <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-800 p-8 text-white relative">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-100" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Nuevo Mensaje de Contacto</h2>
                </div>
                <p className="text-blue-100/80 text-sm ml-12">
                  Recibido el {formatDate(selectedMessage.createdAt)}
                </p>
                {!selectedMessage.leido && (
                  <Badge className="absolute top-8 right-8 bg-green-500 hover:bg-green-500 border-none px-3 shadow-lg">
                    NUEVO
                  </Badge>
                )}
              </div>

              {/* CUERPO CON GRID DE INFORMACIÓN */}
              <div className="p-8 bg-white space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nombre</span>
                      <p className="font-bold text-gray-900">{selectedMessage.nombre}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</span>
                      <p className="font-bold text-blue-600 truncate">{selectedMessage.email}</p>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Teléfono</span>
                      <p className="font-bold text-gray-900">{selectedMessage.telefono || '—'}</p>
                    </div>
                  </div>

                  {/* Empresa */}
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Empresa</span>
                      <p className="font-bold text-gray-900">{selectedMessage.empresa || 'Particular'}</p>
                    </div>
                  </div>
                </div>

                {/* Servicio de interés */}
                <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                  <span className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Servicio de interés</span>
                  <Badge className="bg-blue-600 text-sm py-1 px-4">{selectedMessage.servicio}</Badge>
                </div>

                {/* Mensaje */}
                <div className="relative">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mensaje</span>
                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 leading-relaxed italic shadow-inner">
                    {selectedMessage.mensaje}
                  </div>
                  <div className="absolute left-0 top-8 bottom-0 w-1 bg-blue-600 rounded-full"></div>
                </div>

                {/* BOTÓN RESPONDER */}
                <div className="pt-4 flex justify-center">
                  <Button 
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-10 rounded-xl shadow-xl transition-all hover:scale-105"
                  >
                    <a href={`mailto:${selectedMessage.email}?subject=RE: Consulta sobre ${selectedMessage.servicio}`}>
                      Responder por Email
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* PIE DE PÁGINA */}
              <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 font-mono tracking-tighter">
                  ID DEL CONTACTO: {selectedMessage.id} | RESPONDER A: {selectedMessage.email}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                      : 'bg-blue-50 border-blue-200 shadow-sm'
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
                        <h3 className={`truncate ${message.leido ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>
                          {message.nombre}
                        </h3>
                        {!message.leido && (
                          <Badge className="bg-blue-600 text-[10px] h-5">Nuevo</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600 truncate">
                          <span className="font-medium">Email:</span> {message.email}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Servicio:</span>{' '}
                          <Badge variant="secondary" className="ml-1 text-[10px]">{message.servicio}</Badge>
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end flex-shrink-0">
                      <span className="text-[10px] text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
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