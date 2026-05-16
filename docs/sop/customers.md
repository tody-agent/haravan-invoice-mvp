---
title: 'Quản lý khách hàng — Danh sách, chi tiết và phân tích'
description: 'Hướng dẫn quản lý danh sách khách hàng, xem chi tiết profile và phân tích doanh thu theo khách hàng.'
keywords: 'quản lý khách hàng, customer list, customer detail, analytics, MST lookup'
robots: 'index, follow'
---

# Quản lý khách hàng

> Hướng dẫn quản lý danh sách khách hàng, xem chi tiết profile và phân tích doanh thu theo từng khách hàng.

:::tip Tóm tắt
Khách hàng được auto-extract từ hóa đơn. Trang Customer List hiển thị danh sách, Customer Detail có profile + analytics (tổng HĐ, doanh thu, xu hướng).
:::

## Danh sách khách hàng

Truy cập: `/customers`

### Bảng khách hàng

| Cột | Mô tả |
|---|---|
| Tên khách hàng | Click để xem chi tiết |
| MST | Mã số thuế |
| Email | Email liên hệ |
| SĐT | Số điện thoại |
| Số HĐ | Tổng số hóa đơn |
| Tổng tiền | Tổng doanh thu |

### Tìm kiếm

- Tìm theo tên khách hàng
- Tìm theo MST

## Chi tiết khách hàng

Truy cập: `/customers/:id`

### Thông tin profile

| Field | Mô tả |
|---|---|
| Tên | Tên khách hàng |
| MST | Mã số thuế |
| Địa chỉ | Địa chỉ |
| Email | Email |
| SĐT | SĐT |

### KPI cards

| KPI | Mô tả |
|---|---|
| Tổng HĐ | Số lượng hóa đơn đã mua |
| Tổng doanh thu | Tổng tiền đã chi tiêu |
| Giá trị TB/HĐ | Avg order value |
| GD gần nhất | Ngày giao dịch cuối |

### Channel breakdown

Bảng hiển thị doanh thu theo kênh:

| Kênh | Số HĐ | Doanh thu |
|---|---|---|
| Admin | | |
| POS | | |
| Web | | |

### Xu hướng tháng

Biểu đồ 12 tháng gần nhất hiển thị doanh thu theo tháng.

## Liên kết liên quan

- [Quản lý hóa đơn](./manage-invoices.md)
- [Phân tích](./analytics.md)
- [API Customers](../api/customers.md)
