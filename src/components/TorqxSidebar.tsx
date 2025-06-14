
import { 
  Home, 
  Users, 
  Car, 
  FileText, 
  Package, 
  BarChart3,
  Bot,
  MessageSquare,
  Settings,
  ShoppingCart,
  Truck,
  Building2
} from 'lucide-react';
import { SidebarBody, SidebarLink } from '@/components/ui/sidebar';

const TorqxSidebar = () => {
  const links = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'Clientes',
      href: '/customers',
      icon: <Users className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'Veículos',
      href: '/vehicles',
      icon: <Car className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'Ordens de Serviço',
      href: '/service-orders',
      icon: <FileText className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'Estoque',
      href: '/inventory',
      icon: <Package className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'Compras',
      href: '/purchases',
      icon: <ShoppingCart className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'Fornecedores',
      href: '/suppliers',
      icon: <Truck className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'Relatórios',
      href: '/reports',
      icon: <BarChart3 className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'IA Assistente',
      href: '/ai-assistant',
      icon: <Bot className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'WhatsApp IA',
      href: '/whatsapp-ai',
      icon: <MessageSquare className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'Gestão de Equipe',
      href: '/team-management',
      icon: <Users className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'Config. da Oficina',
      href: '/workshop-settings',
      icon: <Building2 className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
    {
      label: 'Configurações',
      href: '/settings',
      icon: <Settings className="text-torqx-primary dark:text-white w-4 h-4" />,
    },
  ];

  return (
    <SidebarBody>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="mt-4 flex flex-col gap-1">
          {links.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
        </div>
      </div>
    </SidebarBody>
  );
};

export default TorqxSidebar;
