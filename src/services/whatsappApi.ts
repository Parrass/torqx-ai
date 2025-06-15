
interface WhatsAppApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

interface SendMessageData {
  number: string;
  message: string;
}

interface SendMediaData {
  number: string;
  media: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  caption?: string;
}

interface ChatMessage {
  id: string;
  fromMe: boolean;
  body: string;
  timestamp: number;
  type: string;
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

  // Gerenciamento de instância
  async createInstance(instanceName: string = 'torqx-instance'): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'create_instance',
      instanceName,
    });
  }

  async getQRCode(instanceName: string = 'torqx-instance'): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'get_qr_code',
      instanceName,
    });
  }

  async getInstanceStatus(instanceName: string = 'torqx-instance'): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'get_instance_status',
      instanceName,
    });
  }

  async logoutInstance(instanceName: string = 'torqx-instance'): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'logout_instance',
      instanceName,
    });
  }

  // Envio de mensagens
  async sendMessage(data: SendMessageData, instanceName: string = 'torqx-instance'): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'send_message',
      instanceName,
      ...data,
    });
  }

  async sendMedia(data: SendMediaData, instanceName: string = 'torqx-instance'): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'send_media',
      instanceName,
      ...data,
    });
  }

  // Chat e mensagens
  async getChatMessages(number: string, limit: number = 50, instanceName: string = 'torqx-instance'): Promise<WhatsAppApiResponse<ChatMessage[]>> {
    return this.makeRequest('/whatsapp-integration', {
      action: 'get_chat_messages',
      instanceName,
      number,
      limit,
    });
  }

  // IA Chat
  async sendAIMessage(message: string, customerPhone: string, instanceName: string = 'torqx-instance'): Promise<WhatsAppApiResponse> {
    return this.makeRequest('/whatsapp-ai-chat', {
      message,
      customerPhone,
      instanceName,
    });
  }
}

export const whatsappApi = new WhatsAppApi();
export type { SendMessageData, SendMediaData, ChatMessage, WhatsAppApiResponse };
