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

  // Função para obter tenant ID
  const getTenantId = useCallback(async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      console.log('Obtendo tenant ID...');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Erro de autenticação:', userError);
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Usuário autenticado:', user.id, user.email);
      
      const { data: tenantId, error: tenantError } = await supabase
        .rpc('get_or_create_tenant_for_user');
      
      if (tenantError) {
        console.error('Erro ao obter/criar tenant:', tenantError);
        throw new Error(`Erro ao configurar conta: ${tenantError.message}`);
      }
      
      if (!tenantId) {
        throw new Error('Não foi possível obter ID da oficina');
      }
      
      console.log('Tenant ID obtido:', tenantId);
      return tenantId;
      
    } catch (error) {
      console.error('Erro ao obter tenant ID:', error);
      throw error;
    }
  }, []);

  // Criar instância WhatsApp
  const createInstance = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Iniciando criação de instância...');
      const tenantId = await getTenantId();
      console.log('Tenant ID obtido:', tenantId);
      
      const response = await whatsappApi.createInstance(tenantId);
      console.log('Resposta da criação:', response);
      
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
        title: 'Erro ao criar instância',
        description: error instanceof Error ? error.message : 'Erro desconhecido ao criar instância WhatsApp',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getTenantId, toast]);

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
      console.log('Gerando QR Code para instância:', connection.instanceName);
      const response = await whatsappApi.generateQRCode(connection.instanceName);
      console.log('Resposta QR Code:', response);
      
      if (response.success && response.data) {
        const qrCodeData = response.data.code || response.data.qrcode || response.data.base64;
        
        setConnection(prev => ({
          ...prev,
          qrCode: qrCodeData,
          pairingCode: response.data.pairingCode,
        }));
        
        toast({
          title: 'QR Code gerado',
          description: 'QR Code gerado com sucesso. Escaneie com seu WhatsApp.',
        });

        console.log('QR Code salvo no estado:', {
          qrCode: qrCodeData ? 'Presente' : 'Ausente',
          pairingCode: response.data.pairingCode
        });

        // Iniciar verificação de status após gerar QR code
        startStatusPolling();
      } else {
        throw new Error(response.error || 'Erro ao gerar QR Code');
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast({
        title: 'Erro ao gerar QR Code',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [connection.instanceName, toast]);

  const checkStatus = useCallback(async () => {
    if (!connection.instanceName) return false;

    try {
      const response = await whatsappApi.getInstanceStatus(connection.instanceName);
      
      if (response.success && response.data) {
        const isConnected = response.data.instance?.state === 'open';
        const newStatus = response.data.instance?.state;
        
        setConnection(prev => ({
          ...prev,
          isConnected,
          status: newStatus,
        }));

        // Se conectou, limpar QR code e mostrar toast
        if (isConnected && !connection.isConnected) {
          setConnection(prev => ({
            ...prev,
            qrCode: undefined,
            pairingCode: undefined,
          }));
          
          toast({
            title: 'WhatsApp Conectado!',
            description: 'Sua instância WhatsApp foi conectada com sucesso.',
          });
        }
        
        return isConnected;
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
    return false;
  }, [connection.instanceName, connection.isConnected, toast]);

  const startStatusPolling = useCallback(() => {
    const pollInterval = setInterval(async () => {
      const isConnected = await checkStatus();
      
      // Se conectou, parar o polling
      if (isConnected) {
        clearInterval(pollInterval);
      }
    }, 3000); // Verificar a cada 3 segundos

    // Parar polling após 5 minutos para evitar requisições desnecessárias
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 300000); // 5 minutos
  }, [checkStatus]);

  const fetchInstanceData = useCallback(async () => {
    if (!connection.instanceName) return;

    setIsLoading(true);
    try {
      const response = await whatsappApi.fetchInstance(connection.instanceName);
      
      if (response.success && response.data) {
        const isConnected = response.data.instance?.state === 'open';
        
        setConnection(prev => ({
          ...prev,
          isConnected,
          status: response.data.instance?.state,
          instance: response.data,
        }));
        
        toast({
          title: 'Status atualizado',
          description: `Status da instância: ${response.data.instance?.state || 'desconhecido'}`,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados da instância:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [connection.instanceName, toast]);

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
        title: 'Erro ao desconectar',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [connection.instanceName, toast]);

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
          qrCode: response.data.qr_code,
          pairingCode: response.data.pairing_code,
        }));
        
        console.log('Instância existente carregada:', response.data);
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
        title: 'Erro na IA',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
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
    fetchInstanceData,
    disconnect,
    loadExistingInstance,
    sendAIMessage,
  };
};
