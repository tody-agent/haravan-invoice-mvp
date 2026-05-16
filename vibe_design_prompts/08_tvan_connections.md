# 08 — Kết nối T-VAN

> **Cách dùng:** Paste prompt để generate `tvan-connections.html`. Persona: Owner + Admin. Hiển thị Hilo active + 4 T-VAN khác "Available Phase 4" để chuẩn bị multi-T-VAN story.

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01) + App Shell (02).

Task: Generate `tvan-connections.html` — màn hình Kết nối T-VAN với Hilo primary active,
chứng thư số, gói usage, và 4 T-VAN provider placeholder cho Phase 4.

═══════════════════════════════════════════
PERSONA + JTBD

Persona: Owner, Admin.
JTBD:
- "Khi tôi cần biết gói Hilo còn bao nhiêu, chứng thư còn hạn không, automation nào đang chạy, tôi muốn xem 1 màn hình."
- "Khi tôi nghĩ tới việc mở thêm T-VAN backup (Viettel/MISA), tôi muốn biết MVP đã sẵn sàng chưa và roadmap khi nào."

═══════════════════════════════════════════
PAGE HEADER

Breadcrumb: Hóa đơn › Kết nối T-VAN
H1: "Kết nối T-VAN"
Subtitle: "Quản lý tổ chức truyền nhận hóa đơn điện tử với Cơ quan thuế"
Right actions:
- Button outline "Test kết nối tất cả" (ti-plug-connected)
- Button outline "Lịch sử kết nối" (ti-history)

═══════════════════════════════════════════
SECTION 1 — Provider grid (5 card, Hilo lớn nhất)

Hilo primary card (full row, large):
- Header row:
  * Logo Hilo (placeholder text "HILO" badge)
  * Title "Hilo · CTCP Công nghệ Hilo"
  * Badge "Primary · Active" success
  * Action menu (⋯) right
- Status indicator row 3 col:
  * Connection: "● Connected" với last ping "2 phút trước"
  * API endpoint: "api.hilo.vn/v2" mono caption
  * Latency: "p95 1.2s · trong 24h"
- Usage progress (lớn):
  * "8.234 / 10.000 HĐ trong gói tháng 05/2026 (82%)"
  * Progress bar lớn success → warning khi >80%
  * Caption: "Còn 15 ngày · Estimate dùng hết: 28/05 (sớm 3 ngày)"
  * Button "Nâng gói" outline + "Mua thêm 5.000 HĐ" primary
- Configuration row 2 col:
  * "Tài khoản Hilo": account_id mono + badge "Active"
  * "Chứng thư số": "VTC-Sign · CTS-2025-AB12CD" mono + badge "Còn hạn đến 18/07/2026 (63 ngày)" warning
- Capabilities checklist (4 col):
  * ✓ Phát hành HĐ điện tử
  * ✓ Phát hành HĐ máy tính tiền (NĐ 70)
  * ✓ Điều chỉnh / Thay thế
  * ✓ Nhận HĐ đầu vào
- Footer action: "Quản lý cấu hình →" + "Xem documentation Hilo →"

═══════════════════════════════════════════
4 card placeholder (2x2 grid below Hilo):

Mỗi card disabled + badge "Available Phase 4":

1. Viettel SInvoice
   - Logo "Viettel"
   - "Hiện chưa kết nối"
   - Body: "T-VAN của Tập đoàn Viettel. Thường được dùng làm backup hoặc primary cho doanh nghiệp lớn."
   - Button outline disabled "Kết nối — Phase 4"

2. MISA meInvoice
   - "Mạnh ở AI + AVA, tích hợp sâu với MISA AMIS Kế toán. Phù hợp doanh nghiệp đã dùng MISA accounting."
   - Button outline disabled "Kết nối — Phase 4"

3. VNPT Invoice
   - "T-VAN VNPT, gói pricing đa dạng theo volume."
   - Button outline disabled

4. EFY-iHOADON
   - "T-VAN truyền thống, compliance ổn định."
   - Button outline disabled

═══════════════════════════════════════════
SECTION 2 — Chứng thư số (chi tiết)

Card với H3 "Chứng thư số đang dùng"

Bảng 5 col × 2 row:
| Tên | Nhà cung cấp | Serial | Hết hạn | Trạng thái | Action |
| Chữ ký số chính | VTC-Sign | CTS-2025-AB12CD | 18/07/2026 | ⚠ Còn 63 ngày | "Gia hạn ngay" |
| Chữ ký số dự phòng | Viettel-CA | CTS-2024-XY99 | 05/05/2027 | ✓ Còn 354 ngày | "Đặt làm primary" |

Banner warning soft phía dưới:
- Icon ti-alert-triangle
- "Chứng thư chính sẽ hết hạn trong 63 ngày. Đề nghị gia hạn ngay để tránh gián đoạn phát hành."
- Button "Gia hạn online qua VTC →"

═══════════════════════════════════════════
SECTION 3 — Automation/integration list

Card với H3 "Automation đang chạy"

Bảng 4 col × 4 row:
| Tên automation | Trigger | T-VAN | Status |
| Auto phát hành từ Order Web | Order paid | Hilo | ✓ Active · 1.247 lần / 30N |
| Gộp đơn lẻ POS cuối ngày | Cron 23:59 daily | Hilo | ✓ Active · 30 lần / 30N |
| Gửi email tự động sau phát hành | After issue | (system) | ✓ Active · 8.234 lần / 30N |
| Sync HĐ điều chỉnh sang AMIS Kế toán | After adjust | (third-party) | ⊝ Disabled — Phase 4 |

═══════════════════════════════════════════
SECTION 4 — Failover (placeholder, Phase 4)

Card placeholder disabled với H3 "Failover & Load Balancing — Phase 4"
Body: "Khi MVP có nhiều T-VAN, bạn có thể cấu hình:
- Primary/Standby (auto switch khi primary down)
- Round-robin theo volume
- Geographic routing (T-VAN khác cho chi nhánh miền Bắc/Nam)"
Image placeholder mock topology diagram.

═══════════════════════════════════════════
STATE COVERAGE

- Default: Hilo active + 4 disabled
- Worst: Hilo connection error (banner đỏ top + status "●Disconnected" red)
- Chứng thư expire critical (<7 ngày): banner đỏ + count down
- Loading skeleton

═══════════════════════════════════════════
ACCEPTANCE

- Hilo card có đủ: status, latency, usage progress, account, chứng thư, capabilities, action
- 4 T-VAN khác đều disabled với badge "Available Phase 4"
- KHÔNG có capability "Hủy hóa đơn" trong checklist
- Chứng thư warning logic rõ (63 ngày → warning, <7 → danger)
- Automation list realistic
- Dark mode pass

═══════════════════════════════════════════
OUTPUT

<!--
  Generated from: vibe_design_prompts/08_tvan_connections.md
  Screen: Kết nối T-VAN
  Persona: Owner + Admin
  JTBD: Biết Hilo còn bao nhiêu + chứng thư + automation + Phase 4 roadmap
  Multi-T-VAN ready: 4 provider placeholder Phase 4
  States: default-active / connection-error / cert-critical / loading
-->

Sau artifact, verify:
- Hilo card đủ 5 section (status/usage/cert/capability/action)
- 4 placeholder đúng (Viettel/MISA/VNPT/EFY) với badge Phase 4
```

---

## Variants

- **Detail Hilo modal:** "Khi click 'Quản lý cấu hình' → modal large với API key (masked), webhook secret rotate, IP whitelist, custom timeout, rate limit Haravan-side."
- **Multi-store T-VAN:** "Nếu workspace có 5 cửa hàng, hiển thị table 5 row × 4 col T-VAN cho phép set provider khác nhau per store."
