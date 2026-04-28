'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { User, Edit2, Save, Loader2, Check, Search, Plus, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function GestionUsuariosPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para creación y eliminación
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) setUsers(await res.json());
    } catch (error) { toast.error('Error al cargar usuarios'); }
    finally { setLoading(false); }
  };

  // --- CREAR O ACTUALIZAR (POST o PUT) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const method = isCreateMode ? 'POST' : 'PUT';
    
    try {
      const res = await fetch('/api/users', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUser),
      });

      if (res.ok) {
        setShowSuccessCard(true);
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Error al procesar la solicitud');
      }
    } catch (error) { toast.error('Error de conexión'); }
    finally { setIsSaving(false); }
  };

  // --- ELIMINAR (DELETE) ---
  const handleDelete = async () => {
    if (!userToDelete) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users?id=${userToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Usuario eliminado correctamente');
        fetchUsers();
        setIsDeleteAlertOpen(false);
      } else {
        toast.error('Error al eliminar');
      }
    } catch (error) { toast.error('Error de conexión'); }
    finally { setIsSaving(false); }
  };

  const filteredUsers = users.filter((user: any) => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10 text-blue-600" /></div>;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={() => {
          setSelectedUser({ name: '', email: '', company: '', role: 'client' });
          setIsCreateMode(true);
          setShowSuccessCard(false);
          setIsEditOpen(true);
        }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Usuario
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input 
          placeholder="Buscar por nombre o email..." 
          className="pl-10 h-12 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user: any) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">{user.name || 'Sin nombre'}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { 
                  setSelectedUser(user); 
                  setIsCreateMode(false);
                  setShowSuccessCard(false); 
                  setIsEditOpen(true); 
                }}>
                  <Edit2 className="w-4 h-4 mr-2" /> Editar
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" 
                  onClick={() => {
                    setUserToDelete(user);
                    setIsDeleteAlertOpen(true);
                  }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- DIÁLOGO DE CREACIÓN / EDICIÓN --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
          <AnimatePresence mode="wait">
            {!showSuccessCard ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold">
                    {isCreateMode ? 'Crear Nuevo Usuario' : 'Editar Perfil'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">Nombre</label>
                    <Input required value={selectedUser?.name || ''} onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">Email</label>
                    <Input required type="email" value={selectedUser?.email || ''} onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400">Empresa</label>
                    <Input value={selectedUser?.company || ''} onChange={(e) => setSelectedUser({...selectedUser, company: e.target.value})} />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 h-12 text-lg font-bold" disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                    {isCreateMode ? 'Crear Usuario' : 'Guardar Cambios'}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-10 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">¡Operación Exitosa!</h3>
                <p className="text-gray-500 mb-8">El usuario se ha {isCreateMode ? 'creado' : 'actualizado'} correctamente.</p>
                <Button onClick={() => setIsEditOpen(false)} className="w-full h-12 bg-gray-900 font-bold">Entendido</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* --- DIÁLOGO DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <DialogContent className="sm:max-w-[400px] p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">¿Eliminar usuario?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500 my-4 text-sm">
            Esta acción no se puede deshacer. Se eliminará a <strong>{userToDelete?.name}</strong> y todos sus datos asociados.
          </p>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button variant="outline" onClick={() => setIsDeleteAlertOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : 'Sí, eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}