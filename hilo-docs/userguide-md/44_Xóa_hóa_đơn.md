Dựa trên tài liệu **4.4 Xóa hóa đơn (docs/44_Xóa_hóa_đơn.pdf)**, dưới đây là phân tích chi tiết về tính năng, luồng nghiệp vụ và dữ liệu cần thiết:

# Phân tích nghiệp vụ: Xóa hóa đơn

## 1. Mục tiêu tính năng
Cho phép người dùng loại bỏ các hóa đơn đã khởi tạo sai hoặc không còn nhu cầu sử dụng khỏi hệ thống trước khi thực hiện các bước nghiệp vụ tiếp theo (phát hành).

## 2. Quy tắc nghiệp vụ (Business Rules)
- **Điều kiện xóa:** Hệ thống **chỉ cho phép** xóa các hóa đơn ở trạng thái **"Mới tạo"** và **"Chưa phát hành"**.
- **Tính toàn vẹn dữ liệu:** Sau khi xác nhận xóa, dữ liệu sẽ bị xóa hoàn toàn khỏi hệ thống và không thể khôi phục lại.

## 3. Luồng nghiệp vụ (User Flow)

### Bước 1: Chọn hóa đơn cần xóa
1. Người dùng truy cập vào trang **"Danh sách hóa đơn"**.
2. Tìm kiếm và xác định hóa đơn muốn xóa trong danh sách.
3. Kích chuột vào biểu tượng xóa (thường là dấu **x**) trên dòng tương ứng với hóa đơn đó.

### Bước 2: Xác nhận xóa
1. Hệ thống hiển thị cửa sổ (popup) xác nhận với nội dung:
   - Thông báo: *"Bạn muốn xóa dữ liệu này?"*
   - Cảnh báo: *"Dữ liệu sẽ không thể khôi phục sau khi xóa."*
2. Người dùng thực hiện lựa chọn:
   - **Nhấn nút "Hủy":** Hệ thống đóng cửa sổ xác nhận, không thực hiện xóa và quay lại trang "Danh sách hóa đơn".
   - **Nhấn nút "Xóa":** Hệ thống tiến hành xử lý lệnh xóa.

### Bước 3: Phản hồi kết quả
- **Trường hợp thành công:** 
  - Hóa đơn bị xóa khỏi hệ thống.
  - Hệ thống hiển thị thông báo: **"Xóa thành công."**
- **Trường hợp lỗi:** 
  - Hệ thống hiển thị thông báo: **"Xóa không thành công."**

## 4. Dữ liệu và Thành phần UI cần thiết

### Dữ liệu đầu vào
- **Định danh hóa đơn:** ID hoặc thông tin duy nhất của hóa đơn được chọn để xóa.
- **Trạng thái hóa đơn:** Dùng để kiểm tra điều kiện (mới tạo, chưa phát hành) trước khi cho phép hiển thị nút xóa hoặc thực thi lệnh xóa.

### Thành phần giao diện (UI Components)
- **Nút/Biểu tượng xóa:** Nằm trên từng dòng của bảng danh sách hóa đơn.
- **Cửa sổ xác nhận (Modal/Dialog):**
  - Tiêu đề/Nội dung cảnh báo.
  - Nút xác nhận (**Xóa**).
  - Nút đóng/hủy (**Hủy**).
- **Thông báo phản hồi (Toast/Alert):** Hiển thị kết quả "Xóa thành công" hoặc "Xóa không thành công".

---
*Lưu ý: Các thông tin trên được trích xuất nguyên bản từ tài liệu hướng dẫn, phục vụ cho mục đích clone và refactor UX.*
