
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import TorqxSidebar from '@/components/TorqxSidebar';
import TorqxNavbar from '@/components/TorqxNavbar';
import TorqxFooter from '@/components/TorqxFooter';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col w-full">
        <TorqxNavbar />
        <TorqxSidebar />
        
        {/* Main content with padding to account for navbar and sidebar */}
        <div className="md:pl-[60px] pt-16 flex-1 transition-all duration-300">
          <div className="md:group-hover:pl-[190px]">
            {children}
            <TorqxFooter />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
