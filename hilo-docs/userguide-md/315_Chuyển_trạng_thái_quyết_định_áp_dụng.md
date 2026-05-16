Chào bạn, với tư cách là Chuyên gia Phân tích Nghiệp vụ (BA), tôi xin trình bày chi tiết phân tích nghiệp vụ cho tính năng **"Chuyển trạng thái Quyết định áp dụng"** dựa trên tài liệu đã cung cấp:

# Phân tích Nghiệp vụ: Chuyển trạng thái Quyết định áp dụng

## 1. Mục tiêu (Purpose)
Chuyển đổi trạng thái của Quyết định áp dụng từ trạng thái **"Mới lập"** sang trạng thái **"Đã gửi"** sau khi người dùng đã thực hiện gửi quyết định này cho cơ quan thuế quản lý trực tiếp.

## 2. Luồng nghiệp vụ (User Flow)

### Quy trình thực hiện:
*   **Bước 1: Truy cập và Chọn dữ liệu**
    *   Người dùng truy cập vào trang danh sách "Quyết định phát hành hóa đơn".
    *   Tìm và chọn 1 Quyết định áp dụng cần chuyển trạng thái.
    *   Thao tác: Click vào biểu tượng **Xem chi tiết** (hình con mắt) tại dòng tương ứng của quyết định đó.
*   **Bước 2: Kích hoạt chức năng chuyển trạng thái**
    *   Hệ thống hiển thị màn hình "Xem thông tin chi tiết Quyết định áp dụng".
    *   Thao tác: Nhấn chọn nút **"Gửi quyết định"** (Nút có biểu tượng máy bay giấy/mũi tên).
*   **Bước 3: Xác nhận hành động**
    *   Hệ thống hiển thị một hộp thoại xác nhận (Confirmation Dialog) với nội dung: *"Xác nhận gửi quyết định này?"*.
    *   Thao tác: Nhấn nút **"OK"** để hoàn tất hoặc **"Cancel"** để hủy bỏ.

## 3. Các thành phần dữ liệu và Giao diện (Data & UI Elements)

### Trang danh sách (List View):
*   **Danh sách Quyết định áp dụng:** Chứa các bản ghi quyết định hiện có.
*   **Cột Thao tác:** Chứa biểu tượng xem chi tiết (Eye icon).

### Trang chi tiết (Detail View):
*   **Thông tin chi tiết Quyết định:** Hiển thị các thông tin liên quan đến quyết định đã chọn.
*   **Hệ thống nút chức năng:**
    *   `In quyết định`: Dùng để in biểu mẫu.
    *   `Gửi quyết định`: Nút tác vụ chính để chuyển trạng thái.
    *   `Quay lại`: Quay lại màn hình danh sách.

### Thông báo xác nhận (Popup Confirmation):
*   **Tiêu đề/Nội dung:** "Xác nhận gửi quyết định này?"
*   **Nút điều hướng:** `OK`, `Cancel`.

## 4. Quy tắc nghiệp vụ (Business Rules)
*   **Điều kiện thực hiện:** Tính năng này chỉ thực hiện sau khi Quyết định thực tế đã được gửi đến cơ quan thuế quản lý trực tiếp.
*   **Thay đổi trạng thái:** Sau khi nhấn OK tại bước xác nhận, trạng thái của bản ghi sẽ được cập nhật từ "Mới lập" thành "Đã gửi".

---
*Ghi chú: Nội dung trên được tổng hợp chính xác theo tài liệu "3.1.5 Chuyển trạng thái cho Quyết định áp dụng".*
