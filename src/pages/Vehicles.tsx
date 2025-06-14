
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Car, Plus, Search, Edit, Trash2, Filter, Fuel, Gauge, Calendar, MapPin } from 'lucide-react';
import { useVehicles, useVehicleStats, useCreateVehicle, useUpdateVehicle, useDeleteVehicle, Vehicle, VehicleFilters } from '@/hooks/useVehicles';
import VehicleForm from '@/components/VehicleForm';
import { Badge } from '@/components/ui/badge';

const Vehicles = () => {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();
  
  const { data: vehicles = [], isLoading } = useVehicles(filters);
  const { data: stats } = useVehicleStats();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const handleCreateVehicle = (data: any) => {
    createVehicle.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  const handleUpdateVehicle = (data: any) => {
    if (editingVehicle) {
      updateVehicle.mutate({ id: editingVehicle.id, ...data }, {
        onSuccess: () => {
          setIsFormOpen(false);
          setEditingVehicle(undefined);
        },
      });
    }
  };

  const handleDeleteVehicle = (id: string) => {
    deleteVehicle.mutate(id);
  };

  const openEditForm = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingVehicle(undefined);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="default" className="bg-torqx-accent">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    );
  };

  const formatMileage = (mileage: number | null) => {
    if (!mileage) return 'Não informado';
    return `${mileage.toLocaleString()} km`;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-torqx-secondary mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando veículos...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary">Veículos</h1>
            <p className="text-gray-600 mt-2">Gerencie os veículos dos seus clientes</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="bg-torqx-secondary hover:bg-torqx-secondary-dark">
            <Plus className="w-4 h-4 mr-2" />
            Novo Veículo
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
                <Car className="h-4 w-4 text-torqx-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVehicles}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
                <Gauge className="h-4 w-4 text-torqx-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-torqx-accent">{stats.activeVehicles}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Veículos Inativos</CardTitle>
                <MapPin className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{stats.inactiveVehicles}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KM Médio</CardTitle>
                <Fuel className="h-4 w-4 text-torqx-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageMileage.toLocaleString()}</div>
                <p className="text-xs text-gray-600">quilômetros</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por placa, marca, modelo..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>

              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => setFilters({ ...filters, status: value as 'all' | 'active' | 'inactive' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.brand || ''}
                onValueChange={(value) => setFilters({ ...filters, brand: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as Marcas</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Ford">Ford</SelectItem>
                  <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                  <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                  <SelectItem value="Fiat">Fiat</SelectItem>
                  <SelectItem value="Hyundai">Hyundai</SelectItem>
                  <SelectItem value="Nissan">Nissan</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.fuel_type || ''}
                onValueChange={(value) => setFilters({ ...filters, fuel_type: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Combustível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os Combustíveis</SelectItem>
                  <SelectItem value="Gasolina">Gasolina</SelectItem>
                  <SelectItem value="Etanol">Etanol</SelectItem>
                  <SelectItem value="Flex">Flex</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="GNV">GNV</SelectItem>
                  <SelectItem value="Elétrico">Elétrico</SelectItem>
                  <SelectItem value="Híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-torqx-secondary" />
                    <span>{vehicle.brand} {vehicle.model}</span>
                  </div>
                  {getStatusBadge(vehicle.status)}
                </CardTitle>
                <CardDescription>
                  {vehicle.customer?.name} - {vehicle.license_plate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {vehicle.year && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Ano:
                      </span>
                      <span className="font-medium">{vehicle.year}</span>
                    </div>
                  )}
                  {vehicle.fuel_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Fuel className="w-3 h-3" />
                        Combustível:
                      </span>
                      <span className="font-medium">{vehicle.fuel_type}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      Quilometragem:
                    </span>
                    <span className="font-medium">{formatMileage(vehicle.current_mileage)}</span>
                  </div>
                  {vehicle.color && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cor:</span>
                      <span className="font-medium">{vehicle.color}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditForm(vehicle)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o veículo <strong>{vehicle.brand} {vehicle.model}</strong> ({vehicle.license_plate})?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {vehicles.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
              <p className="text-gray-600 mb-4">
                {Object.keys(filters).some(key => filters[key as keyof VehicleFilters])
                  ? 'Tente ajustar os filtros para encontrar veículos.'
                  : 'Comece cadastrando o primeiro veículo dos seus clientes.'}
              </p>
              <Button onClick={() => setIsFormOpen(true)} className="bg-torqx-secondary hover:bg-torqx-secondary-dark">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Veículo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Vehicle Form */}
        <VehicleForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={editingVehicle ? handleUpdateVehicle : handleCreateVehicle}
          vehicle={editingVehicle}
          isLoading={createVehicle.isPending || updateVehicle.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
