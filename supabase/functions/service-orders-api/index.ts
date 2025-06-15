
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface ServiceOrderData {
  customer_id: string;
  vehicle_id: string;
  assigned_technician_id?: string;
  problem_description: string;
  customer_complaint?: string;
  internal_notes?: string;
  status?: string;
  priority?: string;
  estimated_cost?: number;
  final_cost?: number;
  estimated_hours?: number;
  final_hours?: number;
  vehicle_mileage?: number;
  scheduled_start_date?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
  customer_approved?: boolean;
  ai_diagnosis?: any;
  ai_recommendations?: any[];
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
    const serviceOrderId = pathParts[pathParts.length - 1];

    const checkPermission = async (action: 'create' | 'read' | 'update' | 'delete') => {
      const { data: permission } = await supabase
        .from('user_module_permissions')
        .select(`can_${action}`)
        .eq('user_id', user.id)
        .eq('module_name', 'service_orders')
        .single();

      return permission?.[`can_${action}`] || false;
    };

    const method = req.method;
    let response: ApiResponse;

    switch (method) {
      case 'GET':
        if (!await checkPermission('read')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot read service orders' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (serviceOrderId && serviceOrderId !== 'service-orders-api') {
          const { data: serviceOrder, error } = await supabase
            .from('service_orders')
            .select(`
              *,
              customers:customers(name, phone, email),
              vehicles:vehicles(brand, model, license_plate, year),
              assigned_technician:users(full_name)
            `)
            .eq('id', serviceOrderId)
            .eq('tenant_id', tenant_id)
            .single();

          if (error) {
            response = { success: false, error: error.message };
          } else if (!serviceOrder) {
            response = { success: false, error: 'Service order not found' };
          } else {
            response = { success: true, data: serviceOrder };
          }
        } else {
          const page = parseInt(url.searchParams.get('page') || '1');
          const limit = parseInt(url.searchParams.get('limit') || '20');
          const search = url.searchParams.get('search');
          const status = url.searchParams.get('status');
          const priority = url.searchParams.get('priority');
          const customer_id = url.searchParams.get('customer_id');
          const technician_id = url.searchParams.get('technician_id');
          
          const offset = (page - 1) * limit;

          let query = supabase
            .from('service_orders')
            .select(`
              *,
              customers:customers(name, phone),
              vehicles:vehicles(brand, model, license_plate),
              assigned_technician:users(full_name)
            `, { count: 'exact' })
            .eq('tenant_id', tenant_id)
            .order('created_at', { ascending: false });

          if (search) {
            query = query.or(`problem_description.ilike.%${search}%,customer_complaint.ilike.%${search}%,order_number::text.ilike.%${search}%`);
          }

          if (status && status !== 'all') {
            query = query.eq('status', status);
          }

          if (priority && priority !== 'all') {
            query = query.eq('priority', priority);
          }

          if (customer_id) {
            query = query.eq('customer_id', customer_id);
          }

          if (technician_id) {
            query = query.eq('assigned_technician_id', technician_id);
          }

          const { data: serviceOrders, error, count } = await query
            .range(offset, offset + limit - 1);

          if (error) {
            response = { success: false, error: error.message };
          } else {
            response = {
              success: true,
              data: {
                serviceOrders: serviceOrders || [],
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
            JSON.stringify({ success: false, error: 'Permission denied: cannot create service orders' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const createData: ServiceOrderData = await req.json();
        
        if (!createData.customer_id || !createData.vehicle_id || !createData.problem_description) {
          response = { success: false, error: 'Customer ID, vehicle ID, and problem description are required' };
          break;
        }

        const { data: newServiceOrder, error: createError } = await supabase
          .from('service_orders')
          .insert([{ 
            ...createData, 
            tenant_id,
            created_by_user_id: user.id,
            status: createData.status || 'draft',
            priority: createData.priority || 'normal'
          }])
          .select()
          .single();

        if (createError) {
          response = { success: false, error: createError.message };
        } else {
          response = { success: true, data: newServiceOrder, message: 'Service order created successfully' };
        }
        break;

      case 'PUT':
        if (!await checkPermission('update')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot update service orders' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!serviceOrderId || serviceOrderId === 'service-orders-api') {
          response = { success: false, error: 'Service order ID required for update' };
          break;
        }

        const updateData: Partial<ServiceOrderData> = await req.json();
        
        const { data: updatedServiceOrder, error: updateError } = await supabase
          .from('service_orders')
          .update(updateData)
          .eq('id', serviceOrderId)
          .eq('tenant_id', tenant_id)
          .select()
          .single();

        if (updateError) {
          response = { success: false, error: updateError.message };
        } else if (!updatedServiceOrder) {
          response = { success: false, error: 'Service order not found' };
        } else {
          response = { success: true, data: updatedServiceOrder, message: 'Service order updated successfully' };
        }
        break;

      case 'DELETE':
        if (!await checkPermission('delete')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot delete service orders' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!serviceOrderId || serviceOrderId === 'service-orders-api') {
          response = { success: false, error: 'Service order ID required for deletion' };
          break;
        }

        const { error: deleteError } = await supabase
          .from('service_orders')
          .delete()
          .eq('id', serviceOrderId)
          .eq('tenant_id', tenant_id);

        if (deleteError) {
          response = { success: false, error: deleteError.message };
        } else {
          response = { success: true, message: 'Service order deleted successfully' };
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
    console.error('Service Orders API Error:', error);
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
