'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  budget: number;
  income: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    company: string | null;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string;
}

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'obra',
    status: 'active',
    budget: '',
    income: '',
    expenses: '',
    userId: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchProjects();
      fetchUserRole();
    }
  }, [status, router]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        setUsers(allUsers);
        const currentUser = allUsers.find((u: User) => u.email === session?.user?.email);
        if (currentUser) {
          setCurrentUserRole(currentUser.role || 'client');
        }
      }
    } catch (error) {
      console.error('Error al obtener rol:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        // Transformar los datos del API al formato esperado por el frontend
        const transformedData = data.map((project: any) => ({
          ...project,
          income: project.totalIncome ?? 0,
          expenses: project.totalExpenses ?? 0,
          profit: project.netProfit ?? 0,
        }));
        setProjects(transformedData);
      }
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProject ? '/api/projects' : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const payload = editingProject
        ? { ...formData, id: editingProject.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingProject ? 'Proyecto actualizado' : 'Proyecto creado');
        setIsDialogOpen(false);
        resetForm();
        fetchProjects();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al guardar proyecto');
      }
    } catch (error) {
      toast.error('Error al guardar proyecto');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Proyecto eliminado');
        fetchProjects();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar proyecto');
      }
    } catch (error) {
      toast.error('Error al eliminar proyecto');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      type: project.type,
      status: project.status,
      budget: (project.budget ?? 0).toString(),
      income: (project.income ?? 0).toString(),
      expenses: (project.expenses ?? 0).toString(),
      userId: project.user.id,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'obra',
      status: 'active',
      budget: '',
      income: '',
      expenses: '',
      userId: '',
    });
    setEditingProject(null);
  };

  const formatCurrency = (value: number) => {
    if (isNaN(value) || value === null || value === undefined) {
      return '0,00 €';
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      active: 'default',
      completed: 'secondary',
      paused: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 20) return 'text-green-600 font-semibold';
    if (margin >= 10) return 'text-blue-600 font-semibold';
    if (margin >= 0) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isGestorOrAdmin = currentUserRole === 'gestor' || currentUserRole === 'admin';

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
          <p className="text-gray-600 mt-1">Administra tus proyectos y su rentabilidad</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
              </DialogTitle>
              <DialogDescription>
                Completa la información del proyecto. Los cálculos de beneficio y margen se realizan automáticamente.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Proyecto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type || undefined}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="obra">Obra</SelectItem>
                      <SelectItem value="siniestro">Siniestro</SelectItem>
                      <SelectItem value="reforma">Reforma</SelectItem>
                      <SelectItem value="consultoria">Consultoría</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status || undefined}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="paused">Pausado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isGestorOrAdmin && (
                  <div className="space-y-2">
                    <Label htmlFor="userId">Cliente</Label>
                    <Select
                      value={formData.userId || undefined}
                      onValueChange={(value) => setFormData({ ...formData, userId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter((u) => u.role === 'client')
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.company || user.email})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Presupuesto (€)</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">Ingresos (€)</Label>
                  <Input
                    id="income"
                    type="number"
                    step="0.01"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenses">Gastos (€)</Label>
                  <Input
                    id="expenses"
                    type="number"
                    step="0.01"
                    value={formData.expenses}
                    onChange={(e) => setFormData({ ...formData, expenses: e.target.value })}
                  />
                </div>
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
                  {editingProject ? 'Actualizar' : 'Crear Proyecto'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
            Listado de Proyectos
          </CardTitle>
          <CardDescription>
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''} en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  {isGestorOrAdmin && <TableHead>Cliente</TableHead>}
                  <TableHead className="text-right">Presupuesto</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Gastos</TableHead>
                  <TableHead className="text-right">Beneficio</TableHead>
                  <TableHead className="text-right">Margen</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isGestorOrAdmin ? 10 : 9} className="text-center py-8 text-gray-500">
                      No hay proyectos creados. Crea tu primer proyecto.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      {isGestorOrAdmin && (
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{project.user.name}</div>
                            <div className="text-gray-500 text-xs">
                              {project.user.company || project.user.email}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="text-right">{formatCurrency(project.budget)}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(project.income)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(project.expenses)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(project.profit)}
                      </TableCell>
                      <TableCell className={`text-right ${getMarginColor(project.profitMargin)}`}>
                        {isNaN(project.profitMargin) ? '0.0' : project.profitMargin.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El proyecto "{project.name}" será eliminado permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(project.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}