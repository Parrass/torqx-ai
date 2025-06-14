
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { CreatePurchaseData, CreatePurchaseItemData } from '@/types/purchase';
import { usePurchases } from '@/hooks/usePurchases';
import { useToast } from '@/hooks/use-toast';

interface PurchaseFormProps {
  onSuccess?: () => void;
}

const PurchaseForm = ({ onSuccess }: PurchaseFormProps) => {
  const { createPurchase } = usePurchases();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Omit<CreatePurchaseData, 'items'>>({
    supplier_name: '',
    supplier_document: '',
    supplier_contact: { email: '', phone: '', address: '' },
    invoice_number: '',
    invoice_date: '',
    purchase_date: new Date().toISOString().split('T')[0],
    due_date: '',
    category: 'general',
    tax_amount: 0,
    discount_amount: 0,
    payment_method: '',
    notes: ''
  });

  const [items, setItems] = useState<CreatePurchaseItemData[]>([
    { description: '', category: '', quantity: 1, unit_price: 0, notes: '' }
  ]);

  const addItem = () => {
    setItems([...items, { description: '', category: '', quantity: 1, unit_price: 0, notes: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof CreatePurchaseItemData, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + (formData.tax_amount || 0) - (formData.discount_amount || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplier_name.trim()) {
      toast({ title: "Erro", description: "Nome do fornecedor é obrigatório", variant: "destructive" });
      return;
    }

    if (items.some(item => !item.description.trim() || item.quantity <= 0 || item.unit_price <= 0)) {
      toast({ title: "Erro", description: "Todos os itens devem ter descrição, quantidade e preço válidos", variant: "destructive" });
      return;
    }

    try {
      await createPurchase.mutateAsync({
        ...formData,
        items: items.filter(item => item.description.trim())
      });
      
      toast({ title: "Sucesso", description: "Compra registrada com sucesso!" });
      
      // Reset form
      setFormData({
        supplier_name: '',
        supplier_document: '',
        supplier_contact: { email: '', phone: '', address: '' },
        invoice_number: '',
        invoice_date: '',
        purchase_date: new Date().toISOString().split('T')[0],
        due_date: '',
        category: 'general',
        tax_amount: 0,
        discount_amount: 0,
        payment_method: '',
        notes: ''
      });
      setItems([{ description: '', category: '', quantity: 1, unit_price: 0, notes: '' }]);
      
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar compra:', error);
      toast({ title: "Erro", description: "Erro ao registrar compra", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="supplier_name">Nome do Fornecedor *</Label>
            <Input
              id="supplier_name"
              value={formData.supplier_name}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier_name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="supplier_document">CNPJ/CPF</Label>
            <Input
              id="supplier_document"
              value={formData.supplier_document}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier_document: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="supplier_email">E-mail</Label>
            <Input
              id="supplier_email"
              type="email"
              value={formData.supplier_contact?.email || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                supplier_contact: { ...prev.supplier_contact, email: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label htmlFor="supplier_phone">Telefone</Label>
            <Input
              id="supplier_phone"
              value={formData.supplier_contact?.phone || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                supplier_contact: { ...prev.supplier_contact, phone: e.target.value }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Compra</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="invoice_number">Número da Nota</Label>
            <Input
              id="invoice_number"
              value={formData.invoice_number}
              onChange={(e) => setFormData(prev => ({ ...prev, invoice_number: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="purchase_date">Data da Compra *</Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="due_date">Data de Vencimento</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
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
                <SelectItem value="office">Escritório</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="payment_method">Forma de Pagamento</Label>
            <Select value={formData.payment_method} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                <SelectItem value="bank_transfer">Transferência</SelectItem>
                <SelectItem value="check">Cheque</SelectItem>
                <SelectItem value="installment">Parcelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Itens da Compra</CardTitle>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
              <div className="md:col-span-2">
                <Label>Descrição *</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Descrição do item"
                  required
                />
              </div>
              
              <div>
                <Label>Quantidade *</Label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div>
                <Label>Preço Unitário *</Label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div className="flex items-end">
                <div className="flex-1">
                  <Label>Total</Label>
                  <div className="text-lg font-semibold text-torqx-primary">
                    R$ {(item.quantity * item.unit_price).toFixed(2)}
                  </div>
                </div>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Totais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Subtotal</Label>
            <div className="text-lg font-semibold">R$ {calculateSubtotal().toFixed(2)}</div>
          </div>
          
          <div>
            <Label htmlFor="tax_amount">Impostos</Label>
            <Input
              id="tax_amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.tax_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, tax_amount: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          
          <div>
            <Label htmlFor="discount_amount">Desconto</Label>
            <Input
              id="discount_amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.discount_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, discount_amount: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          
          <div>
            <Label>Total Final</Label>
            <div className="text-xl font-bold text-torqx-secondary">R$ {calculateTotal().toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Observações sobre a compra..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={createPurchase.isPending}>
          {createPurchase.isPending ? 'Salvando...' : 'Registrar Compra'}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseForm;
