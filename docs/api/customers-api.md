
# Customers API Documentation

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

### GET /customers-api
Get all customers with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `search` (string, optional): Search in name, email, phone, document
- `status` (string, optional): Filter by status (active/inactive)
- `customer_type` (string, optional): Filter by type (individual/business)

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "uuid",
        "name": "João Silva",
        "email": "joao@email.com",
        "phone": "(11) 99999-9999",
        "document_number": "123.456.789-00",
        "document_type": "cpf",
        "customer_type": "individual",
        "status": "active",
        "preferred_contact": "phone",
        "vehicles_count": 2,
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

### GET /customers-api/{id}
Get a specific customer by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999",
    "document_number": "123.456.789-00",
    "document_type": "cpf",
    "customer_type": "individual",
    "status": "active",
    "preferred_contact": "phone",
    "secondary_phone": "(11) 88888-8888",
    "notes": "Cliente VIP",
    "address": {
      "street": "Rua das Flores",
      "number": "123",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234-567"
    },
    "tags": ["vip", "particular"],
    "vehicles_count": 2,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /customers-api
Create a new customer.

**Request Body:**
```json
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "phone": "(21) 99999-9999",
  "document_number": "987.654.321-00",
  "document_type": "cpf",
  "customer_type": "individual",
  "preferred_contact": "email",
  "secondary_phone": "(21) 88888-8888",
  "notes": "Cliente novo",
  "address": {
    "street": "Avenida Principal",
    "number": "456",
    "city": "Rio de Janeiro",
    "state": "RJ",
    "zipCode": "20000-000"
  },
  "tags": ["novo"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Maria Santos",
    // ... all customer fields
  },
  "message": "Customer created successfully"
}
```

### PUT /customers-api/{id}
Update an existing customer.

**Request Body:** (partial customer data)
```json
{
  "email": "novoemail@email.com",
  "phone": "(11) 99999-0000",
  "status": "inactive"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    // ... updated customer data
  },
  "message": "Customer updated successfully"
}
```

### DELETE /customers-api/{id}
Delete a customer.

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

### GET /customers-stats
Get customer statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCustomers": 150,
    "newThisMonth": 12,
    "totalRevenue": 45000.00,
    "averageTicket": 300.00,
    "activeCustomers": 140,
    "inactiveCustomers": 10,
    "individualCustomers": 120,
    "businessCustomers": 30
  }
}
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `405`: Method Not Allowed
- `500`: Internal Server Error

## Usage Examples

### JavaScript/TypeScript
```typescript
import { customersApi } from '@/services/customersApi';

// Get customers with filters
const response = await customersApi.getCustomers({
  page: 1,
  limit: 20,
  search: 'João',
  status: 'active'
});

// Create a customer
const newCustomer = await customersApi.createCustomer({
  name: 'João Silva',
  phone: '(11) 99999-9999',
  customer_type: 'individual',
  preferred_contact: 'phone'
});

// Get customer stats
const stats = await customersApi.getCustomerStats();
```

### cURL Examples
```bash
# Get customers
curl -X GET "https://bszcwxrjhvbvixrdnzvf.supabase.co/functions/v1/customers-api?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create customer
curl -X POST "https://bszcwxrjhvbvixrdnzvf.supabase.co/functions/v1/customers-api" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "phone": "(11) 99999-9999",
    "customer_type": "individual",
    "preferred_contact": "phone"
  }'
```

## MCP Server Integration

This API is designed to work seamlessly with MCP (Model Context Protocol) servers, allowing AI assistants to:

1. **Query customer data** with natural language filters
2. **Create and update customers** based on conversational input
3. **Generate reports** using customer statistics
4. **Respect permission boundaries** automatically

The API provides structured, consistent responses that are easy for AI models to parse and understand.
