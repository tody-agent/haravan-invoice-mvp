# 10 — Customer Portal & Delivery flow

> **Cách dùng:** Paste prompt để generate `customer-portal.html` + email/Zalo template. Persona: Khách hàng cuối (B2B + B2C). Mobile-first.

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01).

Lưu ý: Customer Portal KHÔNG nhúng trong app shell merchant (02) — đây là public-facing portal cho
khách hàng cuối, route `/p/:token`. Style đơn giản hơn, mobile-first, ít nav.

Task: Generate 3 file HTML:
1. `customer-portal-lookup.html` — landing tra cứu hóa đơn
2. `customer-portal-invoice.html` — chi tiết 1 hóa đơn
3. `email-template-invoice.html` — email template merchant gửi khách

═══════════════════════════════════════════
PERSONA + JTBD

Persona: Khách hàng cuối (B2C cá nhân + B2B kế toán bên khách)
JTBD:
- "Khi tôi nhận email/Zalo có link hóa đơn, tôi muốn xem nội dung + tải PDF nhanh, không phải đăng ký tài khoản"
- "Khi tôi cần ký xác nhận biên bản điều chỉnh, tôi muốn ký số dễ qua điện thoại (CCCD chip / VNeID / SMS OTP)"
- "Khi tôi mất link, tôi muốn tra cứu lại bằng mã HĐ + MST/SĐT"

Device: Mobile 375px primary, tablet, desktop fallback.

═══════════════════════════════════════════
SHARED HEADER (cho 2 file portal)

Top bar mỏng (48px):
- Logo placeholder "haravan invoice" trái
- Right: language switch "VI / EN" + dark mode toggle + button "Đăng ký gói cho doanh nghiệp tôi" (CTA upsell ẩn cho B2B prospect)

KHÔNG có sidebar/nav phức tạp.

═══════════════════════════════════════════
FILE 1 — customer-portal-lookup.html

Layout: center max-width 480px, vertical stack, padding 24px.

Hero section:
- H1 "Tra cứu hóa đơn"
- Subtitle text-secondary "Nhập thông tin để tìm hóa đơn của bạn"

Tabs 3 method:
- Có mã + MST (default)
- Có link/QR
- Email/SĐT nhận

Tab "Có mã + MST" (default form):
- Input "Số hóa đơn" placeholder "HĐ-2026-0184"
- Input "Mã số thuế người mua" placeholder "0312345678"
- Turnstile widget placeholder (Cloudflare bot challenge)
- Button primary width-full "Tra cứu"

Tab "Có link/QR":
- Input "Dán link hoặc mã tra cứu" placeholder "p.haravan-invoice.dev/p/..."
- Button "Mở camera quét QR" outline (mobile only)

Tab "Email/SĐT":
- Input "Email hoặc SĐT nhận hóa đơn"
- Note: "Hệ thống sẽ gửi OTP để xác minh"
- Button "Gửi OTP" primary

Section dưới form:
- Box info: "🔒 Truy cập hóa đơn được giới hạn theo NĐ 123/2020. Chỉ người nhận hợp lệ mới xem được nội dung đầy đủ."
- Footer: link "Liên hệ hỗ trợ" + "Chính sách quyền riêng tư" + "© 2026 Haravan Invoice"

═══════════════════════════════════════════
FILE 2 — customer-portal-invoice.html

Layout: 2 zone — Top summary card + Bottom action

Top header strip (sticky):
- Logo merchant nhỏ + tên "Cà phê Trung Nguyên Legend"
- Số HĐ mono lớn "HĐ-2026-0184" + badge trạng thái "✓ Đã CQT chấp nhận"

Summary card lớn:
- Section "Người bán" (compact, gray):
  * "Công ty TNHH Cà phê Trung Nguyên Legend"
  * MST 0312345678
  * 12 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM
- Section "Người mua":
  * "Công ty TNHH Vinamilk"
  * MST 0301234567
- Section "Tổng cộng" — bảng tax breakdown
- Section "Mã CQT": mono "C26XYZABC123" + button copy + badge "Verified by CQT"

Action row (sticky bottom):
- Button primary width 50% "Tải PDF" (ti-file-download)
- Button outline width 50% "Lưu Apple Wallet / Google Wallet" — chỉ mobile

Section "Hành động":
- Accordion expandable, 3 item:
  1. "Yêu cầu điều chỉnh" — form lý do + button submit → trigger wizard sai sót bên merchant
  2. "Báo nhầm hóa đơn này không phải của tôi" — confirmation flow
  3. "Tải XML pháp lý từ CQT" — link cấp thông qua Hilo public lookup

Section "Lịch sử":
- Timeline mini:
  * "02/05/2026 14:32 — Phát hành"
  * "02/05/2026 14:33 — CQT chấp nhận"
  * "02/05/2026 14:34 — Gửi email tới user@vinamilk.vn"
  * "02/05/2026 14:40 — Đã mở email"

Section signing (nếu HĐ này là biên bản chờ ký — variant):
- Card warning soft
- "Bạn được mời ký số biên bản điều chỉnh BB-0142-2026"
- 3 button method:
  * "Ký bằng CCCD chip / NFC" (primary)
  * "Ký bằng VNeID" (outline)
  * "Ký qua OTP SMS" (outline)
- Note: "Sau khi ký, HĐ điều chỉnh sẽ được phát hành chính thức"

Footer: link "Liên hệ Trung Nguyên Legend nếu thắc mắc" + "© 2026 Haravan Invoice — phiên bản beta"

═══════════════════════════════════════════
FILE 3 — email-template-invoice.html

Template email HTML để merchant gửi khách (chỉ inline CSS, table layout email-safe).

Subject ví dụ: "Hóa đơn HĐ-2026-0184 từ Cà phê Trung Nguyên Legend"

Body layout (max width 600px, center):

1. Header banner (background --hv-primary-soft, padding 32px):
   - Logo merchant + tagline
   - H1 "Cảm ơn quý khách!"
   - Subtitle "Hóa đơn của bạn đã được phát hành"

2. Section "Tóm tắt":
   - "Số HĐ: HĐ-2026-0184"
   - "Ngày: 02/05/2026"
   - "Tổng tiền: 7.320.470 ₫"
   - "Người bán: Cà phê Trung Nguyên Legend"

3. CTA primary lớn: "Xem hóa đơn online" → portal link
4. CTA secondary: "Tải PDF" → direct PDF link

5. Section info pháp lý nhỏ:
   - "Hóa đơn điện tử theo NĐ 123/2020 + NĐ 70/2025"
   - "Đã được CQT chấp nhận với mã C26XYZABC123"
   - Caption fine print

6. Footer:
   - "Email tự động từ Haravan Invoice — không reply"
   - Liên hệ merchant address + email + phone
   - Unsubscribe link (theo Luật quảng cáo)
   - "Powered by Haravan Invoice" nhỏ

Style email-safe (table-based, inline CSS), mobile responsive (single column), no JS.

═══════════════════════════════════════════
STATE COVERAGE

File 1 (lookup):
- Default empty form
- Loading sau click "Tra cứu"
- Error "Không tìm thấy" với CTA "Liên hệ merchant"
- Throttle rate limit (sau N attempts): "Bạn đã thử quá nhiều, vui lòng chờ 60s"

File 2 (invoice):
- Default đã accepted
- Variant signing-required (chờ ký biên bản)
- Variant rejected by CQT (hiển thị status đỏ, không có "Tải XML")
- Variant adjusted (badge "Đã được điều chỉnh — xem HĐ-2026-0185")

File 3 (email):
- Default issue
- Variant adjustment notification
- Variant signing request

═══════════════════════════════════════════
ACCEPTANCE

- 3 file riêng biệt
- Portal mobile-first, max-width 480-720px center
- KHÔNG có hành động "Hủy" (chỉ "Yêu cầu điều chỉnh")
- Reference NĐ 123/2020 + NĐ 70/2025 đúng
- Email template inline CSS, mobile responsive
- Signing flow có 3 method realistic VN (CCCD chip, VNeID, SMS OTP)
- Turnstile placeholder ở lookup form (chống bot)
- Dark mode pass (portal files)

═══════════════════════════════════════════
OUTPUT

3 file HTML, mỗi file có header comment đúng source.

<!--
  Generated from: vibe_design_prompts/10_customer_portal_delivery.md
  Screen: Customer Portal (lookup, invoice, email template)
  Persona: Khách hàng cuối B2B + B2C
  JTBD: Tra cứu nhanh + tải PDF + ký xác nhận
  Device: Mobile-first
  States: 4 variant signing/rejected/adjusted/default
-->

Sau artifact, list:
- 3 file path
- Method signing đầy đủ
- Reference văn bản
```

---

## Variants

- **B2B accountant portal:** "Variant cho kế toán bên khách: có login Google/Microsoft SSO, dashboard list HĐ nhận được trong 12 tháng, export Excel để đối soát"
- **QR delivery:** "POS in QR trực tiếp trên receipt giấy → khách scan → ra portal"
- **WhatsApp template:** "Tương tự email-template-invoice nhưng template WhatsApp Business message"
