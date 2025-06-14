
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Package, AlertTriangle } from 'lucide-react';
import { usePurchases } from '@/hooks/usePurchases';
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export const PurchaseMetrics = () => {
  const { data: purchases = [] } = usePurchases();

  // Calculate metrics for the last 6 months
  const monthlyData = React.useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthPurchases = purchases.filter(purchase => {
        const purchaseDate = parseISO(purchase.purchase_date);
        return purchaseDate >= monthStart && purchaseDate <= monthEnd;
      });

      months.push({
        month: format(date, 'MMM', { locale: ptBR }),
        total: monthPurchases.reduce((sum, p) => sum + parseFloat(String(p.final_amount || 0)), 0),
        count: monthPurchases.length,
        paid: monthPurchases.filter(p => p.payment_status === 'paid').length,
        pending: monthPurchases.filter(p => p.payment_status === 'pending').length,
      });
    }
    return months;
  }, [purchases]);

  // Category breakdown
  const categoryData = React.useMemo(() => {
    const categories = purchases.reduce((acc, purchase) => {
      const category = purchase.category || 'general';
      if (!acc[category]) {
        acc[category] = { name: category, value: 0, count: 0 };
      }
      acc[category].value += parseFloat(String(purchase.final_amount || 0));
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number; count: number }>);

    return Object.values(categories).map((cat, index) => ({
      ...cat,
      color: COLORS[index % COLORS.length],
      percentage: ((cat.value / purchases.reduce((sum, p) => sum + parseFloat(String(p.final_amount || 0)), 0)) * 100).toFixed(1)
    }));
  }, [purchases]);

  // Current month metrics
  const currentMonth = React.useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const currentMonthPurchases = purchases.filter(purchase => {
      const purchaseDate = parseISO(purchase.purchase_date);
      return purchaseDate >= monthStart && purchaseDate <= monthEnd;
    });

    const previousMonth = subMonths(now, 1);
    const prevMonthStart = startOfMonth(previousMonth);
    const prevMonthEnd = endOfMonth(previousMonth);
    
    const previousMonthPurchases = purchases.filter(purchase => {
      const purchaseDate = parseISO(purchase.purchase_date);
      return purchaseDate >= prevMonthStart && purchaseDate <= prevMonthEnd;
    });

    const currentTotal = currentMonthPurchases.reduce((sum, p) => sum + parseFloat(String(p.final_amount || 0)), 0);
    const previousTotal = previousMonthPurchases.reduce((sum, p) => sum + parseFloat(String(p.final_amount || 0)), 0);
    
    const growth = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

    return {
      total: currentTotal,
      count: currentMonthPurchases.length,
      growth,
      pending: currentMonthPurchases.filter(p => p.payment_status === 'pending').length,
      overdue: currentMonthPurchases.filter(p => {
        if (!p.due_date) return false;
        return parseISO(String(p.due_date)) < now && p.payment_status === 'pending';
      }).length,
    };
  }, [purchases]);

  // Top suppliers
  const topSuppliers = React.useMemo(() => {
    const suppliers = purchases.reduce((acc, purchase) => {
      const supplier = purchase.supplier_name;
      if (!acc[supplier]) {
        acc[supplier] = { name: supplier, value: 0, count: 0 };
      }
      acc[supplier].value += parseFloat(String(purchase.final_amount || 0));
      acc[supplier].count += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number; count: number }>);

    return Object.values(suppliers)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [purchases]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Total do Mês</p>
                <p className="text-2xl font-bold text-torqx-primary font-satoshi">
                  {formatCurrency(currentMonth.total)}
                </p>
                <div className="flex items-center mt-2">
                  {currentMonth.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-torqx-accent mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    currentMonth.growth >= 0 ? 'text-torqx-accent' : 'text-red-500'
                  }`}>
                    {Math.abs(currentMonth.growth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-torqx-secondary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-torqx-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Compras do Mês</p>
                <p className="text-2xl font-bold text-torqx-primary font-satoshi">
                  {currentMonth.count}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Total de {purchases.length} compras
                </p>
              </div>
              <div className="w-12 h-12 bg-torqx-accent/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-torqx-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600 font-satoshi">
                  {currentMonth.pending}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Aguardando pagamento
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-inter">Em Atraso</p>
                <p className="text-2xl font-bold text-red-600 font-satoshi">
                  {currentMonth.overdue}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Vencimento ultrapassado
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Total']}
                />
                <Bar dataKey="total" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Suppliers */}
      <Card>
        <CardHeader>
          <CardTitle>Principais Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSuppliers.map((supplier, index) => (
              <div key={supplier.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-torqx-secondary rounded-full flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{supplier.name}</p>
                    <p className="text-sm text-gray-600">{supplier.count} compras</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-torqx-primary">
                    {formatCurrency(supplier.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
