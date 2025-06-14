
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { usePurchaseOperations } from '@/hooks/usePurchaseOperations';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const purchaseItemSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  quantity: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
  unit_price: z.number().min(0, 'Preço unitário deve ser maior ou igual a 0'),
  category: z.string().optional(),
  notes: z.string().optional(),
});

const purchaseSchema = z.object({
  supplier_name: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  supplier_document: z.string().optional(),
  supplier_contact: z.object({
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  purchase_date: z.string().min(1, 'Data da compra é obrigatória'),
  due_date: z.string().optional(),
  category: z.string().default('general'),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
  invoice_number: z.string().optional(),
  invoice_date: z.string().optional(),
  discount_amount: z.number().min(0).default(0),
  tax_amount: z.number().min(0).default(0),
  items: z.array(purchaseItemSchema).min(1, 'Pelo menos um item é obrigatório'),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  purchase?: any;
}

export const PurchaseForm = ({ isOpen, onClose, purchase }: PurchaseFormProps) => {
  const { createPurchase, updatePurchase } = usePurchaseOperations();
  const { toast } = useToast();

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplier_name: '',
      supplier_document: '',
      supplier_contact: {
        email: '',
        phone: '',
        address: '',
      },
      purchase_date: new Date().toISOString().split('T')[0],
      due_date: '',
      category: 'general',
      payment_method: '',
      notes: '',
      invoice_number: '',
      invoice_date: '',
      discount_amount: 0,
      tax_amount: 0,
      items: [{ description: '', quantity: 1, unit_price: 0, category: '', notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Reset form when purchase changes
  useEffect(() => {
    if (purchase) {
      form.reset({
        supplier_name: purchase.supplier_name || '',
        supplier_document: purchase.supplier_document || '',
        supplier_contact: purchase.supplier_contact || { email: '', phone: '', address: '' },
        purchase_date: purchase.purchase_date || new Date().toISOString().split('T')[0],
        due_date: purchase.due_date || '',
        category: purchase.category || 'general',
        payment_method: purchase.payment_method || '',
        notes: purchase.notes || '',
        invoice_number: purchase.invoice_number || '',
        invoice_date: purchase.invoice_date || '',
        discount_amount: parseFloat(purchase.discount_amount || 0),
        tax_amount: parseFloat(purchase.tax_amount || 0),
        items: purchase.items || [{ description: '', quantity: 1, unit_price: 0, category: '', notes: '' }],
      });
    } else {
      form.reset({
        supplier_name: '',
        supplier_document: '',
        supplier_contact: { email: '', phone: '', address: '' },
        purchase_date: new Date().toISOString().split('T')[0],
        due_date: '',
        category: 'general',
        payment_method: '',
        notes: '',
        invoice_number: '',
        invoice_date: '',
        discount_amount: 0,
        tax_amount: 0,
        items: [{ description: '', quantity: 1, unit_price: 0, category: '', notes: '' }],
      });
    }
  }, [purchase, form]);

  const watchedItems = form.watch('items');
  const watchedDiscount = form.watch('discount_amount');
  const watchedTax = form.watch('tax_amount');

  // Calculate totals
  const subtotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const finalAmount = subtotal - watchedDiscount + watchedTax;

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      const purchaseData = {
        ...data,
        total_amount: subtotal,
        final_amount: finalAmount,
        supplier_contact: JSON.stringify(data.supplier_contact || {}),
      };

      if (purchase) {
        await updatePurchase.mutateAsync({ id: purchase.id, ...purchaseData });
        toast({ title: 'Compra atualizada com sucesso!' });
      } else {
        await createPurchase.mutateAsync(purchaseData);
        toast({ title: 'Compra criada com sucesso!' });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao salvar compra',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    }
  };

  const addItem = () => {
    append({ description: '', quantity: 1, unit_price: 0, category: '', notes: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-satoshi">
            {purchase ? 'Editar Compra' : 'Nova Compra'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Supplier Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Fornecedor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="supplier_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Fornecedor *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da empresa..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplier_document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ/CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="supplier_contact.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="contato@fornecedor.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplier_contact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplier_contact.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Endereço do fornecedor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Purchase Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes da Compra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="purchase_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Compra *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vencimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">Geral</SelectItem>
                            <SelectItem value="inventory">Estoque</SelectItem>
                            <SelectItem value="tools">Ferramentas</SelectItem>
                            <SelectItem value="office">Escritório</SelectItem>
                            <SelectItem value="maintenance">Manutenção</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forma de Pagamento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Dinheiro</SelectItem>
                            <SelectItem value="pix">PIX</SelectItem>
                            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                            <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                            <SelectItem value="bank_transfer">Transferência</SelectItem>
                            <SelectItem value="check">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoice_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da Nota Fiscal</FormLabel>
                        <FormControl>
                          <Input placeholder="123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="invoice_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Nota Fiscal</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Itens da Compra</CardTitle>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Item {index + 1}</Badge>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição *</FormLabel>
                              <FormControl>
                                <Input placeholder="Descrição do item..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.unit_price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço Unitário *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end">
                        <div className="w-full">
                          <Label>Total</Label>
                          <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                            R$ {(watchedItems[index]?.quantity * watchedItems[index]?.unit_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Totals and Final Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Totais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Subtotal</Label>
                    <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                      R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="discount_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desconto</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tax_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impostos/Taxas</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Final:</span>
                    <span className="text-2xl font-bold text-torqx-primary">
                      R$ {finalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observações adicionais sobre a compra..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createPurchase.isPending || updatePurchase.isPending}
                className="bg-torqx-secondary hover:bg-torqx-secondary-dark"
              >
                {purchase ? 'Atualizar' : 'Criar'} Compra
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
