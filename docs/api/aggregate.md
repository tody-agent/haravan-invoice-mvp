---
title: 'API Aggregate, MST Lookup, One-Click Issue'
description: 'Tài liệu API Aggregate (gộp bill cuối ngày), MST Lookup (tra cứu mã số thuế), và One-Click Issue (phát hành nhanh).'
keywords: 'aggregate API, MST lookup API, one-click issue API, tax code lookup'
robots: 'index, follow'
---

# API Aggregate, MST Lookup, One-Click Issue

> Daily aggregate, MST tax code lookup, và one-click invoice issue endpoints.

:::tip Tóm tắt
3 API endpoints đặc thù: Aggregate (tổng hợp bill cuối ngày theo NĐ 70), MST Lookup (tra cứu doanh nghiệp theo mã số thuế), One-Click Issue (phát hành HĐ nhanh từ POS).
:::

## GET /api/v1/aggregate

Xem [API Settings](./settings.md) để biết chi tiết.

## GET /api/v1/mst/lookup

Xem [API Settings](./settings.md) để biết chi tiết.

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
    "id": "inv-oc-001",
    "status": "issued",
    "orderId": "order-123",
    "channel": "pos",
    "total": 500000,
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
    "message": "Không tìm thấy đơn hàng order-123"
  }
}
```

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Gộp hóa đơn cuối ngày](../sop/daily-aggregate.md)
- [Tạo hóa đơn](../sop/create-invoice.md)
