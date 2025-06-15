
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardStats from '@/components/DashboardStats';
import QuickActions from '@/components/QuickActions';
import RecentActivity from '@/components/RecentActivity';
import DashboardMetrics from '@/components/DashboardMetrics';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import QuickStartGuide from '@/components/dashboard/QuickStartGuide';
import InventoryAlerts from '@/components/dashboard/InventoryAlerts';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Message */}
        <WelcomeMessage />

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary font-satoshi">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie sua oficina com eficiência
            </p>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            <DashboardMetrics />
            <RecentActivity />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <QuickStartGuide />
            <InventoryAlerts />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
