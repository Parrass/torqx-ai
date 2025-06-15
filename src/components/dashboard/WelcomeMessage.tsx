
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, CheckCircle, TrendingUp, Settings, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingBanner from '@/components/onboarding/OnboardingBanner';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

interface WelcomeMessageProps {
  onStartTour?: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onStartTour }) => {
  const navigate = useNavigate();
  const { progress, isLoading } = useOnboarding();
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

  // Debug: sempre mostrar o estado atual
  const debugInfo = (
    <div className="bg-gray-100 p-2 rounded text-xs font-mono mb-4">
      <div>Loading: {isLoading ? 'true' : 'false'}</div>
      <div>Progress: {progress ? JSON.stringify(progress, null, 2) : 'null'}</div>
    </div>
  );

  // Mostrar loading
  if (isLoading) {
    console.log('WelcomeMessage: Mostrando estado de loading');
    return (
      <Card className="bg-gray-100 animate-pulse mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Carregando configuração do onboarding...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se o onboarding foi completado
  if (progress && progress.isCompleted) {
    console.log('WelcomeMessage: Mostrando estado de conclusão');
    return (
      <Card className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white border-0 shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2 font-satoshi">
                  Parabéns! Configuração concluída! 🎉
                </h2>
                <p className="text-sm opacity-90 mb-4">
                  Sua oficina está pronta para usar todo o potencial do Torqx. 
                  Agora você pode gerenciar clientes, veículos e ordens de serviço com eficiência.
                </p>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Oficina configurada</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Dados iniciais criados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Pronto para crescer</span>
                  </div>
                </div>
              </div>
            </div>
            
            {onStartTour && (
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onStartTour}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Tour da Plataforma
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se há progresso em andamento e não foi dispensado
  if (progress && !progress.isCompleted && !bannerDismissed) {
    console.log('WelcomeMessage: Mostrando banner de progresso');
    return (
      <>
        <OnboardingBanner 
          onOpenWizard={() => setShowWizard(true)}
          onDismiss={() => setBannerDismissed(true)}
        />
        <OnboardingWizard 
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
        />
      </>
    );
  }

  // Se não há progresso ou foi dispensado, mostrar convite para iniciar
  console.log('WelcomeMessage: Mostrando convite inicial');
  return (
    <>
      {/* Debug info - remover em produção */}
      {process.env.NODE_ENV === 'development' && debugInfo}
      
      <Card className="bg-gradient-to-r from-torqx-primary to-torqx-primary-light text-white border-0 shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2 font-satoshi">
                  Bem-vindo ao Torqx! 👋
                </h2>
                <p className="text-sm opacity-90 mb-4">
                  Configure sua oficina em poucos passos e comece a usar todas as funcionalidades.
                </p>
                
                {!progress && (
                  <div className="flex items-center space-x-2 text-sm bg-yellow-500/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Onboarding não iniciado. Clique em "Configurar Agora" para começar.</span>
                  </div>
                )}
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
          
          <OnboardingWizard 
            isOpen={showWizard}
            onClose={() => setShowWizard(false)}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default WelcomeMessage;
