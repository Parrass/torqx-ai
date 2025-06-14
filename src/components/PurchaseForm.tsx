
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePurchaseOperations } from '@/hooks/usePurchaseOperations';
import { useToast } from '@/hooks/use-toast';

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  purchase?: any;
}

export const PurchaseForm = ({ isOpen, onClose, purchase }: PurchaseFormProps) => {
  const { toast } = useToast();
  const { createPurchase, updatePurchase } = usePurchaseOperations();
  
  const [formData, setFormData] = useState({
    supplier_name: purchase?.supplier_name || '',
    supplier_contact: purchase?.supplier_contact || '',
    invoice_number: purchase?.invoice_number || '',
    invoice_date: purchase?.invoice_date || '',
    due_date: purchase?.due_date || '',
    category: purchase?.category || '',
    payment_method: purchase?.payment_method || 'credit',
    payment_status: purchase?.payment_status || 'pending',
    total_amount: purchase?.total_amount || 0,
    discount_amount: purchase?.discount_amount || 0,
    final_amount: purchase?.final_amount || 0,
    notes: purchase?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (purchase) {
        await updatePurchase({
          ...formData,
          supplier_name: formData.supplier_name || 'Fornecedor não informado',
          id: purchase.id
        });
        toast({
          title: "Compra atualizada com sucesso!",
          variant: "default",
        });
      } else {
        await createPurchase({
          ...formData,
          supplier_name: formData.supplier_name || 'Fornecedor não informado',
        });
        toast({
          title: "Compra criada com sucesso!",
          variant: "default",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao salvar compra",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Recalcular final_amount quando total_amount ou discount_amount mudar
    if (field === 'total_amount' || field === 'discount_amount') {
      const total = field === 'total_amount' ? parseFloat(value) || 0 : formData.total_amount;
      const discount = field === 'discount_amount' ? parseFloat(value) || 0 : formData.discount_amount;
      setFormData(prev => ({
        ...prev,
        [field]: field === 'total_amount' || field === 'discount_amount' ? parseFloat(value) || 0 : value,
        final_amount: total - discount
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {purchase ? 'Editar Compra' : 'Nova Compra'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier_name">Fornecedor *</Label>
              <Input
                id="supplier_name"
                value={formData.supplier_name}
                onChange={(e) => handleInputChange('supplier_name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="supplier_contact">Contato</Label>
              <Input
                id="supplier_contact"
                value={formData.supplier_contact}
                onChange={(e) => handleInputChange('supplier_contact', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_number">Número da Nota</Label>
              <Input
                id="invoice_number"
                value={formData.invoice_number}
                onChange={(e) => handleInputChange('invoice_number', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parts">Peças</SelectItem>
                  <SelectItem value="tools">Ferramentas</SelectItem>
                  <SelectItem value="supplies">Suprimentos</SelectItem>
                  <SelectItem value="services">Serviços</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_date">Data da Nota</Label>
              <Input
                id="invoice_date"
                type="date"
                value={formData.invoice_date}
                onChange={(e) => handleInputChange('invoice_date', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="due_date">Vencimento</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total_amount">Valor Total (R$)</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) => handleInputChange('total_amount', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="discount_amount">Desconto (R$)</Label>
              <Input
                id="discount_amount"
                type="number"
                step="0.01"
                value={formData.discount_amount}
                onChange={(e) => handleInputChange('discount_amount', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="final_amount">Valor Final (R$)</Label>
              <Input
                id="final_amount"
                type="number"
                step="0.01"
                value={formData.final_amount}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment_method">Método de Pagamento</Label>
              <Select value={formData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="credit">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="bank_transfer">Transferência</SelectItem>
                  <SelectItem value="check">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="payment_status">Status do Pagamento</Label>
              <Select value={formData.payment_status} onValueChange={(value) => handleInputChange('payment_status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {purchase ? 'Atualizar' : 'Criar'} Compra
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
