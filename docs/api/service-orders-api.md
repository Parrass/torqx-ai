
# Service Orders API Documentation

## Base URL
```
https://bszcwxrjhvbvixrdnzvf.supabase.co/functions/v1
```

## Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_supabase_access_token>
```

## Permissions
The API respects the modular permission system. Users need appropriate permissions for each operation:
- `can_read`: Required for GET operations
- `can_create`: Required for POST operations  
- `can_update`: Required for PUT operations
- `can_delete`: Required for DELETE operations

## Endpoints

### GET /service-orders-api
Get all service orders with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `search` (string, optional): Search in problem description, complaint, order number
- `status` (string, optional): Filter by status
- `priority` (string, optional): Filter by priority
- `customer_id` (string, optional): Filter by customer ID
- `technician_id` (string, optional): Filter by assigned technician ID

**Response:**
```json
{
  "success": true,
  "data": {
    "serviceOrders": [
      {
        "id": "uuid",
        "order_number": 1001,
        "customer_id": "uuid",
        "vehicle_id": "uuid",
        "assigned_technician_id": "uuid",
        "status": "in_progress",
        "priority": "normal",
        "problem_description": "Motor fazendo barulho estranho",
        "customer_complaint": "Carro não está acelerando bem",
        "estimated_cost": 500.00,
        "final_cost": 450.00,
        "estimated_hours": 4,
        "final_hours": 3.5,
        "customers": {
          "name": "João Silva",
          "phone": "(11) 99999-9999"
        },
        "vehicles": {
          "brand": "Volkswagen",
          "model": "Gol",
          "license_plate": "ABC-1234"
        },
        "assigned_technician": {
          "full_name": "Carlos Mecânico"
        },
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### GET /service-orders-api/{id}
Get a specific service order by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": 1001,
    "customer_id": "uuid",
    "vehicle_id": "uuid",
    "assigned_technician_id": "uuid",
    "status": "in_progress",
    "priority": "high",
    "problem_description": "Motor fazendo barulho estranho",
    "customer_complaint": "Carro não está acelerando bem",
    "internal_notes": "Verificar correia dentada",
    "estimated_cost": 500.00,
    "final_cost": 450.00,
    "estimated_hours": 4,
    "final_hours": 3.5,
    "vehicle_mileage": 50000,
    "scheduled_start_date": "2024-01-02T08:00:00Z",
    "estimated_completion_date": "2024-01-02T12:00:00Z",
    "actual_completion_date": "2024-01-02T11:30:00Z",
    "customer_approved": true,
    "ai_diagnosis": {
      "confidence": 0.85,
      "suspected_issues": ["belt", "timing"]
    },
    "ai_recommendations": [
      {
        "service": "Belt replacement",
        "confidence": 0.9,
        "estimated_cost": 200
      }
    ],
    "customers": {
      "name": "João Silva",
      "phone": "(11) 99999-9999",
      "email": "joao@email.com"
    },
    "vehicles": {
      "brand": "Volkswagen",
      "model": "Gol",
      "license_plate": "ABC-1234",
      "year": 2020
    },
    "assigned_technician": {
      "full_name": "Carlos Mecânico"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /service-orders-api
Create a new service order.

**Request Body:**
```json
{
  "customer_id": "uuid",
  "vehicle_id": "uuid",
  "assigned_technician_id": "uuid",
  "problem_description": "Motor fazendo barulho estranho",
  "customer_complaint": "Carro não está acelerando bem",
  "internal_notes": "Cliente relatou problema há 1 semana",
  "status": "scheduled",
  "priority": "normal",
  "estimated_cost": 500.00,
  "estimated_hours": 4,
  "vehicle_mileage": 50000,
  "scheduled_start_date": "2024-01-02T08:00:00Z",
  "estimated_completion_date": "2024-01-02T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": 1001,
    "customer_id": "uuid",
    // ... all service order fields
  },
  "message": "Service order created successfully"
}
```

### PUT /service-orders-api/{id}
Update an existing service order.

**Request Body:** (partial service order data)
```json
{
  "status": "completed",
  "final_cost": 450.00,
  "final_hours": 3.5,
  "actual_completion_date": "2024-01-02T11:30:00Z",
  "customer_approved": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    // ... updated service order data
  },
  "message": "Service order updated successfully"
}
```

### DELETE /service-orders-api/{id}
Delete a service order.

**Response:**
```json
{
  "success": true,
  "message": "Service order deleted successfully"
}
```

## Status Values
- `draft`: Rascunho
- `scheduled`: Agendada
- `in_progress`: Em andamento
- `completed`: Concluída
- `cancelled`: Cancelada

## Priority Values
- `low`: Baixa
- `normal`: Normal
- `high`: Alta
- `urgent`: Urgente

## Usage Examples

### JavaScript/TypeScript
```typescript
import { serviceOrdersApi } from '@/services/serviceOrdersApi';

// Get service orders with filters
const response = await serviceOrdersApi.getServiceOrders({
  page: 1,
  limit: 20,
  status: 'in_progress',
  priority: 'high'
});

// Create a service order
const newOrder = await serviceOrdersApi.createServiceOrder({
  customer_id: 'customer-uuid',
  vehicle_id: 'vehicle-uuid',
  problem_description: 'Motor fazendo barulho',
  status: 'scheduled',
  priority: 'normal'
});
```
