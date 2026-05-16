Dựa trên tài liệu **4.6 Phát hành hóa đơn** (file `docs/46_Phát_hành_hóa_đơn.pdf`), tôi xin trình bày phân tích chi tiết nghiệp vụ như sau:

---

# PHÂN TÍCH NGHIỆP VỤ: PHÁT HÀNH HÓA ĐƠN (MỤC 4.6)

## 1. Tổng quan tính năng
Tính năng này cho phép người dùng thực hiện ký số và phát hành chính thức các hóa đơn đã được khởi tạo trong hệ thống. Đây là bước chuyển đổi trạng thái hóa đơn từ "Mới tạo lập" sang trạng thái đã phát hành có giá trị pháp lý.

## 2. Điều kiện tiên quyết (Prerequisites)
Để thực hiện phát hành hóa đơn, hệ thống yêu cầu:
*   **Phần mềm hỗ trợ:** Người dùng cần phải tải và cài đặt thành công **Phần mềm chữ ký số** (Công cụ ký số trực tuyến) trên máy tính cá nhân.
*   **Thiết bị ký số:** Chữ ký số (USB Token hoặc chứng thư số tương đương) của Doanh nghiệp phải được kết nối và sẵn sàng.

## 3. Luồng nghiệp vụ (User Flow)

### Bước 1: Chọn hóa đơn cần phát hành
*   Người dùng truy cập vào giao diện **Danh sách quản lý hóa đơn**.
*   Thực hiện tích chọn các hóa đơn muốn phát hành.
*   Hệ thống hỗ trợ phát hành đơn lẻ (chọn 1 hóa đơn) hoặc phát hành hàng loạt (chọn nhiều hóa đơn cùng lúc).

### Bước 2: Kích hoạt lệnh phát hành
*   Sau khi chọn hóa đơn, người dùng nhấn vào nút chức năng **"PHÁT HÀNH HÓA ĐƠN"** (nút màu xanh, có icon tick v).

### Bước 3: Lựa chọn chứng thư số
*   Một cửa sổ hệ thống (Windows Security) hiện lên với tiêu đề **"Danh sách chứng thư"**.
*   Người dùng xem danh sách các chứng thư số đang khả dụng.
*   Nếu không thấy chữ ký số đúng của Doanh nghiệp, người dùng nhấn vào link **"More choices"** để mở rộng danh sách tìm kiếm.

### Bước 4: Xác nhận ký số
*   Người dùng chọn đúng chứng thư số của đơn vị.
*   Nhấn nút **"OK"** để hoàn tất quá trình ký và phát hành.

## 4. Dữ liệu cần thiết

### Dữ liệu đầu vào (Input)
*   **Danh sách hóa đơn:** Các hóa đơn đang ở trạng thái "Mới tạo lập".
*   **Thông tin chứng thư số:** Bao gồm tên chủ thể (Issuer), thời hạn hiệu lực (Valid From... to...), và định danh thiết bị ký.

### Thông tin hiển thị trên danh sách (để người dùng đối soát)
Dựa trên screenshot trong tài liệu, các trường thông tin cần hiển thị bao gồm:
*   **Thông tin khách hàng:** Mã số thuế (MST), Tên đơn vị/khách hàng.
*   **Ký hiệu:** Ký hiệu của hóa đơn (ví dụ: AA/18E).
*   **Ngày lập:** Thời gian khởi tạo hóa đơn.
*   **Tổng tiền:** Tổng giá trị thanh toán của hóa đơn.
*   **Trạng thái:** Hiển thị trạng thái hiện tại (ví dụ: "Mới tạo lập").

## 5. Lưu ý quan trọng từ tài liệu
*   Quy trình ký số phụ thuộc vào phần mềm chữ ký số cài đặt ngoài trình duyệt.
*   Giao diện chọn chứng thư số là giao diện tiêu chuẩn của hệ điều hành (Windows Security) được gọi từ trình duyệt/plugin ký số.

---
*Kết thúc bản phân tích dựa trên tài liệu cung cấp.*
