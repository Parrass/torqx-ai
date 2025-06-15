
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, CheckCircle, TrendingUp } from 'lucide-react';

interface WelcomeMessageProps {
  onStartTour?: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onStartTour }) => {
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
};

export default WelcomeMessage;
