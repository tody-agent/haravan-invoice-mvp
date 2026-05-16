Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **Tìm kiếm thông báo phát hành** dựa trên tài liệu PDF `docs/321_Tìm_kiếm_thông_báo_phát_hành.pdf`.

---

# PHÂN TÍCH NGHIỆP VỤ: TÌM KIẾM THÔNG BÁO PHÁT HÀNH HÓA ĐƠN ĐIỆN TỬ (HDDT)

## 1. Mục đích
Quản lý danh sách các thông báo phát hành HDDT. Hệ thống cho phép người dùng thực hiện các thao tác:
*   Tìm kiếm thông báo.
*   Xem chi tiết/Thêm mới/Sửa/Xóa thông báo.
*   Gửi thông báo tới Cơ quan thuế (CQT).
*   In thông báo phát hành.
*   Chuyển trạng thái cho thông báo đã gửi CQT và thông báo đã được CQT chấp nhận.

## 2. Luồng nghiệp vụ (User Flow)
1.  **Truy cập chức năng:** Người dùng chọn menu **ĐĂNG KÝ PHÁT HÀNH** -> **Thông báo phát hành**.
2.  **Nhập điều kiện tìm kiếm:** Tại màn hình "Thông báo phát hành", người dùng thiết lập các bộ lọc:
    *   Chọn khoảng thời gian lập thông báo (**Từ ngày** - **Đến ngày**).
    *   Chọn **Trạng thái** thông báo.
3.  **Thực thi:** Kích chọn nút **Tìm kiếm**.
4.  **Hiển thị kết quả:** 
    *   Nếu có dữ liệu thỏa mãn: Hiển thị danh sách kết quả phía dưới.
    *   Nếu không có dữ liệu: Không có kết quả nào hiển thị trên danh sách.
5.  **Tương tác danh sách (Phân trang):**
    *   Mặc định hiển thị **10 dòng/trang**.
    *   Người dùng có thể chuyển trang bằng cách kích vào số trang cụ thể hoặc sử dụng nút tới/lùi (Next/Previous).

## 3. Dữ liệu và Giao diện

### 3.1. Các tiêu chí tìm kiếm (Input)
| Tên trường | Loại dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| Từ ngày | Date (dd/mm/yyyy) | Ngày bắt đầu khoảng thời gian lập |
| Đến ngày | Date (dd/mm/yyyy) | Ngày kết thúc khoảng thời gian lập |
| Trạng thái | Dropdown | Gồm 03 trạng thái: <br>1. Thông báo mới lập <br>2. Thông báo đã gửi CQT nhưng chưa được chấp nhận <br>3. Thông báo đã gửi CQT và đã được chấp nhận |

### 3.2. Danh sách kết quả (Output)
Dựa trên hình ảnh giao diện trong tài liệu, danh sách bao gồm các cột:
*   **STT:** Số thứ tự.
*   **Tên đơn vị phát hành:** Tên doanh nghiệp/tổ chức phát hành hóa đơn.
*   **Tên cơ quan thuế chấp nhận thông báo:** Tên CQT quản lý tiếp nhận thông báo.
*   **Ngày lập:** Ngày khởi tạo thông báo phát hành.
*   **Trạng thái:** Tương ứng với các trạng thái đã lọc.
*   **Hành động (Icon):**
    *   **Chi tiết:** Xem nội dung chi tiết thông báo.
    *   **Sửa:** Chỉnh sửa thông báo (thường áp dụng cho trạng thái "Mới lập").
    *   **Xóa:** Loại bỏ thông báo khỏi hệ thống.

### 3.3. Quy định phân trang
*   Số lượng bản ghi mỗi trang: **10**.
*   Điều hướng: Số trang trực tiếp, nút trang trước (`<`), nút trang sau (`>`).

---
*Ghi chú: Bản phân tích này được trích xuất trung thực từ nội dung tài liệu "3.2.1 Tìm kiếm thông báo phát hành HDDT".*
