"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, LabelList, Area, AreaChart
} from "recharts";
import {
  TrendingUp, DollarSign, Briefcase
} from "lucide-react";

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

const COLORS = [
  "#3b82f6", // Azul
  "#10b981", // Verde
  "#f59e0b", // Naranja
  "#ef4444", // Rojo
  "#8b5cf6", // Púrpura
  "#ec4899", // Rosa
  "#06b6d4", // Cian
  "#84cc16", // Lima
];

// Tooltip personalizado para las gráficas
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{payload[0]?.payload?.fullName || label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Tooltip para el gráfico de líneas
const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const fullName = payload[0]?.payload?.fullName || label;
    const getMarginColor = (margin: number) => {
      if (margin >= 30) return 'text-emerald-600';
      if (margin >= 15) return 'text-blue-600';
      if (margin >= 5) return 'text-amber-600';
      return 'text-red-600';
    };
    
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"></div>
          <p className="font-bold text-gray-900 text-sm">{fullName}</p>
        </div>
        <div className="flex items-baseline gap-2">
          <p className={`text-2xl font-bold ${getMarginColor(value)}`}>
            {value.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 font-medium">Margen de Rentabilidad</p>
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
  const activeProjects = projects.filter(p => p.status === "activo" || p.status === "active").length;
  const totalRevenue = projects.reduce((sum, p) => sum + (p.totalIncome || 0), 0);
  const totalProfit = projects.reduce((sum, p) => sum + (p.netProfit || 0), 0);
  const avgProfitMargin = projects.length > 0
    ? projects.reduce((sum, p) => sum + (p.profitMargin || 0), 0) / projects.length
    : 0;

  const projectsByType = projects.reduce((acc, project) => {
    const type = project.type || 'Sin tipo';
    if (!acc[type]) {
      acc[type] = { name: type, value: 0, count: 0 };
    }
    acc[type].value += (project.netProfit || 0);
    acc[type].count += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const pieData = Object.values(projectsByType).map(item => ({
    name: `${item.name} (${item.count})`,
    value: item.value,
  }));

  // Función para truncar nombres de forma inteligente
  const truncateName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  };

  const barData = projects.slice(0, 8).map(p => ({
    name: truncateName(p.name, 20),
    fullName: p.name, // Guardar nombre completo para tooltip
    Ingresos: p.totalIncome || 0,
    Gastos: p.totalExpenses || 0,
    Beneficio: p.netProfit || 0,
  }));

  const marginData = projects.slice(0, 10).map(p => ({
    name: truncateName(p.name, 20),
    fullName: p.name, // Guardar nombre completo para tooltip
    margen: p.profitMargin || 0,
  }));

  return (
    <>
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Análisis de Rentabilidad</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Briefcase className="w-6 h-6" />}
              title="Total Proyectos"
              value={totalProjects}
              subtitle={`${activeProjects} activos`}
              color="blue"
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Ingresos Totales"
              value={`${totalRevenue.toLocaleString('es-ES')}€`}
              subtitle="Acumulado"
              color="green"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Beneficio Total"
              value={`${totalProfit.toLocaleString('es-ES')}€`}
              subtitle="Neto"
              color="purple"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Margen Promedio"
              value={`${avgProfitMargin.toFixed(1)}%`}
              subtitle="Rentabilidad"
              color="orange"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Análisis Financiero por Proyecto</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="rect"
                  />
                  <Bar 
                    dataKey="Ingresos" 
                    fill="#10b981" 
                    radius={[8, 8, 0, 0]}
                    name="Ingresos"
                  />
                  <Bar 
                    dataKey="Gastos" 
                    fill="#ef4444" 
                    radius={[8, 8, 0, 0]}
                    name="Gastos"
                  />
                  <Bar 
                    dataKey="Beneficio" 
                    fill="#3b82f6" 
                    radius={[8, 8, 0, 0]}
                    name="Beneficio"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Distribución de Beneficios por Tipo</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, value }) => {
                      const percentage = ((percent || 0) * 100).toFixed(1);
                      return `${name.split(' (')[0]}: ${percentage}%`;
                    }}
                    outerRadius={110}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-semibold text-gray-900 mb-2">{payload[0].name}</p>
                            <p className="text-sm" style={{ color: payload[0].payload.fill }}>
                              {`Valor: ${payload[0].value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {`Porcentaje: ${((payload[0].payload.percent || 0) * 100).toFixed(1)}%`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Margen de Rentabilidad por Proyecto</h3>
                <p className="text-sm text-gray-500 mt-1">Análisis de rentabilidad por proyecto</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"></div>
                <span className="text-xs font-semibold text-violet-700">Margen (%)</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart 
                data={marginData}
                margin={{ top: 20, right: 30, left: 40, bottom: 100 }}
              >
                <defs>
                  <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  opacity={0.4}
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={120}
                  tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                  tickLine={{ stroke: '#d1d5db' }}
                  interval={0}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  label={{ 
                    value: "Margen (%)", 
                    angle: -90, 
                    position: "insideLeft", 
                    style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12, fontWeight: 600 } 
                  }}
                  tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                  tickLine={{ stroke: '#d1d5db' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  content={<CustomLineTooltip />}
                  cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area
                  type="monotone"
                  dataKey="margen"
                  stroke="none"
                  fill="url(#colorMargin)"
                />
                <Line 
                  type="monotone" 
                  dataKey="margen" 
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ 
                    fill: '#8b5cf6', 
                    strokeWidth: 3, 
                    stroke: '#fff',
                    r: 5,
                    style: { filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))' }
                  }}
                  activeDot={{ 
                    r: 8, 
                    stroke: '#fff',
                    strokeWidth: 3,
                    fill: '#8b5cf6',
                    style: { filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.5))' }
                  }}
                  name="Margen (%)"
                />
              </AreaChart>
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
                      <td className="px-6 py-4 text-right text-sm text-gray-900">
                        {(project.budget || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">
                        {(project.totalIncome || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-green-600">
                        {(project.netProfit || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-bold ${
                          (project.profitMargin || 0) > 30 ? "text-green-600" :
                          (project.profitMargin || 0) > 15 ? "text-blue-600" :
                          (project.profitMargin || 0) > 5 ? "text-orange-600" :
                          "text-red-600"
                        }`}>
                          {(project.profitMargin || 0).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </>
  );
}

function StatCard({ icon, title, value, subtitle, color }: any) {
  const colorConfig = {
    blue: {
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "bg-blue-500",
      border: "border-blue-100",
    },
    green: {
      gradient: "from-emerald-500 via-emerald-600 to-emerald-700",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "bg-emerald-500",
      border: "border-emerald-100",
    },
    purple: {
      gradient: "from-violet-500 via-violet-600 to-violet-700",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      accent: "bg-violet-500",
      border: "border-violet-100",
    },
    orange: {
      gradient: "from-amber-500 via-amber-600 to-amber-700",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      accent: "bg-amber-500",
      border: "border-amber-100",
    },
  };

  const config = colorConfig[color as keyof typeof colorConfig] || colorConfig.blue;

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
      {/* Accent bar at top */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${config.accent} group-hover:h-1.5 transition-all duration-300`} />
      
      {/* Background gradient decoration - más visible en hover */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-5 group-hover:opacity-10 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity duration-300`} />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 group-hover:text-gray-600 transition-colors">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mb-1 tracking-tight group-hover:scale-105 transition-transform duration-300 inline-block">
            {value}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-1.5 h-1.5 rounded-full ${config.accent} group-hover:scale-125 transition-transform duration-300`} />
            <p className="text-sm font-medium text-gray-600">{subtitle}</p>
          </div>
        </div>
        
        {/* Icon container */}
        <div className={`${config.iconBg} rounded-xl p-3 ml-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
          <div className={config.iconColor}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}