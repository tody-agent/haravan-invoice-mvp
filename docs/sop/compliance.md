---
title: 'Compliance Center — Trung tâm tuân thủ pháp lý hóa đơn'
description: 'Hướng dẫn sử dụng Compliance Center để theo dõi audit trail, compliance status và cảnh báo rủi ro.'
robots: 'index, follow'
---

# Compliance Center

> Trung tâm tuân thủ pháp lý: theo dõi audit trail, compliance status, và cảnh báo rủi ro cho hóa đơn điện tử.

:::tip Tóm tắt
Compliance Center hiển thị tổng quan về tình trạng tuân thủ NĐ 70/2025, audit trail chi tiết, và cảnh báo các hóa đơn có rủi ro.
:::

## Tính năng chính

### Audit Trail

Mọi thao tác trên hóa đơn đều được ghi nhận:

| Field | Mô tả |
|---|---|
| Thời gian | Thời điểm thao tác |
| Hành động | Create, Issue, Replace, Adjust |
| Người thực hiện | User hoặc system |
| Chi tiết | JSON details |

### Compliance Status

| Trạng thái | Mô tả |
|---|---|
| ✅ Tuân thủ | Tất cả HĐ đúng quy định |
| ⚠️ Cảnh báo | Có HĐ cần xử lý |
| ❌ Vi phạm | Có HĐ quá hạn xử lý |

### Cảnh báo rủi ro

| Loại cảnh báo | Trigger |
|---|---|
| HĐ quá hạn chưa xử lý | > 7 ngày pending |
| HĐ bị CQT từ chối | cqt_rejected status |
| MST không hợp lệ | Validation failed |
| HKD chưa gộp bill | Chưa aggregate cuối ngày |

## Liên kết liên quan

- [Xử lý sai sót](./correct-invoice.md)
- [Báo cáo](./reports.md)
- [Gộp hóa đơn cuối ngày](./daily-aggregate.md)
