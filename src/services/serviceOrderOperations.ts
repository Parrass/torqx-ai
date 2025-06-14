
import { ServiceOrder, ServiceOrderInput } from '@/types/serviceOrder';
import { transformServiceOrderData } from '@/types/serviceOrder';

export class ServiceOrderOperations {
  constructor(
    private supabase: any,
    private toast: any
  ) {}

  async create(orderData: Partial<ServiceOrder>, user: any): Promise<ServiceOrder | null> {
    console.log('Creating service order with data:', orderData);
    
    const inputData: ServiceOrderInput & { tenant_id: string; created_by_user_id: string } = {
      customer_id: orderData.customer_id!,
      vehicle_id: orderData.vehicle_id!,
      problem_description: orderData.problem_description!,
      assigned_technician_id: orderData.assigned_technician_id,
      status: orderData.status || 'draft',
      priority: orderData.priority || 'normal',
      customer_complaint: orderData.customer_complaint,
      internal_notes: orderData.internal_notes,
      estimated_cost: orderData.estimated_cost,
      estimated_hours: orderData.estimated_hours,
      vehicle_mileage: orderData.vehicle_mileage,
      scheduled_start_date: orderData.scheduled_start_date,
      estimated_completion_date: orderData.estimated_completion_date,
      tenant_id: user.user_metadata.tenant_id,
      created_by_user_id: user.id,
    };
    
    const { data, error } = await this.supabase
      .from('service_orders')
      .insert(inputData)
      .select(`
        *,
        customers!inner(name, phone),
        vehicles!inner(brand, model, license_plate, year),
        assigned_technician:users!service_orders_assigned_technician_id_fkey(full_name)
      `)
      .single();

    if (error) throw error;

    console.log('Created service order response:', data);
    return transformServiceOrderData([data])[0];
  }

  async update(id: string, updates: Partial<ServiceOrder>): Promise<void> {
    console.log('Updating service order:', id, updates);
    
    const updateData: Partial<ServiceOrderInput> = {
      customer_id: updates.customer_id,
      vehicle_id: updates.vehicle_id,
      assigned_technician_id: updates.assigned_technician_id,
      status: updates.status,
      priority: updates.priority,
      problem_description: updates.problem_description,
      customer_complaint: updates.customer_complaint,
      internal_notes: updates.internal_notes,
      estimated_cost: updates.estimated_cost,
      final_cost: updates.final_cost,
      estimated_hours: updates.estimated_hours,
      final_hours: updates.final_hours,
      vehicle_mileage: updates.vehicle_mileage,
      scheduled_start_date: updates.scheduled_start_date,
      estimated_completion_date: updates.estimated_completion_date,
      actual_completion_date: updates.actual_completion_date,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof ServiceOrderInput] === undefined) {
        delete updateData[key as keyof ServiceOrderInput];
      }
    });
    
    const { error } = await this.supabase
      .from('service_orders')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    console.log('Deleting service order:', id);
    
    const { error } = await this.supabase
      .from('service_orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
