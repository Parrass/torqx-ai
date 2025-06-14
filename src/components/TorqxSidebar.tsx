
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
  Palette
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
  const { open } = useSidebar();

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
      label: 'Assets',
      href: '/assets',
      icon: <Palette className="text-torqx-primary dark:text-white h-4 w-4 flex-shrink-0" />
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
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo colapsável */}
          <div className="flex items-center justify-start p-2 mb-4">
            <motion.div
              animate={{
                display: open ? "flex" : "none",
                opacity: open ? 1 : 0,
              }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-torqx-primary dark:text-white font-satoshi">
                Torqx
              </span>
            </motion.div>
            
            {/* Logo colapsado - apenas ícone */}
            <motion.div
              animate={{
                display: !open ? "flex" : "none",
                opacity: !open ? 1 : 0,
              }}
              className="w-8 h-8 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-lg flex items-center justify-center mx-auto"
            >
              <Wrench className="w-4 h-4 text-white" />
            </motion.div>
          </div>

          {/* Links de navegação */}
          <div className="flex flex-col gap-1">
            {links.map((link, idx) => (
              <SidebarLink 
                key={idx} 
                link={link}
                className={`${location.pathname === link.href ? 'bg-torqx-secondary/10 text-torqx-secondary border-r-2 border-torqx-secondary' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Área do usuário */}
        <div className="border-t border-gray-200 dark:border-torqx-primary-light pt-3">
          {/* Perfil do usuário - expandido */}
          <motion.div
            animate={{
              display: open ? "flex" : "none",
              opacity: open ? 1 : 0,
            }}
            className="flex items-center space-x-2 mb-3 px-2"
          >
            <div className="w-8 h-8 bg-torqx-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-torqx-primary dark:text-white truncate">
                {user?.user_metadata?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </motion.div>

          {/* Perfil do usuário - colapsado */}
          <motion.div
            animate={{
              display: !open ? "flex" : "none",
              opacity: !open ? 1 : 0,
            }}
            className="flex justify-center mb-3 px-2"
          >
            <div className="w-8 h-8 bg-torqx-secondary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </motion.div>

          {/* Botão de logout */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <motion.span 
              animate={{
                display: open ? "inline-block" : "none",
                opacity: open ? 1 : 0,
              }}
              className="text-sm"
            >
              Sair
            </motion.span>
          </button>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default TorqxSidebar;
