import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

interface LoginFormProps {
  onLogin: (user: { name: string; role: string; email: string }) => void;
  onBack: () => void;
}

export function LoginForm({ onLogin, onBack }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: ""
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phone: "",
    company: ""
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Demo users for testing
    const demoUsers = [
      { email: "admin@skyhelp.com", password: "admin123", name: "María Administradora", role: "administrador" },
      { email: "tecnico@skyhelp.com", password: "tecnico123", name: "Juan Técnico", role: "tecnico" },
      { email: "cliente@skyhelp.com", password: "cliente123", name: "Ana Cliente", role: "cliente" },
      { email: "domiciliario@skyhelp.com", password: "domiciliario123", name: "Carlos Domiciliario", role: "domiciliario" }
    ];

    const user = demoUsers.find(u => u.email === loginData.email && u.password === loginData.password);
    
    setTimeout(() => {
      if (user) {
        onLogin({ name: user.name, role: user.role, email: user.email });
      } else {
        setIsLoading(false);
        alert("Credenciales inválidas. Usa las cuentas demo:\\n- admin@skyhelp.com / admin123\\n- tecnico@skyhelp.com / tecnico123\\n- cliente@skyhelp.com / cliente123\\n- domiciliario@skyhelp.com / domiciliario123");
      }
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (registerData.password !== registerData.confirmPassword) {
      setIsLoading(false);
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.role) {
      setIsLoading(false);
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Simulate registration and auto-login
    setTimeout(() => {
      onLogin({ 
        name: registerData.name, 
        role: registerData.role, 
        email: registerData.email 
      });
    }, 1500);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div 
          className="flex items-center gap-2 mb-8"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-xl">S</span>
            </motion.div>
            <span className="text-2xl font-bold text-gray-900">SkyHelp</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-8 shadow-xl bg-white/90 backdrop-blur-sm">
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-gray-600">Procesando...</p>
                </div>
              </motion.div>
            )}
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" disabled={isLoading}>Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register" disabled={isLoading}>Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <motion.div 
                    className="text-center mb-6"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <h2>Bienvenido de vuelta</h2>
                    <p className="text-gray-600">Ingresa a tu cuenta SkyHelp</p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      placeholder="correo@ejemplo.com"
                      disabled={isLoading}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        placeholder="••••••••"
                        disabled={isLoading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-between text-sm"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" disabled={isLoading} />
                      Recordarme
                    </label>
                    <a href="#" className="text-red-600 hover:text-red-700">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          Iniciando sesión...
                        </div>
                      ) : (
                        "Iniciar Sesión"
                      )}
                    </Button>
                  </motion.div>

                  <motion.div 
                    className="mt-6 p-4 bg-blue-50 rounded-lg"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                  >
                    <p className="text-sm font-medium text-blue-900 mb-2">Cuentas Demo:</p>
                    <div className="text-xs text-blue-700 space-y-1">
                      <div>👤 <strong>Admin:</strong> admin@skyhelp.com / admin123</div>
                      <div>🔧 <strong>Técnico:</strong> tecnico@skyhelp.com / tecnico123</div>
                      <div>👥 <strong>Cliente:</strong> cliente@skyhelp.com / cliente123</div>
                      <div>🚚 <strong>Domiciliario:</strong> domiciliario@skyhelp.com / domiciliario123</div>
                    </div>
                  </motion.div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <motion.div 
                    className="text-center mb-6"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <h2>Crear Cuenta</h2>
                    <p className="text-gray-600">Regístrate en SkyHelp</p>
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-2 gap-4"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <div>
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                        placeholder="Tu nombre"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                        placeholder="+57 123 456 7890"
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <Label htmlFor="register-email">Correo Electrónico *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      placeholder="correo@ejemplo.com"
                      disabled={isLoading}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <Label htmlFor="role">Tipo de Usuario *</Label>
                    <Select 
                      value={registerData.role} 
                      onValueChange={(value) => setRegisterData({...registerData, role: value})}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="domiciliario">Domiciliario</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <Label htmlFor="company">Empresa (Opcional)</Label>
                    <Input
                      id="company"
                      value={registerData.company}
                      onChange={(e) => setRegisterData({...registerData, company: e.target.value})}
                      placeholder="Nombre de tu empresa"
                      disabled={isLoading}
                    />
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-2 gap-4"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                  >
                    <div>
                      <Label htmlFor="register-password">Contraseña *</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        placeholder="••••••••"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirmar Contraseña *</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        placeholder="••••••••"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-2 text-sm"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.0 }}
                  >
                    <input type="checkbox" required className="rounded" disabled={isLoading} />
                    <span className="text-gray-600">
                      Acepto los{" "}
                      <a href="#" className="text-red-600 hover:text-red-700">
                        términos y condiciones
                      </a>
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.1 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          Creando cuenta...
                        </div>
                      ) : (
                        "Crear Cuenta"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}