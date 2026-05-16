Dựa trên tài liệu nghiệp vụ tại các file `4.3 Sửa thông tin hóa đơn` và `4.2 Thêm hóa đơn`, tôi xin trình bày phân tích chi tiết tính năng **Sửa thông tin hóa đơn** phục vụ cho việc clone và refactor UX như sau:

---

# Phân tích nghiệp vụ: Sửa thông tin hóa đơn

## 1. Tổng quan tính năng
Tính năng này cho phép người dùng thay đổi các thông tin trên hóa đơn đã được tạo lập nhưng **chưa phát hành**.

## 2. Điều kiện thực hiện (Pre-conditions)
*   **Trạng thái hóa đơn:** Chỉ được phép sửa các hóa đơn ở trạng thái **vừa tạo lập**.
*   **Hạn chế:** Những hóa đơn **đã phát hành** tuyệt đối không được phép sửa đổi thông tin.

## 3. Luồng nghiệp vụ (User Flow)
1.  **Truy cập:** Người dùng vào màn hình "Danh sách hóa đơn".
2.  **Chọn bản ghi:** Tìm hóa đơn cần sửa trong danh sách.
3.  **Kích hoạt:** Nhấn vào biểu tượng hình cây bút (Sửa) trên dòng tương ứng.
4.  **Chỉnh sửa:** Hệ thống hiển thị màn hình "Sửa thông tin hóa đơn" với dữ liệu cũ. Người dùng thực hiện thay đổi thông tin cần thiết.
5.  **Hoàn tất:**
    *   Chọn **Lưu** để cập nhật thay đổi vào hệ thống.
    *   Chọn **Quay lại** để hủy bỏ thay đổi và trở về danh sách.

## 4. Chi tiết dữ liệu và Ràng buộc (Data Fields & Constraints)

### A. Nhóm trường không được phép sửa (Read-only)
*   **Tên hóa đơn:** (Lưu ý: Tài liệu 4.3 ghi không được sửa, tài liệu 4.2 cho phép sửa lúc tạo mới).
*   **Mã số thuế đơn vị:** Tự động lấy từ thông tin đơn vị.
*   **Đơn vị:** Tên đơn vị bán hàng.
*   **Mẫu số:** Được lấy từ mẫu đã chọn khi đăng ký.

### B. Nhóm trường bắt buộc nhập (Mandatory)
*   Ký hiệu.
*   Địa chỉ đơn vị (Mặc định lấy từ thông tin đơn vị nhưng cho phép sửa).
*   Tên khách hàng.
*   Hình thức thanh toán.
*   Danh sách sản phẩm/dịch vụ (phải có ít nhất 1 dòng).

### C. Thông tin khách hàng (Customer Information)
*   **Tên khách hàng:** Hỗ trợ gợi ý từ danh sách khách hàng có sẵn trong hệ thống.
*   **Thông tin đi kèm:** Khi chọn khách hàng từ gợi ý, hệ thống tự động điền: *Mã số thuế, Địa chỉ, Số điện thoại, Mã khách hàng*. 
*   **Quyền hạn:** Người dùng có thể sửa đổi lại tất cả các thông tin này sau khi hệ thống tự điền.

### D. Danh sách hàng hóa, dịch vụ (Product/Service List)
Mỗi dòng sản phẩm bao gồm:
*   **Tên hàng hóa/dịch vụ:** Hỗ trợ gợi ý từ danh mục sản phẩm.
*   **Đơn vị tính, Số lượng, Đơn giá:** Tự động lấy ra nếu chọn từ gợi ý.
*   **Chiết khấu:** 
    *   Tùy theo mẫu hóa đơn. 
    *   Nếu có chiết khấu theo dòng: Cần nhập nội dung chiết khấu (tên hàng hóa dịch vụ), số tiền chiết khấu và đánh dấu tích vào cột chiết khấu.
*   **Thao tác danh sách:** Có thể xóa dòng bằng cách nhấn biểu tượng "x" trên dòng tương ứng.

## 5. Các quy tắc tính toán & Tự động hóa
*   **Thành tiền:** Tự động tính = `Số lượng` x `Đơn giá`.
*   **Tổng tiền dịch vụ:** Tổng cộng thành tiền của tất cả các dòng sản phẩm.
*   **Tiền thuế GTGT:** Tính dựa trên phần trăm thuế suất áp dụng.
*   **Tổng cộng tiền thanh toán:** = `Tổng tiền dịch vụ` + `Tiền thuế GTGT`.
*   **Số tiền bằng chữ:** Hệ thống tự động chuyển đổi từ tổng tiền thanh toán sang dạng chữ.

## 6. Giao diện (UX Reference)
*   **Màn hình:** Tương tự màn hình "Tạo mới hóa đơn" nhưng các trường dữ liệu đã có sẵn thông tin.
*   **Biểu tượng hành động:** 
    *   Cây bút: Sửa.
    *   Dấu X đỏ: Xóa dòng sản phẩm.
*   **Nút bấm chính:** 
    *   [Lưu]: Lưu dữ liệu.
    *   [Quay lại]: Hủy và đóng màn hình.

---
*Thông tin được tổng hợp trực tiếp từ tài liệu nghiệp vụ mục 4.2 và 4.3.*
