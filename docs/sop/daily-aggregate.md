---
title: 'Gộp hóa đơn lẻ cuối ngày — Aggregate theo NĐ 70/2025'
description: 'Hướng dẫn gộp hóa đơn bán lẻ cuối ngày theo quy định NĐ 70/2025 cho hộ kinh doanh.'
keywords: 'gộp hóa đơn, aggregate, NĐ 70, cuối ngày, hộ kinh doanh, POS'
robots: 'index, follow'
---

# Gộp hóa đơn cuối ngày

> Hướng dẫn gộp các hóa đơn bán lẻ từ POS/Web cuối ngày theo quy định NĐ 70/2025.

:::tip Tóm tắt
Hộ kinh doanh có doanh thu ≥1 tỷ/năm bắt buộc phải gộp hóa đơn lẻ cuối ngày. Trang Daily Aggregate hiển thị tổng hợp SL, doanh thu theo ngày và nút "Gộp & gửi CQT".
:::

## Quy định NĐ 70/2025

| Yêu cầu | Chi tiết |
|---|---|
| Đối tượng | HKD doanh thu ≥1 tỷ/năm |
| Bắt buộc | Máy tính tiền + gộp bill cuối ngày |
| Kênh áp dụng | POS, Web (bán lẻ) |

## Sử dụng trang Aggregate

Truy cập: `/aggregate`

### Dữ liệu hiển thị

| Metric | Mô tả |
|---|---|
| Tổng số bill | Số lượng HĐ lẻ trong ngày |
| Tổng doanh thu | Tổng tiền từ các bill lẻ |
| SL sản phẩm | Tổng số lượng hàng hóa |

### Filter

- Chọn ngày cần xem aggregate
- Mặc định: hôm nay

### Thao tác

1. Xem tổng hợp số liệu
2. Kiểm tra đúng đủ
3. Click **Gộp & gửi CQT**
4. Hệ thống tạo HĐ gộp và gửi T-VAN

## Liên kết liên quan

- [Compliance Center](./compliance.md)
- [Quản lý hóa đơn](./manage-invoices.md)
- [API Aggregate](../api/aggregate.md)
