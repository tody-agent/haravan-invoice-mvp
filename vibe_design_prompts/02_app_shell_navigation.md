# 02 — App Shell & Navigation

> **Cách dùng:** Paste prompt này để generate `app-shell.html` — layout khung chung cho mọi screen MVP. Sau khi có file shell, các prompt 03-09 sẽ refer back để mỗi screen được nhúng đúng vào shell.

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01_design_system_polaris_haravan.md).

Task: Generate file HTML `app-shell.html` thể hiện khung admin chính của Haravan Invoice MVP,
phong cách Haravan Admin (cool gray + blue primary), gần Shopify Polaris admin.

═══════════════════════════════════════════
PHẦN 1 — Layout 3 zone

Desktop ≥1280px:
┌──────────────────────────────────────────────────────────┐
│ TOPBAR 56px (white, sticky top, border-b 1px)           │
├────────┬─────────────────────────────────────────────────┤
│ SIDE   │                                                 │
│ BAR    │           MAIN STAGE                            │
│ 248px  │           (canvas xám lạnh, scroll riêng)       │
│ fixed  │                                                 │
│ left   │                                                 │
│ scroll │                                                 │
│ riêng  │                                                 │
└────────┴─────────────────────────────────────────────────┘

Tablet 768-1023px: sidebar collapse → drawer trigger từ hamburger ở topbar.
Mobile <768px: sidebar drawer + bottom navigation bar 4 mục.

═══════════════════════════════════════════
PHẦN 2 — Topbar (56px)

Trái → phải:
1. Logo Haravan (text "haravan" hoặc placeholder SVG nhỏ 24px) + workspace switcher
   pill: "Cửa hàng Trung Nguyên Legend ▾" với MST badge nhỏ "0312345678"
2. Breadcrumb: "Hóa đơn › Tổng quan" (text-secondary, separator › nhạt)
3. Search global: input width 360px với icon ti-search bên trái và placeholder
   "Tìm hóa đơn, MST khách, số đơn... (⌘K)"
4. Spacer flex
5. Icon button "Bật/tắt theme" (ti-sun / ti-moon)
6. Icon button "Trợ giúp" (ti-help)
7. Notification bell với badge count "3" (đỏ, top-right)
8. Avatar tròn 32px initials "TL" (Tody Le) với dropdown trigger
   - Dropdown items: Hồ sơ, Cài đặt cửa hàng, Bảo mật, Đăng xuất

═══════════════════════════════════════════
PHẦN 3 — Sidebar (248px)

Top:
- Workspace pill repeat (nếu mobile)
- Search nhanh trong nav (Cmd+K opens full search)

Nav structure (theo phong cách Haravan Admin nhưng focus invoice):

[Section "TỔNG QUAN"]
- Trang chủ (ti-home)

[Section "KINH DOANH"]
- Đơn hàng (ti-receipt-2) — disabled placeholder
- Khách hàng (ti-users) — disabled placeholder
- Sản phẩm (ti-package) — disabled placeholder

[Section "HÓA ĐƠN ĐIỆN TỬ" — EXPANDED active]
- Tổng quan (ti-dashboard) — active state
- Danh sách hóa đơn (ti-list)
- Phát hành mới (ti-plus) — kèm badge "1-click"
- Xử lý sai sót (ti-wand)
- Tuân thủ (ti-shield-check)
- Kết nối T-VAN (ti-plug)
- Thông báo (ti-bell) — kèm badge count "3"

[Section "BÁO CÁO"]
- Báo cáo doanh thu (ti-chart-bar) — disabled placeholder

[Section "CÀI ĐẶT"]
- Thông tin doanh nghiệp (ti-building)
- Chữ ký số (ti-signature)
- Mẫu hóa đơn (ti-template)
- Người dùng & quyền (ti-user-cog)

Bottom (sticky):
- Plan badge: "Gói Pro · Còn 8.234 HĐ trong tháng" với progress bar nhỏ
- Link "Nâng cấp gói"

Nav item style:
- Default: text-secondary, icon + label, padding 8px 12px
- Hover: bg --hv-bg-surface-hover, text-primary
- Active: bg --hv-primary-soft, text --hv-primary-text, left border 3px --hv-primary
- Section header: caption uppercase, text-muted, letter-spacing 0.5px, padding-x 12, padding-y 8
- Badge: pill nhỏ 11px, semantic color soft, ngay sau label

═══════════════════════════════════════════
PHẦN 4 — Main stage

- Padding 24px desktop, 16px tablet, 12px mobile
- Max content width 1200px central
- Page header pattern (mọi screen sẽ dùng):
  * H1 page title (24/32 weight 600)
  * Subtitle text-secondary 14px
  * Action bar bên phải: 1-3 button (primary outline + secondary)
- Phía dưới page header: optional filter row hoặc tabs row
- Phía dưới nữa: content area với grid 12-col (gap 24px)

Demo content trong file shell này:
- Page title "Tổng quan hóa đơn"
- Subtitle "Theo dõi tình hình phát hành và compliance toàn hệ thống"
- 2 button bên phải: "Xuất báo cáo" (secondary outline) + "Phát hành mới" (primary)
- Filter row: 3 chip "30 ngày qua", "Tất cả chi nhánh", "Tất cả kênh"
- Placeholder content: 4 KPI card row + 1 chart card 8-col + 1 list card 4-col + 1 table card full width
- KPI cards và content chỉ cần render skeleton/placeholder text "Phần này sẽ được thiết kế ở prompt riêng"

═══════════════════════════════════════════
PHẦN 5 — Responsive behavior

Tablet 768-1023px:
- Sidebar ẩn, hamburger button hiện ở topbar trái-trên cùng
- Khi click hamburger → drawer trượt từ trái, backdrop blur-sm
- Topbar workspace pill collapse thành icon-only
- Search global thu nhỏ thành icon button, click expand modal search

Mobile <768px:
- Bottom nav fixed: 4 mục "Tổng quan" (ti-home), "Danh sách" (ti-list), "Phát hành" (ti-plus FAB nổi giữa), "Tài khoản" (ti-user)
- Page header stack vertical, action button thu thành floating action hoặc đẩy lên menu "⋯"
- Filter chip row scroll horizontal
- Content card stack full-width, no grid

═══════════════════════════════════════════
PHẦN 6 — Interaction JS

- Toggle dark mode click: data-theme attribute swap + localStorage persist
- Hamburger toggle drawer: aria-expanded + transform translate
- Workspace pill click: dropdown mock với 3 store mẫu
- Notification bell click: popover hiện 3 noti mock
- Avatar dropdown click: menu items mock (chỉ alert khi click)
- Cmd+K (Ctrl+K) keyboard shortcut: focus search global
- Search input focus: hiển thị suggestion popover mock 3 dòng

═══════════════════════════════════════════
PHẦN 7 — Acceptance

- File HTML standalone, double-click chạy
- Pass test responsive: resize browser xuống 1024px, 768px, 375px → layout swap đúng
- Dark mode toggle hoạt động, tất cả nav vẫn readable
- Aria role/label: nav element role="navigation", button có aria-label nếu icon-only
- Tabindex thứ tự đúng: workspace pill → search → topbar icon → sidebar nav
- Comment HTML phân vùng rõ ràng: <!-- Topbar -->, <!-- Sidebar -->, <!-- Main Stage -->,
  <!-- Bottom Nav (mobile) -->, <!-- Mobile Drawer -->
- Token CSS đúng Master Context §4.2

═══════════════════════════════════════════
PHẦN 8 — Output

Trả 1 file HTML. Header comment:

<!--
  Generated from: vibe_design_prompts/02_app_shell_navigation.md
  Screen: App Shell + Navigation
  Master context: v1.0
  Persona: Tất cả persona — đây là khung chung
-->

Sau artifact, list:
- Breakpoint thực tế đã test
- Nav items count tổng (verify đủ 7 invoice subroute)
- Component reuse tỉ lệ ước lượng (% utility class vs custom)
- Đề xuất A/B variant nếu thấy hướng layout khác mạnh hơn
```

---

## Variants

- **A/B sidebar position:** "Variant B: sidebar phải thay vì trái cho RTL test"
- **Density compact:** "Topbar 48px thay vì 56, nav item padding-y 6px thay vì 8"
- **Hara Retail POS skin:** "Topbar bỏ search global + breadcrumb, tăng touch target ≥44px cho Hararetail POS tablet"
