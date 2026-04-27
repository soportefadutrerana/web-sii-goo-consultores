'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditableImageProps {
  page: string;
  section: string;
  initialContent: string; 
  isAdmin: boolean;
  alt: string;
  className?: string; 
}

export default function EditableImage({ 
  page, 
  section, 
  initialContent, 
  isAdmin, 
  alt,
  className = ""
}: EditableImageProps) {
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return <img src={initialContent} alt={alt} className={className} />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación básica de tamaño (ej: máximo 2MB para no reventar la base de datos)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen es muy grande. Máximo 2MB.');
      return;
    }

    setIsSaving(true);
    const reader = new FileReader();
    reader.readAsDataURL(file); // Esto convierte el archivo a Base64
    
    reader.onload = async () => {
      const base64String = reader.result as string;
      await handleSave(base64String);
    };
    
    reader.onerror = () => {
      toast.error('Error al leer el archivo');
      setIsSaving(false);
    };
  };

  const handleSave = async (base64String: string) => {
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          section,
          type: 'image', 
          content: base64String,
        }),
      });

      if (response.ok) {
        toast.success('Imagen actualizada con éxito');
        window.location.reload(); 
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error) {
      toast.error('No se pudo guardar la imagen');
    } finally {
      setIsSaving(false);
    }
  };

  // Vista del Admin: Muestra la imagen pero con un botón para cambiarla
  return (
    <div className="group relative w-full h-full inline-block">
      {/* Botón flotante para subir foto */}
  <button
    onClick={() => fileInputRef.current?.click()}
    disabled={isSaving}
    className="absolute top-24 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-40 hover:bg-blue-700 flex items-center justify-center hover:scale-110 active:scale-95" 
    title="Cambiar imagen"
  >
    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
  </button>
      
      {/* Input oculto que se abre al hacer clic en el botón */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
      />
      
      {/* La imagen en sí con un leve efecto hover */}
      <img 
        src={initialContent} 
        alt={alt} 
        className={`${className} transition-all duration-300 group-hover:brightness-75`} 
      />
    </div>
  );
}