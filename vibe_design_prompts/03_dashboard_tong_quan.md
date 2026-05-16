# 03 — Dashboard Tổng Quan

> **Cách dùng:** Paste prompt này để generate `dashboard.html` — màn hình mặc định khi merchant vào MVP. Persona ưu tiên: Owner + Kế toán.

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01) + App Shell (02).

Task: Generate `dashboard.html` — màn hình Tổng quan hóa đơn cho Owner và Kế toán.
Nhúng trong app shell (sidebar + topbar đã định nghĩa ở 02).

═══════════════════════════════════════════
PERSONA + JTBD

Persona ưu tiên: Owner (xem nhanh tình hình), Kế toán (drill-down).
JTBD chính:
- "Khi tôi mở Haravan Admin buổi sáng, tôi muốn thấy ngay tình hình hóa đơn hôm qua/hôm nay
  để biết có vấn đề gì cần can thiệp không."
- "Khi quy định thay đổi hoặc có rủi ro NCC, tôi muốn được cảnh báo nổi bật,
  không phải đào tìm trong menu."

═══════════════════════════════════════════
PAGE HEADER

H1: "Tổng quan hóa đơn"
Subtitle: "Theo dõi tình hình phát hành, compliance, và rủi ro toàn hệ thống"
Right actions:
- Button outline "Xuất báo cáo" (icon ti-download)
- Button primary "Phát hành mới" (icon ti-plus)

Filter row dưới page header:
- Period dropdown chip: "30 ngày qua" (default) — options: Hôm nay, 7 ngày, 30 ngày, 90 ngày, Tùy chọn
- Chi nhánh dropdown chip: "Tất cả chi nhánh"
- Kênh chip: "Tất cả kênh" (Web/POS/Admin/API)
- Button reset filter (ti-x) bên phải

═══════════════════════════════════════════
SECTION 1 — Regulation banner (top, conditional)

Banner alert info (collapsible, có nút × close lưu localStorage):
- Icon ti-megaphone
- Title: "Cập nhật NĐ 70/2025 + TT 32/2025 đã hiệu lực từ 01/06/2025"
- Body: "3 thay đổi ảnh hưởng workflow của bạn: bỏ thủ tục hủy, HKD ≥1B cần máy tính tiền, format mới biên bản điều chỉnh."
- CTA right: "Xem chi tiết" (link tới Compliance Center)

═══════════════════════════════════════════
SECTION 2 — 4 KPI cards (row, 4-col grid desktop, 2-col tablet, 1-col mobile)

Mỗi KPI card:
- Card padding 20px, radius 12px, border 1px, shadow-sm
- Top: label caption uppercase letter-spacing + icon Tabler nhỏ phải
- Big number: 28px weight 600 mono cho tiền/số
- Change indicator: badge soft với ▲/▼ + % + "vs kỳ trước" caption
- Bottom: sparkline mini SVG 60px height (mock path)

4 KPI:
1. "Doanh thu hôm nay" — 47.250.000 ₫ — ▲ 12.3% — color success
2. "Hóa đơn phát hành" — 184 — ▲ 8.1% — color info
3. "% CQT chấp nhận" — 99.4% — ▼ 0.2% — color warning (vì giảm)
4. "Cảnh báo NCC rủi ro" — 3 — flat — color danger
   * Card #4 có badge nhỏ "AI" bên cạnh label

═══════════════════════════════════════════
SECTION 3 — Row 2 cột

Cột A (8-col): "Phát hành theo kênh — 7 ngày qua"
- Card với header H3 "Phát hành theo kênh" + tabs "7N / 30N / 90N" right
- Body: stacked bar chart placeholder (HTML/CSS bars hoặc SVG path đơn giản)
  * 7 ngày × 4 channel (Web/POS/Admin/API)
  * Legend bên dưới với chip màu
- Hover bar → tooltip mock vị trí cố định
- Footer card: "Tổng 1.247 hóa đơn · 312.4M ₫ · 4 kênh"

Cột B (4-col): "Top chi nhánh"
- Card với H3 "Top 5 chi nhánh phát hành nhiều nhất"
- List 5 row:
  * Avatar/icon ti-building + tên chi nhánh + caption địa chỉ ngắn
  * Right: số HĐ + % share
  * Progress bar nhỏ background fill theo %
- Footer: link "Xem tất cả chi nhánh →"

Mock chi nhánh:
1. Cà phê Trung Nguyên Legend Q1 — 412 HĐ — 33%
2. Trung Nguyên Legend Q3 — 287 HĐ — 23%
3. Trung Nguyên Legend Hà Nội Tràng Tiền — 198 HĐ — 16%
4. Trung Nguyên Legend Đà Nẵng — 142 HĐ — 11%
5. Trung Nguyên Legend Cần Thơ — 89 HĐ — 7%

═══════════════════════════════════════════
SECTION 4 — Recent invoices table (full width)

Card với:
- Header: H3 "Hóa đơn gần đây" + tabs nhỏ "Tất cả (184) / Đã phát hành (180) / Đang chờ (3) / Bị từ chối (1)" + link "Xem tất cả →"
- Table 7 cột × 10 row mock:
  * Checkbox cột chọn
  * Số HĐ (mono, badge copy icon hover)
  * Ngày giờ (vd "Hôm nay 14:32")
  * Khách hàng (tên + MST nhỏ caption)
  * Kênh (badge icon: Web/POS/Admin/API)
  * Tổng tiền (mono, align right)
  * Trạng thái (badge semantic: Đã phát hành success, Đang chờ warning, Bị từ chối danger)
  * AI flags (col nhỏ, hiện icon ⚠ tooltip nếu có warning, 1-2 row có)
- Row hover → bg --hv-bg-surface-hover
- Click row → drawer detail (chỉ render snapshot, không animate)
- Footer: pagination "1-10 / 184" + button "10 / trang ▾"

Mock data row 1 (có AI flag warning):
HĐ-2026-0184 | Hôm nay 14:32 | Công ty TNHH ABC | 0312345678 | Web | 4.250.000 ₫ | Đã phát hành | ⚠ NCC cảnh báo

═══════════════════════════════════════════
SECTION 5 — Insight strip (bottom)

Row 3 card nhỏ insight (4-col mỗi card), mỗi card:
- Icon + Headline + 1 dòng action
1. Compliance card — icon ti-shield-check — "7/7 rule pháp lý PASS hôm nay" — link "Xem báo cáo →"
2. T-VAN status — icon ti-plug — "Hilo: 8.234/10.000 HĐ trong gói (82%)" — progress bar 82% — link "Quản lý gói →"
3. Tip card — icon ti-bulb — "Bạn có 12 đơn hàng web hôm qua chưa phát hành HĐ" — button "Phát hành hàng loạt →"

═══════════════════════════════════════════
STATE COVERAGE

Render 1 toggle góc dưới phải để demo switch state:
- State 1 (default): filled với mock data như trên
- State 2 "Empty": tenant mới, chưa phát hành HĐ nào → empty illustration + CTA "Phát hành hóa đơn đầu tiên"
- State 3 "Loading": tất cả card hiển thị skeleton (gray block animate pulse)
- State 4 "Error": top banner đỏ "Không tải được dữ liệu — Mã lỗi TRX-4521 — [Thử lại]"

═══════════════════════════════════════════
ACCEPTANCE

- Đúng app shell 02 (sidebar Tổng quan active, breadcrumb "Hóa đơn › Tổng quan")
- Responsive: tablet stack 4 KPI thành 2x2, mobile thành 4 row dọc
- KPI number mono font, ngăn ngàn dấu chấm
- Mock data thật VN (tên Trung Nguyên Legend, MST 10 số)
- KHÔNG có action "Hủy" ở bất kỳ đâu
- Compliance reference banner có chữ NĐ 70/2025 + TT 32/2025 đúng
- Dark mode pass
- Comment HTML phân section rõ

═══════════════════════════════════════════
OUTPUT

Trả 1 file HTML. Header comment:

<!--
  Generated from: vibe_design_prompts/03_dashboard_tong_quan.md
  Screen: Dashboard — Tổng quan
  Persona: Owner + Kế toán
  JTBD: Sáng vào Admin → biết ngay tình hình + cảnh báo
  States: filled, empty, loading, error (toggle góc dưới)
-->

Sau artifact, ghi ngắn:
- Số chart/list rendered
- Quyết định layout chính (8/4 col vs 6/6)
- Đề xuất A/B nếu thấy hướng khác mạnh hơn
```

---

## Variants

- **Owner-mobile snapshot:** "Mobile owner view: chỉ 4 KPI + 1 chart + alert, không có table"
- **Power-user kế toán:** "Dense mode: table 20 row mặc định, KPI thu nhỏ thành stat strip"
- **Multi-store consolidated:** "Workspace switcher pill chọn 'Tất cả 5 cửa hàng' → KPI tổng + breakdown per store"
