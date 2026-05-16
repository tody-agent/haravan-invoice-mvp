---
title: 'API Customers — Customer list, detail và analytics'
description: 'Tài liệu API Customers: danh sách, chi tiết và phân tích doanh thu theo khách hàng.'
keywords: 'customers API, customer analytics, customer list, MST lookup'
robots: 'index, follow'
---

# API Customers

> Customer endpoints: danh sách, chi tiết profile, và analytics theo khách hàng.

:::tip Tóm tắt
Customer API có 3 endpoints: GET / (list), GET /:id (detail), GET /:id/analytics (phân tích). Khách hàng được auto-extract từ invoice items.
:::

## GET /api/v1/customers

Danh sách khách hàng.

### Query parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| search | string | — | Tìm theo tên hoặc MST |
| page | number | 1 | Trang |
| pageSize | number | 20 | Items/trang |

### Response 200

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cust-001",
        "name": "Công ty ABC",
        "mst": "0123456789",
        "email": "billing@abc.com",
        "invoiceCount": 15,
        "totalRevenue": 50000000
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

## GET /api/v1/customers/:id

Chi tiết khách hàng.

### Response 200

```json
{
  "success": true,
  "data": {
    "id": "cust-001",
    "name": "Công ty ABC",
    "mst": "0123456789",
    "address": "123 Đường ABC",
    "email": "billing@abc.com",
    "phone": "0901234567",
    "createdAt": "2026-01-15T08:00:00Z"
  }
}
```

## GET /api/v1/customers/:id/analytics

Phân tích theo khách hàng.

### Response 200

```json
{
  "success": true,
  "data": {
    "customer": { "id": "cust-001", "name": "Công ty ABC" },
    "stats": {
      "totalInvoices": 15,
      "totalRevenue": 50000000,
      "avgOrderValue": 3333333,
      "firstInvoice": "2026-01-15",
      "lastInvoice": "2026-05-10"
    },
    "monthly": [
      { "month": "2026-05", "count": 3, "revenue": 10000000 }
    ],
    "channels": {
      "admin": { "count": 10, "revenue": 35000000 },
      "pos": { "count": 5, "revenue": 15000000 }
    }
  }
}
```

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Quản lý khách hàng](../sop/customers.md)
