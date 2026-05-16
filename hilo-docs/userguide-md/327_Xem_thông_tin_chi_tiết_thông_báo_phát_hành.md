Dựa trên tài liệu nghiệp vụ tại file `docs/327_Xem_thông_tin_chi_tiết_thông_báo_phát_hành.pdf`, tôi xin tóm tắt và trình bày lại các thông tin chi tiết phục vụ cho việc clone và refactor UX như sau:

# Phân tích Nghiệp vụ: Xem chi tiết thông báo phát hành

## 1. Mục tiêu tính năng
Cho phép người dùng xem lại toàn bộ nội dung của một "Thông báo phát hành hóa đơn điện tử" đã có trên hệ thống. Thông tin được trình bày theo định dạng mẫu thông báo quy chuẩn để người dùng kiểm tra hoặc in ấn.

## 2. Luồng nghiệp vụ (User Flow)
*   **Bước 1:** Người dùng truy cập vào trang danh sách **Thông báo phát hành**.
*   **Bước 2:** Trên bảng danh sách, người dùng tìm đến bản ghi (thông báo) cần xem.
*   **Bước 3:** Click vào biểu tượng **"Xem" (hình con mắt)** ở cột chức năng tương ứng của dòng đó.
*   **Bước 4:** Hệ thống hiển thị màn hình (hoặc modal) **Xem thông tin chi tiết thông báo phát hành**.

## 3. Cấu trúc dữ liệu hiển thị
Màn hình chi tiết bao gồm các nhóm thông tin sau:

### A. Thông tin tổ chức phát hành
*   **Tên tổ chức khởi tạo hóa đơn:** (Ví dụ: Công ty cổ phần Nguyễn Kim)
*   **Mã số thuế:** (Ví dụ: 0100691544)
*   **Địa chỉ trụ sở chính:** (Ví dụ: Tầng 3, số 3 ngõ 120, Trường Chinh, Hà Nội)
*   **Điện thoại:** (Ví dụ: (04)38666888)

### B. Danh sách các loại hóa đơn phát hành (Dạng bảng)
Bảng dữ liệu bao gồm các cột:
1.  **STT:** Số thứ tự.
2.  **Tên loại hóa đơn:** (Ví dụ: Hóa đơn giá trị gia tăng).
3.  **Mẫu số:** (Ví dụ: 01GTKT0/001).
4.  **Kí hiệu:** (Ví dụ: AB/17E).
5.  **Số lượng:** (Ví dụ: 1000).
6.  **Từ số:** (Ví dụ: 0000001).
7.  **Đến số:** (Ví dụ: 0001000).
8.  **Ngày bắt đầu sử dụng:** (Ví dụ: 02/10/2017).

### C. Thông tin tiếp nhận và xác nhận
*   **Tên cơ quan thuế tiếp nhận thông báo:** Tên chi cục/cục thuế quản lý.
*   **Thời gian và địa điểm:** Địa danh, ngày... tháng... năm...
*   **Người đại diện theo pháp luật:** Thông tin chữ ký và họ tên người có thẩm quyền.

## 4. Ghi chú kỹ thuật (UX/UI Note)
*   Màn hình chi tiết cần trình bày theo đúng bố cục văn bản hành chính (Quốc hiệu, Tiêu ngữ, Tên văn bản ở giữa).
*   **Quy tắc định dạng số:** Sử dụng dấu chấm (`.`) sau chữ số hàng nghìn, triệu, tỷ... và sử dụng dấu phẩy (`,`) sau chữ số hàng đơn vị để ghi chữ số hàng thập phân (theo quy định kế toán Việt Nam được nhắc trong tài liệu).
*   Các thông tin ở màn hình này thường là ở chế độ **Read-only** (chỉ xem, không được chỉnh sửa).

---
*Mọi thông tin trên được trích xuất chính xác từ tài liệu "3.2.7 Xem thông tin chi tiết của thông báo phát hành".*
