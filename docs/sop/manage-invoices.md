---
title: 'Quản lý hóa đơn — Danh sách, tìm kiếm, lọc và xem chi tiết'
description: 'Hướng dẫn quản lý danh sách hóa đơn: tìm kiếm, lọc theo status, ngày, MST, xem chi tiết và tải PDF.'
keywords: 'quản lý hóa đơn, danh sách hóa đơn, tìm kiếm, lọc, filter, invoice list'
robots: 'index, follow'
---

# Quản lý hóa đơn

> Hướng dẫn quản lý danh sách hóa đơn: tìm kiếm, lọc, xem chi tiết, tải PDF và theo dõi audit trail.

:::tip Tóm tắt
Trang danh sách hóa đơn cho phép lọc theo trạng thái, ngày, MST, tên khách hàng. Pagination 20 items/trang. Click vào mã HĐ để xem chi tiết đầy đủ.
:::

## Danh sách hóa đơn

Truy cập: `/invoices`

### Bảng hóa đơn

| Cột | Mô tả |
|---|---|
| Mã HĐ | Click để xem chi tiết |
| Khách hàng | Tên người mua |
| MST | Mã số thuế |
| Tổng tiền | Format VNĐ (1.000.000đ) |
| Trạng thái | Badge màu theo status |
| Ngày tạo | DD/MM/YYYY |
| Kênh | Admin/POS/Web/Auto |

### Bộ lọc

| Filter | Mô tả |
|---|---|
| Trạng thái | Chọn 1 hoặc nhiều: draft, pending, issued, adjusted, replaced |
| Ngày từ — đến | Lọc theo khoảng thời gian |
| MST | Tìm theo mã số thuế |
| Tên khách hàng | Tìm theo tên |

### Pagination

- Mặc định: 20 items/trang
- Điều hướng: Previous / Next + số trang

## Xem chi tiết hóa đơn

Truy cập: `/invoices/:id`

### Thông tin hiển thị

1. **Header** — Mã HĐ, trạng thái, ngày phát hành
2. **Thông tin người bán** — Tên, MST, địa chỉ
3. **Thông tin người mua** — Tên, MST, địa chỉ, email, SĐT
4. **Danh sách sản phẩm** — Bảng line items
5. **Tổng tiền** — Subtotal, tax, discount, total
6. **Audit trail** — Lịch sử thao tác

### Actions

| Action | Mô tả |
|---|---|
| Tải PDF | Download file PDF hóa đơn |
| Thay thế | Tạo HĐ thay thế (NĐ 70) |
| Điều chỉnh | Tạo HĐ điều chỉnh |
| Xem audit | Lịch sử thao tác chi tiết |

## Liên kết liên quan

- [Tạo hóa đơn](./create-invoice.md)
- [Xử lý sai sót](./correct-invoice.md)
- [API Invoices](../api/invoices.md)
