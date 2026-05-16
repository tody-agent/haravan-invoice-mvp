# Vibe Design Prompts — Haravan Invoice MVP Prototype v1

> Bộ prompt template để dùng **Claude (claude.ai chat)** sinh prototype HTML multi-page cho phiên bản MVP đầu tiên. Phong cách thiết kế gần **Shopify Polaris + Haravan Admin**: clean surface, blue primary, card-based, subtle shadow.

---

## 🎯 Khi nào dùng bộ prompt này

Bạn ở 1 trong các tình huống:

1. Cần ra prototype HTML cho 1 màn hình mới để test concept với stakeholder/merchant nhanh.
2. Cần refresh visual prototype hiện tại (`prototype/*.html`) sang phong cách polished hơn theo MVP spec.
3. Cần seed component visual cho dev convert sang React production (theo `openspec/changes/mvp-foundation-cf-google/`).
4. Cần A/B 2-3 variant layout cho cùng 1 screen.

Output mỗi prompt: **1 hoặc nhiều file HTML standalone**, mở double-click chạy được, không cần build, dùng Tailwind CDN + Tabler Icons.

---

## 📁 Cấu trúc folder

```
vibe_design_prompts/
├── README.md                            ← bạn đang đọc
├── 00_master_context.md                 ← PASTE 1 LẦN vào Claude Project knowledge
├── 01_design_system_polaris_haravan.md  ← Token, component primitive, type ramp
├── 02_app_shell_navigation.md           ← Sidebar + topbar + canvas + responsive
├── 03_dashboard_tong_quan.md            ← F2 Dashboard với 4 KPI omnichannel
├── 04_invoice_list.md                   ← F3 Danh sách hóa đơn
├── 05_invoice_issue_one_click.md        ← F4 Phát hành 1-click (POS/Web/Admin)
├── 06_correction_wizard.md              ← F5 Wizard sai sót 5-step NĐ 70/2025
├── 07_compliance_center.md              ← F6 Compliance + audit timeline
├── 08_tvan_connections.md               ← F7 Kết nối T-VAN
├── 09_notification_center.md            ← F9 Notification + regulation banner
├── 10_customer_portal_delivery.md       ← F10 Customer lookup + signing
├── 11_auth_flow.md                      ← F8 Login Haravan SSO + onboarding
└── 12_states_patterns.md                ← Loading / empty / error / success patterns
```

---

## 🚀 Cách dùng (3 bước)

### Bước 1 — Setup Claude Project 1 lần

1. Mở claude.ai → tạo Project mới "Haravan Invoice MVP Design".
2. Paste **toàn bộ `00_master_context.md`** vào project knowledge.
3. (Optional) Upload screenshot Haravan Admin và file prototype HTML hiện tại làm reference.
4. Set custom instruction: `Bạn là senior product designer chuyên về SaaS B2B Việt Nam, output HTML standalone phong cách Shopify Polaris adapted cho Haravan. Mọi prompt sau bạn dùng tokens trong 01_design_system.`

### Bước 2 — Mở session per screen

Trong project, mở conversation mới cho mỗi màn hình muốn design. **Paste nguyên file prompt tương ứng** (ví dụ `03_dashboard_tong_quan.md`). Claude sẽ:
- Confirm đã load master context
- Generate HTML artifact theo prompt
- Show preview để bạn review

### Bước 3 — Iterate

Sau khi nhận artifact đầu tiên, dùng pattern feedback ngắn:
- "Tăng spacing card lên 24px"
- "Đổi icon notification sang Tabler bell-ring"
- "Variant B: filter chip horizontal scroll thay vì wrap"
- "Thêm state empty cho table khi 0 invoice"

Claude update artifact in-place. Lưu HTML cuối cùng về `prototype/<screen-name>.html` (hoặc save link nếu chưa nuốt prototype HTML cũ).

---

## 🎨 Style anchor (Polaris + Haravan)

| Element | Spec |
|---|---|
| Background canvas | `#f4f6fa` (cool gray) |
| Card surface | `#ffffff` với border `#e4e9f0` 1px + shadow nhẹ |
| Primary action | Blue `#2f6bff` (Haravan), KHÔNG dùng green Shopify |
| Typography | `Inter` cho UI, fallback system; `JetBrains Mono` cho mã/MST |
| Icon system | Tabler Icons outline 24px (tabler-icons.io) |
| Radius | Card 12-16px, button 8px, input 8px |
| Spacing grid | 8px base (4/8/12/16/24/32/48) |
| Density | Polaris "comfortable" — không quá compact |
| Motion | Subtle 150-200ms ease, không animate bling |

Đầy đủ token trong `01_design_system_polaris_haravan.md`.

---

## 📐 Acceptance criteria mọi prompt

Mỗi prompt đều require Claude output thoả:

- [ ] HTML standalone, mở double-click chạy
- [ ] Tailwind CDN load + Tabler Icons CDN
- [ ] Token CSS variables defined ở `:root`, có dark mode preset
- [ ] Responsive: desktop ≥1280px primary, tablet 768-1024px secondary, mobile 375px+ acceptable
- [ ] Tiếng Việt UI, mock data realistic VN (MST 0312XXXXXX dạng thật, tên DN Việt, địa chỉ HCM/HN)
- [ ] KHÔNG có button/menu "Hủy hóa đơn" (bỏ theo NĐ 70/2025)
- [ ] Có ít nhất 2 state: filled + empty hoặc filled + loading
- [ ] Accessibility: contrast WCAG AA, focus ring rõ ràng, aria-label cho icon button
- [ ] Comment HTML ngắn ở đầu file: screen name + persona + JTBD

---

## 🔁 Tương quan với các artifact khác

- **`prototype/*.html`** — prototype cũ, GIỮ NGUYÊN làm baseline reference, KHÔNG ghi đè.
- **`openspec/specs/prototype/spec.md`** — spec hiện trạng prototype HTML cũ.
- **`openspec/changes/mvp-foundation-cf-google/`** — change cho MVP working, prompt design này là **input visual** cho dev convert sang React production.
- **`vibe_coding_prompts/`** — prompt code (Phase 1 build), prompt design này song hành.

Khi designer output 1 HTML qua bộ prompt này, dev sẽ dùng prompt tương ứng trong `vibe_coding_prompts/` để chuyển sang React component thật ở `apps/mvp/`.

---

## 🧪 Variant strategy

Khi muốn so 2-3 hướng layout cho cùng 1 screen, dùng pattern:

```
Tạo 3 variant cho screen này:
- Variant A: layout hiện tại (baseline)
- Variant B: filter rail bên phải thay vì top
- Variant C: dense table với inline action thay vì drawer
Output 3 file riêng: dashboard-a.html, dashboard-b.html, dashboard-c.html
```

Claude support đa-artifact trong 1 turn.

---

## ⚠️ Lưu ý compliance

Mỗi prompt đã reference NĐ 70/2025 + TT 32/2025 ở phần JTBD. Designer KHÔNG được thêm action "Hủy hóa đơn" kể cả khi bạn quên paste reference — Claude sẽ flag.

Khi dự thảo NĐ 2026 ban hành, update prompt 06 (wizard) và 07 (compliance) tương ứng. Master context file 00 sẽ là source of truth.

---

## Change log

| Version | Date | Change | Author |
|---|---|---|---|
| v1.0 | 2026-05-14 | Initial — 13 prompt cho MVP must-have feature theo `mvp-foundation-cf-google` | Tody |
