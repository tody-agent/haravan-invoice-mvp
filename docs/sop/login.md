---
title: 'Hướng dẫn đăng nhập Haravan Invoice Portal'
description: 'Hướng dẫn đăng nhập vào hệ thống Haravan Invoice Portal với mock authentication.'
keywords: 'đăng nhập, login, authentication, mock JWT, portal'
robots: 'index, follow'
---

# Đăng nhập

> Hướng dẫn đăng nhập vào Haravan Invoice Portal với hệ thống mock authentication.

:::tip Tóm tắt
Hiện tại Portal sử dụng mock JWT authentication — bất kỳ email/password nào cũng đăng nhập được. Trong production, sẽ tích hợp Haravan SSO.
:::

## Quy trình đăng nhập

1. Mở trình duyệt: `http://localhost:5173/login`
2. Nhập email (bất kỳ)
3. Nhập password (bất kỳ)
4. Click **Đăng nhập**

## Sau khi đăng nhập

- Token JWT được lưu trong localStorage
- Portal tự động redirect về Dashboard
- Token được gửi kèm header `Authorization: Bearer <token>` cho mọi API request

## Thông tin mock user

| Field | Giá trị |
|---|---|
| merchantId | merchant-001 |
| userId | user-001 |
| role | admin |

## Đăng xuất

Click nút **Đăng xuất** ở góc phải topbar. Token sẽ bị xóa khỏi localStorage.

## Liên kết liên quan

- [Bắt đầu nhanh](./getting-started.md)
- [Dashboard](./dashboard.md)
- [API Auth](../api/auth.md)
