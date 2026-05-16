---
title: 'Quản lý sản phẩm — Danh sách sản phẩm tự động từ hóa đơn'
description: 'Hướng dẫn xem danh sách sản phẩm tự động extract từ hóa đơn, tìm kiếm và theo dõi doanh thu.'
keywords: 'quản lý sản phẩm, product catalog, SKU, doanh thu, auto-extract'
robots: 'index, follow'
---

# Quản lý sản phẩm

> Danh sách sản phẩm được tự động trích xuất từ các dòng item của hóa đơn, giúp theo dõi doanh thu theo SKU.

:::tip Tóm tắt
Trang sản phẩm hiển thị catalog auto-extracted từ invoice items: SKU, tên sản phẩm, số lượng bán, doanh thu, số hóa đơn. Không cần nhập thủ công.
:::

## Danh sách sản phẩm

Truy cập: `/products`

### Bảng sản phẩm

| Cột | Mô tả |
|---|---|
| SKU | Mã sản phẩm |
| Tên sản phẩm | Tên hàng hóa/dịch vụ |
| SL bán | Tổng số lượng đã bán |
| Doanh thu | Tổng doanh thu (VNĐ) |
| Số HĐ | Số hóa đơn có sản phẩm này |

### Tìm kiếm

- Tìm theo tên sản phẩm
- Tìm theo SKU
- Real-time search với URL-driven state (`?search=`)

### Pagination

- Mặc định: 20 items/trang
- Điều hướng: `?page=` parameter

## Empty state

Khi chưa có hóa đơn nào:

> "Sản phẩm sẽ được tạo tự động từ hóa đơn"

## Liên kết liên quan

- [Quản lý hóa đơn](./manage-invoices.md)
- [Phân tích](./analytics.md)
- [API Products](../api/products.md)
