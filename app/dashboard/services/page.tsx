'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Check, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Service {
  id?: string;
  titulo: string;
  descripcion: string;
  icono: string;
  puntos: string; // Formato: "punto 1, punto 2, punto 3"
  destacado: boolean;
}

export default function GestionServiciosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para el servicio que estamos editando o creando
  const [currentService, setCurrentService] = useState<Service>({
    titulo: '',
    descripcion: '',
    icono: '',
    puntos: '',
    destacado: false
  });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) setServices(await res.json());
    } catch (error) {
      toast.error('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentService({ ...currentService, icono: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const method = currentService.id ? 'PUT' : 'POST';
    
    try {
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentService),
      });

      if (res.ok) {
        toast.success(currentService.id ? 'Servicio actualizado' : 'Servicio creado');
        setIsDialogOpen(false);
        fetchServices();
      }
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Servicio eliminado');
        fetchServices();
      }
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10 text-blue-600" /></div>;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-gray-500">Añade, edita o elimina los servicios de la web pública</p>
        </div>
        <Button 
          onClick={() => {
            setCurrentService({ titulo: '', descripcion: '', icono: '', puntos: '', destacado: false });
            setIsDialogOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
        >
          <Plus className="mr-2 w-4 h-4" /> Nuevo Servicio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.id} className="relative group">
            {/* Botones de acción rápidos que aparecen al hacer hover */}
            <div className="absolute top-4 right-4 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="rounded-full shadow-md" onClick={() => { setCurrentService(service); setIsDialogOpen(true); }}>
                <Pencil className="w-4 h-4 text-blue-600" />
              </Button>
              <Button size="icon" variant="destructive" className="rounded-full shadow-md" onClick={() => handleDelete(service.id!)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Réplica de la tarjeta visual */}
            <div className={`h-full p-8 rounded-[2rem] border transition-all ${service.destacado ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 border-transparent' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${service.destacado ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                {service.icono ? (
                  <img src={service.icono} alt="icon" className="w-8 h-8 object-contain" />
                ) : (
                  <ImageIcon className="w-8 h-8" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-4">{service.titulo}</h3>
              <p className={`text-sm mb-6 leading-relaxed ${service.destacado ? 'text-blue-50' : 'text-gray-500'}`}>
                {service.descripcion}
              </p>
              <ul className="space-y-3">
                {service.puntos.split(',').map((punto, i) => (
                  <li key={i} className="flex items-center text-sm font-medium">
                    <Check className={`w-4 h-4 mr-3 flex-shrink-0 ${service.destacado ? 'text-white' : 'text-blue-500'}`} />
                    {punto.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE EDICIÓN / CREACIÓN */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentService.id ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Título del Servicio</label>
                <Input 
                  placeholder="Ej: Asesoría Fiscal" 
                  value={currentService.titulo}
                  onChange={(e) => setCurrentService({...currentService, titulo: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center space-x-2 pb-2">
                  <Switch 
                    checked={currentService.destacado} 
                    onCheckedChange={(val) => setCurrentService({...currentService, destacado: val})} 
                  />
                  <label className="text-sm font-bold text-gray-700">Marcar como Destacado (Azul)</label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Descripción Corta</label>
              <Textarea 
                placeholder="Breve resumen del servicio..." 
                value={currentService.descripcion}
                onChange={(e) => setCurrentService({...currentService, descripcion: e.target.value})}
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Puntos Clave (separados por comas)</label>
              <Input 
                placeholder="Punto 1, Punto 2, Punto 3..." 
                value={currentService.puntos}
                onChange={(e) => setCurrentService({...currentService, puntos: e.target.value})}
                required 
              />
              <p className="text-[10px] text-gray-400 italic">Aparecerán con un check (✓) debajo de la descripción.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Icono (Imagen Base64)</label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                  {currentService.icono ? (
                    <img src={currentService.icono} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-400" />
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleFileChange} className="flex-1" />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[120px]" disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="mr-2 w-4 h-4" />}
                Guardar Servicio
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}