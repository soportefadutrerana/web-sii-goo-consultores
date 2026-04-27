'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }
    if (password.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
        toast.success('Contraseña establecida con éxito');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        const data = await res.json();
        toast.error(data.error || 'El enlace ha expirado o es inválido');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center p-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">¡Todo listo!</h2>
          <p className="text-gray-500 mb-6">Tu contraseña ha sido configurada. Redirigiendo al inicio de sesión...</p>
          <Button onClick={() => router.push('/login')} className="w-full bg-blue-600">Ir al Login ahora</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="space-y-1">
          <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-center">Configurar Contraseña</CardTitle>
          <p className="text-sm text-center text-gray-500">Hola. Por favor, elige una contraseña para tu cuenta de Sii Goo Consultores.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nueva Contraseña</label>
              <Input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmar Contraseña</label>
              <Input 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 h-11" disabled={loading || !token}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Activar mi cuenta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}