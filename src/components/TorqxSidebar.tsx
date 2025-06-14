
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
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
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
      icon: <Home className="text-torqx-primary dark:text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: 'Clientes',
      href: '/customers',
      icon: <Users className="text-torqx-primary dark:text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: 'Veículos',
      href: '/vehicles',
      icon: <Car className="text-torqx-primary dark:text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: 'Ordens de Serviço',
      href: '/service-orders',
      icon: <Wrench className="text-torqx-primary dark:text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: 'Estoque',
      href: '/inventory',
      icon: <Package className="text-torqx-primary dark:text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: 'Agenda',
      href: '/appointments',
      icon: <Calendar className="text-torqx-primary dark:text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: 'IA Assistant',
      href: '/ai-assistant',
      icon: <Brain className="text-torqx-primary dark:text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: 'Relatórios',
      href: '/reports',
      icon: <BarChart3 className="text-torqx-primary dark:text-white h-5 w-5 flex-shrink-0" />
    },
    {
      label: 'Configurações',
      href: '/settings',
      icon: <Settings className="text-torqx-primary dark:text-white h-5 w-5 flex-shrink-0" />
    }
  ];

  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <TorqxLogo />
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <div className="border-t border-gray-200 dark:border-torqx-primary-light pt-4">
            <div className="flex items-center space-x-3 mb-3 px-2">
              <div className="w-8 h-8 bg-torqx-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <motion.div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-torqx-primary dark:text-white truncate">
                  {user?.user_metadata?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </motion.div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <motion.span className="text-sm">Sair</motion.span>
            </button>
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

const TorqxLogo = () => {
  return (
    <a
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <div className="w-8 h-8 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-lg flex items-center justify-center">
        <Wrench className="w-5 h-5 text-white" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-bold text-torqx-primary dark:text-white font-satoshi whitespace-pre"
      >
        Torqx
      </motion.span>
    </a>
  );
};

export default TorqxSidebar;
