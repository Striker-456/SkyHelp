import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Plus, Search, Filter, Eye, Edit, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface TicketManagementProps {
  userRole: string;
}

export function TicketManagement({ userRole }: TicketManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const tickets = [
    { 
      id: 'TK-001', 
      device: 'Dell OptiPlex 7090', 
      issue: 'Monitor no enciende', 
      status: 'En progreso', 
      client: 'María González', 
      technician: 'Juan Pérez',
      priority: 'Alta', 
      created: '2024-01-15',
      updated: '2024-01-16',
      description: 'El monitor del equipo de escritorio no muestra imagen, posible problema con la tarjeta gráfica.'
    },
    { 
      id: 'TK-002', 
      device: 'HP ProDesk 400 G7', 
      issue: 'No enciende', 
      status: 'Pendiente', 
      client: 'Carlos López', 
      technician: 'Sin asignar',
      priority: 'Crítica', 
      created: '2024-01-16',
      updated: '2024-01-16',
      description: 'El equipo no responde al intentar encenderlo, posible problema de fuente de poder o placa madre.'
    },
    { 
      id: 'TK-003', 
      device: 'MacBook Air', 
      issue: 'Teclado no funciona', 
      status: 'Asignado', 
      client: 'Ana Martínez', 
      technician: 'Pedro Rodríguez',
      priority: 'Media', 
      created: '2024-01-14',
      updated: '2024-01-15',
      description: 'Varias teclas del teclado no responden correctamente.'
    },
    { 
      id: 'TK-004', 
      device: 'Lenovo ThinkCentre M720', 
      issue: 'Lentitud extrema', 
      status: 'Resuelto', 
      client: 'Luis Rodríguez', 
      technician: 'Ana García',
      priority: 'Baja', 
      created: '2024-01-10',
      updated: '2024-01-12',
      description: 'El equipo funciona muy lento, posible problema de disco duro o memoria RAM.'
    },
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resuelto': return <CheckCircle className="h-4 w-4" />;
      case 'En progreso': return <Clock className="h-4 w-4" />;
      case 'Asignado': return <Eye className="h-4 w-4" />;
      case 'Pendiente': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Tickets</h2>
          <p className="text-gray-600">Administra y da seguimiento a las incidencias</p>
        </div>
        
        {(userRole === 'cliente' || userRole === 'administrador') && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="device">Dispositivo</Label>
                  <Input id="device" placeholder="Ej: Dell OptiPlex 7090" />
                </div>
                <div>
                  <Label htmlFor="issue">Problema</Label>
                  <Input id="issue" placeholder="Describe brevemente el problema" />
                </div>
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descripción Detallada</Label>
                  <Textarea id="description" placeholder="Describe el problema en detalle..." rows={3} />
                </div>
                <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600">
                  Crear Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por ID, dispositivo o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Asignado">Asignado</SelectItem>
                <SelectItem value="En progreso">En progreso</SelectItem>
                <SelectItem value="Resuelto">Resuelto</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="Baja">Baja</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-900">{ticket.id}</span>
                  <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                  <Badge className={getStatusColor(ticket.status)}>
                    {getStatusIcon(ticket.status)}
                    <span className="ml-1">{ticket.status}</span>
                  </Badge>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {ticket.device} - {ticket.issue}
                </h3>
                
                <p className="text-gray-600 mb-3">{ticket.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>Cliente: <span className="font-medium">{ticket.client}</span></span>
                  <span>Técnico: <span className="font-medium">{ticket.technician}</span></span>
                  <span>Creado: {ticket.created}</span>
                  <span>Actualizado: {ticket.updated}</span>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                {(userRole === 'administrador' || userRole === 'tecnico') && (
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Comentar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <p>No se encontraron tickets que coincidan con los filtros</p>
            <p className="text-sm">Intenta ajustar los criterios de búsqueda</p>
          </div>
        </Card>
      )}
    </div>
  );
}