
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ServiceOrderStats {
  total: number;
  draft: number;
  scheduled: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

interface DashboardStatsProps {
  serviceOrderStats?: ServiceOrderStats;
}

const DashboardStats = ({ serviceOrderStats }: DashboardStatsProps) => {
  const stats = serviceOrderStats || {
    total: 0,
    draft: 0,
    scheduled: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  };

  const statusConfig = [
    {
      label: 'Rascunho',
      value: stats.draft,
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
      icon: Clock,
      badge: 'secondary'
    },
    {
      label: 'Agendadas',
      value: stats.scheduled,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      icon: Clock,
      badge: 'default'
    },
    {
      label: 'Em Andamento',
      value: stats.in_progress,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      icon: AlertCircle,
      badge: 'default'
    },
    {
      label: 'Concluídas',
      value: stats.completed,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      icon: CheckCircle,
      badge: 'default'
    }
  ];

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status das Ordens de Serviço */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-torqx-primary font-satoshi">
            Status das Ordens de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusConfig.map((status) => (
              <div key={status.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <status.icon className={`w-4 h-4 ${status.textColor}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={status.badge as any} className="text-xs">
                    {status.value}
                  </Badge>
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${status.color} transition-all duration-300`}
                      style={{ 
                        width: stats.total > 0 ? `${(status.value / stats.total) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Taxa de Conclusão */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-torqx-primary font-satoshi">
            Performance do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Taxa de Conclusão</span>
                <span className="text-2xl font-bold text-torqx-primary font-satoshi">
                  {completionRate.toFixed(1)}%
                </span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 font-satoshi">
                  {stats.total}
                </div>
                <div className="text-sm text-blue-600">Total de OS</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 font-satoshi">
                  {stats.completed}
                </div>
                <div className="text-sm text-emerald-600">Concluídas</div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Média de conclusão diária</span>
                <span className="font-medium text-torqx-primary">
                  {Math.round(stats.completed / 30)} OS/dia
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
