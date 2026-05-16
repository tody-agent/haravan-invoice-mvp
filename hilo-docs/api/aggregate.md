---
title: "Aggregate API"
description: "API reference for gộp đơn lẻ cuối ngày theo TT 78/TT 32"
---

# Aggregate API

> **Quick Reference**
> - **Base URL**: `/api/v1/aggregate`
> - **Auth**: Bearer Token
> - **Content-Type**: `application/json`

## Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/aggregate` | Gộp đơn lẻ cuối ngày | ✅ |
| GET | `/api/v1/aggregate/summary` | Tổng hợp gộp theo tháng | ✅ |

---

## POST /api/v1/aggregate

Gộp các giao dịch bán lẻ trong ngày thành 1 hóa đơn tổng hợp theo TT 78/TT 32.

**Điều kiện gộp:**
- Hóa đơn có `status` là `draft` hoặc `pending`
- Hóa đơn có `channel = 'pos'`
- Hóa đơn không có MST (`buyer_mst` rỗng hoặc NULL)
- Hóa đơn được tạo trong ngày chỉ định

**Hành động:**
- Tạo hóa đơn tổng mới với `buyer_name = 'Khách lẻ tổng hợp'`
- Cộng dồn số lượng cùng sản phẩm (theo tên)
- Đánh dấu `status = 'replaced'` cho tất cả đơn gốc
- Ghi audit log

### Request Body

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `date` | string | No | Hôm nay | Ngày gộp (`YYYY-MM-DD`) |

### Request Example

```json
{
  "date": "2026-05-16"
}
```

### Response 200

```json
{
  "success": true,
  "data": {
    "id": "agg-1715856000000-a3x2",
    "haravanId": "HRV-AGG-20260516",
    "date": "2026-05-16",
    "originalCount": 15,
    "subtotal": 2500000,
    "taxAmount": 250000,
    "total": 2750000,
    "items": [
      {
        "name": "Cà phê sữa",
        "quantity": 30,
        "unitPrice": 35000,
        "taxRate": 0.1,
        "total": 1155000
      },
      {
        "name": "Bánh mì",
        "quantity": 15,
        "unitPrice": 20000,
        "taxRate": 0.1,
        "total": 330000
      }
    ]
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | ID hóa đơn tổng |
| `haravanId` | string | Mã Haravan (format: `HRV-AGG-YYYYMMDD`) |
| `date` | string | Ngày gộp |
| `originalCount` | number | Số đơn gốc bị thay thế |
| `subtotal` | number | Tạm tính (VND) |
| `taxAmount` | number | Tiền thuế (VND) |
| `total` | number | Tổng cộng (VND) |
| `items` | array | Danh sách sản phẩm đã gộp |

### Response 400 — Không có đơn để gộp

```json
{
  "success": false,
  "message": "Không có đơn lẻ để gộp"
}
```

---

## GET /api/v1/aggregate/summary

Tổng hợp các hóa đơn gộp theo ngày trong tháng.

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `month` | string | Tháng hiện tại | Tháng cần xem (`YYYY-MM`) |

### Request Example

```
GET /api/v1/aggregate/summary?month=2026-05
```

### Response 200

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-05-16",
      "count": 1,
      "total": 2750000
    },
    {
      "date": "2026-05-15",
      "count": 1,
      "total": 1890000
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Ngày gộp (`YYYY-MM-DD`) |
| `count` | number | Số hóa đơn tổng trong ngày |
| `total` | number | Tổng tiền (VND) |

---

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Missing or invalid Authorization header"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Notes

- Hóa đơn tổng sử dụng `channel = 'pos'` và `metadata.source = 'aggregate'` để phân biệt
- Hóa đơn gốc được đánh dấu `status = 'replaced'` và `replaced_by` trỏ đến hóa đơn tổng
- Sản phẩm được gộp theo tên (cộng dồn số lượng, tổng tiền)
- Không gộp hóa đơn đã có MST (khách doanh nghiệp)
- Không gộp hóa đơn đã phát hành riêng (`status = 'issued'`)
- Tuân thủ quy định TT 78/TT 32 về gộp giao dịch bán lẻ

---

## Business Rules (TT 78/TT 32)

1. **Đối tượng áp dụng:** Khách lẻ không lấy hóa đơn, không có MST
2. **Thời gian gộp:** Cuối ngày (toàn bộ giao dịch trong ngày)
3. **Phương thức gộp:** Cộng dồn số lượng cùng sản phẩm
4. **Ghi chú:** Hóa đơn tổng phải ghi "Theo TT 78/TT 32"
5. **Đơn gốc:** Đánh dấu "Đã thay thế", không xóa
