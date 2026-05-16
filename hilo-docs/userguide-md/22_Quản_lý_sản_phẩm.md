Dưới đây là bản phân tích chi tiết nghiệp vụ **Quản lý sản phẩm** dựa trên tài liệu `22_Quản_lý_sản_phẩm.pdf`.

---

# PHÂN TÍCH NGHIỆP VỤ: QUẢN LÝ SẢN PHẨM

## 1. Mục đích
Hệ thống cho phép lưu trữ và quản lý thông tin các sản phẩm/dịch vụ mà doanh nghiệp cung cấp, nhằm phục vụ cho quá trình phát hành hóa đơn điện tử một cách nhanh chóng và chính xác.

## 2. Các tính năng chính
1. **Tìm kiếm sản phẩm:** Tra cứu sản phẩm dựa trên các tiêu chí mã hoặc tên.
2. **Thêm mới sản phẩm:** Khai báo thông tin sản phẩm mới vào hệ thống.
3. **Cập nhật sản phẩm:** Chỉnh sửa thông tin các sản phẩm đã tồn tại.
4. **Xóa sản phẩm:** Loại bỏ sản phẩm không còn kinh doanh khỏi danh sách.
5. **Xuất dữ liệu Excel:** Kết xuất danh sách sản phẩm ra file Excel (Dựa trên hình ảnh giao diện).
6. **Quản lý Email thông báo:** Theo dõi và quản lý các email thông báo gửi đi từ hệ thống.

---

## 3. Danh sách trường dữ liệu (Data Schema)

### A. Đối tượng Sản phẩm (Product)
| Tên trường | Kiểu dữ liệu | Ràng buộc / Ghi chú |
| :--- | :--- | :--- |
| **Mã sản phẩm** | Chuỗi (String) | Tối đa 20 ký tự |
| **Tên sản phẩm** | Chuỗi (String) | Tối đa 200 ký tự |
| **Giá sản phẩm** | Số (Numeric) | Đơn giá chưa thuế |
| **Đơn vị tính** | Danh mục (Select) | Lựa chọn từ danh sách có sẵn (Cái, chiếc, bộ,...) |
| **Thuế suất (%)** | Danh mục (Select) | Các mức thuế: 0%, 5%, 10%,... |
| **Mô tả** | Văn bản (Text) | Thông tin chi tiết thêm về sản phẩm |

### B. Đối tượng Email thông báo (Notification Email)
| Tên trường | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| **Mail người nhận** | Chuỗi (Email) | Địa chỉ email nhận thông báo |
| **Chủ đề** | Chuỗi | Tiêu đề của email (VD: Thông báo phát hành hóa đơn) |
| **Ngày gửi** | Ngày giờ (DateTime) | Thời điểm hệ thống thực hiện gửi |
| **Trạng thái** | Trạng thái (Status) | Ví dụ: Đã gửi |

---

## 4. Luồng nghiệp vụ (User Flow)

### 4.1. Luồng Thêm mới sản phẩm
1. Người dùng truy cập màn hình **Danh sách sản phẩm**.
2. Nhấn nút **[TẠO MỚI]**.
3. Hệ thống hiển thị form **THÔNG TIN SẢN PHẨM**.
4. Người dùng nhập các thông tin:
   - Nhập Mã sản phẩm (≤ 20 ký tự).
   - Nhập Tên sản phẩm (≤ 200 ký tự).
   - Nhập Giá sản phẩm.
   - Chọn Đơn vị tính.
   - Chọn Thuế suất.
   - Nhập Mô tả (nếu có).
5. Người dùng nhấn **[Lưu dữ liệu]**.
6. Hệ thống kiểm tra tính hợp lệ và lưu vào cơ sở dữ liệu. Nhấn **[Quay lại]** để hủy thao tác.

### 4.2. Luồng Cập nhật sản phẩm
1. Tại màn hình danh sách, người dùng tìm sản phẩm cần sửa.
2. Nhấn vào biểu tượng **Sửa** (hình cây bút) tại dòng tương ứng.
3. Hệ thống hiển thị form thông tin sản phẩm với dữ liệu cũ.
4. Người dùng thay đổi thông tin cần thiết.
5. Nhấn **[Lưu dữ liệu]** để hoàn tất.

### 4.3. Luồng Xóa sản phẩm
1. Tại màn hình danh sách, người dùng nhấn biểu tượng **Xóa** (dấu x) tại dòng sản phẩm tương ứng.
2. Hệ thống hiển thị cảnh báo: *"Bạn có chắc chắn xóa sản phẩm này không?"*.
3. Người dùng nhấn **[OK]** để xác nhận hoặc **[Cancel]** để hủy.

### 4.4. Luồng Tra cứu Email thông báo
1. Người dùng truy cập màn hình **Quản lý email thông báo**.
2. Nhập các tiêu chí lọc:
   - Chủ đề.
   - Trạng thái (Tất cả, Đã gửi,...).
   - Khoảng thời gian (Từ ngày - Đến ngày).
   - Mail người nhận.
3. Nhấn **[Tìm kiếm]**.
4. Hệ thống hiển thị danh sách email khớp với điều kiện.
5. (Mở rộng): Có thể chọn các email và nhấn **[Gửi lại Mail]**.

---

## 5. Yêu cầu giao diện (UX UI Insights)

- **Trình bảng (Data Table):** Cần hỗ trợ phân trang, cột STT, và các cột chức năng (Sửa, Xóa) nằm ở phía cuối mỗi dòng.
- **Bộ lọc (Filter bar):** Đặt phía trên danh sách, bao gồm các ô input và nút bấm Tìm kiếm/Tạo mới/Excel được phân biệt bằng màu sắc (Xanh dương cho Tìm kiếm/Excel, Xanh lá cho Tạo mới).
- **Form nhập liệu:** Các trường bắt buộc cần có hướng dẫn giới hạn ký tự ngay trong placeholder hoặc label (VD: "Nhập không quá 20 ký tự").
- **Thông báo xác nhận:** Sử dụng các hộp thoại (Modal) rõ ràng cho các hành động quan trọng như Xóa.
