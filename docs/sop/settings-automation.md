---
title: 'Cấu hình tự động hóa — Auto-issue, delay, notification rules'
description: 'Hướng dẫn cấu hình tự động phát hành hóa đơn khi đơn paid, delay time và notification rules.'
keywords: 'tự động hóa, auto-issue, automation, notification rules, settings'
robots: 'index, follow'
---

# Cấu hình tự động hóa

> Hướng dẫn cấu hình tự động phát hành hóa đơn khi đơn hàng paid, với configurable delay và notification rules.

:::tip Tóm tắt
Settings Automation cho phép bật/tắt auto-issue, chọn kênh áp dụng (WEB/POS/ADMIN), set delay 0-60 phút, và cấu hình notification khi success/error.
:::

## Truy cập

- Sidebar: **Cấu hình** → **Tự động hóa**
- URL: `/settings/automation`

## Cấu hình

### Auto-issue on paid

Toggle switch để bật/tắt tự động phát hành khi đơn hàng chuyển sang trạng thái paid.

### Channels

Chọn kênh áp dụng auto-issue:

| Channel | Mô tả |
|---|---|
| WEB | Đơn từ website |
| POS | Đơn từ POS |
| ADMIN | Đơn từ admin |

### Delay minutes

Thời gian chờ trước khi auto-issue (0-60 phút).

| Giá trị | Ý nghĩa |
|---|---|
| 0 | Phát hành ngay |
| 15 | Chờ 15 phút |
| 30 | Chờ 30 phút |
| 60 | Chờ 1 giờ |

### Notification toggles

| Toggle | Mô tả |
|---|---|
| Notify on success | Thông báo khi phát hành thành công |
| Notify on error | Thông báo khi có lỗi |

## Liên kết liên quan

- [Cấu hình mẫu hóa đơn](./settings-templates.md)
- [Thông báo](./notifications.md)
- [API Settings](../api/settings.md)
