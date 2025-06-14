
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardMetrics from '@/components/DashboardMetrics';
import DashboardStats from '@/components/DashboardStats';
import RecentActivity from '@/components/RecentActivity';
import QuickActions from '@/components/QuickActions';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardMetrics {
  total_customers: number;
  total_vehicles: number;
  active_service_orders: number;
  total_revenue: number;
  inventory_alerts: number;
}

interface RecentOrder {
  id: string;
  order_number: number;
  customer_name: string;
  vehicle_info: string;
  status: string;
  estimated_cost: number;
  created_at: string;
}

interface InventoryAlert {
  id: string;
  name: string;
  current_stock: number;
  minimum_stock: number;
}

interface ServiceOrderStats {
  total: number;
  draft: number;
  scheduled: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [serviceOrderStats, setServiceOrderStats] = useState<ServiceOrderStats | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, loading, navigate]);

  const loadDashboardData = async () => {
    try {
      setDashboardLoading(true);

      // Carregar métricas principais
      const [
        { count: totalCustomers },
        { count: totalVehicles },
        { count: activeOrders },
        { data: ordersWithCost },
        { data: alerts },
        { data: allOrders }
      ] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }),
        supabase.from('service_orders').select('*', { count: 'exact', head: true }).in('status', ['draft', 'in_progress', 'awaiting_approval']),
        supabase.from('service_orders').select('estimated_cost').eq('status', 'completed'),
        supabase.from('inventory_alerts').select('*').limit(5),
        supabase.from('service_orders').select('status')
      ]);

      const totalRevenue = ordersWithCost?.reduce((sum, order) => sum + (order.estimated_cost || 0), 0) || 0;

      setMetrics({
        total_customers: totalCustomers || 0,
        total_vehicles: totalVehicles || 0,
        active_service_orders: activeOrders || 0,
        total_revenue: totalRevenue,
        inventory_alerts: alerts?.length || 0
      });

      // Calcular estatísticas das ordens de serviço
      if (allOrders) {
        const stats = allOrders.reduce((acc, order) => {
          acc.total++;
          switch (order.status) {
            case 'draft':
              acc.draft++;
              break;
            case 'scheduled':
              acc.scheduled++;
              break;
            case 'in_progress':
              acc.in_progress++;
              break;
            case 'completed':
              acc.completed++;
              break;
            case 'cancelled':
              acc.cancelled++;
              break;
          }
          return acc;
        }, {
          total: 0,
          draft: 0,
          scheduled: 0,
          in_progress: 0,
          completed: 0,
          cancelled: 0
        });

        setServiceOrderStats(stats);
      }

      // Carregar ordens recentes
      const { data: orders } = await supabase
        .from('service_orders')
        .select(`
          id,
          order_number,
          status,
          estimated_cost,
          created_at,
          customers (name),
          vehicles (brand, model, year)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (orders) {
        const formattedOrders: RecentOrder[] = orders.map(order => ({
          id: order.id,
          order_number: order.order_number,
          customer_name: (order.customers as any)?.name || 'Cliente não informado',
          vehicle_info: `${(order.vehicles as any)?.brand} ${(order.vehicles as any)?.model} ${(order.vehicles as any)?.year}`,
          status: order.status,
          estimated_cost: order.estimated_cost || 0,
          created_at: order.created_at
        }));
        setRecentOrders(formattedOrders);
      }

      // Carregar alertas de estoque
      if (alerts) {
        setInventoryAlerts(alerts);
      }

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-torqx-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <main className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary font-satoshi">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Bem-vindo de volta! Aqui está um resumo da sua oficina.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-sm text-gray-500">
              Último update: {new Date().toLocaleString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Alertas de Estoque */}
        {inventoryAlerts.length > 0 && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Atenção:</strong> Você tem {inventoryAlerts.length} item(ns) com estoque baixo.
              <a href="/inventory" className="ml-2 text-amber-700 underline hover:text-amber-900">
                Verificar estoque
              </a>
            </AlertDescription>
          </Alert>
        )}

        {/* Métricas Principais */}
        <DashboardMetrics metrics={metrics} />

        {/* Estatísticas e Atividades */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <DashboardStats serviceOrderStats={serviceOrderStats} />
            <RecentActivity recentOrders={recentOrders} />
          </div>
          
          <div className="space-y-6">
            <QuickActions />
            
            {/* Alertas de Estoque Detalhados */}
            {inventoryAlerts.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-torqx-primary font-satoshi flex items-center">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                    Alertas de Estoque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inventoryAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{alert.name}</p>
                          <p className="text-sm text-red-600">
                            Estoque: {alert.current_stock} (mín: {alert.minimum_stock})
                          </p>
                        </div>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
