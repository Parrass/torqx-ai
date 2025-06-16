
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Mail, Building, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InvitationDetails {
  id: string;
  email: string;
  full_name: string;
  role: string;
  company_name?: string;
  invited_by_name?: string;
  expires_at: string;
  status: string;
}

interface RpcResponse {
  success: boolean;
  error?: string;
  user_id?: string;
}

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const invitationId = searchParams.get('invitation_id');

  useEffect(() => {
    if (!invitationId) {
      setError('ID do convite não encontrado');
      setLoading(false);
      return;
    }

    loadInvitationDetails();
  }, [invitationId]);

  const loadInvitationDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_invitations_with_details')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (error) throw error;

      if (!data) {
        setError('Convite não encontrado');
        return;
      }

      if (data.status !== 'pending') {
        setError('Este convite já foi processado');
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setError('Este convite expirou');
        return;
      }

      setInvitation(data);
    } catch (err: any) {
      console.error('Erro ao carregar convite:', err);
      setError('Erro ao carregar detalhes do convite');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    try {
      setAccepting(true);

      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Se não estiver autenticado, redirecionar para login
        toast({
          title: 'Autenticação necessária',
          description: 'Você precisa estar logado para aceitar o convite',
        });
        navigate('/login');
        return;
      }

      // Verificar se o email do usuário logado corresponde ao do convite
      if (user.email !== invitation.email) {
        toast({
          title: 'Erro',
          description: 'O email da sua conta não corresponde ao convite',
          variant: 'destructive',
        });
        return;
      }

      // Chamar função para aceitar convite
      const { data, error } = await supabase.rpc('accept_user_invitation', {
        invitation_id: invitationId
      });

      if (error) throw error;

      // Cast the response to the expected type
      const response = data as RpcResponse;

      if (!response.success) {
        throw new Error(response.error || 'Erro ao aceitar convite');
      }

      setSuccess(true);
      toast({
        title: 'Sucesso!',
        description: 'Convite aceito com sucesso! Redirecionando...',
      });

      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error('Erro ao aceitar convite:', err);
      toast({
        title: 'Erro',
        description: err.message || 'Erro ao aceitar convite',
        variant: 'destructive',
      });
    } finally {
      setAccepting(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'manager': 'Gerente',
      'technician': 'Técnico',
      'admin': 'Administrador',
      'receptionist': 'Recepcionista'
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-torqx-secondary" />
            <p className="text-gray-600">Carregando detalhes do convite...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Erro no Convite</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/login')} variant="outline">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Convite Aceito!</h2>
            <p className="text-gray-600 mb-6">
              Bem-vindo à equipe! Você será redirecionado para o dashboard.
            </p>
            <div className="animate-pulse text-sm text-gray-500">
              Redirecionando...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Convite não encontrado</h2>
            <p className="text-gray-600 mb-6">
              O convite pode ter expirado ou já foi processado.
            </p>
            <Button onClick={() => navigate('/login')} variant="outline">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-torqx-secondary to-torqx-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-torqx-primary font-satoshi">
            Convite para Equipe
          </CardTitle>
          <p className="text-gray-600">
            Você foi convidado para fazer parte da equipe!
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Detalhes da Empresa</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Empresa:</span>
                  <span className="ml-2 font-medium">{invitation.company_name || 'Oficina'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Convidado por:</span>
                  <span className="ml-2 font-medium">{invitation.invited_by_name || 'Administrador'}</span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <User className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Seus Dados</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Nome:</span>
                  <span className="ml-2 font-medium">{invitation.full_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{invitation.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Cargo:</span>
                  <span className="ml-2 font-medium">{getRoleLabel(invitation.role)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Expira em:</span>
                  <span className="ml-2 font-medium">
                    {new Date(invitation.expires_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Importante:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Ao aceitar este convite, você terá acesso à plataforma Torqx</li>
                <li>• Suas permissões serão configuradas conforme seu cargo</li>
                <li>• Você poderá gerenciar clientes, veículos e ordens de serviço</li>
                <li>• Para aceitar o convite, você precisa estar logado com a conta: {invitation.email}</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
              >
                Ir para Login
              </Button>
              <Button
                onClick={handleAcceptInvitation}
                disabled={accepting}
                className="bg-torqx-secondary hover:bg-torqx-secondary-dark text-white"
              >
                {accepting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Aceitando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aceitar Convite
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
