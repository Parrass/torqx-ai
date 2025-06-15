
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');

    if (!evolutionApiUrl || !evolutionApiKey) {
      throw new Error('Evolution API credentials not configured');
    }

    const { action, tenantId, instanceName, ...data } = await req.json();

    let response;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': evolutionApiKey,
    };

    console.log(`Evolution API Action: ${action}`);

    switch (action) {
      case 'create_instance':
        // Primeiro criar no Evolution API
        response = await fetch(`${evolutionApiUrl}/instance/create`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            instanceName: data.instanceName,
            token: data.token,
            integration: data.integration || 'WHATSAPP-BAILEYS',
            qrcode: data.qrcode !== false,
            rejectCall: data.rejectCall,
            msgCall: data.msgCall,
            groupsIgnore: data.groupsIgnore,
            alwaysOnline: data.alwaysOnline,
            readMessages: data.readMessages,
            readStatus: data.readStatus,
            syncFullHistory: data.syncFullHistory,
            webhook: data.webhook,
          }),
        });

        const instanceResult = await response.json();
        
        if (response.ok) {
          // Salvar no banco de dados
          const { data: dbInstance, error } = await supabaseClient
            .from('whatsapp_instances')
            .insert({
              tenant_id: tenantId,
              instance_name: data.instanceName,
              instance_id: instanceResult.instance?.instanceId,
              status: 'created',
              token: data.token,
              webhook_url: data.webhook?.url,
              settings: {
                rejectCall: data.rejectCall,
                msgCall: data.msgCall,
                groupsIgnore: data.groupsIgnore,
                alwaysOnline: data.alwaysOnline,
                readMessages: data.readMessages,
                readStatus: data.readStatus,
                syncFullHistory: data.syncFullHistory,
              }
            })
            .select()
            .single();

          if (error) {
            console.error('Database error:', error);
            throw new Error('Failed to save instance to database');
          }

          return new Response(JSON.stringify({
            success: true,
            data: dbInstance,
            evolutionResponse: instanceResult,
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'get_qr_code':
        response = await fetch(`${evolutionApiUrl}/instance/connect/${instanceName}`, {
          method: 'GET',
          headers,
        });
        break;

      case 'get_instance_status':
        response = await fetch(`${evolutionApiUrl}/instance/connectionState/${instanceName}`, {
          method: 'GET',
          headers,
        });
        break;

      case 'logout_instance':
        response = await fetch(`${evolutionApiUrl}/instance/logout/${instanceName}`, {
          method: 'DELETE',
          headers,
        });

        if (response.ok) {
          // Atualizar status no banco
          await supabaseClient
            .from('whatsapp_instances')
            .update({ 
              is_connected: false, 
              status: 'disconnected',
              qr_code: null,
              pairing_code: null 
            })
            .eq('instance_name', instanceName);
        }
        break;

      case 'get_instance_by_tenant':
        const { data: instance, error } = await supabaseClient
          .from('whatsapp_instances')
          .select('*')
          .eq('tenant_id', tenantId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        return new Response(JSON.stringify({
          success: true,
          data: instance,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (response) {
      const result = await response.json();

      console.log(`Evolution API Response [${action}]:`, {
        status: response.status,
        success: response.ok,
        data: result
      });

      return new Response(JSON.stringify({
        success: response.ok,
        data: result,
        status: response.status,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('No response generated');

  } catch (error) {
    console.error('WhatsApp Integration Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
