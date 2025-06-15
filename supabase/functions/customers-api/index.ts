
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface CustomerData {
  name: string;
  email?: string;
  phone?: string;
  document_number?: string;
  document_type?: 'cpf' | 'cnpj';
  customer_type: 'individual' | 'business';
  secondary_phone?: string;
  preferred_contact: 'phone' | 'email' | 'whatsapp';
  notes?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  status?: 'active' | 'inactive';
  tags?: string[];
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
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

    // Extract token and verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's tenant_id
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
    const customerId = pathParts[pathParts.length - 1];

    // Helper function to check permissions
    const checkPermission = async (action: 'create' | 'read' | 'update' | 'delete') => {
      const { data: permission } = await supabase
        .from('user_module_permissions')
        .select(`can_${action}`)
        .eq('user_id', user.id)
        .eq('module_name', 'customers')
        .single();

      return permission?.[`can_${action}`] || false;
    };

    const method = req.method;
    let response: ApiResponse;

    switch (method) {
      case 'GET':
        if (!await checkPermission('read')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot read customers' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (customerId && customerId !== 'customers-api') {
          // Get single customer
          const { data: customer, error } = await supabase
            .from('customers')
            .select(`
              *,
              vehicles:vehicles(count)
            `)
            .eq('id', customerId)
            .eq('tenant_id', tenant_id)
            .single();

          if (error) {
            response = { success: false, error: error.message };
          } else if (!customer) {
            response = { success: false, error: 'Customer not found' };
          } else {
            response = { 
              success: true, 
              data: {
                ...customer,
                vehicles_count: customer.vehicles?.[0]?.count || 0
              }
            };
          }
        } else {
          // Get all customers with pagination and filters
          const page = parseInt(url.searchParams.get('page') || '1');
          const limit = parseInt(url.searchParams.get('limit') || '20');
          const search = url.searchParams.get('search');
          const status = url.searchParams.get('status');
          const customer_type = url.searchParams.get('customer_type');
          
          const offset = (page - 1) * limit;

          let query = supabase
            .from('customers')
            .select(`
              *,
              vehicles:vehicles(count)
            `, { count: 'exact' })
            .eq('tenant_id', tenant_id)
            .order('created_at', { ascending: false });

          // Apply filters
          if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,document_number.ilike.%${search}%`);
          }

          if (status && status !== 'all') {
            query = query.eq('status', status);
          }

          if (customer_type && customer_type !== 'all') {
            query = query.eq('customer_type', customer_type);
          }

          const { data: customers, error, count } = await query
            .range(offset, offset + limit - 1);

          if (error) {
            response = { success: false, error: error.message };
          } else {
            response = {
              success: true,
              data: {
                customers: customers?.map(customer => ({
                  ...customer,
                  vehicles_count: customer.vehicles?.[0]?.count || 0
                })) || [],
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
            JSON.stringify({ success: false, error: 'Permission denied: cannot create customers' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const createData: CustomerData = await req.json();
        
        // Validation
        if (!createData.name || !createData.phone) {
          response = { success: false, error: 'Name and phone are required' };
          break;
        }

        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert([{ 
            ...createData, 
            tenant_id,
            status: createData.status || 'active',
            customer_type: createData.customer_type || 'individual',
            preferred_contact: createData.preferred_contact || 'phone'
          }])
          .select()
          .single();

        if (createError) {
          response = { success: false, error: createError.message };
        } else {
          response = { success: true, data: newCustomer, message: 'Customer created successfully' };
        }
        break;

      case 'PUT':
        if (!await checkPermission('update')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot update customers' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!customerId || customerId === 'customers-api') {
          response = { success: false, error: 'Customer ID required for update' };
          break;
        }

        const updateData: Partial<CustomerData> = await req.json();
        
        const { data: updatedCustomer, error: updateError } = await supabase
          .from('customers')
          .update(updateData)
          .eq('id', customerId)
          .eq('tenant_id', tenant_id)
          .select()
          .single();

        if (updateError) {
          response = { success: false, error: updateError.message };
        } else if (!updatedCustomer) {
          response = { success: false, error: 'Customer not found' };
        } else {
          response = { success: true, data: updatedCustomer, message: 'Customer updated successfully' };
        }
        break;

      case 'DELETE':
        if (!await checkPermission('delete')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Permission denied: cannot delete customers' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!customerId || customerId === 'customers-api') {
          response = { success: false, error: 'Customer ID required for deletion' };
          break;
        }

        const { error: deleteError } = await supabase
          .from('customers')
          .delete()
          .eq('id', customerId)
          .eq('tenant_id', tenant_id);

        if (deleteError) {
          response = { success: false, error: deleteError.message };
        } else {
          response = { success: true, message: 'Customer deleted successfully' };
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
    console.error('API Error:', error);
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
