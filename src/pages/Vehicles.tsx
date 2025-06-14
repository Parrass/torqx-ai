
import React, { useState, useEffect } from 'react';
import { 
  Car, Plus, Search, Filter, MoreVertical, 
  Calendar, Wrench, AlertTriangle, CheckCircle,
  Edit, Trash2, Eye, FileText, Settings, Menu, X, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuel_type: string;
  customer_name: string;
  customer_id: string;
  current_mileage: number;
  last_service: string;
  next_maintenance: string;
  status: 'active' | 'inactive';
  maintenance_status: 'ok' | 'due_soon' | 'overdue';
  total_services: number;
}

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Users, current: false },
    { name: 'Clientes', href: '/customers', icon: Users, current: false },
    { name: 'Veículos', href: '/vehicles', icon: Car, current: true },
    { name: 'Ordens de Serviço', href: '/service-orders', icon: Wrench, current: false },
    { name: 'Estoque', href: '/inventory', icon: Users, current: false },
    { name: 'Agendamentos', href: '/appointments', icon: Users, current: false },
    { name: 'Relatórios', href: '/reports', icon: Users, current: false },
  ];

  // Mock data para demonstração
  useEffect(() => {
    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        license_plate: 'ABC-1234',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        color: 'Prata',
        fuel_type: 'Flex',
        customer_name: 'Maria Silva',
        customer_id: '1',
        current_mileage: 45000,
        last_service: '2025-01-10',
        next_maintenance: '2025-03-10',
        status: 'active',
        maintenance_status: 'ok',
        total_services: 8
      },
      {
        id: '2',
        license_plate: 'XYZ-5678',
        brand: 'Honda',
        model: 'Civic',
        year: 2019,
        color: 'Branco',
        fuel_type: 'Flex',
        customer_name: 'João Santos',
        customer_id: '2',
        current_mileage: 62000,
        last_service: '2025-01-08',
        next_maintenance: '2025-02-08',
        status: 'active',
        maintenance_status: 'due_soon',
        total_services: 12
      },
      {
        id: '3',
        license_plate: 'DEF-9012',
        brand: 'Volkswagen',
        model: 'Gol',
        year: 2018,
        color: 'Azul',
        fuel_type: 'Flex',
        customer_name: 'Ana Costa',
        customer_id: '3',
        current_mileage: 78000,
        last_service: '2024-11-15',
        next_maintenance: '2025-01-15',
        status: 'active',
        maintenance_status: 'overdue',
        total_services: 15
      }
    ];
    
    setTimeout(() => {
      setVehicles(mockVehicles);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'all' || vehicle.brand === filterBrand;
    return matchesSearch && matchesBrand;
  });

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-emerald-600 bg-emerald-100';
      case 'due_soon': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMaintenanceStatusText = (status: string) => {
    switch (status) {
      case 'ok': return 'Em dia';
      case 'due_soon': return 'Vence em breve';
      case 'overdue': return 'Atrasada';
      default: return 'Indefinido';
    }
  };

  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {vehicle.license_plate}
              </h3>
              <p className="text-sm text-slate-600">
                {vehicle.brand} {vehicle.model} {vehicle.year}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Proprietário:</span>
            <span className="font-medium text-slate-900">{vehicle.customer_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Cor:</span>
            <span className="text-slate-900">{vehicle.color}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Combustível:</span>
            <span className="text-slate-900">{vehicle.fuel_type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Quilometragem:</span>
            <span className="text-slate-900">{vehicle.current_mileage.toLocaleString()} km</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Status da Manutenção:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMaintenanceStatusColor(vehicle.maintenance_status)}`}>
              {getMaintenanceStatusText(vehicle.maintenance_status)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Último Serviço:</span>
            <span className="text-slate-900">
              {new Date(vehicle.last_service).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Próxima Manutenção:</span>
            <span className="text-slate-900">
              {new Date(vehicle.next_maintenance).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-1" />
            Detalhes
          </Button>
          <Button variant="outline" className="flex-1">
            <Wrench className="w-4 h-4 mr-1" />
            Nova OS
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AddVehicleModal = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Novo Veículo</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Placa *</label>
            <Input placeholder="ABC-1234" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cliente *</label>
            <select className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring">
              <option value="">Selecione o cliente</option>
              <option value="1">Maria Silva</option>
              <option value="2">João Santos</option>
              <option value="3">Ana Costa</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Marca *</label>
            <Input placeholder="Toyota" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Modelo *</label>
            <Input placeholder="Corolla" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ano *</label>
            <Input type="number" placeholder="2020" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cor</label>
            <Input placeholder="Prata" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Combustível</label>
            <select className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring">
              <option value="flex">Flex</option>
              <option value="gasoline">Gasolina</option>
              <option value="ethanol">Etanol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Elétrico</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quilometragem Atual</label>
            <Input type="number" placeholder="45000" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Chassi/VIN</label>
          <Input placeholder="9BWZZZ377VT004251" />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button>Salvar Veículo</Button>
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
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
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
              <h1 className="text-xl font-bold text-slate-900">Veículos</h1>
            </div>
            
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Veículo
                </Button>
              </DialogTrigger>
              <AddVehicleModal />
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
                    <p className="text-sm font-medium text-slate-600">Total de Veículos</p>
                    <p className="text-2xl font-bold text-slate-900">{vehicles.length}</p>
                  </div>
                  <Car className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Manutenção em Dia</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {vehicles.filter(v => v.maintenance_status === 'ok').length}
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
                    <p className="text-sm font-medium text-slate-600">Manutenção Atrasada</p>
                    <p className="text-2xl font-bold text-red-600">
                      {vehicles.filter(v => v.maintenance_status === 'overdue').length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Serviços Totais</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {vehicles.reduce((acc, v) => acc + v.total_services, 0)}
                    </p>
                  </div>
                  <Wrench className="w-8 h-8 text-blue-500" />
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
                    placeholder="Buscar por placa, marca, modelo ou cliente..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring"
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                >
                  <option value="all">Todas as Marcas</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum veículo encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando o primeiro veículo'}
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Veículo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
