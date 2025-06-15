
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: 'all' | 'active' | 'inactive';
  low_stock?: boolean;
}

interface InventoryItemData {
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  brand?: string;
  unit?: string;
  current_stock?: number;
  minimum_stock?: number;
  maximum_stock?: number;
  cost_price?: number;
  sale_price?: number;
  margin_percentage?: number;
  location?: string;
  shelf?: string;
  supplier_name?: string;
  supplier_code?: string;
  technical_specs?: any;
  track_stock?: boolean;
  allow_negative_stock?: boolean;
  status?: 'active' | 'inactive';
  notes?: string;
}

class InventoryApi {
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

  async getInventoryItems(filters: InventoryFilters = {}): Promise<ApiResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.low_stock) params.append('low_stock', 'true');

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest(`/inventory-api${query}`);
  }

  async getInventoryItem(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/inventory-api/${id}`);
  }

  async createInventoryItem(itemData: InventoryItemData): Promise<ApiResponse> {
    return this.makeRequest('/inventory-api', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateInventoryItem(id: string, itemData: Partial<InventoryItemData>): Promise<ApiResponse> {
    return this.makeRequest(`/inventory-api/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async deleteInventoryItem(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/inventory-api/${id}`, {
      method: 'DELETE',
    });
  }
}

export const inventoryApi = new InventoryApi();
export type { InventoryItemData, InventoryFilters, ApiResponse };
