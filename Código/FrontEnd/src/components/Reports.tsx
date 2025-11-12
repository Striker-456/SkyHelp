import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, TrendingUp, TrendingDown, Users, Clock, CheckCircle, AlertTriangle, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface ReportsProps {
  userRole: string;
}

export function Reports({ userRole }: ReportsProps) {
  // Datos para gráfico de tickets por estado
  const ticketsByStatus = [
    { name: 'Pendientes', value: 45, color: '#f59e0b' },
    { name: 'Asignados', value: 32, color: '#8b5cf6' },
    { name: 'En Progreso', value: 28, color: '#3b82f6' },
    { name: 'Resueltos', value: 142, color: '#10b981' },
  ];

  // Datos para gráfico de tendencia mensual
  const monthlyTrend = [
    { mes: 'Ene', nuevos: 24, resueltos: 18, pendientes: 6 },
    { mes: 'Feb', nuevos: 31, resueltos: 25, pendientes: 8 },
    { mes: 'Mar', nuevos: 28, resueltos: 32, pendientes: 4 },
    { mes: 'Abr', nuevos: 35, resueltos: 29, pendientes: 10 },
    { mes: 'May', nuevos: 42, resueltos: 38, pendientes: 14 },
    { mes: 'Jun', nuevos: 38, resueltos: 41, pendientes: 11 },
  ];

  // Datos para gráfico de prioridades
  const priorityData = [
    { name: 'Baja', value: 67, color: '#10b981' },
    { name: 'Media', value: 89, color: '#f59e0b' },
    { name: 'Alta', value: 45, color: '#f97316' },
    { name: 'Crítica', value: 12, color: '#ef4444' },
  ];

  // Datos para tiempo de resolución por técnico
  const technicianPerformance = [
    { tecnico: 'Juan Pérez', promedio: 2.3, tickets: 45 },
    { tecnico: 'Ana García', promedio: 1.8, tickets: 52 },
    { tecnico: 'Pedro Rodríguez', promedio: 2.1, tickets: 38 },
    { tecnico: 'María López', promedio: 1.9, tickets: 41 },
    { tecnico: 'Carlos Ruiz', promedio: 2.5, tickets: 33 },
  ];

  // Métricas principales
  const metrics = [
    {
      title: 'Tickets Totales',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: 'Tiempo Prom. Resolución',
      value: '2.1 días',
      change: '-8%',
      trend: 'down',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Satisfacción Cliente',
      value: '94.5%',
      change: '+3%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Tickets Críticos',
      value: '12',
      change: '-25%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Reportes y Estadísticas</h2>
          <p className="text-gray-600">Análisis detallado del rendimiento del sistema</p>
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="ultimo-mes">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultima-semana">Última Semana</SelectItem>
              <SelectItem value="ultimo-mes">Último Mes</SelectItem>
              <SelectItem value="ultimo-trimestre">Último Trimestre</SelectItem>
              <SelectItem value="ultimo-ano">Último Año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${metric.color}`} />
                <Badge variant="secondary" className="text-xs">
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Estados de tickets */}
        <Card className="p-6">
          <h3 className="mb-4">Tickets por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ticketsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de torta - Prioridades */}
        <Card className="p-6">
          <h3 className="mb-4">Distribución por Prioridad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {priorityData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Gráfico de líneas - Tendencia mensual */}
      <Card className="p-6">
        <h3 className="mb-4">Tendencia Mensual de Tickets</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="nuevos" 
              stackId="1"
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
              name="Nuevos"
            />
            <Area 
              type="monotone" 
              dataKey="resueltos" 
              stackId="2"
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.6}
              name="Resueltos"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Rendimiento por técnico */}
      {(userRole === 'administrador') && (
        <Card className="p-6">
          <h3 className="mb-4">Rendimiento por Técnico</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={technicianPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 3]} />
              <YAxis dataKey="tecnico" type="category" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value} días`, 'Tiempo Promedio']}
              />
              <Bar dataKey="promedio" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Tabla de resumen */}
      <Card className="p-6">
        <h3 className="mb-4">Resumen de Actividad</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Métrica</th>
                <th className="text-left py-3 px-4">Valor Actual</th>
                <th className="text-left py-3 px-4">Mes Anterior</th>
                <th className="text-left py-3 px-4">Cambio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 font-medium">Tickets Creados</td>
                <td className="py-3 px-4">38</td>
                <td className="py-3 px-4">42</td>
                <td className="py-3 px-4">
                  <Badge variant="secondary" className="text-red-600">-9.5%</Badge>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Tickets Resueltos</td>
                <td className="py-3 px-4">41</td>
                <td className="py-3 px-4">38</td>
                <td className="py-3 px-4">
                  <Badge variant="secondary" className="text-green-600">+7.9%</Badge>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Tiempo Promedio</td>
                <td className="py-3 px-4">2.1 días</td>
                <td className="py-3 px-4">2.3 días</td>
                <td className="py-3 px-4">
                  <Badge variant="secondary" className="text-green-600">-8.7%</Badge>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Satisfacción Cliente</td>
                <td className="py-3 px-4">94.5%</td>
                <td className="py-3 px-4">91.8%</td>
                <td className="py-3 px-4">
                  <Badge variant="secondary" className="text-green-600">+2.9%</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}