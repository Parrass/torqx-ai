
interface WhatsAppApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

interface CreateInstanceData {
  instanceName: string;
  token?: string;
  integration?: string;
  qrcode?: boolean;
}

interface WebhookConfig {
  enabled: boolean;
  url: string;
  webhookByEvents: boolean;
  webhookBase64: boolean;
  events: string[];
}

interface InstanceSettings {
  rejectCall?: boolean;
  msgCall?: string;
  groupsIgnore?: boolean;
  alwaysOnline?: boolean;
  readMessages?: boolean;
  readStatus?: boolean;
  syncFullHistory?: boolean;
}

interface InstanceInfo {
  instanceName: string;
  instanceId: string;
  status: string;
  serverUrl?: string;
  apikey?: string;
  owner?: string;
}

class WhatsAppApi {
  private baseUrl: string;
  private projectId = 'bszcwxrjhvbvixrdnzvf';

  constructor() {
    this.baseUrl = `https://${this.projectId}.supabase.co/functions/v1`;
  }

  private async getAuthToken(): Promise<string> {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    
    return session.access_token;
  }

  private async makeRequest<T>(
    endpoint: string, 
    data: any = {}
  ): Promise<WhatsAppApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('WhatsApp API Request Error:', error);
      throw error;
    }
  }

  // 1. Testar conexão com Evolution API
  async testConnection(): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'test_connection',
    });
  }

  // 2. Criar instância para cliente
  async createInstance(data: CreateInstanceData): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'create_instance',
      instanceName: data.instanceName,
      token: data.token || this.generateToken(),
      integration: data.integration || 'WHATSAPP-BAILEYS',
      qrcode: data.qrcode !== false,
    });
  }

  // 3. Configurar webhook
  async setWebhook(instanceName: string, webhookConfig: WebhookConfig): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'set_webhook',
      instanceName,
      ...webhookConfig,
    });
  }

  // 4. Configurar settings da instância
  async setSettings(instanceName: string, settings: InstanceSettings): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'set_settings',
      instanceName,
      settings,
    });
  }

  // 5. Buscar instâncias existentes
  async findInstances(): Promise<WhatsAppApiResponse<InstanceInfo[]>> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'find_instances',
    });
  }

  // Conectar instância
  async connectInstance(instanceName: string): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'connect_instance',
      instanceName,
    });
  }

  // Desconectar instância
  async logoutInstance(instanceName: string): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'logout_instance',
      instanceName,
    });
  }

  // Reiniciar instância
  async restartInstance(instanceName: string): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'restart_instance',
      instanceName,
    });
  }

  // Obter QR Code
  async getQRCode(instanceName: string): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'get_qr_code',
      instanceName,
    });
  }

  // Status da instância
  async getInstanceStatus(instanceName: string): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'get_instance_status',
      instanceName,
    });
  }

  // Setup completo para cliente (criar + configurar webhook + settings)
  async setupClientInstance(
    clientId: string, 
    webhookUrl: string,
    settings?: InstanceSettings
  ): Promise<WhatsAppApiResponse> {
    const instanceName = `cliente-${clientId}`;
    
    try {
      // 1. Criar instância
      const createResult = await this.createInstance({ instanceName });
      if (!createResult.success) {
        throw new Error(createResult.error);
      }

      // 2. Configurar webhook
      const webhookConfig: WebhookConfig = {
        enabled: true,
        url: webhookUrl,
        webhookByEvents: true,
        webhookBase64: true,
        events: [
          'APPLICATION_STARTUP',
          'MESSAGE_RECEIVED', 
          'MESSAGE_SENT',
          'CONNECTION_UPDATE',
          'QRCODE_UPDATED'
        ]
      };

      const webhookResult = await this.setWebhook(instanceName, webhookConfig);
      if (!webhookResult.success) {
        console.warn('Falha ao configurar webhook:', webhookResult.error);
      }

      // 3. Configurar settings
      const defaultSettings: InstanceSettings = {
        rejectCall: true,
        msgCall: 'Chamadas não são aceitas. Entre em contato via mensagem.',
        groupsIgnore: true,
        alwaysOnline: true,
        readMessages: true,
        readStatus: true,
        syncFullHistory: false,
        ...settings
      };

      const settingsResult = await this.setSettings(instanceName, defaultSettings);
      if (!settingsResult.success) {
        console.warn('Falha ao configurar settings:', settingsResult.error);
      }

      return {
        success: true,
        data: {
          instanceName,
          instanceId: createResult.data?.instance?.instanceId,
          webhook: webhookResult.data,
          settings: settingsResult.data
        }
      };

    } catch (error) {
      console.error('Erro no setup da instância:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Função utilitária para gerar token único
  private generateToken(): string {
    return `torqx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // IA Chat (manter compatibilidade)
  async sendAIMessage(message: string, customerPhone: string, instanceName: string = 'torqx-instance'): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-ai-chat', {
      message,
      customerPhone,
      instanceName,
    });
  }
}

export const whatsappApi = new WhatsAppApi();
export type { 
  CreateInstanceData, 
  WebhookConfig, 
  InstanceSettings, 
  InstanceInfo,
  WhatsAppApiResponse 
};
