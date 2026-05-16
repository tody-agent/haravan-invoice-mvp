---
title: "API Reference"
description: "Tài liệu tham khảo API TVAN-HILO TCTN"
---

# API Reference

> **Quick Reference**
> - **Base URL**: `https://apitctn.hilo.com.vn`
> - **Auth Method**: Bearer token
> - **Response Format**: JSON
> - **API Version**: v1

## Authentication

```bash
# Include this header in all authenticated requests
Authorization: Bearer <your_access_token>
```

:::warning
API keys should never be exposed in client-side code. Use server-side proxying or environment variables.
:::

## Endpoints

| Resource | Endpoints | Base Path | Auth |
|----------|-----------|-----------|------|
| Authentication | 1 | `/api/authentication` | ✅ |
| Einvoicesolution | 4 | `/api/einvoicesolution` | ✅ |
| Resources | 2 | `/api/resources` | ✅ |

## Internal API Docs

| Doc | Description |
|-----|-------------|
| [Analytics](./analytics.md) | Sales channel distribution, top customers, top SKUs |
| [Products](./products.md) | Product catalog aggregated from invoice data |
| [Customer Analytics](./customer-analytics.md) | Per-customer KPIs, monthly trends, channel breakdown |
| [Notifications](./notifications.md) | Notification center, mark read, unread count |
| [Settings](./settings.md) | Invoice templates, automation rules, plan & usage |
