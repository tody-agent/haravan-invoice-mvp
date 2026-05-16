Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng "Chuyển trạng thái của thông báo phát hành" dựa trên nội dung tài liệu `328_Chuyển_trạng_thái_của_thông_báo_phát_hành.pdf`:

# Phân tích Nghiệp vụ: Chuyển trạng thái cho thông báo phát hành đã gửi cơ quan thuế

## 1. Mục tiêu và Phạm vi
Chức năng này dùng để chuyển đổi trạng thái của một thông báo phát hành từ trạng thái **"Mới lập"** sang trạng thái **"Đã gửi"**. Việc chuyển trạng thái này được thực hiện sau khi người dùng đã thực tế gửi thông báo phát hành cho cơ quan thuế quản lý trực tiếp.

## 2. Quy trình thực hiện (User Flow)

Luồng nghiệp vụ được thực hiện qua các bước sau:

*   **Bước 1: Truy cập danh sách**
    *   Người dùng truy cập vào trang danh sách **Thông báo phát hành**.
*   **Bước 2: Chọn bản ghi cần xử lý**
    *   Tìm và chọn thông báo phát hành cụ thể trong danh sách.
    *   Thao tác: Kích chuột vào biểu tượng xem chi tiết (biểu tượng hình mắt 👁️) ở dòng tương ứng.
*   **Bước 3: Mở màn hình chi tiết**
    *   Hệ thống hiển thị màn hình **Xem thông tin chi tiết thông báo phát hành**.
*   **Bước 4: Xác nhận chuyển trạng thái**
    *   Người dùng kiểm tra lại thông tin. Nếu thông báo này đã được gửi đến cơ quan thuế, người dùng nhấn chọn nút **Gửi thông báo**.
    *   Hệ thống cập nhật trạng thái của bản ghi thành **Đã gửi**.

## 3. Dữ liệu và Thành phần giao diện (Data & UI Elements)

Dựa trên luồng nghiệp vụ, các thành phần cần thiết bao gồm:

### Dữ liệu (Data)
*   **Thông tin bản ghi:** Định danh của thông báo phát hành đang được chọn.
*   **Trạng thái (Status):** 
    *   Trước khi xử lý: "Mới lập".
    *   Sau khi xử lý: "Đã gửi".

### Giao diện (UI Elements)
*   **Trang Danh sách Thông báo phát hành:**
    *   Bảng dữ liệu chứa danh sách các thông báo.
    *   Biểu tượng hành động: Xem chi tiết (hình mắt 👁️).
*   **Trang Xem chi tiết thông báo phát hành:**
    *   Vùng hiển thị thông tin chi tiết của thông báo (để người dùng đối soát trước khi xác nhận).
    *   Nút chức năng (Button): **"Gửi thông báo"**.

## 4. Ràng buộc nghiệp vụ (Business Rules)
*   Chức năng chỉ có ý nghĩa khi thông báo phát hành ở trạng thái mới lập (chưa xác nhận gửi).
*   Hành động nhấn "Gửi thông báo" là lời khẳng định của người dùng rằng hồ sơ đã được gửi đến cơ quan thuế quản lý trực tiếp.

---
*Ghi chú: Bản phân tích này được trích xuất nguyên trạng từ tài liệu hướng dẫn 3.2.8 phục vụ cho mục đích tái thiết kế UX.*
