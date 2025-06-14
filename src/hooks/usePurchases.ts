
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePurchases = () => {
  return useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          purchase_items (
            id,
            description,
            quantity,
            unit_price,
            total_price,
            category,
            notes
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const usePurchase = (id: string) => {
  return useQuery({
    queryKey: ['purchase', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          purchase_items (
            id,
            description,
            quantity,
            unit_price,
            total_price,
            category,
            notes
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
