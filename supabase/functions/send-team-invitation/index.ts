
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  permissions: Record<string, any>;
  tenant_id: string;
  invited_by_user_id: string;
  company_name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const requestData = await req.json();
    console.log("Dados recebidos:", JSON.stringify(requestData, null, 2));

    const {
      email,
      full_name,
      phone,
      role,
      permissions,
      tenant_id,
      invited_by_user_id,
      company_name
    }: InvitationRequest = requestData;

    console.log("Processando convite para:", email);

    // Verificar se já existe um convite pendente
    const { data: existingInvitation, error: checkError } = await supabaseClient
      .from('user_invitations')
      .select('id, status')
      .eq('email', email)
      .eq('tenant_id', tenant_id)
      .eq('status', 'pending')
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar convite existente:", checkError);
      throw new Error(`Erro ao verificar convite: ${checkError.message}`);
    }

    if (existingInvitation) {
      console.log("Convite pendente já existe para:", email);
      return new Response(
        JSON.stringify({ 
          error: "Já existe um convite pendente para este email" 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Criar o convite na tabela
    const { data: invitation, error: invitationError } = await supabaseClient
      .from('user_invitations')
      .insert({
        email,
        full_name,
        phone,
        role,
        permissions,
        tenant_id,
        invited_by_user_id,
        status: 'pending'
      })
      .select()
      .single();

    if (invitationError) {
      console.error("Erro ao criar convite:", invitationError);
      throw new Error(`Erro ao criar convite: ${invitationError.message}`);
    }

    console.log("Convite criado com sucesso:", invitation.id);

    // Criar magic link para o usuário
    const redirectUrl = `${req.headers.get('origin')}/accept-invitation?invitation_id=${invitation.id}`;
    
    console.log("Gerando magic link para:", email);
    console.log("Redirect URL:", redirectUrl);

    const { data: magicLinkData, error: magicLinkError } = await supabaseClient.auth.admin
      .generateLink({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: redirectUrl,
          data: {
            invitation_id: invitation.id,
            full_name: full_name
          }
        }
      });

    if (magicLinkError) {
      console.error("Erro ao gerar magic link:", magicLinkError);
      // Não falhar se o magic link não for gerado, pois o convite já foi criado
      console.log("Convite criado mas magic link falhou. Usuário pode aceitar manualmente.");
    } else {
      console.log("Magic link gerado com sucesso");
    }

    // Buscar dados da empresa para logs
    const { data: invitedBy } = await supabaseClient
      .from('users')
      .select('full_name')
      .eq('id', invited_by_user_id)
      .maybeSingle();

    const { data: tenant } = await supabaseClient
      .from('tenants')
      .select('business_name, name')
      .eq('id', tenant_id)
      .maybeSingle();

    const companyDisplayName = tenant?.business_name || tenant?.name || company_name || "Oficina";
    const inviterName = invitedBy?.full_name || "Equipe";

    console.log(`Convite processado com sucesso para ${email} da empresa ${companyDisplayName} por ${inviterName}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        invitation_id: invitation.id,
        message: "Convite enviado com sucesso"
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error("Erro na função de convite:", error);
    console.error("Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro interno do servidor",
        details: error.stack || "Sem detalhes disponíveis"
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
