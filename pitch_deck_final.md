# 🚀 HARAVAN INVOICE WRAPPER – KẾ HOẠCH DỰ ÁN CHI TIẾT
*(Bản Tóm tắt Chiến lược, Tính năng, Roadmap & Research)*

---

## 1. Executive Summary & Vấn Đề

### 💥 Hook
**"Thuế không còn là gánh nặng của kế toán, mà là lợi thế tự động hóa của doanh nghiệp."**
Chỉ còn chưa đầy một tháng cho đến khi Nghị định 70/2025 có hiệu lực (01/06/2025). Hàng trăm ngàn nhà bán lẻ, nhà hàng và hộ kinh doanh đang đối mặt với án phạt từ 4–8 triệu đồng/lần nếu không thể xuất Hóa đơn điện tử (HĐĐT) ngay từ máy tính tiền. Haravan Invoice ra đời không chỉ để đáp ứng NĐ 70/2025, mà để biến tuân thủ thuế trở thành trải nghiệm mượt mà, "1-click" ngay trên hệ sinh thái omnichannel của Haravan.

### 😢 Nỗi Đau Khách Hàng (Pain Points)
1. **Áp lực pháp lý (NĐ 70/2025):** Bắt buộc xuất HĐĐT từ POS. Cấm "hủy" hóa đơn đã cấp mã, chỉ cho phép "điều chỉnh/thay thế" → Rất dễ sai sót và bị phạt nặng nếu cashier không rành nghiệp vụ.
2. **Nỗi đau Omnichannel (Sàn TMĐT, Livestream):** MISA và các phần mềm kế toán khác tách biệt với sàn. Kế toán phải copy/paste từng đơn Shopee/TikTok, đau đầu xử lý voucher sàn trợ giá theo Luật QLT sửa đổi 2024. Đơn COD bị "bom" nhưng vẫn phải nộp thuế.
3. **Phân mảnh công cụ:** Hộ kinh doanh (HKD) phải mua POS riêng, phần mềm HĐĐT riêng, chứng từ sổ sách TT88/2021 riêng. Tốn kém và khó đồng bộ.

### 🎯 Jobs-To-Be-Done (JTBD)
*“Khi tôi đang bận rộn bán hàng tại quầy hoặc livestream chốt hàng ngàn đơn, tôi muốn hệ thống tự động xử lý HĐĐT chuẩn luật thuế, để tôi có thể tập trung kinh doanh mà không nơm nớp lo sợ bị CQT tuýt còi.”*

---

## 2. Giải Pháp Haravan Invoice (Vũ khí cạnh tranh)

Haravan Invoice áp dụng chiến lược **Thick Gateway, Thin Adapter**, kết nối ngầm với T-VAN Hilo (và sẵn sàng multi T-VAN) nhưng mang lại trải nghiệm Native hoàn toàn trên Haravan.

### ⚔️ Vũ Khí Cạnh Tranh (So với đối thủ MISA MeInvoice):
1. **Voucher Tax Splitter™ (Tự động tách thuế đa sàn):** Tự động phân loại voucher do shop cấp (giảm giá tính thuế) và voucher do sàn trợ giá (không giảm giá tính thuế). *MISA hiện bắt kế toán tự đối soát.*
2. **Ký số HSM Tập Trung:** Cashier bấm "Thanh toán", hóa đơn ra trong 3 giây. Không cần cắm USB Token lỗi thời tại từng quầy thu ngân.
3. **Return-to-Invoice Engine (1-Click Đổi/Trả):** Khi khách hoàn hàng, hệ thống tự động nhận diện "Cùng kỳ" hay "Khác kỳ", quyết định "Thay thế" hay "Điều chỉnh", gửi ký số và thông báo CQT tự động. *MISA bắt người dùng tự chọn loại nghiệp vụ.*
4. **Pre-Issue Validator & Compliance Copilot:** AI tiền-kiểm hóa đơn trước khi cấp mã (kiểm tra MST, thuế suất, format). Nếu có sai sót, AI Copilot bằng ngôn ngữ tự nhiên sẽ hướng dẫn cách sửa theo mẫu 04/SS.
5. **Livestream Batching & Auto-COD Adjustment:** Tự động gom đơn livestream xuất batch cuối ngày. Nếu COD giao thất bại, tự sinh hóa đơn điều chỉnh giảm không cần sự can thiệp thủ công.

---

## 3. Các Tính Năng Cốt Lõi (MVP Design & Core Services)

### 🎨 Tầng Trải Nghiệm (App Shell & Navigation theo Haravan Polaris):
- **F2 - Dashboard Tổng Quan:** 4 KPIs Omnichannel, theo dõi doanh thu HĐĐT đa kênh.
- **F3 - Invoice List & F4 - One-Click Issue:** Quản lý hóa đơn và phát hành 1-click từ POS/Web/Admin.
- **F5 - Correction Wizard:** Wizard xử lý sai sót 5 bước chuẩn NĐ 70/2025.
- **F6 - Compliance Center & Audit Trail:** Trung tâm tuân thủ, lịch sử kiểm toán bất biến.
- **F7 - T-VAN Connections:** Giao diện kết nối nhà cung cấp T-VAN (Hilo).
- **F10 - Customer Portal:** Cổng tra cứu HĐĐT qua QR code trên bill cho người mua.

### ⚙️ Tầng Dịch Vụ (Backend Core):
- **Gateway & Hilo Adapter:** Kết nối T-VAN an toàn, Multi-tenant.
- **Autofill MST:** Tự động điền thông tin doanh nghiệp từ Customer Profile.
- **Gộp Đơn Lẻ Cuối Ngày:** Dành cho khách lẻ không lấy hóa đơn (đáp ứng TT 32/78).
- **Zalo OA Delivery:** Gửi HĐĐT tự động qua Zalo cho người mua.
- **AI Modules:** Cảnh báo NCC rủi ro, phân loại Inbound Invoice, Copilot Chat.

---

## 4. Roadmap Triển Khai (12 Tháng)

### 🟢 Q1: Compliance Foundation & Go-live Tối Thiểu
*Mục tiêu: Đạt chuẩn NĐ 70/2025 bảo vệ khách hàng POS khỏi án phạt.*
- Khởi tạo HĐĐT từ POS theo thời gian thực (Ký số HSM).
- Điều chỉnh / Thay thế hóa đơn (Bỏ hủy) và Mẫu 04/SS.
- Onboarding đăng ký mẫu 01/ĐKTĐ-HĐĐT.
- Tra cứu HĐĐT cho người mua qua bill POS.

### 🟡 Q2: Must-have Omnichannel & Hộ Kinh Doanh
*Mục tiêu: Chiến thắng tệp Online Sellers bằng thế mạnh tích hợp.*
- Tự động HĐĐT từ Shopee/TikTok Shop/Lazada.
- Xử lý tách voucher sàn trợ giá theo Luật QLT sửa đổi 2024.
- Nhúng sổ kế toán đơn giản theo TT 88/2021 cho Hộ Kinh Doanh.
- Hóa đơn cho đơn COD (chỉ phát hành khi shipper xác nhận giao thành công).

### 🟠 Q3: Weapon Features & Enterprise Play
*Mục tiêu: Chiếm tệp doanh nghiệp trung - cao (chuỗi >50 cửa hàng).*
- Hóa đơn cho Livestream (gom đơn chốt, xuất batch).
- AI cảnh báo sai thời điểm (cảnh báo realtime).
- API mở kết nối ngược về ERP (Bravo, Fast, MISA SME).
- Dashboard CFO (Đối soát POS - Sàn - HĐĐT).
- Multi-branch cho chuỗi nhiều MST.

### 🔴 Q4: Scale, AI & Moat
*Mục tiêu: Xây dựng rào cản phòng thủ với AI.*
- AI Copilot: Trợ lý giải thích hóa đơn cho thu ngân.
- Pre-Issue Validator & chống sai NCC đầu vào.
- Tích hợp đối soát Ngân hàng (Open API).
- Subscription/Recurring Invoice.

---

## 5. Chiến Lược Thị Trường (Battlecard Sales vs MISA)

| Phản hồi của Khách hàng | Kịch bản Counter-Objection của Haravan |
| :--- | :--- |
| **"MISA rẻ hơn, sao tôi phải dùng Haravan?"** | MISA thu phí theo số lượng hóa đơn + bán rời module. Haravan cung cấp theo subscription trọn gói tích hợp sẵn trong POS. Bán >1.000 đơn/tháng dùng Haravan rẻ hơn 30-50%. |
| **"Tôi bán Shopee/TikTok, dùng MISA được không?"** | MISA không có connector tự động, kế toán phải nhập tay và tự phân tách voucher sàn. Haravan tự lấy đơn và xử lý "Voucher Tax Splitter" trong nháy mắt. |
| **"MISA xử lý đổi trả hóa đơn rất tốt."** | MISA đòi hỏi kế toán phải biết luật để "điều chỉnh" hay "thay thế". Haravan sở hữu 1-Click Return-to-Invoice Engine: Bấm đổi trả đơn, hệ thống tự động xuất/điều chỉnh hóa đơn hợp quy, không cần kế toán thao tác. |
| **"Chuyển sang Haravan có mất dữ liệu cũ không?"** | Hệ thống cung cấp công cụ Import XML chuẩn TCT, bảo lưu dữ liệu 10 năm theo Điều 6 NĐ 123/2020. An tâm chuyển đổi không đứt gãy. |
| **"Chuỗi tôi có 50 cửa hàng dùng MISA SME."** | Tuyệt vời. Haravan Invoice có Open API đẩy ngược dữ liệu hóa đơn về MISA SME. Bạn dùng Haravan để bán hàng mượt, kế toán vẫn dùng MISA SME bình thường. |

---

*Tài liệu được khởi tạo và định hình chiến lược cho toàn bộ team Product & Engineering. Sẵn sàng kickoff phát triển các module cốt lõi (Theo Vibe Coding & Vibe Design prompts).*
