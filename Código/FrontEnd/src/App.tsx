import { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { TicketManagement } from "./components/TicketManagement";
import { UserProfile } from "./components/UserProfile";
import { LandingPage } from "./components/LandingPage";
import { LoginForm } from "./components/LoginForm";
import { Reports } from "./components/Reports";
import { MaintenanceAlert } from "./components/MaintenanceAlert";
import { MaintenanceModal } from "./components/MaintenanceModal";

interface User {
  name: string;
  role: string;
  email: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<
    "landing" | "login" | "app"
  >("landing");
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [activeSection, setActiveSection] =
    useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [maintenanceModal, setMaintenanceModal] = useState<{
    open: boolean;
    title?: string;
    description?: string;
  }>({ open: false });

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView("app");
    setActiveSection("dashboard");
  };

  const handleGetStarted = () => {
    setCurrentView("login");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("landing");
    setActiveSection("dashboard");
    setIsSidebarOpen(false);
  };

  const handleViewDemo = () => {
    setMaintenanceModal({
      open: true,
      title: "Demo Interactiva",
      description: "La demo interactiva completa estará disponible próximamente. Por ahora, puedes explorar el sistema usando las cuentas de prueba disponibles."
    });
  };

  const handleContactSales = () => {
    setMaintenanceModal({
      open: true,
      title: "Contacto de Ventas",
      description: "El formulario de contacto estará disponible próximamente. Por el momento, puedes explorar todas las funcionalidades del sistema con las cuentas demo."
    });
  };

  const renderContent = () => {
    if (!currentUser) return null;

    switch (activeSection) {
      case "dashboard":
        return <Dashboard userRole={currentUser.role} />;
      case "tickets":
        return <TicketManagement userRole={currentUser.role} />;
      case "perfil":
        return <UserProfile user={currentUser} />;
      case "usuarios":
        return (
          <MaintenanceAlert
            title="Gestión de Usuarios"
            description="Esta sección permitirá administrar usuarios del sistema, incluyendo creación, edición, asignación de roles y gestión de permisos."
            icon={<div className="text-2xl">👥</div>}
          />
        );
      case "domiciliarios":
        return (
          <MaintenanceAlert
            title="Gestión de Domiciliarios"
            description="Esta sección permitirá coordinar recogidas y entregas de equipos, gestión de rutas, asignación de domiciliarios y seguimiento en tiempo real."
            icon={<div className="text-2xl">🚚</div>}
          />
        );
      case "reportes":
        return <Reports userRole={currentUser.role} />;
      case "ayuda":
        return (
          <MaintenanceAlert
            title="Centro de Ayuda"
            description="Esta sección incluirá documentación completa, guías paso a paso, preguntas frecuentes y base de conocimientos para usuarios y técnicos."
            icon={<div className="text-2xl">❓</div>}
          />
        );
      case "buscar":
        return (
          <MaintenanceAlert
            title="Búsqueda Avanzada"
            description="Esta sección permitirá realizar búsquedas avanzadas de tickets, clientes, equipos y más con filtros personalizables y resultados en tiempo real."
            icon={<div className="text-2xl">🔍</div>}
          />
        );
      case "notificaciones":
        return (
          <MaintenanceAlert
            title="Centro de Notificaciones"
            description="Esta sección mostrará todas tus notificaciones en tiempo real, incluyendo cambios de estado de tickets, mensajes, asignaciones y alertas del sistema."
            icon={<div className="text-2xl">🔔</div>}
          />
        );
      case "configuracion":
        return (
          <MaintenanceAlert
            title="Configuración del Sistema"
            description="Esta sección permitirá personalizar tu experiencia, gestionar preferencias, configurar notificaciones y ajustar parámetros del sistema."
            icon={<div className="text-2xl">⚙️</div>}
          />
        );
      default:
        return <Dashboard userRole={currentUser.role} />;
    }
  };

  if (currentView === "landing") {
    return (
      <>
        <LandingPage 
          onGetStarted={handleGetStarted}
          onViewDemo={handleViewDemo}
          onContactSales={handleContactSales}
        />
        <MaintenanceModal
          open={maintenanceModal.open}
          onClose={() => setMaintenanceModal({ open: false })}
          title={maintenanceModal.title}
          description={maintenanceModal.description}
        />
      </>
    );
  }

  if (currentView === "login") {
    return (
      <LoginForm
        onLogin={handleLogin}
        onBack={handleBackToLanding}
      />
    );
  }

  if (!currentUser) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        currentUser={currentUser}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
        onLogout={handleLogout}
        onSearchClick={() => setActiveSection("buscar")}
        onNotificationsClick={() => setActiveSection("notificaciones")}
        onSettingsClick={() => setActiveSection("configuracion")}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            setIsSidebarOpen(false);
          }}
          userRole={currentUser.role}
          isOpen={isSidebarOpen}
        />

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}