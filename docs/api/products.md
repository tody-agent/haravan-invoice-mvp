---
title: 'API Products, Reports, Analytics — Product catalog và báo cáo'
description: 'Tài liệu API Products (danh sách sản phẩm), Reports (summary, monthly), và Analytics (channels, top customers, top SKUs).'
keywords: 'products API, reports API, analytics API, product catalog, sales report'
robots: 'index, follow'
---

# API Products, Reports, Analytics

> Product catalog auto-extracted từ invoice items, báo cáo summary/monthly, và analytics data.

:::tip Tóm tắt
3 nhóm API: Products (GET /products), Reports (GET /reports/summary, /reports/monthly), Analytics (GET /analytics/channels, /top-customers, /top-skus). Tất cả yêu cầu Bearer token.
:::

## GET /api/v1/products

Danh sách sản phẩm auto-extracted từ invoice items.

### Query parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| search | string | — | Tìm theo tên hoặc SKU |
| page | number | 1 | Trang |
| pageSize | number | 20 | Items/trang |

### Response 200

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "sku": "SKU-001",
        "name": "Sản phẩm A",
        "totalQty": 150,
        "totalRevenue": 75000000,
        "invoiceCount": 45
      }
    ],
    "total": 30,
    "page": 1,
    "pageSize": 20,
    "totalPages": 2
  }
}
```

## GET /api/v1/reports/summary

KPI summary report.

### Response 200

```json
{
  "success": true,
  "data": {
    "totalIssued": 150,
    "totalPending": 5,
    "totalError": 2,
    "revenueThisMonth": 500000000,
    "revenueLastMonth": 450000000
  }
}
```

## GET /api/v1/reports/monthly

Báo cáo hàng tháng.

### Query parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| month | string | current | Tháng (YYYY-MM) |

### Response 200

```json
{
  "success": true,
  "data": {
    "month": "2026-05",
    "invoices": [
      {
        "id": "inv-001",
        "haravanId": "HV-001",
        "buyerName": "Công ty ABC",
        "total": 1100000,
        "status": "issued",
        "issueDate": "2026-05-16"
      }
    ],
    "summary": {
      "count": 150,
      "totalAmount": 500000000,
      "taxAmount": 50000000
    }
  }
}
```

## GET /api/v1/analytics/channels

Revenue grouped by sales channel.

### Query parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| days | number | 30 | Số ngày |

### Response 200

```json
{
  "success": true,
  "data": {
    "admin": { "count": 80, "revenue": 300000000 },
    "pos": { "count": 50, "revenue": 150000000 },
    "web": { "count": 20, "revenue": 50000000 }
  }
}
```

## GET /api/v1/analytics/top-customers

Top 20 customers by revenue.

### Response 200

```json
{
  "success": true,
  "data": [
    { "name": "Công ty ABC", "mst": "0123456789", "invoiceCount": 15, "revenue": 50000000 }
  ]
}
```

## GET /api/v1/analytics/top-skus

Top 10 SKUs by quantity sold.

### Response 200

```json
{
  "success": true,
  "data": [
    { "sku": "SKU-001", "name": "Sản phẩm A", "quantity": 150, "revenue": 75000000 }
  ]
}
```

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Quản lý sản phẩm](../sop/products.md)
- [Phân tích](../sop/analytics.md)
