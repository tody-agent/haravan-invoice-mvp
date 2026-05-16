Dưới đây là bản phân tích chi tiết nghiệp vụ tính năng **"Sửa thông tin loại hóa đơn phát hành"** dựa trên tài liệu `docs/323_Sửa_thông_tin_loại_hóa_đơn_phát_hành.pdf`.

---

# Phân tích Nghiệp vụ: 3.2.3 Sửa thông tin loại hóa đơn phát hành

## 1. Mô tả chức năng
Chức năng này cho phép Người sử dụng (NSD) chỉnh sửa chi tiết các loại hóa đơn trong danh sách đăng ký của một Thông báo phát hành. NSD có thể thay đổi các thông số về mẫu số, ký hiệu, số lượng và thời gian áp dụng, ngoại trừ số bắt đầu để đảm bảo tính liên tục của dải hóa đơn.

## 2. Luồng nghiệp vụ (User Flow)
1. **Tiếp cận:** Tại màn hình danh sách "Các loại hóa đơn phát hành", NSD tìm đến dòng hóa đơn cần sửa.
2. **Kích hoạt:** Kích chuột vào biểu tượng **Sửa** (hình cây bút) trên dòng tương ứng.
3. **Chỉnh sửa:** Hệ thống cho phép NSD nhập/thay đổi thông tin trên các trường dữ liệu (trừ trường "Từ số").
4. **Tính toán tự động:** Khi NSD thay đổi các giá trị về định danh hoặc số lượng, hệ thống thực hiện tính toán lại các trường liên quan theo thời gian thực.
5. **Hoàn tất:** 
   - Nhấn **Lưu dữ liệu** để ghi nhận các thay đổi và cập nhật vào danh sách.
   - Nhấn **Quay lại** để hủy bỏ các thay đổi và trở về màn hình "Thêm mới thông báo phát hành".

## 3. Các trường thông tin (Data Elements)

| Trường thông tin | Trạng thái | Ràng buộc nghiệp vụ |
| :--- | :--- | :--- |
| **Mẫu số** | Bắt buộc | Chọn từ danh sách. Khi chọn, hệ thống tự hiển thị Loại hóa đơn tương ứng. |
| **Ký hiệu** | Bắt buộc | Nhập chuỗi ký hiệu (Serial). |
| **Số lượng** | Bắt buộc | Nhập số dương. Tự động tính lại "Đến số". |
| **Từ số** | **Không được sửa** | Hệ thống tự động tính toán (Read-only). |
| **Đến số** | Bắt buộc | Nhập số dương. Tự động tính lại "Số lượng". |
| **Ngày bắt đầu sử dụng** | Bắt buộc | Phải là ngày hiện tại hoặc các ngày sau ngày hiện tại. |
| **Mục đích sử dụng** | Tùy chọn | Nhập nội dung diễn giải cho mỗi mẫu số. |

## 4. Các quy tắc nghiệp vụ (Business Rules)

### 4.1. Quy tắc tính "Từ số" (Số hóa đơn bắt đầu)
- Hệ thống tự động tính toán dựa trên lịch sử phát hành của cặp **Mẫu số** và **Ký hiệu** để đảm bảo dải số liên tiếp.
- *Ví dụ:* Nếu mẫu `01GTKT/001`, ký hiệu `AA/12E` đã phát hành từ số 10 đến số 20, khi NSD chọn lại cặp này, hệ thống sẽ tự tính **Từ số** là 21.

### 4.2. Quy tắc ràng buộc Số lượng và Đến số
Hệ thống duy trì mối quan hệ chặt chẽ giữa số lượng và dải số theo công thức:
> **Số lượng = Đến số - Từ số + 1**

- **Trường hợp 1:** NSD nhập **Số lượng** -> Hệ thống tự tính **Đến số**.
- **Trường hợp 2:** NSD nhập **Đến số** -> Hệ thống tự tính ngược lại **Số lượng**.

### 4.3. Quy tắc thời gian
- **Ngày bắt đầu sử dụng:** Không được phép chọn ngày trong quá khứ. Chỉ chấp nhận giá trị `≥ Ngày hiện tại`.

### 4.4. Quy tắc về quyền chỉnh sửa
- NSD có quyền sửa tất cả các thông tin định danh và định lượng của loại hóa đơn đó, **duy nhất trường "Từ số" là không thể can thiệp thủ công** để tránh sai lệch dải số phát hành.

## 5. Giao diện (UI Components)
Dựa trên hình ảnh đính kèm trong tài liệu, cấu trúc thông tin bao gồm:
- **Phần Header (Thông tin chung):** Hiển thị thông tin đơn vị (MST, Địa chỉ, Người đại diện, Cơ quan thuế...) - các thông tin này thường được kế thừa từ Thông báo phát hành cha.
- **Phần Danh sách (Line items):** Bảng "Các loại hóa đơn phát hành" với các cột: Mẫu số, Ký hiệu, Số lượng, Từ số, Đến số, Ngày bắt đầu sử dụng, và hành động (Sửa/Xóa).
