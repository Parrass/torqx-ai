
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    
    // Extrair o evento da URL se estiver usando webhook by events
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const eventFromPath = pathParts[pathParts.length - 1]; // Último segmento da URL
    
    console.log('=== WEBHOOK RECEBIDO ===');
    console.log('URL completa:', req.url);
    console.log('Caminho:', url.pathname);
    console.log('Evento da URL:', eventFromPath);
    console.log('Dados completos:', JSON.stringify(webhookData, null, 2));
    console.log('Event do payload:', webhookData.event);
    console.log('Type do payload:', webhookData.type);
    console.log('Instance:', webhookData.instance?.instanceName);

    // Verificar URL do N8N
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    console.log('N8N URL configurada:', n8nWebhookUrl ? 'SIM' : 'NÃO');
    
    if (!n8nWebhookUrl) {
      console.error('❌ N8N_WEBHOOK_URL não configurada!');
      return new Response(JSON.stringify({
        success: false,
        error: 'N8N_WEBHOOK_URL não configurada nos secrets do Supabase'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determinar o evento real (da URL ou do payload)
    const actualEvent = webhookData.event || webhookData.type || eventFromPath;
    
    // Lógica mais ampla para detectar eventos de mensagem
    const isMessageEvent = actualEvent === 'MESSAGES_UPSERT' || 
                          actualEvent === 'MESSAGE_RECEIVED' ||
                          actualEvent === 'MESSAGE_SENT' ||
                          eventFromPath === 'MESSAGES_UPSERT' ||
                          eventFromPath === 'MESSAGE_RECEIVED' ||
                          eventFromPath === 'MESSAGE_SENT' ||
                          (webhookData.data && webhookData.data.messages) ||
                          (webhookData.messages && webhookData.messages.length > 0);

    console.log('Evento determinado:', actualEvent);
    console.log('É evento de mensagem?', isMessageEvent);

    // SEMPRE redirecionar para N8N para debug
    console.log('🔄 Redirecionando TODOS os eventos para N8N:', n8nWebhookUrl);

    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Supabase-Webhook-Proxy',
        },
        body: JSON.stringify({
          ...webhookData,
          _torqx_metadata: {
            processed_at: new Date().toISOString(),
            is_message_event: isMessageEvent,
            source: 'evolution-api',
            webhook_url: req.url,
            webhook_path: url.pathname,
            event_from_path: eventFromPath,
            actual_event: actualEvent
          }
        }),
      });

      console.log('✅ Resposta do N8N:', {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        ok: n8nResponse.ok
      });

      // Log da resposta do N8N para debug
      const n8nResponseText = await n8nResponse.text();
      console.log('📝 Conteúdo da resposta N8N:', n8nResponseText);

      if (n8nResponse.ok) {
        return new Response(JSON.stringify({
          success: true,
          message: 'Webhook processado com sucesso pelo N8N',
          n8nStatus: n8nResponse.status,
          eventType: actualEvent,
          eventFromPath: eventFromPath
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        console.error('❌ Erro na resposta do N8N:', n8nResponse.status, n8nResponse.statusText);
        return new Response(JSON.stringify({
          success: false,
          error: `N8N retornou erro: ${n8nResponse.status} - ${n8nResponse.statusText}`,
          n8nResponse: n8nResponseText
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

    } catch (n8nError) {
      console.error('❌ Erro ao conectar com N8N:', n8nError);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Erro de conexão com N8N',
        details: n8nError.message,
        n8nUrl: n8nWebhookUrl
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ Erro geral no webhook proxy:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Erro no processamento do webhook',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
