
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Purchase, CreatePurchaseData, PurchaseMetrics } from '@/types/purchase';
import { useAuth } from '@/contexts/AuthContext';

export const usePurchases = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchPurchases = async (): Promise<Purchase[]> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        purchase_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const createPurchase = async (purchaseData: CreatePurchaseData): Promise<Purchase> => {
    if (!user) throw new Error('User not authenticated');

    // Gerar número da compra
    const { data: purchaseNumber, error: numberError } = await supabase
      .rpc('generate_purchase_number', { tenant_uuid: user.user_metadata?.tenant_id });

    if (numberError) throw numberError;

    // Calcular totais
    const totalAmount = purchaseData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const finalAmount = totalAmount + (purchaseData.tax_amount || 0) - (purchaseData.discount_amount || 0);

    // Criar compra
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        purchase_number: purchaseNumber,
        supplier_name: purchaseData.supplier_name,
        supplier_document: purchaseData.supplier_document,
        supplier_contact: purchaseData.supplier_contact || {},
        invoice_number: purchaseData.invoice_number,
        invoice_date: purchaseData.invoice_date,
        purchase_date: purchaseData.purchase_date,
        due_date: purchaseData.due_date,
        category: purchaseData.category,
        total_amount: totalAmount,
        tax_amount: purchaseData.tax_amount || 0,
        discount_amount: purchaseData.discount_amount || 0,
        final_amount: finalAmount,
        payment_method: purchaseData.payment_method,
        notes: purchaseData.notes,
        created_by_user_id: user.id,
        tenant_id: user.user_metadata?.tenant_id
      })
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    // Criar itens da compra
    const purchaseItems = purchaseData.items.map(item => ({
      purchase_id: purchase.id,
      inventory_item_id: item.inventory_item_id,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
      notes: item.notes
    }));

    const { error: itemsError } = await supabase
      .from('purchase_items')
      .insert(purchaseItems);

    if (itemsError) throw itemsError;

    return purchase;
  };

  const updatePurchaseStatus = async (id: string, status: string, paymentDate?: string) => {
    const updateData: any = { payment_status: status };
    if (paymentDate) updateData.payment_date = paymentDate;

    const { error } = await supabase
      .from('purchases')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  };

  const fetchPurchaseMetrics = async (): Promise<PurchaseMetrics[]> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('purchase_metrics')
      .select('*')
      .eq('tenant_id', user.user_metadata?.tenant_id)
      .order('month', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  return {
    purchases: useQuery({
      queryKey: ['purchases'],
      queryFn: fetchPurchases,
      enabled: !!user,
    }),
    metrics: useQuery({
      queryKey: ['purchase-metrics'],
      queryFn: fetchPurchaseMetrics,
      enabled: !!user,
    }),
    createPurchase: useMutation({
      mutationFn: createPurchase,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['purchases'] });
        queryClient.invalidateQueries({ queryKey: ['purchase-metrics'] });
      },
    }),
    updateStatus: useMutation({
      mutationFn: ({ id, status, paymentDate }: { id: string; status: string; paymentDate?: string }) =>
        updatePurchaseStatus(id, status, paymentDate),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['purchases'] });
        queryClient.invalidateQueries({ queryKey: ['purchase-metrics'] });
      },
    }),
  };
};
