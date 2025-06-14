import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Users, Car, Wrench, 
  TrendingUp, AlertTriangle, 
  Search, Bell
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TorqxSidebar from '@/components/TorqxSidebar';

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

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
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
        { data: alerts }
      ] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }),
        supabase.from('service_orders').select('*', { count: 'exact', head: true }).in('status', ['draft', 'in_progress', 'awaiting_approval']),
        supabase.from('service_orders').select('estimated_cost').eq('status', 'completed'),
        supabase.from('inventory_alerts').select('*').limit(5)
      ]);

      const totalRevenue = ordersWithCost?.reduce((sum, order) => sum + (order.estimated_cost || 0), 0) || 0;

      setMetrics({
        total_customers: totalCustomers || 0,
        total_vehicles: totalVehicles || 0,
        active_service_orders: activeOrders || 0,
        total_revenue: totalRevenue,
        inventory_alerts: alerts?.length || 0
      });

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-torqx-accent/10 text-torqx-accent';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em andamento';
      case 'draft':
        return 'Rascunho';
      case 'awaiting_approval':
        return 'Aguardando aprovação';
      default:
        return status;
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
    <div className="min-h-screen bg-gray-50">
      <TorqxSidebar />
      
      {/* Main content with padding to account for sidebar */}
      <div className="md:pl-16">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <h1 className="text-xl font-semibold text-torqx-primary font-satoshi">
              Dashboard
            </h1>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-torqx-secondary focus:border-transparent"
                  placeholder="Buscar clientes, OS..."
                />
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {metrics && metrics.inventory_alerts > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 pt-20 md:pt-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-torqx-primary font-satoshi">
                    {formatCurrency(metrics?.total_revenue || 0)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-torqx-accent/10">
                  <DollarSign className="w-6 h-6 text-torqx-accent" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">OS Ativas</p>
                  <p className="text-2xl font-bold text-torqx-primary font-satoshi">
                    {metrics?.active_service_orders || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-100">
                  <Wrench className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                  <p className="text-2xl font-bold text-torqx-primary font-satoshi">
                    {metrics?.total_customers || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Veículos</p>
                  <p className="text-2xl font-bold text-torqx-primary font-satoshi">
                    {metrics?.total_vehicles || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-torqx-primary font-satoshi">
                  Ordens Recentes
                </h3>
                <a href="/service-orders" className="text-sm text-torqx-secondary hover:text-torqx-secondary-dark">
                  Ver todas
                </a>
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">OS #{order.order_number}</p>
                        <p className="text-sm text-gray-600">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.vehicle_info}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-torqx-primary">
                          {formatCurrency(order.estimated_cost)}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhuma ordem de serviço encontrada</p>
                )}
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-torqx-primary font-satoshi">
                  Alertas de Estoque
                </h3>
                <a href="/inventory" className="text-sm text-torqx-secondary hover:text-torqx-secondary-dark">
                  Ver estoque
                </a>
              </div>
              <div className="space-y-4">
                {inventoryAlerts.length > 0 ? (
                  inventoryAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{alert.name}</p>
                        <p className="text-sm text-gray-600">
                          Estoque: {alert.current_stock} (mínimo: {alert.minimum_stock})
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum alerta de estoque</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
