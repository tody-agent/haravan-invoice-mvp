---
title: 'API Settings, Notifications, Aggregate, MST Lookup'
description: 'Tài liệu API Settings (templates, automation, plan), Notifications, Aggregate, và MST Lookup.'
keywords: 'settings API, notifications API, aggregate API, MST lookup API, tax code'
robots: 'index, follow'
---

# API Settings, Notifications, Aggregate, MST Lookup

> Settings management, notifications, daily aggregate, và MST tax code lookup endpoints.

:::tip Tóm tắt
4 nhóm API: Settings (templates, automation, plan), Notifications (CRUD + unread count), Aggregate (daily totals), MST Lookup (tra cứu mã số thuế).
:::

## GET /api/v1/settings/templates

Lấy cấu hình mẫu hóa đơn.

### Response 200

```json
{
  "success": true,
  "data": {
    "mauSo": "01GTKT0/001",
    "kyHieu": "AA/20E",
    "templateName": "Hóa đơn GTGT"
  }
}
```

## PATCH /api/v1/settings/templates

Cập nhật cấu hình mẫu hóa đơn.

### Request

```json
{
  "mauSo": "02GTTT0/001",
  "kyHieu": "BB/20E",
  "templateName": "Hóa đơn bán hàng"
}
```

## GET /api/v1/settings/automation

Lấy cấu hình tự động hóa.

### Response 200

```json
{
  "success": true,
  "data": {
    "autoIssueOnPaid": true,
    "channels": ["WEB", "POS"],
    "delayMinutes": 15,
    "notifyOnIssue": true,
    "notifyOnError": true
  }
}
```

## PATCH /api/v1/settings/automation

Cập nhật cấu hình tự động hóa.

### Request

```json
{
  "autoIssueOnPaid": true,
  "channels": ["WEB", "POS", "ADMIN"],
  "delayMinutes": 30,
  "notifyOnIssue": true,
  "notifyOnError": true
}
```

## GET /api/v1/settings/plan

Lấy thông tin gói dịch vụ.

### Response 200

```json
{
  "success": true,
  "data": {
    "planName": "Pro",
    "invoiceUsage": { "used": 150, "limit": 500 },
    "storageUsage": { "used": 250, "limit": 1000 },
    "features": [
      { "name": "Phát hành HĐ", "available": true },
      { "name": "AI Tiền-kiểm", "available": false }
    ]
  }
}
```

## GET /api/v1/notifications

Danh sách thông báo.

### Query parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| filter | string | all | all / unread |
| type | string | — | invoice / system / aggregate |

### Response 200

```json
{
  "success": true,
  "data": [
    {
      "id": "notif-001",
      "type": "invoice",
      "title": "Hóa đơn phát hành thành công",
      "message": "HĐ #HV-001 đã được phát hành",
      "time": "2026-05-16T10:00:00Z",
      "read": false,
      "category": "invoice"
    }
  ]
}
```

## PATCH /api/v1/notifications/:id/read

Đánh dấu thông báo đã đọc.

## POST /api/v1/notifications/read-all

Đánh dấu tất cả thông báo đã đọc.

## GET /api/v1/notifications/unread-count

Số thông báo chưa đọc.

### Response 200

```json
{
  "success": true,
  "data": { "count": 8 }
}
```

## GET /api/v1/aggregate

Dữ liệu gộp hóa đơn cuối ngày.

### Query parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| date | string | today | Ngày (YYYY-MM-DD) |

### Response 200

```json
{
  "success": true,
  "data": {
    "date": "2026-05-16",
    "totalQty": 200,
    "totalAmount": 50000000,
    "invoiceCount": 200
  }
}
```

## GET /api/v1/mst/lookup

Tra cứu thông tin doanh nghiệp theo MST.

### Query parameters

| Param | Type | Required | Mô tả |
|---|---|---|---|
| mst | string | ✅ | Mã số thuế (10 hoặc 13 số) |

### Response 200

```json
{
  "success": true,
  "data": {
    "mst": "0123456789",
    "name": "Công ty ABC",
    "address": "123 Đường ABC, Hà Nội",
    "status": "active"
  }
}
```

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Cấu hình mẫu hóa đơn](../sop/settings-templates.md)
- [Thông báo](../sop/notifications.md)
