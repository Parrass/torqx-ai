
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Package, Clock } from 'lucide-react';
import { usePurchases } from '@/hooks/usePurchases';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PurchaseMetrics = () => {
  const { metrics, purchases } = usePurchases();

  if (metrics.isLoading || purchases.isLoading) {
    return <div className="text-center py-8">Carregando métricas...</div>;
  }

  const metricsData = metrics.data || [];
  const purchasesData = purchases.data || [];
  
  // Métricas do mês atual
  const currentMonth = new Date();
  const currentMonthMetrics = metricsData.find(m => 
    new Date(m.month).getMonth() === currentMonth.getMonth() &&
    new Date(m.month).getFullYear() === currentMonth.getFullYear()
  );

  // Métricas do mês anterior
  const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
  const lastMonthMetrics = metricsData.find(m => 
    new Date(m.month).getMonth() === lastMonth.getMonth() &&
    new Date(m.month).getFullYear() === lastMonth.getFullYear()
  );

  // Calcular variações
  const calculateVariation = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const totalSpentVariation = calculateVariation(
    currentMonthMetrics?.total_spent || 0,
    lastMonthMetrics?.total_spent || 0
  );

  const totalPurchasesVariation = calculateVariation(
    currentMonthMetrics?.total_purchases || 0,
    lastMonthMetrics?.total_purchases || 0
  );

  const avgPurchaseVariation = calculateVariation(
    currentMonthMetrics?.avg_purchase_value || 0,
    lastMonthMetrics?.avg_purchase_value || 0
  );

  // Compras pendentes
  const pendingPurchases = purchasesData.filter(p => p.payment_status === 'pending').length;

  const MetricCard = ({ 
    title, 
    value, 
    variation, 
    icon: Icon, 
    color = "text-torqx-primary",
    prefix = "",
    suffix = ""
  }: {
    title: string;
    value: number;
    variation?: number;
    icon: any;
    color?: string;
    prefix?: string;
    suffix?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{value.toLocaleString('pt-BR', { minimumFractionDigits: prefix === 'R$ ' ? 2 : 0 })}{suffix}
        </div>
        {variation !== undefined && (
          <p className="text-xs text-muted-foreground">
            <span className={variation >= 0 ? 'text-green-600' : 'text-red-600'}>
              {variation >= 0 ? (
                <TrendingUp className="inline h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="inline h-3 w-3 mr-1" />
              )}
              {Math.abs(variation).toFixed(1)}%
            </span>
            {' '}em relação ao mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <MetricCard
        title="Total Gasto (Mês)"
        value={currentMonthMetrics?.total_spent || 0}
        variation={totalSpentVariation}
        icon={DollarSign}
        color="text-red-600"
        prefix="R$ "
      />
      
      <MetricCard
        title="Compras (Mês)"
        value={currentMonthMetrics?.total_purchases || 0}
        variation={totalPurchasesVariation}
        icon={Package}
        color="text-blue-600"
      />
      
      <MetricCard
        title="Ticket Médio"
        value={currentMonthMetrics?.avg_purchase_value || 0}
        variation={avgPurchaseVariation}
        icon={TrendingUp}
        color="text-green-600"
        prefix="R$ "
      />
      
      <MetricCard
        title="Pendentes"
        value={pendingPurchases}
        icon={Clock}
        color="text-orange-600"
      />
    </div>
  );
};

export default PurchaseMetrics;
