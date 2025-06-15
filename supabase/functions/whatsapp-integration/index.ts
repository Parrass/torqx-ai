
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

    const { action, instanceName, ...data } = await req.json();

    let response;
    const baseUrl = `${evolutionApiUrl}/instance`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': evolutionApiKey,
    };

    switch (action) {
      case 'create_instance':
        response = await fetch(`${baseUrl}/create`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            instanceName: instanceName || 'torqx-instance',
            token: evolutionApiKey,
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS'
          }),
        });
        break;

      case 'get_qr_code':
        response = await fetch(`${baseUrl}/connect/${instanceName}`, {
          method: 'GET',
          headers,
        });
        break;

      case 'get_instance_status':
        response = await fetch(`${baseUrl}/connectionState/${instanceName}`, {
          method: 'GET',
          headers,
        });
        break;

      case 'send_message':
        response = await fetch(`${evolutionApiUrl}/message/sendText/${instanceName}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            number: data.number,
            text: data.message,
          }),
        });
        break;

      case 'send_media':
        response = await fetch(`${evolutionApiUrl}/message/sendMedia/${instanceName}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            number: data.number,
            mediatype: data.mediaType,
            media: data.media,
            caption: data.caption || '',
          }),
        });
        break;

      case 'get_chat_messages':
        response = await fetch(`${evolutionApiUrl}/chat/findMessages/${instanceName}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            where: {
              remoteJid: data.number,
            },
            limit: data.limit || 50,
          }),
        });
        break;

      case 'logout_instance':
        response = await fetch(`${baseUrl}/logout/${instanceName}`, {
          method: 'DELETE',
          headers,
        });
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify({
      success: response.ok,
      data: result,
      status: response.status,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

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
