---
title: 'API MST Lookup — Tra cứu mã số thuế doanh nghiệp'
description: 'Tài liệu API MST Lookup endpoint để tra cứu thông tin doanh nghiệp theo mã số thuế.'
keywords: 'MST lookup, tax code lookup, mã số thuế, doanh nghiệp lookup'
robots: 'index, follow'
---

# API MST Lookup

> Tra cứu thông tin doanh nghiệp theo mã số thuế (MST).

:::tip Tóm tắt
GET /api/v1/mst/lookup?mst=0123456789 trả về thông tin doanh nghiệp: tên, địa chỉ, trạng thái. MST phải có 10 hoặc 13 chữ số.
:::

## GET /api/v1/mst/lookup

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

### Response 400

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "MST phải có 10 hoặc 13 chữ số"
  }
}
```

## Validation rules

| Rule | Mô tả |
|---|---|
| Không được trống | MST là required |
| Chỉ chữ số | Không chấp nhận ký tự đặc biệt |
| Độ dài | 10 hoặc 13 chữ số |

## Liên kết liên quan

- [Tổng quan API](./overview.md)
- [Tạo hóa đơn](../sop/create-invoice.md)
- [Quản lý khách hàng](../sop/customers.md)
