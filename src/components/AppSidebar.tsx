
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
  Wrench,
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
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Clientes', url: '/customers', icon: Users },
  { title: 'Veículos', url: '/vehicles', icon: Car },
  { title: 'Ordens de Serviço', url: '/service-orders', icon: ClipboardList },
  { title: 'Estoque', url: '/inventory', icon: Package },
  { title: 'Compras', url: '/purchases', icon: ShoppingCart },
  { title: 'Agendamentos', url: '/appointments', icon: Calendar },
  { title: 'Relatórios', url: '/reports', icon: BarChart3 },
  { title: 'Assistente IA', url: '/ai-assistant', icon: Bot },
  { title: 'WhatsApp IA', url: '/whatsapp-ai', icon: MessageSquare },
  { title: 'Assets', url: '/assets', icon: FolderOpen },
  { title: 'Configurações', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simple navigation to login for now
    navigate('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-lg flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button onClick={() => navigate(item.url)} className="w-full">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-torqx-primary truncate">
              {user?.email || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Técnico
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full"
        >
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
