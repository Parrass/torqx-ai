
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CreatePurchaseData {
  supplier_name: string;
  supplier_document?: string;
  supplier_contact?: string;
  purchase_date: string;
  due_date?: string;
  total_amount: number;
  discount_amount?: number;
  tax_amount?: number;
  final_amount: number;
  payment_method?: string;
  category?: string;
  notes?: string;
  invoice_number?: string;
  invoice_date?: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    category?: string;
    notes?: string;
  }>;
}

interface UpdatePurchaseData extends CreatePurchaseData {
  id: string;
}

export const usePurchaseOperations = () => {
  const queryClient = useQueryClient();

  const createPurchase = useMutation({
    mutationFn: async (data: CreatePurchaseData) => {
      // Get current user to determine tenant
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get tenant ID from user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;
      if (!userData?.tenant_id) throw new Error('User tenant not found');

      // Generate purchase number
      const { data: purchaseNumber, error: numberError } = await supabase
        .rpc('generate_purchase_number', { tenant_uuid: userData.tenant_id });

      if (numberError) throw numberError;

      // Create purchase
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          tenant_id: userData.tenant_id,
          purchase_number: purchaseNumber,
          supplier_name: data.supplier_name,
          supplier_document: data.supplier_document,
          supplier_contact: data.supplier_contact ? JSON.parse(data.supplier_contact) : {},
          purchase_date: data.purchase_date,
          due_date: data.due_date,
          total_amount: data.total_amount,
          discount_amount: data.discount_amount || 0,
          tax_amount: data.tax_amount || 0,
          final_amount: data.final_amount,
          payment_method: data.payment_method,
          category: data.category || 'general',
          notes: data.notes,
          invoice_number: data.invoice_number,
          invoice_date: data.invoice_date,
          created_by_user_id: user.id,
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Create purchase items
      if (data.items && data.items.length > 0) {
        const items = data.items.map(item => ({
          purchase_id: purchase.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          category: item.category,
          notes: item.notes,
        }));

        const { error: itemsError } = await supabase
          .from('purchase_items')
          .insert(items);

        if (itemsError) throw itemsError;
      }

      return purchase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const updatePurchase = useMutation({
    mutationFn: async (data: UpdatePurchaseData) => {
      const { id, items, ...purchaseData } = data;

      // Update purchase
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .update({
          supplier_name: purchaseData.supplier_name,
          supplier_document: purchaseData.supplier_document,
          supplier_contact: purchaseData.supplier_contact ? JSON.parse(purchaseData.supplier_contact) : {},
          purchase_date: purchaseData.purchase_date,
          due_date: purchaseData.due_date,
          total_amount: purchaseData.total_amount,
          discount_amount: purchaseData.discount_amount || 0,
          tax_amount: purchaseData.tax_amount || 0,
          final_amount: purchaseData.final_amount,
          payment_method: purchaseData.payment_method,
          category: purchaseData.category || 'general',
          notes: purchaseData.notes,
          invoice_number: purchaseData.invoice_number,
          invoice_date: purchaseData.invoice_date,
        })
        .eq('id', id)
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Delete existing items
      await supabase
        .from('purchase_items')
        .delete()
        .eq('purchase_id', id);

      // Create new items
      if (items && items.length > 0) {
        const newItems = items.map(item => ({
          purchase_id: id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          category: item.category,
          notes: item.notes,
        }));

        const { error: itemsError } = await supabase
          .from('purchase_items')
          .insert(newItems);

        if (itemsError) throw itemsError;
      }

      return purchase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const deletePurchase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({ id, status, paymentDate }: { id: string; status: string; paymentDate?: string }) => {
      const { error } = await supabase
        .from('purchases')
        .update({ 
          payment_status: status, 
          payment_date: paymentDate 
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  return {
    createPurchase,
    updatePurchase,
    deletePurchase,
    updatePaymentStatus,
  };
};
