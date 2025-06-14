import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, MoreVertical, 
  Phone, Mail, MapPin, Car, Edit, Trash2,
  Eye, UserPlus, Download, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TorqxSidebar from '@/components/TorqxSidebar';
import TorqxFooter from '@/components/TorqxFooter';

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
            <div className="w-12 h-12 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-torqx-primary">
                {customer.name}
              </h3>
              <p className="text-sm text-gray-600">
                {customer.customer_type === 'business' ? 'Pessoa Jurídica' : 'Pessoa Física'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            {customer.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            {customer.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Car className="w-4 h-4 mr-2" />
            {customer.vehicles_count} veículo{customer.vehicles_count !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-torqx-primary">
              R$ {customer.total_spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">Total Gasto</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-torqx-primary">{customer.total_orders}</p>
            <p className="text-xs text-gray-500">Serviços</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-torqx-primary">
              {new Date(customer.last_service).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-xs text-gray-500">Último Serviço</p>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-torqx-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TorqxSidebar />
      
      {/* Main content with padding to account for navbar and sidebar */}
      <div className="md:pl-16 pt-16 flex-1">
        <div className="p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-torqx-primary font-satoshi mb-2">
              Clientes
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Gerencie seus clientes e relacionamentos</p>
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
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                    <p className="text-2xl font-bold text-torqx-primary">{customers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-torqx-secondary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Novos este Mês</p>
                    <p className="text-2xl font-bold text-torqx-primary">12</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-torqx-accent" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                    <p className="text-2xl font-bold text-torqx-primary">R$ 8.550</p>
                  </div>
                  <div className="w-8 h-8 bg-torqx-accent/10 rounded-lg flex items-center justify-center">
                    <span className="text-torqx-accent font-bold">R$</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-torqx-primary">R$ 356</p>
                  </div>
                  <div className="w-8 h-8 bg-torqx-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-torqx-secondary font-bold">₢</span>
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

          {/* Empty state */}
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
        
        <TorqxFooter />
      </div>
    </div>
  );
};

export default Customers;
