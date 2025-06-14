
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Car, Wrench, Package, Calendar, 
  Brain, FileText, Settings, Search, Bell, User,
  TrendingUp, TrendingDown, DollarSign, Clock,
  AlertTriangle, CheckCircle, Menu, X, Home
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Simulação de dados (substituir por API real)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Dados simulados para demonstração
        const mockData = {
          metrics: {
            revenue: {
              current: 45250.00,
              previous: 38900.00,
              growth_percentage: 16.3,
              trend: 'up'
            },
            service_orders: {
              total: 127,
              completed: 98,
              in_progress: 15,
              pending: 14,
              completion_rate: 77.2
            },
            customers: {
              total: 89,
              new: 12,
              returning: 77,
              retention_rate: 86.5
            },
            avg_order_value: 356.30
          },
          recent_orders: [
            {
              id: '1001',
              customer: 'Maria Silva',
              vehicle: 'Toyota Corolla 2020',
              status: 'in_progress',
              value: 450.00,
              created_at: '2025-01-15T10:30:00Z'
            },
            {
              id: '1002',
              customer: 'João Santos',
              vehicle: 'Honda Civic 2019',
              status: 'completed',
              value: 280.00,
              created_at: '2025-01-15T08:15:00Z'
            }
          ],
          inventory_alerts: [
            {
              item: 'Óleo Motor 5W30',
              current_stock: 2,
              minimum_stock: 5,
              alert_level: 'critical'
            },
            {
              item: 'Pastilhas de Freio',
              current_stock: 8,
              minimum_stock: 10,
              alert_level: 'warning'
            }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: true },
    { name: 'Clientes', href: '/customers', icon: Users, current: false },
    { name: 'Veículos', href: '/vehicles', icon: Car, current: false },
    { name: 'Ordens de Serviço', href: '/service-orders', icon: Wrench, current: false },
    { name: 'Estoque', href: '/inventory', icon: Package, current: false },
    { name: 'Agenda', href: '/appointments', icon: Calendar, current: false },
    { name: 'IA Assistant', href: '/ai', icon: Brain, current: false },
    { name: 'Relatórios', href: '/reports', icon: BarChart3, current: false },
    { name: 'Configurações', href: '/settings', icon: Settings, current: false },
  ];

  const MetricCard = ({ title, value, change, trend, icon: Icon, format = 'number' }: any) => {
    const formatValue = (val: number) => {
      if (format === 'currency') return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      if (format === 'percentage') return `${val}%`;
      return val.toLocaleString('pt-BR');
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-torqx-primary font-satoshi">{formatValue(value)}</p>
          </div>
          <div className={`p-3 rounded-xl ${
            trend === 'up' ? 'bg-torqx-accent/10' : 'bg-red-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              trend === 'up' ? 'text-torqx-accent' : 'text-red-600'
            }`} />
          </div>
        </div>
        {change && (
          <div className="mt-4 flex items-center">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-torqx-accent mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-torqx-accent' : 'text-red-600'
            }`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
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
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-torqx-primary text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-torqx-primary-light">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white font-satoshi">Torqx</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-torqx-primary-light"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-torqx-secondary text-white'
                    : 'text-gray-300 hover:text-white hover:bg-torqx-primary-light'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  item.current ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`} />
                {item.name}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-torqx-primary font-satoshi">
                Dashboard
              </h1>
            </div>

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
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-torqx-secondary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">João Silva</p>
                  <p className="text-xs text-gray-500">Auto Service Silva</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Receita Mensal"
              value={dashboardData.metrics.revenue.current}
              change={dashboardData.metrics.revenue.growth_percentage}
              trend={dashboardData.metrics.revenue.trend}
              icon={DollarSign}
              format="currency"
            />
            <MetricCard
              title="OS Ativas"
              value={dashboardData.metrics.service_orders.in_progress}
              icon={Wrench}
            />
            <MetricCard
              title="Clientes Novos"
              value={dashboardData.metrics.customers.new}
              icon={Users}
            />
            <MetricCard
              title="Ticket Médio"
              value={dashboardData.metrics.avg_order_value}
              icon={TrendingUp}
              format="currency"
            />
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-torqx-primary mb-4 font-satoshi">
                Receita dos Últimos 30 Dias
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráfico de receita (integrar Chart.js)</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-torqx-primary mb-4 font-satoshi">
                Estatísticas Rápidas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Taxa de Conclusão</span>
                  <span className="text-sm font-medium text-torqx-primary">
                    {dashboardData.metrics.service_orders.completion_rate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-torqx-accent h-2 rounded-full" 
                    style={{ width: `${dashboardData.metrics.service_orders.completion_rate}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Retenção de Clientes</span>
                  <span className="text-sm font-medium text-torqx-primary">
                    {dashboardData.metrics.customers.retention_rate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-torqx-secondary h-2 rounded-full" 
                    style={{ width: `${dashboardData.metrics.customers.retention_rate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-torqx-primary font-satoshi">
                  Ordens Recentes
                </h3>
                <a href="/service-orders" className="text-sm text-torqx-secondary hover:text-torqx-secondary-dark">
                  Ver todas
                </a>
              </div>
              <div className="space-y-4">
                {dashboardData.recent_orders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.vehicle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-torqx-primary">
                        R$ {order.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-torqx-accent/10 text-torqx-accent' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'completed' ? 'Concluída' : 'Em andamento'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-torqx-primary font-satoshi">
                  Alertas de Estoque
                </h3>
                <a href="/inventory" className="text-sm text-torqx-secondary hover:text-torqx-secondary-dark">
                  Ver estoque
                </a>
              </div>
              <div className="space-y-4">
                {dashboardData.inventory_alerts.map((alert: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alert.item}</p>
                      <p className="text-sm text-gray-600">
                        Estoque: {alert.current_stock} (mínimo: {alert.minimum_stock})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
