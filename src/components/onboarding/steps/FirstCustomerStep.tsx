
import React, { useState } from 'react';
import { User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomerForm from '@/components/CustomerForm';
import { useCreateCustomer } from '@/hooks/useCustomers';

interface FirstCustomerStepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const FirstCustomerStep: React.FC<FirstCustomerStepProps> = ({ onNext, onSkip }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [customerCreated, setCustomerCreated] = useState(false);
  const createCustomer = useCreateCustomer();

  const handleCreateCustomer = async (customerData: any) => {
    setIsCreating(true);
    try {
      await createCustomer.mutateAsync(customerData);
      setCustomerCreated(true);
      setTimeout(() => {
        onNext();
      }, 1500);
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (customerCreated) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-torqx-primary font-satoshi">
          Primeiro Cliente Cadastrado!
        </h2>
        <p className="text-gray-600">
          Parabéns! Você acabou de cadastrar seu primeiro cliente. 
          Agora vamos cadastrar um veículo para ele.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-torqx-primary font-satoshi">
          Cadastre seu Primeiro Cliente
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Vamos começar cadastrando um cliente. Isso pode ser um cliente existente ou 
          você pode usar dados fictícios apenas para testar o sistema.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800">
            💡 <strong>Dica:</strong> Você pode usar dados de exemplo como "João Silva" 
            para testar o sistema. Depois é fácil editar ou remover.
          </p>
        </div>

        <CustomerForm
          onSubmit={handleCreateCustomer}
          onCancel={onSkip}
          isLoading={isCreating}
        />
      </div>
    </div>
  );
};

export default FirstCustomerStep;
