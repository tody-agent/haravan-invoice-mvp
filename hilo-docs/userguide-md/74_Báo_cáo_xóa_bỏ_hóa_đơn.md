Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **Báo cáo xóa bỏ hóa đơn** dựa trên tài liệu cung cấp.

---

# PHÂN TÍCH NGHIỆP VỤ: BÁO CÁO XÓA BỎ HÓA ĐƠN

## 1. Mục đích
Thống kê và liệt kê danh sách các hóa đơn đã bị xóa bỏ trong hệ thống để phục vụ công tác kiểm soát và quản lý.

## 2. Luồng nghiệp vụ (User Flow)
1. **Truy cập:** Người dùng chọn menu **"Báo cáo xóa bỏ hóa đơn"**.
2. **Thiết lập bộ lọc:** Người dùng nhập các điều kiện tìm kiếm để giới hạn dữ liệu cần báo cáo.
3. **Thực thi:** Người dùng nhấn nút **"Tìm kiếm"**.
4. **Hiển thị:** Hệ thống trả về danh sách các hóa đơn thỏa mãn điều kiện tại bảng kết quả bên dưới.
5. **Xuất bản (Tùy chọn):** Người dùng chọn nút **"Xuất file XLS"** để tải báo cáo về máy định dạng Excel.
6. **Điều hướng khác:** Người dùng có thể nhấn **"Quay lại"** để trở về màn hình trước đó.

## 3. Chi tiết các thành phần dữ liệu

### 3.1. Bộ lọc tìm kiếm (Search Filters)
Dữ liệu đầu vào để lọc báo cáo bao gồm:
*   **Từ ngày:** Định dạng ngày (Date picker), xác định mốc thời gian bắt đầu.
*   **Đến ngày:** Định dạng ngày (Date picker), xác định mốc thời gian kết thúc.
*   **Người hủy:** Trường nhập liệu văn bản (Text input), dùng để lọc theo tên người thực hiện thao tác xóa/hủy.
*   **Ràng buộc hệ thống:** Chỉ cho phép tìm kiếm dữ liệu trong phạm vi tối đa **01 tháng (30 ngày)**.

### 3.2. Danh sách kết quả (Result Table)
Bảng hiển thị các thông tin chi tiết của hóa đơn bị xóa bỏ:
1.  **STT:** Số thứ tự.
2.  **Mẫu số:** Mẫu số của hóa đơn.
3.  **Ký hiệu:** Ký hiệu hóa đơn.
4.  **Số hóa đơn:** Số hiệu định danh của hóa đơn.
5.  **Ngày PH:** Ngày phát hành hóa đơn ban đầu.
6.  **Tổng tiền:** Tổng giá trị thanh toán của hóa đơn.
7.  **Thông tin khách hàng:** Tên hoặc thông tin định danh của bên mua.
8.  **Người thực hiện:** Tài khoản/Tên người đã thao tác xóa bỏ hóa đơn.
9.  **Ngày thực hiện:** Thời điểm chính xác thực hiện thao tác xóa bỏ.

## 4. Các tính năng hệ thống
*   **Tìm kiếm:** Lọc dữ liệu động theo điều kiện.
*   **Phân trang:** Cho phép xem danh sách kết quả qua các trang (Sử dụng các nút điều hướng trang).
*   **Xuất Excel:** Kết xuất toàn bộ danh sách kết quả đang hiển thị ra file `.xls`.
*   **Quay lại:** Thoát khỏi chức năng báo cáo hiện tại.

---
*Ghi chú: Nội dung được tổng hợp trực tiếp từ tài liệu "7.4 Báo cáo xóa bỏ hóa đơn".*
