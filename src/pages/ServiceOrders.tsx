
import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Filter, MoreVertical, 
  Clock, CheckCircle, AlertCircle, XCircle,
  Edit, Eye, Printer, DollarSign, Calendar,
  User, Car, Wrench, Package, Menu, X, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ServiceOrder {
  id: string;
  order_number: string;
  customer_name: string;
  vehicle_info: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'high' | 'normal' | 'low';
  created_at: string;
  estimated_completion: string;
  total_value: number;
  labor_cost: number;
  parts_cost: number;
  technician: string;
  services: string[];
  current_mileage: number;
}

const ServiceOrders = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Users, current: false },
    { name: 'Clientes', href: '/customers', icon: Users, current: false },
    { name: 'Veículos', href: '/vehicles', icon: Car, current: false },
    { name: 'Ordens de Serviço', href: '/service-orders', icon: Wrench, current: true },
    { name: 'Estoque', href: '/inventory', icon: Package, current: false },
    { name: 'Agendamentos', href: '/appointments', icon: Users, current: false },
    { name: 'Relatórios', href: '/reports', icon: Users, current: false },
  ];

  // Mock data para demonstração
  useEffect(() => {
    const mockServiceOrders: ServiceOrder[] = [
      {
        id: '1',
        order_number: 'OS-2025-001',
        customer_name: 'Maria Silva',
        vehicle_info: 'Toyota Corolla 2020 - ABC-1234',
        description: 'Troca de óleo e filtros + Revisão geral',
        status: 'in_progress',
        priority: 'normal',
        created_at: '2025-01-14',
        estimated_completion: '2025-01-15',
        total_value: 450.00,
        labor_cost: 200.00,
        parts_cost: 250.00,
        technician: 'Carlos Santos',
        services: ['Troca de óleo', 'Troca de filtro de ar', 'Revisão geral'],
        current_mileage: 45000
      },
      {
        id: '2',
        order_number: 'OS-2025-002',
        customer_name: 'João Santos',
        vehicle_info: 'Honda Civic 2019 - XYZ-5678',
        description: 'Problema no sistema de freios',
        status: 'pending',
        priority: 'high',
        created_at: '2025-01-14',
        estimated_completion: '2025-01-16',
        total_value: 850.00,
        labor_cost: 400.00,
        parts_cost: 450.00,
        technician: 'Roberto Lima',
        services: ['Diagnóstico de freios', 'Troca de pastilhas', 'Sangria do sistema'],
        current_mileage: 62000
      },
      {
        id: '3',
        order_number: 'OS-2025-003',
        customer_name: 'Ana Costa',
        vehicle_info: 'VW Gol 2018 - DEF-9012',
        description: 'Manutenção preventiva completa',
        status: 'completed',
        priority: 'normal',
        created_at: '2025-01-12',
        estimated_completion: '2025-01-13',
        total_value: 320.00,
        labor_cost: 150.00,
        parts_cost: 170.00,
        technician: 'Carlos Santos',
        services: ['Troca de óleo', 'Verificação geral', 'Limpeza de bicos'],
        current_mileage: 78000
      }
    ];
    
    setTimeout(() => {
      setServiceOrders(mockServiceOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = serviceOrders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vehicle_info.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-emerald-600 bg-emerald-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return 'Indefinido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'in_progress': return AlertCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return FileText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const ServiceOrderCard = ({ order }: { order: ServiceOrder }) => {
    const StatusIcon = getStatusIcon(order.status);
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {order.order_number}
                </h3>
                <p className="text-sm text-slate-600">
                  {new Date(order.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                {order.priority === 'high' ? 'Alta' : order.priority === 'normal' ? 'Normal' : 'Baixa'}
              </span>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-slate-600">Cliente:</span>
              <span className="ml-2 font-medium text-slate-900">{order.customer_name}</span>
            </div>
            <div className="flex items-center text-sm">
              <Car className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-slate-600">Veículo:</span>
              <span className="ml-2 text-slate-900">{order.vehicle_info}</span>
            </div>
            <div className="flex items-center text-sm">
              <Wrench className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-slate-600">Técnico:</span>
              <span className="ml-2 text-slate-900">{order.technician}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-slate-700 font-medium mb-2">Descrição:</p>
            <p className="text-sm text-slate-600">{order.description}</p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <StatusIcon className="w-5 h-5 text-blue-500" />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900">
                R$ {order.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500">
                Mão de obra: R$ {order.labor_cost.toFixed(2)} | Peças: R$ {order.parts_cost.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              Ver Detalhes
            </Button>
            <Button variant="outline" className="flex-1">
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button variant="outline" size="icon">
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AddServiceOrderModal = () => (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Nova Ordem de Serviço</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        {/* Cliente e Veículo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cliente *</label>
            <select className="w-full px-4 py-3 border border-input rounded-md focus:ring-2 focus:ring-ring">
              <option value="">Selecione o cliente</option>
              <option value="1">Maria Silva</option>
              <option value="2">João Santos</option>
              <option value="3">Ana Costa</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Veículo *</label>
            <select className="w-full px-4 py-3 border border-input rounded-md focus:ring-2 focus:ring-ring">
              <option value="">Selecione o veículo</option>
              <option value="1">Toyota Corolla 2020 - ABC-1234</option>
              <option value="2">Honda Civic 2019 - XYZ-5678</option>
            </select>
          </div>
        </div>

        {/* Informações da OS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prioridade</label>
            <select className="w-full px-4 py-3 border border-input rounded-md focus:ring-2 focus:ring-ring">
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="low">Baixa</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Técnico Responsável</label>
            <select className="w-full px-4 py-3 border border-input rounded-md focus:ring-2 focus:ring-ring">
              <option value="">Selecione o técnico</option>
              <option value="1">Carlos Santos</option>
              <option value="2">Roberto Lima</option>
              <option value="3">Ana Ferreira</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Previsão de Entrega</label>
            <Input type="date" />
          </div>
        </div>

        {/* Descrição do Problema */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição do Problema/Serviço *</label>
          <textarea
            rows={4}
            className="w-full px-4 py-3 border border-input rounded-md focus:ring-2 focus:ring-ring"
            placeholder="Descreva o problema relatado pelo cliente ou o serviço a ser realizado..."
          />
        </div>

        {/* Quilometragem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quilometragem Atual</label>
            <Input type="number" placeholder="45000" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Observações Adicionais</label>
            <Input placeholder="Observações importantes..." />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button>Criar Ordem de Serviço</Button>
        </div>
      </div>
    </DialogContent>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out rounded-r-2xl ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Torqx</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                item.current
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:text-slate-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${
                item.current ? 'text-white' : 'text-gray-400 group-hover:text-slate-900'
              }`} />
              {item.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Overlay para sidebar mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content - Full Width */}
      <div className="w-full">
        {/* Floating Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mr-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-slate-900">Ordens de Serviço</h1>
            </div>
            
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova OS
                </Button>
              </DialogTrigger>
              <AddServiceOrderModal />
            </Dialog>
          </div>
        </header>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total de OS</p>
                    <p className="text-2xl font-bold text-slate-900">{serviceOrders.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Em Andamento</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {serviceOrders.filter(os => os.status === 'in_progress').length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Concluídas</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {serviceOrders.filter(os => os.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Receita Total</p>
                    <p className="text-2xl font-bold text-slate-900">
                      R$ {serviceOrders.reduce((sum, os) => sum + os.total_value, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar por número da OS, cliente ou veículo..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Service Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map(order => (
              <ServiceOrderCard key={order.id} order={order} />
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma ordem de serviço encontrada
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando sua primeira ordem de serviço'}
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Nova Ordem de Serviço
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceOrders;
