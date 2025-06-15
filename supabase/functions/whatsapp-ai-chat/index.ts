
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

    const { message, customerPhone, instanceName = 'torqx-instance' } = await req.json();

    // Buscar contexto do cliente e veículo
    const { data: customer } = await supabaseClient
      .from('customers')
      .select(`
        *,
        vehicles (*)
      `)
      .eq('phone', customerPhone)
      .single();

    // Construir prompt contextual
    const systemPrompt = `Você é um assistente IA da oficina automotiva Torqx. 
    
Contexto do cliente:
${customer ? `
- Nome: ${customer.name}
- Telefone: ${customer.phone}
- Veículos: ${customer.vehicles?.map(v => `${v.brand} ${v.model} ${v.year}`).join(', ') || 'Nenhum'}
- Histórico: ${customer.total_orders} ordens de serviço anteriores
` : 'Cliente novo (sem histórico)'}

Suas responsabilidades:
- Atender consultas sobre serviços automotivos
- Agendar serviços (confirme horário disponível)
- Dar suporte sobre manutenção preventiva
- Esclarecer dúvidas sobre orçamentos
- Ser cordial e profissional

Responda de forma clara e objetiva. Se precisar agendar algo, peça confirmação.`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Chamar OpenAI para gerar resposta
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const aiData = await openAIResponse.json();
    const aiResponse = aiData.choices[0].message.content;

    // Registrar interação IA
    await supabaseClient.from('ai_interactions').insert({
      tenant_id: user.user_metadata.tenant_id,
      user_id: user.id,
      customer_id: customer?.id,
      interaction_type: 'whatsapp_chat',
      input_data: { message, customerPhone },
      output_data: { response: aiResponse },
      model_used: 'gpt-4o-mini',
      confidence_score: 0.95,
    });

    return new Response(JSON.stringify({
      success: true,
      data: {
        response: aiResponse,
        customerContext: customer ? {
          name: customer.name,
          hasHistory: customer.total_orders > 0,
          vehicleCount: customer.vehicles?.length || 0,
        } : null,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('WhatsApp AI Chat Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
