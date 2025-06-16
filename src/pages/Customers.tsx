import React, { useState } from 'react';
import { 
  Users, Plus, Search, MoreVertical, 
  Phone, Mail, Car, Edit, Trash2,
  Eye, UserPlus, Download, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import CustomerForm from '@/components/CustomerForm';
import CustomerImport from '@/components/CustomerImport';
import PermissionGate from '@/components/PermissionGate';
import { useCustomers, useCustomerStats, useCreateCustomer, useUpdateCustomer, useDeleteCustomer, Customer } from '@/hooks/useCustomers';
import { useAuth } from '@/contexts/AuthContext';

const Customers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'business'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Hooks
  const { data: customers = [], isLoading, error } = useCustomers({
    search: searchTerm,
    status: filterStatus,
    customer_type: filterType,
  });
  
  const { data: stats } = useCustomerStats();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  // Event handlers
  const handleCreateCustomer = async (data: any) => {
    try {
      await createCustomer.mutateAsync(data);
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  const handleUpdateCustomer = async (data: any) => {
    if (editingCustomer) {
      try {
        await updateCustomer.mutateAsync({ id: editingCustomer.id, ...data });
        setEditingCustomer(null);
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
      }
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await deleteCustomer.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

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
              <div className="flex items-center space-x-2">
                <Badge variant={customer.customer_type === 'business' ? 'default' : 'secondary'}>
                  {customer.customer_type === 'business' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                </Badge>
                <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
                  {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </div>
          <PermissionGate module="customers" permission="update" showError={false}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <PermissionGate module="customers" permission="read" showError={false}>
                  <DropdownMenuItem onClick={() => {}}>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </DropdownMenuItem>
                </PermissionGate>
                <PermissionGate module="customers" permission="update" showError={false}>
                  <DropdownMenuItem onClick={() => setEditingCustomer(customer)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                </PermissionGate>
                <PermissionGate module="customers" permission="delete" showError={false}>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o cliente "{customer.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </PermissionGate>
              </DropdownMenuContent>
            </DropdownMenu>
          </PermissionGate>
        </div>

        <div className="space-y-2 mb-4">
          {customer.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              {customer.email}
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              {customer.phone}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <Car className="w-4 h-4 mr-2" />
            {(customer as any).vehicles_count || 0} veículo{((customer as any).vehicles_count || 0) !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-torqx-primary">
              R$ {(customer.total_spent || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">Total Gasto</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-torqx-primary">{customer.total_orders || 0}</p>
            <p className="text-xs text-gray-500">Serviços</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-torqx-primary">
              {customer.last_service_date 
                ? new Date(customer.last_service_date).toLocaleDateString('pt-BR')
                : '-'
              }
            </p>
            <p className="text-xs text-gray-500">Último Serviço</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <PermissionGate module="customers" permission="read" showError={false}>
            <Button variant="outline" className="flex-1" onClick={() => {}}>
              <Eye className="w-4 h-4 mr-1" />
              Ver Detalhes
            </Button>
          </PermissionGate>
          <PermissionGate module="customers" permission="update" showError={false}>
            <Button variant="outline" className="flex-1" onClick={() => setEditingCustomer(customer)}>
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </PermissionGate>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <PermissionGate module="customers" permission="read">
        <div className="p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-torqx-primary font-satoshi mb-2">
              Clientes
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Gerencie seus clientes e relacionamentos</p>
              <div className="flex items-center space-x-4">
                <PermissionGate module="customers" permission="read" showError={false}>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </PermissionGate>
                <PermissionGate module="customers" permission="create" showError={false}>
                  <CustomerImport />
                </PermissionGate>
                <PermissionGate module="customers" permission="create" showError={false}>
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </Button>
                </PermissionGate>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                    <p className="text-2xl font-bold text-torqx-primary">{stats?.totalCustomers || 0}</p>
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
                    <p className="text-2xl font-bold text-torqx-primary">{stats?.newThisMonth || 0}</p>
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
                    <p className="text-2xl font-bold text-torqx-primary">
                      R$ {(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
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
                    <p className="text-2xl font-bold text-torqx-primary">
                      R$ {(stats?.averageTicket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
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
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
                <select
                  className="px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="individual">Pessoa Física</option>
                  <option value="business">Pessoa Jurídica</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Erro ao Carregar Clientes
              </h3>
              <p className="text-gray-500 mb-4">
                Ocorreu um erro ao carregar os dados dos clientes.
              </p>
              <Button onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </div>
          )}

          {/* Customers Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map(customer => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && customers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando seu primeiro cliente'}
              </p>
              <PermissionGate module="customers" permission="create" showError={false}>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Cliente
                </Button>
              </PermissionGate>
            </div>
          )}

          {/* Create Customer Modal */}
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Cliente</DialogTitle>
              </DialogHeader>
              <CustomerForm
                onSubmit={handleCreateCustomer}
                onCancel={() => setShowAddModal(false)}
                isLoading={createCustomer.isPending}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Customer Modal */}
          <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
              </DialogHeader>
              {editingCustomer && (
                <CustomerForm
                  customer={editingCustomer}
                  onSubmit={handleUpdateCustomer}
                  onCancel={() => setEditingCustomer(null)}
                  isLoading={updateCustomer.isPending}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </PermissionGate>
    </DashboardLayout>
  );
};

export default Customers;
