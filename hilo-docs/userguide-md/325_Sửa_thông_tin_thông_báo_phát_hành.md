Dựa trên tài liệu **"3.2.5 Sửa thông tin thông báo phát hành"** từ file PDF đã cung cấp, dưới đây là bảng phân tích chi tiết nghiệp vụ phục vụ cho việc clone và refactor UX:

---

# Phân tích Nghiệp vụ: Sửa thông tin thông báo phát hành

## 1. Tổng quan tính năng
Tính năng này cho phép Người dùng (NSD) điều chỉnh thông tin của các Thông báo phát hành hóa đơn đã được tạo nhưng chưa được Cơ quan thuế chấp nhận chính thức.

## 2. Quy tắc nghiệp vụ (Business Rules)
*   **Điều kiện chỉnh sửa:** Chỉ được phép sửa đối với các thông báo có trạng thái:
    *   Mới tạo (chưa gửi).
    *   Đã gửi Cơ quan thuế nhưng **chưa được chấp nhận** (bị từ chối hoặc đang chờ duyệt).
*   **Ràng buộc trường dữ liệu:**
    *   **Trường không được phép sửa (Read-only):**
        1.  Tên tổ chức khởi tạo hóa đơn.
        2.  Mã số thuế.
    *   **Trường được phép sửa:** Tất cả các thông tin còn lại của Thông báo phát hành.

## 3. Luồng nghiệp vụ (User Flow)

### Bước 1: Truy cập và Chọn bản ghi
1.  NSD truy cập vào trang **Thông báo phát hành**.
2.  Hệ thống hiển thị danh sách các thông báo hiện có.
3.  NSD tìm kiếm thông báo cần sửa (sử dụng bộ lọc: *Từ ngày, Đến ngày, Trạng thái*).
4.  NSD nhấn vào biểu tượng **Sửa** (hình cây bút) trên dòng tương ứng của thông báo.

### Bước 2: Thực hiện chỉnh sửa
Màn hình **Sửa thông tin thông báo phát hành** hiển thị, NSD thực hiện:
1.  Thay đổi các thông tin chung của thông báo (trừ Tên tổ chức và MST).
2.  Quản lý danh sách **Loại hóa đơn phát hành** đi kèm:
    *   **Thêm mới:** Bổ sung thêm loại hóa đơn vào thông báo.
    *   **Sửa:** Cập nhật thông tin của loại hóa đơn đã có trong danh sách.
    *   **Xóa:** Loại bỏ loại hóa đơn khỏi thông báo.

### Bước 3: Hoàn tất
1.  **Lưu:** Nhấn nút "Lưu" để hệ thống ghi nhận các thay đổi vào cơ sở dữ liệu.
2.  **Quay lại:** Nhấn nút "Quay lại" nếu muốn hủy bỏ các thay đổi và trở về màn hình danh sách.

## 4. Đặc tả dữ liệu

### A. Thông tin tìm kiếm (Màn hình danh sách)
| Trường dữ liệu | Loại | Ghi chú |
| :--- | :--- | :--- |
| Từ ngày | DatePicker | Lọc theo ngày lập thông báo |
| Đến ngày | DatePicker | Lọc theo ngày lập thông báo |
| Trạng thái | Dropdown | Trạng thái của thông báo |

### B. Thông tin trong danh sách (Table)
*   STT
*   Tên đơn vị phát hành
*   Tên cơ quan thuế chấp nhận thông báo
*   Ngày lập
*   Trạng thái (Ví dụ: Chờ chấp nhận, Chấp nhận, ...)
*   Hành động: Chi tiết (Xem), Sửa, Xóa.

### C. Thông tin màn hình Chỉnh sửa
| Nhóm dữ liệu | Trường dữ liệu | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Thông tin chung** | Tên tổ chức khởi tạo | Khóa (Read-only) | Lấy từ hồ sơ đơn vị |
| | Mã số thuế | Khóa (Read-only) | Lấy từ hồ sơ đơn vị |
| | Các trường khác... | Cho phép sửa | Theo nghiệp vụ thông báo phát hành |
| **Loại hóa đơn** | Danh sách hóa đơn | Edit/Delete/Add | Chi tiết theo nghiệp vụ "Loại hóa đơn phát hành" |

---
*Lưu ý: Các chi tiết về việc "Thêm/Sửa/Xóa loại hóa đơn phát hành" được tham chiếu đến các phần nghiệp vụ tương ứng trong tài liệu "Thêm mới thông báo phát hành".*
