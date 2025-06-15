
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface VehicleData {
  customer_id: string;
  brand: string;
  model: string;
  year?: number;
  license_plate: string;
  color?: string;
  fuel_type?: string;
  engine_size?: string;
  transmission?: string;
  vin_chassis?: string;
  current_mileage?: number;
  technical_specs?: any;
  maintenance_intervals?: any;
  mileage_history?: any[];
  condition_notes?: string;
  notes?: string;
  status?: 'active' | 'inactive';
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
    const vehicleId = pathParts[pathParts.length - 1];

    const checkPermission = async (action: 'create' | 'read' | 'update' | 'delete') => {
      const { data: permission } = await supabase
        .from('user_module_permissions')
        .select(`can_${action}`)
        .eq('user_id', user.id)
        .eq('module_name', 'vehicles')
        .single();

      return permission?.[`can_${action}`] || false;
    };

    const method = req.method;
    let response: ApiResponse;

    switch (method) {
      case 'GET':
        if (!await checkPermission('read')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot read vehicles' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (vehicleId && vehicleId !== 'vehicles-api') {
          const { data: vehicle, error } = await supabase
            .from('vehicles')
            .select(`
              *,
              customers:customers(name, phone, email)
            `)
            .eq('id', vehicleId)
            .eq('tenant_id', tenant_id)
            .single();

          if (error) {
            response = { success: false, error: error.message };
          } else if (!vehicle) {
            response = { success: false, error: 'Vehicle not found' };
          } else {
            response = { success: true, data: vehicle };
          }
        } else {
          const page = parseInt(url.searchParams.get('page') || '1');
          const limit = parseInt(url.searchParams.get('limit') || '20');
          const search = url.searchParams.get('search');
          const customer_id = url.searchParams.get('customer_id');
          const status = url.searchParams.get('status');
          
          const offset = (page - 1) * limit;

          let query = supabase
            .from('vehicles')
            .select(`
              *,
              customers:customers(name, phone, email)
            `, { count: 'exact' })
            .eq('tenant_id', tenant_id)
            .order('created_at', { ascending: false });

          if (search) {
            query = query.or(`brand.ilike.%${search}%,model.ilike.%${search}%,license_plate.ilike.%${search}%`);
          }

          if (customer_id) {
            query = query.eq('customer_id', customer_id);
          }

          if (status && status !== 'all') {
            query = query.eq('status', status);
          }

          const { data: vehicles, error, count } = await query
            .range(offset, offset + limit - 1);

          if (error) {
            response = { success: false, error: error.message };
          } else {
            response = {
              success: true,
              data: {
                vehicles: vehicles || [],
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
            JSON.stringify({ success: false, error: 'Permission denied: cannot create vehicles' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const createData: VehicleData = await req.json();
        
        if (!createData.customer_id || !createData.brand || !createData.model || !createData.license_plate) {
          response = { success: false, error: 'Customer ID, brand, model, and license plate are required' };
          break;
        }

        const { data: newVehicle, error: createError } = await supabase
          .from('vehicles')
          .insert([{ 
            ...createData, 
            tenant_id,
            status: createData.status || 'active'
          }])
          .select()
          .single();

        if (createError) {
          response = { success: false, error: createError.message };
        } else {
          response = { success: true, data: newVehicle, message: 'Vehicle created successfully' };
        }
        break;

      case 'PUT':
        if (!await checkPermission('update')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot update vehicles' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!vehicleId || vehicleId === 'vehicles-api') {
          response = { success: false, error: 'Vehicle ID required for update' };
          break;
        }

        const updateData: Partial<VehicleData> = await req.json();
        
        const { data: updatedVehicle, error: updateError } = await supabase
          .from('vehicles')
          .update(updateData)
          .eq('id', vehicleId)
          .eq('tenant_id', tenant_id)
          .select()
          .single();

        if (updateError) {
          response = { success: false, error: updateError.message };
        } else if (!updatedVehicle) {
          response = { success: false, error: 'Vehicle not found' };
        } else {
          response = { success: true, data: updatedVehicle, message: 'Vehicle updated successfully' };
        }
        break;

      case 'DELETE':
        if (!await checkPermission('delete')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot delete vehicles' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!vehicleId || vehicleId === 'vehicles-api') {
          response = { success: false, error: 'Vehicle ID required for deletion' };
          break;
        }

        const { error: deleteError } = await supabase
          .from('vehicles')
          .delete()
          .eq('id', vehicleId)
          .eq('tenant_id', tenant_id);

        if (deleteError) {
          response = { success: false, error: deleteError.message };
        } else {
          response = { success: true, message: 'Vehicle deleted successfully' };
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
    console.error('Vehicles API Error:', error);
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
