
export interface Supplier {
  id: string;
  tenant_id: string;
  name: string;
  business_name?: string;
  document_type: 'cnpj' | 'cpf';
  document_number?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  contact_person?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  bank_info?: {
    bank?: string;
    agency?: string;
    account?: string;
    account_type?: string;
    pix_key?: string;
  };
  payment_terms?: number;
  credit_limit?: number;
  category: string;
  notes?: string;
  status: 'active' | 'inactive' | 'suspended';
  rating?: number;
  tags?: string[];
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierData {
  name: string;
  business_name?: string;
  document_type: 'cnpj' | 'cpf';
  document_number?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  contact_person?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  bank_info?: {
    bank?: string;
    agency?: string;
    account?: string;
    account_type?: string;
    pix_key?: string;
  };
  payment_terms?: number;
  credit_limit?: number;
  category: string;
  notes?: string;
  rating?: number;
  tags?: string[];
}
