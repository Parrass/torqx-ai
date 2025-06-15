
import { useState, useCallback } from 'react';
import { whatsappApi, type WhatsAppApiResponse, type WhatsAppInstance } from '@/services/whatsappApi';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppConnection {
  isConnected: boolean;
  qrCode?: string;
  pairingCode?: string;
  instanceName?: string;
  status?: string;
  instance?: WhatsAppInstance;
}

export const useWhatsApp = () => {
  const [connection, setConnection] = useState<WhatsAppConnection>({
    isConnected: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Obter tenant ID do usuário logado
  const getTenantId = useCallback(async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Usuário não autenticado');
    
    // Primeiro tentar obter diretamente do perfil do usuário
    const { data: profile } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single();
    
    if (profile?.tenant_id) {
      return profile.tenant_id;
    }
    
    // Se não encontrou, tentar usar a função do banco
    const { data: tenantData, error } = await supabase.rpc('get_current_user_tenant_id');
    
    if (error || !tenantData) {
      console.error('Erro ao obter tenant_id:', error);
      throw new Error('Tenant não encontrado. Verifique se o usuário está associado a uma oficina.');
    }
    
    return tenantData;
  }, []);

  // Criar instância WhatsApp
  const createInstance = useCallback(async () => {
    setIsLoading(true);
    try {
      const tenantId = await getTenantId();
      console.log('Criando instância para tenant:', tenantId);
      
      const response = await whatsappApi.createInstance(tenantId);
      
      if (response.success && response.data) {
        setConnection(prev => ({
          ...prev,
          instanceName: response.data.instance_name,
          instance: response.data,
          status: response.data.status,
        }));
        
        toast({
          title: 'Instância criada',
          description: 'Instância WhatsApp criada com sucesso. Agora você pode gerar o QR Code.',
        });
        
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao criar instância');
      }
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao criar instância WhatsApp',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getTenantId, toast]);

  // Gerar QR Code
  const generateQRCode = useCallback(async () => {
    if (!connection.instanceName) {
      toast({
        title: 'Erro',
        description: 'Nenhuma instância encontrada. Crie uma instância primeiro.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await whatsappApi.generateQRCode(connection.instanceName);
      
      if (response.success && response.data) {
        setConnection(prev => ({
          ...prev,
          qrCode: response.data.code || response.data.qrcode,
          pairingCode: response.data.pairingCode,
        }));
        
        toast({
          title: 'QR Code gerado',
          description: 'QR Code gerado com sucesso. Escaneie com seu WhatsApp.',
        });
      } else {
        throw new Error(response.error || 'Erro ao gerar QR Code');
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao gerar QR Code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [connection.instanceName, toast]);

  // Verificar status da instância
  const checkStatus = useCallback(async () => {
    if (!connection.instanceName) return false;

    try {
      const response = await whatsappApi.getInstanceStatus(connection.instanceName);
      
      if (response.success && response.data) {
        const isConnected = response.data.instance?.state === 'open';
        setConnection(prev => ({
          ...prev,
          isConnected,
          status: response.data.instance?.state,
        }));
        
        return isConnected;
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
    return false;
  }, [connection.instanceName]);

  // Desconectar instância
  const disconnect = useCallback(async () => {
    if (!connection.instanceName) return;

    setIsLoading(true);
    try {
      const response = await whatsappApi.logoutInstance(connection.instanceName);
      
      if (response.success) {
        setConnection(prev => ({
          ...prev,
          isConnected: false,
          qrCode: undefined,
          pairingCode: undefined,
          status: 'disconnected',
        }));
        
        toast({
          title: 'Desconectado',
          description: 'WhatsApp desconectado com sucesso',
        });
      }
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao desconectar WhatsApp',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [connection.instanceName, toast]);

  // Carregar instância existente
  const loadExistingInstance = useCallback(async () => {
    setIsLoading(true);
    try {
      const tenantId = await getTenantId();
      const response = await whatsappApi.getInstanceByTenant(tenantId);
      
      if (response.success && response.data) {
        setConnection(prev => ({
          ...prev,
          instanceName: response.data.instance_name,
          instance: response.data,
          status: response.data.status,
          isConnected: response.data.is_connected,
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar instância:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getTenantId]);

  const sendAIMessage = useCallback(async (message: string, customerPhone: string) => {
    if (!connection.instanceName) {
      toast({
        title: 'Erro',
        description: 'Nenhuma instância WhatsApp conectada',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const response = await whatsappApi.sendAIMessage(message, customerPhone, connection.instanceName);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Erro ao processar mensagem IA');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem IA:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao processar mensagem com IA',
        variant: 'destructive',
      });
      return null;
    }
  }, [connection.instanceName, toast]);

  return {
    connection,
    isLoading,
    createInstance,
    generateQRCode,
    checkStatus,
    disconnect,
    loadExistingInstance,
    sendAIMessage,
  };
};
