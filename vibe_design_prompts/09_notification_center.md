# 09 — Notification Center

> **Cách dùng:** Paste prompt để generate `notification-center.html` + `notification-popover.html`. Persona: Tất cả. Tần suất daily.

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01) + App Shell (02).

Task: Generate 2 file HTML:
1. `notification-popover.html` — popover dropdown từ bell icon topbar (480px width)
2. `notification-center.html` — full page Notification Center

═══════════════════════════════════════════
PERSONA + JTBD

Persona: Tất cả.
JTBD: "Khi có việc cần tôi xử lý (regulation update, chứng thư expire, HĐ bị từ chối, job fail, khách phản hồi), tôi muốn được nhắc rõ ràng và biết phải làm gì — không bỏ sót."

═══════════════════════════════════════════
FILE 1 — notification-popover.html

Trigger: click bell icon ở topbar shell (badge count "3")
Popover trượt xuống từ bell, width 480px, max-height 600px scroll, shadow-lg + radius 12px.

Header popover:
- Title "Thông báo (8 chưa đọc)"
- Right: button text "Đánh dấu tất cả đã đọc" + icon ti-settings

Filter tabs nhỏ (chip pill 4):
- Tất cả (47)
- Chưa đọc (8) — default active
- Tuân thủ (3)
- Tác vụ (5)

List 8 notification item (chưa đọc, dot xanh trước item):

1. 🟢 [Regulation] "Dự thảo NĐ thay thế NĐ 123+70 đã công bố thẩm định"
   - Caption "2 giờ trước · Bộ Tư pháp · Cần review trong 30 ngày"
   - Mini CTA "Xem chi tiết →"

2. 🟢 [Compliance] "Chứng thư số sẽ hết hạn trong 63 ngày (18/07/2026)"
   - Caption "Hôm qua · Hệ thống tự động"
   - Mini CTA "Gia hạn ngay →"

3. 🟢 [Job] "Bulk phát hành 30 HĐ POS hôm qua: 28 thành công, 2 lỗi"
   - Caption "Hôm qua 23:59 · Daily aggregation"
   - Mini CTA "Xem 2 HĐ lỗi →"

4. 🟢 [Customer] "Khách hàng Vinamilk yêu cầu điều chỉnh HĐ-2026-0142"
   - Caption "Hôm nay 09:32 · qua portal"
   - Mini CTA "Mở wizard sai sót →"

5. 🟢 [CQT] "HĐ-2026-0184 đã được CQT chấp nhận (mã C26XYZABC)"
   - Caption "Hôm nay 14:47 · Hilo"
   - Mini CTA "Xem HĐ →"

6. 🟢 [Risk] "AI phát hiện 3 NCC trong danh sách rủi ro mới của CQT"
   - Caption "Hôm nay 10:00 · Phase 3 preview"
   - Mini CTA "Xem danh sách →"

7. 🟢 [Plan] "Bạn đã dùng 82% gói Hilo tháng này (8.234/10.000 HĐ)"
   - Caption "Hôm nay 08:00"
   - Mini CTA "Nâng gói →"

8. 🟢 [Settings] "Người dùng 'Nguyễn Văn B' vừa được cấp quyền Kế toán"
   - Caption "2 ngày trước · bởi Owner Tody Le"
   - Mini CTA "Xem audit log →"

Item style:
- Icon trái 36x36 với background semantic soft + icon Tabler
- Content trung tâm
- Mini CTA bên phải hoặc bottom, font-weight 500, color primary
- Hover bg surface-hover
- Dot xanh chưa đọc bên trái item
- Item đã đọc: text-secondary, no dot, opacity 0.7

Footer popover:
- Button "Xem tất cả thông báo →" full width primary outline

═══════════════════════════════════════════
FILE 2 — notification-center.html (full page)

Nhúng trong app shell (sidebar Thông báo active).

Page header:
H1: "Trung tâm thông báo"
Subtitle: "47 thông báo trong 30 ngày qua · 8 chưa đọc"
Right actions:
- Button outline "Cài đặt thông báo" (ti-settings)
- Button outline "Đánh dấu tất cả đã đọc"

Layout 2 cột (3/9):

Cột trái 3-col (sidebar filter):

Section "Loại thông báo":
- Checkbox group:
  ☑ Tuân thủ & Quy định (3)
  ☑ Tác vụ & Background job (5)
  ☑ Phản hồi khách hàng (4)
  ☑ CQT response (12)
  ☑ Rủi ro & AI cảnh báo (3)
  ☑ Gói & Thanh toán (2)
  ☑ Cài đặt & RBAC (4)

Section "Mức độ":
- Radio: Tất cả / Quan trọng / Bình thường / Thông tin

Section "Khoảng thời gian":
- Radio: 7N / 30N / 90N / Tùy chọn

Section "Trạng thái":
- Checkbox: Chưa đọc / Đã đọc / Đã xử lý

Section saved view (Phase 2 placeholder):
- "Cài đặt rule routing (Phase 2) →"

Cột phải 9-col (list):

Header row:
- Search input "Tìm thông báo..."
- Sort dropdown "Mới nhất ▾"
- Density toggle Comfortable/Compact

List 20 notification stack vertical, mỗi item là card lớn (padding 16px):
- Top row: icon + type badge + timestamp + 3-dot menu (⋯: Đánh dấu đã đọc / Lưu / Bỏ qua)
- Title bold
- Body 2-3 dòng
- Action button(s) inline
- Tag related entity (link HĐ-2026-XXX, link Customer name, link Job ID)

Mix mock data realistic:
- 3 regulation notif (NĐ dự thảo, NĐ 70 milestone, TT 32 update)
- 5 job result (bulk issue, daily aggregation, sync amis, email batch fail, webhook retry)
- 4 customer feedback (yêu cầu điều chỉnh, ký số xong, từ chối, email bounce)
- 12 CQT response (10 accepted, 2 rejected with reason)
- 3 risk (NCC mới rủi ro, MST verify expired, AI flag pattern)
- 2 plan (82% usage, plan renewal in 15d)
- 4 settings (user added, role changed, password rotation reminder, secret rotation)

Footer pagination cursor.

═══════════════════════════════════════════
STATE COVERAGE

- Default: 20 mix notification
- Empty: "Bạn đã xử lý hết thông báo 🎉" với illustration
- Loading skeleton
- Filter zero result

═══════════════════════════════════════════
ACCEPTANCE

- 2 file riêng: popover snapshot + full page
- 8 unread variant ở popover
- 20 item full page với mix realistic 7 type
- Mỗi item có CTA actionable
- Reference NĐ 70/2025 ở regulation item
- Dark mode pass
- Popover keyboard accessible (Esc close, Tab navigate)

═══════════════════════════════════════════
OUTPUT

2 file HTML. Header comment mỗi file đúng path source.

<!--
  Generated from: vibe_design_prompts/09_notification_center.md
  Screen: Notification Center (popover + full page)
  Persona: Tất cả
  JTBD: Nhắc việc cần xử lý, không bỏ sót
  States: default / empty / loading / zero-filter
-->

Sau artifact, list:
- Item count popover vs full page
- Type distribution full page
- A/B opportunity (chia tab vs sidebar filter)
```

---

## Variants

- **Mobile notification:** "Full screen mobile cho notification, swipe-to-dismiss + pull-to-refresh"
- **Slack-style threads:** "Group notification theo entity (vd nhiều event cùng HĐ-0142 nest dưới 1 thread)"
