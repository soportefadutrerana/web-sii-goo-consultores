'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Edit2, Save, Loader2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function GestionUsuariosPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false); // Estado para la tarjeta de éxito

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) setUsers(await res.json());
    } catch (error) { toast.error('Error al cargar usuarios'); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUser),
      });

      if (res.ok) {
        setShowSuccessCard(true); // Mostramos la tarjeta de éxito profesional
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Error al actualizar');
      }
    } catch (error) { toast.error('Error de conexión'); }
    finally { setIsSaving(false); }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10 text-blue-600" /></div>;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Gestión de Usuarios</h1>

      <div className="grid gap-4">
        {users.map((user: any) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
               <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
               </div>
               <Button variant="outline" onClick={() => { 
                 setSelectedUser(user); 
                 setShowSuccessCard(false); // Reset éxito
                 setIsEditOpen(true); 
               }}>
                 <Edit2 className="w-4 h-4 mr-2" /> Editar
               </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
          <AnimatePresence mode="wait">
            {!showSuccessCard ? (
              /* FORMULARIO DE EDICIÓN */
              <motion.div 
                key="edit-form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-8"
              >
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold">Editar Perfil</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Nombre</label>
                    <Input value={selectedUser?.name || ''} onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Email</label>
                    <Input value={selectedUser?.email || ''} onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Empresa</label>
                    <Input value={selectedUser?.company || ''} onChange={(e) => setSelectedUser({...selectedUser, company: e.target.value})} />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 h-12 text-lg font-bold" disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                    Guardar Cambios
                  </Button>
                </form>
              </motion.div>
            ) : (
              /* TARJETA DE ÉXITO (Diseño que querías) */
              <motion.div 
                key="success-card"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="p-10 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                      <Check className="w-8 h-8 text-white" strokeWidth={3} />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Perfil Actualizado!</h3>
                <p className="text-gray-500 mb-8">Los datos de <strong>{selectedUser.name}</strong> se han guardado correctamente.</p>
                <Button 
                  onClick={() => setIsEditOpen(false)}
                  className="w-full h-12 bg-gray-900 text-white rounded-xl font-bold"
                >
                  Entendido
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}