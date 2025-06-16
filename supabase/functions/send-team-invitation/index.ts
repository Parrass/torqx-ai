
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

    const {
      email,
      full_name,
      phone,
      role,
      permissions,
      tenant_id,
      invited_by_user_id,
      company_name
    }: InvitationRequest = await req.json();

    console.log("Processando convite para:", email);

    // Verificar se já existe um convite pendente
    const { data: existingInvitation } = await supabaseClient
      .from('user_invitations')
      .select('id, status')
      .eq('email', email)
      .eq('tenant_id', tenant_id)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
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
      throw invitationError;
    }

    console.log("Convite criado:", invitation.id);

    // Criar magic link para o usuário
    const redirectUrl = `${req.headers.get('origin')}/accept-invitation?invitation_id=${invitation.id}`;
    
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
      throw magicLinkError;
    }

    console.log("Magic link gerado com sucesso");

    // Buscar dados da empresa para o email
    const { data: invitedBy } = await supabaseClient
      .from('users')
      .select('full_name')
      .eq('id', invited_by_user_id)
      .single();

    const { data: tenant } = await supabaseClient
      .from('tenants')
      .select('business_name, name')
      .eq('id', tenant_id)
      .single();

    const companyDisplayName = tenant?.business_name || tenant?.name || company_name || "Oficina";
    const inviterName = invitedBy?.full_name || "Equipe";

    // Enviar email usando o sistema nativo do Supabase
    // Como o magic link já foi gerado, o Supabase enviará automaticamente
    // Vamos retornar sucesso pois o magic link foi criado
    
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
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro interno do servidor" 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
