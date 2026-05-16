# 11 — Auth Flow (Haravan SSO + Onboarding)

> **Cách dùng:** Paste prompt để generate 4 file HTML cho auth journey: landing/login, callback loading, onboarding wizard, error pages.

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01).

Lưu ý: Auth screens KHÔNG nhúng trong app shell (02). Đây là pre-auth pages, layout standalone center, brand-forward.

Task: Generate 4 file HTML:
1. `auth-landing.html` — landing trang chào + button "Đăng nhập với Haravan"
2. `auth-callback-loading.html` — loading sau khi callback từ Haravan IdP
3. `auth-onboarding.html` — wizard onboarding lần đầu (3 step)
4. `auth-errors.html` — page error: unauthorized / forbidden / session-expired / store-not-found

═══════════════════════════════════════════
PERSONA + JTBD

Persona: Tất cả role lần đầu vào MVP.
JTBD: "Khi tôi click 'Hóa đơn' trong Haravan Admin lần đầu, tôi muốn flow login mượt, không nhập lại password, và biết sản phẩm này làm gì trong 30 giây."

═══════════════════════════════════════════
FILE 1 — auth-landing.html

Layout: 2 cột (60/40), full viewport height.

Cột trái 60%: gradient background --hv-primary-soft → white
- Logo "haravan invoice" lớn ở top-left
- Center vertical:
  * Eyebrow caption "Haravan Invoice MVP · Beta"
  * H1 lớn (48px) "Hóa đơn điện tử, ngay trong Haravan Admin của bạn"
  * Subtitle text-secondary "Phát hành 1-click, AI tiền-kiểm, multi-T-VAN ready. Tuân thủ NĐ 70/2025 + TT 32/2025."
  * Feature checklist 4 item:
    - ✓ Tích hợp sẵn với Order, Customer, Product Haravan
    - ✓ T-VAN backend Hilo (đã ký số chuẩn QĐ 1510)
    - ✓ AI pre-flight 9 rule + suggest auto-fill
    - ✓ Compliance Center real-time + audit log immutable
- Bottom-left: small logos partner "Hilo · VTC-Sign · Google Cloud · Cloudflare"

Cột phải 40%: card center vertical
- H2 "Đăng nhập để bắt đầu"
- Button primary lớn width-full với logo Haravan trắng "Đăng nhập với Haravan" (ti-arrow-right)
- Divider "hoặc"
- Button outline với logo Google "Đăng nhập với Google Workspace (cho nhân viên Haravan)" — chỉ visible khi domain @haravan.com detect
- Footer caption:
  * "Bằng việc đăng nhập, bạn đồng ý với [Điều khoản] và [Chính sách quyền riêng tư]"
  * "Đang trong giai đoạn beta · 10 cửa hàng đầu tiên · Phản hồi: invoice-beta@haravan.com"

═══════════════════════════════════════════
FILE 2 — auth-callback-loading.html

Layout: full center.

- Logo "haravan invoice" lớn
- Spinner lớn (3 dots animate hoặc orbit)
- Sequential text fade-in (mock animation):
  * "✓ Đã xác thực với Haravan ID"
  * "✓ Đang tải thông tin cửa hàng..."
  * "◉ Đang kiểm tra quyền truy cập Hóa đơn..."
- Caption muted "Quá trình này thường mất 2-3 giây"

═══════════════════════════════════════════
FILE 3 — auth-onboarding.html (3 step wizard)

Layout: center max-width 720px.

Stepper top: 3 step
1. ✓ Xác nhận cửa hàng
2. ◉ Cấu hình T-VAN (current default render)
3. ◯ Khám phá tính năng

Step 1 (collapsed sau khi pass) — Xác nhận cửa hàng:
- Pre-filled từ Haravan profile:
  * Tên cửa hàng "Cà phê Trung Nguyên Legend"
  * MST "0312345678"
  * Địa chỉ
  * Người chủ tài khoản
- Button "Xác nhận → Tiếp tục"

Step 2 (current default) — Cấu hình T-VAN:
- H2 "Kết nối với T-VAN của bạn"
- Subtitle "Hiện tại MVP hỗ trợ Hilo. Các T-VAN khác sẽ có ở Phase 4."
- Card lựa chọn radio (Hilo only enabled):
  * ● Hilo — input "Mã tài khoản Hilo" + button "Test kết nối"
  * ○ Viettel/MISA/VNPT/EFY (disabled "Phase 4")
- Sub-section "Chứng thư số":
  * Radio "Tôi đã có chứng thư số" → input upload + serial
  * Radio "Tôi cần mua mới" → link partner VTC-Sign
- Sub-section "Mẫu hóa đơn":
  * Dropdown chọn template "01GTKT0/001" (default)
  * Link "Xem preview"
- Button outline "Quay lại" + button primary "Tiếp tục"

Step 3 (preview) — Khám phá tính năng:
- Grid 6 card feature, mỗi card icon + title + 1-line description:
  * Phát hành 1-click (ti-plus)
  * Wizard sai sót NĐ 70 (ti-wand)
  * Compliance Center (ti-shield-check)
  * AI Copilot pre-flight (ti-sparkles)
  * Multi-T-VAN (ti-plug)
  * Audit log immutable (ti-history)
- Button "Bắt đầu dùng MVP" primary lớn → redirect /dashboard

═══════════════════════════════════════════
FILE 4 — auth-errors.html (4 variant trong 1 file, switch qua URL hash hoặc toggle)

Layout: center max-width 480px, illustration trên + content dưới.

Variant 1 — `#unauthorized`:
- Icon ti-lock lớn
- H1 "Bạn cần đăng nhập"
- Body "Session đã hết hạn hoặc bạn chưa đăng nhập. Vui lòng đăng nhập lại với Haravan."
- Button "Đăng nhập lại" → /auth/login
- Link "Liên hệ hỗ trợ"

Variant 2 — `#forbidden`:
- Icon ti-shield-off lớn
- H1 "Bạn không có quyền truy cập"
- Body "Cửa hàng này chưa kích hoạt Haravan Invoice. Liên hệ chủ shop hoặc Haravan để được cấp quyền."
- Caption "Email của bạn: user@trungnguyen.com.vn"
- Button outline "Liên hệ Owner shop" + button "Đăng nhập tài khoản khác"

Variant 3 — `#session-expired`:
- Icon ti-clock-off lớn
- H1 "Phiên đã hết hạn"
- Body "Vì lý do bảo mật, phiên đăng nhập của bạn đã hết hạn sau 8 giờ. Vui lòng đăng nhập lại."
- Auto countdown "Tự động chuyển hướng sau 5s..."
- Button "Đăng nhập ngay"

Variant 4 — `#store-not-found`:
- Icon ti-building-off lớn
- H1 "Không tìm thấy cửa hàng"
- Body "Có thể Haravan store của bạn chưa được setup MVP hoặc đã bị disable. Liên hệ admin Haravan để check."
- Button "Email hỗ trợ" + button "Quay về Haravan Admin"

Toggle UI ở góc dưới phải để demo 4 variant.

═══════════════════════════════════════════
STATE COVERAGE

Đã embed trong 4 file. Thêm:
- File 1: loading state khi click "Đăng nhập" (button spinner)
- File 3: error state khi test Hilo connection fail (banner đỏ + retry)

═══════════════════════════════════════════
ACCEPTANCE

- 4 file HTML standalone
- Không nhúng app shell (02)
- File 1: 2-col layout, marketing tone, mention NĐ 70/TT 32
- File 3 step 2: chỉ Hilo enabled, 4 T-VAN khác disabled với Phase 4
- File 4: 4 variant rõ ràng với icon + body + action
- Dark mode pass
- Mobile responsive: 2-col file 1 stack thành 1-col
- Brand-forward nhưng không marketing flashy

═══════════════════════════════════════════
OUTPUT

4 file HTML. Mỗi file header comment đúng source.

<!--
  Generated from: vibe_design_prompts/11_auth_flow.md
  Screen: Auth flow (landing, callback, onboarding, errors)
  Persona: Tất cả role lần đầu
  JTBD: Login mượt + onboard nhanh + error rõ ràng
  States: success + 4 error variant
-->

Sau artifact, list:
- 4 file path
- Variant error rõ ràng
- Step onboarding đầy đủ
```

---

## Variants

- **Multi-store onboarding:** "Step thêm cho user là Owner nhiều store: chọn store nào enable MVP first"
- **Embedded mode:** "Variant: khi MVP nhúng iframe trong Haravan Admin, auth-landing skip step welcome, redirect thẳng Haravan SSO"
