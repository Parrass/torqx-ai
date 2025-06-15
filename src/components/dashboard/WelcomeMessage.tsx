
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, CheckCircle, TrendingUp, Settings } from 'lucide-react';
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
    console.log('Onboarding progress:', progress);
    console.log('Is loading:', isLoading);
  }, [progress, isLoading]);

  // Se ainda estiver carregando, não mostrar nada
  if (isLoading) {
    return null;
  }

  // Se o onboarding não foi completado e o banner não foi dispensado, mostrar banner
  if (progress && !progress.isCompleted && !bannerDismissed) {
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

  // Se o onboarding foi completado, mostrar mensagem de parabéns
  if (progress && progress.isCompleted) {
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

  // Se não há progresso de onboarding, mostrar um botão para iniciar
  return (
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
  );
};

export default WelcomeMessage;
