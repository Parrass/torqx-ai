
interface WhatsAppApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

interface CreateInstanceData {
  instanceName: string;
  token?: string;
  qrcode?: boolean;
  integration?: string;
  rejectCall?: boolean;
  msgCall?: string;
  groupsIgnore?: boolean;
  alwaysOnline?: boolean;
  readMessages?: boolean;
  readStatus?: boolean;
  syncFullHistory?: boolean;
  webhook?: {
    url: string;
    byEvents: boolean;
    base64: boolean;
    events: string[];
  };
}

interface WhatsAppSettings {
  rejectCall: boolean;
  msgCall: string;
  groupsIgnore: boolean;
  alwaysOnline: boolean;
  readMessages: boolean;
  readStatus: boolean;
  syncFullHistory: boolean;
}

interface WhatsAppInstance {
  id: string;
  tenant_id: string;
  instance_name: string;
  instance_id?: string;
  status: string;
  qr_code?: string;
  pairing_code?: string;
  token?: string;
  webhook_url?: string;
  settings: any;
  is_connected: boolean;
  last_connected_at?: string;
  created_at: string;
  updated_at: string;
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
      
      console.log('Fazendo requisição para:', `${this.baseUrl}${endpoint}`);
      console.log('Dados da requisição:', data);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      console.log('Resposta da API:', { status: response.status, result });
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('WhatsApp API Request Error:', error);
      throw error;
    }
  }

  // Criar instância para oficina - CORRIGIDO para apontar diretamente para N8N
  async createInstance(tenantId: string): Promise<WhatsAppApiResponse<WhatsAppInstance>> {
    const instanceName = `torqx_${tenantId.substring(0, 8)}`;
    const token = this.generateToken();
    
    console.log('Criando instância apontando DIRETAMENTE para N8N:', { instanceName, tenantId });
    
    return this.makeRequest('/whatsapp-integration', {
      action: 'create_instance',
      tenantId,
      instanceName,
      token,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
      rejectCall: true,
      msgCall: 'Chamadas não são aceitas. Entre em contato via mensagem.',
      groupsIgnore: true,
      alwaysOnline: true,
      readMessages: true,
      readStatus: true,
      syncFullHistory: false,
      webhook: {
        url: 'N8N_DIRECT', // FORÇA o uso direto do N8N
        byEvents: false, // IMPORTANTE: false para receber tudo numa URL só
        base64: true,
        events: [
          'APPLICATION_STARTUP',
          'MESSAGES_UPSERT'
        ]
      }
    });
  }

  // Gerar QR Code
  async generateQRCode(instanceName: string): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'get_qr_code',
      instanceName,
    });
  }

  // Buscar instância do tenant
  async getInstanceByTenant(tenantId: string): Promise<WhatsAppApiResponse<WhatsAppInstance>> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'get_instance_by_tenant',
      tenantId,
    });
  }

  // Status da instância
  async getInstanceStatus(instanceName: string): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'get_instance_status',
      instanceName,
    });
  }

  // Buscar dados completos da instância
  async fetchInstance(instanceName: string): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'fetch_instance',
      instanceName,
    });
  }

  // Configurar settings da instância
  async setInstanceSettings(instanceName: string, settings: WhatsAppSettings): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'set_instance_settings',
      instanceName,
      settings,
    });
  }

  // Buscar settings da instância
  async getInstanceSettings(instanceName: string): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'get_instance_settings',
      instanceName,
    });
  }

  // Configurar webhook para N8N diretamente
  async setWebhook(instanceName: string, webhookConfig?: {
    enabled: boolean;
    url: string;
    webhookByEvents: boolean;
    webhookBase64: boolean;
    events: string[];
  }): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'set_webhook',
      instanceName,
      webhookConfig: {
        enabled: true,
        url: 'N8N_WEBHOOK_DIRECT', // Placeholder que será substituído pelo N8N URL
        webhookByEvents: false, // IMPORTANTE: false para receber tudo numa URL só
        webhookBase64: true,
        events: [
          'APPLICATION_STARTUP',
          'MESSAGES_UPSERT'
        ]
      },
    });
  }

  // Deletar instância permanentemente
  async deleteInstance(instanceName: string): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'delete_instance',
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
  WhatsAppApiResponse,
  WhatsAppInstance,
  WhatsAppSettings
};
