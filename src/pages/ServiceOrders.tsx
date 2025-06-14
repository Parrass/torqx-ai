
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ServiceOrders = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return <Clock className="w-4 h-4" />;
      case 'concluido':
        return <CheckCircle className="w-4 h-4" />;
      case 'aguardando':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'aguardando':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary">Ordens de Serviço</h1>
            <p className="text-gray-600 mt-2">Gerencie todas as ordens de serviço da sua oficina</p>
          </div>
          <Button className="bg-torqx-secondary hover:bg-torqx-secondary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Nova OS
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-torqx-secondary" />
                    OS #2025-001
                  </CardTitle>
                  <CardDescription>Honda Civic 2020 - ABC-1234</CardDescription>
                </div>
                <Badge className={`flex items-center gap-1 ${getStatusColor('em_andamento')}`}>
                  {getStatusIcon('em_andamento')}
                  Em Andamento
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div><span className="text-gray-600">Cliente:</span> <span className="font-medium">João Silva</span></div>
                  <div><span className="text-gray-600">Técnico:</span> <span className="font-medium">Carlos Mendes</span></div>
                  <div><span className="text-gray-600">Problema:</span> <span className="font-medium">Barulho no motor</span></div>
                </div>
                <div className="space-y-2">
                  <div><span className="text-gray-600">Criada em:</span> <span className="font-medium">15/01/2025</span></div>
                  <div><span className="text-gray-600">Previsão:</span> <span className="font-medium">17/01/2025</span></div>
                  <div><span className="text-gray-600">Valor:</span> <span className="font-medium text-torqx-accent">R$ 450,00</span></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-torqx-secondary" />
                    OS #2025-002
                  </CardTitle>
                  <CardDescription>Toyota Corolla 2019 - XYZ-5678</CardDescription>
                </div>
                <Badge className={`flex items-center gap-1 ${getStatusColor('aguardando')}`}>
                  {getStatusIcon('aguardando')}
                  Aguardando Peças
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div><span className="text-gray-600">Cliente:</span> <span className="font-medium">Maria Santos</span></div>
                  <div><span className="text-gray-600">Técnico:</span> <span className="font-medium">Ana Costa</span></div>
                  <div><span className="text-gray-600">Problema:</span> <span className="font-medium">Troca de embreagem</span></div>
                </div>
                <div className="space-y-2">
                  <div><span className="text-gray-600">Criada em:</span> <span className="font-medium">14/01/2025</span></div>
                  <div><span className="text-gray-600">Previsão:</span> <span className="font-medium">20/01/2025</span></div>
                  <div><span className="text-gray-600">Valor:</span> <span className="font-medium text-torqx-accent">R$ 1.200,00</span></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-torqx-secondary" />
                    OS #2025-003
                  </CardTitle>
                  <CardDescription>Ford Ka 2018 - DEF-9101</CardDescription>
                </div>
                <Badge className={`flex items-center gap-1 ${getStatusColor('concluido')}`}>
                  {getStatusIcon('concluido')}
                  Concluído
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div><span className="text-gray-600">Cliente:</span> <span className="font-medium">Pedro Costa</span></div>
                  <div><span className="text-gray-600">Técnico:</span> <span className="font-medium">Roberto Silva</span></div>
                  <div><span className="text-gray-600">Problema:</span> <span className="font-medium">Revisão preventiva</span></div>
                </div>
                <div className="space-y-2">
                  <div><span className="text-gray-600">Criada em:</span> <span className="font-medium">10/01/2025</span></div>
                  <div><span className="text-gray-600">Concluída em:</span> <span className="font-medium">13/01/2025</span></div>
                  <div><span className="text-gray-600">Valor:</span> <span className="font-medium text-torqx-accent">R$ 320,00</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceOrders;
