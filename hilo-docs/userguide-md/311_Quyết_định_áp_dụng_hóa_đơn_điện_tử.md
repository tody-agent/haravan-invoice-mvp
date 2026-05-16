Dưới đây là phân tích nghiệp vụ chi tiết dựa trên tài liệu **3.1.1 Quyết định áp dụng hóa đơn điện tử (311_Quyết_định_áp_dụng_hóa_đơn_điện_tử.pdf)**:

---

# PHÂN TÍCH NGHIỆP VỤ: QUYẾT ĐỊNH ÁP DỤNG HÓA ĐƠN ĐIỆN TỬ

## 1. Tổng quan & Mục đích
- **Mục đích:** Trước khi khởi tạo hóa đơn điện tử, doanh nghiệp phải lập và gửi "Quyết định áp dụng hóa đơn điện tử" cho cơ quan thuế quản lý trực tiếp.
- **Phạm vi chức năng:** Quản lý danh sách các quyết định áp dụng HDDT của đơn vị.

## 2. Các tính năng chính (Main Features)
Dựa trên mô tả tổng quát, hệ thống cung cấp các chức năng:
- **Tìm kiếm:** Tra cứu các quyết định đã tạo.
- **Xem:** Xem chi tiết thông tin quyết định.
- **Thêm mới (Ra quyết định):** Khởi tạo quyết định áp dụng mới.
- **Sửa:** Cập nhật thông tin quyết định (trong trạng thái cho phép).
- **Xóa:** Gỡ bỏ quyết định khỏi hệ thống.
- **In quyết định:** Xuất file/in ấn quyết định.
- **Gửi quyết định:** Chuyển quyết định cho Cơ quan Thuế (CQT).
- **Quản lý trạng thái:**
    - Chuyển trạng thái cho quyết định đã gửi CQT.
    - Chuyển trạng thái cho quyết định đã được CQT chấp nhận.

## 3. Quy trình nghiệp vụ: Tạo mới Quyết định (User Flow)

### Luồng chính:
1.  **Truy cập chức năng:** Người dùng vào menu `Đăng ký phát hành` -> Chọn `Quyết định áp dụng HDDT`.
2.  **Khởi tạo:** Nhấn nút `+ Ra quyết định`.
3.  **Nhập thông tin chung:** Điền các thông tin định danh và pháp lý của quyết định.
4.  **Đăng ký mẫu hóa đơn (Điều 2):**
    -   Tại phần "Điều 2", nhấn `Tạo mới` để thêm các loại hóa đơn sẽ sử dụng.
    -   Hệ thống hiển thị popup/màn hình đăng ký mẫu.
    -   Người dùng nhập thông tin mẫu số, loại hóa đơn, mục đích.
    -   Nhấn `Lưu` để đưa vào danh sách mẫu của quyết định hoặc `Quay lại` để hủy.
    -   *Chỉnh sửa mẫu:* Chọn mẫu trong danh sách -> Nhấn biểu tượng "Sửa" -> Cập nhật -> `Lưu`.
    -   *Xóa mẫu:* Chọn mẫu trong danh sách -> Nhấn biểu tượng "Xóa" -> Xác nhận `OK`.
5.  **Hoàn tất:** Nhấn `Tạo mới` ở màn hình chính để lưu toàn bộ Quyết định hoặc `Quay lại` để thoát mà không lưu.

## 4. Cấu trúc dữ liệu (Data Required)

### 4.1. Thông tin chung của Quyết định
| Trường dữ liệu | Tính chất | Ghi chú |
| :--- | :--- | :--- |
| **Tên đơn vị chủ quản** | Bắt buộc | |
| **Số quyết định** | Bắt buộc | Số hiệu văn bản |
| **Người đề nghị** | Bắt buộc | |
| **Danh sách mẫu hóa đơn** | Bắt buộc | Chứa thông tin tại Điều 2 |

### 4.2. Thông tin chi tiết mẫu hóa đơn (Đăng ký tại Điều 2)
| Trường dữ liệu | Tính chất | Ghi chú |
| :--- | :--- | :--- |
| **Mẫu số** | Bắt buộc | Ví dụ: 01GTKT0/001 |
| **Loại hóa đơn** | | Tên loại hóa đơn tương ứng mẫu số |
| **Mục đích sử dụng** | Bắt buộc | |

## 5. Các ràng buộc & Lưu ý về giao diện (UI/UX Note)
- Các trường bắt buộc nhập thường được đánh dấu bằng dấu `(*)` trên giao diện.
- Chức năng thêm mẫu hóa đơn (Điều 2) thực hiện trên một popup/màn hình con trước khi lưu tổng thể quyết định.
- Có các hành động tương tác trực tiếp trên dòng (inline actions) cho danh sách mẫu hóa đơn: Sửa (biểu tượng bút viết), Xóa (biểu tượng dấu x).

---
*Dữ liệu được trích xuất chính xác từ tài liệu hướng dẫn sử dụng 3.1.1.*
