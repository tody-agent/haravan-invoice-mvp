Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **Xóa thông báo phát hành** dựa trên tài liệu `docs/326_Xóa_thông_báo_phát_hành.pdf`.

---

# PHÂN TÍCH NGHIỆP VỤ: XÓA THÔNG BÁO PHÁT HÀNH (3.2.6)

## 1. Mô tả tính năng
Tính năng này cho phép người dùng loại bỏ các bản ghi Thông báo phát hành khỏi hệ thống khi không còn nhu cầu sử dụng hoặc cần thực hiện lại.

## 2. Điều kiện thực hiện (Business Rules)
Hệ thống áp dụng ràng buộc chặt chẽ về trạng thái của thông báo trước khi cho phép xóa. Người dùng **CHỈ** được xóa trong các trường hợp sau:
*   Thông báo mới tạo (trạng thái lưu tạm/chưa gửi).
*   Thông báo đã gửi cơ quan thuế nhưng **chưa được chấp nhận**.

## 3. Luồng nghiệp vụ (User Flow)

### Bước 1: Chọn bản ghi
*   Người dùng truy cập vào trang **Thông báo phát hành**.
*   Tìm kiếm và xác định thông báo cần xóa trong danh sách.
*   Kích chuột vào biểu tượng xóa (hình dấu **x** đỏ) trên dòng tương ứng với thông báo đó.

### Bước 2: Xác nhận xóa
*   Hệ thống hiển thị cửa sổ (pop-up) yêu cầu người dùng xác nhận việc xóa.
*   **Lựa chọn A (Đồng ý):** Nhấn nút **OK**.
    *   Hệ thống thực hiện xóa dữ liệu.
    *   Nếu thành công: Hiển thị thông báo **"Xóa thành công"** và bản ghi biến mất khỏi danh sách.
    *   Nếu thất bại (do lỗi hệ thống hoặc ràng buộc dữ liệu phát sinh): Hiển thị thông báo **"Xóa không thành công"**.
*   **Lựa chọn B (Hủy bỏ):** Nhấn nút **Cancel**.
    *   Hệ thống đóng cửa sổ xác nhận.
    *   Giữ nguyên trạng thái dữ liệu và quay lại màn hình danh sách "Thông báo phát hành".

## 4. Dữ liệu và Thành phần UI cần thiết

### Dữ liệu (Data Fields)
*   **ID Thông báo:** Định danh duy nhất của bản ghi để thực hiện lệnh xóa.
*   **Trạng thái thông báo:** Dùng để kiểm tra điều kiện cho phép hiển thị/kích hoạt nút xóa.

### Thành phần giao diện (UI Components)
*   **Nút hành động:** Biểu tượng "x" (Delete icon) nằm trên từng dòng của lưới dữ liệu (Data Grid).
*   **Cửa sổ xác nhận (Modal/Dialog):** Chứa thông điệp cảnh báo và hai nút điều hướng (OK, Cancel).
*   **Thông báo trạng thái (Toast/Alert):** Hiển thị kết quả thực hiện (Thành công/Thất bại).

---
*Lưu ý: Nội dung trên được tổng hợp chính xác theo tài liệu cung cấp, phục vụ mục đích clone và refactor UX cho sản phẩm.*
