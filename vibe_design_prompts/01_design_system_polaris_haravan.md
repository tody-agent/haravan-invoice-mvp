# 01 — Design System: Polaris adapted for Haravan

> **Cách dùng:** Paste prompt này khi muốn Claude generate **component library reference page** (1 file HTML showcase tất cả primitive). Sau khi có file này, các prompt 02-12 sẽ refer back để keep consistency.

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 (đã load trong project knowledge).

Task: Generate 1 file HTML standalone `design-system.html` làm component library showcase.
Đây là single source of truth visual cho các prompt screen tiếp theo.

═══════════════════════════════════════════
PHẦN 1 — Bố cục trang
═══════════════════════════════════════════

File HTML chia 2 cột:
- Sidebar trái 240px sticky: TOC điều hướng anchor #section
- Content phải scroll: mỗi component có heading + spec card bên trái + live preview
  bên phải (50/50 split desktop, stack mobile)

Sections (theo thứ tự):
1. Foundations
   1.1 Color tokens (full palette với hex + var name + usage hint)
   1.2 Typography ramp (display/h1/h2/h3/body/caption/mono) — render từng size thật
   1.3 Spacing scale (4/8/12/16/24/32/48/64 — render box vuông tỉ lệ)
   1.4 Radius scale (xs/sm/md/lg/pill — render box mẫu)
   1.5 Shadow scale (sm/md/lg — render card mẫu)
   1.6 Icon system (24 icon Tabler dùng nhiều nhất trong app invoice)

2. Buttons
   - Primary (filled blue), 3 size: sm/md/lg
   - Secondary (outline), 3 size
   - Tertiary (text only)
   - Destructive (red outline)
   - Icon button (square 36x36)
   - Loading state (spinner inline)
   - Disabled state
   - With leading/trailing icon

3. Form controls
   - Text input (default/focus/error/disabled)
   - Text input with prefix/suffix (vd MST với badge "Verified")
   - Textarea
   - Select (single + multi)
   - Checkbox (default/checked/indeterminate)
   - Radio group
   - Switch toggle
   - Date picker trigger (chỉ render input, không expand calendar)
   - File upload zone

4. Surfaces
   - Card (default/hover/elevated)
   - Card with header + footer
   - Empty state card (icon + title + description + CTA)
   - Banner alert (info/success/warning/danger) — 4 variant với close button
   - Callout block (regulation reference, vd "Theo NĐ 70/2025 §7…")

5. Data display
   - Badge/Tag (status: Draft/Pending/Issued/Adjusted/Replaced/Rejected — 6 variant)
   - Pill filter chip (default/active with close)
   - Avatar (initials + image fallback) — 3 size
   - Stat card (label + big number + change indicator ▲/▼)
   - KPI card với sparkline placeholder (chỉ SVG path mẫu)
   - Table:
     * 5 cột × 6 row mock data hóa đơn
     * Hover row state
     * Sticky header
     * Row có badge AI flag warning (1 row)
     * Sortable column header (↕ icon)
     * Bulk select checkbox column
   - Pagination (cursor style: ← Trước · 1-50 / 234 · Sau →)
   - Skeleton loader (row + card variant)

6. Navigation
   - Tabs (underline active) — 5 tab
   - Breadcrumb
   - Sidebar nav item (default/hover/active/with badge AI)
   - Step indicator (5-step stepper, current=3, hoàn thành 1-2)

7. Feedback
   - Toast (4 variant info/success/warning/danger) — render stack 3 toast góc topright
   - Inline form validation error
   - Loading spinner (sm/md/lg)
   - Progress bar (linear)
   - Confirmation modal mockup (title + body + 2 button)

8. Overlays
   - Drawer trượt phải 480px (chỉ render snapshot, không animate)
   - Modal centered (640px max width)
   - Popover/Dropdown menu

9. Specialized — Invoice domain
   - MST input với auto-fill suggestion dropdown
   - Compliance rule item (PASS/WARNING/FAIL với reference link)
   - Invoice number badge (mono font, có copy icon)
   - Channel badge (Web/POS/Admin/API — 4 icon)
   - T-VAN provider card (logo + status + usage bar)
   - Pre-flight check list (9 rule, mix pass/warning)
   - Diff viewer cho "thay đổi điều chỉnh" (before/after side-by-side)

═══════════════════════════════════════════
PHẦN 2 — Code spec
═══════════════════════════════════════════

- HTML5 + Tailwind CDN (https://cdn.tailwindcss.com) + Tabler Icons CDN.
- :root CSS variables ĐÚNG bộ token trong Master Context §4.2 — không thêm bớt.
- [data-theme="dark"] override đầy đủ.
- Class utility custom chỉ khi lặp ≥3 lần: `.hv-card`, `.hv-btn-primary`, `.hv-input`, `.hv-badge-{variant}`.
- Mỗi component preview kèm code snippet HTML thu nhỏ (dùng <pre><code>) để dev copy nhanh.
- Trên top trang có toggle dark/light + button "Copy all tokens" (clipboard JS).
- Anchor link mỗi section để link từ prompt khác (vd #buttons, #table, #compliance-rule).

═══════════════════════════════════════════
PHẦN 3 — Acceptance
═══════════════════════════════════════════

- Mở double-click chạy được, không lỗi console.
- Toggle dark mode hoạt động, tất cả component vẫn pass contrast.
- Sidebar TOC click → scroll mượt đến section.
- Đủ 9 section liệt kê ở Phần 1.
- Mỗi specialized component invoice có data thật Việt Nam (MST 0312..., tên DN VN).
- File size mục tiêu <200KB inline (không embed image).

═══════════════════════════════════════════
PHẦN 4 — Output

Trả 1 file HTML duy nhất. Comment đầu file:

<!--
  Generated from: vibe_design_prompts/01_design_system_polaris_haravan.md
  Screen: Design System Reference
  Master context: v1.0
  Purpose: Single source of truth visual cho 02-12 screen prompts
-->

Sau artifact, list ngắn:
- Token count (số CSS var)
- Component count (số primitive đã render)
- Section nào có gap so với prompt (nếu có)
- Đề xuất extension cho prompt screen tiếp theo
```

---

## Variants nếu cần

- **Compact variant:** thêm vào prompt "Render dense table density mode bên cạnh comfortable mode, button height 32px thay vì 36px."
- **Brand variant:** "Thay --hv-primary thành #00855e (Haravan green dark mode) để A/B."
- **Mobile-first variant:** "Reorder sections theo ưu tiên mobile, hide desktop-only component."
