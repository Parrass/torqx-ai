
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
  Building2,
  Wrench,
  Calendar,
  DollarSign,
  Shield,
  Zap
} from 'lucide-react';
import { SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import SidebarCategoryItem from '@/components/SidebarCategoryItem';
import { useUserPermissions } from '@/hooks/useUserPermissions';

const TorqxSidebar = () => {
  const { permissions, loading } = useUserPermissions();

  // Links principais (sempre visíveis)
  const mainLinks = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="text-torqx-primary dark:text-white w-4 h-4" />,
    }
  ];

  // Categorias organizadas
  const categories = [
    {
      label: 'Clientes & Veículos',
      icon: <Users className="text-torqx-primary dark:text-white w-4 h-4" />,
      items: [
        {
          label: 'Clientes',
          href: '/customers',
          icon: <Users className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'customers'
        },
        {
          label: 'Veículos',
          href: '/vehicles',
          icon: <Car className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'vehicles'
        }
      ]
    },
    {
      label: 'Operações',
      icon: <Wrench className="text-torqx-primary dark:text-white w-4 h-4" />,
      items: [
        {
          label: 'Ordens de Serviço',
          href: '/service-orders',
          icon: <FileText className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'service_orders'
        },
        {
          label: 'Agendamentos',
          href: '/appointments',
          icon: <Calendar className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'appointments'
        },
        {
          label: 'Serviços da Oficina',
          href: '/workshop-services',
          icon: <Wrench className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'workshop_services'
        }
      ]
    },
    {
      label: 'Estoque & Compras',
      icon: <Package className="text-torqx-primary dark:text-white w-4 h-4" />,
      items: [
        {
          label: 'Estoque',
          href: '/inventory',
          icon: <Package className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'inventory'
        },
        {
          label: 'Compras',
          href: '/purchases',
          icon: <ShoppingCart className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'purchases'
        },
        {
          label: 'Fornecedores',
          href: '/suppliers',
          icon: <Truck className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'suppliers'
        }
      ]
    },
    {
      label: 'Inteligência Artificial',
      icon: <Bot className="text-torqx-primary dark:text-white w-4 h-4" />,
      items: [
        {
          label: 'IA Assistente',
          href: '/ai-assistant',
          icon: <Bot className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'ai_assistant'
        },
        {
          label: 'WhatsApp IA',
          href: '/whatsapp-ai',
          icon: <MessageSquare className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'whatsapp_ai'
        }
      ]
    },
    {
      label: 'Análises',
      icon: <BarChart3 className="text-torqx-primary dark:text-white w-4 h-4" />,
      items: [
        {
          label: 'Relatórios',
          href: '/reports',
          icon: <BarChart3 className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'reports'
        }
      ]
    },
    {
      label: 'Administração',
      icon: <Settings className="text-torqx-primary dark:text-white w-4 h-4" />,
      items: [
        {
          label: 'Gestão de Equipe',
          href: '/team-management',
          icon: <Shield className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'team_management'
        },
        {
          label: 'Config. da Oficina',
          href: '/workshop-settings',
          icon: <Building2 className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'workshop_settings'
        },
        {
          label: 'Configurações',
          href: '/settings',
          icon: <Settings className="text-torqx-primary dark:text-white w-4 h-4" />,
          permission: 'settings'
        }
      ]
    }
  ];

  if (loading) {
    return (
      <SidebarBody>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="mt-4 flex flex-col gap-2">
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </SidebarBody>
    );
  }

  return (
    <SidebarBody>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="mt-4 flex flex-col gap-1">
          {/* Links principais */}
          {mainLinks.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
          
          {/* Separador */}
          <div className="border-t border-gray-200 dark:border-torqx-primary-light my-3"></div>
          
          {/* Categorias */}
          {categories.map((category, idx) => (
            <SidebarCategoryItem 
              key={idx} 
              category={category} 
              userPermissions={permissions}
            />
          ))}
        </div>
      </div>
    </SidebarBody>
  );
};

export default TorqxSidebar;
