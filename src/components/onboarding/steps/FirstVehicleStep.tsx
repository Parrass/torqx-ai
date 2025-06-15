
import React, { useState } from 'react';
import { Car, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FirstVehicleStepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const FirstVehicleStep: React.FC<FirstVehicleStepProps> = ({ onNext, onSkip }) => {
  const [vehicleCreated, setVehicleCreated] = useState(false);

  const handleCreateVehicle = () => {
    // Simular criação de veículo
    setVehicleCreated(true);
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  if (vehicleCreated) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-torqx-primary font-satoshi">
          Primeiro Veículo Cadastrado!
        </h2>
        <p className="text-gray-600">
          Excelente! Agora você tem um cliente e um veículo. 
          Vamos criar sua primeira ordem de serviço.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center mx-auto">
          <Car className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-torqx-primary font-satoshi">
          Cadastre um Veículo
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Agora vamos cadastrar um veículo para o cliente que você acabou de criar.
        </p>
      </div>

      <div className="text-center space-y-6">
        <div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-blue-900 mb-2">
            Exemplo de Veículo
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Marca:</strong> Volkswagen</p>
            <p><strong>Modelo:</strong> Gol</p>
            <p><strong>Ano:</strong> 2020</p>
            <p><strong>Placa:</strong> ABC-1234</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {onSkip && (
            <Button variant="outline" onClick={onSkip}>
              Pular por agora
            </Button>
          )}
          <Button 
            onClick={handleCreateVehicle}
            className="bg-gradient-to-r from-torqx-secondary to-torqx-accent text-white"
          >
            Cadastrar Veículo de Exemplo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FirstVehicleStep;
