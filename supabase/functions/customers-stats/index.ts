
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
  totalRevenue: number;
  averageTicket: number;
  activeCustomers: number;
  inactiveCustomers: number;
  individualCustomers: number;
  businessCustomers: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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

    // Check read permission for customers module
    const { data: permission } = await supabase
      .from('user_module_permissions')
      .select('can_read')
      .eq('user_id', user.id)
      .eq('module_name', 'customers')
      .single();

    if (!permission?.can_read) {
      return new Response(
        JSON.stringify({ success: false, error: 'Permission denied: cannot read customer statistics' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's tenant_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.tenant_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'User tenant not found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { tenant_id } = userData;

    // Get total customers count
    const { count: totalCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant_id);

    // Get active customers count
    const { count: activeCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant_id)
      .eq('status', 'active');

    // Get inactive customers count
    const { count: inactiveCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant_id)
      .eq('status', 'inactive');

    // Get individual customers count
    const { count: individualCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant_id)
      .eq('customer_type', 'individual');

    // Get business customers count
    const { count: businessCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant_id)
      .eq('customer_type', 'business');

    // Get new customers this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: newThisMonth } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant_id)
      .gte('created_at', startOfMonth.toISOString());

    // Get revenue and average ticket from customer metrics
    const { data: revenue } = await supabase
      .from('customers')
      .select('total_spent')
      .eq('tenant_id', tenant_id);

    const totalRevenue = revenue?.reduce((sum, customer) => sum + (customer.total_spent || 0), 0) || 0;
    const averageTicket = totalCustomers ? totalRevenue / totalCustomers : 0;

    const stats: CustomerStats = {
      totalCustomers: totalCustomers || 0,
      newThisMonth: newThisMonth || 0,
      totalRevenue,
      averageTicket,
      activeCustomers: activeCustomers || 0,
      inactiveCustomers: inactiveCustomers || 0,
      individualCustomers: individualCustomers || 0,
      businessCustomers: businessCustomers || 0,
    };

    return new Response(
      JSON.stringify({ success: true, data: stats }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Customer Stats API Error:', error);
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
