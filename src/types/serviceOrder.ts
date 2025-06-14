
export interface ServiceOrder {
  id: string;
  order_number: number;
  customer_id: string;
  vehicle_id: string;
  assigned_technician_id?: string;
  status: string;
  priority: string;
  problem_description: string;
  customer_complaint?: string;
  internal_notes?: string;
  estimated_cost?: number;
  final_cost?: number;
  estimated_hours?: number;
  final_hours?: number;
  vehicle_mileage?: number;
  scheduled_start_date?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
  created_at: string;
  updated_at: string;
  customers: {
    name: string;
    phone?: string;
  };
  vehicles: {
    brand: string;
    model: string;
    license_plate: string;
    year?: number;
  };
  assigned_technician?: {
    full_name: string;
  } | null;
}

export interface ServiceOrderInput {
  customer_id: string;
  vehicle_id: string;
  assigned_technician_id?: string;
  status?: string;
  priority?: string;
  problem_description: string;
  customer_complaint?: string;
  internal_notes?: string;
  estimated_cost?: number;
  final_cost?: number;
  estimated_hours?: number;
  final_hours?: number;
  vehicle_mileage?: number;
  scheduled_start_date?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
}

export interface ServiceOrderStats {
  total: number;
  draft: number;
  scheduled: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  total_revenue: number;
}

export const transformServiceOrderData = (data: any[]): ServiceOrder[] => {
  return data.map(order => {
    const hasTechnician = order.assigned_technician && 
                         typeof order.assigned_technician === 'object' && 
                         order.assigned_technician !== null && 
                         'full_name' in order.assigned_technician;
    
    return {
      ...order,
      assigned_technician: hasTechnician 
        ? { full_name: order.assigned_technician.full_name }
        : null
    };
  });
};

export const createServiceOrderStats = (orders: ServiceOrder[]): ServiceOrderStats => {
  return orders.reduce((acc, so) => {
    acc.total++;
    if (so.status in acc) {
      acc[so.status as keyof ServiceOrderStats] = (acc[so.status as keyof ServiceOrderStats] as number) + 1;
    }
    if (so.final_cost) {
      acc.total_revenue += so.final_cost;
    }
    return acc;
  }, {
    total: 0,
    draft: 0,
    scheduled: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    total_revenue: 0,
  });
};
