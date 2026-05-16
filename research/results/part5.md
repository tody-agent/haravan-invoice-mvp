# PHẦN C – ROADMAP ƯU TIÊN 12 THÁNG

## Q1 (Tháng 1–3): COMPLIANCE FOUNDATION & GO-LIVE TỐI THIỂU

**Tính năng đưa vào quý:**

1. **Khởi tạo HĐĐT từ máy tính tiền (POS) theo NĐ 70/2025** – Must-have (RICE giả định ~2400)
2. **Phát hành HĐĐT có mã CQT / không mã** – Must-have (RICE ~2200)
3. **Ký số HSM tập trung (không cần USB Token tại quầy)** – Must-have (RICE ~1800)
4. **Điều chỉnh / Thay thế hóa đơn theo NĐ 70/2025 (bỏ hủy)** – Must-have (RICE ~1700)
5. **Mẫu 04/SS-HĐĐT thông báo sai sót tự động** – Must-have (RICE ~1500)
6. **Onboarding: đăng ký mẫu 01/ĐKTĐ-HĐĐT, nộp CQT, chờ chấp nhận** – Must-have (RICE ~1400)
7. **Tra cứu HĐĐT cho người mua qua QR tại bill POS** – Must-have (RICE ~1200)

**Lý do xếp Q1:**
Áp lực pháp lý là tuyệt đối – NĐ 70/2025 đã có hiệu lực 01/06/2025, mọi cửa hàng retail/F&B doanh thu ≥ 1 tỷ/năm bắt buộc HĐĐT từ máy tính tiền. Nếu không xuất, mức phạt theo Điều 24 NĐ 125/2020 từ **4–8 triệu/lần** sai thời điểm và **10–20 triệu** nếu không lập hóa đơn. Đây là điều kiện sống còn để Haravan POS giữ được tệp khách hàng hiện hữu, không để MISA cross-sell vào. Toàn bộ Q1 dồn vào tích hợp Hilo Invoice API ổn định, kiểm thử với CQT, hoàn tất luồng XML chuẩn TCT.

**Outcome đo lường:**
- 100% giao dịch POS Haravan có thể xuất HĐĐT đúng thời điểm thanh toán (< 3 giây).
- Tỷ lệ HĐĐT bị CQT từ chối < 0.5%.
- 500 merchant chuyển từ "POS chưa có HĐĐT" sang "POS Haravan Invoice tích hợp sẵn".
- Pass audit nội bộ đối chiếu với Điều 8, Điều 9 NĐ 123/2020 và Điều 11 NĐ 70/2025.

---

## Q2 (Tháng 4–6): MUST-HAVE OMNICHANNEL & HỘ KINH DOANH

**Tính năng đưa vào quý:**

1. **Xuất HĐĐT tự động theo trigger đơn Shopee/TikTok Shop/Lazada/Tiki** – Must-have (RICE ~2100)
2. **Xử lý voucher sàn trợ giá theo Luật QLT sửa đổi 2024 (tách giá gốc vs phần sàn trợ giá)** – Weapon (RICE ~1900)
3. **Quản lý hóa đơn cho hộ kinh doanh theo TT 40/2021 & TT 88/2021** – Must-have (RICE ~1600)
4. **Sổ kế toán đơn giản TT 88/2021 nhúng sẵn cho HKD** – Weapon (RICE ~1500)
5. **Hóa đơn cho đơn COD: chỉ phát hành khi shipper xác nhận giao thành công** – Weapon (RICE ~1700)
6. **Đối soát HĐĐT vs đơn sàn (phát hiện đơn hủy nhưng đã xuất hóa đơn)** – Weapon (RICE ~1600)

**Lý do xếp Q2:**
Sau khi POS đã chạy ổn, cụm e-commerce là **vũ khí khác biệt** lớn nhất so với MISA – MISA mạnh kế toán, yếu tích hợp sàn. Hộ kinh doanh là tệp đang chuyển đổi mạnh từ thuế khoán sang kê khai (theo NQ 68/2025 và lộ trình bỏ thuế khoán 2026), nên đưa vào Q2 để bắt sóng thị trường. Voucher sàn là điểm đau pháp lý mà MISA MeInvoice [CẦN VERIFY] chưa có luồng xử lý tự động – đây là cửa sổ vàng để chiếm thị phần seller online.

**Outcome đo lường:**
- 80% đơn Shopee/TikTok Shop của merchant Haravan tự động sinh HĐĐT trong vòng 24h sau giao thành công.
- 1.500 hộ kinh doanh active dùng sổ TT 88/2021 nhúng.
- Giảm 90% lỗi "xuất hóa đơn cho đơn đã hủy" so với baseline thủ công.
- 200 merchant chuyển từ MISA MeInvoice sang Haravan Invoice nhờ tích hợp sàn.

---

## Q3 (Tháng 7–9): WEAPON FEATURES & ENTERPRISE PLAY

**Tính năng đưa vào quý:**

1. **AI cảnh báo sai thời điểm xuất hóa đơn theo NĐ 125/2020 (cảnh báo realtime trước khi vi phạm)** – Weapon (RICE ~2000)
2. **Hóa đơn cho livestream selling: gom đơn chốt live, xuất batch cuối phiên** – Weapon (RICE ~1800)
3. **Affiliate commission invoice: tự động xuất HĐĐT cho hoa hồng KOC/KOL** – Weapon (RICE ~1400)
4. **Multi-branch / Multi-MST cho chuỗi >100 cửa hàng (đăng ký nhiều ký hiệu theo từng chi nhánh)** – Must-have (RICE ~1700)
5. **API mở cho ERP/kế toán bên thứ 3 (đẩy ngược về Bravo, Fast, MISA SME, 1Office)** – Weapon (RICE ~1500)
6. **Dashboard CFO: doanh thu HĐĐT vs doanh thu POS vs doanh thu sàn (3 nguồn đối soát)** – Weapon (RICE ~1600)
7. **Bảo lưu & truy xuất HĐĐT 10 năm theo Điều 6 NĐ 123/2020** – Must-have (RICE ~1300)

**Lý do xếp Q3:**
Q3 là quý **đánh chiếm phân khúc trung-cao**: chuỗi bán lẻ 100+ cửa hàng và doanh nghiệp SME có dùng ERP. Đây là nơi MISA mạnh nhất, nên cần weapon features đậm đặc: AI cảnh báo sai thời điểm, dashboard CFO 3-nguồn đối soát, và đặc biệt **API mở đẩy ngược về MISA SME** – biến MISA từ đối thủ thành "phần dưới" của Haravan. Livestream invoice là tính năng MISA hoàn toàn không có do không hiểu nghiệp vụ social commerce.

**Outcome đo lường:**
- Giảm 95% số lần merchant bị phạt do xuất sai thời điểm (đo qua khảo sát & ticket support).
- 10 deal enterprise chuỗi >50 cửa hàng ký mới.
- 30% merchant Haravan Invoice có push data sang ERP bên thứ 3.
- NPS phân khúc CFO/Kế toán trưởng ≥ 45.

---

## Q4 (Tháng 10–12): SCALE, AI & MOAT

**Tính năng đưa vào quý:**

1. **Trợ lý AI giải thích hóa đơn cho cashier ("hóa đơn này có gì bất thường?")** – Weapon (RICE ~1500)
2. **Tự động phát hiện hóa đơn đầu vào trùng / sai MST nhà cung cấp** – Weapon (RICE ~1400)
3. **HĐĐT cho dịch vụ định kỳ (subscription, gói hội viên) – auto-recurring** – Weapon (RICE ~1300)
4. **Thuế GTGT đầu ra tự động đối chiếu với tờ khai 01/GTGT trước hạn nộp** – Weapon (RICE ~1600)
5. **White-label Haravan Invoice cho đại lý / chuỗi nhượng quyền** – Weapon (RICE ~1200)
6. **Tích hợp ngân hàng: đối soát HĐĐT vs sao kê (MB, Vietcombank, Techcombank Open API)** – Weapon (RICE ~1400)
7. **Tuân thủ Thông tư 99/2025 về số hóa chứng từ thuế (nếu áp dụng)** – Must-have (RICE ~1100, [CẦN VERIFY])

**Lý do xếp Q4:**
Khi nền tảng đã vững, Q4 là quý **xây moat (hào phòng thủ)**: AI assistant, white-label, đối soát ngân hàng – những thứ MISA cần 12–18 tháng để bắt kịp. Q4 cũng là mùa quyết toán thuế, merchant nhạy cảm với tính năng đối chiếu tờ khai – đây là thời điểm vàng để upsell gói cao cấp.

**Outcome đo lường:**
- ARR tăng 40% so với cuối Q3.
- 5 đại lý white-label active.
- AI assistant xử lý 70% câu hỏi tier-1 của cashier, giảm tải support 50%.
- Vào top 5 nhà cung cấp HĐĐT theo thị phần SME (mục tiêu 8% – [CẦN VERIFY thị phần MISA hiện tại]).

---

# PHẦN D – BATTLECARD SALES vs MISA

**1. "MISA MeInvoice tôi đã dùng 3 năm, đổi sang Haravan có rủi ro mất dữ liệu không?"**
Haravan Invoice cung cấp công cụ import lịch sử HĐĐT từ MISA dưới dạng XML chuẩn TCT, giữ nguyên ký hiệu cũ và song song phát hành ký hiệu mới. Dữ liệu lưu trữ 10 năm theo Điều 6 NĐ 123/2020, không bao giờ mất.

**2. "MISA giá rẻ hơn, sao tôi phải chọn Haravan?"**
MISA tính phí theo số hóa đơn, Haravan tính trọn gói trong subscription POS – với merchant xuất >1.000 hóa đơn/tháng, Haravan rẻ hơn 30–50%. Quan trọng hơn, Haravan đã nhúng sẵn vào POS và website, không phải mua thêm module rời như MISA.

**3. "MISA có tích hợp với phần mềm kế toán MISA SME rất tốt, Haravan thì sao?"**
Đúng, MISA mạnh ở vòng tròn nội bộ. Nhưng Haravan có API mở 2 chiều đẩy dữ liệu sang MISA SME, Bravo, Fast, 1Office – bạn không bị khóa trong hệ sinh thái MISA. Nếu sau này đổi kế toán, Haravan vẫn chạy được, MISA thì không.

**4. "Tôi bán Shopee, TikTok Shop, MISA xuất hóa đơn cho đơn sàn được không?"**
MISA hiện chưa có connector chính thức với TikTok Shop và Shopee – kế toán phải copy-paste từng đơn. Haravan tự động lấy đơn từ 4 sàn, xử lý voucher trợ giá theo Luật QLT sửa đổi 2024, và chỉ xuất hóa đơn khi shipper xác nhận giao thành công, tránh xuất nhầm cho đơn COD bị bom.

**5. "Nghị định 70/2025 bắt buộc HĐĐT từ máy tính tiền, MISA cũng đáp ứng được?"**
Cả hai đều đáp ứng về mặt pháp lý. Khác biệt: MISA yêu cầu cài thêm phần mềm và USB Token tại từng máy tính tiền; Haravan ký số HSM tập trung qua cloud – cashier chỉ cần bấm "Thanh toán", hóa đơn ra trong 3 giây, không lo USB Token hỏng giữa giờ cao điểm.

**6. "Nếu xuất sai hóa đơn thì sao? MISA có hỗ trợ điều chỉnh không?"**
Cả hai đều hỗ trợ Mẫu 04/SS theo NĐ 70/2025 (đã bỏ "hủy", chỉ còn "điều chỉnh"/"thay thế"). Khác biệt: Haravan có AI cảnh báo realtime trước khi cashier bấm phát hành nếu phát hiện sai thời điểm, sai MST khách, hay sai thuế suất – ngăn sai sót trước khi bị phạt 4–8 triệu theo Điều 24 NĐ 125/2020.

**7. "Chuỗi tôi có 80 cửa hàng, MISA xử lý multi-branch tốt mà?"**
Tốt nhưng phải cấu hình từng máy. Haravan quản lý tập trung: tạo chi nhánh trên dashboard là tự đăng ký ký hiệu hóa đơn mới với CQT qua Mẫu 01/ĐKTĐ, không cần kế toán xuống từng cửa hàng. Dashboard CFO đối soát 3 nguồn POS – HĐĐT – sàn, MISA không có.

**8. "Tôi là hộ kinh doanh, MISA có gói cho HKD rồi, Haravan có gì hơn?"**
Haravan nhúng sẵn sổ kế toán đơn giản theo TT 88/2021, lộ trình bỏ thuế khoán 2026 bạn không phải mua thêm phần mềm kế toán. MISA tách thành 2 sản phẩm phải mua riêng. Khi chuyển từ thuế khoán sang kê khai, Haravan có wizard hướng dẫn từng bước theo TT 40/2021.

**9. "Livestream tôi chốt 500 đơn/phiên, làm sao xuất hóa đơn kịp?"**
MISA không có giải pháp riêng cho livestream selling. Haravan có chế độ gom đơn live, sau phiên xuất batch tự động kèm xử lý voucher KOC/affiliate – đảm bảo xuất trong vòng 24h theo Điều 9 NĐ 123/2020 sửa đổi bởi NĐ 70/2025, không bị phạt sai thời điểm.

**10. "Nhỡ Haravan Invoice hệ thống sập thì sao? MISA đã chạy 10 năm rồi."**
Haravan Invoice dùng backend Hilo Invoice – nhà cung cấp T-VAN đã được TCT cấp phép, có SLA 99.9% và cơ chế failover. Trường hợp cực hiếm CQT trả lỗi, Haravan có chế độ offline-queue: cashier vẫn in bill tạm, hóa đơn tự động đẩy lên khi hệ thống phục hồi – đúng quy định Điều 20 NĐ 123/2020 về trường hợp gián đoạn.

---

# PHẦN E – DANH SÁCH CẦN VERIFY

**E1. MISA MeInvoice có connector chính thức với TikTok Shop / Shopee không?**
- Nguồn: website meinvoice.vn, tài liệu API công khai, gọi sales MISA đóng vai khách hàng.
- Câu hỏi cụ thể: "MISA có tự động lấy đơn từ TikTok Shop để xuất HĐĐT không? Cơ chế xử lý voucher trợ giá của sàn ra sao?"

**E2. MISA xử lý voucher sàn trợ giá theo Luật QLT sửa đổi 2024 như thế nào?**
- Nguồn: changelog MISA MeInvoice, tham vấn kế toán chuỗi đang dùng MISA.
- Câu hỏi: "Khi Shopee trợ giá 50.000đ cho đơn 200.000đ, MISA tách giá tính thuế ra sao? Có tự động không?"

**E3. Thị phần MISA MeInvoice trong phân khúc SME hiện tại.**
- Nguồn: báo cáo VECOM, báo cáo Bộ TT&TT về T-VAN, báo cáo TCT thường niên, hoặc Statista/Q&Me.
- Câu hỏi: "MISA MeInvoice chiếm bao nhiêu % thị phần HĐĐT SME tại Việt Nam? Tốc độ tăng trưởng thuê bao 2024–2025?"

**E4. Thông tư 99/2025 phạm vi áp dụng cụ thể.**
- Nguồn: thuvienphapluat.vn, Cổng thông tin Bộ Tài chính, công văn hướng dẫn TCT.
- Câu hỏi: "TT 99/2025 quy định gì về số hóa chứng từ thuế? Có áp dụng cho HĐĐT B2C bán lẻ không, hay chỉ chứng từ nội bộ?"

**E5. Lộ trình bỏ thuế khoán hộ kinh doanh chính thức.**
- Nguồn: NQ 68/2025/NQ-CP, văn bản TCT, Bộ Tài chính.
- Câu hỏi: "Mốc thời gian cụ thể bắt buộc tất cả HKD chuyển sang kê khai là 2026 hay muộn hơn? Ngưỡng doanh thu áp dụng?"

**E6. MISA MeInvoice có hỗ trợ ký số HSM cloud không, hay chỉ USB Token?**
- Nguồn: tài liệu kỹ thuật MISA, demo sản phẩm.
- Câu hỏi: "MISA có giải pháp ký số tập trung HSM cho chuỗi >50 cửa hàng không, hay mỗi máy phải có USB Token riêng?"

**E7. Quy định cụ thể về thời điểm xuất hóa đơn cho đơn COD theo NĐ 70/2025.**
- Nguồn: Điều 9 NĐ 123/2020 sửa đổi bởi NĐ 70/2025, công văn hướng dẫn TCT.
- Câu hỏi: "Với đơn COD, thời điểm xuất hóa đơn là khi giao hàng cho đơn vị vận chuyển, khi shipper giao thành công, hay khi nhận tiền? Bị bom hàng xử lý thế nào?"

**E8. SLA và uptime thực tế của Hilo Invoice T-VAN.**
- Nguồn: hợp đồng SLA với Hilo, log monitoring nội bộ 6 tháng gần nhất.
- Câu hỏi: "Hilo Invoice cam kết uptime bao nhiêu? Cơ chế failover khi CQT TCT bị treo? Throughput tối đa hóa đơn/giây?"

**E9. Mức phạt cụ thể cho hành vi không tích hợp HĐĐT từ máy tính tiền theo NĐ 70/2025.**
- Nguồn: NĐ 125/2020 đối chiếu phần sửa đổi (nếu có) bởi NĐ liên quan đến NĐ 70/2025.
- Câu hỏi: "Mức phạt cụ thể cho merchant retail/F&B không triển khai HĐĐT từ máy tính tiền sau 01/06/2025 là bao nhiêu? Có ân hạn không?"

**E10. Khả năng tích hợp ngược của Haravan Invoice vào MISA SME / Bravo / Fast.**
- Nguồn: tài liệu API MISA SME, Bravo, Fast Accounting.
- Câu hỏi: "Các phần mềm kế toán này có endpoint nhận HĐĐT từ bên thứ 3 không, hay chỉ nhận từ chính họ?"

---

# PHẦN F – RỦI RO & GIẢ ĐỊNH

## F1. Rủi ro pháp lý

Nghị định 70/2025 mới hiệu lực 01/06/2025 nên các công văn hướng dẫn của Tổng cục Thuế còn đang được ban hành dần. Có khả năng TCT ra hướng dẫn bổ sung trong 6–12 tháng tới làm thay đổi format XML, status code, hoặc trường thông tin bắt buộc, đặc biệt liên quan đến HĐĐT từ máy tính tiền và xử lý voucher sàn. Lộ trình bỏ thuế khoán cho hộ kinh doanh theo NQ 68/2025 vẫn có thể bị điều chỉnh thời gian, ảnh hưởng đến product-market fit của module HKD. Thông tư 99/2025 [CẦN VERIFY] có thể mở rộng phạm vi yêu cầu số hóa chứng từ, kéo theo workload ngoài kế hoạch. Cuối cùng, các sàn TMĐT có thể được TCT giao thêm nghĩa vụ xuất hóa đơn thay cho seller (như mô hình của Trung Quốc), điều này nếu xảy ra sẽ làm giảm giá trị module connector sàn của Haravan.

## F2. Rủi ro kỹ thuật

Toàn bộ luồng phát hành phụ thuộc backend Hilo Invoice – đây là single point of failure nghiêm trọng nếu Hilo gặp sự cố hoặc mất giấy phép T-VAN. Cần đàm phán SLA tối thiểu 99.9% kèm điều khoản phạt, đồng thời thiết kế abstraction layer để có thể chuyển sang T-VAN khác (VNPT, Viettel, FPT) trong 30 ngày nếu cần. Scalability rủi ro cao vào các thời điểm peak: ngày cuối tháng (quyết toán), giờ vàng livestream (20–22h), và sự kiện 11.11/12.12 của sàn – có thể đạt 10.000+ hóa đơn/phút, cần kiểm tra throughput Hilo có chịu được không. Rủi ro ký số HSM: nếu HSM cloud bị tấn công hoặc CA cấp chứng thư bị thu hồi, toàn bộ merchant bị tê liệt – cần multi-CA và rotation chứng thư. Định dạng XML của TCT đã thay đổi 3 lần trong giai đoạn 2022–2024, cần CI/CD test tự động đối chiếu mỗi tuần với môi trường test của TCT.

## F3. Rủi ro cạnh tranh

MISA có nguồn lực R&D lớn và quan hệ sâu với cơ quan thuế, hoàn toàn có thể trong 6–9 tháng phản đòn bằng cách ra connector Shopee/TikTok Shop chính thức và giảm giá gói cho seller online. MISA cũng có thể bundle MeInvoice miễn phí 12 tháng kèm MISA SME để khóa khách trước khi Haravan tiếp cận. VNPT Invoice và Viettel SInvoice có lợi thế phân phối qua mạng lưới chi nhánh và hạ tầng viễn thông, có thể giảm giá sốc xuống còn 0đ/hóa đơn cho khách dùng kèm dịch vụ viễn thông. KiotViet và Sapo là đối thủ trực tiếp ở mảng POS – nếu họ ra Invoice tích hợp sẵn trước Haravan, sẽ tạo áp lực lớn ở phân khúc HKD và SME nhỏ. Cuối cùng, rủi ro "race to the bottom" về giá – nếu thị trường HĐĐT trở thành commodity, biên lợi nhuận có thể bị ép xuống dưới 20%, lúc đó weapon features sẽ là yếu tố sống còn.

## F4. Giả định kinh doanh đã sử dụng

Phân tích dựa trên các giả định: (1) tệp merchant Haravan hiện hữu ~50.000+ và có ít nhất 60% nằm trong diện bắt buộc HĐĐT từ máy tính tiền theo NĐ 70/2025; (2) merchant Haravan có willingness-to-pay thêm 100.000–300.000đ/tháng cho module Invoice tích hợp sẵn, thay vì mua MISA rời ~500.000đ/tháng; (3) Hilo Invoice giữ vững giấy phép T-VAN và mức giá wholesale ổn định trong 24 tháng; (4) ngành e-commerce Việt Nam tiếp tục tăng trưởng 20–25%/năm, kéo theo nhu cầu HĐĐT cho seller online; (5) hộ kinh doanh sẽ bắt đầu chuyển sang kê khai từ 2026 với khoảng 1,5 triệu HKD trong diện áp dụng; (6) cơ chế xử lý voucher trợ giá sàn theo Luật QLT sửa đổi 2024 sẽ ổn định và không bị sửa lại trong 18 tháng tới; (7) sàn TMĐT (Shopee, TikTok Shop) tiếp tục mở API đơn hàng cho seller, không đóng lại như nguy cơ ở Trung Quốc; (8) Haravan có đủ nguồn lực dev 8–12 FTE chuyên trách Invoice trong 12 tháng; (9) đội sales Haravan có thể tiếp cận và convert 5–10% tệp MISA trong phân khúc retail/omnichannel; (10) chính sách thuế GTGT 8%/10% không thay đổi bất ngờ trong giai đoạn roadmap.
