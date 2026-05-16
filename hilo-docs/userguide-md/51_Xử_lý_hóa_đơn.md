Dựa trên tài liệu **51_Xử_lý_hóa_đơn.pdf**, tôi xin trình bày phân tích nghiệp vụ chi tiết của tính năng **Thay thế hóa đơn** như sau:

# Phân tích Nghiệp vụ: 5.1 Xử lý hóa đơn (Thay thế hóa đơn)

## 1. Tổng quan (Overview)
*   **Mục tiêu:** Cho phép người dùng thực hiện thay thế các hóa đơn điện tử đã phát hành nhưng có sai sót thông qua việc lập biên bản thu hồi và khởi tạo hóa đơn thay thế mới.
*   **Vị trí chức năng:** `Quản lý hóa đơn` => `Danh sách hóa đơn`.

## 2. Luồng nghiệp vụ (User Flow)

### Bước 1: Khởi tạo quy trình
1.  Truy cập vào menu **Quản lý hóa đơn** > **Danh sách hóa đơn**.
2.  Tại hóa đơn cần thay thế, người dùng nhấn vào biểu tượng tại cột **Thao tác**.
3.  Hệ thống hiển thị menu các tùy chọn xử lý: *Thay thế, Điều chỉnh tăng, Điều chỉnh giảm, Điều chỉnh thông tin*. Người dùng chọn **Thay thế**.

### Bước 2: Lập Biên bản thu hồi (nếu cần)
1.  Trước khi lập hóa đơn thay thế, người dùng thực hiện tìm kiếm hóa đơn cần thay thế.
2.  Điền các thông tin cần thiết trên giao diện **Biên bản thu hồi hóa đơn đã lập**.
3.  Nhấn nút **Lập biên bản**.

### Bước 3: Lập Hóa đơn thay thế
1.  Hệ thống chuyển sang giao diện **Hóa đơn giá trị gia tăng** (hóa đơn mới).
2.  Người dùng điền các thông tin thay thế cho hóa đơn gốc.
3.  Đính kèm tệp biên bản đã lập.
4.  Kiểm tra dữ liệu và nhấn nút **Thay thế** để hoàn tất phát hành hóa đơn mới.

---

## 3. Chi tiết Dữ liệu (Data Elements)

### 3.1. Biên bản thu hồi hóa đơn (Minutes of Recall)
Các trường thông tin cần thiết:
*   **Số biên bản (*):** Mã định danh biên bản (bắt buộc).
*   **Đơn vị mua:** Tên đơn vị khách hàng (tự động hiển thị từ hóa đơn gốc).
*   **Mã số thuế:** Mã số thuế của đơn vị mua.
*   **Mail khách hàng (*):** Địa chỉ email nhận thông báo (bắt buộc).
*   **Địa chỉ:** Địa chỉ của đơn vị mua.
*   **Thông tin hóa đơn thay thế:** (Hiển thị thông tin hóa đơn gốc bị thay thế) bao gồm:
    *   Mẫu số hóa đơn.
    *   Ký hiệu hóa đơn.
    *   Số hóa đơn.
*   **Lý do thu hồi (*):** Nội dung giải trình lý do thực hiện thay thế hóa đơn (bắt buộc).

### 3.2. Hóa đơn thay thế (Replacement Invoice)
Giao diện hóa đơn thay thế bao gồm các nhóm thông tin chính:

#### A. Thông tin Người bán & Mẫu số
*   Mã số thuế, Tên đơn vị, Địa chỉ, Điện thoại, Fax.
*   **Mẫu số:** Ví dụ `01GTKT0/003`.

#### B. Thông tin Người mua
*   Họ tên người mua, Tên đơn vị, Mã số thuế, Địa chỉ.
*   Email khách hàng, Số tài khoản.

#### C. Thông tin Giao dịch & Pháp lý
*   **Hình thức thanh toán (*):** (Ví dụ: Thanh toán chuyển khoản).
*   **Biên bản đính kèm:** Cho phép tải lên tệp tin chứng minh (định dạng hỗ trợ: .doc, .docx, .pdf...).
*   **Dòng ghi chú pháp lý:** Hệ thống tự động sinh câu: *(Thay thế cho hóa đơn điện tử số [Số hóa đơn], mẫu số [Mẫu số], ký hiệu [Ký hiệu])*.

#### D. Chi tiết Hàng hóa, Dịch vụ (Bảng dữ liệu)
*   STT, Tên hàng hóa dịch vụ.
*   Đơn vị tính, Số lượng, Đơn giá.
*   Thành tiền.
*   Checkbox **Không tính thuế**: Dành cho các mặt hàng không chịu thuế.

#### E. Tổng cộng & Thanh toán
*   Tổng tiền dịch vụ (trước thuế).
*   Thuế suất GTGT (ví dụ: 10%).
*   Tiền thuế GTGT.
*   Tổng cộng tiền thanh toán.
*   **Số tiền viết bằng chữ.**

---

## 4. Các nút chức năng (Actions)
*   **Lập biên bản:** Lưu và khởi tạo biên bản thu hồi.
*   **Thay thế:** Thực hiện lệnh thay thế và phát hành hóa đơn mới.
*   **Quay lại:** Hủy bỏ thao tác hiện tại và trở về màn hình trước đó.

Tài liệu này tập trung vào quy trình nghiệp vụ "Thay thế", là một trong bốn nghiệp vụ xử lý hóa đơn sai sót chính của hệ thống.
