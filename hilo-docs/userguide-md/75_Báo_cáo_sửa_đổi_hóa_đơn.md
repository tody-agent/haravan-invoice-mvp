Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **Báo cáo sửa đổi hóa đơn** dựa trên tài liệu `docs/75_Báo_cáo_sửa_đổi_hóa_đơn.pdf`.

---

# PHÂN TÍCH NGHIỆP VỤ: BÁO CÁO SỬA ĐỔI HÓA ĐƠN (7.5)

## 1. Mục đích
Thống kê, theo dõi số lượng và chi tiết các hóa đơn đã được điều chỉnh hoặc sửa đổi thông tin trong hệ thống, giúp người dùng đối chiếu sự thay đổi giữa dữ liệu cũ và dữ liệu mới.

## 2. Các tính năng chính
*   **Tìm kiếm & Lọc:** Cho phép lọc báo cáo theo khoảng thời gian và người thực hiện thay đổi.
*   **Xem danh sách kết quả:** Hiển thị chi tiết so sánh giữa hóa đơn trước khi sửa và sau khi sửa.
*   **Xuất dữ liệu:** Hỗ trợ kết xuất báo cáo ra định dạng Excel (`.xls`).

## 3. Luồng nghiệp vụ (User Flow)
1.  **Truy cập:** Người dùng chọn menu **"Báo cáo sửa đổi hóa đơn"**.
2.  **Thiết lập điều kiện lọc:**
    *   Chọn khoảng thời gian (**Từ ngày** - **Đến ngày**).
    *   Nhập/Chọn tên **Người thực hiện** (nếu cần lọc cụ thể).
3.  **Thực thi tìm kiếm:** Nhấn nút **"Tìm kiếm"**.
    *   *Ràng buộc hệ thống:* Chỉ cho phép tìm kiếm dữ liệu trong phạm vi tối đa **01 tháng (30 ngày)**.
4.  **Kiểm tra kết quả:** Hệ thống hiển thị danh sách các bản ghi khớp với điều kiện lọc trên lưới (Grid).
5.  **Xuất báo cáo (Tùy chọn):** Nhấn nút **"Xuất file XLS"** để tải về máy tính file Excel chứa toàn bộ danh sách kết quả.
6.  **Quay lại:** Nhấn nút **"Quay lại"** để trở về trang trước đó.

## 4. Dữ liệu chi tiết

### 4.1. Điều kiện tìm kiếm (Input)
| Tên trường | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| Từ ngày | Date Picker | Bắt buộc |
| Đến ngày | Date Picker | Bắt buộc (Khoảng cách với Từ ngày ≤ 30 ngày) |
| Người thực hiện | Text/Dropdown | Tên tài khoản hoặc người dùng thực hiện sửa hóa đơn |

### 4.2. Danh sách kết quả (Output - Grid)
Lưới hiển thị dữ liệu so sánh song song giữa trạng thái **Cũ** và **Mới**:

| STT | Nhóm thông tin | Tên trường hiển thị | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | | STT | Số thứ tự |
| 2 | **Thông tin cũ** | Mẫu HĐ cũ | Ký hiệu mẫu hóa đơn trước khi sửa |
| 3 | | Ký hiệu HĐ cũ | Ký hiệu hóa đơn trước khi sửa |
| 4 | | Số HĐ cũ | Số hóa đơn trước khi sửa |
| 5 | | Ngày ký | Ngày ký hóa đơn cũ |
| 6 | | Tổng tiền | Tổng cộng tiền thanh toán trên hóa đơn cũ |
| 7 | **Thông tin mới** | Mẫu HĐ mới | Ký hiệu mẫu hóa đơn sau khi sửa |
| 8 | | Ký hiệu HĐ mới | Ký hiệu hóa đơn sau khi sửa |
| 9 | | Số HĐ mới | Số hóa đơn sau khi sửa |
| 10 | | Ngày ký | Ngày ký hóa đơn mới |
| 11 | | Tổng tiền | Tổng cộng tiền thanh toán trên hóa đơn mới |
| 12 | **Định danh & Vận hành** | Thông tin khách hàng | Tên đơn vị/người mua hàng |
| 13 | | Người thực hiện | Người thực hiện thao tác sửa đổi |
| 14 | | Ngày thực hiện | Ngày giờ thực hiện thao tác sửa đổi trên hệ thống |

## 5. Các ghi chú cho UX Refactor
*   **Cảnh báo giới hạn thời gian:** Cần hiển thị rõ dòng thông báo *"Chỉ tìm kiếm dữ liệu trong vòng 01 tháng (30 ngày)"* ngay dưới hoặc cạnh bộ lọc để người dùng dễ nhận biết.
*   **Phân nhóm dữ liệu:** Trên Grid kết quả, nên có sự phân biệt rõ rệt về mặt thị giác (màu sắc hoặc header 2 tầng) giữa nhóm cột "Hóa đơn cũ" và "Hóa đơn mới" để người dùng dễ so sánh.
*   **Xử lý trạng thái trống:** Nếu không có dữ liệu trong khoảng thời gian chọn, cần hiển thị thông báo "Không tìm thấy dữ liệu".

---
*Dựa trên tài liệu hướng dẫn vận hành hệ thống hóa đơn điện tử.*
