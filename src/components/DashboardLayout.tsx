
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import TorqxNavbar from '@/components/TorqxNavbar';
import TorqxFooter from '@/components/TorqxFooter';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TorqxNavbar />
          
          <main className="flex-1 pt-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
            <TorqxFooter />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
