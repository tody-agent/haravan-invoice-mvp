Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **Xóa đăng ký mẫu hóa đơn** dựa trên tài liệu `docs/324_Xóa_đăng_ký_mẫu_hóa_đơn.pdf`.

---

# PHÂN TÍCH NGHIỆP VỤ: XÓA ĐĂNG KÝ MẪU HÓA ĐƠN

## 1. Thông tin chung
*   **Mã tài liệu:** 3.2.4
*   **Tên tính năng:** Xóa đăng ký mẫu hóa đơn
*   **Mục đích:** Cho phép người dùng loại bỏ một loại hóa đơn đã đăng ký khỏi danh sách các loại hóa đơn phát hành trong quá trình lập "Thông báo phát hành".
*   **Vị trí thực hiện:** Nằm trong màn hình "Thêm mới thông báo phát hành", tại danh sách "Các loại hóa đơn phát hành (*)".

## 2. Luồng nghiệp vụ (User Flow)

Luồng xử lý bao gồm các bước sau:

*   **Bước 1: Chọn và kích hoạt lệnh xóa**
    *   Người dùng xác định dòng chứa loại hóa đơn cần xóa trong bảng danh sách.
    *   Kích chuột vào biểu tượng thùng rác (**Xóa**) trên dòng tương ứng.
    *   **Hệ thống:** Hiển thị cửa sổ popup yêu cầu người dùng xác nhận việc xóa (Confirmation Dialog). Nội dung xác nhận dự kiến: "Bạn có muốn xóa dòng này không?".

*   **Bước 2: Xác nhận hoặc Hủy bỏ**
    *   **Trường hợp 1 (Xác nhận):** Người dùng nhấn nút **OK**.
        *   **Hệ thống:** Loại bỏ dòng thông tin hóa đơn đó ra khỏi danh sách tạm thời trên màn hình.
    *   **Trường hợp 2 (Hủy bỏ):** Người dùng nhấn nút **Cancel**.
        *   **Hệ thống:** Đóng cửa sổ xác nhận, giữ nguyên dòng dữ liệu và quay lại màn hình "Thêm mới thông báo phát hành".

*   **Bước 3: Hoàn tất thay đổi**
    *   Để việc xóa có hiệu lực trong hệ thống, người dùng phải nhấn nút **Lưu** trên màn hình chính của Thông báo phát hành.
    *   Nếu muốn thoát mà không lưu các thay đổi (bao gồm cả việc xóa), người dùng nhấn **Quay lại** để trở về trang "Tìm kiếm thông báo phát hành".

## 3. Dữ liệu liên quan

Dựa trên hình ảnh giao diện trong tài liệu, các trường dữ liệu bị tác động trong danh sách bao gồm:

| Tên trường | Mô tả |
| :--- | :--- |
| **Mẫu số** | Mã mẫu hóa đơn (Ví dụ: `VATTEMP`) |
| **Ký hiệu** | Ký hiệu hóa đơn (Ví dụ: `AB/17E`) |
| **Số lượng** | Tổng số lượng hóa đơn đăng ký (Ví dụ: `100`) |
| **Từ số** | Số bắt đầu (Ví dụ: `0001001`) |
| **Đến số** | Số kết thúc (Ví dụ: `0001100`) |
| **Ngày bắt đầu sử dụng** | Ngày dự kiến bắt đầu dùng hóa đơn (Ví dụ: `24/10/2017`) |

## 4. Các ràng buộc và Quy tắc nghiệp vụ (Business Rules)

*   **Xác nhận bắt buộc:** Việc xóa không được thực thi ngay lập tức mà phải qua bước xác nhận để tránh người dùng thao tác nhầm.
*   **Phạm vi tác động:** Việc xóa tại bước này chỉ mang tính chất cập nhật danh sách hiển thị trên giao diện (Client-side/Draft state). Dữ liệu chỉ thực sự thay đổi trong cơ sở dữ liệu sau khi người dùng nhấn nút **Lưu** toàn bộ Thông báo phát hành.
*   **Điều kiện hiển thị:** Tính năng xóa chỉ xuất hiện trên từng dòng của danh sách "Các loại hóa đơn phát hành".

---
*Ghi chú: Bản phân tích này được trích xuất chính xác từ nội dung văn bản và hình ảnh của tài liệu hướng dẫn được cung cấp.*
