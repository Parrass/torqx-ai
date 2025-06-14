
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  cost_price: number;
  sale_price: number;
  supplier_name: string;
  location: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface InventoryStats {
  total_items: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
  total_value: number;
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    total_items: 0,
    in_stock: 0,
    low_stock: 0,
    out_of_stock: 0,
    total_value: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchInventory = async () => {
    if (!user?.user_metadata?.tenant_id) {
      console.log('No tenant_id found in user metadata');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching inventory for tenant:', user.user_metadata.tenant_id);
      
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('tenant_id', user.user_metadata.tenant_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw inventory data:', data);

      // Transform data to match our interface, ensuring status is properly typed
      const inventoryData: InventoryItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name || '',
        category: item.category || '',
        brand: item.brand || '',
        sku: item.sku || '',
        current_stock: item.current_stock || 0,
        minimum_stock: item.minimum_stock || 0,
        maximum_stock: item.maximum_stock || 0,
        cost_price: item.cost_price || 0,
        sale_price: item.sale_price || 0,
        supplier_name: item.supplier_name || '',
        location: item.location || '',
        status: (item.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      setInventory(inventoryData);

      // Calculate stats
      const totalItems = inventoryData.length;
      const inStock = inventoryData.filter(item => item.current_stock > item.minimum_stock).length;
      const lowStock = inventoryData.filter(item => 
        item.current_stock <= item.minimum_stock && item.current_stock > 0
      ).length;
      const outOfStock = inventoryData.filter(item => item.current_stock === 0).length;
      const totalValue = inventoryData.reduce((sum, item) => 
        sum + (item.current_stock * (item.cost_price || 0)), 0
      );

      setStats({
        total_items: totalItems,
        in_stock: inStock,
        low_stock: lowStock,
        out_of_stock: outOfStock,
        total_value: totalValue,
      });
      
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar estoque',
        variant: 'destructive',
      });
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const createInventoryItem = async (itemData: Partial<InventoryItem>) => {
    if (!user?.user_metadata?.tenant_id) return;
    
    try {
      // Transform data to match database schema
      const dbData = {
        name: itemData.name,
        category: itemData.category,
        brand: itemData.brand,
        sku: itemData.sku,
        current_stock: itemData.current_stock,
        minimum_stock: itemData.minimum_stock,
        maximum_stock: itemData.maximum_stock,
        cost_price: itemData.cost_price,
        sale_price: itemData.sale_price,
        supplier_name: itemData.supplier_name,
        location: itemData.location,
        status: itemData.status,
        tenant_id: user.user_metadata.tenant_id,
      };

      const { data, error } = await supabase
        .from('inventory_items')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;

      // Transform response to match our interface
      const newItem: InventoryItem = {
        id: data.id,
        name: data.name || '',
        category: data.category || '',
        brand: data.brand || '',
        sku: data.sku || '',
        current_stock: data.current_stock || 0,
        minimum_stock: data.minimum_stock || 0,
        maximum_stock: data.maximum_stock || 0,
        cost_price: data.cost_price || 0,
        sale_price: data.sale_price || 0,
        supplier_name: data.supplier_name || '',
        location: data.location || '',
        status: (data.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setInventory(prev => [newItem, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Item adicionado ao estoque com sucesso',
      });
      
      return newItem;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar item ao estoque',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInventory(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      toast({
        title: 'Sucesso',
        description: 'Item atualizado com sucesso',
      });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar item',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInventory(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Item removido do estoque',
      });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover item',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  return {
    inventory,
    stats,
    loading,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    refetch: fetchInventory,
  };
};
