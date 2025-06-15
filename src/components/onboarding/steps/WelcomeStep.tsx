
import React from 'react';
import { Play, CheckCircle, Users, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-torqx-primary font-satoshi">
          Bem-vindo ao Torqx!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Parabéns por dar o primeiro passo para revolucionar a gestão da sua oficina. 
          Vamos configurar tudo em poucos minutos para você começar a usar hoje mesmo.
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="bg-gray-100 rounded-xl p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Play className="w-8 h-8 text-torqx-secondary" />
          <span className="text-lg font-medium text-gray-700">Vídeo de Boas-vindas</span>
        </div>
        <p className="text-gray-600">
          Assista a uma breve apresentação sobre como o Torqx vai transformar sua oficina
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.open('https://www.youtube.com/watch?v=demo', '_blank')}
        >
          <Play className="w-4 h-4 mr-2" />
          Assistir Vídeo (2 min)
        </Button>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-torqx-secondary/10 rounded-lg flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6 text-torqx-secondary" />
          </div>
          <h3 className="font-semibold text-torqx-primary">IA Integrada</h3>
          <p className="text-sm text-gray-600">
            Diagnósticos automáticos e recomendações inteligentes
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-torqx-accent/10 rounded-lg flex items-center justify-center mx-auto">
            <Users className="w-6 h-6 text-torqx-accent" />
          </div>
          <h3 className="font-semibold text-torqx-primary">Gestão Completa</h3>
          <p className="text-sm text-gray-600">
            Clientes, veículos, ordens de serviço e estoque em um só lugar
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-torqx-primary">Insights Poderosos</h3>
          <p className="text-sm text-gray-600">
            Relatórios em tempo real para decisões inteligentes
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-torqx-secondary/5 rounded-xl p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-torqx-primary mb-2">
          Pronto para começar?
        </h3>
        <p className="text-gray-600 mb-4">
          O processo de configuração leva apenas 5-10 minutos. Você pode pular etapas 
          opcionais e voltar depois.
        </p>
        <Button 
          onClick={onNext}
          className="w-full bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white"
        >
          Vamos começar!
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
