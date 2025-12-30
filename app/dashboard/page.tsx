"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from "recharts";
import {
  Building2, TrendingUp, DollarSign, Briefcase, FileText,
  LogOut, Menu, X, Home, FolderOpen, MessageSquare, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  type: string;
  reference: string;
  status: string;
  budget: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  startDate: string;
  endDate: string | null;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (response.ok) {
        // Mapear los datos de la API al formato esperado
        const mappedProjects = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          reference: p.reference || p.name,
          status: p.status,
          budget: p.budget,
          totalIncome: p.totalIncome,
          totalExpenses: p.totalExpenses,
          netProfit: p.netProfit,
          profitMargin: p.profitMargin,
          startDate: p.startDate,
          endDate: p.endDate || null,
        }));
        setProjects(mappedProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "activo").length;
  const totalRevenue = projects.reduce((sum, p) => sum + p.totalIncome, 0);
  const totalProfit = projects.reduce((sum, p) => sum + p.netProfit, 0);
  const avgProfitMargin = projects.length > 0
    ? projects.reduce((sum, p) => sum + p.profitMargin, 0) / projects.length
    : 0;

  const projectsByType = projects.reduce((acc, project) => {
    const type = project.type;
    if (!acc[type]) {
      acc[type] = { name: type, value: 0, count: 0 };
    }
    acc[type].value += project.netProfit;
    acc[type].count += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const pieData = Object.values(projectsByType).map(item => ({
    name: `${item.name} (${item.count})`,
    value: item.value,
  }));

  const barData = projects.slice(0, 8).map(p => ({
    name: p.reference || p.name.substring(0, 20),
    Ingresos: p.totalIncome,
    Gastos: p.totalExpenses,
    Beneficio: p.netProfit,
  }));

  const marginData = projects.slice(0, 10).map(p => ({
    name: p.reference || p.name.substring(0, 15),
    margen: p.profitMargin,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SIi Goo</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{(session.user as any).name}</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/projects')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              <span>Proyectos</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/documents')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Documentos</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/messages')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Mensajes</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </button>
          </nav>

          <div className="p-4 border-t">
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="ghost"
              className="w-full flex items-center space-x-3 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesion</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Analisis de Rentabilidad</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{(session.user as any).company}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Briefcase className="w-8 h-8" />}
              title="Total Proyectos"
              value={totalProjects}
              subtitle={`${activeProjects} activos`}
              color="blue"
            />
            <StatCard
              icon={<DollarSign className="w-8 h-8" />}
              title="Ingresos Totales"
              value={`${totalRevenue.toLocaleString()}€`}
              subtitle="Acumulado"
              color="green"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Beneficio Total"
              value={`${totalProfit.toLocaleString()}€`}
              subtitle="Neto"
              color="purple"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Margen Promedio"
              value={`${avgProfitMargin.toFixed(1)}%`}
              subtitle="Rentabilidad"
              color="orange"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Analisis Financiero por Proyecto</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Ingresos" fill="#10b981" />
                  <Bar dataKey="Gastos" fill="#ef4444" />
                  <Bar dataKey="Beneficio" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Distribucion de Beneficios por Tipo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Margen de Rentabilidad por Proyecto</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marginData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: "Margen (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="margen" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Projects Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Proyectos Recientes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Presupuesto</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ingresos</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Beneficio</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.reference}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {project.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          project.status === "activo" ? "bg-green-100 text-green-800" :
                          project.status === "completado" ? "bg-gray-100 text-gray-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">{project.budget.toLocaleString()}€</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">{project.totalIncome.toLocaleString()}€</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-green-600">{project.netProfit.toLocaleString()}€</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-bold ${
                          project.profitMargin > 30 ? "text-green-600" :
                          project.profitMargin > 15 ? "text-blue-600" :
                          project.profitMargin > 5 ? "text-orange-600" :
                          "text-red-600"
                        }`}>
                          {project.profitMargin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }: any) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${colors[color as keyof typeof colors]} flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}