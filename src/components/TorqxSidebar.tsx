import React from 'react';
import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  Package,
  Calendar,
  BarChart3,
  Bot,
  MessageSquare,
  FolderOpen,
  Settings,
  ShoppingCart,
} from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface MenuItemProps {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
}

const TorqxSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  };

  const menuItems: MenuItemProps[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Clientes', href: '/customers' },
    { icon: Car, label: 'Veículos', href: '/vehicles' },
    { icon: ClipboardList, label: 'Ordens de Serviço', href: '/service-orders' },
    { icon: Package, label: 'Estoque', href: '/inventory' },
    { icon: ShoppingCart, label: 'Compras', href: '/purchases' },
    { icon: Calendar, label: 'Agendamentos', href: '/appointments' },
    { icon: BarChart3, label: 'Relatórios', href: '/reports' },
    { icon: Bot, label: 'Assistente IA', href: '/ai-assistant' },
    { icon: MessageSquare, label: 'WhatsApp IA', href: '/whatsapp-ai' },
    { icon: FolderOpen, label: 'Assets', href: '/assets' },
    { icon: Settings, label: 'Configurações', href: '/settings' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[280px] p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navegue pelas funcionalidades do sistema.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="py-4">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start px-6 hover:bg-gray-100 font-medium"
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
        <Separator />
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={user?.avatar_url || "https://github.com/shadcn.png"} alt={user?.full_name} />
              <AvatarFallback>{user?.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold">{user?.full_name}</h4>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full mt-4 justify-center"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TorqxSidebar;
