### Phân tích nghiệp vụ: Thêm Thông báo phát hành Hóa đơn điện tử (HDDT)

Tài liệu được phân tích dựa trên file PDF: `3.2.2 Thêm thông báo phát hành HDDT`. Dưới đây là chi tiết các tính năng, luồng nghiệp vụ và cấu trúc dữ liệu.

---

#### 1. Tổng quan tính năng
Tính năng này cho phép người dùng khởi tạo một Thông báo phát hành Hóa đơn điện tử mới, bao gồm việc nhập thông tin tổ chức phát hành và đăng ký các dải hóa đơn (mẫu số, ký hiệu) cụ thể.

#### 2. Luồng người dùng (User Flow)

1.  **Khởi tạo:** Tại trang "Thông báo phát hành HDDT", người dùng nhấn nút **[Tạo mới]**.
2.  **Nhập thông tin đơn vị:** Người dùng nhập các thông tin định danh và liên lạc của tổ chức khởi tạo hóa đơn.
3.  **Thêm loại hóa đơn phát hành:** 
    *   Người dùng nhấn nút **[Tạo mới]** tại phần "Các loại hóa đơn phát hành".
    *   Hệ thống hiển thị modal (cửa sổ con) "Đăng ký mẫu hóa đơn phát hành".
    *   Người dùng nhập chi tiết dải hóa đơn (Mẫu số, Ký hiệu, Số lượng...).
    *   Người dùng chọn **[Lưu]** hoặc **[Lưu và tạo mới]** để hoàn tất việc thêm loại hóa đơn vào danh sách.
4.  **Hoàn tất:** (Dựa trên mô tả luồng) Các loại hóa đơn vừa thêm sẽ hiển thị trong danh sách tại màn hình chính của thông báo phát hành.

---

#### 3. Chi tiết dữ liệu và Quy tắc nghiệp vụ (Business Rules)

##### 3.1. Thông tin Thông báo phát hành (Màn hình chính)
| Trường thông tin | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| **Tên tổ chức khởi tạo hóa đơn** | Bắt buộc (*) | Không được phép sửa |
| **Mã số thuế** | Bắt buộc (*) | Không được phép sửa |
| **Địa chỉ trụ sở chính** | Bắt buộc (*) | Có thể sửa |
| **Số điện thoại** | Tùy chọn | Có thể sửa |
| **Người đại diện** | Bắt buộc (*) | Có thể sửa |
| **Cơ quan thuế tiếp nhận thông báo** | Bắt buộc (*) | Có thể sửa |
| **Thành phố** | Bắt buộc (*) | Hệ thống tự động hiển thị |

##### 3.2. Thông tin Loại hóa đơn phát hành (Modal Đăng ký)
Người dùng cần nhập các thông tin sau trong modal:

*   **Mẫu số (*):** Chọn từ danh sách có sẵn (Ví dụ: VATTEMP).
*   **Ký hiệu (*):** Nhập ký hiệu hóa đơn (thường gồm các phần như Serial, Năm phát hành, Loại hóa đơn - Ví dụ: `AB/17E`).
*   **Số lượng (*):** Số lượng hóa đơn đăng ký phát hành.
*   **Từ số:** Hệ thống tự động tính toán dải số bắt đầu dựa trên "Ký hiệu" và "Tên mẫu" để đảm bảo tính liên tiếp.
    *   *Ví dụ:* Nếu dải trước đó đã phát hành đến số 20, hệ thống tự gợi ý "Từ số" là 21.
*   **Đến số:** Số cuối cùng của dải hóa đơn.
*   **Ngày bắt đầu sử dụng (*):** Phải là ngày hiện tại hoặc sau ngày hiện tại.

**Quy tắc tính toán tự động trong Modal:**
*   Nếu nhập **Số lượng** -> Hệ thống tự tính **Đến số** (`Đến số = Từ số + Số lượng - 1`).
*   Nếu nhập **Đến số** -> Hệ thống tự tính **Số lượng** (`Số lượng = Đến số - Từ số + 1`).

---

#### 4. Các hành động (Actions)

*   **Tại màn hình chính:**
    *   **Tạo mới (Loại hóa đơn):** Mở modal đăng ký dải hóa đơn.
*   **Tại Modal Đăng ký mẫu hóa đơn:**
    *   **Lưu:** Lưu thông tin loại hóa đơn đã nhập và quay về màn hình chính.
    *   **Lưu & tạo mới:** Lưu thông tin hiện tại, xóa trống các trường trong modal để tiếp tục nhập loại hóa đơn khác.
    *   **Quay lại:** Thoát khỏi modal và không lưu dữ liệu vừa nhập.

---

#### 5. Lưu ý quan trọng cho Refactor UX
*   **Ràng buộc dữ liệu:** Tên tổ chức và MST là cố định (Read-only), cần thể hiện rõ trên UI để người dùng không nhầm lẫn.
*   **Tính toán thời gian thực:** Việc tự động tính "Đến số" khi nhập "Số lượng" (và ngược lại) cần được thực hiện tức thì trên giao diện để hỗ trợ người dùng.
*   **Gợi ý số thứ tự:** Logic lấy số tiếp theo dựa trên lịch sử phát hành là cực kỳ quan trọng để tránh sai sót nghiệp vụ.
