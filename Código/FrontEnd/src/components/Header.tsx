import { Button } from "./ui/button";
import { Bell, Search, Settings, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  currentUser?: {
    name: string;
    role: string;
    avatar?: string;
  };
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  onLogout?: () => void;
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
}

export function Header({ currentUser, onMenuToggle, isMenuOpen, onLogout, onSearchClick, onNotificationsClick, onSettingsClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold">S</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">SkyHelp</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center relative">
          <Search className="h-4 w-4 absolute left-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar tickets, clientes..."
            onClick={onSearchClick}
            readOnly
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-64 cursor-pointer"
          />
        </div>

        <Button variant="ghost" size="sm" className="md:hidden" onClick={onSearchClick}>
          <Search className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="sm" className="relative" onClick={onNotificationsClick}>
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </Button>

        <Button variant="ghost" size="sm" onClick={onSettingsClick}>
          <Settings className="h-5 w-5" />
        </Button>

        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                type="button"
                className="flex items-center gap-2 pl-2 border-l border-gray-200 hover:opacity-80 transition-opacity cursor-pointer outline-none focus:outline-none"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                variant="destructive"
                onSelect={() => {
                  if (onLogout) {
                    onLogout();
                  }
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}