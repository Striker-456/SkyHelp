import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart3, Clock, CheckCircle, AlertCircle, TrendingUp, Users, Wrench } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DeliveryMap } from "./DeliveryMap";

interface DashboardProps {
  userRole: string;
}

export function Dashboard({ userRole }: DashboardProps) {
  const getStats = () => {
    switch (userRole) {
      case 'administrador':
        return [
          { label: 'Tickets Totales', value: '247', icon: BarChart3, color: 'bg-blue-500' },
          { label: 'Pendientes', value: '45', icon: Clock, color: 'bg-yellow-500' },
          { label: 'Resueltos Hoy', value: '12', icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Críticos', value: '3', icon: AlertCircle, color: 'bg-red-500' },
        ];
      case 'tecnico':
        return [
          { label: 'Mis Tickets', value: '18', icon: Wrench, color: 'bg-blue-500' },
          { label: 'En Progreso', value: '7', icon: Clock, color: 'bg-yellow-500' },
          { label: 'Completados', value: '142', icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Urgentes', value: '2', icon: AlertCircle, color: 'bg-red-500' },
        ];
      case 'cliente':
        return [
          { label: 'Mis Tickets', value: '5', icon: BarChart3, color: 'bg-blue-500' },
          { label: 'En Proceso', value: '2', icon: Clock, color: 'bg-yellow-500' },
          { label: 'Resueltos', value: '23', icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Pendientes', value: '1', icon: AlertCircle, color: 'bg-orange-500' },
        ];
      default:
        return [
          { label: 'Entregas Hoy', value: '8', icon: Users, color: 'bg-blue-500' },
          { label: 'En Ruta', value: '3', icon: Clock, color: 'bg-yellow-500' },
          { label: 'Completadas', value: '67', icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Pendientes', value: '2', icon: AlertCircle, color: 'bg-orange-500' },
        ];
    }
  };

  const stats = getStats();

  const recentTickets = [
    { id: 'TK-001', device: 'Dell OptiPlex 7090', issue: 'Monitor no enciende', status: 'En progreso', client: 'María González', priority: 'Alta' },
    { id: 'TK-002', device: 'HP ProDesk 400 G7', issue: 'No enciende', status: 'Pendiente', client: 'Carlos López', priority: 'Crítica' },
    { id: 'TK-003', device: 'MacBook Air', issue: 'Teclado no funciona', status: 'Asignado', client: 'Ana Martínez', priority: 'Media' },
    { id: 'TK-004', device: 'Lenovo ThinkCentre M720', issue: 'Lentitud extrema', status: 'Resuelto', client: 'Luis Rodríguez', priority: 'Baja' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica': return 'bg-red-100 text-red-800';
      case 'Alta': return 'bg-orange-100 text-orange-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resuelto': return 'bg-green-100 text-green-800';
      case 'En progreso': return 'bg-blue-100 text-blue-800';
      case 'Asignado': return 'bg-purple-100 text-purple-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Si es cliente o domiciliario, mostrar el mapa directamente
  if (userRole === 'cliente' || userRole === 'domiciliario') {
    return (
      <div className="p-6">
        <DeliveryMap userRole={userRole as 'cliente' | 'domiciliario'} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Bienvenido al Dashboard</h2>
          <p className="text-gray-600">Resumen de tu actividad en SkyHelp</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Último acceso</p>
          <p className="text-sm font-medium">Hoy a las 09:30 AM</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <motion.div 
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card className="p-6">
          <h3 className="mb-4">Tickets Recientes</h3>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{ticket.id}</span>
                    <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{ticket.device} - {ticket.issue}</p>
                  <p className="text-xs text-gray-500">Cliente: {ticket.client}</p>
                </div>
                <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BarChart3, title: "Crear Ticket", desc: "Reportar nueva incidencia", gradient: "from-red-500 to-pink-600" },
              { icon: Users, title: "Ver Reportes", desc: "Estadísticas detalladas", gradient: "from-blue-500 to-cyan-600" },
              { icon: CheckCircle, title: "Centro de Ayuda", desc: "Documentación y FAQ", gradient: "from-green-500 to-emerald-600" },
              { icon: TrendingUp, title: "Mi Perfil", desc: "Configurar cuenta", gradient: "from-purple-500 to-violet-600" }
            ].map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <motion.button 
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center mb-3`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ActionIcon className="h-5 w-5 text-white" />
                  </motion.div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-600">{action.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Activity Chart Placeholder */}
      <Card className="p-6">
        <h3 className="mb-4">Actividad de la Semana</h3>
        <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Gráfico de actividad semanal</p>
            <p className="text-sm text-gray-400">Aquí se mostraría un gráfico interactivo</p>
          </div>
        </div>
      </Card>
    </div>
  );
}