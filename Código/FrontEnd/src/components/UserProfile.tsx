import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { User, Mail, Phone, Building, Calendar, Shield, Bell, Eye, Save, Camera } from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    role: string;
    email: string;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: "+57 301 234 5678",
    company: "TechRepair Solutions",
    address: "Calle 123 #45-67, Bogotá",
    bio: "Especialista en reparación de dispositivos móviles con más de 5 años de experiencia.",
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisible: true,
      activityVisible: false
    }
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here would save to backend
    console.log("Saving profile data:", profileData);
  };

  const recentActivity = [
    { action: "Ticket TK-001 actualizado", date: "2024-01-16 14:30", type: "ticket" },
    { action: "Perfil actualizado", date: "2024-01-15 09:15", type: "profile" },
    { action: "Ticket TK-002 creado", date: "2024-01-14 16:45", type: "ticket" },
    { action: "Comentario agregado en TK-003", date: "2024-01-13 11:20", type: "comment" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrador': return 'bg-purple-100 text-purple-800';
      case 'tecnico': return 'bg-blue-100 text-blue-800';
      case 'cliente': return 'bg-green-100 text-green-800';
      case 'domiciliario': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ticket': return '🎫';
      case 'profile': return '👤';
      case 'comment': return '💬';
      default: return '📝';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Mi Perfil</h2>
          <p className="text-gray-600">Gestiona tu información personal y configuraciones</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-red-500 to-pink-600"}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </>
          ) : (
            "Editar Perfil"
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="p-6 lg:col-span-1">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{user.name}</h3>
            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
            
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Building className="h-4 w-4" />
                <span className="text-sm">{profileData.company}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Miembro desde Enero 2024</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
              <TabsTrigger value="activity">Actividad</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card className="p-6">
                <h3 className="mb-4">Información Personal</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <Card className="p-6">
                <h3 className="mb-4">Configuración de Seguridad</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Cambiar Contraseña</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="current-password">Contraseña Actual</Label>
                        <Input id="current-password" type="password" placeholder="••••••••" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">Nueva Contraseña</Label>
                        <Input id="new-password" type="password" placeholder="••••••••" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                        <Input id="confirm-password" type="password" placeholder="••••••••" />
                      </div>
                      <Button variant="outline">
                        <Shield className="h-4 w-4 mr-2" />
                        Actualizar Contraseña
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-3">Autenticación de Dos Factores</h4>
                    <p className="text-gray-600 mb-3">Agrega una capa extra de seguridad a tu cuenta</p>
                    <Button variant="outline">Configurar 2FA</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card className="p-6">
                <h3 className="mb-4">Preferencias de Notificaciones</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Canales de Notificación</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={profileData.notifications.email}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            notifications: {...profileData.notifications, email: e.target.checked}
                          })}
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium">Notificaciones por Email</div>
                          <div className="text-sm text-gray-600">Recibe actualizaciones por correo electrónico</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={profileData.notifications.push}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            notifications: {...profileData.notifications, push: e.target.checked}
                          })}
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium">Notificaciones Push</div>
                          <div className="text-sm text-gray-600">Notificaciones en tiempo real en el navegador</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={profileData.notifications.sms}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            notifications: {...profileData.notifications, sms: e.target.checked}
                          })}
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium">Notificaciones SMS</div>
                          <div className="text-sm text-gray-600">Mensajes de texto para alertas importantes</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-3">Privacidad</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={profileData.privacy.profileVisible}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            privacy: {...profileData.privacy, profileVisible: e.target.checked}
                          })}
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium">Perfil Visible</div>
                          <div className="text-sm text-gray-600">Otros usuarios pueden ver tu perfil</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={profileData.privacy.activityVisible}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            privacy: {...profileData.privacy, activityVisible: e.target.checked}
                          })}
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium">Actividad Visible</div>
                          <div className="text-sm text-gray-600">Mostrar tu actividad reciente a otros</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Activity */}
            <TabsContent value="activity">
              <Card className="p-6">
                <h3 className="mb-4">Actividad Reciente</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                      <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">Ver Toda la Actividad</Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}