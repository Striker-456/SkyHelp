import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Navigation, Package, Clock, CheckCircle, Phone, User } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface Delivery {
  id: string;
  client: string;
  address: string;
  position: { x: number; y: number };
  status: 'pending' | 'in-transit' | 'completed';
  device: string;
  phone: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
}

interface DeliveryMapProps {
  userRole: 'domiciliario' | 'cliente';
}

export function DeliveryMap({ userRole }: DeliveryMapProps) {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [currentPosition] = useState({ x: 50, y: 50 });

  const deliveries: Delivery[] = [
    {
      id: 'DEL-001',
      client: 'María González',
      address: 'Calle 45 #23-15, Bogotá',
      position: { x: 30, y: 35 },
      status: 'pending',
      device: 'Dell OptiPlex 7090',
      phone: '+57 300 123 4567',
      priority: 'high',
      estimatedTime: '15 min'
    },
    {
      id: 'DEL-002',
      client: 'Carlos López',
      address: 'Carrera 7 #80-25, Bogotá',
      position: { x: 60, y: 25 },
      status: 'in-transit',
      device: 'HP ProDesk 400 G7',
      phone: '+57 301 234 5678',
      priority: 'medium',
      estimatedTime: '5 min'
    },
    {
      id: 'DEL-003',
      client: 'Ana Martínez',
      address: 'Avenida 15 #100-50, Bogotá',
      position: { x: 75, y: 60 },
      status: 'completed',
      device: 'MacBook Air',
      phone: '+57 302 345 6789',
      priority: 'low',
      estimatedTime: 'Completado'
    },
    {
      id: 'DEL-004',
      client: 'Luis Rodríguez',
      address: 'Calle 127 #15-40, Bogotá',
      position: { x: 40, y: 70 },
      status: 'pending',
      device: 'Lenovo ThinkCentre',
      phone: '+57 303 456 7890',
      priority: 'medium',
      estimatedTime: '30 min'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-transit': return 'bg-blue-500';
      case 'pending': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-transit': return 'En Tránsito';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Cliente solo ve su pedido (simulamos que es el primero en tránsito)
  const clientDelivery = deliveries.find(d => d.status === 'in-transit') || deliveries[0];

  if (userRole === 'cliente') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2>Ubicación de mi Pedido</h2>
            <p className="text-gray-600">Seguimiento en tiempo real de tu equipo</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mapa */}
          <Card className="lg:col-span-2 p-6 overflow-hidden">
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl h-[500px] overflow-hidden">
              {/* Fondo estilo mapa */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Calles decorativas */}
              <svg className="absolute inset-0 w-full h-full opacity-30">
                <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#cbd5e1" strokeWidth="8" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="8" />
                <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#cbd5e1" strokeWidth="8" />
                <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#cbd5e1" strokeWidth="8" />
                <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#cbd5e1" strokeWidth="8" />
              </svg>

              {/* Ruta animada */}
              <motion.svg className="absolute inset-0 w-full h-full">
                <motion.path
                  d={`M ${currentPosition.x}% ${currentPosition.y}% Q ${(currentPosition.x + clientDelivery.position.x) / 2}% ${(currentPosition.y + clientDelivery.position.y) / 2 - 10}% ${clientDelivery.position.x}% ${clientDelivery.position.y}%`}
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="10,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </motion.svg>

              {/* Tu ubicación actual (domiciliario) */}
              <motion.div
                className="absolute"
                style={{ left: `${currentPosition.x}%`, top: `${currentPosition.y}%` }}
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <motion.div 
                    className="absolute inset-0 w-16 h-16 bg-blue-500/30 rounded-full"
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-white">
                    <Navigation className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Ubicación de destino */}
              <motion.div
                className="absolute cursor-pointer"
                style={{ left: `${clientDelivery.position.x}%`, top: `${clientDelivery.position.y}%` }}
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative -translate-x-1/2 -translate-y-full">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-white"
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(239, 68, 68, 0.7)',
                        '0 0 0 20px rgba(239, 68, 68, 0)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MapPin className="h-6 w-6 text-white" />
                  </motion.div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    <p className="text-xs font-medium">Tu ubicación</p>
                  </div>
                </div>
              </motion.div>

              {/* Indicador de progreso */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">En camino a tu ubicación</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{clientDelivery.estimatedTime}</Badge>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: '0%' }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Información del pedido */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3>Pedido {clientDelivery.id}</h3>
                <Badge className={getStatusColor(clientDelivery.status) + ' text-white'}>
                  {getStatusLabel(clientDelivery.status)}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Equipo</p>
                <p className="font-medium">{clientDelivery.device}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Dirección de Entrega</p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                  <p className="font-medium">{clientDelivery.address}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Tiempo estimado</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <p className="font-medium">{clientDelivery.estimatedTime}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Estado del Pedido</p>
                <div className="space-y-3">
                  {[
                    { label: 'Recogido', completed: true },
                    { label: 'En tránsito', completed: true },
                    { label: 'Entregado', completed: false }
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`}>
                        {step.completed && <CheckCircle className="h-4 w-4 text-white" />}
                      </div>
                      <span className={step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 mt-4">
                <Phone className="h-4 w-4 mr-2" />
                Contactar Domiciliario
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Vista de domiciliario
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Mapa de Entregas</h2>
          <p className="text-gray-600">Gestiona tus rutas y entregas en tiempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">3 En ruta</Badge>
          <Badge className="bg-green-100 text-green-800">1 Completada</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mapa */}
        <Card className="lg:col-span-2 p-6 overflow-hidden">
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl h-[600px] overflow-hidden">
            {/* Fondo estilo mapa */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="grid-delivery" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-delivery)" />
            </svg>

            {/* Calles decorativas */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#cbd5e1" strokeWidth="8" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="8" />
              <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#cbd5e1" strokeWidth="8" />
              <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#cbd5e1" strokeWidth="8" />
              <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#cbd5e1" strokeWidth="8" />
            </svg>

            {/* Rutas a destinos */}
            <svg className="absolute inset-0 w-full h-full">
              {deliveries.filter(d => d.status !== 'completed').map((delivery, index) => (
                <motion.path
                  key={delivery.id}
                  d={`M ${currentPosition.x}% ${currentPosition.y}% Q ${(currentPosition.x + delivery.position.x) / 2}% ${(currentPosition.y + delivery.position.y) / 2 - 10}% ${delivery.position.x}% ${delivery.position.y}%`}
                  stroke={delivery.status === 'in-transit' ? '#3b82f6' : '#f59e0b'}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                />
              ))}
            </svg>

            {/* Tu ubicación actual */}
            <motion.div
              className="absolute"
              style={{ left: `${currentPosition.x}%`, top: `${currentPosition.y}%` }}
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <motion.div 
                  className="absolute inset-0 w-16 h-16 bg-blue-500/30 rounded-full"
                  animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-white">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap">
                  Tu ubicación
                </div>
              </div>
            </motion.div>

            {/* Marcadores de entrega */}
            {deliveries.map((delivery) => (
              <motion.div
                key={delivery.id}
                className="absolute cursor-pointer"
                style={{ left: `${delivery.position.x}%`, top: `${delivery.position.y}%` }}
                whileHover={{ scale: 1.15 }}
                onClick={() => setSelectedDelivery(delivery)}
                animate={{ 
                  y: delivery.status === 'pending' ? [0, -8, 0] : 0,
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative -translate-x-1/2 -translate-y-full">
                  <motion.div
                    className={`w-12 h-12 ${getStatusColor(delivery.status)} rounded-full shadow-2xl flex items-center justify-center border-4 border-white relative`}
                    animate={delivery.status === 'in-transit' ? { 
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0.7)',
                        '0 0 0 20px rgba(59, 130, 246, 0)',
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {delivery.status === 'completed' ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <Package className="h-6 w-6 text-white" />
                    )}
                  </motion.div>
                  {selectedDelivery?.id === delivery.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-white px-3 py-2 rounded-lg shadow-xl z-10 whitespace-nowrap"
                    >
                      <p className="text-xs font-bold">{delivery.client}</p>
                      <p className="text-xs text-gray-600">{delivery.estimatedTime}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Leyenda */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl">
              <p className="text-xs font-medium mb-2">Leyenda</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-xs">Pendiente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">En tránsito</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Completado</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Lista de entregas */}
        <div className="space-y-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entregas del día</p>
                <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {deliveries.map((delivery) => (
              <motion.div
                key={delivery.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all ${
                    selectedDelivery?.id === delivery.id 
                      ? 'ring-2 ring-blue-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{delivery.client}</span>
                    </div>
                    <Badge className={getPriorityColor(delivery.priority)}>
                      {delivery.priority === 'high' ? 'Alta' : delivery.priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{delivery.device}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-xs">{delivery.address}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <Badge className={getStatusColor(delivery.status) + ' text-white text-xs'}>
                        {getStatusLabel(delivery.status)}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {delivery.estimatedTime}
                      </span>
                    </div>
                  </div>

                  {selectedDelivery?.id === delivery.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-gray-200"
                    >
                      <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <Phone className="h-3 w-3 mr-2" />
                        Llamar Cliente
                      </Button>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
