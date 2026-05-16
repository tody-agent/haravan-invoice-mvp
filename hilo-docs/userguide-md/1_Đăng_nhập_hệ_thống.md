Dưới đây là bản phân tích nghiệp vụ chi tiết dựa trên tài liệu **"1 Đăng nhập hệ thống" (docs/1_Đăng_nhập_hệ_thống.pdf)**:

# TÀI LIỆU PHÂN TÍCH NGHIỆP VỤ: ĐĂNG NHẬP HỆ THỐNG

## 1. Thông tin chung
*   **Mục đích:** Truy cập vào hệ thống để quản lý hóa đơn điện tử của đơn vị.
*   **Đối tượng sử dụng:** Người sử dụng được cấp tài khoản để sử dụng dịch vụ.

## 2. Luồng nghiệp vụ (User Flow)

### Luồng chính (Happy Path):
1.  **Bước 1:** Người dùng truy cập vào đường dẫn quản lý hóa đơn của đơn vị hoặc tổng công ty.
2.  **Bước 2:** Hệ thống hiển thị giao diện "Thông tin đăng nhập". Người dùng nhập các thông tin bắt buộc.
3.  **Bước 3:** Người dùng nhấn nút **"Đăng nhập"**.
4.  **Bước 4:** Hệ thống kiểm tra thông tin. Nếu chính xác, người dùng đăng nhập thành công và có thể thực hiện các thao tác nghiệp vụ khác.

### Các kịch bản lỗi và ràng buộc (Business Rules):
*   **Sai thông tin:** Nếu tên đăng nhập (username) hoặc mật khẩu (password) không đúng, hệ thống sẽ thông báo lỗi.
*   **Khóa tài khoản:** Nếu người dùng nhập sai tên đăng nhập/mật khẩu quá **05 lần**, hệ thống sẽ thực hiện khóa tài khoản của người dùng.

## 3. Thành phần dữ liệu (Data Requirements)

Căn cứ vào giao diện và mô tả, các trường dữ liệu cần thiết bao gồm:

| STT | Trường dữ liệu | Loại | Ghi chú |
| :-- | :--- | :--- | :--- |
| 1 | **Đơn vị phát hành** | Dropdown/Select | Áp dụng với mô hình Tổng công ty và các công ty con. |
| 2 | **Tài khoản đăng nhập** | Input (Text) | Tên định danh của người dùng. |
| 3 | **Mật khẩu** | Input (Password) | Mật khẩu của đơn vị phát hành. |
| 4 | **Mã xác thực** | Input (Text/Captcha) | Hình ảnh mã captcha hiển thị bên cạnh để người dùng nhập lại. |

## 4. Các yếu tố giao diện (UI Components) - Dựa trên ảnh chụp màn hình
*   **Tiêu đề khung đăng nhập:** "THÔNG TIN ĐĂNG NHẬP".
*   **Trường nhập liệu:** Có biểu tượng (icon) đại diện cho Username và Password.
*   **Khu vực Captcha:** Bao gồm hình ảnh mã xác thực và ô nhập liệu.
*   **Nút bấm:** Nút "ĐĂNG NHẬP" màu xanh dương nổi bật.
*   **Thông điệp thương hiệu:** "HÓA ĐƠN ĐIỆN TỬ INVOICE", "NHANH - TIỆN LỢI - TIẾT KIỆM".

---
*Ghi chú: Bản phân tích này được trích xuất trung thực từ tài liệu được cung cấp để phục vụ công tác refactor UX sản phẩm.*
