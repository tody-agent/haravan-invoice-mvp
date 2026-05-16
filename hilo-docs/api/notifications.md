# Notifications API

## Overview

The Notifications API provides a notification center for users to track invoice status changes, system updates, and aggregate operation results. Currently uses mock data (in production: backed by D1 database).

## Authentication

All endpoints require Bearer token authentication.

```
Authorization: Bearer <token>
```

---

## GET /api/v1/notifications

List all notifications with optional filters.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filter` | string | `"all"` | `"all"` or `"unread"` — filter by read status |
| `type` | string | `""` | `"success"`, `"warning"`, `"error"`, `"info"` — filter by notification type |

### Response

**200 OK**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1",
        "type": "success",
        "title": "Hóa đơn đã phát hành",
        "message": "HRV-INV-001-001 đã được CQT chấp nhận",
        "time": "2026-05-16T10:30:00.000Z",
        "read": false,
        "link": "/invoices/inv-001",
        "category": "invoice"
      }
    ],
    "total": 5,
    "unreadCount": 2
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `items` | array | List of notifications |
| `items[].id` | string | Notification ID |
| `items[].type` | string | One of: `success`, `warning`, `error`, `info` |
| `items[].title` | string | Short notification title |
| `items[].message` | string | Detailed notification message |
| `items[].time` | string | ISO 8601 timestamp |
| `items[].read` | boolean | Whether the notification has been read |
| `items[].link` | string | Optional navigation link |
| `items[].category` | string | One of: `invoice`, `system`, `aggregate` |
| `total` | number | Total notifications matching filter |
| `unreadCount` | number | Total unread notifications (ignores filter) |

---

## PATCH /api/v1/notifications/:id/read

Mark a single notification as read.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Notification ID |

### Response

**200 OK**
```json
{
  "success": true
}
```

---

## POST /api/v1/notifications/read-all

Mark all notifications as read.

### Response

**200 OK**
```json
{
  "success": true,
  "message": "Đã đánh dấu tất cả đã đọc"
}
```

---

## GET /api/v1/notifications/unread-count

Get the count of unread notifications.

### Response

**200 OK**
```json
{
  "success": true,
  "data": {
    "count": 2
  }
}
```

---

## Examples

**List all notifications**
```bash
curl -H "Authorization: Bearer <token>" \
  https://api.example.com/api/v1/notifications
```

**List unread only**
```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.example.com/api/v1/notifications?filter=unread"
```

**Filter by type**
```bash
curl -H "Authorization: Bearer <token>" \
  "https://api.example.com/api/v1/notifications?type=error"
```

**Mark as read**
```bash
curl -X PATCH -H "Authorization: Bearer <token>" \
  https://api.example.com/api/v1/notifications/1/read
```

**Mark all as read**
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  https://api.example.com/api/v1/notifications/read-all
```

**Get unread count**
```bash
curl -H "Authorization: Bearer <token>" \
  https://api.example.com/api/v1/notifications/unread-count
```

---

## Notification Categories

| Category | Icon | Description |
|----------|------|-------------|
| `invoice` | `ti ti-receipt` | Invoice lifecycle events (issued, rejected, pending) |
| `system` | `ti ti-settings` | System updates and maintenance |
| `aggregate` | `ti ti-git-merge` | Daily aggregate (gộp đơn) operations |

## Notes

- Currently uses in-memory mock data; will be backed by D1 in production
- `unreadCount` always returns the global count regardless of `filter` parameter
- Clicking a notification with a `link` navigates to that route and marks it as read
