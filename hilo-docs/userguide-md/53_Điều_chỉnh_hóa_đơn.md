Dưới đây là bản phân tích nghiệp vụ chi tiết dựa trên tài liệu **5.3 Điều chỉnh hóa đơn** (file `docs/53_Điều_chỉnh_hóa_đơn.pdf`).

---

# PHÂN TÍCH NGHIỆP VỤ: ĐIỀU CHỈNH HÓA ĐƠN

## 1. Mô tả tính năng
Tính năng này cho phép người dùng thực hiện điều chỉnh các thông tin trên hóa đơn đã phát hành khi có sai sót hoặc thay đổi về nghiệp vụ (tăng/giảm giá trị, số lượng...).

## 2. Luồng nghiệp vụ (User Flow)

### Bước 1: Truy cập và Tìm kiếm
1. Người dùng chọn danh mục **“Điều chỉnh hóa đơn”** trên hệ thống.
2. Hệ thống hiển thị giao diện **Tìm kiếm hóa đơn cần điều chỉnh**.
3. Người dùng nhập các thông tin định danh hóa đơn gốc:
   - **Mẫu số (Pattern):** Chọn từ danh sách.
   - **Ký hiệu (Serial):** Chọn từ danh sách.
   - **Số hóa đơn (No.):** Nhập số hóa đơn cụ thể.
   - **Kiểu điều chỉnh (Adjust type):** Chọn loại điều chỉnh (ví dụ: Hóa đơn điều chỉnh tăng...).
4. Nhấn nút **[Tìm hóa đơn điều chỉnh]** hoặc **[Lập điều chỉnh hóa đơn]**.

### Bước 2: Nhập thông tin điều chỉnh
1. Hệ thống hiển thị giao diện **Điều chỉnh thông tin hóa đơn**.
2. Người dùng kiểm tra/cập nhật thông tin khách hàng:
   - Mã khách hàng, Họ tên người mua, Tên đơn vị, Mã số thuế, Địa chỉ, Email.
3. Chọn **Hình thức thanh toán**.
4. Tải lên hoặc nhập thông tin **Biên bản đính kèm** (nếu có).
5. Điều chỉnh danh mục hàng hóa/dịch vụ tại bảng chi tiết:
   - Thêm/Xóa dòng sản phẩm.
   - Cập nhật Tên hàng hóa, Đơn vị tính, Số lượng, Đơn giá, Thuế suất.
   - Hệ thống tự động tính toán **Thành tiền**.
6. Hệ thống tổng hợp dữ liệu tài chính:
   - Tổng tiền dịch vụ.
   - Thuế suất GTGT và Tiền thuế GTGT.
   - Tổng cộng tiền thanh toán.
   - Tự động hiển thị hoặc nhập **Số tiền viết bằng chữ**.

### Bước 3: Hoàn tất
1. Nhấn nút **[Điều chỉnh]** để lưu lại thông tin hóa đơn điều chỉnh.
2. Nhấn nút **[Quay lại]** để hủy bỏ thao tác.

---

## 3. Danh mục dữ liệu (Data Requirements)

### A. Thông tin Tìm kiếm (Hóa đơn gốc)
| Trường dữ liệu | Loại dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| Mẫu số (Pattern) | Dropdown | Bắt buộc (*) |
| Ký hiệu (Serial) | Dropdown | Bắt buộc (*) |
| Số hóa đơn (No.) | Input (Số) | Bắt buộc (*) |
| Kiểu điều chỉnh | Dropdown | Bắt buộc (*). Ví dụ: Điều chỉnh tăng. |

### B. Thông tin Khách hàng & Chung
| Trường dữ liệu | Loại dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| Mã khách hàng | Input | |
| Họ tên người mua hàng | Input | |
| Tên đơn vị mua | Input | |
| Mã số thuế | Input | |
| Địa chỉ | Input | |
| Email | Input | |
| Hình thức thanh toán | Dropdown | Bắt buộc (*) |
| Biên bản đính kèm | File/Input | Tài liệu chứng minh việc điều chỉnh |

### C. Chi tiết Hàng hóa & Dịch vụ (Grid)
| Trường dữ liệu | Loại dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| STT | Số | Thứ tự dòng |
| Tên hàng hóa, dịch vụ | Input | |
| Đơn vị tính | Input | |
| Số lượng | Số | |
| Đơn giá | Số | |
| Thành tiền | Số | Tự động tính |
| Thuế | Dropdown/Số | Thuế suất áp dụng cho từng dòng |

### D. Tổng cộng (Summary)
| Trường dữ liệu | Loại dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| Tổng tiền dịch vụ | Số | Tổng tiền trước thuế |
| Thuế GTGT (%) | Số/Dropdown | Thuế suất tổng (nếu áp dụng chung) |
| Tiền thuế GTGT | Số | Tổng tiền thuế |
| Tổng cộng tiền thanh toán | Số | Tổng tiền sau thuế |
| Số tiền viết bằng chữ | Văn bản | |

---

## 4. Các nút chức năng (Actions)
- **Tìm hóa đơn điều chỉnh:** Truy vấn dữ liệu hóa đơn gốc từ hệ thống.
- **Điều chỉnh:** Lưu dữ liệu và tạo hóa đơn điều chỉnh mới.
- **Quay lại:** Thoát giao diện hiện tại, không lưu thay đổi.
- **Xóa (trong bảng hàng hóa):** Loại bỏ một dòng sản phẩm khỏi danh sách điều chỉnh.

---
*Ghi chú: Nội dung được trình bày dựa trên cấu trúc hình ảnh và văn bản có trong tài liệu docs/53_Điều_chỉnh_hóa_đơn.pdf.*
