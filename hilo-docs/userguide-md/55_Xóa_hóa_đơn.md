Dưới đây là phân tích chi tiết nghiệp vụ tính năng **Xóa hóa đơn** dựa trên tài liệu `docs/55_Xóa_hóa_đơn.pdf`.

---

# PHÂN TÍCH NGHIỆP VỤ: XÓA HÓA ĐƠN
**(Tài liệu gốc: 5.5 Xóa hóa đơn / Nội dung kỹ thuật: 4.4 Xóa hóa đơn)**

## 1. Mục tiêu tính năng
Cho phép người dùng loại bỏ các bản ghi hóa đơn đã tạo sai hoặc không còn nhu cầu sử dụng ra khỏi hệ thống trước khi chúng chính thức có hiệu lực pháp lý.

## 2. Quy tắc nghiệp vụ (Business Rules)
*   **Điều kiện thực hiện:** Chỉ được phép xóa các hóa đơn ở trạng thái **mới tạo** và **chưa thực hiện phát hành**.
*   **Tính không thể đảo ngược:** Sau khi xác nhận xóa thành công, dữ liệu sẽ bị loại bỏ hoàn toàn và **không thể khôi phục** lại được.

## 3. Luồng nghiệp vụ (User Flow)

### Bước 1: Chọn hóa đơn và yêu cầu xóa
1.  Người dùng truy cập vào trang **Danh sách hóa đơn**.
2.  Tìm kiếm và xác định hóa đơn cần xóa trên lưới dữ liệu.
3.  Nhấn vào biểu tượng xóa (hình dấu **x**) tại dòng tương ứng với hóa đơn đó.
4.  **Hệ thống:** Hiển thị cửa sổ popup xác nhận yêu cầu xóa.
    *   *Nội dung cảnh báo:* "Bạn muốn xóa dữ liệu này? Dữ liệu sẽ không thể khôi phục sau khi xóa".
    *   *Các tùy chọn:* [Hủy] | [Xóa].

### Bước 2: Thực hiện hành động xác nhận
*   **Trường hợp hủy lệnh:** Người dùng nhấn nút **Hủy**.
    *   Hệ thống đóng cửa sổ xác nhận.
    *   Giữ nguyên trạng thái hóa đơn và quay về màn hình Danh sách hóa đơn.
*   **Trường hợp xác nhận xóa:** Người dùng nhấn nút **Xóa**.
    *   Hệ thống thực hiện kiểm tra điều kiện và xóa dữ liệu trong cơ sở dữ liệu.

## 4. Kết quả và Thông báo (System Responses)

| Kịch bản | Hành động của hệ thống | Thông báo hiển thị |
| :--- | :--- | :--- |
| **Xóa thành công** | Loại bỏ hóa đơn khỏi hệ thống và cập nhật lại danh sách. | "Xóa thành công." |
| **Xóa thất bại** | Giữ nguyên dữ liệu hóa đơn nếu có lỗi hệ thống phát sinh. | "Xóa không thành công." |

## 5. Yêu cầu về dữ liệu (Data Requirements)

### Dữ liệu đầu vào (Input)
*   **Invoice Identifier:** ID của hóa đơn được chọn từ danh sách.
*   **User Action:** Tín hiệu xác nhận (Confirm) hoặc Hủy (Cancel) từ giao diện.

### Dữ liệu đầu ra (Output)
*   **Status Update:** Trạng thái tồn tại của hóa đơn trong cơ sở dữ liệu (Deleted).
*   **Refresh List:** Danh sách hóa đơn mới đã được cập nhật (không còn chứa hóa đơn đã xóa).

---
*Lưu ý: Phân tích này được thực hiện nghiêm ngặt dựa trên nội dung văn bản và hình ảnh có trong tài liệu docs/55_Xóa_hóa_đơn.pdf.*
