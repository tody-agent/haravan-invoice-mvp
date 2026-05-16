Dưới đây là bản phân tích nghiệp vụ chi tiết dựa trên tài liệu **5.4 Danh sách hóa đơn điều chỉnh** (file `54_Danh_sách_hóa_đơn_điều_chỉnh.pdf`).

---

# PHÂN TÍCH NGHIỆP VỤ: DANH SÁCH HÓA ĐƠN ĐIỀU CHỈNH

## 1. Mô tả chung
Tính năng này cho phép người dùng tra cứu và quản lý danh sách các hóa đơn đã thực hiện điều chỉnh hoặc thay thế trong hệ thống. Giao diện cung cấp cái nhìn đối chiếu giữa hóa đơn gốc (bị điều chỉnh) và hóa đơn mới (điều chỉnh).

## 2. Luồng nghiệp vụ (User Flow)
1. **Truy cập chức năng**: Người dùng điều hướng theo menu: `Xử lý hóa đơn` -> `Hóa đơn điều chỉnh`.
2. **Tìm kiếm/Lọc**:
   - Người dùng nhập các tiêu chí tìm kiếm vào form "Tìm kiếm hóa đơn".
   - Nhấn nút **Tìm kiếm**.
3. **Xem kết quả**: Hệ thống hiển thị danh sách các cặp hóa đơn (Bị điều chỉnh và Điều chỉnh) tương ứng với điều kiện lọc.
4. **Tương tác**: Người dùng có thể xem chi tiết nội dung hóa đơn, ghi chú hoặc các văn bản đính kèm liên quan đến việc điều chỉnh.

## 3. Các trường dữ liệu (Data Requirements)

### 3.1. Bộ lọc tìm kiếm (Search Criteria)
Hệ thống hỗ trợ tìm kiếm linh hoạt dựa trên các trường sau:
- **Mẫu số**: Chuỗi ký tự mẫu hóa đơn (Ví dụ: 01GTKT0/001).
- **Ký hiệu**: Ký hiệu hóa đơn (Ví dụ: AA/18E).
- **Từ ngày HĐ - Đến ngày HĐ**: Khoảng thời gian phát hành hóa đơn (Dạng Date picker).
- **Tên khách hàng**: Tìm kiếm theo tên đơn vị mua hàng.
- **Số hóa đơn**: Tìm kiếm theo số thứ tự của hóa đơn.
- **Mã số thuế**: Tìm kiếm theo MST của khách hàng.
- **Mã khách hàng**: Tìm kiếm theo mã định danh khách hàng trong hệ thống.

### 3.2. Danh sách kết quả (Data Table)
Bảng dữ liệu được chia làm hai phần chính để thể hiện mối quan hệ đối chiếu:

#### Nhóm 1: Hóa đơn bị điều chỉnh (Invoice being adjusted)
1. **Stt**: Số thứ tự dòng.
2. **Mẫu số**: Mẫu số của hóa đơn gốc.
3. **Ký hiệu**: Ký hiệu của hóa đơn gốc.
4. **Số (No)**: Số hóa đơn của hóa đơn gốc.
5. **Chi tiết**: Biểu tượng (Icon mắt) dùng để xem chi tiết nội dung hóa đơn gốc.
6. **Ghi chú**: Biểu tượng (Icon tờ giấy) để xem các lưu vết/ghi chú về lý do bị điều chỉnh.

#### Nhóm 2: Hóa đơn điều chỉnh (Adjusting Invoice)
7. **Mẫu số**: Mẫu số của hóa đơn mới (hóa đơn điều chỉnh/thay thế).
8. **Ký hiệu**: Ký hiệu của hóa đơn mới.
9. **Số (No)**: Số hóa đơn của hóa đơn mới.
10. **Chi tiết**: Biểu tượng (Icon mắt) dùng để xem nội dung chi tiết hóa đơn mới.
11. **Ghi chú**: Biểu tượng (Icon tờ giấy) xem ghi chú của hóa đơn mới.
12. **Văn bản**: Biểu tượng (Icon kẹp giấy/văn bản) dùng để xem/tải các biên bản điều chỉnh hoặc văn bản thỏa thuận kèm theo.

## 4. Đặc điểm giao diện & UX (Dựa trên hình ảnh)
- **Cấu trúc**: Tiêu đề trang nằm trên cùng, tiếp theo là khối tìm kiếm (có thể thu gọn/mở rộng qua icon góc phải), và dưới cùng là bảng dữ liệu.
- **Phân trang**: Có thanh phân trang ở cuối bảng để quản lý số lượng bản ghi lớn.
- **Tiêu đề bảng**: Sử dụng header 2 tầng để phân nhóm rõ ràng giữa "Hóa đơn bị điều chỉnh" và "Hóa đơn điều chỉnh".

---
*Lưu ý: Tài liệu gốc không mô tả các ràng buộc dữ liệu cụ thể (Validation) hay quyền hạn chi tiết, do đó các phần này không được đưa vào bản phân tích này.*
