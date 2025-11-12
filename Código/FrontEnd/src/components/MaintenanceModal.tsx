import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Construction } from "lucide-react";

interface MaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function MaintenanceModal({ 
  open, 
  onClose, 
  title = "Funcionalidad en Desarrollo",
  description = "Esta funcionalidad estará disponible próximamente. Estamos trabajando para ofrecerte la mejor experiencia."
}: MaintenanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-full">
                <Construction className="h-12 w-12 text-red-600" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mt-4">
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-red-500 to-pink-600"
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
