
import React from 'react';
import { 
  Calendar, 
  Car, 
  Users, 
  Wrench, 
  Package, 
  BarChart3, 
  Brain, 
  Settings,
  Home,
  LogOut,
  Menu,
  Bell,
  Search
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';

const TorqxSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const links = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="text-torqx-primary dark:text-white h-4 w-4 flex-shrink-0" />
    },
    {
      label: 'Clientes',
      href: '/customers',
      icon: <Users className="text-torqx-primary dark:text-white h-4 w-4 flex-shrink-0" />
    },
    {
      label: 'Veículos',
      href: '/vehicles',
      icon: <Car className="text-torqx-primary dark:text-white h-4 w-4 flex-shrink-0" />
    },
    {
      label: 'OS',
      href: '/service-orders',
      icon: <Wrench className="text-torqx-primary dark:text-white h-4 w-4 flex-shrink-0" />
    },
    {
      label: 'Estoque',
      href: '/inventory',
      icon: <Package className="text-torqx-primary dark:text-white h-4 w-4 flex-shrink-0" />
    },
    {
      label: 'Agenda',
      href: '/appointments',
      icon: <Calendar className="text-torqx-primary dark:text-white h-4 w-4 flex-shrink-0" />
    },
    {
      label: 'IA',
      href: '/ai-assistant',
      icon: <Brain className="text-torqx-primary dark:text-white h-4 w-4 flex-shrink-0" />
    },
    {
      label: 'Relatórios',
      href: '/reports',
      icon: <BarChart3 className="text-torqx-primary dark:text-white h-4 w-4 flex-shrink-0" />
    },
    {
      label: 'Config',
      href: '/settings',
      icon: <Settings className="text-torqx-primary dark:text-white h-4 w-4 flex-shrink-0" />
    }
  ];

  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-6">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="mt-6 flex flex-col gap-1">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <div className="border-t border-gray-200 dark:border-torqx-primary-light pt-3">
            <div className="flex items-center space-x-2 mb-2 px-2">
              <div className="w-6 h-6 bg-torqx-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <motion.div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-torqx-primary dark:text-white truncate">
                  {user?.user_metadata?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </motion.div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <motion.span className="text-xs">Sair</motion.span>
            </button>
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default TorqxSidebar;
