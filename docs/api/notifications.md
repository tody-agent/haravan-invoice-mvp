---
title: 'API Notifications — Quản lý thông báo real-time'
description: 'Tài liệu API Notifications: list, mark read, read-all, unread count.'
keywords: 'notifications API, real-time alerts, mark read, unread count'
robots: 'index, follow'
---

# API Notifications

> Quản lý thông báo: danh sách, đánh dấu đã đọc, và đếm số chưa đọc.

:::tip Tóm tắt
Notifications API có 4 endpoints: GET / (list), PATCH /:id/read (mark single), POST /read-all (mark all), GET /unread-count. Dữ liệu mock in-memory, sẽ backed by D1 trong production.
:::

## GET /api/v1/notifications

Xem [API Settings](./settings.md) để biết chi tiết.

## PATCH /api/v1/notifications/:id/read

Đánh dấu thông báo đã đọc.

### Response 200

```json
{
  "success": true,
  "data": { "id": "notif-001", "read": true }
}
```

## POST /api/v1/notifications/read-all

Đánh dấu tất cả thông báo đã đọc.

### Response 200

```json
{
  "success": true,
  "data": { "count": 8 }
}
```

## GET /api/v1/notifications/unread-count

Số thông báo chưa đọc.

### Response 200

```json
{
  "success": true,
  "data": { "count": 5 }
}
```

## Category reference

| Category | Mô tả |
|---|---|
| invoice | Thông báo hóa đơn |
| system | Thông báo hệ thống |
| aggregate | Thông báo gộp bill |

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Thông báo](../sop/notifications.md)
