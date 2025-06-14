
import React from 'react';
import { 
  DollarSign, Users, Car, Wrench, 
  TrendingUp, TrendingDown, Clock, 
  AlertTriangle, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardMetricsProps {
  metrics: {
    total_customers: number;
    total_vehicles: number;
    active_service_orders: number;
    total_revenue: number;
    inventory_alerts: number;
  } | null;
}

const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const metricCards = [
    {
      title: 'Receita Total',
      value: formatCurrency(metrics?.total_revenue || 0),
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: '+12.5%',
      trendUp: true,
      description: 'vs. mês anterior'
    },
    {
      title: 'OS Ativas',
      value: metrics?.active_service_orders || 0,
      icon: Wrench,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+3',
      trendUp: true,
      description: 'em andamento'
    },
    {
      title: 'Total de Clientes',
      value: metrics?.total_customers || 0,
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+8',
      trendUp: true,
      description: 'este mês'
    },
    {
      title: 'Veículos Cadastrados',
      value: metrics?.total_vehicles || 0,
      icon: Car,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '+5',
      trendUp: true,
      description: 'total registrado'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-torqx-primary font-satoshi">
                {metric.value}
              </div>
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 ${
                  metric.trendUp ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {metric.trendUp ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{metric.trend}</span>
                </div>
                <span className="text-sm text-gray-500">{metric.description}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
