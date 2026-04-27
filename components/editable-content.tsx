'use client';

import { useState } from 'react';
import { Pencil, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface EditableContentProps {
  page: string;
  section: string;
  initialContent: string;
  isAdmin: boolean;
  multiline?: boolean;
  children: React.ReactNode;
}

export default function EditableContent({ 
  page, 
  section, 
  initialContent, 
  isAdmin, 
  multiline = false,
  children 
}: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  if (!isAdmin) {
    return <>{children}</>;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          section,
          type: 'text',
          content: content.trim(), // Limpiamos espacios
        }),
      });

      if (response.ok) {
        toast.success('Texto actualizado');
        setIsEditing(false);
        window.location.reload(); 
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error) {
      toast.error('No se pudo guardar');
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="relative bg-white/95 p-4 rounded-xl border-2 border-blue-500 shadow-2xl z-50 my-2 text-left">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Editando: {section}</span>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-6 w-6 p-0 rounded-full hover:bg-gray-200">
            <X className="w-4 h-4 text-gray-500" />
          </Button>
        </div>
        
        {multiline ? (
          <Textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="min-h-[120px] text-gray-900 mb-3 border-blue-200 focus:border-blue-500"
            placeholder="Escribe el contenido aquí..."
          />
        ) : (
          <input 
            type="text" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="w-full p-2 border rounded-md text-gray-900 mb-3 border-blue-200 focus:border-blue-500 outline-none"
            placeholder="Escribe el título aquí..."
            autoFocus
          />
        )}
        
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Cambios
          </Button>
        </div>
      </div>
    );
  }

  // Comprobamos si el contenido visual está realmente vacío
  const isEmpty = !initialContent || initialContent.trim() === "";

  return (
    <div className={`group relative inline-block w-full rounded-lg transition-all duration-200 
      ${isAdmin ? 'hover:ring-2 hover:ring-blue-400 hover:ring-offset-2' : ''}
      ${isEmpty && isAdmin ? 'border-2 border-dashed border-blue-300 min-h-[2.5rem] bg-blue-50/30' : ''}
    `}>
      
      {/* Botón flotante de edición */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsEditing(true);
        }}
        className="absolute -top-3 -right-3 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-40 hover:bg-blue-700 hover:scale-110 active:scale-95"
        title="Editar este campo"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>

      {/* Si está vacío, mostramos un texto de ayuda para que el admin sepa dónde clicar */}
      {isEmpty && isAdmin ? (
        <div className="flex items-center justify-center w-full h-full min-h-[2.5rem] text-blue-400 text-sm italic cursor-pointer italic px-4">
          Escribir {section.replace(/_/g, ' ')}...
        </div>
      ) : (
        children
      )}
    </div>
  );
}