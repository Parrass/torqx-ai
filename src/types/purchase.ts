
export interface Purchase {
  id: string;
  tenant_id: string;
  purchase_number: number;
  supplier_name: string;
  supplier_document?: string;
  supplier_contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  invoice_number?: string;
  invoice_date?: string;
  purchase_date: string;
  due_date?: string;
  category: string;
  total_amount: number;
  tax_amount?: number;
  discount_amount?: number;
  final_amount: number;
  payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_method?: string;
  payment_date?: string;
  notes?: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  purchase_items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  inventory_item_id?: string;
  description: string;
  category?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  created_at: string;
}

export interface PurchaseMetrics {
  tenant_id: string;
  month: string;
  total_purchases: number;
  total_spent: number;
  avg_purchase_value: number;
  paid_amount: number;
  pending_amount: number;
}

export interface CreatePurchaseData {
  supplier_name: string;
  supplier_document?: string;
  supplier_contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  invoice_number?: string;
  invoice_date?: string;
  purchase_date: string;
  due_date?: string;
  category: string;
  tax_amount?: number;
  discount_amount?: number;
  payment_method?: string;
  notes?: string;
  items: CreatePurchaseItemData[];
}

export interface CreatePurchaseItemData {
  inventory_item_id?: string;
  description: string;
  category?: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}
