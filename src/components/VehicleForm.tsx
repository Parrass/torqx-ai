
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Vehicle } from '@/hooks/useVehicles';
import { useCustomers } from '@/hooks/useCustomers';

const vehicleSchema = z.object({
  customer_id: z.string().min(1, 'Cliente é obrigatório'),
  license_plate: z.string().min(1, 'Placa é obrigatória'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  year: z.number().min(1900, 'Ano inválido').max(new Date().getFullYear() + 1, 'Ano inválido').optional().nullable(),
  color: z.string().optional().nullable(),
  fuel_type: z.string().optional().nullable(),
  engine_size: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  current_mileage: z.number().min(0, 'Quilometragem deve ser positiva').optional().nullable(),
  vin_chassis: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive']),
  notes: z.string().optional().nullable(),
  condition_notes: z.string().optional().nullable(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleFormData) => void;
  vehicle?: Vehicle;
  isLoading?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicle,
  isLoading = false,
}) => {
  const { data: customers = [] } = useCustomers({ limit: 1000 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      customer_id: vehicle?.customer_id || '',
      license_plate: vehicle?.license_plate || '',
      brand: vehicle?.brand || '',
      model: vehicle?.model || '',
      year: vehicle?.year || null,
      color: vehicle?.color || '',
      fuel_type: vehicle?.fuel_type || '',
      engine_size: vehicle?.engine_size || '',
      transmission: vehicle?.transmission || '',
      current_mileage: vehicle?.current_mileage || null,
      vin_chassis: vehicle?.vin_chassis || '',
      status: vehicle?.status || 'active',
      notes: vehicle?.notes || '',
      condition_notes: vehicle?.condition_notes || '',
    },
  });

  React.useEffect(() => {
    if (vehicle) {
      reset({
        customer_id: vehicle.customer_id,
        license_plate: vehicle.license_plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color || '',
        fuel_type: vehicle.fuel_type || '',
        engine_size: vehicle.engine_size || '',
        transmission: vehicle.transmission || '',
        current_mileage: vehicle.current_mileage,
        vin_chassis: vehicle.vin_chassis || '',
        status: vehicle.status,
        notes: vehicle.notes || '',
        condition_notes: vehicle.condition_notes || '',
      });
    } else {
      reset({
        customer_id: '',
        license_plate: '',
        brand: '',
        model: '',
        year: null,
        color: '',
        fuel_type: '',
        engine_size: '',
        transmission: '',
        current_mileage: null,
        vin_chassis: '',
        status: 'active',
        notes: '',
        condition_notes: '',
      });
    }
  }, [vehicle, reset]);

  const handleFormSubmit = (data: VehicleFormData) => {
    onSubmit(data);
    if (!vehicle) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? 'Editar Veículo' : 'Novo Veículo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="md:col-span-2">
              <Label htmlFor="customer_id">Cliente *</Label>
              <Select
                value={watch('customer_id')}
                onValueChange={(value) => setValue('customer_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.customer_id && (
                <p className="text-sm text-red-600 mt-1">{errors.customer_id.message}</p>
              )}
            </div>

            {/* Placa */}
            <div>
              <Label htmlFor="license_plate">Placa *</Label>
              <Input
                id="license_plate"
                {...register('license_plate')}
                placeholder="ABC-1234"
                className="uppercase"
              />
              {errors.license_plate && (
                <p className="text-sm text-red-600 mt-1">{errors.license_plate.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value: 'active' | 'inactive') => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Marca */}
            <div>
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                {...register('brand')}
                placeholder="Honda, Toyota, Ford..."
              />
              {errors.brand && (
                <p className="text-sm text-red-600 mt-1">{errors.brand.message}</p>
              )}
            </div>

            {/* Modelo */}
            <div>
              <Label htmlFor="model">Modelo *</Label>
              <Input
                id="model"
                {...register('model')}
                placeholder="Civic, Corolla, Ka..."
              />
              {errors.model && (
                <p className="text-sm text-red-600 mt-1">{errors.model.message}</p>
              )}
            </div>

            {/* Ano */}
            <div>
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                type="number"
                {...register('year', { valueAsNumber: true })}
                placeholder="2020"
              />
              {errors.year && (
                <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>
              )}
            </div>

            {/* Cor */}
            <div>
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                {...register('color')}
                placeholder="Branco, Prata, Preto..."
              />
            </div>

            {/* Combustível */}
            <div>
              <Label htmlFor="fuel_type">Combustível</Label>
              <Select
                value={watch('fuel_type') || undefined}
                onValueChange={(value) => setValue('fuel_type', value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o combustível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasolina">Gasolina</SelectItem>
                  <SelectItem value="etanol">Etanol</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="gnv">GNV</SelectItem>
                  <SelectItem value="eletrico">Elétrico</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Motor */}
            <div>
              <Label htmlFor="engine_size">Motor</Label>
              <Input
                id="engine_size"
                {...register('engine_size')}
                placeholder="1.0, 1.6, 2.0..."
              />
            </div>

            {/* Transmissão */}
            <div>
              <Label htmlFor="transmission">Transmissão</Label>
              <Select
                value={watch('transmission') || undefined}
                onValueChange={(value) => setValue('transmission', value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a transmissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatico">Automático</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                  <SelectItem value="semi-automatico">Semi-automático</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quilometragem */}
            <div>
              <Label htmlFor="current_mileage">Quilometragem</Label>
              <Input
                id="current_mileage"
                type="number"
                {...register('current_mileage', { valueAsNumber: true })}
                placeholder="50000"
              />
              {errors.current_mileage && (
                <p className="text-sm text-red-600 mt-1">{errors.current_mileage.message}</p>
              )}
            </div>

            {/* Chassi */}
            <div>
              <Label htmlFor="vin_chassis">Chassi/VIN</Label>
              <Input
                id="vin_chassis"
                {...register('vin_chassis')}
                placeholder="9BWZZZ377VT004251"
                className="uppercase"
              />
            </div>

            {/* Observações */}
            <div className="md:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Observações gerais sobre o veículo..."
                rows={3}
              />
            </div>

            {/* Condições */}
            <div className="md:col-span-2">
              <Label htmlFor="condition_notes">Condições do Veículo</Label>
              <Textarea
                id="condition_notes"
                {...register('condition_notes')}
                placeholder="Estado de conservação, avarias, etc..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : vehicle ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleForm;
