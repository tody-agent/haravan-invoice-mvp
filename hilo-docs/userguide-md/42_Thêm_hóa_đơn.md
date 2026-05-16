Chào bạn, với vai trò Chuyên gia Phân tích Nghiệp vụ (BA), tôi đã hoàn thành việc phân tích tài liệu **"4.2 Thêm hóa đơn"** từ file PDF bạn cung cấp. Dưới đây là bảng đặc tả chi tiết dùng cho việc clone và refactor UX:

---

# Đặc tả Nghiệp vụ: Thêm Hóa Đơn

## 1. Mô tả Tổng quan
Tính năng cho phép người dùng tạo mới một hóa đơn điện tử dựa trên các mẫu đã đăng ký, hỗ trợ gợi ý dữ liệu khách hàng/hàng hóa và tự động tính toán các thông số tài chính.

## 2. Luồng Nghiệp vụ (User Flow)
*   **Bước 1:** Từ màn hình **Danh sách hóa đơn**, người dùng nhấn nút **"Tạo mới"**. Hệ thống hiển thị màn hình **Tạo mới hóa đơn**.
*   **Bước 2:** Người dùng nhập liệu các thông tin trên hóa đơn (xem chi tiết tại phần 3 và 4).
*   **Bước 3:** 
    *   Nhấn **"Tạo mới"** để lưu hóa đơn vào hệ thống.
    *   Nhấn **"Quay lại"** để hủy bỏ thao tác và trở về trang Danh sách hóa đơn.

## 3. Danh mục Dữ liệu & Quy tắc Nhập liệu

### 3.1. Thông tin chung (Header)
| Trường dữ liệu | Loại dữ liệu | Ràng buộc | Quy tắc nghiệp vụ |
| :--- | :--- | :--- | :--- |
| **Tên hóa đơn** | Văn bản | Bắt buộc | Lấy mặc định từ mẫu đăng ký. Cho phép sửa. |
| **Ký hiệu** | Văn bản | Bắt buộc | Nhập theo định dạng quy định. |
| **Mẫu số** | Văn bản | Chỉ xem | Lấy từ mẫu số đã chọn tại "Danh mục hóa đơn". Không được sửa. |
| **Hình thức thanh toán**| Danh mục | Bắt buộc | Chọn từ danh sách (TM, CK...). |

### 3.2. Thông tin Đơn vị Bán hàng (Seller)
*   **Mã số thuế & Đơn vị:** Tự động lấy từ thông tin đơn vị. **Không cho phép sửa.**
*   **Địa chỉ đơn vị:** Tự động lấy từ thông tin đơn vị. **Cho phép sửa.**

### 3.3. Thông tin Khách hàng (Buyer)
| Trường dữ liệu | Quy tắc nghiệp vụ |
| :--- | :--- |
| **Tên khách hàng** | **Bắt buộc.** Hệ thống gợi ý khi nhập (tìm theo chuỗi ký tự). |
| **Mã khách hàng** | Tự động điền nếu chọn từ gợi ý. Cho phép sửa. |
| **Mã số thuế** | Tự động điền nếu chọn từ gợi ý. Cho phép sửa. |
| **Địa chỉ** | Tự động điền nếu chọn từ gợi ý. Cho phép sửa. |
| **Số điện thoại** | Tự động điền nếu chọn từ gợi ý. Cho phép sửa. |

### 3.4. Danh sách Hàng hóa, Dịch vụ (Line Items)
| Trường dữ liệu | Quy tắc nghiệp vụ |
| :--- | :--- |
| **Tên hàng hóa/dịch vụ** | Hệ thống gợi ý khi nhập. |
| **Đơn vị tính** | Tự động điền nếu chọn từ hàng hóa có sẵn. |
| **Số lượng** | Tự động điền nếu chọn từ hàng hóa có sẵn. Cho phép nhập. |
| **Đơn giá** | Tự động điền nếu chọn từ hàng hóa có sẵn. Cho phép nhập. |
| **Thành tiền** | **Hệ thống tự tính:** `Số lượng` x `Đơn giá`. |
| **Chiết khấu (Cột)** | Ô đánh dấu (checkbox) để xác định dòng đó là dòng chiết khấu. |

**Nghiệp vụ đặc thù về Chiết khấu:**
*   Đối với mẫu hóa đơn có chiết khấu, người dùng nhập dòng chiết khấu như sau:
    *   Trường **Tên hàng hóa/dịch vụ**: Ghi nội dung chiết khấu (Ví dụ: *Chiết khấu 5% theo hợp đồng...*).
    *   Trường **Thành tiền**: Ghi số tiền được chiết khấu.
    *   **Thao tác:** Phải tích chọn vào ô tại cột "Chiết khấu".
*   **Xóa dòng:** Nhấn biểu tượng `x` tại dòng tương ứng để xóa hàng hóa/dịch vụ khỏi danh sách.

## 4. Các tính toán tự động (Logic hệ thống)
1.  **Thành tiền (từng dòng):** `Đơn giá` x `Số lượng`.
2.  **Tổng tiền dịch vụ:** Tổng cộng thành tiền của tất cả các dòng.
3.  **Tiền thuế GTGT:** Tính dựa trên thuế suất được chọn.
4.  **Tổng cộng tiền thanh toán:** `Tổng tiền dịch vụ` + `Tiền thuế GTGT`.
5.  **Số tiền bằng chữ:** Hệ thống tự động chuyển đổi từ tổng tiền thanh toán sang dạng chữ tương ứng.

---
*Thông tin được trích xuất chính xác dựa trên tài liệu docs/42_Thêm_hóa_đơn.pdf.*
