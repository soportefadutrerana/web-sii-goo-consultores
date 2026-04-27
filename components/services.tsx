'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, HelpCircle, Plus, Pencil, Trash2, Save, 
  Calculator, FileText, Users, Briefcase, ClipboardList, TrendingUp, Globe, Shield,
  ArrowUp, ArrowDown, Star 
} from 'lucide-react';
import EditableContent from './editable-content';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const ICON_OPTIONS = {
  Calculator: Calculator,
  FileText: FileText,
  Users: Users,
  Briefcase: Briefcase,
  ClipboardList: ClipboardList,
  TrendingUp: TrendingUp,
  Globe: Globe,
  Shield: Shield
};

interface Service {
  id?: string;
  titulo: string;
  descripcion: string;
  icono: string;
  puntos: string;
  destacado: boolean;
  orden?: number;
}

interface ServicesProps {
  isAdmin?: boolean;
  dbContent?: Record<string, string>;
}

export default function Services({ isAdmin = false, dbContent = {} }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentService, setCurrentService] = useState<Service>({
    titulo: '', descripcion: '', icono: 'Calculator', puntos: '', destacado: false
  });

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { ...currentService, orden: currentService.id ? currentService.orden : services.length };
    const method = currentService.id ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    if (!confirm('¿Eliminar este servicio?')) return;
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

  const moveService = async (index: number, direction: 'up' | 'down') => {
    const newServices = [...services];
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= newServices.length) return;
    [newServices[index], newServices[nextIndex]] = [newServices[nextIndex], newServices[index]];
    const updatedWithOrder = newServices.map((s, i) => ({ ...s, orden: i }));
    setServices(updatedWithOrder);
    try {
      await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWithOrder.map(s => ({ id: s.id, orden: s.orden }))),
      });
    } catch (error) {
      fetchServices();
    }
  };

  const renderIcon = (iconName: string, className: string) => {
    const IconComponent = ICON_OPTIONS[iconName as keyof typeof ICON_OPTIONS] || HelpCircle;
    return <IconComponent className={className} />;
  };

  const headTitle1 = dbContent.services_head_1 || "Nuestros ";
  const headTitle2 = dbContent.services_head_2 || "Servicios";
  const headSubtitle = dbContent.services_head_sub || "Soluciones integrales de gestoría...";

  return (
    <section id="servicios" className="py-20 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16 relative">
          {isAdmin && (
            <button 
              onClick={() => {
                setCurrentService({ titulo: '', descripcion: '', icono: 'Calculator', puntos: '', destacado: false });
                setIsDialogOpen(true);
              }}
              className="absolute -top-10 right-0 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all shadow-lg scale-90 hover:scale-100 z-30"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-bold">Añadir Servicio</span>
            </button>
          )}

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            <EditableContent page="servicios" section="services_head_1" initialContent={headTitle1} isAdmin={isAdmin}>
                <span>{headTitle1}</span>
            </EditableContent>
            <EditableContent page="servicios" section="services_head_2" initialContent={headTitle2} isAdmin={isAdmin}>
                <span className="text-blue-600">{headTitle2}</span>
            </EditableContent>
          </h2>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto">
            <EditableContent page="servicios" section="services_head_sub" initialContent={headSubtitle} isAdmin={isAdmin} multiline={true}>
                <p>{headSubtitle}</p>
            </EditableContent>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
          <AnimatePresence mode="popLayout">
            {services.map((service, index) => {
              const benefitsArray = service.puntos ? service.puntos.split(',').map(b => b.trim()).filter(b => b !== "") : [];

              return (
                <motion.div
                  key={service.id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  
                  // Animación de hover profesional
                  whileHover={{ 
                    y: -12, 
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 400, damping: 17 } 
                  }}

                  className={`relative group rounded-[2.5rem] p-9 transition-shadow duration-300 flex flex-col h-full cursor-default ${
                    service.destacado
                      ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl shadow-blue-200 hover:shadow-blue-300/50'
                      : 'bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-gray-200'
                  }`}
                >
                  {/* 👇 NUEVO MARCADOR DORADO ESTILO PREMIUM 👇 */}
                  {service.destacado && (
                    <div className="absolute -top-3 right-8 bg-gradient-to-r from-[#D4AF37] via-[#FFFACD] to-[#F9E076] text-[#403400] text-[11px] font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10 border-2 border-white">  <Star className="w-3 h-3 fill-[#403400]" />
                      <span>DESTACADO</span>
                    </div>
                  )}

                  {isAdmin && (
                    <>
                      <div className="absolute top-6 left-6 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button onClick={(e) => { e.stopPropagation(); moveService(index, 'up'); }} disabled={index === 0} className="p-1.5 bg-white/90 rounded-md text-blue-600 hover:bg-white shadow-sm disabled:opacity-30">
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); moveService(index, 'down'); }} disabled={index === services.length - 1} className="p-1.5 bg-white/90 rounded-md text-blue-600 hover:bg-white shadow-sm disabled:opacity-30">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button onClick={(e) => { e.stopPropagation(); setCurrentService(service); setIsDialogOpen(true); }} className="p-2 bg-white/90 rounded-full text-blue-600 hover:bg-white shadow-sm">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(service.id!); }} className="p-2 bg-red-500/90 rounded-full text-white hover:bg-red-600 shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}

                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${service.destacado ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                    {renderIcon(service.icono, "w-9 h-9")}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 tracking-tight leading-tight">{service.titulo}</h3>
                  <p className={`text-[15px] mb-8 leading-relaxed ${service.destacado ? 'text-blue-50' : 'text-gray-500 font-medium'}`}>
                    {service.descripcion}
                  </p>

                  <ul className={`mt-auto space-y-3.5 pt-6 border-t ${service.destacado ? 'border-white/10' : 'border-gray-50'}`}>
                    {benefitsArray.map((b, i) => (
                      <li key={i} className="flex items-start space-x-3 text-[13px] font-bold">
                        <CheckIcon className={service.destacado ? 'text-white' : 'text-blue-500'} />
                        <span className="leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{currentService.id ? 'Editar' : 'Nuevo'} Servicio</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Título</label>
              <Input placeholder="Título..." value={currentService.titulo} onChange={e => setCurrentService({...currentService, titulo: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Descripción</label>
              <Textarea placeholder="Descripción..." value={currentService.descripcion} onChange={e => setCurrentService({...currentService, descripcion: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Icono</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(ICON_OPTIONS).map((iconKey) => {
                  const Icon = ICON_OPTIONS[iconKey as keyof typeof ICON_OPTIONS];
                  return (
                    <button key={iconKey} type="button" onClick={() => setCurrentService({...currentService, icono: iconKey})}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center ${currentService.icono === iconKey ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}>
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Puntos clave</label>
              <Input placeholder="Separar con comas..." value={currentService.puntos} onChange={e => setCurrentService({...currentService, puntos: e.target.value})} />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl">
              <span className="text-sm font-bold text-blue-900">¿Destacar servicio?</span>
              <Switch checked={currentService.destacado} onCheckedChange={val => setCurrentService({...currentService, destacado: val})} />
            </div>
            <DialogFooter><Button type="submit" className="w-full bg-blue-600 font-bold" disabled={isSaving}>Guardar Servicio</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg className={`w-5 h-5 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}