Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **Quản lý người dùng** dựa trên tài liệu `docs/13_Quản_lý_người_dùng.pdf`.

---

# BÁO CÁO PHÂN TÍCH NGHIỆP VỤ: QUẢN LÝ NGƯỜI DÙNG (V1.3)

## 1. Tổng quan (Overview)
*   **Mục đích:** Quản lý toàn bộ danh sách người dùng và khách hàng trên hệ thống. Cho phép kiểm tra trạng thái, phân quyền truy cập, kích hoạt/khóa tài khoản và thực hiện các thao tác quản trị (Thêm, Sửa, Xóa).
*   **Đối tượng thực hiện:** Quản trị viên hệ thống (Admin).

---

## 2. Các tính năng chi tiết (Feature Breakdown)

### 2.1 Quản lý tài khoản người dùng
#### A. Danh sách & Tìm kiếm (1.3.1)
*   **Mục đích:** Tra cứu thông tin người dùng hiện có.
*   **Luồng nghiệp vụ (User Flow):**
    1.  Truy cập menu: `Hệ thống` => `Quản trị người dùng`.
    2.  Nhập từ khóa tìm kiếm (Tên tài khoản người dùng hoặc khách hàng).
    3.  Nhấn nút `Tìm kiếm`.
*   **Dữ liệu hiển thị:** STT, Tên tài khoản, Tên người dùng, Mail, Đối tượng (Khách hàng/Quản trị/Kế toán...), Kích hoạt (Checkbox/Icon), Ngày tạo, Sửa (Icon), Xóa (Icon).

#### B. Tạo mới tài khoản người dùng (1.3.2)
*   **Mục đích:** Thêm người dùng mới vào hệ thống.
*   **Dữ liệu đầu vào:**
    *   `Tên tài khoản (*)`
    *   `Tên đầy đủ`
    *   `Mail (*)`
    *   `Mật khẩu (*)`
    *   `Nhập lại mật khẩu (*)`
    *   `Kích hoạt` (Checkbox): Cho phép sử dụng hệ thống ngay khi tạo.
    *   `Phân quyền truy cập`: Chọn các vai trò (Quản trị, Gọi API, Kế toán viên, Sale...).
*   **Luồng nghiệp vụ:**
    1.  Tại màn hình danh sách, chọn `Tạo mới`.
    2.  Nhập đầy đủ thông tin (Lưu ý các trường bắt buộc `*`).
    3.  Nhấn `Lưu`.

#### C. Cập nhật tài khoản người dùng (1.3.3)
*   **Mục đích:** Thay đổi thông tin cá nhân, mật khẩu hoặc trạng thái tài khoản.
*   **Dữ liệu thay đổi:**
    *   `Mật khẩu`: Nhập mới nếu muốn đổi, bỏ trống nếu giữ cũ.
    *   `Nhập lại mật khẩu`: Phải khớp với mật khẩu mới.
    *   `Kích hoạt`: Trạng thái hoạt động.
    *   `Khóa`: Khóa quyền sử dụng của người dùng.
    *   `Quyền truy cập`: Thay đổi vai trò thao tác.
*   **Luồng nghiệp vụ:**
    1.  Tại dòng tài khoản cần sửa, chọn biểu tượng `Sửa` (Hình bút chì).
    2.  Cập nhật thông tin cần thiết.
    3.  Nhấn `Lưu`.

#### D. Xóa tài khoản người dùng (1.3.4)
*   **Mục đích:** Loại bỏ tài khoản khỏi hệ thống.
*   **Luồng nghiệp vụ:**
    1.  Chọn biểu tượng `Xóa` (Dấu X đỏ) trên dòng tài khoản tương ứng.
    2.  Hệ thống hiển thị hộp thoại xác thực: "Xóa người dùng?".
    3.  Nhấn `OK` để thực hiện xóa hoặc `Cancel` để hủy.

---

### 2.2 Quản lý quyền (Phân quyền hệ thống)
*Ghi chú: Trong tài liệu gốc, các đề mục từ 1.3.5 - 1.3.7 bị ghi nhầm tiêu đề là "Xóa tài khoản người dùng", tuy nhiên nội dung nghiệp vụ tập trung vào Quản lý Quyền.*

#### A. Danh sách quyền hệ thống (1.3.5)
*   **Mục đích:** Tra cứu và quản lý các nhóm quyền (Roles) trong hệ thống.
*   **Dữ liệu hiển thị:** STT, Tên (Mã quyền), Tên hiển thị, Sửa, Xóa.
*   **Ví dụ dữ liệu:** Sale, KeToanVien, Goi API, Quản trị.

#### B. Tạo mới quyền người dùng (1.3.6)
*   **Mục đích:** Tạo nhóm quyền mới và gán các chức năng chi tiết (Permissions).
*   **Dữ liệu đầu vào:**
    *   `Tên (*)`
    *   `Tên hiển thị`
    *   `Chọn các permission (*)` (Danh sách các thao tác chi tiết trên hệ thống: Tìm kiếm hóa đơn, Thêm mới, Sửa, Xóa, Phát hành, In...).
*   **Luồng nghiệp vụ:**
    1.  Tại màn hình quản lý quyền, chọn `Tạo mới`.
    2.  Nhập tên nhóm quyền và chọn các checkbox permission tương ứng.
    3.  Nhấn `Lưu`.

#### C. Cập nhật quyền người dùng (1.3.7)
*   **Mục đích:** Thêm hoặc bớt các thao tác chi tiết cho một nhóm quyền đã có.
*   **Luồng nghiệp vụ:**
    1.  Chọn biểu tượng `Sửa` trên dòng nhóm quyền tương ứng.
    2.  Tích chọn thêm hoặc bỏ chọn các permission.
    3.  Nhấn `Lưu`.

---

## 3. Danh mục dữ liệu cần thiết (Data Schema for UI/UX)

| Trường dữ liệu | Loại dữ liệu | Ràng buộc | Ghi chú |
| :--- | :--- | :--- | :--- |
| **User Account** | String | Bắt buộc, Duy nhất | |
| **Full Name** | String | | |
| **Email** | String (Email) | Bắt buộc | |
| **Password** | String (Password) | Bắt buộc | |
| **Confirm Password** | String | Bắt buộc | Phải khớp với Password |
| **Active Status** | Boolean | Mặc định: True | Trạng thái kích hoạt |
| **Lock Status** | Boolean | Mặc định: False | Trạng thái khóa |
| **Roles** | List (Select) | Bắt buộc | Danh sách các nhóm quyền |
| **Role Name** | String | Bắt buộc | Mã định danh nhóm quyền |
| **Display Name** | String | | Tên hiển thị trên UI |
| **Permissions** | List (Checkbox) | Bắt buộc | Tập hợp các chức năng cụ thể |

---

## 4. Lưu ý cho việc refactor UX
1.  **Tính nhất quán:** Các màn hình Thêm/Sửa người dùng và Thêm/Sửa quyền cần đồng bộ về cách bố trí (Form bên trái/phải hoặc Modal).
2.  **Phân nhóm Permission:** Danh sách permission trong phần quản lý quyền (1.3.6) rất dài và phức tạp (nhiều module: Hệ thống, Đăng ký phát hành, Xử lý hóa đơn...). Cần được phân nhóm theo Folder hoặc Accordion để dễ quản lý.
3.  **Trạng thái:** Cần phân biệt rõ giữa "Kích hoạt" (Active) và "Khóa" (Locked) để tránh gây nhầm lẫn cho Admin khi quản trị tài khoản.

---
*Báo cáo kết thúc dựa trên nội dung tài liệu gốc.*
