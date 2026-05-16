Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **Upload dữ liệu hóa đơn** dựa trên tài liệu `docs/47_Upload_dữ_liệu_hóa_đơn.pdf`.

---

# PHÂN TÍCH NGHIỆP VỤ: UPLOAD DỮ LIỆU HÓA ĐƠN (Mục 4.7)

## 1. Mục tiêu tính năng
Cho phép người dùng đưa dữ liệu hóa đơn từ các tệp tin bên ngoài (Excel hoặc XML đóng gói) vào hệ thống theo mẫu số và ký hiệu đã được đăng ký trước.

## 2. Luồng nghiệp vụ (User Flow)

1.  **Truy cập:** Người dùng vào màn hình "Upload hóa đơn".
2.  **Khởi tạo:** Nhấn nút hoặc chọn chức năng "Upload".
3.  **Thiết lập tham số:**
    *   Chọn **Kỳ cước** (Tháng/Năm) áp dụng cho dữ liệu upload.
    *   Chọn **Mẫu số** hóa đơn từ danh sách có sẵn.
    *   Chọn **Ký hiệu** hóa đơn tương ứng với mẫu số đã chọn.
4.  **Chọn tệp tin:** Người dùng thực hiện đính kèm tệp tin dữ liệu từ máy tính.
5.  **Thực thi:** Nhấn nút **"Upload dữ liệu"** để hệ thống bắt đầu xử lý tệp tin.
6.  **Điều hướng (Tùy chọn):** Có thể nhấn **"Quay lại"** để hủy bỏ thao tác hoặc trở về màn hình trước đó.

## 3. Chi tiết các trường dữ liệu (Data Fields)

| Trường dữ liệu | Loại | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **Kỳ Cước** | Dropdown | Có (*) | Gồm 2 phần: Tháng và Năm (Ví dụ trong tài liệu: 8 / 2018). |
| **Mẫu số** | Dropdown | Có (*) | Danh mục các mẫu số hóa đơn đã khai báo trên hệ thống. |
| **Ký hiệu** | Dropdown | Có (*) | Danh mục các ký hiệu hóa đơn tương ứng với mẫu số. |
| **Chọn file** | File Picker | Có (*) | Tệp tin chứa dữ liệu hóa đơn cần tải lên. |

## 4. Các ràng buộc và quy tắc nghiệp vụ (Business Rules)

### 4.1. Định dạng tệp tin cho phép
Hệ thống chỉ chấp nhận các định dạng tệp sau:
*   Tệp nén **.zip** (bên trong chứa các tệp tin **.xml**).
*   Tệp bảng tính **.xls** (Excel).

### 4.2. Giới hạn kỹ thuật
*   **Dung lượng tối đa:** Tệp tin tải lên không được vượt quá **100MB**.

### 4.3. Quy tắc bắt buộc
*   Tất cả các trường thông tin trong giao diện upload (Kỳ cước, Mẫu số, Ký hiệu, Chọn file) đều là thông tin bắt buộc phải nhập/chọn trước khi thực hiện upload.

## 5. Thành phần giao diện (UI Components)

*   **Thông báo hướng dẫn:** Một vùng thông báo màu đỏ nổi bật ở đầu form nhắc nhở về định dạng và dung lượng file.
*   **Nút chức năng:**
    *   `UPLOAD DỮ LIỆU`: Thực hiện lệnh tải lên.
    *   `QUAY LẠI`: Thoát khỏi màn hình hiện tại.

---
*Lưu ý: Nội dung trên được tổng hợp chính xác theo hình ảnh và văn bản có trong tài liệu được cung cấp.*
