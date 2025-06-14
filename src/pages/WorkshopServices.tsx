
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Clock,
  DollarSign
} from 'lucide-react';

interface WorkshopService {
  id: string;
  name: string;
  description?: string;
  category: string;
  base_price: number;
  estimated_duration_minutes?: number;
  is_active: boolean;
  requires_parts: boolean;
  skill_level: string;
  warranty_days: number;
}

const WorkshopServices = () => {
  const [services, setServices] = useState<WorkshopService[]>([
    {
      id: '1',
      name: 'Troca de Óleo',
      description: 'Troca completa do óleo do motor e filtro',
      category: 'Manutenção Preventiva',
      base_price: 150.00,
      estimated_duration_minutes: 60,
      is_active: true,
      requires_parts: true,
      skill_level: 'basic',
      warranty_days: 30
    },
    {
      id: '2',
      name: 'Alinhamento e Balanceamento',
      description: 'Alinhamento de direção e balanceamento das rodas',
      category: 'Pneus e Rodas',
      base_price: 80.00,
      estimated_duration_minutes: 90,
      is_active: true,
      requires_parts: false,
      skill_level: 'intermediate',
      warranty_days: 15
    },
    {
      id: '3',
      name: 'Reparo do Sistema de Freios',
      description: 'Inspeção e reparo completo do sistema de freios',
      category: 'Sistema de Freios',
      base_price: 300.00,
      estimated_duration_minutes: 180,
      is_active: true,
      requires_parts: true,
      skill_level: 'advanced',
      warranty_days: 90
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<WorkshopService | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: '',
    base_price: '',
    estimated_duration_minutes: '',
    requires_parts: false,
    skill_level: 'basic',
    warranty_days: '0'
  });

  const categories = [
    'Manutenção Preventiva',
    'Motor',
    'Transmissão',
    'Sistema de Freios',
    'Suspensão',
    'Ar Condicionado',
    'Elétrica',
    'Pneus e Rodas',
    'Carroceria',
    'Diagnóstico'
  ];

  const skillLevels = [
    { value: 'basic', label: 'Básico' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddService = () => {
    if (newService.name && newService.category) {
      const service: WorkshopService = {
        id: Date.now().toString(),
        name: newService.name,
        description: newService.description,
        category: newService.category,
        base_price: parseFloat(newService.base_price) || 0,
        estimated_duration_minutes: parseInt(newService.estimated_duration_minutes) || undefined,
        is_active: true,
        requires_parts: newService.requires_parts,
        skill_level: newService.skill_level,
        warranty_days: parseInt(newService.warranty_days) || 0
      };
      
      setServices([...services, service]);
      setNewService({
        name: '',
        description: '',
        category: '',
        base_price: '',
        estimated_duration_minutes: '',
        requires_parts: false,
        skill_level: 'basic',
        warranty_days: '0'
      });
      setShowAddForm(false);
    }
  };

  const handleEditService = (service: WorkshopService) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description || '',
      category: service.category,
      base_price: service.base_price.toString(),
      estimated_duration_minutes: service.estimated_duration_minutes?.toString() || '',
      requires_parts: service.requires_parts,
      skill_level: service.skill_level,
      warranty_days: service.warranty_days.toString()
    });
    setShowAddForm(true);
  };

  const handleUpdateService = () => {
    if (editingService && newService.name && newService.category) {
      const updatedService: WorkshopService = {
        ...editingService,
        name: newService.name,
        description: newService.description,
        category: newService.category,
        base_price: parseFloat(newService.base_price) || 0,
        estimated_duration_minutes: parseInt(newService.estimated_duration_minutes) || undefined,
        requires_parts: newService.requires_parts,
        skill_level: newService.skill_level,
        warranty_days: parseInt(newService.warranty_days) || 0
      };
      
      setServices(services.map(s => s.id === editingService.id ? updatedService : s));
      setEditingService(null);
      setNewService({
        name: '',
        description: '',
        category: '',
        base_price: '',
        estimated_duration_minutes: '',
        requires_parts: false,
        skill_level: 'basic',
        warranty_days: '0'
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, is_active: !s.is_active } : s
    ));
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-torqx-primary flex items-center gap-2">
              <Wrench className="w-8 h-8 text-torqx-secondary" />
              Serviços da Oficina
            </h1>
            <p className="text-gray-600 mt-2">Gerencie o catálogo de serviços oferecidos pela sua oficina</p>
          </div>
          <Button 
            onClick={() => {
              setEditingService(null);
              setShowAddForm(true);
            }}
            className="bg-torqx-secondary hover:bg-torqx-secondary-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Serviço
          </Button>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar serviços..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Adicionar/Editar Serviço */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingService ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
              </CardTitle>
              <CardDescription>
                Preencha as informações do serviço
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service-name">Nome do Serviço *</Label>
                  <Input
                    id="service-name"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder="Ex: Troca de óleo"
                  />
                </div>
                <div>
                  <Label htmlFor="service-category">Categoria *</Label>
                  <Select value={newService.category} onValueChange={(value) => setNewService({ ...newService, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="service-description">Descrição</Label>
                <Textarea
                  id="service-description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Descrição detalhada do serviço..."
                  rows={2}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="service-price">Preço Base (R$)</Label>
                  <Input
                    id="service-price"
                    type="number"
                    step="0.01"
                    value={newService.base_price}
                    onChange={(e) => setNewService({ ...newService, base_price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="service-duration">Duração (minutos)</Label>
                  <Input
                    id="service-duration"
                    type="number"
                    value={newService.estimated_duration_minutes}
                    onChange={(e) => setNewService({ ...newService, estimated_duration_minutes: e.target.value })}
                    placeholder="60"
                  />
                </div>
                <div>
                  <Label htmlFor="service-warranty">Garantia (dias)</Label>
                  <Input
                    id="service-warranty"
                    type="number"
                    value={newService.warranty_days}
                    onChange={(e) => setNewService({ ...newService, warranty_days: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service-skill">Nível de Habilidade</Label>
                  <Select value={newService.skill_level} onValueChange={(value) => setNewService({ ...newService, skill_level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id="requires-parts"
                    checked={newService.requires_parts}
                    onChange={(e) => setNewService({ ...newService, requires_parts: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="requires-parts">Requer peças/materiais</Label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={editingService ? handleUpdateService : handleAddService}
                  className="bg-torqx-secondary hover:bg-torqx-secondary-dark"
                >
                  {editingService ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingService(null);
                    setNewService({
                      name: '',
                      description: '',
                      category: '',
                      base_price: '',
                      estimated_duration_minutes: '',
                      requires_parts: false,
                      skill_level: 'basic',
                      warranty_days: '0'
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Serviços */}
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm || categoryFilter !== 'all' 
                    ? 'Nenhum serviço encontrado com os filtros aplicados.'
                    : 'Nenhum serviço cadastrado ainda.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((service) => (
              <Card key={service.id} className={`${!service.is_active ? 'opacity-60' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-torqx-primary">
                          {service.name}
                        </h3>
                        <Badge variant={service.is_active ? "default" : "secondary"}>
                          {service.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Badge variant="outline">
                          {service.category}
                        </Badge>
                      </div>
                      
                      {service.description && (
                        <p className="text-gray-600 mb-3">{service.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>R$ {service.base_price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(service.estimated_duration_minutes)}</span>
                        </div>
                        <span>Nível: {skillLevels.find(l => l.value === service.skill_level)?.label}</span>
                        {service.warranty_days > 0 && (
                          <span>Garantia: {service.warranty_days} dias</span>
                        )}
                        {service.requires_parts && (
                          <Badge variant="outline" className="text-xs">
                            Requer peças
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleServiceStatus(service.id)}
                      >
                        {service.is_active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkshopServices;
