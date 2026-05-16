---
title: 'Trung tâm thông báo — Real-time notifications cho hóa đơn'
description: 'Hướng dẫn sử dụng Notification Center để theo dõi thông báo hóa đơn, hệ thống và aggregate.'
keywords: 'thông báo, notifications, real-time, alert, notification center'
robots: 'index, follow'
---

# Thông báo

> Trung tâm thông báo hiển thị các sự kiện quan trọng: hóa đơn phát hành, lỗi hệ thống, và aggregate hoàn tất.

:::tip Tóm tắt
Notification Center có filter tabs (Tất cả/Chưa đọc), relative time display, mark as read, và category icons cho invoice/system/aggregate.
:::

## Truy cập

- Sidebar: **Thông báo**
- URL: `/notifications`
- Bell icon trên topbar (hiển thị số unread)

## Phân loại thông báo

| Category | Icon | Mô tả |
|---|---|---|
| Invoice | 🧾 | HĐ phát hành thành công/thất bại |
| System | ⚙️ | Sự kiện hệ thống |
| Aggregate | 📊 | Gộp bill cuối ngày hoàn tất |

## Filter tabs

| Tab | Hiển thị |
|---|---|
| Tất cả | Mọi thông báo |
| Chưa đọc | Chỉ thông báo chưa đọc |

## Thao tác

| Thao tác | Cách thực hiện |
|---|---|
| Xem chi tiết | Click vào thông báo → tự động mark read |
| Mark all read | Click nút "Đánh dấu tất cả đã đọc" |
| Mark single read | Click vào thông báo |

## Hiển thị thời gian

| Khoảng | Hiển thị |
|---|---|
| < 1 phút | "Vừa xong" |
| < 1 giờ | "X phút trước" |
| < 24 giờ | "X giờ trước" |
| > 24 giờ | "X ngày trước" |

## Liên kết liên quan

- [Dashboard](./dashboard.md)
- [Cấu hình tự động hóa](./settings-automation.md)
- [API Notifications](../api/notifications.md)
