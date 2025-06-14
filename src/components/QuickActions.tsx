
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, Users, Car, Wrench, Package, 
  Calendar, BarChart3, Settings 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Nova OS',
      description: 'Criar ordem de serviço',
      icon: Plus,
      color: 'bg-torqx-secondary text-white hover:bg-torqx-secondary-dark',
      onClick: () => navigate('/service-orders')
    },
    {
      title: 'Novo Cliente',
      description: 'Cadastrar cliente',
      icon: Users,
      color: 'bg-white text-torqx-primary border border-gray-200 hover:bg-gray-50',
      onClick: () => navigate('/customers')
    },
    {
      title: 'Novo Veículo',
      description: 'Registrar veículo',
      icon: Car,
      color: 'bg-white text-torqx-primary border border-gray-200 hover:bg-gray-50',
      onClick: () => navigate('/vehicles')
    },
    {
      title: 'Estoque',
      description: 'Gerenciar peças',
      icon: Package,
      color: 'bg-white text-torqx-primary border border-gray-200 hover:bg-gray-50',
      onClick: () => navigate('/inventory')
    }
  ];

  const quickLinks = [
    {
      title: 'Agendamentos',
      icon: Calendar,
      onClick: () => navigate('/appointments')
    },
    {
      title: 'Relatórios',
      icon: BarChart3,
      onClick: () => navigate('/reports')
    },
    {
      title: 'Configurações',
      icon: Settings,
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Ações Principais */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-torqx-primary font-satoshi">
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center space-y-2 ${action.color}`}
                onClick={action.onClick}
              >
                <action.icon className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-75">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Links Rápidos */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-torqx-primary font-satoshi">
            Acesso Rápido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <Button
                key={link.title}
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-gray-50"
                onClick={link.onClick}
              >
                <link.icon className="w-4 h-4 mr-3 text-torqx-secondary" />
                <span className="text-sm">{link.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
