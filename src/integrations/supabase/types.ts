export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_interactions: {
        Row: {
          accuracy_validated: boolean | null
          confidence_score: number | null
          created_at: string | null
          customer_id: string | null
          id: string
          input_data: Json
          interaction_type: string
          model_used: string | null
          output_data: Json
          processing_time_ms: number | null
          service_order_id: string | null
          tenant_id: string
          user_feedback: Json | null
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          accuracy_validated?: boolean | null
          confidence_score?: number | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          input_data: Json
          interaction_type: string
          model_used?: string | null
          output_data: Json
          processing_time_ms?: number | null
          service_order_id?: string | null
          tenant_id: string
          user_feedback?: Json | null
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          accuracy_validated?: boolean | null
          confidence_score?: number | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          input_data?: Json
          interaction_type?: string
          model_used?: string | null
          output_data?: Json
          processing_time_ms?: number | null
          service_order_id?: string | null
          tenant_id?: string
          user_feedback?: Json | null
          user_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interactions_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interactions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_interactions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_type: string | null
          assigned_technician_id: string | null
          created_at: string | null
          created_by_user_id: string
          customer_id: string
          description: string | null
          end_datetime: string
          estimated_duration: number | null
          id: string
          internal_notes: string | null
          notes: string | null
          reminder_sent: boolean | null
          reminder_sent_at: string | null
          required_resources: Json | null
          service_order_id: string | null
          start_datetime: string
          status: string | null
          tenant_id: string
          title: string
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          appointment_type?: string | null
          assigned_technician_id?: string | null
          created_at?: string | null
          created_by_user_id: string
          customer_id: string
          description?: string | null
          end_datetime: string
          estimated_duration?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
          required_resources?: Json | null
          service_order_id?: string | null
          start_datetime: string
          status?: string | null
          tenant_id: string
          title: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          appointment_type?: string | null
          assigned_technician_id?: string | null
          created_at?: string | null
          created_by_user_id?: string
          customer_id?: string
          description?: string | null
          end_datetime?: string
          estimated_duration?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
          required_resources?: Json | null
          service_order_id?: string | null
          start_datetime?: string
          status?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_fields: string[] | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          tenant_id: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          tenant_id: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          tenant_id?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: Json | null
          created_at: string | null
          credit_limit: number | null
          customer_type: string | null
          document_number: string | null
          document_type: string | null
          email: string | null
          id: string
          last_service_date: string | null
          name: string
          notes: string | null
          payment_terms: number | null
          phone: string | null
          preferred_contact: string | null
          preferred_technician_id: string | null
          secondary_phone: string | null
          status: string | null
          tags: string[] | null
          tenant_id: string
          total_orders: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          created_at?: string | null
          credit_limit?: number | null
          customer_type?: string | null
          document_number?: string | null
          document_type?: string | null
          email?: string | null
          id?: string
          last_service_date?: string | null
          name: string
          notes?: string | null
          payment_terms?: number | null
          phone?: string | null
          preferred_contact?: string | null
          preferred_technician_id?: string | null
          secondary_phone?: string | null
          status?: string | null
          tags?: string[] | null
          tenant_id: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          created_at?: string | null
          credit_limit?: number | null
          customer_type?: string | null
          document_number?: string | null
          document_type?: string | null
          email?: string | null
          id?: string
          last_service_date?: string | null
          name?: string
          notes?: string | null
          payment_terms?: number | null
          phone?: string | null
          preferred_contact?: string | null
          preferred_technician_id?: string | null
          secondary_phone?: string | null
          status?: string | null
          tags?: string[] | null
          tenant_id?: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_preferred_technician_id_fkey"
            columns: ["preferred_technician_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_preferred_technician_id_fkey"
            columns: ["preferred_technician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_preferred_technician_id_fkey"
            columns: ["preferred_technician_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          allow_negative_stock: boolean | null
          barcode: string | null
          brand: string | null
          category: string | null
          cost_price: number | null
          created_at: string | null
          current_stock: number | null
          description: string | null
          id: string
          location: string | null
          margin_percentage: number | null
          maximum_stock: number | null
          minimum_stock: number | null
          name: string
          notes: string | null
          sale_price: number | null
          shelf: string | null
          sku: string | null
          status: string | null
          supplier_code: string | null
          supplier_name: string | null
          technical_specs: Json | null
          tenant_id: string
          track_stock: boolean | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          allow_negative_stock?: boolean | null
          barcode?: string | null
          brand?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          id?: string
          location?: string | null
          margin_percentage?: number | null
          maximum_stock?: number | null
          minimum_stock?: number | null
          name: string
          notes?: string | null
          sale_price?: number | null
          shelf?: string | null
          sku?: string | null
          status?: string | null
          supplier_code?: string | null
          supplier_name?: string | null
          technical_specs?: Json | null
          tenant_id: string
          track_stock?: boolean | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          allow_negative_stock?: boolean | null
          barcode?: string | null
          brand?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          id?: string
          location?: string | null
          margin_percentage?: number | null
          maximum_stock?: number | null
          minimum_stock?: number | null
          name?: string
          notes?: string | null
          sale_price?: number | null
          shelf?: string | null
          sku?: string | null
          status?: string | null
          supplier_code?: string | null
          supplier_name?: string | null
          technical_specs?: Json | null
          tenant_id?: string
          track_stock?: boolean | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string | null
          id: string
          inventory_item_id: string
          movement_type: string
          notes: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          stock_after: number
          stock_before: number
          tenant_id: string
          total_cost: number | null
          unit_cost: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_item_id: string
          movement_type: string
          notes?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          stock_after: number
          stock_before: number
          tenant_id: string
          total_cost?: number | null
          unit_cost?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string
          movement_type?: string
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          stock_after?: number
          stock_before?: number
          tenant_id?: string
          total_cost?: number | null
          unit_cost?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          completed_steps: string[] | null
          created_at: string | null
          current_step: string
          id: string
          is_completed: boolean | null
          progress: number | null
          started_at: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: string[] | null
          created_at?: string | null
          current_step: string
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          started_at?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: string[] | null
          created_at?: string | null
          current_step?: string
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          started_at?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      onboarding_tasks: {
        Row: {
          action: string | null
          category: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          is_completed: boolean | null
          reward: string | null
          task_id: string
          tenant_id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          reward?: string | null
          task_id: string
          tenant_id: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          reward?: string | null
          task_id?: string
          tenant_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      purchase_items: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          id: string
          inventory_item_id: string | null
          notes: string | null
          purchase_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          inventory_item_id?: string | null
          notes?: string | null
          purchase_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          inventory_item_id?: string | null
          notes?: string | null
          purchase_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          category: string | null
          created_at: string | null
          created_by_user_id: string
          discount_amount: number | null
          due_date: string | null
          final_amount: number
          id: string
          invoice_date: string | null
          invoice_number: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          purchase_date: string
          purchase_number: number
          supplier_contact: Json | null
          supplier_document: string | null
          supplier_id: string | null
          supplier_name: string
          tax_amount: number | null
          tenant_id: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by_user_id: string
          discount_amount?: number | null
          due_date?: string | null
          final_amount?: number
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          purchase_date?: string
          purchase_number: number
          supplier_contact?: Json | null
          supplier_document?: string | null
          supplier_id?: string | null
          supplier_name: string
          tax_amount?: number | null
          tenant_id: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by_user_id?: string
          discount_amount?: number | null
          due_date?: string | null
          final_amount?: number
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          purchase_date?: string
          purchase_number?: number
          supplier_contact?: Json | null
          supplier_document?: string | null
          supplier_id?: string | null
          supplier_name?: string
          tax_amount?: number | null
          tenant_id?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_items: {
        Row: {
          actual_hours: number | null
          category: string | null
          cost_price: number | null
          created_at: string | null
          description: string
          estimated_hours: number | null
          id: string
          inventory_item_id: string | null
          item_type: string
          notes: string | null
          quantity: number
          service_order_id: string
          status: string | null
          tenant_id: string
          total_price: number
          unit: string | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description: string
          estimated_hours?: number | null
          id?: string
          inventory_item_id?: string | null
          item_type: string
          notes?: string | null
          quantity?: number
          service_order_id: string
          status?: string | null
          tenant_id: string
          total_price: number
          unit?: string | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string
          estimated_hours?: number | null
          id?: string
          inventory_item_id?: string | null
          item_type?: string
          notes?: string | null
          quantity?: number
          service_order_id?: string
          status?: string | null
          tenant_id?: string
          total_price?: number
          unit?: string | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_order_items_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          actual_completion_date: string | null
          actual_start_date: string | null
          ai_diagnosis: Json | null
          ai_recommendations: Json | null
          approved_at: string | null
          approved_by_user_id: string | null
          assigned_technician_id: string | null
          attachments: Json | null
          created_at: string | null
          created_by_user_id: string
          customer_approved: boolean | null
          customer_complaint: string | null
          customer_id: string
          customer_notes: string | null
          delivery_date: string | null
          estimated_completion_date: string | null
          estimated_cost: number | null
          estimated_hours: number | null
          final_cost: number | null
          final_hours: number | null
          id: string
          internal_notes: string | null
          labor_cost: number | null
          order_number: number
          parts_cost: number | null
          priority: string | null
          problem_description: string
          scheduled_start_date: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
          vehicle_condition_notes: string | null
          vehicle_id: string
          vehicle_mileage: number | null
        }
        Insert: {
          actual_completion_date?: string | null
          actual_start_date?: string | null
          ai_diagnosis?: Json | null
          ai_recommendations?: Json | null
          approved_at?: string | null
          approved_by_user_id?: string | null
          assigned_technician_id?: string | null
          attachments?: Json | null
          created_at?: string | null
          created_by_user_id: string
          customer_approved?: boolean | null
          customer_complaint?: string | null
          customer_id: string
          customer_notes?: string | null
          delivery_date?: string | null
          estimated_completion_date?: string | null
          estimated_cost?: number | null
          estimated_hours?: number | null
          final_cost?: number | null
          final_hours?: number | null
          id?: string
          internal_notes?: string | null
          labor_cost?: number | null
          order_number?: number
          parts_cost?: number | null
          priority?: string | null
          problem_description: string
          scheduled_start_date?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
          vehicle_condition_notes?: string | null
          vehicle_id: string
          vehicle_mileage?: number | null
        }
        Update: {
          actual_completion_date?: string | null
          actual_start_date?: string | null
          ai_diagnosis?: Json | null
          ai_recommendations?: Json | null
          approved_at?: string | null
          approved_by_user_id?: string | null
          assigned_technician_id?: string | null
          attachments?: Json | null
          created_at?: string | null
          created_by_user_id?: string
          customer_approved?: boolean | null
          customer_complaint?: string | null
          customer_id?: string
          customer_notes?: string | null
          delivery_date?: string | null
          estimated_completion_date?: string | null
          estimated_cost?: number | null
          estimated_hours?: number | null
          final_cost?: number | null
          final_hours?: number | null
          id?: string
          internal_notes?: string | null
          labor_cost?: number | null
          order_number?: number
          parts_cost?: number | null
          priority?: string | null
          problem_description?: string
          scheduled_start_date?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
          vehicle_condition_notes?: string | null
          vehicle_id?: string
          vehicle_mileage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: Json | null
          bank_info: Json | null
          business_name: string | null
          category: string | null
          contact_person: string | null
          created_at: string | null
          created_by_user_id: string
          credit_limit: number | null
          document_number: string | null
          document_type: string | null
          email: string | null
          id: string
          mobile: string | null
          name: string
          notes: string | null
          payment_terms: number | null
          phone: string | null
          rating: number | null
          status: string | null
          tags: string[] | null
          tenant_id: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          bank_info?: Json | null
          business_name?: string | null
          category?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by_user_id: string
          credit_limit?: number | null
          document_number?: string | null
          document_type?: string | null
          email?: string | null
          id?: string
          mobile?: string | null
          name: string
          notes?: string | null
          payment_terms?: number | null
          phone?: string | null
          rating?: number | null
          status?: string | null
          tags?: string[] | null
          tenant_id: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          bank_info?: Json | null
          business_name?: string | null
          category?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by_user_id?: string
          credit_limit?: number | null
          document_number?: string | null
          document_type?: string | null
          email?: string | null
          id?: string
          mobile?: string | null
          name?: string
          notes?: string | null
          payment_terms?: number | null
          phone?: string | null
          rating?: number | null
          status?: string | null
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      system_modules: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      tenant_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_sensitive: boolean | null
          key: string
          tenant_id: string
          updated_at: string | null
          value: Json
          version: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          key: string
          tenant_id: string
          updated_at?: string | null
          value: Json
          version?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          key?: string
          tenant_id?: string
          updated_at?: string | null
          value?: Json
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          address: Json | null
          business_name: string | null
          created_at: string | null
          document_number: string
          document_type: string | null
          email: string
          id: string
          name: string
          phone: string | null
          plan_limits: Json | null
          plan_type: string | null
          settings: Json | null
          status: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          business_name?: string | null
          created_at?: string | null
          document_number: string
          document_type?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          plan_limits?: Json | null
          plan_type?: string | null
          settings?: Json | null
          status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          business_name?: string | null
          created_at?: string | null
          document_number?: string
          document_type?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          plan_limits?: Json | null
          plan_type?: string | null
          settings?: Json | null
          status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_module_permissions: {
        Row: {
          can_create: boolean | null
          can_delete: boolean | null
          can_read: boolean | null
          can_update: boolean | null
          created_at: string | null
          id: string
          module_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_read?: boolean | null
          can_update?: boolean | null
          created_at?: string | null
          id?: string
          module_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_read?: boolean | null
          can_update?: boolean | null
          created_at?: string | null
          id?: string
          module_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_permissions_module_name_fkey"
            columns: ["module_name"]
            isOneToOne: false
            referencedRelation: "system_modules"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "user_module_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_module_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_module_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by_user_id: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          permissions: Json | null
          phone: string | null
          preferences: Json | null
          role: string
          status: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          last_login_at?: string | null
          permissions?: Json | null
          phone?: string | null
          preferences?: Json | null
          role: string
          status?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          permissions?: Json | null
          phone?: string | null
          preferences?: Json | null
          role?: string
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "technician_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users_with_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          color: string | null
          condition_notes: string | null
          created_at: string | null
          current_mileage: number | null
          customer_id: string
          engine_size: string | null
          fuel_type: string | null
          id: string
          license_plate: string
          maintenance_intervals: Json | null
          mileage_history: Json | null
          model: string
          notes: string | null
          status: string | null
          technical_specs: Json | null
          tenant_id: string
          transmission: string | null
          updated_at: string | null
          vin_chassis: string | null
          year: number | null
        }
        Insert: {
          brand: string
          color?: string | null
          condition_notes?: string | null
          created_at?: string | null
          current_mileage?: number | null
          customer_id: string
          engine_size?: string | null
          fuel_type?: string | null
          id?: string
          license_plate: string
          maintenance_intervals?: Json | null
          mileage_history?: Json | null
          model: string
          notes?: string | null
          status?: string | null
          technical_specs?: Json | null
          tenant_id: string
          transmission?: string | null
          updated_at?: string | null
          vin_chassis?: string | null
          year?: number | null
        }
        Update: {
          brand?: string
          color?: string | null
          condition_notes?: string | null
          created_at?: string | null
          current_mileage?: number | null
          customer_id?: string
          engine_size?: string | null
          fuel_type?: string | null
          id?: string
          license_plate?: string
          maintenance_intervals?: Json | null
          mileage_history?: Json | null
          model?: string
          notes?: string | null
          status?: string | null
          technical_specs?: Json | null
          tenant_id?: string
          transmission?: string | null
          updated_at?: string | null
          vin_chassis?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_services: {
        Row: {
          base_price: number | null
          category: string | null
          created_at: string | null
          created_by_user_id: string
          description: string | null
          estimated_duration_minutes: number | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          requires_parts: boolean | null
          skill_level: string | null
          tenant_id: string
          updated_at: string | null
          warranty_days: number | null
        }
        Insert: {
          base_price?: number | null
          category?: string | null
          created_at?: string | null
          created_by_user_id: string
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          requires_parts?: boolean | null
          skill_level?: string | null
          tenant_id: string
          updated_at?: string | null
          warranty_days?: number | null
        }
        Update: {
          base_price?: number | null
          category?: string | null
          created_at?: string | null
          created_by_user_id?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          requires_parts?: boolean | null
          skill_level?: string | null
          tenant_id?: string
          updated_at?: string | null
          warranty_days?: number | null
        }
        Relationships: []
      }
      workshop_settings: {
        Row: {
          address: string | null
          business_name: string | null
          cnpj: string | null
          created_at: string | null
          created_by_user_id: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          mobile: string | null
          phone: string | null
          state_registration: string | null
          tenant_id: string
          updated_at: string | null
          website: string | null
          working_hours: Json | null
          workshop_name: string
          workshop_photo_url: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          cnpj?: string | null
          created_at?: string | null
          created_by_user_id: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          mobile?: string | null
          phone?: string | null
          state_registration?: string | null
          tenant_id: string
          updated_at?: string | null
          website?: string | null
          working_hours?: Json | null
          workshop_name: string
          workshop_photo_url?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string | null
          cnpj?: string | null
          created_at?: string | null
          created_by_user_id?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          mobile?: string | null
          phone?: string | null
          state_registration?: string | null
          tenant_id?: string
          updated_at?: string | null
          website?: string | null
          working_hours?: Json | null
          workshop_name?: string
          workshop_photo_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      customer_metrics: {
        Row: {
          avg_order_value: number | null
          email: string | null
          id: string | null
          last_order_date: string | null
          name: string | null
          phone: string | null
          tenant_id: string | null
          total_orders: number | null
          total_spent: number | null
          total_vehicles: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_alerts: {
        Row: {
          alert_level: string | null
          category: string | null
          current_stock: number | null
          id: string | null
          minimum_stock: number | null
          name: string | null
          sku: string | null
          tenant_id: string | null
        }
        Insert: {
          alert_level?: never
          category?: string | null
          current_stock?: number | null
          id?: string | null
          minimum_stock?: number | null
          name?: string | null
          sku?: string | null
          tenant_id?: string | null
        }
        Update: {
          alert_level?: never
          category?: string | null
          current_stock?: number | null
          id?: string | null
          minimum_stock?: number | null
          name?: string | null
          sku?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_metrics: {
        Row: {
          avg_purchase_value: number | null
          month: string | null
          paid_amount: number | null
          pending_amount: number | null
          tenant_id: string | null
          total_purchases: number | null
          total_spent: number | null
        }
        Relationships: []
      }
      technician_performance: {
        Row: {
          avg_hours_per_order: number | null
          completed_orders: number | null
          full_name: string | null
          id: string | null
          on_time_completions: number | null
          tenant_id: string | null
          total_orders: number | null
          total_revenue_generated: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      users_with_permissions: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          last_login_at: string | null
          permissions: Json | null
          phone: string | null
          role: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_user_permission: {
        Args: {
          _user_id: string
          _module_name: string
          _permission_type: string
        }
        Returns: boolean
      }
      generate_purchase_number: {
        Args: { tenant_uuid: string }
        Returns: number
      }
      get_current_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
