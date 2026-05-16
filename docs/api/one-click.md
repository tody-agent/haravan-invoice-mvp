---
title: 'API One-Click Issue — Phát hành hóa đơn 1-click từ POS'
description: 'Tài liệu API One-Click Issue endpoint cho phát hành hóa đơn nhanh từ POS/Web.'
keywords: 'one-click API, quick issue, POS invoice, auto-issue'
robots: 'index, follow'
---

# API One-Click Issue

> Phát hành hóa đơn 1-click từ POS/Web — tự động lấy thông tin từ đơn hàng và gửi T-VAN.

:::tip Tóm tắt
POST /api/v1/invoices/one-click nhận orderId và channel, tự động tạo hóa đơn từ đơn hàng và phát hành qua TVAN adapter. Dành cho POS và Web checkout.
:::

## POST /api/v1/invoices/one-click

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

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Tạo hóa đơn](../sop/create-invoice.md)
- [Gộp hóa đơn cuối ngày](../sop/daily-aggregate.md)
