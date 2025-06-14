
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TorqxNavbar />
          <main className="flex-1 pt-16 px-6 py-8">
            {children}
          </main>
          <TorqxFooter />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
