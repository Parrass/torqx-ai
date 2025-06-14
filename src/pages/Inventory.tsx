
import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Filter, MoreVertical, 
  AlertTriangle, TrendingUp, TrendingDown, 
  Edit, Eye, ShoppingCart, BarChart3,
  Package2, Minus, RefreshCw, Menu, X, Users, Car, Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  unit_cost: number;
  selling_price: number;
  supplier: string;
  location: string;
  last_movement: string;
  movement_type: 'in' | 'out';
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Users, current: false },
    { name: 'Clientes', href: '/customers', icon: Users, current: false },
    { name: 'Veículos', href: '/vehicles', icon: Car, current: false },
    { name: 'Ordens de Serviço', href: '/service-orders', icon: Wrench, current: false },
    { name: 'Estoque', href: '/inventory', icon: Package, current: true },
    { name: 'Agendamentos', href: '/appointments', icon: Users, current: false },
    { name: 'Relatórios', href: '/reports', icon: Users, current: false },
  ];

  // Mock data para demonstração
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Óleo Motor 5W30',
        category: 'Lubrificantes',
        brand: 'Castrol',
        sku: 'OIL-5W30-001',
        current_stock: 25,
        min_stock: 10,
        max_stock: 50,
        unit_cost: 45.90,
        selling_price: 65.00,
        supplier: 'Distribuidora ABC',
        location: 'Prateleira A1',
        last_movement: '2025-01-12',
        movement_type: 'out',
        status: 'in_stock'
      },
      {
        id: '2',
        name: 'Filtro de Ar',
        category: 'Filtros',
        brand: 'Mann',
        sku: 'FLT-AR-002',
        current_stock: 3,
        min_stock: 5,
        max_stock: 20,
        unit_cost: 28.50,
        selling_price: 42.00,
        supplier: 'Peças & Cia',
        location: 'Prateleira B2',
        last_movement: '2025-01-10',
        movement_type: 'out',
        status: 'low_stock'
      },
      {
        id: '3',
        name: 'Pastilha de Freio Dianteira',
        category: 'Freios',
        brand: 'Bosch',
        sku: 'BRK-PAD-003',
        current_stock: 0,
        min_stock: 4,
        max_stock: 16,
        unit_cost: 85.00,
        selling_price: 125.00,
        supplier: 'Auto Peças Sul',
        location: 'Prateleira C1',
        last_movement: '2025-01-08',
        movement_type: 'out',
        status: 'out_of_stock'
      },
      {
        id: '4',
        name: 'Vela de Ignição',
        category: 'Ignição',
        brand: 'NGK',
        sku: 'IGN-VEL-004',
        current_stock: 48,
        min_stock: 20,
        max_stock: 60,
        unit_cost: 12.50,
        selling_price: 22.00,
        supplier: 'Distribuidora ABC',
        location: 'Prateleira D3',
        last_movement: '2025-01-11',
        movement_type: 'in',
        status: 'in_stock'
      }
    ];
    
    setTimeout(() => {
      setInventory(mockInventory);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'text-emerald-600 bg-emerald-100';
      case 'low_stock': return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'Em Estoque';
      case 'low_stock': return 'Estoque Baixo';
      case 'out_of_stock': return 'Sem Estoque';
      default: return 'Indefinido';
    }
  };

  const InventoryCard = ({ item }: { item: InventoryItem }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {item.name}
              </h3>
              <p className="text-sm text-slate-600">
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
            <span className="text-slate-600">Categoria:</span>
            <span className="font-medium text-slate-900">{item.category}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Localização:</span>
            <span className="text-slate-900">{item.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Fornecedor:</span>
            <span className="text-slate-900">{item.supplier}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Estoque Atual</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
              {getStatusText(item.status)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-slate-900">{item.current_stock}</span>
            <div className="text-right text-xs text-slate-500">
              <div>Mín: {item.min_stock}</div>
              <div>Máx: {item.max_stock}</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                item.current_stock <= item.min_stock ? 'bg-red-500' : 
                item.current_stock <= item.min_stock * 1.5 ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min((item.current_stock / item.max_stock) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">
              R$ {item.unit_cost.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500">Custo</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-600">
              R$ {item.selling_price.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500">Venda</p>
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

  const AddInventoryModal = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Novo Item no Estoque</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Produto *</label>
            <Input placeholder="Óleo Motor 5W30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">SKU *</label>
            <Input placeholder="OIL-5W30-001" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria *</label>
            <select className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring">
              <option value="">Selecione a categoria</option>
              <option value="Lubrificantes">Lubrificantes</option>
              <option value="Filtros">Filtros</option>
              <option value="Freios">Freios</option>
              <option value="Ignição">Ignição</option>
              <option value="Suspensão">Suspensão</option>
              <option value="Elétrica">Elétrica</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Marca</label>
            <Input placeholder="Castrol" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Estoque Atual *</label>
            <Input type="number" placeholder="25" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Estoque Mínimo *</label>
            <Input type="number" placeholder="10" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Estoque Máximo</label>
            <Input type="number" placeholder="50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Localização</label>
            <Input placeholder="Prateleira A1" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Custo Unitário *</label>
            <Input type="number" step="0.01" placeholder="45.90" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Preço de Venda *</label>
            <Input type="number" step="0.01" placeholder="65.00" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fornecedor</label>
          <Input placeholder="Distribuidora ABC" />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button>Salvar Item</Button>
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
              <h1 className="text-xl font-bold text-slate-900">Estoque</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
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
                <AddInventoryModal />
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
                    <p className="text-sm font-medium text-slate-600">Total de Itens</p>
                    <p className="text-2xl font-bold text-slate-900">{inventory.length}</p>
                  </div>
                  <Package2 className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Em Estoque</p>
                    <p className="text-2xl font-bold text-emerald-500">
                      {inventory.filter(item => item.status === 'in_stock').length}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Estoque Baixo</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {inventory.filter(item => item.status === 'low_stock').length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Sem Estoque</p>
                    <p className="text-2xl font-bold text-red-600">
                      {inventory.filter(item => item.status === 'out_of_stock').length}
                    </p>
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
      </div>
    </div>
  );
};

export default Inventory;
