Dựa trên tài liệu **"4.1 Quản lý tạo lập hóa đơn"** (file `docs/41_Quản_lý_tạo_lập_hóa_đơn.pdf`), tôi xin trình bày bản phân tích chi tiết nghiệp vụ như sau:

---

# PHÂN TÍCH NGHIỆP VỤ: QUẢN LÝ TẠO LẬP HÓA ĐƠN (MỤC 4.1)

## 1. Tổng quan tính năng
Tính năng này thuộc phân hệ **Quản lý, tạo lập hóa đơn**, tập trung vào việc tra cứu, tìm kiếm và theo dõi danh sách các hóa đơn đã được khởi tạo trong hệ thống.

## 2. Luồng nghiệp vụ (User Flow)
Quy trình tìm kiếm hóa đơn bao gồm các bước:
1.  **Truy cập**: Từ màn hình chính của hệ thống, người dùng chọn menu **Danh sách hóa đơn**.
2.  **Thiết lập bộ lọc**: Người dùng nhập hoặc chọn các tiêu chí tìm kiếm tại form lọc dữ liệu.
3.  **Thực thi**: Nhấn nút **"Tìm kiếm"**.
4.  **Tiếp nhận kết quả**:
    *   Hệ thống hiển thị danh sách hóa đơn thỏa mãn điều kiện bên dưới form tìm kiếm.
    *   Nếu không có dữ liệu phù hợp, danh sách sẽ trống.
5.  **Điều hướng**: Người dùng thực hiện phân trang để xem danh sách nếu số lượng hóa đơn lớn hơn 10.

## 3. Chi tiết dữ liệu (Data Fields)

### A. Tiêu chí tìm kiếm (Input/Search Fields)
Dựa trên văn bản và hình ảnh minh họa trong tài liệu, các trường dữ liệu phục vụ tìm kiếm bao gồm:

| Tên trường | Loại dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| **Mẫu số** | Dropdown/Chọn | Ví dụ: `01GTKT0/001` |
| **Ký hiệu** | Dropdown/Chọn | Ví dụ: `AA/18E` |
| **Trạng thái hóa đơn** | Dropdown/Chọn | Gồm 5 trạng thái chính (xem mục 4) |
| **Số hóa đơn** | Văn bản (Text) | Nhập số hóa đơn cụ thể |
| **Ngày tạo hóa đơn** | Ngày (Date Range) | Lọc từ ngày - đến ngày |
| **Tên khách hàng** | Văn bản (Text) | *Quan sát từ ảnh chụp màn hình* |
| **Mã số thuế** | Văn bản (Text) | *Quan sát từ ảnh chụp màn hình* |
| **Mã khách hàng** | Văn bản (Text) | *Quan sát từ ảnh chụp màn hình* |
| **Kiểu hóa đơn** | Dropdown/Chọn | *Quan sát từ ảnh chụp màn hình* |

### B. Cấu trúc danh sách kết quả (Output List)
Hệ thống hiển thị dữ liệu theo dạng bảng với các cột thông tin (quan sát từ ảnh):
*   **STT**: Số thứ tự.
*   **Mẫu số**: Mã mẫu hóa đơn.
*   **Ký hiệu**: Ký hiệu hóa đơn.
*   **Số hóa đơn**: Số định danh hóa đơn.
*   **Ngày lập**: Ngày khởi tạo.
*   **Tên khách hàng**: Tên đơn vị/cá nhân mua hàng.
*   **Mã số thuế**: MST của khách hàng.
*   **Tổng tiền**: Tổng giá trị hóa đơn.
*   **Trạng thái**: Tình trạng hiện tại của hóa đơn.
*   **Thao tác**: Các biểu tượng chức năng (Xem, Sửa, Xóa...).

## 4. Quy tắc nghiệp vụ (Business Rules)

### 4.1. Trạng thái hóa đơn
Hệ thống quản lý hóa đơn theo 5 trạng thái nghiệp vụ bắt buộc:
1.  **Hóa đơn mới tạo**: Hóa đơn vừa được lập, chưa ký phát hành.
2.  **Hóa đơn đã phát hành**: Đã ký số và có hiệu lực.
3.  **Hóa đơn đã khai thuế**: Đã được gửi/chấp nhận bởi cơ quan thuế.
4.  **Hóa đơn bị thay thế**: Hóa đơn cũ đã được hủy và thay bằng hóa đơn mới.
5.  **Hóa đơn bị điều chỉnh**: Hóa đơn có sai sót và đã được lập hóa đơn điều chỉnh.

### 4.2. Quy tắc phân trang (Pagination)
*   **Số lượng hiển thị**: Mặc định **10 hóa đơn/trang**.
*   **Cách thức điều hướng**:
    *   Kích chọn trực tiếp số trang (ví dụ: số 2) để nhảy đến trang tương ứng.
    *   Sử dụng nút `<` để về trang liền trước.
    *   Sử dụng nút `>` để sang trang liền sau.

---
*Lưu ý: Nội dung trên được tổng hợp chính xác theo các thông tin có trong tài liệu 41_Quản_lý_tạo_lập_hóa_đơn.pdf phục vụ cho mục đích refactor UX.*
