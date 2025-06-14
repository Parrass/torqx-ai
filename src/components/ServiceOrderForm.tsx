
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceOrder } from '@/hooks/useServiceOrders';

interface ServiceOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ServiceOrder>) => Promise<void>;
  initialData?: Partial<ServiceOrder>;
  mode: 'create' | 'edit';
}

interface Customer {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  customer_id: string;
}

interface Technician {
  id: string;
  full_name: string;
}

const ServiceOrderForm = ({ isOpen, onClose, onSubmit, initialData, mode }: ServiceOrderFormProps) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_id: '',
    assigned_technician_id: '',
    status: 'draft',
    priority: 'normal',
    problem_description: '',
    customer_complaint: '',
    internal_notes: '',
    estimated_cost: '',
    estimated_hours: '',
    vehicle_mileage: '',
    scheduled_start_date: '',
    estimated_completion_date: '',
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadFormData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        customer_id: initialData.customer_id || '',
        vehicle_id: initialData.vehicle_id || '',
        assigned_technician_id: initialData.assigned_technician_id || '',
        status: initialData.status || 'draft',
        priority: initialData.priority || 'normal',
        problem_description: initialData.problem_description || '',
        customer_complaint: initialData.customer_complaint || '',
        internal_notes: initialData.internal_notes || '',
        estimated_cost: initialData.estimated_cost?.toString() || '',
        estimated_hours: initialData.estimated_hours?.toString() || '',
        vehicle_mileage: initialData.vehicle_mileage?.toString() || '',
        scheduled_start_date: initialData.scheduled_start_date ? initialData.scheduled_start_date.split('T')[0] : '',
        estimated_completion_date: initialData.estimated_completion_date ? initialData.estimated_completion_date.split('T')[0] : '',
      });
    }
  }, [initialData, mode]);

  const loadFormData = async () => {
    if (!user?.user_metadata?.tenant_id) return;

    try {
      // Load customers
      const { data: customersData } = await supabase
        .from('customers')
        .select('id, name')
        .eq('tenant_id', user.user_metadata.tenant_id)
        .eq('status', 'active')
        .order('name');

      // Load vehicles
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('id, brand, model, license_plate, customer_id')
        .eq('tenant_id', user.user_metadata.tenant_id)
        .eq('status', 'active')
        .order('brand', { ascending: true });

      // Load technicians
      const { data: techniciansData } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('tenant_id', user.user_metadata.tenant_id)
        .eq('status', 'active')
        .in('role', ['technician', 'manager', 'owner']);

      setCustomers(customersData || []);
      setVehicles(vehiclesData || []);
      setTechnicians(techniciansData || []);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : undefined,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined,
        vehicle_mileage: formData.vehicle_mileage ? parseInt(formData.vehicle_mileage) : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    !formData.customer_id || v.customer_id === formData.customer_id
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nova Ordem de Serviço' : 'Editar Ordem de Serviço'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cliente e Veículo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cliente e Veículo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customer_id">Cliente *</Label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, customer_id: value, vehicle_id: '' }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vehicle_id">Veículo *</Label>
                  <Select
                    value={formData.vehicle_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_id: value }))}
                    disabled={!formData.customer_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vehicle_mileage">Quilometragem Atual</Label>
                  <Input
                    id="vehicle_mileage"
                    type="number"
                    value={formData.vehicle_mileage}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_mileage: e.target.value }))}
                    placeholder="Ex: 50000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status e Prioridade */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status e Atribuição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="scheduled">Agendada</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="awaiting_parts">Aguardando Peças</SelectItem>
                      <SelectItem value="awaiting_approval">Aguardando Aprovação</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="assigned_technician_id">Técnico Responsável</Label>
                  <Select
                    value={formData.assigned_technician_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_technician_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((technician) => (
                        <SelectItem key={technician.id} value={technician.id}>
                          {technician.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Descrições */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descrição do Problema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="problem_description">Descrição do Problema *</Label>
                <Textarea
                  id="problem_description"
                  value={formData.problem_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, problem_description: e.target.value }))}
                  placeholder="Descreva o problema relatado pelo cliente..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="customer_complaint">Queixa do Cliente</Label>
                <Textarea
                  id="customer_complaint"
                  value={formData.customer_complaint}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_complaint: e.target.value }))}
                  placeholder="Queixa específica do cliente..."
                />
              </div>

              <div>
                <Label htmlFor="internal_notes">Observações Internas</Label>
                <Textarea
                  id="internal_notes"
                  value={formData.internal_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, internal_notes: e.target.value }))}
                  placeholder="Notas internas da equipe..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Estimativas e Datas */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estimativas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="estimated_cost">Custo Estimado (R$)</Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    step="0.01"
                    value={formData.estimated_cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimated_cost: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="estimated_hours">Horas Estimadas</Label>
                  <Input
                    id="estimated_hours"
                    type="number"
                    step="0.5"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                    placeholder="0.0"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Datas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="scheduled_start_date">Data de Início Agendada</Label>
                  <Input
                    id="scheduled_start_date"
                    type="date"
                    value={formData.scheduled_start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_start_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="estimated_completion_date">Data de Conclusão Estimada</Label>
                  <Input
                    id="estimated_completion_date"
                    type="date"
                    value={formData.estimated_completion_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimated_completion_date: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : mode === 'create' ? 'Criar OS' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderForm;
