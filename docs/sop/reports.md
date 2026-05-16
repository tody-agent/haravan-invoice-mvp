---
title: 'Báo cáo — 6 loại báo cáo hóa đơn điện tử theo quy định'
description: 'Hướng dẫn 6 loại báo cáo: sử dụng HĐĐT theo quý, bảng kê hàng tháng, chi tiết bán hàng, HĐ xóa/sửa/thay thế.'
keywords: 'báo cáo, reports, quarterly, monthly, sales, deleted, modified, replaced'
robots: 'index, follow'
---

# Báo cáo

> 6 loại báo cáo hóa đơn điện tử theo quy định: sử dụng HĐĐT theo quý, bảng kê hàng tháng, chi tiết bán hàng, và báo cáo HĐ xóa/sửa/thay thế.

:::tip Tóm tắt
Haravan Invoice cung cấp 6 loại báo cáo: Quarterly (sử dụng HĐĐT), Ledger (bảng kê), Sales (chi tiết bán hàng), Deleted, Modified, Replaced. Mỗi báo cáo có filter theo thời gian.
:::

## Danh sách báo cáo

Truy cập: `/reports`

| Báo cáo | URL | Mô tả |
|---|---|---|
| Sử dụng HĐĐT theo quý | `/reports/quarterly` | Mẫu báo cáo theo quý |
| Bảng kê hàng tháng | `/reports/ledger` | Chi tiết từng HĐ trong tháng |
| Chi tiết bán hàng | `/reports/sales` | Tổng hợp doanh thu |
| Hóa đơn xóa bỏ | `/reports/deleted` | Danh sách HĐ đã xóa |
| Hóa đơn sửa đổi | `/reports/modified` | Danh sách HĐ đã điều chỉnh |
| Hóa đơn thay thế | `/reports/replaced` | Danh sách HĐ đã thay thế |

## Báo cáo quý

Filter theo năm và quý. Hiển thị:

- Số HĐ đầu kỳ
- Số HĐ phát hành trong kỳ
- Số HĐ điều chỉnh/thay thế
- Số HĐ xóa bỏ
- Số HĐ cuối kỳ

## Bảng kê hàng tháng

Filter theo tháng. Hiển thị bảng chi tiết:

- Ngày phát hành
- Mã HĐ
- Tên khách hàng
- MST
- Tổng tiền
- Trạng thái

## Liên kết liên quan

- [Compliance Center](./compliance.md)
- [Quản lý hóa đơn](./manage-invoices.md)
- [API Reports](../api/reports.md)
