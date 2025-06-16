
import React, { useState } from 'react';
import { Map, Play, CheckCircle, BarChart3, Users, Car, Wrench, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/hooks/useOnboarding';

interface PlatformTourStepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const PlatformTourStep: React.FC<PlatformTourStepProps> = ({ onNext, onSkip }) => {
  const [tourCompleted, setTourCompleted] = useState(false);
  const { steps, completeStep } = useOnboarding();

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard',
      description: 'Visão geral da sua oficina em tempo real',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Clientes',
      description: 'Gestão completa da base de clientes',
      color: 'text-green-600'
    },
    {
      icon: Car,
      title: 'Veículos',
      description: 'Histórico e informações dos veículos',
      color: 'text-purple-600'
    },
    {
      icon: Wrench,
      title: 'Ordens de Serviço',
      description: 'Controle total dos serviços',
      color: 'text-orange-600'
    },
    {
      icon: Package,
      title: 'Estoque',
      description: 'Gestão de peças e materiais',
      color: 'text-red-600'
    }
  ];

  const handleStartTour = async () => {
    // Completar todos os passos anteriores que ainda não foram completados
    const incompleteSteps = steps.filter(step => 
      !step.isCompleted && step.id !== 'tour'
    );
    
    // Completar cada passo em sequência
    for (const step of incompleteSteps) {
      completeStep(step.id);
    }
    
    // Simular tour
    setTourCompleted(true);
    setTimeout(() => {
      // Finalizar o onboarding completamente
      onNext();
    }, 2000);
  };

  const handleSkipTour = () => {
    // Se pular, também finalizar o onboarding
    onNext();
  };

  if (tourCompleted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-torqx-primary font-satoshi">
          Tour Concluído!
        </h2>
        <p className="text-gray-600">
          Parabéns! Você completou toda a configuração inicial. 
          Agora você está pronto para usar o Torqx com todo seu potencial.
        </p>
        <div className="bg-torqx-accent/10 rounded-xl p-4 text-center">
          <p className="text-torqx-accent font-medium">
            🎉 Onboarding 100% concluído! Bem-vindo ao Torqx!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center mx-auto">
          <Map className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-torqx-primary font-satoshi">
          Tour pela Plataforma
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Agora que você tem os dados básicos configurados, vamos fazer um tour 
          rápido pelas principais funcionalidades da plataforma.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <feature.icon className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Tour Info */}
        <div className="bg-torqx-secondary/5 rounded-xl p-6 text-center space-y-4">
          <div className="flex justify-center">
            <Play className="w-12 h-12 text-torqx-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-torqx-primary">
            Tour Interativo (5 minutos)
          </h3>
          <p className="text-gray-600">
            Vamos mostrar como usar cada funcionalidade com exemplos práticos. 
            Você pode pular se preferir explorar por conta própria.
          </p>
          <p className="text-sm text-torqx-secondary font-medium">
            💡 Completar o tour marcará automaticamente todos os passos anteriores como concluídos
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={handleSkipTour}>
              Explorar sozinho
            </Button>
            <Button 
              onClick={handleStartTour}
              className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformTourStep;
