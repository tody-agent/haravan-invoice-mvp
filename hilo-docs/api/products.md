# Products API

## Overview

The Products API provides a read-only view of unique products extracted from invoice items. Since there is no dedicated products table, the system aggregates product data from existing invoices.

## Authentication

All endpoints require Bearer token authentication.

```
Authorization: Bearer <token>
```

---

## GET /api/v1/products

List unique products with search and pagination support.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | `""` | Filter by product name or SKU (case-insensitive) |
| `page` | number | `1` | Page number |
| `pageSize` | number | `20` | Items per page |

### Response

**200 OK**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "name": "Sản phẩm A",
        "sku": "SP001",
        "totalQty": 150,
        "totalRevenue": 15000000,
        "invoiceCount": 25
      }
    ],
    "total": 42,
    "page": 1,
    "pageSize": 20
  }
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid Authorization header"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `items` | array | List of products |
| `items[].name` | string | Product name from invoice item |
| `items[].sku` | string | Product SKU (empty string if not set) |
| `items[].totalQty` | number | Total quantity sold across all invoices |
| `items[].totalRevenue` | number | Total revenue in VND |
| `items[].invoiceCount` | number | Number of invoices containing this product |
| `total` | number | Total number of unique products (after search filter) |
| `page` | number | Current page number |
| `pageSize` | number | Items per page |

### Examples

**List all products**
```bash
curl -H "Authorization: Bearer <token>" \
  https://api.example.com/api/v1/products
```

**Search by name**
```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.example.com/api/v1/products?search=iphone"
```

**Search by SKU**
```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.example.com/api/v1/products?search=SP001"
```

**Pagination**
```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.example.com/api/v1/products?page=2&pageSize=10"
```

---

## Notes

- Products are extracted from the `items` JSON column in the `invoices` table
- Each invoice item should have `name`, `sku` (optional), `quantity`, and `total` fields
- Products with the same SKU (or name if SKU is empty) are aggregated together
- The API is read-only; products are created automatically when invoices are created
