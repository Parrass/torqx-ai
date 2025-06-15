
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Car, Wrench, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickStartGuide: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Cadastrar Cliente',
      description: 'Adicione novos clientes ao sistema',
      icon: Users,
      action: () => navigate('/customers'),
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Registrar Veículo',
      description: 'Cadastre veículos para seus clientes',
      icon: Car,
      action: () => navigate('/vehicles'),
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
      title: 'Nova Ordem de Serviço',
      description: 'Crie uma nova OS',
      icon: Wrench,
      action: () => navigate('/service-orders'),
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Ver Relatórios',
      description: 'Analise o desempenho da oficina',
      icon: BarChart3,
      action: () => navigate('/reports'),
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-torqx-primary font-satoshi">
          Próximos Passos
        </CardTitle>
        <p className="text-sm text-gray-600">
          Continue explorando as funcionalidades do Torqx
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg group ${action.color}`}
              onClick={action.action}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <action.icon className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm opacity-80">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartGuide;
