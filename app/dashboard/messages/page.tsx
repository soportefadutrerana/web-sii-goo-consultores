'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Mail, MailOpen } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    receiverId: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchMessages();
      fetchUsers();
    }
  }, [status, router]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        const currentUser = data.find((u: User) => u.email === session?.user?.email);
        if (currentUser) {
          setCurrentUserId(currentUser.id);
          setCurrentUserRole(currentUser.role);
        }
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Mensaje enviado correctamente');
        setIsDialogOpen(false);
        resetForm();
        fetchMessages();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al enviar mensaje');
      }
    } catch (error) {
      toast.error('Error al enviar mensaje');
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);

    // Marcar como leído si es el receptor
    if (message.receiver.id === currentUserId && !message.read) {
      try {
        await fetch('/api/messages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: message.id }),
        });
        fetchMessages();
      } catch (error) {
        console.error('Error al marcar mensaje como leído:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      content: '',
      receiverId: '',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAvailableRecipients = () => {
    if (currentUserRole === 'client') {
      // Clientes solo pueden enviar mensajes a gestores/admins
      return users.filter((u) => u.role === 'gestor' || u.role === 'admin');
    } else {
      // Gestores/admins pueden enviar mensajes a cualquiera excepto a sí mismos
      return users.filter((u) => u.id !== currentUserId);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const receivedMessages = messages.filter((m) => m.receiver.id === currentUserId);
  const sentMessages = messages.filter((m) => m.sender.id === currentUserId);
  const unreadCount = receivedMessages.filter((m) => !m.read).length;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mensajería</h1>
          <p className="text-gray-600 mt-1">
            Comunícate con tu gestor o clientes
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500">{unreadCount} no leído{unreadCount !== 1 ? 's' : ''}</Badge>
            )}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Nuevo Mensaje
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enviar Nuevo Mensaje</DialogTitle>
              <DialogDescription>
                Completa el formulario para enviar un mensaje
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiverId">Destinatario *</Label>
                <Select
                  value={formData.receiverId}
                  onValueChange={(value) => setFormData({ ...formData, receiverId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar destinatario" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableRecipients().map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role}) - {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Asunto *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Asunto del mensaje"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Mensaje *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Enviar Mensaje
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog para ver mensaje */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              De: {selectedMessage?.sender.name} ({selectedMessage?.sender.email})
              <br />
              Para: {selectedMessage?.receiver.name} ({selectedMessage?.receiver.email})
              <br />
              Fecha: {selectedMessage && formatDate(selectedMessage.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap text-gray-800">{selectedMessage?.content}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mensajes Recibidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Mensajes Recibidos
            </CardTitle>
            <CardDescription>
              {receivedMessages.length} mensaje{receivedMessages.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {receivedMessages.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No hay mensajes recibidos</p>
              ) : (
                receivedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                      message.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {message.read ? (
                          <MailOpen className="w-4 h-4 mr-2 text-gray-400" />
                        ) : (
                          <Mail className="w-4 h-4 mr-2 text-blue-600" />
                        )}
                        <h3 className="font-semibold text-gray-900">{message.subject}</h3>
                      </div>
                      {!message.read && (
                        <Badge className="bg-blue-600">Nuevo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 truncate">{message.content}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>De: {message.sender.name}</span>
                      <span>{formatDate(message.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mensajes Enviados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="w-5 h-5 mr-2 text-green-600" />
              Mensajes Enviados
            </CardTitle>
            <CardDescription>
              {sentMessages.length} mensaje{sentMessages.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentMessages.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No hay mensajes enviados</p>
              ) : (
                sentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 rounded-lg border bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleViewMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                        <h3 className="font-semibold text-gray-900">{message.subject}</h3>
                      </div>
                      {message.read && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Leído
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 truncate">{message.content}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Para: {message.receiver.name}</span>
                      <span>{formatDate(message.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}