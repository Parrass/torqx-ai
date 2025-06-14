
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Supplier, CreateSupplierData } from '@/types/supplier';
import { useAuth } from '@/contexts/AuthContext';

export const useSuppliers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchSuppliers = async (): Promise<Supplier[]> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name');

    if (error) throw error;
    
    return (data || []).map(supplier => ({
      ...supplier,
      document_type: (supplier.document_type || 'cnpj') as 'cnpj' | 'cpf',
      status: supplier.status as 'active' | 'inactive' | 'suspended'
    }));
  };

  const createSupplier = async (supplierData: CreateSupplierData): Promise<Supplier> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('suppliers')
      .insert({
        ...supplierData,
        created_by_user_id: user.id,
        tenant_id: user.user_metadata?.tenant_id
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      document_type: (data.document_type || 'cnpj') as 'cnpj' | 'cpf',
      status: data.status as 'active' | 'inactive' | 'suspended'
    };
  };

  const updateSupplier = async ({ id, ...data }: Partial<Supplier> & { id: string }): Promise<Supplier> => {
    if (!user) throw new Error('User not authenticated');

    const { data: updatedData, error } = await supabase
      .from('suppliers')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...updatedData,
      document_type: (updatedData.document_type || 'cnpj') as 'cnpj' | 'cpf',
      status: updatedData.status as 'active' | 'inactive' | 'suspended'
    };
  };

  const deleteSupplier = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  return {
    suppliers: useQuery({
      queryKey: ['suppliers'],
      queryFn: fetchSuppliers,
      enabled: !!user,
    }),
    createSupplier: useMutation({
      mutationFn: createSupplier,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      },
    }),
    updateSupplier: useMutation({
      mutationFn: updateSupplier,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      },
    }),
    deleteSupplier: useMutation({
      mutationFn: deleteSupplier,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      },
    }),
  };
};
