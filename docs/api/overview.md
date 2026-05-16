---
title: 'Tổng quan API Haravan Invoice — 25+ REST endpoints'
description: 'Tài liệu tổng quan API Haravan Invoice MVP với 25+ endpoints, authentication, và response format.'
keywords: 'API overview, REST API, endpoints, authentication, Bearer token, response format'
robots: 'index, follow'
---

# Tổng quan API

> Tài liệu tham khảo cho 25+ REST API endpoints của Haravan Invoice MVP, bao gồm authentication, request/response format, và examples.

:::tip Tóm tắt
Haravan Invoice API xây dựng trên Hono framework, chạy trên Cloudflare Workers. Tất cả endpoints yêu cầu Bearer token authentication (trừ health và login). Base URL: `/api/v1`.
:::

## Base URL

```
Development: http://localhost:8787/api/v1
Production: https://your-worker.workers.dev/api/v1
```

## Authentication

Tất cả endpoints (trừ `/health` và `/auth/login`) yêu cầu Bearer token:

```
Authorization: Bearer <jwt_token>
```

Lấy token từ [POST /auth/login](./auth.md).

## Response Format

### Success response

```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

### Error response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Tên người mua không được để trống"
  }
}
```

## Endpoints Summary

| Resource | Endpoints | Tài liệu |
|---|---|---|
| Auth | POST /login | [Auth](./auth.md) |
| Invoices | POST, GET, GET/:id, POST/:id/replace, POST/:id/adjust, POST/:id/one-click | [Invoices](./invoices.md) |
| PDF | GET /:id/pdf | [PDF](./pdf.md) |
| Audit | GET /:id/audit | [Invoices](./invoices.md) |
| Customers | GET, GET/:id, GET/:id/analytics | [Customers](./customers.md) |
| Products | GET | [Products](./products.md) |
| Reports | GET /summary, GET /monthly | [Reports](./reports.md) |
| Analytics | GET /channels, /top-customers, /top-skus | [Analytics](./analytics.md) |
| Settings | GET/PATCH /templates, /automation, GET /plan | [Settings](./settings.md) |
| Notifications | GET, PATCH/:id/read, POST /read-all, GET /unread-count | [Notifications](./notifications.md) |
| Aggregate | GET | [Aggregate](./aggregate.md) |
| MST Lookup | GET /lookup | [MST Lookup](./mst-lookup.md) |
| Config | GET, PATCH | [Health & Config](./health-config.md) |
| Health | GET / | [Health & Config](./health-config.md) |

## Idempotency

Hỗ trợ idempotency key cho POST requests:

```
X-Idempotency-Key: unique-key-here
```

Key được cache trong KV với TTL 24 giờ.

## Liên kết liên quan

- [Kiến trúc hệ thống](../tech/architecture.md)
- [Hướng dẫn sử dụng](../sop/getting-started.md)
- [API Auth](./auth.md)
