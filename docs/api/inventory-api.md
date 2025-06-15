
# Inventory API Documentation

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

### GET /inventory-api
Get all inventory items with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `search` (string, optional): Search in name, description, SKU, barcode
- `category` (string, optional): Filter by category
- `status` (string, optional): Filter by status (active/inactive)
- `low_stock` (boolean, optional): Filter items with low stock

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Óleo Motor 5W30",
        "description": "Óleo sintético para motor",
        "sku": "OIL-5W30-001",
        "barcode": "7891234567890",
        "category": "Lubrificantes",
        "brand": "Castrol",
        "unit": "litro",
        "current_stock": 25,
        "minimum_stock": 10,
        "maximum_stock": 100,
        "cost_price": 45.00,
        "sale_price": 65.00,
        "margin_percentage": 44.44,
        "location": "Estoque A",
        "shelf": "A1-02",
        "supplier_name": "Distribuidora ABC",
        "status": "active",
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

### GET /inventory-api/{id}
Get a specific inventory item by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Óleo Motor 5W30",
    "description": "Óleo sintético para motor de alta performance",
    "sku": "OIL-5W30-001",
    "barcode": "7891234567890",
    "category": "Lubrificantes",
    "brand": "Castrol",
    "unit": "litro",
    "current_stock": 25,
    "minimum_stock": 10,
    "maximum_stock": 100,
    "cost_price": 45.00,
    "sale_price": 65.00,
    "margin_percentage": 44.44,
    "location": "Estoque A",
    "shelf": "A1-02",
    "supplier_name": "Distribuidora ABC",
    "supplier_code": "CST-5W30",
    "technical_specs": {
      "viscosity": "5W-30",
      "api_rating": "SN",
      "volume": "1L"
    },
    "track_stock": true,
    "allow_negative_stock": false,
    "status": "active",
    "notes": "Produto de alta qualidade",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /inventory-api
Create a new inventory item.

**Request Body:**
```json
{
  "name": "Filtro de Óleo",
  "description": "Filtro de óleo para motores 1.0 a 2.0",
  "sku": "FILTER-OIL-001",
  "barcode": "7891234567891",
  "category": "Filtros",
  "brand": "Mann",
  "unit": "unidade",
  "current_stock": 50,
  "minimum_stock": 20,
  "maximum_stock": 200,
  "cost_price": 25.00,
  "sale_price": 40.00,
  "location": "Estoque B",
  "shelf": "B2-15",
  "supplier_name": "Fornecedor XYZ",
  "supplier_code": "MANN-W811",
  "technical_specs": {
    "thread": "M20x1.5",
    "height": "65mm",
    "diameter": "76mm"
  },
  "notes": "Compatible com VW, Ford, GM"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Filtro de Óleo",
    // ... all inventory item fields
  },
  "message": "Inventory item created successfully"
}
```

### PUT /inventory-api/{id}
Update an existing inventory item.

**Request Body:** (partial inventory item data)
```json
{
  "current_stock": 45,
  "cost_price": 27.00,
  "sale_price": 42.00,
  "notes": "Preço atualizado"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    // ... updated inventory item data
  },
  "message": "Inventory item updated successfully"
}
```

### DELETE /inventory-api/{id}
Delete an inventory item.

**Response:**
```json
{
  "success": true,
  "message": "Inventory item deleted successfully"
}
```

## Stock Management

### Low Stock Detection
Items are considered low stock when `current_stock <= minimum_stock`. Use the `low_stock=true` parameter to filter these items.

### Stock Movement Tracking
Stock movements are tracked automatically through the system. Each change in stock levels creates a movement record.

## Categories
Common inventory categories:
- Lubrificantes
- Filtros
- Peças de Motor
- Peças de Freio
- Pneus
- Baterias
- Acessórios

## Usage Examples

### JavaScript/TypeScript
```typescript
import { inventoryApi } from '@/services/inventoryApi';

// Get inventory items with filters
const response = await inventoryApi.getInventoryItems({
  page: 1,
  limit: 20,
  category: 'Lubrificantes',
  low_stock: true
});

// Create an inventory item
const newItem = await inventoryApi.createInventoryItem({
  name: 'Óleo Motor 5W30',
  category: 'Lubrificantes',
  current_stock: 25,
  minimum_stock: 10,
  cost_price: 45.00,
  sale_price: 65.00
});
```
