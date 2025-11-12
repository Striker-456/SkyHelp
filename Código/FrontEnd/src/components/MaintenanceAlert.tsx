import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Construction, Clock, Wrench, Cog } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MaintenanceAlertProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function MaintenanceAlert({ 
  title, 
  description, 
  icon 
}: MaintenanceAlertProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Main maintenance card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left side - Image */}
            <div className="relative bg-gradient-to-br from-rose-100 to-pink-100 p-8 flex items-center justify-center">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1696258687323-495eb76047ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMHJlcGFpciUyMG1haW50ZW5hbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTkwMjI3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Robot maintenance"
                  className="w-80 h-80 object-cover rounded-2xl shadow-lg"
                />
                
                {/* Floating animation elements */}
                <div className="absolute -top-4 -right-4 bg-rose-500 text-white p-3 rounded-full animate-bounce shadow-lg">
                  <Wrench className="h-6 w-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-pink-500 text-white p-3 rounded-full animate-pulse shadow-lg">
                  <Cog className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-2 rounded-lg">
                      {icon || <Construction className="h-6 w-6" />}
                    </div>
                    <div className="h-1 w-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {title}
                  </h1>
                </div>

                {/* Alert */}
                <Alert className="border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-800 border-2">
                  <Construction className="h-5 w-5 text-rose-600" />
                  <AlertTitle className="text-rose-900 text-lg">
                    🔧 Sistema en Mantenimiento
                  </AlertTitle>
                  <AlertDescription className="text-rose-700 text-base">
                    Nuestro equipo de robots está trabajando arduamente para traerte esta funcionalidad.
                  </AlertDescription>
                </Alert>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {description}
                  </p>
                  
                  {/* Progress indicator */}
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-full w-3/4 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-sm text-gray-500">Progreso de desarrollo: 75%</p>
                </div>

                {/* Status badge */}
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center space-x-2 shadow-lg">
                    <Clock className="h-4 w-4" />
                    <span>Próximamente disponible</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Mientras tanto, puedes explorar otras secciones del sistema SkyHelp
          </p>
        </div>
      </div>
    </div>
  );
}