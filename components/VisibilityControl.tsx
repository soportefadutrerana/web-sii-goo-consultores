'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VisibilityControlProps {
  page: string;
  section: string; 
  isVisible: boolean;
  isAdmin: boolean;
}

export default function VisibilityControl({ page, section, isVisible, isAdmin }: VisibilityControlProps) {
  const [active, setActive] = useState(isVisible);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isAdmin) return null;

  const toggleVisibility = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          section: `${section}_status`, 
          type: 'text',
          content: active ? 'hidden' : 'visible',
        }),
      });

      if (response.ok) {
        setActive(!active);
        toast.success(active ? 'Sección oculta para clientes' : 'Sección visible para clientes');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Error al cambiar visibilidad');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="absolute -top-10 left-0 z-50">
      <button
        onClick={toggleVisibility}
        disabled={isUpdating}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all ${
          active 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        }`}
      >
        {isUpdating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : active ? (
          <Eye className="w-3 h-3" />
        ) : (
          <EyeOff className="w-3 h-3" />
        )}
        <span>{active ? 'VISIBLE' : 'OCULTO'}</span>
      </button>
    </div>
  );
}