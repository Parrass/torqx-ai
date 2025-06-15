
import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import CompanyLogo from '@/components/CompanyLogo';
import UserDropdown from '@/components/UserDropdown';

const TorqxNavbar = () => {
  const { setOpen } = useSidebar();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 dark:bg-torqx-primary dark:border-torqx-primary-light">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left section */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-torqx-primary-light transition-colors md:hidden"
          >
            <Menu className="w-5 h-5 text-torqx-primary dark:text-white" />
          </button>

          {/* Company Logo */}
          <CompanyLogo />
          
          {/* Company Name */}
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-torqx-primary dark:text-white font-satoshi">
              Torqx
            </h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-torqx-primary-light transition-colors">
            <Search className="w-5 h-5 text-gray-600 dark:text-white" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-torqx-primary-light transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
};

export default TorqxNavbar;
