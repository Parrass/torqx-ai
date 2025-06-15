
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

  // Função simplificada para obter tenant ID
  const getTenantId = useCallback(async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Erro de autenticação:', userError);
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Usuário autenticado:', user.id, user.email);
      
      // Buscar tenant_id do usuário
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (userProfile?.tenant_id) {
        console.log('Tenant ID encontrado:', userProfile.tenant_id);
        return userProfile.tenant_id;
      }
      
      console.log('Criando tenant para o usuário');
      const { data: newTenant, error: createError } = await supabase
        .from('tenants')
        .insert({
          name: user.email?.split('@')[0] || 'Oficina',
          business_name: user.email?.split('@')[0] || 'Oficina',
          email: user.email,
          document_number: '00000000000',
          status: 'active'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Erro ao criar tenant:', createError);
        throw new Error('Não foi possível criar tenant');
      }
      
      // Atualizar o usuário com o tenant_id
      await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
          role: 'owner',
          tenant_id: newTenant.id
        });
      
      console.log('Tenant criado:', newTenant.id);
      return newTenant.id;
      
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
          description: 'Instância WhatsApp criada com sucesso.',
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
          description: 'QR Code gerado com sucesso.',
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
