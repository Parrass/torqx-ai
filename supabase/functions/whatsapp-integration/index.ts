
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

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      throw new Error('Usuário não autenticado');
    }

    console.log('Usuário autenticado:', user.id);

    // Verificar credenciais da Evolution API
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');

    console.log('Verificando credenciais Evolution API:', {
      url: evolutionApiUrl ? 'Configurada' : 'NÃO CONFIGURADA',
      key: evolutionApiKey ? 'Configurada' : 'NÃO CONFIGURADA'
    });

    if (!evolutionApiUrl || !evolutionApiKey) {
      throw new Error('Credenciais da Evolution API não configuradas. Configure EVOLUTION_API_URL e EVOLUTION_API_KEY nos secrets do Supabase.');
    }

    const requestBody = await req.json();
    const { action, tenantId, instanceName, ...data } = requestBody;

    console.log(`Executando ação: ${action}`, { tenantId, instanceName, bodyData: data });

    let response;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': evolutionApiKey,
    };

    switch (action) {
      case 'create_instance':
        console.log('Criando instância com dados:', data);
        
        if (!data.instanceName || !tenantId) {
          throw new Error('instanceName e tenantId são obrigatórios');
        }
        
        // Payload correto para Evolution API
        const instancePayload = {
          instanceName: data.instanceName,
          token: data.token,
          integration: 'WHATSAPP-BAILEYS',
          qrcode: true,
          rejectCall: true,
          msgCall: 'Chamadas não são aceitas. Entre em contato via mensagem.',
          groupsIgnore: true,
          alwaysOnline: true,
          readMessages: true,
          readStatus: true,
          syncFullHistory: false,
          webhook: data.webhook || {
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

        console.log('Payload para Evolution API:', JSON.stringify(instancePayload, null, 2));
        
        try {
          response = await fetch(`${evolutionApiUrl}/instance/create`, {
            method: 'POST',
            headers,
            body: JSON.stringify(instancePayload),
          });

          const instanceResult = await response.json();
          console.log('Resposta da Evolution API:', { 
            status: response.status, 
            ok: response.ok,
            result: instanceResult 
          });
          
          if (response.ok && instanceResult) {
            // Salvar instância no banco
            const { data: dbInstance, error: dbError } = await supabaseClient
              .from('whatsapp_instances')
              .insert({
                tenant_id: tenantId,
                instance_name: data.instanceName,
                instance_id: instanceResult.instance?.instanceId || data.instanceName,
                status: instanceResult.instance?.status || 'created',
                token: data.token,
                webhook_url: instancePayload.webhook.url,
                settings: {
                  rejectCall: instancePayload.rejectCall,
                  msgCall: instancePayload.msgCall,
                  groupsIgnore: instancePayload.groupsIgnore,
                  alwaysOnline: instancePayload.alwaysOnline,
                  readMessages: instancePayload.readMessages,
                  readStatus: instancePayload.readStatus,
                  syncFullHistory: instancePayload.syncFullHistory,
                }
              })
              .select()
              .single();

            if (dbError) {
              console.error('Erro ao salvar no banco:', dbError);
              throw new Error(`Erro ao salvar instância no banco: ${dbError.message}`);
            }

            console.log('Instância salva no banco:', dbInstance);

            return new Response(JSON.stringify({
              success: true,
              data: dbInstance,
              evolutionResponse: instanceResult,
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } else {
            throw new Error(instanceResult?.message || `Erro da Evolution API: ${response.status}`);
          }
        } catch (fetchError) {
          console.error('Erro na requisição para Evolution API:', fetchError);
          throw new Error(`Erro de comunicação com Evolution API: ${fetchError.message}`);
        }

      case 'get_qr_code':
        console.log(`Obtendo QR code para instância: ${instanceName}`);
        try {
          response = await fetch(`${evolutionApiUrl}/instance/connect/${instanceName}`, {
            method: 'GET',
            headers,
          });
        } catch (fetchError) {
          throw new Error(`Erro ao obter QR code: ${fetchError.message}`);
        }
        break;

      case 'get_instance_status':
        console.log(`Obtendo status da instância: ${instanceName}`);
        try {
          response = await fetch(`${evolutionApiUrl}/instance/connectionState/${instanceName}`, {
            method: 'GET',
            headers,
          });
        } catch (fetchError) {
          throw new Error(`Erro ao obter status: ${fetchError.message}`);
        }
        break;

      case 'logout_instance':
        console.log(`Desconectando instância: ${instanceName}`);
        try {
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
        } catch (fetchError) {
          throw new Error(`Erro ao desconectar: ${fetchError.message}`);
        }
        break;

      case 'get_instance_by_tenant':
        console.log(`Buscando instância para tenant: ${tenantId}`);
        const { data: instance, error: instanceError } = await supabaseClient
          .from('whatsapp_instances')
          .select('*')
          .eq('tenant_id', tenantId)
          .maybeSingle();

        if (instanceError && instanceError.code !== 'PGRST116') {
          console.error('Erro ao buscar instância no banco:', instanceError);
          throw new Error(`Erro ao buscar instância: ${instanceError.message}`);
        }

        return new Response(JSON.stringify({
          success: true,
          data: instance,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    // Processar resposta da Evolution API
    if (response) {
      const result = await response.json();

      console.log(`Resposta da Evolution API para ${action}:`, {
        status: response.status,
        ok: response.ok,
        data: result
      });

      return new Response(JSON.stringify({
        success: response.ok,
        data: result,
        status: response.status,
        error: !response.ok ? result.message || result.error || `Erro da Evolution API: ${response.status}` : undefined,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Nenhuma resposta gerada para a ação solicitada');

  } catch (error) {
    console.error('Erro na integração WhatsApp:', error);
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
