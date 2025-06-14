
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { usePurchases } from '@/hooks/usePurchases';

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

export const PurchaseMetrics = () => {
  const { data: purchases = [] } = usePurchases();

  // Calcular métricas
  const totalAmount = purchases.reduce((sum, p) => sum + parseFloat(String(p.final_amount || 0)), 0);
  const averagePurchase = purchases.length > 0 ? totalAmount / purchases.length : 0;
  const pendingAmount = purchases
    .filter(p => p.payment_status === 'pending')
    .reduce((sum, p) => sum + parseFloat(String(p.final_amount || 0)), 0);

  // Dados para gráfico mensal
  const monthlyData = purchases.reduce((acc, purchase) => {
    const date = new Date(purchase.purchase_date || purchase.created_at);
    const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, amount: 0, count: 0 };
    }
    
    acc[monthKey].amount += parseFloat(String(purchase.final_amount || 0));
    acc[monthKey].count += 1;
    
    return acc;
  }, {} as Record<string, { month: string; amount: number; count: number }>);

  const monthlyChartData = Object.values(monthlyData).sort((a, b) => 
    new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  // Dados para gráfico por categoria
  const categoryData = purchases.reduce((acc, purchase) => {
    const category = purchase.category || 'Outros';
    
    if (!acc[category]) {
      acc[category] = { name: category, value: 0, count: 0 };
    }
    
    acc[category].value += parseFloat(String(purchase.final_amount || 0));
    acc[category].count += 1;
    
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const categoryChartData = Object.values(categoryData);

  // Dados para gráfico de status de pagamento
  const paymentStatusData = purchases.reduce((acc, purchase) => {
    const status = purchase.payment_status || 'pending';
    
    if (!acc[status]) {
      acc[status] = { name: status, value: 0, count: 0 };
    }
    
    acc[status].value += parseFloat(String(purchase.final_amount || 0));
    acc[status].count += 1;
    
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const paymentStatusChartData = Object.values(paymentStatusData);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Métricas Resumo */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-torqx-primary font-satoshi">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-sm text-gray-600 font-inter">Total Gasto</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-torqx-primary font-satoshi">
              {formatCurrency(averagePurchase)}
            </div>
            <p className="text-sm text-gray-600 font-inter">Média por Compra</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600 font-satoshi">
              {formatCurrency(pendingAmount)}
            </div>
            <p className="text-sm text-gray-600 font-inter">Valor Pendente</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gráfico Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Compras por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(Number(value))} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentStatusChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(Number(value))} />
              <YAxis dataKey="name" type="category" />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
