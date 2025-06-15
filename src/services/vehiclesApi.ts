
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface VehicleFilters {
  page?: number;
  limit?: number;
  search?: string;
  customer_id?: string;
  status?: 'all' | 'active' | 'inactive';
}

interface VehicleData {
  customer_id: string;
  brand: string;
  model: string;
  year?: number;
  license_plate: string;
  color?: string;
  fuel_type?: string;
  engine_size?: string;
  transmission?: string;
  vin_chassis?: string;
  current_mileage?: number;
  technical_specs?: any;
  maintenance_intervals?: any;
  mileage_history?: any[];
  condition_notes?: string;
  notes?: string;
  status?: 'active' | 'inactive';
}

class VehiclesApi {
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

  async getVehicles(filters: VehicleFilters = {}): Promise<ApiResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.customer_id) params.append('customer_id', filters.customer_id);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest(`/vehicles-api${query}`);
  }

  async getVehicle(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/vehicles-api/${id}`);
  }

  async createVehicle(vehicleData: VehicleData): Promise<ApiResponse> {
    return this.makeRequest('/vehicles-api', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id: string, vehicleData: Partial<VehicleData>): Promise<ApiResponse> {
    return this.makeRequest(`/vehicles-api/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/vehicles-api/${id}`, {
      method: 'DELETE',
    });
  }
}

export const vehiclesApi = new VehiclesApi();
export type { VehicleData, VehicleFilters, ApiResponse };
