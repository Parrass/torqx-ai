import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/hooks/useCustomers';

const customerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').trim(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(1, 'Telefone é obrigatório').trim(),
  document_number: z.string().optional(),
  document_type: z.enum(['cpf', 'cnpj']).optional(),
  customer_type: z.enum(['individual', 'business']),
  secondary_phone: z.string().optional(),
  preferred_contact: z.enum(['phone', 'email', 'whatsapp']),
  notes: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer ? {
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      document_number: customer.document_number || '',
      document_type: customer.document_type || undefined,
      customer_type: customer.customer_type,
      secondary_phone: customer.secondary_phone || '',
      preferred_contact: customer.preferred_contact,
      notes: customer.notes || '',
      address: customer.address || {},
    } : {
      customer_type: 'individual',
      preferred_contact: 'phone',
      document_type: undefined,
    },
  });

  const customerType = watch('customer_type');

  // Atualizar document_type automaticamente quando customer_type muda
  useEffect(() => {
    if (customerType === 'individual') {
      setValue('document_type', 'cpf');
    } else if (customerType === 'business') {
      setValue('document_type', 'cnpj');
    }
  }, [customerType, setValue]);

  const handleFormSubmit = (data: CustomerFormData) => {
    // Validar campos obrigatórios antes de enviar
    if (!data.name?.trim()) {
      return;
    }

    if (!data.phone?.trim()) {
      return;
    }

    // Limpar campos vazios e garantir tipos corretos
    const cleanedData = {
      ...data,
      name: data.name.trim(),
      email: data.email?.trim() || null,
      phone: data.phone.trim(),
      document_number: data.document_number?.trim() || null,
      secondary_phone: data.secondary_phone?.trim() || null,
      notes: data.notes?.trim() || null,
      document_type: data.customer_type === 'individual' ? 'cpf' as const : 'cnpj' as const,
      address: data.address && Object.values(data.address).some(v => v?.toString().trim()) 
        ? data.address 
        : null
    };

    console.log('Dados do formulário validados:', cleanedData);
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Nome completo ou razão social"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer_type">Tipo de Cliente</Label>
          <Select
            value={customerType}
            onValueChange={(value) => setValue('customer_type', value as 'individual' | 'business')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Pessoa Física</SelectItem>
              <SelectItem value="business">Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="email@exemplo.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="(11) 99999-9999"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="document_number">
            {customerType === 'business' ? 'CNPJ' : 'CPF'}
          </Label>
          <Input
            id="document_number"
            {...register('document_number')}
            placeholder={customerType === 'business' ? '00.000.000/0000-00' : '000.000.000-00'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary_phone">Telefone Secundário</Label>
          <Input
            id="secondary_phone"
            {...register('secondary_phone')}
            placeholder="(11) 88888-8888"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_contact">Forma de Contato Preferida</Label>
        <Select
          value={watch('preferred_contact')}
          onValueChange={(value) => setValue('preferred_contact', value as 'phone' | 'email' | 'whatsapp')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="phone">Telefone</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address.street">Rua</Label>
            <Input
              id="address.street"
              {...register('address.street')}
              placeholder="Nome da rua"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address.number">Número</Label>
            <Input
              id="address.number"
              {...register('address.number')}
              placeholder="123"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address.neighborhood">Bairro</Label>
            <Input
              id="address.neighborhood"
              {...register('address.neighborhood')}
              placeholder="Nome do bairro"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address.city">Cidade</Label>
            <Input
              id="address.city"
              {...register('address.city')}
              placeholder="Nome da cidade"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Observações sobre o cliente..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : customer ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
