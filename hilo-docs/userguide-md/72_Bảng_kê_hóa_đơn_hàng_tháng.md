Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **"7.2 Bảng kê hóa đơn hàng tháng"** dựa trên tài liệu được cung cấp:

# PHÂN TÍCH NGHIỆP VỤ: BẢNG KÊ HÓA ĐƠN HÀNG THÁNG

## 1. Mục đích
Hệ thống cung cấp chức năng này để người dùng thống kê và theo dõi tình hình sử dụng hóa đơn chi tiết trong từng tháng, phục vụ công tác báo cáo thuế và quản trị nội bộ.

## 2. Luồng nghiệp vụ (User Flow)
1.  **Truy cập:** Người dùng từ menu chính chọn `THỐNG KÊ` -> `Bảng kê hóa đơn hàng tháng`.
2.  **Thiết lập tham số:** Người dùng chọn các tiêu chí lọc:
    *   Tháng báo cáo.
    *   Năm báo cáo.
3.  **Thực thi:** Nhấn nút `Báo cáo`.
4.  **Xử lý hệ thống:** Hệ thống tự động truy xuất dữ liệu hóa đơn trong khoảng thời gian đã chọn và hiển thị kết quả dưới dạng bảng kê.
5.  **Kết xuất:** Người dùng lựa chọn một trong các hành động:
    *   Xem trực tiếp trên giao diện.
    *   In báo cáo.
    *   Xuất dữ liệu ra file Excel (.XLS).
    *   Xuất dữ liệu ra file XML.
    *   Quay lại trang trước.

## 3. Các tính năng & Hành động
*   **Lọc dữ liệu:** Cho phép chọn Tháng/Năm để giới hạn phạm vi báo cáo.
*   **Tổng hợp dữ liệu:** Tự động tính toán các chỉ số tổng cộng ở cuối bảng kê.
*   **In báo cáo:** Định dạng dữ liệu để in ấn theo mẫu quy định.
*   **Xuất file XLS:** Chuyển đổi bảng kê sang định dạng bảng tính Excel.
*   **Xuất file XML:** Xuất dữ liệu cấu trúc phục vụ việc truyền nhận dữ liệu hoặc nộp báo cáo thuế.
*   **Quay lại:** Thoát khỏi màn hình báo cáo hiện tại.

## 4. Cấu trúc dữ liệu (Data Schema)

### A. Dữ liệu đầu vào (Input/Filter)
| Trường dữ liệu | Loại dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| Tháng | Dropdown/Number | Chọn từ tháng 01 đến 12 |
| Năm | Number/Text | Nhập hoặc chọn năm (Vd: 2018) |

### B. Dữ liệu hiển thị trong bảng kê (Output Table)
Dựa trên hình ảnh mẫu, bảng kê bao gồm các cột chính sau:
1.  **STT:** Số thứ tự dòng.
2.  **Ký hiệu:** Ký hiệu mẫu hóa đơn (Vd: AG/18E).
3.  **Số hóa đơn:** Số serial của hóa đơn (Vd: 0000001).
4.  **Ngày phát hành:** Ngày lập/phát hành hóa đơn (Vd: 09/08/2018).
5.  **Tên đơn vị/khách hàng:** Tên đầy đủ của đơn vị mua hàng.
6.  **Mã số thuế:** Mã số thuế của đơn vị mua hàng.
7.  **Doanh thu chưa thuế:** (Cột 6 - Theo ghi chú trong tài liệu).
8.  **Thuế GTGT:** (Cột 7 - Theo ghi chú trong tài liệu).

### C. Dữ liệu tổng hợp (Summary Section)
*   **Tổng doanh thu hàng hóa, dịch vụ bán ra trước thuế:** Tổng cộng của cột doanh thu chưa thuế.
*   **Tổng doanh thu hàng hóa, dịch vụ bán ra chịu thuế GTGT:** Tổng doanh thu của các mặt hàng có phát sinh thuế.
*   **Tổng số thuế GTGT của hàng hóa, dịch vụ bán ra:** Tổng cộng của cột tiền thuế GTGT.

### D. Thông tin pháp lý (Footer)
*   **Nhân viên đại lý thuế:** Họ và tên, Số chứng chỉ hành nghề.
*   **Đại diện:** Khu vực dành cho người đại diện pháp luật ký và ghi rõ họ tên.

## 5. Lưu ý cho thiết kế UX/UI (Refactor)
*   **Giao diện lọc:** Cần tinh gọn, đặt ở vị trí dễ thấy phía trên cùng.
*   **Bảng dữ liệu:** Cần hỗ trợ scroll ngang nếu nhiều cột và freeze header khi danh sách dài.
*   **Nút hành động:** Nhóm các nút `In`, `Xuất XLS`, `Xuất XML` vào một khu vực hành động (Toolbar) để tối ưu không gian.
*   **Tính chính xác:** Các dòng tổng cộng cần được làm nổi bật (In đậm) để người dùng dễ dàng kiểm tra số liệu nhanh.

---
*Mọi thông tin trên được trích xuất chính xác từ file tài liệu 7.2 Bảng kê hóa đơn hàng tháng.*
