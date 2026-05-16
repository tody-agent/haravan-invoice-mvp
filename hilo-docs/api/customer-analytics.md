---
title: "Customer Analytics API"
description: "API reference for Customer Analytics — per-customer stats, monthly trends, channel breakdown"
---

# Customer Analytics API

> **Quick Reference**
> - **Base URL**: `/api/v1/customers`
> - **Auth**: Bearer Token
> - **Content-Type**: `application/json`

## Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/customers/:id/analytics` | Thống kê chi tiết khách hàng | ✅ |

---

## GET /api/v1/customers/:id/analytics

Thống kê chi tiết cho một khách hàng cụ thể: tổng hóa đơn, doanh thu, xu hướng theo tháng, phân bổ theo kênh.

### Path Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | ID của khách hàng |

### Response 200

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "cust-001",
      "name": "Công ty TNHH ABC",
      "mst": "0123456789",
      "address": "123 Nguyễn Huệ, Q1, TP.HCM",
      "email": "abc@example.com",
      "phone": "0901234567"
    },
    "stats": {
      "totalInvoices": 25,
      "totalRevenue": 120000000,
      "avgOrderValue": 4800000,
      "firstInvoice": "2025-01-15T08:30:00Z",
      "lastInvoice": "2026-05-10T14:20:00Z"
    },
    "monthly": [
      {
        "month": "2026-05",
        "count": 3,
        "total": 15000000
      },
      {
        "month": "2026-04",
        "count": 5,
        "total": 22000000
      }
    ],
    "channels": [
      {
        "channel": "pos",
        "count": 15,
        "total": 70000000
      },
      {
        "channel": "web",
        "count": 10,
        "total": 50000000
      }
    ]
  }
}
```

### Response Fields

#### customer

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | ID khách hàng |
| `name` | string | Tên khách hàng |
| `mst` | string | Mã số thuế |
| `address` | string | Địa chỉ |
| `email` | string | Email |
| `phone` | string | Số điện thoại |

#### stats

| Field | Type | Description |
|-------|------|-------------|
| `totalInvoices` | number | Tổng số hóa đơn (chỉ tính status `issued` hoặc `cqt_accepted`) |
| `totalRevenue` | number | Tổng doanh thu (VND) |
| `avgOrderValue` | number | Giá trị trung bình mỗi hóa đơn (VND) |
| `firstInvoice` | string | Ngày hóa đơn đầu tiên (ISO 8601) |
| `lastInvoice` | string | Ngày hóa đơn gần nhất (ISO 8601) |

#### monthly[]

| Field | Type | Description |
|-------|------|-------------|
| `month` | string | Tháng (format: `YYYY-MM`) |
| `count` | number | Số hóa đơn trong tháng |
| `total` | number | Tổng doanh thu tháng (VND) |

#### channels[]

| Field | Type | Description |
|-------|------|-------------|
| `channel` | string | Kênh bán hàng (`admin`, `pos`, `web`, `auto`) |
| `count` | number | Số hóa đơn trong kênh |
| `total` | number | Tổng doanh thu kênh (VND) |

---

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Missing or invalid Authorization header"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND"
  }
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

- Endpoint yêu cầu `Authorization: Bearer <token>` header
- Hóa đơn được tính khi `status` là `issued` hoặc `cqt_accepted`
- `monthly` trả về tối đa 12 tháng gần nhất, sắp xếp theo tháng giảm dần
- `channels` nhóm theo trường `channel` trong bảng invoices
- `avgOrderValue` = `totalRevenue / totalInvoices`
