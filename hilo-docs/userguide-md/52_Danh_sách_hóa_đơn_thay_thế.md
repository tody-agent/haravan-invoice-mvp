Dưới đây là kết quả phân tích nghiệp vụ chi tiết từ tài liệu **"5.2 Danh sách hóa đơn thay thế"** phục vụ cho việc clone và refactor UX.

---

# Tài liệu Phân tích Nghiệp vụ: Danh sách hóa đơn thay thế

## 1. Tổng quan (Overview)
Tính năng này thuộc phân hệ **Xử lý hóa đơn**, cho phép người dùng tra cứu, theo dõi và quản lý lịch sử các hóa đơn đã được thay thế. Điểm đặc trưng của tính năng này là hiển thị thông tin theo cặp: **Hóa đơn bị thay thế (Gốc)** và **Hóa đơn thay thế (Mới)** để người dùng dễ dàng đối chiếu.

## 2. Luồng nghiệp vụ (User Flow)
1.  **Truy cập:** Người dùng điều hướng theo menu: `Xử lý hóa đơn` -> `Hóa đơn thay thế`.
2.  **Thiết lập bộ lọc:** Người dùng nhập các tiêu chí tìm kiếm để giới hạn phạm vi dữ liệu (thời gian, ký hiệu, thông tin khách hàng).
3.  **Thực thi:** Nhấn nút `Tìm kiếm`.
4.  **Khai thác dữ liệu:** 
    *   Xem danh sách các cặp hóa đơn tương ứng.
    *   Xem chi tiết nội dung hóa đơn gốc hoặc hóa đơn thay thế.
    *   Xem các văn bản/thỏa thuận liên quan đến việc thay thế hóa đơn.

## 3. Chi tiết tính năng & Dữ liệu (Functional & Data Details)

### 3.1. Bộ lọc tìm kiếm (Search Components)
Hệ thống cung cấp các trường dữ liệu sau để lọc danh sách:

| Trường dữ liệu | Kiểu dữ liệu | Mô tả/Ví dụ |
| :--- | :--- | :--- |
| **Mẫu số** | Danh sách chọn | Mẫu số hóa đơn (VD: 01GTKT0/001) |
| **Ký hiệu** | Văn bản | Ký hiệu hóa đơn (VD: AA/17E) |
| **Từ ngày HĐ** | Ngày tháng | Ngày bắt đầu kỳ tìm kiếm |
| **Đến ngày HĐ** | Ngày tháng | Ngày kết thúc kỳ tìm kiếm |
| **Tên khách hàng** | Văn bản | Tìm theo tên đơn vị mua hàng |
| **Số hóa đơn** | Văn bản | Tìm đích danh số hóa đơn |
| **Mã số thuế** | Văn bản | Mã số thuế của khách hàng |
| **Mã khách hàng** | Văn bản | Mã định danh khách hàng trên hệ thống |

### 3.2. Cấu trúc bảng dữ liệu (Result Table)
Bảng kết quả được thiết kế theo dạng so sánh song song giữa hóa đơn cũ và hóa đơn mới:

#### A. Nhóm thông tin Hóa đơn bị thay thế (Replaced Invoice)
*   **Stt:** Số thứ tự dòng.
*   **Mẫu số:** Mẫu số của hóa đơn gốc đã bị hủy bỏ/thay thế.
*   **Ký hiệu:** Ký hiệu của hóa đơn gốc.
*   **Số (No):** Số hóa đơn gốc.
*   **Chi tiết:** Biểu tượng/Liên kết dẫn đến trang xem chi tiết hóa đơn gốc.
*   **Ghi chú:** Các thông tin bổ trợ hoặc lý do thay thế liên quan đến hóa đơn gốc.

#### B. Nhóm thông tin Hóa đơn thay thế (Replacement Invoice)
*   **Mẫu số:** Mẫu số của hóa đơn mới phát hành thay thế.
*   **Ký hiệu:** Ký hiệu của hóa đơn mới.
*   **Số (No):** Số hóa đơn mới.
*   **Chi tiết:** Biểu tượng/Liên kết dẫn đến trang xem chi tiết hóa đơn mới.
*   **Ghi chú:** Các thông tin bổ trợ liên quan đến hóa đơn mới.
*   **Văn bản:** Liên kết mở file hoặc tài liệu biên bản thỏa thuận thay thế hóa đơn giữa người mua và người bán.

## 4. Ghi chú nghiệp vụ quan trọng (Business Notes)
*   **Sự nhầm lẫn trong tài liệu:** Tại dòng đầu tiên của tài liệu có ghi *"Danh sách hóa đơn hủy..."*, tuy nhiên dựa trên tiêu đề và cấu trúc bảng dữ liệu, đây là một lỗi soạn thảo. Chức năng chính xác và xuyên suốt của file là **Hóa đơn thay thế**.
*   **Tính liên kết:** Mỗi dòng trong bảng đại diện cho một nghiệp vụ thay thế thành công, kết nối chặt chẽ giữa ID hóa đơn cũ và ID hóa đơn mới.

---
*Dữ liệu được trích xuất chính xác từ file docs/52_Danh_sách_hóa_đơn_thay_thế.pdf.*
