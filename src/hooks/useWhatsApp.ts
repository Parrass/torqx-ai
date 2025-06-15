
import { useState, useCallback } from 'react';
import { whatsappApi, type WhatsAppApiResponse } from '@/services/whatsappApi';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppConnection {
  isConnected: boolean;
  qrCode?: string;
  instanceName: string;
  status?: string;
}

export const useWhatsApp = () => {
  const [connection, setConnection] = useState<WhatsAppConnection>({
    isConnected: false,
    instanceName: 'torqx-instance',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createInstance = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await whatsappApi.createInstance(connection.instanceName);
      
      if (response.success) {
        toast({
          title: 'Instância criada',
          description: 'WhatsApp instance criada com sucesso',
        });
        
        // Buscar QR Code
        await getQRCode();
      } else {
        throw new Error(response.error || 'Erro ao criar instância');
      }
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar instância WhatsApp',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [connection.instanceName]);

  const getQRCode = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await whatsappApi.getQRCode(connection.instanceName);
      
      if (response.success && response.data) {
        setConnection(prev => ({
          ...prev,
          qrCode: response.data.qrcode || response.data.base64,
        }));
      }
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao obter QR Code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [connection.instanceName]);

  const checkStatus = useCallback(async () => {
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
    setIsLoading(true);
    try {
      const response = await whatsappApi.logoutInstance(connection.instanceName);
      
      if (response.success) {
        setConnection(prev => ({
          ...prev,
          isConnected: false,
          qrCode: undefined,
          status: 'close',
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
  }, [connection.instanceName]);

  const sendMessage = useCallback(async (number: string, message: string) => {
    try {
      const response = await whatsappApi.sendMessage({ number, message }, connection.instanceName);
      
      if (response.success) {
        toast({
          title: 'Mensagem enviada',
          description: 'Mensagem enviada com sucesso',
        });
        return true;
      } else {
        throw new Error(response.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar mensagem',
        variant: 'destructive',
      });
      return false;
    }
  }, [connection.instanceName]);

  const sendAIMessage = useCallback(async (message: string, customerPhone: string) => {
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
  }, [connection.instanceName]);

  return {
    connection,
    isLoading,
    createInstance,
    getQRCode,
    checkStatus,
    disconnect,
    sendMessage,
    sendAIMessage,
  };
};
