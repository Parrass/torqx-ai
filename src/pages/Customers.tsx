
import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, MoreVertical, 
  Phone, Mail, MapPin, Car, Edit, Trash2,
  Eye, UserPlus, Download, Upload, Menu, X, Wrench, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  customer_type: 'individual' | 'business';
  total_spent: number;
  total_orders: number;
  last_service: string;
  status: 'active' | 'inactive';
  vehicles_count: number;
  created_at: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Users, current: false },
    { name: 'Clientes', href: '/customers', icon: Users, current: true },
    { name: 'Veículos', href: '/vehicles', icon: Car, current: false },
    { name: 'Ordens de Serviço', href: '/service-orders', icon: Wrench, current: false },
    { name: 'Estoque', href: '/inventory', icon: Package, current: false },
    { name: 'Agendamentos', href: '/appointments', icon: Users, current: false },
    { name: 'Relatórios', href: '/reports', icon: Users, current: false },
  ];

  // Mock data para demonstração
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'Maria Silva',
        email: 'maria@email.com',
        phone: '(11) 99999-9999',
        document: '123.456.789-00',
        customer_type: 'individual',
        total_spent: 2500.00,
        total_orders: 8,
        last_service: '2025-01-10',
        status: 'active',
        vehicles_count: 2,
        created_at: '2024-06-15'
      },
      {
        id: '2',
        name: 'João Santos',
        email: 'joao@empresa.com',
        phone: '(11) 88888-8888',
        document: '12.345.678/0001-90',
        customer_type: 'business',
        total_spent: 5200.00,
        total_orders: 15,
        last_service: '2025-01-08',
        status: 'active',
        vehicles_count: 5,
        created_at: '2024-03-20'
      },
      {
        id: '3',
        name: 'Ana Costa',
        email: 'ana@email.com',
        phone: '(11) 77777-7777',
        document: '987.654.321-00',
        customer_type: 'individual',
        total_spent: 850.00,
        total_orders: 3,
        last_service: '2024-12-20',
        status: 'active',
        vehicles_count: 1,
        created_at: '2024-08-10'
      }
    ];
    
    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {customer.name}
              </h3>
              <p className="text-sm text-slate-600">
                {customer.customer_type === 'business' ? 'Pessoa Jurídica' : 'Pessoa Física'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-600">
            <Mail className="w-4 h-4 mr-2" />
            {customer.email}
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Phone className="w-4 h-4 mr-2" />
            {customer.phone}
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Car className="w-4 h-4 mr-2" />
            {customer.vehicles_count} veículo{customer.vehicles_count !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">
              R$ {customer.total_spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500">Total Gasto</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">{customer.total_orders}</p>
            <p className="text-xs text-slate-500">Serviços</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">
              {new Date(customer.last_service).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-xs text-slate-500">Último Serviço</p>
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
        </div>
      </CardContent>
    </Card>
  );

  const AddCustomerModal = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Novo Cliente</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome Completo *</label>
            <Input placeholder="Nome do cliente" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="email@exemplo.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone *</label>
            <Input placeholder="(11) 99999-9999" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CPF/CNPJ *</label>
            <Input placeholder="000.000.000-00" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Endereço</label>
          <Input placeholder="Rua, número, bairro, cidade" />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button>Salvar Cliente</Button>
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
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
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
              <h1 className="text-xl font-bold text-slate-900">Clientes</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <AddCustomerModal />
              </Dialog>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total de Clientes</p>
                    <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Novos este Mês</p>
                    <p className="text-2xl font-bold text-slate-900">12</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Receita Total</p>
                    <p className="text-2xl font-bold text-slate-900">R$ 8.550</p>
                  </div>
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">R$</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-slate-900">R$ 356</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">₢</span>
                  </div>
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
                    placeholder="Buscar clientes..."
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
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Customers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map(customer => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando seu primeiro cliente'}
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Cliente
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
