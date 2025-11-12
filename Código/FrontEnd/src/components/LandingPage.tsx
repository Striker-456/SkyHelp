import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CheckCircle, Zap, Shield, Users, Wrench, Truck, BarChart3, HelpCircle, ArrowRight, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { useState } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDemo?: () => void;
  onContactSales?: () => void;
}

export function LandingPage({ onGetStarted, onViewDemo, onContactSales }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);

  const features = [
    {
      icon: Wrench,
      title: "Gestión de Tickets",
      description: "Crea, asigna y da seguimiento a incidencias de manera eficiente",
      image: "https://images.unsplash.com/photo-1703960525294-53f01e3546eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWNrZXQlMjBtYW5hZ2VtZW50JTIwc3VwcG9ydHxlbnwxfHx8fDE3NjE1ODQ2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: "from-red-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Múltiples Roles",
      description: "Sistema diseñado para clientes, técnicos, administradores y domiciliarios",
      image: "https://images.unsplash.com/photo-1748256622734-92241ae7b43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjE0OTg0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Truck,
      title: "Gestión de Domiciliarios",
      description: "Coordina recogidas y entregas de equipos de forma optimizada",
      image: "https://images.unsplash.com/photo-1758519289594-8e0444825b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTU1MDkwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: BarChart3,
      title: "Reportes Detallados",
      description: "Estadísticas completas sobre tiempos de respuesta y satisfacción",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjByZXBvcnRzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2MTU4NDY3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Zap,
      title: "Notificaciones en Tiempo Real",
      description: "Mantente informado con alertas instantáneas de actualizaciones",
      image: "https://images.unsplash.com/photo-1590010358311-55d7c0769a3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm0lMjBkYXNoYm9hcmQlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjE1ODQ2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: HelpCircle,
      title: "Centro de Conocimiento",
      description: "Base de datos completa con artículos de ayuda y FAQ",
      image: "https://images.unsplash.com/photo-1676630444903-163fe485c5d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXBhaXIlMjB0ZWNobmljaWFuJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzYxNTg0NjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const showcasePanels = [
    {
      title: "Dashboard Inteligente",
      description: "Visualiza toda tu operación en tiempo real",
      image: "https://images.unsplash.com/photo-1590010358311-55d7c0769a3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm0lMjBkYXNoYm9hcmQlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjE1ODQ2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      metrics: [
        { label: "Tickets", value: "247+" },
        { label: "Técnicos", value: "12" }
      ]
    },
    {
      title: "Gestión de Tickets",
      description: "Organiza y prioriza todas las solicitudes",
      image: "https://images.unsplash.com/photo-1703960525294-53f01e3546eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWNrZXQlMjBtYW5hZ2VtZW50JTIwc3VwcG9ydHxlbnwxfHx8fDE3NjE1ODQ2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      metrics: [
        { label: "Satisfacción", value: "98%" },
        { label: "Respuesta", value: "2h" }
      ]
    },
    {
      title: "Análisis Detallado",
      description: "Toma decisiones basadas en datos",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjByZXBvcnRzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2MTU4NDY3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      metrics: [
        { label: "Eficiencia", value: "+60%" },
        { label: "Ahorro", value: "40%" }
      ]
    },
    {
      title: "Colaboración en Equipo",
      description: "Comunicación fluida entre todos los roles",
      image: "https://images.unsplash.com/photo-1748256622734-92241ae7b43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjE0OTg0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      metrics: [
        { label: "Usuarios", value: "50+" },
        { label: "Activos", value: "24/7" }
      ]
    }
  ];

  const benefits = [
    "Reduce tiempos de respuesta en un 60%",
    "Mejora la comunicación entre equipos",
    "Optimiza la gestión de recursos",
    "Aumenta la satisfacción del cliente",
    "Proporciona trazabilidad completa",
    "Facilita la toma de decisiones"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-400/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-red-300/10 to-orange-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-white/50 bg-white/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">SkyHelp</span>
          </div>
          <Button onClick={onGetStarted} className="bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all">
            Comenzar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm text-red-700 px-6 py-3 rounded-full font-medium mb-8 shadow-lg border border-red-100">
              <Zap className="h-5 w-5" />
              Sistema CRM Especializado
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </motion.div>
          
          <motion.h1
            className="text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Optimiza la gestión de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-600"> 
              {" "}equipos electrónicos
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            SkyHelp es la plataforma completa para el mantenimiento y reparación de dispositivos. 
            Mejora la comunicación entre clientes, técnicos y domiciliarios con seguimiento en tiempo real.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-red-500 to-pink-600 text-lg px-10 py-6 shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 hover:scale-105 transition-all"
            >
              Empezar Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={onViewDemo}
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-6 bg-white/70 backdrop-blur-sm border-2 border-red-200 hover:border-red-400 hover:bg-white transition-all"
            >
              Ver Demo
            </Button>
          </motion.div>
        </div>

        {/* Showcase Panels Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {showcasePanels.map((panel, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => setHoveredPanel(index)}
              onMouseLeave={() => setHoveredPanel(null)}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all h-full">
                <div className="relative h-48 overflow-hidden">
                  <motion.div
                    animate={{
                      scale: hoveredPanel === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <ImageWithFallback
                      src={panel.image}
                      alt={panel.title}
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold mb-1">{panel.title}</h3>
                    <p className="text-xs text-white/80">{panel.description}</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-2">
                  {panel.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center">
                      <div className="font-bold text-gray-900">{metric.value}</div>
                      <div className="text-xs text-gray-600">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section - Interactive */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Todo lo que necesitas en una plataforma
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Herramientas completas para optimizar cada aspecto de tu servicio técnico
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isHovered = hoveredFeature === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all h-full bg-white/80 backdrop-blur-sm">
                    <div className="relative h-48 overflow-hidden">
                      <motion.div
                        animate={{
                          scale: isHovered ? 1.15 : 1
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <ImageWithFallback
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-48 object-cover"
                        />
                      </motion.div>
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-40 mix-blend-multiply`} />
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                          scale: isHovered ? 1.2 : 1,
                          rotate: isHovered ? 360 : 0
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl`}>
                          <Icon className={`h-8 w-8 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                        </div>
                      </motion.div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      <motion.div
                        className="mt-4 flex items-center gap-2 text-red-600 cursor-pointer"
                        animate={{
                          x: isHovered ? 5 : 0
                        }}
                      >
                        <span className="text-sm font-medium">Conocer más</span>
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Resultados que marcan la diferencia
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Empresas que utilizan SkyHelp experimentan mejoras significativas en eficiencia y satisfacción del cliente.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 bg-white/80 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ x: 10 }}
                    >
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "247+", label: "Tickets Gestionados", color: "from-red-500 to-orange-600" },
                    { value: "98%", label: "Satisfacción", color: "from-pink-500 to-rose-600" },
                    { value: "60%", label: "Más Rápido", color: "from-purple-500 to-indigo-600" },
                    { value: "24/7", label: "Disponibilidad", color: "from-blue-500 to-cyan-600" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className={`p-6 bg-gradient-to-br ${stat.color} border-0 shadow-xl text-white text-center`}>
                        <div className="text-4xl font-bold mb-2">{stat.value}</div>
                        <div className="text-sm opacity-90">{stat.label}</div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated background circles */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">
                ¿Listo para transformar tu servicio técnico?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Únete a cientos de empresas que ya optimizan sus operaciones con SkyHelp
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={onGetStarted}
                  size="lg" 
                  className="bg-white text-red-600 hover:bg-gray-100 text-lg px-10 py-6 shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={onContactSales}
                  variant="outline" 
                  size="lg" 
                  className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-10 py-6 backdrop-blur-sm transition-all"
                >
                  Contactar Ventas
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold">SkyHelp</span>
          </div>
          
          <p className="text-gray-400 mb-4">
            Sistema CRM especializado en mantenimiento y reparación de equipos electrónicos
          </p>
          
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Soporte</a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400">
            © 2024 SkyHelp. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
