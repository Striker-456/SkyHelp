import { Button } from "./ui/button";
import {
  Home,
  Ticket,
  Users,
  Truck,
  BarChart3,
  HelpCircle,
  User,
  Settings,
  LogOut,
  MapPin,
  Package,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: string;
  isOpen?: boolean;
}

export function Sidebar({
  activeSection,
  onSectionChange,
  userRole,
  isOpen = true,
}: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label:
        userRole === "cliente"
          ? "Mi Pedido"
          : userRole === "domiciliario"
            ? "Mapa de Entregas"
            : "Dashboard",
      icon:
        userRole === "cliente"
          ? Package
          : userRole === "domiciliario"
            ? MapPin
            : Home,
      roles: [
        "cliente",
        "administrador",
        "tecnico",
        "domiciliario",
      ],
    },
    {
      id: "tickets",
      label: "Tickets",
      icon: Ticket,
      roles: ["cliente", "administrador", "tecnico"],
    },
    {
      id: "usuarios",
      label: "Usuarios",
      icon: Users,
      roles: ["administrador"],
    },
    {
      id: "domiciliarios",
      label: "Domiciliarios",
      icon: Truck,
      roles: ["administrador", "domiciliario"],
    },
    {
      id: "reportes",
      label: "Reportes",
      icon: BarChart3,
      roles: ["administrador"],
    },
    {
      id: "perfil",
      label: "Mi Perfil",
      icon: User,
      roles: [
        "cliente",
        "administrador",
        "tecnico",
        "domiciliario",
      ],
    },
    {
      id: "ayuda",
      label: "Centro de Ayuda",
      icon: HelpCircle,
      roles: [
        "cliente",
        "administrador",
        "tecnico",
        "domiciliario",
      ],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <aside
      className={`bg-white border-r border-gray-200 w-64 flex-shrink-0 transition-transform duration-300 ${
        isOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      } fixed lg:relative top-0 left-0 h-full lg:h-auto z-30`}
    >
      <div className="p-6">
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={
                  activeSection === item.id
                    ? "default"
                    : "ghost"
                }
                className={`w-full justify-start ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-100"
          >
            <Settings className="h-4 w-4 mr-3" />
            Configuración
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </aside>
  );
}