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
import { Upload, Download, Trash2, FileText, File, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: string;
  cloud_storage_path: string;
  isPublic: boolean;
  createdAt: string;
  fileSize: number | null;
  user: {
    id: string;
    name: string;
    email: string;
    company: string | null;
  };
  project: {
    id: string;
    name: string;
  } | null;
}

interface Project {
  id: string;
  name: string;
}

export default function DocumentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  //Añadimos filtro para mostrar los proyectos por nombre o fecha
  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    type: 'invoice',
    projectId: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchDocuments();
      fetchProjects();
      fetchUserRole();
    }
  }, [status, router]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        const currentUser = allUsers.find((u: any) => u.email === session?.user?.email);
        if (currentUser) {
          setCurrentUserRole(currentUser.role || 'client');
        }
      }
    } catch (error) {
      console.error('Error al obtener rol:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadData.file) {
      toast.error('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);

    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('type', uploadData.type);
      if (uploadData.projectId) {
        formData.append('projectId', uploadData.projectId);
      }

      // Subir archivo al servidor
      const uploadResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Error al subir archivo');
      }

      toast.success('Documento subido correctamente');
      setIsDialogOpen(false);
      resetForm();
      fetchDocuments();
    } catch (error: any) {
      console.error('Error al subir documento:', error);
      toast.error(error.message || 'Error al subir documento');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      // Para archivos locales, simplemente abrimos la URL directamente
      const link = window.document.createElement('a');
      link.href = document.cloud_storage_path;
      link.download = document.name;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      toast.success('Descargando documento...');
    } catch (error) {
      console.error('Error al descargar documento:', error);
      toast.error('Error al descargar documento');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Documento eliminado');
        fetchDocuments();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar documento');
      }
    } catch (error) {
      toast.error('Error al eliminar documento');
    }
  };

  const resetForm = () => {
    setUploadData({
      file: null,
      type: 'invoice',
      projectId: '',
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
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

  const getDocTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      invoice: 'bg-blue-100 text-blue-800',
      contract: 'bg-purple-100 text-purple-800',
      report: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge className={colors[type] || colors.other}>
        {type}
      </Badge>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isGestorOrAdmin = currentUserRole === 'gestor' || currentUserRole === 'admin';

const filteredDocuments = documents.filter((doc) => {
    // Filtro por nombre (y por empresa del cliente si es admin/gestor)
    const searchString = `${doc.name} ${doc.user?.name || ''} ${doc.user?.company || ''}`.toLowerCase();
    const matchName = filterName === '' || searchString.includes(filterName.toLowerCase());

    // Filtro por fecha 
    let matchDate = true;
    if (filterDate) {
      const docDate = new Date(doc.createdAt);
      const docMonth = `${docDate.getFullYear()}-${String(docDate.getMonth() + 1).padStart(2, '0')}`;
      matchDate = docMonth === filterDate;
    }

    return matchName && matchDate;
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Documentos</h1>
          <p className="text-gray-600 mt-1">Administra facturas, contratos y documentos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Subir Documento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir Nuevo Documento</DialogTitle>
              <DialogDescription>
                Selecciona un archivo para subir. Se almacenará de forma segura en la nube.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Archivo *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  required
                  disabled={uploading}
                />
                {uploadData.file && (
                  <p className="text-sm text-gray-600">
                    Tamaño: {formatFileSize(uploadData.file.size)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Documento *</Label>
                <Select
                  value={uploadData.type}
                  onValueChange={(value) => setUploadData({ ...uploadData, type: value })}
                  disabled={uploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Factura</SelectItem>
                    <SelectItem value="contract">Contrato</SelectItem>
                    <SelectItem value="report">Informe</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectId">Proyecto (opcional)</Label>
                <Select
                  value={uploadData.projectId || undefined}
                  onValueChange={(value) => setUploadData({ ...uploadData, projectId: value === 'none' ? '' : value })}
                  disabled={uploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  disabled={uploading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Subiendo...
                    </>
                  ) : (
                    'Subir Documento'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Listado de Documentos
          </CardTitle>
          <CardDescription>
            {documents.length} documento{documents.length !== 1 ? 's' : ''} en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 👇 BARRA DE FILTROS 👇 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
            <div className="flex-1">
              <Label htmlFor="filterName" className="mb-2 block text-gray-600">Buscar documento</Label>
              <Input
                id="filterName"
                placeholder="Nombre, cliente o empresa..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="bg-white h-10"
              />
            </div>
            
            <div className="w-full sm:w-64 relative">
              <Label className="mb-2 block text-gray-600">Mes de subida</Label>
              <button
                type="button"
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                className="w-full h-10 flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              >
                <span className={filterDate ? "text-gray-900 font-medium capitalize" : "text-gray-500"}>
                  {filterDate 
                    ? new Date(parseInt(filterDate.split('-')[0]), parseInt(filterDate.split('-')[1]) - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                    : "Seleccionar mes..."}
                </span>
                <Calendar className="w-4 h-4 text-gray-500" />
              </button>

              {showMonthPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMonthPicker(false)} />
                  <div className="absolute top-[72px] left-0 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="flex justify-between items-center mb-4">
                      <button onClick={() => setPickerYear(y => y - 1)} className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="font-semibold text-gray-800">{pickerYear}</span>
                      <button onClick={() => setPickerYear(y => y + 1)} className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {meses.map((mes, index) => {
                        const monthValue = `${pickerYear}-${String(index + 1).padStart(2, '0')}`;
                        const isSelected = filterDate === monthValue;
                        return (
                          <button
                            key={mes}
                            onClick={() => { setFilterDate(monthValue); setShowMonthPicker(false); }}
                            className={`py-2 text-sm rounded-md transition-all ${isSelected ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium border border-transparent hover:border-blue-100'}`}
                          >
                            {mes}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {(filterName || filterDate) && (
              <div className="flex items-end">
                <Button variant="ghost" onClick={() => { setFilterName(''); setFilterDate(''); }} className="h-10 text-red-600 hover:text-red-700 hover:bg-red-50">
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
          {/* 👆 FIN BARRA DE FILTROS 👆 */}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Proyecto</TableHead>
                  {isGestorOrAdmin && <TableHead>Cliente</TableHead>}
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 👇 AQUI USAMOS filteredDocuments 👇 */}
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isGestorOrAdmin ? 7 : 6} className="text-center py-8 text-gray-500">
                      {documents.length === 0 
                        ? "No hay documentos subidos. Sube tu primer documento." 
                        : "No hay documentos que coincidan con los filtros."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <File className="w-4 h-4 mr-2 text-gray-400" />
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>{getDocTypeBadge(doc.type)}</TableCell>
                      <TableCell>
                        {doc.project ? (
                          <Badge variant="outline">{doc.project.name}</Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin asignar</span>
                        )}
                      </TableCell>
                      {isGestorOrAdmin && (
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{doc.user.name}</div>
                            <div className="text-gray-500 text-xs">
                              {doc.user.company || doc.user.email}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="text-sm text-gray-600">
                        {formatFileSize(doc.fileSize)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(doc.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar documento?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El documento "{doc.name}" será eliminado permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(doc.id)}
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