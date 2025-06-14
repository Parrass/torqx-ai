
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateSupplierData } from '@/types/supplier';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useToast } from '@/hooks/use-toast';

interface SupplierFormProps {
  onSuccess?: () => void;
}

const SupplierForm = ({ onSuccess }: SupplierFormProps) => {
  const { createSupplier } = useSuppliers();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CreateSupplierData>({
    name: '',
    business_name: '',
    document_type: 'cnpj',
    document_number: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    contact_person: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    bank_info: {
      bank: '',
      agency: '',
      account: '',
      account_type: 'current',
      pix_key: ''
    },
    payment_terms: 30,
    credit_limit: 0,
    category: 'general',
    notes: '',
    rating: 5,
    tags: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: "Erro", description: "Nome do fornecedor é obrigatório", variant: "destructive" });
      return;
    }

    try {
      await createSupplier.mutateAsync(formData);
      
      toast({ title: "Sucesso", description: "Fornecedor cadastrado com sucesso!" });
      
      // Reset form
      setFormData({
        name: '',
        business_name: '',
        document_type: 'cnpj',
        document_number: '',
        email: '',
        phone: '',
        mobile: '',
        website: '',
        contact_person: '',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        },
        bank_info: {
          bank: '',
          agency: '',
          account: '',
          account_type: 'current',
          pix_key: ''
        },
        payment_terms: 30,
        credit_limit: 0,
        category: 'general',
        notes: '',
        rating: 5,
        tags: []
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      toast({ title: "Erro", description: "Erro ao cadastrar fornecedor", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados Básicos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome/Razão Social *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="business_name">Nome Fantasia</Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="document_type">Tipo de Documento</Label>
            <Select value={formData.document_type} onValueChange={(value: 'cnpj' | 'cpf') => setFormData(prev => ({ ...prev, document_type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cnpj">CNPJ</SelectItem>
                <SelectItem value="cpf">CPF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="document_number">Número do Documento</Label>
            <Input
              id="document_number"
              value={formData.document_number}
              onChange={(e) => setFormData(prev => ({ ...prev, document_number: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="mobile">Celular</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="contact_person">Pessoa de Contato</Label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Geral</SelectItem>
                <SelectItem value="parts">Peças</SelectItem>
                <SelectItem value="tools">Ferramentas</SelectItem>
                <SelectItem value="equipment">Equipamentos</SelectItem>
                <SelectItem value="services">Serviços</SelectItem>
                <SelectItem value="office">Escritório</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="payment_terms">Prazo de Pagamento (dias)</Label>
            <Input
              id="payment_terms"
              type="number"
              value={formData.payment_terms}
              onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: parseInt(e.target.value) || 0 }))}
            />
          </div>
          
          <div>
            <Label htmlFor="credit_limit">Limite de Crédito</Label>
            <Input
              id="credit_limit"
              type="number"
              step="0.01"
              value={formData.credit_limit}
              onChange={(e) => setFormData(prev => ({ ...prev, credit_limit: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              value={formData.address?.street || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, street: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              value={formData.address?.number || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, number: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              value={formData.address?.complement || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, complement: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              value={formData.address?.neighborhood || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, neighborhood: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={formData.address?.city || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, city: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              value={formData.address?.state || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, state: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              value={formData.address?.zipCode || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, zipCode: e.target.value }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Observações sobre o fornecedor..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={createSupplier.isPending}>
          {createSupplier.isPending ? 'Salvando...' : 'Cadastrar Fornecedor'}
        </Button>
      </div>
    </form>
  );
};

export default SupplierForm;
