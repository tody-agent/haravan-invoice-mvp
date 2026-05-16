---
title: 'API Auth — Mock login và JWT authentication'
description: 'Tài liệu API Auth endpoint cho mock login, trả về JWT token để sử dụng cho các API khác.'
keywords: 'auth API, login, JWT, mock authentication, Bearer token'
robots: 'index, follow'
---

# API Auth

> Mock authentication endpoint — trả về JWT token để sử dụng cho các API khác.

:::tip Tóm tắt
POST /api/v1/auth/login nhận email/password (bất kỳ) và trả về mock JWT token. Token này được gửi kèm header `Authorization: Bearer <token>` cho mọi request khác.
:::

## POST /api/v1/auth/login

Mock login — chấp nhận bất kỳ credentials nào.

### Request

```json
{
  "email": "admin@haravan.com",
  "password": "any-password"
}
```

### Response 200

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "merchantId": "merchant-001",
      "userId": "user-001",
      "role": "admin",
      "name": "Admin"
    }
  }
}
```

### Sử dụng token

```bash
curl -H "Authorization: Bearer eyJhbGci..." \
  http://localhost:8787/api/v1/invoices
```

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Hướng dẫn đăng nhập](../sop/login.md)
