# 06 — Wizard xử lý sai sót (5 step, NĐ 70/2025)

> **Cách dùng:** Paste prompt để generate `correction-wizard.html`. Wizard này là điểm enforcement compliance NĐ 70/2025 quan trọng — UI phải tuyệt đối không cho "Hủy".

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01) + App Shell (02).

Task: Generate `correction-wizard.html` — wizard 5 bước xử lý sai sót theo NĐ 70/2025 + TT 32/2025.

⚠️ COMPLIANCE-CRITICAL: NĐ 70/2025 đã bỏ thủ tục "Hủy hóa đơn". Wizard CHỈ đề xuất
"Điều chỉnh" hoặc "Thay thế". KHÔNG được render bất kỳ option/button nào nói "Hủy".

═══════════════════════════════════════════
PERSONA + JTBD

Persona: Kế toán.
JTBD: "Khi tôi hoặc khách phát hiện hóa đơn sai (sai MST, sai tên, sai tiền, sai thuế suất...),
tôi muốn hệ thống chỉ đúng nghiệp vụ — điều chỉnh hay thay thế — và sinh biên bản nhanh,
không phải tra Thông tư."

═══════════════════════════════════════════
PAGE HEADER

Breadcrumb: Hóa đơn › Xử lý sai sót › HĐ-2026-0142
H1: "Xử lý sai sót — HĐ-2026-0142"
Subtitle: "Phát hành 02/05/2026 · Cà phê Trung Nguyên Legend → Công ty TNHH Vinamilk · 12.450.000 ₫"
Right actions:
- Button text "Đóng wizard" (chỉ thoát flow, không hủy HĐ)

═══════════════════════════════════════════
STEPPER (top, full width)

5 step horizontal, indicator current + done state:
1. ✓ Xác định lỗi sai
2. ◉ Chọn nghiệp vụ (current)
3. ◯ Nhập thông tin mới
4. ◯ Biên bản xác nhận
5. ◯ Phát hành & gửi CQT

Style: numbered circle + label below, line connector. Current = primary fill. Done = success
fill ✓. Pending = muted outline.

Render trang này tập trung Step 2 (decision tree) như default view, có toggle 5 step để demo.

═══════════════════════════════════════════
STEP 1 — Xác định lỗi sai

Layout: card center 720px max width

Hỏi: "Phát hiện lỗi gì trong hóa đơn HĐ-2026-0142?"

Multi-select checkbox grid 2 col:
- ☐ Sai MST người mua
- ☐ Sai tên người mua / tên đơn vị
- ☐ Sai địa chỉ người mua
- ☐ Sai tên hàng hóa, dịch vụ
- ☐ Sai số lượng
- ☐ Sai đơn giá
- ☐ Sai chiết khấu
- ☐ Sai thuế suất
- ☐ Sai tổng tiền (do tính sai)
- ☐ Khác (nhập text)

Field "Mô tả thêm" textarea (optional).

Section "Phát hiện bởi":
- Radio: Tôi tự phát hiện / Khách hàng phản ánh / CQT từ chối (mã từ chối auto detect)

Footer: button outline "Quay lại" + button primary "Tiếp tục"

═══════════════════════════════════════════
STEP 2 — Decision tree → Đề xuất nghiệp vụ (current default render)

Layout: card center 720px max width

Top: callout box info background --hv-info-soft
- Icon ti-info-circle
- "Dựa trên lỗi bạn đã chọn (Sai MST khách + Sai địa chỉ) và trạng thái HĐ (Đã có ID Hilo, CQT đã chấp nhận), Copilot đề xuất:"

Card đề xuất chính (variant success border):
- Title H2 "Điều chỉnh thông tin"
- Reference: badge "Theo NĐ 70/2025 §7 + TT 32/2025 §5.2"
- Body explain text: "Hóa đơn đã được CQT chấp nhận, sai sót thuộc về thông tin người mua → bạn cần phát hành HĐ điều chỉnh (không phát hành mới hoàn toàn). Hóa đơn gốc vẫn còn hiệu lực, HĐ điều chỉnh là hóa đơn bổ sung."
- 3 dòng lưu ý:
  * "✓ Cần lập biên bản điều chỉnh (Bước 4) có chữ ký 2 bên"
  * "✓ Gửi cả 2 hóa đơn (gốc + điều chỉnh) cho khách"
  * "✓ Báo cáo CQT trong kỳ kê khai tiếp theo"
- Button primary lớn "Chọn nghiệp vụ này"

Card đề xuất phụ (variant secondary border, collapsed):
- Title H3 "Thay thế hóa đơn"
- Reference: badge "Theo NĐ 70/2025 §7"
- Body short: "Phát hành HĐ mới thay thế HĐ gốc. HĐ gốc bị 'thay thế' (không hủy). Áp dụng khi lỗi sai nghiêm trọng hoặc nhiều mục cùng sai."
- Button text "Chọn nghiệp vụ này"
- Link "So sánh điều chỉnh vs thay thế →"

KHÔNG có card "Hủy hóa đơn".

Bottom callout warning soft:
- Icon ti-alert-triangle
- "Lưu ý: NĐ 70/2025 (hiệu lực 01/06/2025) đã BỎ thủ tục hủy hóa đơn. Mọi sai sót phải xử lý qua điều chỉnh hoặc thay thế."

Footer: button outline "Quay lại Step 1" + button primary disabled "Tiếp tục" (enable khi chọn 1 card)

═══════════════════════════════════════════
STEP 3 — Nhập thông tin mới

Layout: 2 cột so sánh

Cột trái: "HĐ gốc HĐ-2026-0142" (disabled, gray bg)
- Render tóm tắt thông tin người mua
- Hightlight field sai (border đỏ + icon ⚠)

Cột phải: "HĐ điều chỉnh — Thông tin mới" (editable)
- Form same shape nhưng editable
- Field highlight đỏ (cần sửa): MST + Địa chỉ
- Field disabled (giữ nguyên): tên hàng, số lượng, đơn giá, thuế

Below form:
- Toggle "Hiển thị diff" → highlight chữ thay đổi style git-diff

Footer: outline "Quay lại" + primary "Tạo biên bản"

═══════════════════════════════════════════
STEP 4 — Biên bản xác nhận

Layout: card với preview biên bản trái + form right

Preview biên bản (giấy A4 thu nhỏ):
- Tiêu đề "BIÊN BẢN ĐIỀU CHỈNH HÓA ĐƠN ĐIỆN TỬ"
- "Số: BB/0142-2026 ngày 16/05/2026"
- Section "Bên A — Người bán" + thông tin Trung Nguyên Legend
- Section "Bên B — Người mua" + thông tin Vinamilk
- Section "Lý do điều chỉnh" — auto fill từ Step 1
- Section "Nội dung điều chỉnh" — bảng before/after
- 2 vùng ký số bên dưới

Form bên phải:
- Field "Số biên bản": auto gen
- Field "Lý do điều chỉnh": textarea pre-fill (editable)
- Toggle "Gửi yêu cầu ký số cho khách qua Zalo OA" ON
- Toggle "Tải template Word để in giấy" OFF
- Note: "Khi cả 2 bên ký số xong, HĐ điều chỉnh mới được phát hành CQT"

Footer: outline "Quay lại sửa thông tin" + primary "Gửi biên bản chờ ký"

═══════════════════════════════════════════
STEP 5 — Phát hành & gửi CQT

Layout: timeline vertical

5 milestone, mỗi milestone status:
1. ✓ Biên bản đã được gửi cho khách hàng — 16/05 14:32
2. ✓ Khách hàng đã ký số biên bản — 16/05 14:40 (mock pending state cho variant)
3. ◉ HĐ điều chỉnh đang phát hành qua Hilo... (spinner pulse)
4. ◯ Chờ CQT cấp mã
5. ◯ Hoàn tất + thông báo khách

Side panel right:
- Card "HĐ điều chỉnh sắp phát hành" với tóm tắt thông tin mới
- Card "Sau khi hoàn tất" với:
  * "✓ HĐ gốc 0142 chuyển trạng thái Đã điều chỉnh"
  * "✓ HĐ điều chỉnh 0186 phát hành mới"
  * "✓ Khách nhận cả 2 HĐ qua email + Zalo"
  * "✓ Audit log ghi đầy đủ + báo cáo CQT trong kỳ kê khai"

Footer: button outline disabled "Quay lại" + button primary "Phát hành ngay" (sau khi step 2 done)

═══════════════════════════════════════════
STATE COVERAGE

- Default: render Step 2 (decision tree đã chốt option Điều chỉnh)
- Toggle góc dưới chuyển 5 step
- State error step 5: HĐ điều chỉnh bị CQT từ chối → banner đỏ + button "Mở wizard lần 2"

═══════════════════════════════════════════
ACCEPTANCE — Compliance critical

- KHÔNG có bất kỳ chữ "Hủy hóa đơn" nào trong UI
- Mọi reference văn bản đúng: NĐ 70/2025 §7, TT 32/2025 §5.2, NĐ 123 §10
- Decision tree Step 2 chỉ có 2 option (Điều chỉnh / Thay thế)
- Bottom callout Step 2 explicit nêu "NĐ 70/2025 đã BỎ thủ tục hủy"
- Stepper 5-step rõ ràng, current state highlight
- Biên bản preview có đủ 2 vùng ký số (NĐ 70 yêu cầu)
- Mock data: HĐ-2026-0142 Trung Nguyên → Vinamilk
- Dark mode pass

═══════════════════════════════════════════
OUTPUT

Trả 1 file HTML. Header comment:

<!--
  Generated from: vibe_design_prompts/06_correction_wizard.md
  Screen: Wizard xử lý sai sót 5 step (NĐ 70/2025)
  Persona: Kế toán
  JTBD: System chỉ đúng nghiệp vụ điều chỉnh/thay thế, sinh biên bản
  Compliance: NĐ 70/2025 + TT 32/2025 — KHÔNG có option Hủy
  States: 5 step + error CQT reject
-->

Sau artifact, list:
- Verify count "Hủy" string = 0 trong file (chỉ phép có ở context "Đóng wizard"/"Hủy thao tác")
- Reference văn bản pháp luật chính xác
- Stepper rõ + biên bản preview đầy đủ
```

---

## Variants

- **Variant CQT-reject entry:**
  "Khi user đến từ HĐ bị CQT từ chối (mã từ chối auto detect), Step 1 pre-fill lỗi từ CQT response, Step 2 đề xuất 'Thay thế' thay vì điều chỉnh."

- **Variant nhiều HĐ cùng lỗi:**
  "Bulk wizard: chọn 10 HĐ cùng lỗi (vd MST khách bị đổi), wizard apply 1 lần cho tất cả, biên bản batch."
