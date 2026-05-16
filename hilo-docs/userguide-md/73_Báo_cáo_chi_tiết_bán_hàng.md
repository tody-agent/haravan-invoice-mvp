Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **Báo cáo chi tiết bán hàng** dựa trên tài liệu `73_Báo_cáo_chi_tiết_bán_hàng.pdf`.

---

# PHÂN TÍCH NGHIỆP VỤ: 7.3 BÁO CÁO CHI TIẾT BÁN HÀNG

## 1. Mục đích (Objective)
Thống kê chi tiết tình hình sử dụng hóa đơn và doanh số bán hàng theo từng mặt hàng/dịch vụ trong phạm vi từng tháng. Tài liệu này giúp kế toán kiểm soát chi tiết nội dung hàng hóa, thuế suất và trạng thái phát hành của từng hóa đơn.

## 2. Luồng nghiệp vụ (User Flow)

1.  **Truy cập:** Người dùng chọn menu **"Báo cáo chi tiết"** trên hệ thống.
2.  **Thiết lập bộ lọc (Filtering):**
    *   Người dùng nhập thông tin **Tháng** (kiểu số).
    *   Người dùng nhập thông tin **Năm** (kiểu số).
3.  **Truy vấn dữ liệu:** Nhấn nút **"Báo cáo"**. Hệ thống thực hiện lọc danh sách hóa đơn thỏa mãn điều kiện thời gian đã chọn.
4.  **Xử lý kết quả:** Sau khi bảng dữ liệu hiển thị, người dùng có các tùy chọn:
    *   **In báo cáo:** Xem và in mẫu báo cáo.
    *   **Xuất Excel:** Chọn **"Tải Excel"** hoặc **"Xuất file XLS"** để tải dữ liệu về máy tính.
    *   **Quay lại:** Trở về màn hình trước đó.

## 3. Cấu trúc dữ liệu (Data Schema)

### A. Dữ liệu đầu vào (Input/Filters)
| Tên trường | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| **Tháng** | Số (Integer) | Từ 01 đến 12 |
| **Năm** | Số (Integer) | Ví dụ: 2018, 2024 |

### B. Dữ liệu đầu ra (Output Table Columns)
Báo cáo hiển thị theo dạng bảng, chi tiết đến từng dòng hàng hóa/dịch vụ trong hóa đơn:

1.  **STT:** Số thứ tự dòng.
2.  **MST:** Mã số thuế của khách hàng/đơn vị mua hàng.
3.  **Ngày hóa đơn:** Ngày phát hành hóa đơn (DD/MM/YYYY).
4.  **Mẫu số:** Ký hiệu mẫu hóa đơn (Ví dụ: `01GTKT0/003`).
5.  **Ký hiệu:** Ký hiệu hóa đơn (Ví dụ: `AG/18E`).
6.  **Số hóa đơn:** Số thứ tự của hóa đơn (Ví dụ: `0000002`).
7.  **Trạng thái:** Tình trạng hiện tại của hóa đơn (Ví dụ: `Phát hành`).
8.  **Tên hàng hóa, dịch vụ:** Tên chi tiết mặt hàng hoặc nội dung điều chỉnh/chiết khấu (Ví dụ: `máy tính dell`, `Chiết khấu bán hàng 5%`).
9.  **ĐVT:** Đơn vị tính (Ví dụ: `Cái`).
10. **Số lượng:** Số lượng hàng hóa tương ứng trên từng dòng.
11. **Đơn giá:** Giá bán chưa thuế của một đơn vị sản phẩm.
12. **Thành tiền:** Tổng tiền chưa thuế (Số lượng x Đơn giá).
13. **Thuế suất:** Tỷ lệ thuế GTGT áp dụng (Ví dụ: `8%`, `5%`).
14. **Tiền thuế:** Giá trị thuế GTGT của dòng hàng đó.
15. **Tổng cộng:** Tổng giá trị thanh toán của dòng hàng (Thành tiền + Tiền thuế).

## 4. Đặc điểm giao diện & Hành động (UI/UX Requirements)

*   **Vùng lọc (Filter Section):** Nằm ở phía trên cùng, gồm 2 ô nhập (Tháng, Năm) và nút lệnh "Báo cáo".
*   **Vùng hiển thị (Result Grid):** Hiển thị danh sách kết quả ngay bên dưới vùng lọc.
    *   Dữ liệu được rã chi tiết (breakdown) theo từng mặt hàng. Một hóa đơn có nhiều mặt hàng sẽ hiển thị trên nhiều dòng (Ví dụ trong tài liệu: dòng 24 và 25 cùng một số hóa đơn nhưng khác tên hàng và chiết khấu).
*   **Vùng hành động (Action Buttons):** Nằm dưới cùng của bảng kết quả, bao gồm:
    *   `Quay lại`
    *   `Tải Excel`
    *   `In báo cáo`

---
*Ghi chú: Bản phân tích này được trích xuất hoàn toàn từ tài liệu hình ảnh và văn bản trong file PDF cung cấp.*
