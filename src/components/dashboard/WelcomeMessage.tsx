
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, CheckCircle, TrendingUp, Settings, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingBanner from '@/components/onboarding/OnboardingBanner';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';

interface WelcomeMessageProps {
  onStartTour?: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onStartTour }) => {
  const navigate = useNavigate();
  const { progress, isLoading, resetOnboarding } = useOnboarding();
  const [showWizard, setShowWizard] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    console.log('WelcomeMessage: Estado atualizado:', {
      progress,
      isLoading,
      isCompleted: progress?.isCompleted,
      currentStep: progress?.currentStep,
      progressPercentage: progress?.progress
    });
  }, [progress, isLoading]);

  // Mostrar loading enquanto carrega
  if (isLoading) {
    console.log('WelcomeMessage: Mostrando estado de loading');
    return (
      <Card className="bg-gray-100 animate-pulse mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Configurando sua oficina no Torqx...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se o onboarding foi completado, não mostrar nada
  const shouldShowOnboarding = progress !== null && progress !== undefined;
  const isOnboardingCompleted = shouldShowOnboarding && progress && progress.isCompleted;
  
  console.log('WelcomeMessage: shouldShowOnboarding:', shouldShowOnboarding, 'isCompleted:', isOnboardingCompleted);

  // Se completou o onboarding, não renderizar nada (dashboard limpo)
  if (isOnboardingCompleted) {
    return null;
  }

  return (
    <>
      {/* Sempre mostrar a barra de progresso quando há progress e não está completo */}
      {shouldShowOnboarding && progress && !progress.isCompleted && <OnboardingProgressBar />}
      
      {/* Banner de onboarding se não foi dispensado e não está completo */}
      {shouldShowOnboarding && !bannerDismissed && progress && !progress.isCompleted && (
        <OnboardingBanner 
          onOpenWizard={() => setShowWizard(true)}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {/* Se o onboarding existe mas não está completo, mostrar progresso */}
      {shouldShowOnboarding && progress && !progress.isCompleted && (
        <Card className="bg-gradient-to-r from-torqx-primary to-torqx-primary-light text-white border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-2 font-satoshi">
                    Continue configurando sua oficina! 💪
                  </h2>
                  <p className="text-sm opacity-90 mb-4">
                    Você já está {progress.progress}% no caminho! Vamos finalizar a configuração.
                  </p>
                  
                  <div className="flex items-center space-x-2 text-sm bg-white/20 rounded-lg px-3 py-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Progresso: {progress.progress}% concluído</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWizard(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Continuar Setup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Se não há progresso ainda (primeira vez), mostrar convite inicial */}
      {!shouldShowOnboarding && (
        <Card className="bg-gradient-to-r from-torqx-primary to-torqx-primary-light text-white border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Rocket className="w-8 h-8" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-2 font-satoshi">
                    Bem-vindo ao Torqx! 👋
                  </h2>
                  <p className="text-sm opacity-90 mb-4">
                    Configure sua oficina em poucos passos e comece a usar todas as funcionalidades.
                  </p>
                  
                  <div className="flex items-center space-x-2 text-sm bg-yellow-500/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Vamos configurar sua oficina para começar a usar o Torqx!</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/welcome')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Conhecer Torqx
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWizard(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar Agora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Wizard do onboarding */}
      <OnboardingWizard 
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
      />
    </>
  );
};

export default WelcomeMessage;
