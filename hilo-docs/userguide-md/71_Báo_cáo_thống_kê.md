Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **"7.1 Báo cáo tình hình sử dụng HĐĐT"** dựa trên tài liệu cung cấp.

---

# PHÂN TÍCH NGHIỆP VỤ: 7.1 BÁO CÁO TÌNH HÌNH SỬ DỤNG HĐĐT

## 1. Thông tin chung
*   **Tên tính năng:** Báo cáo tình hình sử dụng Hóa đơn điện tử (HĐĐT).
*   **Mục đích:** Hỗ trợ đơn vị lập báo cáo tổng hợp về tình hình sử dụng hóa đơn theo từng Quý trong năm để phục vụ công tác quản lý và báo cáo thuế.

## 2. Luồng nghiệp vụ (User Flow)

### Quy trình thực hiện:
1.  **Truy cập chức năng:** Từ menu chính, người dùng chọn **Thống kê** > **Tình hình sử dụng HD**.
2.  **Thiết lập tham số báo cáo:**
    *   Người dùng chọn **Quý** (1, 2, 3, 4).
    *   Người dùng chọn **Năm** lập báo cáo.
3.  **Khởi tạo báo cáo:** Nhấn nút **Báo cáo nhanh**. Hệ thống tự động truy xuất dữ liệu dựa trên kỳ báo cáo đã chọn và hiển thị kết quả lên màn hình.
4.  **Tương tác với kết quả:** Sau khi báo cáo hiển thị, người dùng có các lựa chọn:
    *   **In báo cáo:** Mở hộp thoại cấu hình in.
    *   **Xuất file XLS:** Tải báo cáo về máy dưới định dạng Excel.
    *   **Xuất file XML:** Tải báo cáo về máy dưới định dạng XML (thường dùng để nộp tờ khai qua phần mềm của Tổng cục Thuế).
    *   **Quay lại:** Thoát khỏi chế độ xem báo cáo để trở về màn hình chọn kỳ lập báo cáo.

---

## 3. Chi tiết dữ liệu và Giao diện (Data & UI Requirements)

### Tham số đầu vào (Filters/Inputs):
| Tên trường | Loại dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| **Quý** | Dropdown/Select | Chọn từ Quý 1 đến Quý 4 |
| **Năm** | Number/Select | Nhập hoặc chọn năm cần báo cáo |

### Các hành động (Actions/Buttons):
*   **Báo cáo nhanh:** Nút thực thi truy vấn dữ liệu.
*   **In báo cáo:** Biểu tượng máy in, dùng để in trực tiếp.
*   **Xuất file XLS:** Xuất dữ liệu ra bảng tính Excel.
*   **Xuất file XML:** Xuất dữ liệu theo cấu trúc XML chuẩn.
*   **Quay lại:** Nút điều hướng quay về bước trước đó.

### Dữ liệu hiển thị (Output):
Dựa trên hình ảnh minh họa trong tài liệu, báo cáo sẽ bao gồm các thông tin tổng hợp về:
*   Mẫu số, ký hiệu hóa đơn.
*   Số lượng hóa đơn sử dụng, xóa bỏ, thay thế, điều chỉnh trong kỳ.
*   (Dữ liệu cụ thể được hệ thống tự động tổng hợp từ cơ sở dữ liệu hóa đơn đã phát hành).

---

## 4. Ghi chú cho UX Refactor
*   **Màn hình lọc:** Cần thiết kế gọn gàng với 2 trường Quý và Năm làm trọng tâm.
*   **Trạng thái chờ:** Cần có loading state khi nhấn "Báo cáo nhanh" vì dữ liệu thống kê có thể lớn.
*   **Tính nhất quán:** Các nút chức năng (In, Xuất XLS, Xuất XML, Quay lại) nên được nhóm thành một thanh công cụ (toolbar) phía trên báo cáo để dễ tiếp cận.
*   **Định dạng tệp:** Đảm bảo file XML xuất ra đúng cấu trúc quy định của cơ quan Thuế (nếu có yêu cầu pháp lý đi kèm).
