---
title: 'API Invoices — CRUD, replace, adjust, one-click issue'
description: 'Tài liệu API Invoices: tạo, liệt kê, xem chi tiết, thay thế, điều chỉnh và phát hành 1-click.'
keywords: 'invoices API, CRUD, replace, adjust, one-click, invoice management'
robots: 'index, follow'
---

# API Invoices

> CRUD operations cho hóa đơn điện tử: tạo, liệt kê, xem chi tiết, thay thế, điều chỉnh và phát hành 1-click.

:::tip Tóm tắt
Invoice API có 6 endpoints: POST / (tạo), GET / (list), GET /:id (detail), POST /:id/replace (thay thế), POST /:id/adjust (điều chỉnh), POST /one-click (phát hành nhanh). Tất cả yêu cầu Bearer token.
:::

## POST /api/v1/invoices

Tạo hóa đơn mới.

### Request

```json
{
  "buyer": {
    "name": "Công ty ABC",
    "mst": "0123456789",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "email": "billing@abc.com"
  },
  "items": [
    {
      "name": "Sản phẩm A",
      "sku": "SKU-001",
      "quantity": 2,
      "unitPrice": 500000,
      "taxRate": 0.1,
      "total": 1000000
    }
  ],
  "paymentMethod": "transfer",
  "channel": "admin"
}
```

### Idempotency

```
X-Idempotency-Key: unique-key-123
```

### Response 201

```json
{
  "success": true,
  "data": {
    "id": "inv-abc123",
    "haravanId": "HV-001",
    "status": "issued",
    "buyer": { "name": "Công ty ABC", "mst": "0123456789" },
    "totals": { "subtotal": 1000000, "taxAmount": 100000, "total": 1100000 },
    "createdAt": "2026-05-16T10:00:00Z"
  }
}
```

### Response 400

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Tên người mua không được để trống"
  }
}
```

## GET /api/v1/invoices

Liệt kê hóa đơn với filter và pagination.

### Query parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| status | string[] | — | Filter theo status (comma-separated) |
| dateFrom | string | — | Từ ngày (YYYY-MM-DD) |
| dateTo | string | — | Đến ngày (YYYY-MM-DD) |
| buyerMst | string | — | Filter theo MST |
| buyerName | string | — | Filter theo tên |
| page | number | 1 | Trang |
| pageSize | number | 20 | Số items/trang |

### Example

```
GET /api/v1/invoices?status=issued&dateFrom=2026-05-01&page=1&pageSize=20
```

### Response 200

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
  }
}
```

## GET /api/v1/invoices/:id

Xem chi tiết hóa đơn.

### Response 200

```json
{
  "success": true,
  "data": {
    "id": "inv-abc123",
    "status": "issued",
    "buyer": { "name": "Công ty ABC", "mst": "0123456789" },
    "seller": { "name": "Công ty XYZ", "mst": "9876543210" },
    "items": [...],
    "totals": { "subtotal": 1000000, "taxAmount": 100000, "total": 1100000 },
    "createdAt": "2026-05-16T10:00:00Z",
    "version": 1
  }
}
```

### Response 404

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Hóa đơn không tồn tại"
  }
}
```

## POST /api/v1/invoices/:id/replace

Thay thế hóa đơn (NĐ 70/2025).

### Request

```json
{
  "buyer": { "name": "Công ty ABC (mới)", "mst": "0123456789" },
  "items": [...],
  "reason": "Sai MST người mua"
}
```

### Response 200

```json
{
  "success": true,
  "data": {
    "id": "inv-new456",
    "status": "issued",
    "replaces": "inv-abc123",
    ...
  }
}
```

## POST /api/v1/invoices/:id/adjust

Điều chỉnh hóa đơn.

### Request

```json
{
  "type": "increase",
  "items": [{ "name": "Sản phẩm A", "quantity": 1, "unitPrice": 500000, "total": 500000 }],
  "reason": "Bổ sung sản phẩm thiếu"
}
```

### Response 200

```json
{
  "success": true,
  "data": {
    "id": "inv-adj789",
    "status": "adjusted",
    "adjusts": "inv-abc123",
    ...
  }
}
```

## POST /api/v1/invoices/one-click

Phát hành hóa đơn 1-click từ POS/Web.

### Request

```json
{
  "orderId": "order-123",
  "channel": "pos"
}
```

### Response 201

```json
{
  "success": true,
  "data": {
    "id": "inv-oneclick",
    "status": "issued",
    "orderId": "order-123",
    ...
  }
}
```

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Tạo hóa đơn](../sop/create-invoice.md)
- [Xử lý sai sót](../sop/correct-invoice.md)
