import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para validar e formatar URL da Evolution API
function formatEvolutionApiUrl(url: string): string {
  if (!url) {
    throw new Error('EVOLUTION_API_URL não configurada');
  }
  
  // Se não tem protocolo, adiciona https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  
  // Remove barra final se houver
  return url.replace(/\/$/, '');
}

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

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Usuário não autenticado',
        details: authError?.message
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Usuário autenticado:', user.id);

    // Verificar credenciais da Evolution API
    const rawEvolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');

    console.log('Verificando credenciais Evolution API:', {
      url: rawEvolutionApiUrl ? 'OK' : 'FALTANDO',
      key: evolutionApiKey ? 'OK' : 'FALTANDO',
      webhook: n8nWebhookUrl ? 'OK' : 'FALTANDO'
    });

    if (!rawEvolutionApiUrl || !evolutionApiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Credenciais da Evolution API não configuradas',
        details: 'Configure EVOLUTION_API_URL e EVOLUTION_API_KEY nos secrets do Supabase'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Formatar URL da Evolution API
    const evolutionApiUrl = formatEvolutionApiUrl(rawEvolutionApiUrl);
    console.log('URL Evolution formatada:', evolutionApiUrl);

    const requestBody = await req.json();
    const { action, tenantId, instanceName, ...data } = requestBody;

    console.log(`=== AÇÃO: ${action} ===`, { tenantId, instanceName, data });

    let response;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': evolutionApiKey,
    };

    switch (action) {
      case 'create_instance':
        console.log('=== CRIANDO INSTÂNCIA ===');
        
        if (!tenantId) {
          throw new Error('tenantId é obrigatório para criar instância');
        }
        
        // Gerar nome da instância se não fornecido
        const finalInstanceName = instanceName || `torqx_${tenantId.substring(0, 8)}`;
        
        // Payload seguindo exatamente a API da Evolution
        const instancePayload = {
          instanceName: finalInstanceName,
          token: data.token || `torqx_${Date.now()}`,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
          rejectCall: true,
          msgCall: 'Chamadas não são aceitas. Entre em contato via mensagem.',
          groupsIgnore: true,
          alwaysOnline: true,
          readMessages: true,
          readStatus: true,
          syncFullHistory: false,
          webhook: {
            url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
            byEvents: true,
            base64: true,
            events: [
              'APPLICATION_STARTUP',
              'MESSAGE_RECEIVED', 
              'MESSAGE_SENT',
              'CONNECTION_UPDATE',
              'QRCODE_UPDATED'
            ]
          }
        };

        console.log('Payload Evolution:', JSON.stringify(instancePayload, null, 2));
        console.log('URL de criação:', `${evolutionApiUrl}/instance/create`);
        
        try {
          response = await fetch(`${evolutionApiUrl}/instance/create`, {
            method: 'POST',
            headers,
            body: JSON.stringify(instancePayload),
          });

          const instanceResult = await response.json();
          console.log('Resposta Evolution:', { 
            status: response.status, 
            ok: response.ok,
            result: instanceResult 
          });
          
          if (response.ok) {
            // Salvar instância no banco
            const { data: dbInstance, error: dbError } = await supabaseClient
              .from('whatsapp_instances')
              .insert({
                tenant_id: tenantId,
                instance_name: finalInstanceName,
                instance_id: instanceResult.instance?.instanceId || finalInstanceName,
                status: instanceResult.instance?.status || 'created',
                token: instancePayload.token,
                webhook_url: instancePayload.webhook.url,
                settings: instancePayload,
                is_connected: false
              })
              .select()
              .single();

            if (dbError) {
              console.error('Erro ao salvar no banco:', dbError);
              throw new Error(`Erro ao salvar instância: ${dbError.message}`);
            }

            console.log('Instância salva com sucesso:', dbInstance);

            return new Response(JSON.stringify({
              success: true,
              data: dbInstance
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } else {
            throw new Error(instanceResult?.message || `Erro Evolution API: ${response.status}`);
          }
        } catch (fetchError) {
          console.error('Erro na requisição Evolution:', fetchError);
          throw new Error(`Erro de comunicação com Evolution API: ${fetchError.message}`);
        }

      case 'get_qr_code':
        console.log(`=== QR CODE para ${instanceName} ===`);
        
        if (!instanceName) {
          throw new Error('instanceName é obrigatório para gerar QR code');
        }
        
        try {
          response = await fetch(`${evolutionApiUrl}/instance/connect/${instanceName}`, {
            method: 'GET',
            headers,
          });

          if (response.ok) {
            const qrResult = await response.json();
            console.log('QR Code obtido:', qrResult);
            
            // Atualizar instância no banco com QR code
            if (qrResult.code || qrResult.qrcode || qrResult.base64) {
              await supabaseClient
                .from('whatsapp_instances')
                .update({ 
                  qr_code: qrResult.code || qrResult.qrcode || qrResult.base64,
                  pairing_code: qrResult.pairingCode 
                })
                .eq('instance_name', instanceName);
            }
            
            return new Response(JSON.stringify({
              success: true,
              data: qrResult
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } else {
            const errorResult = await response.json();
            throw new Error(errorResult?.message || `Erro ao gerar QR code: ${response.status}`);
          }
        } catch (fetchError) {
          throw new Error(`Erro ao obter QR code: ${fetchError.message}`);
        }

      case 'get_instance_status':
        console.log(`=== STATUS da ${instanceName} ===`);
        
        if (!instanceName) {
          throw new Error('instanceName é obrigatório para verificar status');
        }
        
        try {
          response = await fetch(`${evolutionApiUrl}/instance/connectionState/${instanceName}`, {
            method: 'GET',
            headers,
          });

          if (response.ok) {
            const statusResult = await response.json();
            console.log('Status obtido:', statusResult);
            
            // Atualizar status no banco
            const isConnected = statusResult.instance?.state === 'open';
            await supabaseClient
              .from('whatsapp_instances')
              .update({ 
                is_connected: isConnected,
                status: statusResult.instance?.state || 'unknown',
                last_connected_at: isConnected ? new Date().toISOString() : null
              })
              .eq('instance_name', instanceName);
            
            return new Response(JSON.stringify({
              success: true,
              data: statusResult
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } else {
            const errorResult = await response.json();
            throw new Error(errorResult?.message || `Erro ao obter status: ${response.status}`);
          }
        } catch (fetchError) {
          throw new Error(`Erro ao obter status: ${fetchError.message}`);
        }

      case 'fetch_instance':
        console.log(`=== BUSCAR DADOS da ${instanceName} ===`);
        
        if (!instanceName) {
          throw new Error('instanceName é obrigatório para buscar dados da instância');
        }
        
        try {
          response = await fetch(`${evolutionApiUrl}/instance/fetchInstances?instanceName=${instanceName}`, {
            method: 'GET',
            headers,
          });

          if (response.ok) {
            const fetchResult = await response.json();
            console.log('Dados da instância obtidos:', fetchResult);
            
            // Se retornou dados, atualizar no banco
            if (fetchResult && fetchResult.length > 0) {
              const instanceData = fetchResult[0];
              const isConnected = instanceData.instance?.state === 'open';
              
              await supabaseClient
                .from('whatsapp_instances')
                .update({ 
                  is_connected: isConnected,
                  status: instanceData.instance?.state || 'unknown',
                  last_connected_at: isConnected ? new Date().toISOString() : null
                })
                .eq('instance_name', instanceName);
            }
            
            return new Response(JSON.stringify({
              success: true,
              data: fetchResult && fetchResult.length > 0 ? fetchResult[0] : null
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } else {
            const errorResult = await response.json();
            throw new Error(errorResult?.message || `Erro ao buscar dados da instância: ${response.status}`);
          }
        } catch (fetchError) {
          throw new Error(`Erro ao buscar dados da instância: ${fetchError.message}`);
        }

      case 'set_webhook':
        console.log(`=== CONFIGURAR WEBHOOK da ${instanceName} ===`);
        
        if (!instanceName) {
          throw new Error('instanceName é obrigatório para configurar webhook');
        }

        if (!n8nWebhookUrl) {
          throw new Error('N8N_WEBHOOK_URL não configurada nos secrets do Supabase');
        }
        
        try {
          const webhookPayload = {
            enabled: true,
            url: n8nWebhookUrl,
            webhookByEvents: true,
            webhookBase64: true,
            events: [
              'MESSAGES_UPSERT'
            ]
          };

          console.log('Configurando webhook:', webhookPayload);

          response = await fetch(`${evolutionApiUrl}/webhook/set/${instanceName}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(webhookPayload),
          });

          if (response.ok) {
            const webhookResult = await response.json();
            console.log('Webhook configurado:', webhookResult);
            
            // Atualizar instância no banco com URL do webhook
            await supabaseClient
              .from('whatsapp_instances')
              .update({ 
                webhook_url: n8nWebhookUrl,
                updated_at: new Date().toISOString()
              })
              .eq('instance_name', instanceName);
            
            return new Response(JSON.stringify({
              success: true,
              data: webhookResult
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } else {
            const errorResult = await response.json();
            throw new Error(errorResult?.message || `Erro ao configurar webhook: ${response.status}`);
          }
        } catch (fetchError) {
          throw new Error(`Erro ao configurar webhook: ${fetchError.message}`);
        }

      case 'logout_instance':
        console.log(`=== LOGOUT da ${instanceName} ===`);
        
        if (!instanceName) {
          throw new Error('instanceName é obrigatório para desconectar');
        }
        
        try {
          response = await fetch(`${evolutionApiUrl}/instance/logout/${instanceName}`, {
            method: 'DELETE',
            headers,
          });

          const logoutResult = response.ok ? await response.json() : { message: 'Logout realizado' };
          console.log('Logout resultado:', logoutResult);

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
          
          return new Response(JSON.stringify({
            success: true,
            data: logoutResult
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (fetchError) {
          throw new Error(`Erro ao desconectar: ${fetchError.message}`);
        }

      case 'get_instance_by_tenant':
        console.log(`=== BUSCAR INSTÂNCIA do tenant ${tenantId} ===`);
        
        if (!tenantId) {
          throw new Error('tenantId é obrigatório para buscar instância');
        }
        
        const { data: instance, error: instanceError } = await supabaseClient
          .from('whatsapp_instances')
          .select('*')
          .eq('tenant_id', tenantId)
          .maybeSingle();

        if (instanceError && instanceError.code !== 'PGRST116') {
          console.error('Erro ao buscar instância:', instanceError);
          throw new Error(`Erro ao buscar instância: ${instanceError.message}`);
        }

        console.log('Instância encontrada:', instance);

        return new Response(JSON.stringify({
          success: true,
          data: instance,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

  } catch (error) {
    console.error('ERRO GERAL na integração WhatsApp:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: error.stack,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
