
import React, { useState } from 'react';
import { Wrench, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FirstServiceOrderStepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const FirstServiceOrderStep: React.FC<FirstServiceOrderStepProps> = ({ onNext, onSkip }) => {
  const [osCreated, setOsCreated] = useState(false);

  const handleCreateOS = () => {
    // Simular criação de OS
    setOsCreated(true);
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  if (osCreated) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-torqx-primary font-satoshi">
          Primeira OS Criada!
        </h2>
        <p className="text-gray-600">
          Perfeito! Você acabou de criar sua primeira ordem de serviço. 
          Agora você já sabe o básico para usar o Torqx.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center mx-auto">
          <Wrench className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-torqx-primary font-satoshi">
          Crie sua Primeira Ordem de Serviço
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A ordem de serviço é o coração do sistema. Vamos criar uma OS de exemplo 
          para você ver como funciona o fluxo completo.
        </p>
      </div>

      <div className="text-center space-y-6">
        <div className="bg-green-50 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-green-900 mb-2">
            Exemplo de OS
          </h3>
          <div className="text-sm text-green-800 space-y-1">
            <p><strong>Problema:</strong> Barulho no motor</p>
            <p><strong>Cliente:</strong> João Silva</p>
            <p><strong>Veículo:</strong> Gol 2020</p>
            <p><strong>Status:</strong> Agendada</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {onSkip && (
            <Button variant="outline" onClick={onSkip}>
              Pular por agora
            </Button>
          )}
          <Button 
            onClick={handleCreateOS}
            className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white"
          >
            Criar OS de Exemplo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FirstServiceOrderStep;
