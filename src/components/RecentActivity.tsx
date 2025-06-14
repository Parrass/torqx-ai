
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye, Calendar, User, Car } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentOrder {
  id: string;
  order_number: number;
  customer_name: string;
  vehicle_info: string;
  status: string;
  estimated_cost: number;
  created_at: string;
}

interface RecentActivityProps {
  recentOrders: RecentOrder[];
}

const RecentActivity = ({ recentOrders }: RecentActivityProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em andamento';
      case 'scheduled':
        return 'Agendada';
      case 'draft':
        return 'Rascunho';
      case 'awaiting_approval':
        return 'Aguardando aprovação';
      default:
        return status;
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-torqx-primary font-satoshi">
          Atividades Recentes
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-torqx-secondary hover:text-torqx-secondary-dark">
          Ver todas
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-start justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-torqx-primary">
                      OS #{order.order_number}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{order.customer_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="w-4 h-4" />
                      <span>{order.vehicle_info}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {format(new Date(order.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                    <div className="font-semibold text-torqx-primary">
                      {formatCurrency(order.estimated_cost)}
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-4"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm">Nenhuma atividade recente</p>
              <p className="text-xs text-gray-400 mt-1">
                As ordens de serviço aparecerão aqui
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
