
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardStats from '@/components/DashboardStats';
import QuickActions from '@/components/QuickActions';
import RecentActivity from '@/components/RecentActivity';
import DashboardMetrics from '@/components/DashboardMetrics';
import OnboardingBanner from '@/components/onboarding/OnboardingBanner';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import TaskChecklist from '@/components/onboarding/TaskChecklist';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';
import QuickStartGuide from '@/components/dashboard/QuickStartGuide';
import { useOnboarding } from '@/hooks/useOnboarding';

const Dashboard = () => {
  const { progress, isLoading } = useOnboarding();
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(true);

  // Mostrar onboarding se não estiver completo e banner não foi dispensado
  const shouldShowOnboarding = progress && !progress.isCompleted && showOnboardingBanner;
  
  // Mostrar mensagem de boas-vindas se onboarding foi completado
  const shouldShowWelcomeMessage = progress && progress.isCompleted;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Onboarding Banner */}
        {shouldShowOnboarding && (
          <OnboardingBanner
            onOpenWizard={() => setShowOnboardingWizard(true)}
            onDismiss={() => setShowOnboardingBanner(false)}
          />
        )}

        {/* Welcome Message - só mostra após onboarding completado */}
        {shouldShowWelcomeMessage && (
          <WelcomeMessage />
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary font-satoshi">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              {shouldShowWelcomeMessage 
                ? 'Gerencie sua oficina com eficiência' 
                : 'Visão geral da sua oficina'}
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
            {/* Show task checklist if onboarding is not completed, otherwise show quick start guide */}
            {progress && !progress.isCompleted ? (
              <TaskChecklist />
            ) : (
              <QuickStartGuide />
            )}
          </div>
        </div>

        {/* Onboarding Wizard Modal */}
        <OnboardingWizard
          isOpen={showOnboardingWizard}
          onClose={() => setShowOnboardingWizard(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
