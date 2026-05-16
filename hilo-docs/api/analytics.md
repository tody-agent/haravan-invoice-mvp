---
title: "Analytics API"
description: "API reference for Analytics — omnichannel revenue, top customers, top SKUs"
---

# Analytics API

> **Quick Reference**
> - **Base URL**: `/api/v1/analytics`
> - **Auth**: Bearer Token
> - **Content-Type**: `application/json`

## Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/analytics/channels` | Doanh thu theo kênh bán hàng | ✅ |
| GET | `/api/v1/analytics/top-customers` | Top 20 khách hàng theo doanh thu | ✅ |
| GET | `/api/v1/analytics/top-skus` | Top 10 sản phẩm theo số lượng | ✅ |

---

## GET /api/v1/analytics/channels

Doanh thu nhóm theo kênh bán hàng (admin, pos, web, auto).

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `days` | number | `30` | Số ngày tính từ hôm nay |

### Response 200

```json
{
  "success": true,
  "data": [
    {
      "channel": "pos",
      "count": 150,
      "total": 45000000
    },
    {
      "channel": "web",
      "count": 80,
      "total": 32000000
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `channel` | string | Kênh bán hàng (`admin`, `pos`, `web`, `auto`) |
| `count` | number | Số hóa đơn trong kênh |
| `total` | number | Tổng doanh thu (VND) |

---

## GET /api/v1/analytics/top-customers

Top 20 khách hàng theo tổng doanh thu.

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `days` | number | `30` | Số ngày tính từ hôm nay |

### Response 200

```json
{
  "success": true,
  "data": [
    {
      "name": "Công ty TNHH ABC",
      "mst": "0123456789",
      "invoiceCount": 25,
      "total": 120000000
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Tên khách hàng |
| `mst` | string | Mã số thuế |
| `invoiceCount` | number | Số hóa đơn |
| `total` | number | Tổng doanh thu (VND) |

---

## GET /api/v1/analytics/top-skus

Top 10 sản phẩm theo số lượng bán. Dữ liệu được tổng hợp từ trường `items` (JSON) của hóa đơn.

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `days` | number | `30` | Số ngày tính từ hôm nay |

### Response 200

```json
{
  "success": true,
  "data": [
    {
      "name": "Sản phẩm A",
      "sku": "SKU-001",
      "qty": 500,
      "revenue": 25000000
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Tên sản phẩm |
| `sku` | string | Mã SKU |
| `qty` | number | Tổng số lượng bán |
| `revenue` | number | Tổng doanh thu (VND) |

---

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Missing or invalid Authorization header"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Notes

- Tất cả endpoints yêu cầu `Authorization: Bearer <token>` header
- Hóa đơn được tính khi `status` là `issued` hoặc `cqt_accepted`
- Bộ lọc thời gian dựa trên `created_at` (không phải `issue_date`)
- `top-skus` parse trường `items` (JSON array) từ mỗi hóa đơn để tổng hợp SKU
