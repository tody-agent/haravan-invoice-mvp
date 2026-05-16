---
title: 'API PDF — Tải PDF hóa đơn điện tử'
description: 'Tài liệu API PDF endpoint để tải file PDF hóa đơn điện tử từ R2 storage.'
keywords: 'PDF API, download PDF, invoice PDF, R2 storage'
robots: 'index, follow'
---

# API PDF

> Tải file PDF hóa đơn điện tử từ R2 storage.

:::tip Tóm tắt
GET /api/v1/invoices/:id/pdf trả về file PDF của hóa đơn. PDF được lưu trữ trong R2 bucket, cache qua KV.
:::

## GET /api/v1/invoices/:id/pdf

Tải PDF hóa đơn.

### Response 200

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="HD-HV-001.pdf"

<binary PDF data>
```

### Response 404

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "PDF không tồn tại cho hóa đơn này"
  }
}
```

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Quản lý hóa đơn](../sop/manage-invoices.md)
