
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface InventoryItemData {
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  brand?: string;
  unit?: string;
  current_stock?: number;
  minimum_stock?: number;
  maximum_stock?: number;
  cost_price?: number;
  sale_price?: number;
  margin_percentage?: number;
  location?: string;
  shelf?: string;
  supplier_name?: string;
  supplier_code?: string;
  technical_specs?: any;
  track_stock?: boolean;
  allow_negative_stock?: boolean;
  status?: 'active' | 'inactive';
  notes?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tenant_id, role')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.tenant_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'User tenant not found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { tenant_id } = userData;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const itemId = pathParts[pathParts.length - 1];

    const checkPermission = async (action: 'create' | 'read' | 'update' | 'delete') => {
      const { data: permission } = await supabase
        .from('user_module_permissions')
        .select(`can_${action}`)
        .eq('user_id', user.id)
        .eq('module_name', 'inventory')
        .single();

      return permission?.[`can_${action}`] || false;
    };

    const method = req.method;
    let response: ApiResponse;

    switch (method) {
      case 'GET':
        if (!await checkPermission('read')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot read inventory' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (itemId && itemId !== 'inventory-api') {
          const { data: item, error } = await supabase
            .from('inventory_items')
            .select('*')
            .eq('id', itemId)
            .eq('tenant_id', tenant_id)
            .single();

          if (error) {
            response = { success: false, error: error.message };
          } else if (!item) {
            response = { success: false, error: 'Inventory item not found' };
          } else {
            response = { success: true, data: item };
          }
        } else {
          const page = parseInt(url.searchParams.get('page') || '1');
          const limit = parseInt(url.searchParams.get('limit') || '20');
          const search = url.searchParams.get('search');
          const category = url.searchParams.get('category');
          const status = url.searchParams.get('status');
          const low_stock = url.searchParams.get('low_stock');
          
          const offset = (page - 1) * limit;

          let query = supabase
            .from('inventory_items')
            .select('*', { count: 'exact' })
            .eq('tenant_id', tenant_id)
            .order('created_at', { ascending: false });

          if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%`);
          }

          if (category && category !== 'all') {
            query = query.eq('category', category);
          }

          if (status && status !== 'all') {
            query = query.eq('status', status);
          }

          if (low_stock === 'true') {
            query = query.lt('current_stock', 'minimum_stock');
          }

          const { data: items, error, count } = await query
            .range(offset, offset + limit - 1);

          if (error) {
            response = { success: false, error: error.message };
          } else {
            response = {
              success: true,
              data: {
                items: items || [],
                pagination: {
                  page,
                  limit,
                  total: count || 0,
                  totalPages: Math.ceil((count || 0) / limit)
                }
              }
            };
          }
        }
        break;

      case 'POST':
        if (!await checkPermission('create')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot create inventory items' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const createData: InventoryItemData = await req.json();
        
        if (!createData.name) {
          response = { success: false, error: 'Item name is required' };
          break;
        }

        const { data: newItem, error: createError } = await supabase
          .from('inventory_items')
          .insert([{ 
            ...createData, 
            tenant_id,
            status: createData.status || 'active',
            unit: createData.unit || 'un',
            current_stock: createData.current_stock || 0,
            minimum_stock: createData.minimum_stock || 0,
            track_stock: createData.track_stock !== false,
            allow_negative_stock: createData.allow_negative_stock || false
          }])
          .select()
          .single();

        if (createError) {
          response = { success: false, error: createError.message };
        } else {
          response = { success: true, data: newItem, message: 'Inventory item created successfully' };
        }
        break;

      case 'PUT':
        if (!await checkPermission('update')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot update inventory items' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!itemId || itemId === 'inventory-api') {
          response = { success: false, error: 'Item ID required for update' };
          break;
        }

        const updateData: Partial<InventoryItemData> = await req.json();
        
        const { data: updatedItem, error: updateError } = await supabase
          .from('inventory_items')
          .update(updateData)
          .eq('id', itemId)
          .eq('tenant_id', tenant_id)
          .select()
          .single();

        if (updateError) {
          response = { success: false, error: updateError.message };
        } else if (!updatedItem) {
          response = { success: false, error: 'Inventory item not found' };
        } else {
          response = { success: true, data: updatedItem, message: 'Inventory item updated successfully' };
        }
        break;

      case 'DELETE':
        if (!await checkPermission('delete')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot delete inventory items' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!itemId || itemId === 'inventory-api') {
          response = { success: false, error: 'Item ID required for deletion' };
          break;
        }

        const { error: deleteError } = await supabase
          .from('inventory_items')
          .delete()
          .eq('id', itemId)
          .eq('tenant_id', tenant_id);

        if (deleteError) {
          response = { success: false, error: deleteError.message };
        } else {
          response = { success: true, message: 'Inventory item deleted successfully' };
        }
        break;

      default:
        response = { success: false, error: 'Method not allowed' };
        break;
    }

    const status = response.success ? 200 : (response.error?.includes('not found') ? 404 : 400);
    
    return new Response(
      JSON.stringify(response),
      { 
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Inventory API Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
