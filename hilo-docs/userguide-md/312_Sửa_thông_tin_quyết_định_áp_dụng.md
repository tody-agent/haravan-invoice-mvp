Dưới đây là phân tích chi tiết nghiệp vụ tính năng **Sửa thông tin Quyết định áp dụng** dựa trên tài liệu `3.1.2 Sửa thông tin quyết định áp dụng.pdf`:

---

# Tài liệu Phân tích Nghiệp vụ: Sửa thông tin Quyết định áp dụng

## 1. Mục tiêu
Cho phép người dùng cập nhật, thay đổi thông tin của các Quyết định áp dụng hóa đơn điện tử đã được khởi tạo trên hệ thống nhưng chưa được cơ quan thuế chấp nhận chính thức.

## 2. Điều kiện thực hiện (Business Rules)
*   **Trạng thái cho phép sửa:** Chỉ được phép chỉnh sửa các quyết định thuộc một trong hai trạng thái sau:
    1.  Quyết định mới tạo (chưa gửi cơ quan thuế).
    2.  Quyết định đã gửi cơ quan thuế nhưng **chưa được chấp nhận**.
*   **Quyền hạn:** Người dùng có quyền truy cập vào chức năng Quản lý Quyết định áp dụng hóa đơn điện tử.

## 3. Luồng nghiệp vụ (User Flow)

### Bước 1: Chọn Quyết định cần sửa
1.  Truy cập vào màn hình danh sách tại trang **Quyết định phát hành hóa đơn điện tử**.
2.  Tìm kiếm và xác định Quyết định cần chỉnh sửa.
3.  Nhấn vào biểu tượng hình cây bút (Sửa) trên dòng tương ứng của Quyết định đó.
4.  **Hệ thống:** Hiển thị màn hình "Sửa thông tin Quyết định phát hành".

### Bước 2: Chỉnh sửa thông tin
Người dùng có thể thực hiện thay đổi tất cả các thông tin của Quyết định phát hành, bao gồm các thao tác với mẫu hóa đơn:
*   **Đăng ký mới mẫu hóa đơn:** Thêm các loại mẫu hóa đơn sẽ sử dụng trong quyết định này.
*   **Sửa thông tin mẫu hóa đơn đã đăng ký:** Thay đổi các tham số, thông tin chi tiết của mẫu hóa đơn đã có trong danh sách của quyết định.
*   **Xóa đăng ký mẫu hóa đơn:** Loại bỏ các mẫu hóa đơn không còn nhu cầu sử dụng khỏi quyết định.
*(Lưu ý: Chi tiết các thao tác thêm/sửa/xóa mẫu hóa đơn thực hiện tương tự như trong chức năng "Thêm mới Quyết định")*

### Bước 3: Lưu và Hoàn tất
1.  **Lưu thay đổi:** Nhấn nút **[Lưu]**.
    *   **Hệ thống:** Ghi nhận các thông tin mới vào cơ sở dữ liệu và thông báo kết quả.
2.  **Hủy/Quay lại:** Nhấn nút **[Quay lại]**.
    *   **Hệ thống:** Đóng màn hình chỉnh sửa và quay trở về trang danh sách Quyết định áp dụng hóa đơn mà không lưu lại các thay đổi vừa thực hiện.

## 4. Dữ liệu cần thiết (Data Requirements)

### Thông tin chung của Quyết định:
*   Các thông tin định danh quyết định (Số quyết định, ngày quyết định...).
*   Trạng thái hiện tại của quyết định (để kiểm tra điều kiện được sửa).

### Thông tin danh sách mẫu hóa đơn (Grid/Table):
*   Tên loại hóa đơn.
*   Mẫu số.
*   Ký hiệu.
*   Các thông tin chi tiết khác liên quan đến việc đăng ký mẫu.

## 5. Các thành phần giao diện chính (UI Components)
*   **Màn hình Danh sách:** Nút/Icon "Sửa" trên từng dòng dữ liệu.
*   **Màn hình Chỉnh sửa:**
    *   Các trường nhập liệu thông tin Quyết định.
    *   Bảng danh sách mẫu hóa đơn đính kèm (cho phép Thêm/Sửa/Xóa dòng).
    *   Nút chức năng: **Lưu**, **Quay lại**.

---
*Ghi chú: Tài liệu này được biên soạn dựa trên nội dung gốc từ file PDF và tập trung vào luồng xử lý nghiệp vụ để phục vụ cho việc clone/refactor UX.*
