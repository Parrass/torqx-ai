
import React, { useState } from 'react';
import { 
  Package, Plus, Search, MoreVertical, 
  AlertTriangle, Edit, Eye, RefreshCw, Package2, Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DashboardLayout from '@/components/DashboardLayout';
import { useInventory, InventoryItem } from '@/hooks/useInventory';
import InventoryItemForm from '@/components/InventoryItemForm';

const Inventory = () => {
  const { inventory, stats, loading, createInventoryItem, refetch } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (item: InventoryItem) => {
    if (item.current_stock === 0) return 'text-red-600 bg-red-100';
    if (item.current_stock <= item.minimum_stock) return 'text-yellow-600 bg-yellow-100';
    return 'text-torqx-accent bg-torqx-accent/10';
  };

  const getStatusText = (item: InventoryItem) => {
    if (item.current_stock === 0) return 'Sem Estoque';
    if (item.current_stock <= item.minimum_stock) return 'Estoque Baixo';
    return 'Em Estoque';
  };

  const handleCreateItem = async (data: any) => {
    await createInventoryItem(data);
    setShowAddModal(false);
    refetch();
  };

  const InventoryCard = ({ item }: { item: InventoryItem }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-torqx-primary">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">
                {item.brand} • SKU: {item.sku}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Categoria:</span>
            <span className="font-medium text-torqx-primary">{item.category}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Localização:</span>
            <span className="text-torqx-primary">{item.location || 'Não informado'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fornecedor:</span>
            <span className="text-torqx-primary">{item.supplier_name || 'Não informado'}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Estoque Atual</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item)}`}>
              {getStatusText(item)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-torqx-primary">{item.current_stock}</span>
            <div className="text-right text-xs text-gray-500">
              <div>Mín: {item.minimum_stock}</div>
              <div>Máx: {item.maximum_stock || 'N/A'}</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                item.current_stock <= item.minimum_stock ? 'bg-red-500' : 
                item.current_stock <= item.minimum_stock * 1.5 ? 'bg-yellow-500' : 'bg-torqx-accent'
              }`}
              style={{ 
                width: `${Math.min((item.current_stock / (item.maximum_stock || item.current_stock * 2)) * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-torqx-primary">
              R$ {(item.cost_price || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Custo</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-torqx-accent">
              R$ {(item.sale_price || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Venda</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            Detalhes
          </Button>
          <Button variant="outline" className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
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
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-torqx-primary font-satoshi mb-2">
            Estoque
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Controle seu inventário de peças e produtos</p>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Novo Item no Estoque</DialogTitle>
                  </DialogHeader>
                  <InventoryItemForm 
                    onSubmit={handleCreateItem}
                    onCancel={() => setShowAddModal(false)}
                  />
                </DialogContent>
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
                  <p className="text-sm font-medium text-gray-600">Total de Itens</p>
                  <p className="text-2xl font-bold text-torqx-primary">{stats.total_items}</p>
                </div>
                <Package2 className="w-8 h-8 text-torqx-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Estoque</p>
                  <p className="text-2xl font-bold text-torqx-accent">{stats.in_stock}</p>
                </div>
                <Package className="w-8 h-8 text-torqx-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.low_stock}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sem Estoque</p>
                  <p className="text-2xl font-bold text-red-600">{stats.out_of_stock}</p>
                </div>
                <Minus className="w-8 h-8 text-red-600" />
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
                  placeholder="Buscar por nome, SKU ou marca..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Todas as Categorias</option>
                <option value="Lubrificantes">Lubrificantes</option>
                <option value="Filtros">Filtros</option>
                <option value="Freios">Freios</option>
                <option value="Ignição">Ignição</option>
                <option value="Suspensão">Suspensão</option>
                <option value="Elétrica">Elétrica</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map(item => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>

        {/* Empty state */}
        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum item encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando itens ao seu estoque'}
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Item
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
