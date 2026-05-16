---
title: 'Hướng dẫn tạo hóa đơn điện tử Haravan Invoice'
description: 'Hướng dẫn từng bước tạo hóa đơn điện tử GTGT, bán hàng, xuất khẩu trên Haravan Invoice Portal.'
keywords: 'tạo hóa đơn, phát hành hóa đơn, invoice create, GTGT, bán hàng, xuất khẩu'
robots: 'index, follow'
---

# Tạo hóa đơn

> Hướng dẫn từng bước tạo hóa đơn điện tử trên Haravan Invoice Portal với form nhập liệu đầy đủ.

:::tip Tóm tắt
Tạo hóa đơn qua 3 bước: (1) Nhập thông tin người mua, (2) Thêm sản phẩm/dịch vụ, (3) Xem lại và phát hành. Hỗ trợ 3 thuế suất: 0%, 5%, 8%, 10%.
:::

## Bước 1: Mở form tạo hóa đơn

1. Từ sidebar, chọn **Hóa đơn** → **Tạo hóa đơn**
2. Hoặc truy cập trực tiếp: `/invoices/new`

## Bước 2: Nhập thông tin người mua

| Trường | Bắt buộc | Mô tả |
|---|---|---|
| Tên người mua | ✅ | Tên cá nhân hoặc doanh nghiệp |
| Mã số thuế | | MST người mua (10 hoặc 13 số) |
| Địa chỉ | | Địa chỉ người mua |
| Email | | Email nhận hóa đơn |
| SĐT | | Số điện thoại |

:::tip Mẹo
Nhập MST và hệ thống sẽ tự động tra cứu thông tin doanh nghiệp qua [MST Lookup API](../api/mst-lookup.md).
:::

## Bước 3: Thêm sản phẩm/dịch vụ

Click **Thêm dòng** để thêm line item:

| Trường | Bắt buộc | Mô tả |
|---|---|---|
| Tên sản phẩm | ✅ | Mô tả hàng hóa/dịch vụ |
| SKU | | Mã sản phẩm |
| Số lượng | ✅ | Số lượng |
| Đơn giá | ✅ | Giá chưa thuế (VNĐ) |
| Thuế suất | ✅ | 0%, 5%, 8%, hoặc 10% |
| Giảm giá | | Số tiền giảm |

## Bước 4: Chọn phương thức thanh toán

| Phương thức | Mô tả |
|---|---|
| Chuyển khoản | Thanh toán qua ngân hàng |
| Tiền mặt | Thanh toán bằng tiền mặt |
| Thẻ | Thanh toán bằng thẻ |
| COD | Thu hộ |

## Bước 5: Chọn kênh bán

| Kênh | Mô tả |
|---|---|
| Admin | Tạo từ Haravan Admin |
| POS | Tạo từ POS |
| Web | Tạo từ Website |
| Auto | Tự động phát hành |

## Bước 6: Xem lại và phát hành

1. Kiểm tra lại toàn bộ thông tin
2. Tổng tiền được tính tự động: `subtotal + tax - discount`
3. Click **Phát hành hóa đơn**
4. Hệ thống gửi đến T-VAN và cập nhật trạng thái

## Trạng thái sau khi phát hành

| Trạng thái | Ý nghĩa |
|---|---|
| `issued` | Đã phát hành thành công |
| `pending` | Đang chờ T-VAN xử lý |
| `cqt_accepted` | CQT đã chấp nhận |
| `cqt_rejected` | CQT từ chối — cần xử lý |

## Liên kết liên quan

- [Quản lý hóa đơn](./manage-invoices.md)
- [Xử lý sai sót](./correct-invoice.md)
- [API Invoices](../api/invoices.md)
