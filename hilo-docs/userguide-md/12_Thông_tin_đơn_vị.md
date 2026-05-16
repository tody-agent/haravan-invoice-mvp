Dưới đây là báo cáo phân tích nghiệp vụ chi tiết dựa trên tài liệu **"1.2 Thông tin đơn vị"** (`docs/12_Thông_tin_đơn_vị.pdf`).

---

# PHÂN TÍCH NGHIỆP VỤ: THÔNG TIN ĐƠN VỊ

## 1. Mục đích
Cho phép người dùng quản lý, xem và cập nhật các thông tin hành chính, liên lạc và tài khoản ngân hàng của đơn vị phát hành hóa đơn điện tử trên hệ thống.

## 2. Luồng nghiệp vụ (User Flow)

### 2.1. Truy cập tính năng
1. Người dùng đăng nhập vào hệ thống.
2. Từ menu chính, chọn danh mục: **Hệ thống** -> **Thông tin đơn vị**.
3. Hệ thống hiển thị màn hình chi tiết thông tin đơn vị hiện tại.

### 2.2. Cập nhật thông tin
1. Tại màn hình xem chi tiết, người dùng chọn nút **"Chỉnh sửa"**.
2. Người dùng thực hiện thay đổi các thông tin được phép sửa đổi.
3. Người dùng chọn **"Lưu"** để xác nhận cập nhật dữ liệu vào hệ thống.
4. Hệ thống thông báo kết quả và lưu lại thông tin mới.

### 2.3. Điều hướng thoát
1. Tại màn hình thông tin đơn vị, người dùng chọn **"Quay lại"** để trở về màn hình chính của hệ thống.

## 3. Chi tiết các trường dữ liệu (Data Elements)

Dựa trên giao diện và mô tả trong tài liệu, các trường dữ liệu bao gồm:

| STT | Tên trường | Trạng thái | Ghi chú |
|:---:|:--- |:---:|:--- |
| 1 | **Tên công ty** | Hiển thị | Thường là cố định theo giấy phép |
| 2 | **Mã số thuế** | Hiển thị | Không cho phép sửa đổi thủ công |
| 3 | **Địa chỉ** | Cập nhật | |
| 4 | **Điện thoại** | Cập nhật | Số điện thoại cố định/công ty |
| 5 | **Fax (Email)** | Cập nhật | Tài liệu ghi gộp Fax và Email |
| 6 | **Website** | Hiển thị/Cập nhật | |
| 7 | **Số tài khoản** | Cập nhật | Tài khoản ngân hàng của đơn vị |
| 8 | **Tên ngân hàng** | Cập nhật | Chi nhánh và tên ngân hàng |
| 9 | **Tên người liên hệ** | Cập nhật | Người đại diện phối hợp |
| 10 | **Số điện thoại liên hệ**| Cập nhật | Di động hoặc số trực tiếp của người liên hệ |

## 4. Các quy tắc nghiệp vụ (Business Rules)

*   **Quyền hạn:** Người dùng phải đăng nhập mới có thể truy cập.
*   **Phạm vi chỉnh sửa:** Tài liệu chỉ rõ các trường được phép cập nhật bao gồm: Địa chỉ, số fax, số điện thoại, email liên hệ, thông tin tài khoản ngân hàng.
*   **Điều hướng:** Nút "Quay lại" luôn có sẵn để thoát khỏi phân hệ mà không bắt buộc phải lưu nếu chưa thực hiện thay đổi.

## 5. Các thành phần giao diện chính (UI Components)
*   **Menu điều hướng:** Sidebar bên trái (Danh mục hệ thống).
*   **Khung hiển thị thông tin:** Layout dạng danh sách thuộc tính (Label - Value).
*   **Nhóm nút chức năng:**
    *   `Chỉnh sửa`: Chuyển sang chế độ nhập liệu.
    *   `Lưu`: Ghi nhận thay đổi.
    *   `Quay lại`: Thoát về màn hình chính.

---
*Báo cáo này được tổng hợp chính xác theo nội dung văn bản và hình ảnh minh họa trong tài liệu cung cấp.*

Tôi đã hoàn thành việc phân tích tài liệu nghiệp vụ **"1.2 Thông tin đơn vị"**. Mọi chi tiết về tính năng, luồng xử lý và dữ liệu đã được hệ thống hóa đầy đủ trong báo cáo trên để phục vụ cho việc clone và refactor UX. Nếu bạn cần phân tích thêm các tài liệu khác trong thư mục `docs`, hãy cho tôi biết.
