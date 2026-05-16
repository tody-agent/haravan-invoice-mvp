Dựa trên tài liệu **"7.6 Báo cáo thay thế hóa đơn"** được cung cấp, dưới đây là bản phân tích nghiệp vụ chi tiết để phục vụ việc clone và refactor UX:

# Phân tích nghiệp vụ: Báo cáo thay thế hóa đơn

## 1. Thông tin chung
*   **Tên tính năng:** Báo cáo thay thế hóa đơn.
*   **Mục đích:** Thống kê số lượng hóa đơn đã được xử lý thay thế trong hệ thống.
*   **Vị trí:** Menu "Báo cáo thay thế hóa đơn".

## 2. Luồng nghiệp vụ (User Flow)
1.  Người dùng truy cập vào menu **Báo cáo thay thế hóa đơn**.
2.  Nhập các điều kiện lọc để giới hạn phạm vi báo cáo.
3.  Nhấn nút **Tìm kiếm** để hiển thị danh sách hóa đơn thay thế.
4.  Xem kết quả trực tiếp trên bảng dữ liệu.
5.  (Tùy chọn) Nhấn **Xuất file XLS** để tải báo cáo về định dạng Excel.
6.  (Tùy chọn) Nhấn **Quay lại** để trở về trang trước đó.

## 3. Các trường dữ liệu (Data Fields)

### A. Điều kiện tìm kiếm (Filter Criteria)
*   **Từ ngày:** Chọn ngày bắt đầu khoảng thời gian báo cáo.
*   **Đến ngày:** Chọn ngày kết thúc khoảng thời gian báo cáo.
*   **Người thực hiện:** Nhập tên hoặc định danh người thực hiện thao tác thay thế hóa đơn.
*   *Lưu ý nghiệp vụ:* Hệ thống giới hạn tìm kiếm dữ liệu trong vòng **01 tháng (30 ngày)**.

### B. Danh sách kết quả (Search Results Table)
Bảng kết quả bao gồm thông tin so sánh giữa hóa đơn cũ (bị thay thế) và hóa đơn mới (hóa đơn thay thế):

| STT | Nhóm dữ liệu | Tên trường | Ghi chú |
| :-- | :--- | :--- | :--- |
| 1 | | **STT** | Số thứ tự |
| 2 | **Hóa đơn cũ** | **Mẫu cũ** | Mẫu số hóa đơn bị thay thế |
| 3 | | **Ký hiệu cũ** | Ký hiệu hóa đơn bị thay thế |
| 4 | | **Số HĐ cũ** | Số hóa đơn bị thay thế |
| 5 | | **Ngày PH** | Ngày phát hành của hóa đơn cũ |
| 6 | | **Tổng tiền** | Tổng tiền trên hóa đơn cũ |
| 7 | **Hóa đơn mới** | **Mẫu mới** | Mẫu số hóa đơn thay thế mới |
| 8 | | **Ký hiệu mới** | Ký hiệu hóa đơn thay thế mới |
| 9 | | **Số HĐ mới** | Số hóa đơn thay thế mới |
| 10 | | **Ngày PH** | Ngày phát hành của hóa đơn mới |
| 11 | | **Tổng tiền** | Tổng tiền trên hóa đơn mới |
| 12 | **Thông tin chung**| **Thông tin khách hàng**| Tên/Mã khách hàng liên quan |
| 13 | | **Người thực hiện** | Tài khoản thực hiện thao tác |
| 14 | | **Ngày thực hiện** | Ngày giờ thực hiện việc thay thế |

## 4. Các hành động (Actions)
*   **Tìm kiếm (Search):** Kích hoạt việc lọc dữ liệu theo điều kiện đã nhập.
*   **Xuất file XLS (Export):** Trích xuất danh sách kết quả ra file Excel.
*   **Quay lại (Back):** Thoát khỏi màn hình báo cáo.
*   **Phân trang:** Điều hướng giữa các trang kết quả (nếu có nhiều dữ liệu).

## 5. Đặc điểm giao diện (UX UI Observation)
*   Giao diện chia làm 2 phần rõ rệt: Khối bộ lọc phía trên và Khối danh sách kết quả phía dưới.
*   Khối bộ lọc có ghi chú nhắc nhở về giới hạn thời gian (30 ngày) ngay dưới nút Tìm kiếm.
*   Bảng dữ liệu có sự phân biệt thông tin giữa Hóa đơn cũ và Hóa đơn mới để người dùng dễ đối chiếu.
