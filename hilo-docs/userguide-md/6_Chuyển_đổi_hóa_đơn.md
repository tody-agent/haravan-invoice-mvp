Tài liệu **"6 Chuyển đổi hóa đơn"** mô tả quy trình nghiệp vụ cho phép người dùng thực hiện chuyển đổi hóa đơn điện tử trong hệ thống. Dưới đây là phân tích chi tiết:

### 1. Mục tiêu nghiệp vụ
Hệ thống cung cấp chức năng cho phép người dùng tìm kiếm và thực hiện chuyển đổi các hóa đơn điện tử đã phát hành.

### 2. Các tính năng chính
*   **Tìm kiếm hóa đơn:** Bộ lọc đa điều kiện để xác định chính xác hóa đơn cần chuyển đổi.
*   **Quản lý danh sách:** Hiển thị danh sách hóa đơn thỏa mãn điều kiện lọc.
*   **Xem trước và Xác nhận:** Cho phép người dùng kiểm tra thông tin hóa đơn trước khi thực hiện lệnh chuyển đổi cuối cùng.

### 3. Dữ liệu cần thiết (Data Fields)

#### A. Bộ lọc tìm kiếm (Search Criteria)
*   **Mẫu số:** Số hiệu mẫu hóa đơn.
*   **Ký hiệu:** Ký hiệu hóa đơn.
*   **Trạng thái:** Trạng thái chuyển đổi của hóa đơn (Dropdown chọn).
*   **Số hóa đơn:** Số thứ tự của hóa đơn.
*   **Từ ngày HĐ / Đến ngày HĐ:** Khoảng thời gian xuất hóa đơn.
*   **Mã khách hàng:** Mã định danh của người mua.
*   **Tên khách hàng:** Tên đơn vị/cá nhân mua hàng.

#### B. Danh sách hóa đơn (Invoice List)
*   **STT:** Số thứ tự.
*   **Mẫu số / Ký hiệu / Số:** Thông tin định danh hóa đơn.
*   **Tên khách hàng:** Đối tượng mua hàng.
*   **Ngày xuất:** Ngày phát hành hóa đơn.
*   **Trạng thái:** Tình trạng hiện tại của hóa đơn.
*   **Chọn:** Ô đánh dấu (Checkbox) để chọn hóa đơn thực hiện tác vụ.

#### C. Thông tin xác nhận chuyển đổi (Confirmation Details)
*   **Thông tin Người mua hàng (Buyer).**
*   **Thông tin Người bán hàng (Seller).**
*   **Trạng thái Chữ ký số:** Hiển thị tính hợp lệ của chữ ký (ví dụ: "Signature Valid bởi...").
*   **Ngày ký:** Thời gian thực hiện ký số.

### 4. Luồng nghiệp vụ (User Flow)

1.  **Bước 1: Truy cập chức năng**
    *   Người dùng chọn danh mục **“Chuyển đổi”** từ menu hệ thống.
2.  **Bước 2: Tìm kiếm hóa đơn**
    *   Người dùng nhập các tiêu chí tìm kiếm tại khung "Tìm kiếm hóa đơn".
    *   Nhấn nút **“Tìm kiếm”** để hiển thị dữ liệu.
3.  **Bước 3: Chọn hóa đơn cần chuyển đổi**
    *   Trong bảng "DANH SÁCH HÓA ĐƠN", người dùng tích chọn hóa đơn tương ứng.
    *   Nhấn nút **“CHUYỂN ĐỔI HÓA ĐƠN”** (nằm ở phía cuối danh sách).
4.  **Bước 4: Xác nhận chuyển đổi**
    *   Hệ thống hiển thị màn hình xem trước nội dung hóa đơn cùng các thông tin chữ ký số.
    *   Người dùng kiểm tra lại thông tin và nhấn nút **“Chuyển đổi”** để hoàn tất quy trình.
    *   (Tùy chọn) Nhấn **“Close”** để đóng màn hình và hủy tác vụ.

### 5. Thành phần giao diện (UI Elements)
*   **Nút bấm:** "Tìm kiếm", "CHUYỂN ĐỔI HÓA ĐƠN" (tại danh sách), "Chuyển đổi" (tại màn hình xác nhận), "Close".
*   **Bảng dữ liệu:** Phân trang hoặc danh sách cuộn hiển thị các cột thông tin hóa đơn.
*   **Dấu hiệu nhận diện:** Con dấu/khung xác nhận chữ ký số (Signature Valid) màu đỏ tại màn hình xác nhận.
