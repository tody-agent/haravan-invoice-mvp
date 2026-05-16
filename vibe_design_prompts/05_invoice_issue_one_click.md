# 05 — Phát hành hóa đơn 1-click (POS / Web / Admin)

> **Cách dùng:** Paste prompt để generate `invoice-issue.html`. RICE #1 — feature có RICE cao nhất, defining moment cho UX khác biệt với MISA/Viettel.

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01) + App Shell (02).

Task: Generate `invoice-issue.html` — màn hình phát hành hóa đơn mới với auto-fill MST,
pre-flight check 9 rule, routing T-VAN, AI gợi ý.

Đây là RICE #1 (68.400) — phải thiết kế đẹp nhất, không compromise.

═══════════════════════════════════════════
PERSONA + JTBD + 3 CONTEXT

Persona ưu tiên: Kế toán (Web/Admin), Thu ngân POS.
JTBD: "Khi tôi cần phát hành hóa đơn, tôi muốn 1 click là xong — dùng tối đa dữ liệu có sẵn,
không nhập lại MST/địa chỉ/SP đã có."

3 trigger context (skin theo URL param ?source=):
- ?source=web — từ đơn hàng Web (default — render trong prompt này)
- ?source=pos — từ Hararetail POS (touch optimize)
- ?source=admin — phát hành tay từ Admin (manual, không có context order)

Prompt này tập trung WEB. POS/Admin có thể inherit nhưng nhấn "Variant" cuối.

═══════════════════════════════════════════
PAGE HEADER

Breadcrumb: Hóa đơn › Phát hành mới
H1: "Phát hành hóa đơn mới"
Subtitle: "Từ đơn hàng #HRV-2026-0184 — Cà phê Trung Nguyên Legend Q1"
  (subtitle thay đổi theo source)
Right actions:
- Button text "Hủy" (ti-x) — chỉ hủy quá trình, KHÔNG hủy hóa đơn (clarify tooltip "Bỏ qua, không lưu")
- Button outline "Lưu bản nháp" (ti-bookmark)
- Button primary disabled "Phát hành" (sẽ enable khi 9 rule pass)

═══════════════════════════════════════════
LAYOUT 2 CỘT (8/4)

Cột trái 8-col: form chính
Cột phải 4-col sticky: rail pre-flight + AI suggest + delivery preview

═══════════════════════════════════════════
CỘT TRÁI — Form chính

Card 1 — "Người mua" (collapsed default false)

Header: H3 "Người mua" + badge "Tự động điền từ đơn hàng" + button ghost "Đổi khách hàng"

Body row 1:
- Customer search input full width — placeholder "Tìm MST, tên, SĐT khách hàng..."
- Khi gõ → dropdown gợi ý 5 khách mới nhất + button "Thêm khách mới ⊕"
- Selected state: card khách hàng inline với:
  * Tên DN + MST mono + badge "Verified 30 ngày trước"
  * Icon ti-circle-check màu success bên cạnh MST
  * Address text-secondary
  * Email + phone (PII redact)
  * Button text "Xóa" ti-x

Body row 2 (2 col):
- Field "Hình thức HĐ": radio segment "Doanh nghiệp" (selected) / "Cá nhân"
- Field "Email người nhận": pre-fill từ customer

Body row 3 (3 col):
- "Mã số thuế": input mono pre-filled, có badge "Verified" success
- "Tên đơn vị": pre-filled disabled
- "Địa chỉ": pre-filled disabled

Body row 4:
- Toggle switch "Gửi email tự động sau khi phát hành" ON
- Toggle switch "Gửi Zalo OA cho SĐT 09**1234" OFF
- Note caption: "Zalo OA chỉ active khi đã kết nối — Phase 2"

═══════════════════════════════════════════
Card 2 — "Hàng hóa, dịch vụ"

Header: H3 "Hàng hóa, dịch vụ" + button outline "Thêm dòng ⊕" + dropdown "Import từ đơn hàng ▾"

Body — table line items:
Cột: # | Tên hàng hóa | ĐVT | Số lượng | Đơn giá | % CK | Thuế suất | Thành tiền | (xóa)

5 row mock (từ đơn Trung Nguyên Legend):
1. Cà phê Trung Nguyên Legend Robusta 500g | Hộp | 12 | 185.000 | 0% | 10% | 2.220.000
2. Cà phê G7 3in1 18 gói | Hộp | 24 | 95.000 | 5% | 10% | 2.166.000
3. Cà phê Trung Nguyên I Coffee 100% Arabica 250g | Hộp | 6 | 280.000 | 0% | 10% | 1.680.000
4. Đường ăn kiêng Stevia 200g | Gói | 10 | 65.000 | 0% | 8% | 650.000
5. Phụ thu vận chuyển | Lần | 1 | 30.000 | 0% | KCT | 30.000

Row controls inline:
- Tên hàng có dropdown gợi ý product từ Haravan catalog
- Thuế suất dropdown: 0%, 5%, 8%, 10%, KCT (không chịu thuế), KKKNT (không kê khai nộp thuế)
- Số lượng + đơn giá → auto-calc thành tiền

Footer table — Summary section right-aligned:
- Tiền hàng: 6.776.000 ₫
- Chiết khấu: -108.300 ₫
- Tiền thuế GTGT 8%: 52.000 ₫
- Tiền thuế GTGT 10%: 600.770 ₫
- Total bold lớn: Tổng cộng 7.320.470 ₫

═══════════════════════════════════════════
Card 3 — "Thông tin phát hành"

Body grid 2 col:
- "Ngày lập hóa đơn": date picker default today
- "Hình thức thanh toán": dropdown Tiền mặt / Chuyển khoản / Thẻ / COD (default Chuyển khoản)
- "Ghi chú": textarea 2 row
- "Người ký": dropdown user roles (default current user)
- "Mẫu hóa đơn": dropdown template (default "01GTKT0/001")
- "Ký hiệu hóa đơn": mono badge "1C26TAA" disabled (auto theo registration)

Section "T-VAN routing":
- Radio segment "Hilo" (selected, badge "Active · 8.234 HĐ còn lại")
- 4 placeholder disabled: Viettel SInvoice / VNPT / MISA / EFY (badge "Phase 4")

═══════════════════════════════════════════
CỘT PHẢI — Rail (sticky top)

═══════════════════════════════════════════
Panel 1 — Pre-flight check (9 rule)

Card với header "Kiểm tra trước khi phát hành" + counter "8/9 ✓" + 1 warning

List 9 rule, mỗi rule:
- Icon status: ✓ success / ⚠ warning / ✕ danger
- Tên rule (text-strong)
- Reference: caption "NĐ 123 §X.Y" — link click expand giải thích

9 rule:
1. ✓ MST khách hàng hợp lệ — NĐ 123 §10
2. ✓ MST đã verify trong 30 ngày — Best practice
3. ✓ Tổng tiền > 0 — NĐ 123 §7
4. ✓ Có ít nhất 1 dòng hàng hóa — NĐ 123 §7
5. ✓ Thuế suất hợp lệ trên mọi dòng — TT 32 §3
6. ⚠ Đơn hàng có sản phẩm chiết khấu — Cảnh báo: nếu chiết khấu thương mại, kiểm tra biên bản kèm — TT 32 §5.4
7. ✓ Người ký có chứng thư số còn hạn — NĐ 70/2025 §5
8. ✓ Ngày lập trong kỳ thuế hiện tại — NĐ 123 §9
9. ✓ Mẫu/ký hiệu hóa đơn đã đăng ký với CQT — QĐ 1510

Footer panel: text "Bạn vẫn có thể phát hành với 1 cảnh báo. AI khuyến nghị xem lại."

═══════════════════════════════════════════
Panel 2 — AI Copilot suggest (collapsible)

Card với icon ti-sparkles + "Copilot gợi ý"

3 suggest item:
1. "💡 Khách này thường nhận HĐ qua email + Zalo. Bật cả 2 kênh?" — button "Áp dụng"
2. "📊 Trong 30 đơn gần đây của Trung Nguyên Legend, 28 đơn có thuế suất 10% — đúng pattern."
3. "⚠ Đơn hàng có mặt hàng 'Phụ thu vận chuyển' — kiểm tra có cần tách hóa đơn riêng không (TT 32/2025)" — link "Xem hướng dẫn"

═══════════════════════════════════════════
Panel 3 — Delivery preview (preview xem khách nhận gì)

Card preview email mock thu nhỏ:
- Subject: "Hóa đơn 2026-0184 từ Cà phê Trung Nguyên Legend"
- Body sketch: logo + số HĐ + tổng tiền + button "Tải PDF" + button "Tra cứu trên Portal"
- Tab switch "Email / Zalo OA / Portal link"

═══════════════════════════════════════════
Panel 4 — Action (sticky bottom)

- Button outline width-full "Lưu nháp"
- Button primary width-full "Phát hành" (chỉ enable khi rule pass đủ điều kiện)
  * Có loading spinner state khi click
  * Tooltip nếu disabled: "Cần resolve 0 cảnh báo bắt buộc"

═══════════════════════════════════════════
SUCCESS MODAL (post-issue)

Sau khi click "Phát hành" và mock 2s loading → modal centered hiển thị:

- Icon ti-circle-check success lớn
- Title "Phát hành thành công!"
- Subtitle "Hóa đơn HĐ-2026-0185 đã gửi CQT lúc 14:47 — đã nhận mã CQT C26XYZABC123"
- Section "Đã gửi cho khách":
  * ✓ Email — sent
  * ✓ Zalo OA — sent
  * ✓ Portal link — https://portal.haravan-invoice.dev/p/abc123xyz
- 3 button row:
  * "Xem chi tiết" (outline)
  * "Tải PDF" (outline)
  * "Phát hành tiếp" (primary)

═══════════════════════════════════════════
STATE COVERAGE (toggle)

1. Default (filled từ order Web mock)
2. Empty source=admin (form trống, no customer pre-fill)
3. Loading sau khi click Phát hành (button spinner + form disabled)
4. Error CQT từ chối (banner đỏ + lý do "Sai MST khách" + button "Mở wizard sai sót")
5. Pre-flight fail (3 rule fail) — Phát hành button disabled

═══════════════════════════════════════════
ACCEPTANCE

- Đúng shell 02
- 3 card form + 4 panel rail layout 8/4
- 9 rule pre-flight đầy đủ với reference NĐ/TT/QĐ
- KHÔNG có button "Hủy hóa đơn" trong success modal hay form
- KHÔNG có option "Hủy" trong T-VAN routing
- AI panel có 3 suggest realistic
- Mock data Trung Nguyên Legend với 5 line items
- VND format dấu chấm, mono font cho tiền + MST + invoice ID + CQT code
- Success modal cover delivery channel (Email/Zalo/Portal)
- Dark mode pass

═══════════════════════════════════════════
OUTPUT

Trả 1 file HTML. Header comment:

<!--
  Generated from: vibe_design_prompts/05_invoice_issue_one_click.md
  Screen: Phát hành hóa đơn 1-click (Web source)
  Persona: Kế toán + Thu ngân POS
  JTBD: 1 click phát hành, dùng tối đa data có sẵn
  RICE: #1 (68.400) — must-have flagship feature
  States: default-filled / empty-admin / loading / error-cqt-reject / preflight-fail
-->

Sau artifact, list:
- Rule pre-flight render đủ 9
- Success modal có đủ 3 channel delivery
- Đề xuất Variant POS (cuối)
- A/B: form 1-col stack vs 8/4 split
```

---

## Variants

- **POS skin (?source=pos):**
  "Variant POS Hararetail: bỏ search customer (assume KH có sẵn từ POS context), tăng touch target ≥44px, form 1-col stack, rail pre-flight thu thành bottom sheet, success modal full-screen với QR code link."

- **Admin manual (?source=admin):**
  "Variant Admin: empty customer, không có context order, form full manual với product picker tự do, không có AI suggest đơn-specific."

- **Bulk issue:**
  "Variant Bulk: thay form 1 HĐ thành table 30 dòng draft, button 'Phát hành tất cả' với progress bar background job."
