
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
    
    console.log('Webhook recebido:', JSON.stringify(webhookData, null, 2));

    // Verificar se é evento de mensagem
    const isMessageEvent = webhookData.event === 'MESSAGES_UPSERT' || 
                          webhookData.type === 'MESSAGE_RECEIVED' ||
                          webhookData.type === 'MESSAGE_SENT';

    if (isMessageEvent) {
      // Redirecionar para N8N para processamento de mensagens
      const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
      
      if (!n8nWebhookUrl) {
        console.error('N8N_WEBHOOK_URL não configurada');
        return new Response(JSON.stringify({
          success: false,
          error: 'N8N webhook URL não configurada'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Redirecionando mensagem para N8N:', n8nWebhookUrl);

      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });

        console.log('Resposta do N8N:', n8nResponse.status, n8nResponse.statusText);

        // Log da resposta do N8N para debug
        const n8nResult = await n8nResponse.text();
        console.log('Conteúdo da resposta N8N:', n8nResult);

        return new Response(JSON.stringify({
          success: true,
          message: 'Evento de mensagem processado pelo N8N',
          n8nStatus: n8nResponse.status
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (n8nError) {
        console.error('Erro ao enviar para N8N:', n8nError);
        
        return new Response(JSON.stringify({
          success: false,
          error: 'Erro ao processar mensagem no N8N',
          details: n8nError.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

    } else {
      // Para outros eventos (CONNECTION_UPDATE, QRCODE_UPDATED, etc), processar localmente
      console.log('Processando evento de sistema localmente:', webhookData.event || webhookData.type);

      // Aqui você pode processar eventos de conexão, QR code, etc.
      // Por exemplo, atualizar status da instância no banco quando há CONNECTION_UPDATE

      return new Response(JSON.stringify({
        success: true,
        message: 'Evento de sistema processado',
        event: webhookData.event || webhookData.type
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Erro no webhook proxy:', error);
    
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
