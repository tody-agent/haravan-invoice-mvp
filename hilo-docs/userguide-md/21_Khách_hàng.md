Dưới đây là bản phân tích nghiệp vụ chi tiết của mô đun **2.1 Khách hàng** dựa trên tài liệu `docs/21_Khách_hàng.pdf`.

---

# PHÂN TÍCH NGHIỆP VỤ: DANH MỤC KHÁCH HÀNG

## 1. Mục tiêu (Purpose)
Quản lý, lưu trữ, tra cứu thông tin và tài khoản tra cứu của khách hàng nhằm phục vụ việc xuất hóa đơn và quản lý đối tác.

## 2. Các tính năng chính (Main Features)

### 2.1. Tra cứu và Danh sách
*   **Tìm kiếm:** Cho phép tìm kiếm khách hàng theo "Tên/mã khách hàng".
*   **Hiển thị danh sách:** Bảng dữ liệu bao gồm các cột:
    *   STT
    *   Tên khách hàng
    *   Mã KH (Mã khách hàng)
    *   Địa chỉ
    *   Số điện thoại
    *   Email
    *   Tên tài khoản (Tài khoản tra cứu hóa đơn)
    *   Thao tác: Sửa (biểu tượng bút chì), Xóa (biểu tượng dấu x).

### 2.2. Tạo mới khách hàng (Create)
*   **Quy trình:** Danh mục => Khách hàng => Tạo mới => Điền thông tin => Lưu dữ liệu.
*   **Thông tin dữ liệu yêu cầu (Data Fields):**
    *   **Mã khách hàng (*):** Mã định danh duy nhất.
    *   **Mã số thuế:** Có tính năng "Kiểm tra" (tra cứu thông tin từ cơ quan thuế).
    *   **Tên khách hàng (*):** Tên đầy đủ của đơn vị/cá nhân.
    *   **Tài khoản tra cứu hóa đơn (*):** Dùng để khách hàng đăng nhập xem hóa đơn.
    *   **Địa chỉ khách hàng (*):** Địa chỉ giao dịch/xuất hóa đơn.
    *   **Số điện thoại khách hàng:** Liên hệ.
    *   **Fax:** Số Fax.
    *   **Mail khách hàng:** Nhận hóa đơn điện tử (cho phép nhập nhiều mail, cách nhau bởi dấu `;`).
    *   **Danh sách cc:** Các email nhận bản sao.
    *   **Người liên hệ:** Tên cá nhân phụ trách.
    *   **Người đại diện pháp luật:** Tên người ký tá văn bản.
    *   **Số tài khoản ngân hàng:** Thông tin thanh toán.
    *   **Chủ tài khoản:** Tên chủ tài khoản ngân hàng.
    *   **Tên ngân hàng:** Ngân hàng mở tài khoản.
    *   **Mô tả:** Ghi chú thêm.
    *   **Kiểu khách hàng:** Checkbox "Khách hàng không phải là đơn vị kế toán".

### 2.3. Chỉnh sửa thông tin (Update)
*   **Quy trình:** Tại danh sách khách hàng => Chọn biểu tượng Sửa => Thay đổi thông tin tại màn hình chỉnh sửa => Lưu dữ liệu.
*   **Mục đích:** Cập nhật khi thông tin bị thiếu hoặc sai sót.

### 2.4. Tải lên hàng loạt (Bulk Import/Upload)
*   **Quy trình:** Tại danh sách khách hàng => Chọn Upload => Tải file mẫu (Mẫu excel) => Điền dữ liệu vào file => Chọn file để tải lên => Upload dữ liệu.
*   **Yêu cầu kỹ thuật:**
    *   Định dạng file: `.zip`, `.xml`, hoặc `.xls`.
    *   Dung lượng tối đa: 100MB.
    *   Hệ thống cung cấp sẵn "Mẫu excel" để đảm bảo đúng cấu trúc dữ liệu.

## 3. Luồng nghiệp vụ (User Flows)

### 3.1. Luồng tạo mới khách hàng lẻ
1.  Người dùng truy cập menu **Danh mục**.
2.  Chọn **Khách hàng**.
3.  Nhấn nút **Tạo mới**.
4.  Hệ thống hiển thị form nhập liệu.
5.  Người dùng nhập Mã số thuế và nhấn **Kiểm tra** (nếu có) để tự động lấy tên và địa chỉ.
6.  Người dùng hoàn thiện các trường bắt buộc (*).
7.  Nhấn **Lưu dữ liệu**. Hệ thống thông báo thành công và cập nhật vào danh sách.

### 3.2. Luồng nhập dữ liệu hàng loạt (Import)
1.  Người dùng nhấn nút **Upload** tại màn hình danh sách.
2.  Nhấn vào link **Mẫu excel** để tải file mẫu về máy.
3.  Nhập danh sách khách hàng vào file excel theo đúng định dạng.
4.  Tại màn hình Upload, nhấn vào vùng **Chọn file** để chọn tệp tin đã chuẩn bị.
5.  Nhấn **Upload dữ liệu**. Hệ thống xử lý file và phản hồi kết quả.

## 4. Các ràng buộc và lưu ý (Constraints)
*   Các trường có đánh dấu `(*)` là bắt buộc, không được để trống.
*   Trường Email khách hàng hỗ trợ gửi đa địa chỉ bằng cách phân tách bởi dấu `;`.
*   File upload không được vượt quá 100MB và phải đúng định dạng quy định.
*   Có chức năng check-box dành riêng cho đối tượng không phải đơn vị kế toán (cá nhân hoặc hộ kinh doanh nhỏ).
