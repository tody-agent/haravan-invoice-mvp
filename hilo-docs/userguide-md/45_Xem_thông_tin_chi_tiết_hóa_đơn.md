Chào bạn, với vai trò Chuyên gia Phân tích Nghiệp vụ (BA), tôi đã hoàn thành việc phân tích tài liệu **"4.5 Xem thông tin chi tiết hóa đơn"** từ file PDF bạn cung cấp. Dưới đây là bảng đặc tả chi tiết dùng cho việc clone và refactor UX:

---

# Đặc tả Nghiệp vụ: Xem Thông Tin Chi Tiết Hóa Đơn

## 1. Mô tả Tổng quan
Tính năng cho phép người dùng xem toàn bộ nội dung chi tiết của một hóa đơn đã tồn tại trong hệ thống. Hệ thống sẽ thực hiện kiểm tra tính hợp lệ và hiển thị các thông tin xác nhận (chữ ký số/hình ảnh chữ ký) tương ứng với từng loại đối tượng khách hàng.

## 2. Luồng Nghiệp vụ (User Flow)

*   **Bước 1:** Tại màn hình **Danh sách hóa đơn**, người dùng xác định hóa đơn cần xem.
*   **Bước 2:** Người dùng kích chuột vào biểu tượng **Xem** (hình con mắt `👁`) tại dòng tương ứng với hóa đơn đó.
*   **Bước 3 (Xử lý hệ thống):** Hệ thống thực hiện kiểm tra tính hợp lệ của hóa đơn:
    *   **Nếu hóa đơn không hợp lệ:** Hệ thống hiển thị thông báo lỗi/cảnh báo cho người dùng (NSD) và không truy cập vào màn hình chi tiết.
    *   **Nếu hóa đơn hợp lệ:** Hệ thống điều hướng và hiển thị **Màn hình Xem thông tin chi tiết hóa đơn**.

## 3. Quy tắc Hiển thị và Nghiệp vụ (Business Rules)

Màn hình chi tiết chú trọng vào việc hiển thị chữ ký của các bên liên quan dựa trên các điều kiện sau:

| Thành phần hiển thị | Đối tượng áp dụng | Quy tắc hiển thị |
| :--- | :--- | :--- |
| **Chữ ký người bán** | Đơn vị phát hành hóa đơn | Hiển thị hình ảnh chữ ký của đơn vị phát hành tại phần **"Nhân viên giao dịch ký"**. |
| **Chữ ký người mua** | Khách hàng là đơn vị kế toán | Hiển thị hình ảnh chữ ký của khách hàng tại phần **"Người nộp tiền"**. |
| **Chữ ký mặc định** | Mọi đối tượng | Nếu hình ảnh chữ ký của đơn vị phát hành hoặc khách hàng chưa được thiết lập, hệ thống sẽ tự động hiển thị **hình ảnh mặc định của hệ thống**. |

## 4. Danh mục Dữ liệu Cần thiết (Data Requirements)

Để phục vụ việc clone và refactor UX, hệ thống cần các dữ liệu sau:
1.  **ID Hóa đơn:** Định danh để truy xuất dữ liệu từ danh sách.
2.  **Trạng thái hợp lệ:** Thuộc tính để xác định hóa đơn có đủ điều kiện để xem chi tiết hay không.
3.  **Loại khách hàng:** Thông tin định danh khách hàng có phải là "đơn vị kế toán" hay không (dùng để quyết định hiển thị chữ ký người mua).
4.  **Hình ảnh chữ ký (Signature Assets):**
    *   Hình ảnh chữ ký của Đơn vị phát hành.
    *   Hình ảnh chữ ký của Khách hàng.
    *   Hình ảnh chữ ký mặc định (System default).

## 5. Yêu cầu về Giao diện (UX/UI Notes)
*   **Điểm kích hoạt:** Biểu tượng `👁` trên từng dòng của bảng danh sách.
*   **Xử lý lỗi:** Thông báo hiển thị rõ ràng khi người dùng cố gắng xem một hóa đơn không hợp lệ.
*   **Trình diễn nội dung:** Màn hình chi tiết cần phân định rõ khu vực ký của bên bán (Nhân viên giao dịch) và bên mua (Người nộp tiền).

---
*Thông tin được trích xuất chính xác và duy nhất dựa trên tài liệu docs/45_Xem_thông_tin_chi_tiết_hóa_đơn.pdf.*
