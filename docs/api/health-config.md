---
title: 'API Health và Config — Health check và merchant config'
description: 'Tài liệu API Health check và Merchant Config endpoints.'
keywords: 'health API, config API, health check, merchant configuration'
robots: 'index, follow'
---

# API Health & Config

> Health check endpoint và merchant configuration management.

:::tip Tóm tắt
Health check (GET /api/v1/health) kiểm tra kết nối D1 và KV. Config API (GET/PATCH /api/v1/config) quản lý cấu hình merchant.
:::

## GET /api/v1/health

Health check — không yêu cầu authentication.

### Response 200

```json
{
  "status": "ok",
  "db": "connected",
  "kv": "connected",
  "timestamp": "2026-05-16T10:00:00Z"
}
```

### Response 500

```json
{
  "status": "error",
  "db": "disconnected",
  "timestamp": "2026-05-16T10:00:00Z"
}
```

## GET /api/v1/config

Lấy merchant config. Yêu cầu Bearer token.

### Response 200

```json
{
  "success": true,
  "data": {
    "merchantId": "merchant-001",
    "autoIssueOnPaid": false,
    "defaultTaxRate": 0.1,
    "sellerName": "Công ty XYZ",
    "sellerMst": "9876543210",
    "tvanProvider": "mock"
  }
}
```

## PATCH /api/v1/config

Cập nhật merchant config.

### Request

```json
{
  "autoIssueOnPaid": true,
  "defaultTaxRate": 0.08
}
```

### Response 200

```json
{
  "success": true,
  "data": {
    "merchantId": "merchant-001",
    "autoIssueOnPaid": true,
    "defaultTaxRate": 0.08
  }
}
```

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Triển khai](../tech/deployment.md)
