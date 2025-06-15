
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ServiceOrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  customer_id?: string;
  technician_id?: string;
}

interface ServiceOrderData {
  customer_id: string;
  vehicle_id: string;
  assigned_technician_id?: string;
  problem_description: string;
  customer_complaint?: string;
  internal_notes?: string;
  status?: string;
  priority?: string;
  estimated_cost?: number;
  final_cost?: number;
  estimated_hours?: number;
  final_hours?: number;
  vehicle_mileage?: number;
  scheduled_start_date?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
  customer_approved?: boolean;
  ai_diagnosis?: any;
  ai_recommendations?: any[];
}

class ServiceOrdersApi {
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
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getServiceOrders(filters: ServiceOrderFilters = {}): Promise<ApiResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters.customer_id) params.append('customer_id', filters.customer_id);
    if (filters.technician_id) params.append('technician_id', filters.technician_id);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest(`/service-orders-api${query}`);
  }

  async getServiceOrder(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/service-orders-api/${id}`);
  }

  async createServiceOrder(serviceOrderData: ServiceOrderData): Promise<ApiResponse> {
    return this.makeRequest('/service-orders-api', {
      method: 'POST',
      body: JSON.stringify(serviceOrderData),
    });
  }

  async updateServiceOrder(id: string, serviceOrderData: Partial<ServiceOrderData>): Promise<ApiResponse> {
    return this.makeRequest(`/service-orders-api/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceOrderData),
    });
  }

  async deleteServiceOrder(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/service-orders-api/${id}`, {
      method: 'DELETE',
    });
  }
}

export const serviceOrdersApi = new ServiceOrdersApi();
export type { ServiceOrderData, ServiceOrderFilters, ApiResponse };
