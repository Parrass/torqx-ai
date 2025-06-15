
# Vehicles API Documentation

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

### GET /vehicles-api
Get all vehicles with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `search` (string, optional): Search in brand, model, license plate
- `customer_id` (string, optional): Filter by customer ID
- `status` (string, optional): Filter by status (active/inactive)

**Response:**
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": "uuid",
        "customer_id": "uuid",
        "brand": "Volkswagen",
        "model": "Gol",
        "year": 2020,
        "license_plate": "ABC-1234",
        "color": "Branco",
        "fuel_type": "Flex",
        "engine_size": "1.0",
        "transmission": "Manual",
        "current_mileage": 50000,
        "status": "active",
        "customers": {
          "name": "João Silva",
          "phone": "(11) 99999-9999",
          "email": "joao@email.com"
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

### GET /vehicles-api/{id}
Get a specific vehicle by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customer_id": "uuid",
    "brand": "Volkswagen",
    "model": "Gol",
    "year": 2020,
    "license_plate": "ABC-1234",
    "color": "Branco",
    "fuel_type": "Flex",
    "engine_size": "1.0",
    "transmission": "Manual",
    "vin_chassis": "9BWZZZ377VT004251",
    "current_mileage": 50000,
    "technical_specs": {
      "doors": 4,
      "seats": 5
    },
    "maintenance_intervals": {
      "oil_change": 10000,
      "filter_change": 20000
    },
    "condition_notes": "Veículo em bom estado",
    "notes": "Cliente preferencial",
    "status": "active",
    "customers": {
      "name": "João Silva",
      "phone": "(11) 99999-9999",
      "email": "joao@email.com"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /vehicles-api
Create a new vehicle.

**Request Body:**
```json
{
  "customer_id": "uuid",
  "brand": "Honda",
  "model": "Civic",
  "year": 2022,
  "license_plate": "DEF-5678",
  "color": "Prata",
  "fuel_type": "Gasolina",
  "engine_size": "2.0",
  "transmission": "Automático",
  "vin_chassis": "1HGBH41JXMN109186",
  "current_mileage": 25000,
  "technical_specs": {
    "doors": 4,
    "seats": 5,
    "turbo": true
  },
  "condition_notes": "Veículo novo",
  "notes": "Primeira revisão em dia"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customer_id": "uuid",
    "brand": "Honda",
    "model": "Civic",
    // ... all vehicle fields
  },
  "message": "Vehicle created successfully"
}
```

### PUT /vehicles-api/{id}
Update an existing vehicle.

**Request Body:** (partial vehicle data)
```json
{
  "current_mileage": 55000,
  "condition_notes": "Pequeno arranhão na porta",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    // ... updated vehicle data
  },
  "message": "Vehicle updated successfully"
}
```

### DELETE /vehicles-api/{id}
Delete a vehicle.

**Response:**
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
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
import { vehiclesApi } from '@/services/vehiclesApi';

// Get vehicles with filters
const response = await vehiclesApi.getVehicles({
  page: 1,
  limit: 20,
  search: 'Gol',
  customer_id: 'customer-uuid'
});

// Create a vehicle
const newVehicle = await vehiclesApi.createVehicle({
  customer_id: 'customer-uuid',
  brand: 'Volkswagen',
  model: 'Gol',
  year: 2020,
  license_plate: 'ABC-1234'
});
```
