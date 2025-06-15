
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  customer_type?: 'all' | 'individual' | 'business';
}

interface CustomerData {
  name: string;
  email?: string;
  phone?: string;
  document_number?: string;
  document_type?: 'cpf' | 'cnpj';
  customer_type: 'individual' | 'business';
  secondary_phone?: string;
  preferred_contact: 'phone' | 'email' | 'whatsapp';
  notes?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  status?: 'active' | 'inactive';
  tags?: string[];
}

class CustomersApi {
  private baseUrl: string;
  private projectId = 'bszcwxrjhvbvixrdnzvf';

  constructor() {
    this.baseUrl = `https://${this.projectId}.supabase.co/functions/v1`;
  }

  private async getAuthToken(): Promise<string> {
    // Get token from Supabase auth
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

  // Get all customers with optional filters
  async getCustomers(filters: CustomerFilters = {}): Promise<ApiResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.customer_type && filters.customer_type !== 'all') params.append('customer_type', filters.customer_type);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest(`/customers-api${query}`);
  }

  // Get customer by ID
  async getCustomer(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/customers-api/${id}`);
  }

  // Create new customer
  async createCustomer(customerData: CustomerData): Promise<ApiResponse> {
    return this.makeRequest('/customers-api', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  // Update customer
  async updateCustomer(id: string, customerData: Partial<CustomerData>): Promise<ApiResponse> {
    return this.makeRequest(`/customers-api/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  // Delete customer
  async deleteCustomer(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/customers-api/${id}`, {
      method: 'DELETE',
    });
  }

  // Get customer statistics
  async getCustomerStats(): Promise<ApiResponse> {
    return this.makeRequest('/customers-stats');
  }
}

export const customersApi = new CustomersApi();
export type { CustomerData, CustomerFilters, ApiResponse };
