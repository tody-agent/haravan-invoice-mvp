Chào bạn, với vai trò Chuyên gia Phân tích Nghiệp vụ (BA), tôi đã phân tích tài liệu **3.1.4 Xem thông tin chi tiết Quyết định áp dụng** (kết hợp với cấu trúc thực thể đã được định nghĩa tại tài liệu gốc 3.1.1 để đảm bảo tính đầy đủ về mặt dữ liệu). 

Dưới đây là bảng phân tích chi tiết phục vụ cho việc clone và refactor UX:

---

# PHÂN TÍCH NGHIỆP VỤ: XEM CHI TIẾT QUYẾT ĐỊNH ÁP DỤNG

## 1. Thông tin chung
*   **Mã chức năng:** 3.1.4
*   **Tên tính năng:** Xem thông tin chi tiết Quyết định áp dụng
*   **Mục tiêu:** Cho phép người dùng truy xuất và xem lại toàn bộ nội dung của một Quyết định áp dụng hóa đơn điện tử đã tồn tại trên hệ thống ở chế độ đọc (read-only).

## 2. Luồng nghiệp vụ (User Flow)
Quy trình thực hiện bao gồm các bước:
1.  **Truy cập danh sách:** Người dùng truy cập vào màn hình danh sách "Quyết định áp dụng HDDT" (theo đường dẫn: *Đăng ký phát hành > Quyết định áp dụng HDDT*).
2.  **Xác định đối tượng:** Tìm kiếm và xác định dòng chứa Quyết định cần xem thông tin.
3.  **Kích hoạt xem chi tiết:** Nhấn vào biểu tượng **[Hình con mắt]** tại cột hành động tương ứng của dòng đó.
4.  **Hiển thị thông tin:** Hệ thống chuyển hướng hoặc mở popup hiển thị toàn bộ chi tiết của Quyết định.

## 3. Dữ liệu cần thiết (Data Fields)
Dựa trên cấu trúc khởi tạo tại mục 3.1.1, màn hình chi tiết phải hiển thị đầy đủ các nhóm thông tin sau:

### 3.1. Thông tin định danh Quyết định
*   **Tên đơn vị chủ quản:** Tên công ty/tổ chức ra quyết định.
*   **Số quyết định:** Số hiệu văn bản của quyết định.
*   **Người đề nghị:** Họ tên người chịu trách nhiệm/người lập đề nghị.

### 3.2. Danh sách mẫu hóa đơn (Thông tin Điều 2)
Đây là danh sách các loại hóa đơn được đăng ký sử dụng trong quyết định này, trình bày dưới dạng bảng (Table) với các cột:
*   **Mẫu số:** Mã hiệu mẫu hóa đơn (Ví dụ: 01GTKT0/001).
*   **Loại hóa đơn:** Tên đầy đủ của loại hóa đơn tương ứng với mẫu số.
*   **Mục đích sử dụng:** Diễn giải mục đích sử dụng loại hóa đơn này của doanh nghiệp.

## 4. Các ràng buộc & Chỉ dẫn UX (UX Guidelines)
*   **Chế độ hiển thị:** Màn hình này ưu tiên hiển thị thông tin rõ ràng, dễ đọc. Các trường dữ liệu nên được đặt ở trạng thái không thể chỉnh sửa (Disabled/Read-only).
*   **Điểm điều hướng (Navigation):** Phải có nút **[Quay lại]** để người dùng dễ dàng trở về màn hình danh sách mà không làm mất ngữ cảnh tìm kiếm trước đó.
*   **Biểu tượng đặc trưng:** Sử dụng icon **Con mắt** làm dấu hiệu nhận diện tiêu chuẩn cho hành động "Xem chi tiết" trên dòng dữ liệu.

---
*Lưu ý: Nội dung được tổng hợp trực tiếp từ tài liệu 3.1.4 và tham chiếu cấu trúc dữ liệu từ tài liệu 3.1.1 để đảm bảo tính chính xác về mặt nghiệp vụ.*
