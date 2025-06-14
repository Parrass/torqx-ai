
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
  User,
  LogOut,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const menuItems = [
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

export function AppSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-torqx-primary font-satoshi">Torqx</span>
            <span className="text-xs text-gray-500">Oficina Digital</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    className="hover:bg-torqx-secondary/10 hover:text-torqx-secondary"
                  >
                    <button onClick={() => navigate(item.href)}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" alt={user?.email} />
            <AvatarFallback className="bg-torqx-secondary text-white text-xs">
              {user?.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-torqx-primary truncate">
              {user?.user_metadata?.full_name || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
