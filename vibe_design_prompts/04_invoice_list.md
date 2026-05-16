# 04 — Danh sách hóa đơn

> **Cách dùng:** Paste prompt để generate `invoice-list.html`. Persona ưu tiên: Kế toán (use case tần suất cao nhất hàng ngày).

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01) + App Shell (02).

Task: Generate `invoice-list.html` — màn hình danh sách hóa đơn với filter, search, bulk action,
và drawer detail.

═══════════════════════════════════════════
PERSONA + JTBD

Persona: Kế toán (chính), Owner (xem audit), Thu ngân (lookup nhanh).
JTBD:
- "Khi khách gọi lên hỏi 'hóa đơn của tôi đâu?', tôi muốn tìm thấy trong <10 giây bằng MST/SĐT/số HĐ."
- "Khi cuối tháng tôi cần đối soát với kế toán, tôi muốn filter theo period + status để xuất Excel."
- "Khi có hóa đơn bị từ chối, tôi muốn thấy nổi bật và biết phải làm gì."

═══════════════════════════════════════════
PAGE HEADER

Breadcrumb: Hóa đơn › Danh sách
H1: "Danh sách hóa đơn"
Subtitle: "Quản lý hóa đơn điện tử đầu ra và đầu vào"
Right actions:
- Button outline "Xuất Excel" (ti-download)
- Button outline "Gộp đơn cuối ngày" (ti-stack-2) — tooltip "TT 32/2025 cho phép gộp lẻ"
- Button primary "Phát hành mới" (ti-plus)

═══════════════════════════════════════════
TABS PHÂN LOẠI

Tabs underline phong cách Polaris, 6 tab với count badge:
1. Tất cả (1.247)
2. HĐ điện tử (1.198) — default active
3. HĐ máy tính tiền (NĐ 70) (38)
4. Hóa đơn đầu vào (52)
5. Đã điều chỉnh (8)
6. Đã thay thế (3)

Lưu ý: KHÔNG có tab "Đã hủy" — bỏ theo NĐ 70/2025.

═══════════════════════════════════════════
FILTER + SEARCH BAR

Row dưới tabs, 3 zone:

Zone 1 (search left): input search width 360px với icon ti-search, placeholder
"Tìm số HĐ, MST, tên khách, số đơn hàng..." — có Cmd+F shortcut hint right inside

Zone 2 (filter middle): các filter chip
- Period chip: "30 ngày qua ▾" với calendar icon
- Trạng thái chip: "Tất cả trạng thái ▾"
- Kênh chip: "Tất cả kênh ▾"
- Chi nhánh chip: "Tất cả chi nhánh ▾"
- Khách hàng chip: "Tất cả khách hàng ▾"
- More filters button (...) ti-adjustments — popover expand thêm: MST khách, người lập, T-VAN provider, AI flag

Zone 3 (right): icon button toggle view "Table | Card grid" (ti-table / ti-grid-dots)
+ icon button settings cột hiển thị (ti-columns)

Active filter chip có badge close × bên phải. Khi nhiều filter active → button "Reset" text-only xuất hiện.

═══════════════════════════════════════════
BULK ACTION BAR (conditional, hiện khi có row selected)

Sticky bar trên top of table (slide-down animation):
- Text: "Đã chọn 12 hóa đơn" + link "Bỏ chọn tất cả"
- Spacer
- Button outline icon "Gửi lại email" (ti-mail)
- Button outline icon "Tải PDF" (ti-file-download)
- Button outline icon "Xuất Excel" (ti-table-export)
- Button outline icon "In hàng loạt" (ti-printer)
- Dropdown "Thao tác khác ▾": Gắn nhãn, Xuất biên bản, Đánh dấu đối soát

LƯU Ý: KHÔNG có bulk action "Hủy hóa đơn".

═══════════════════════════════════════════
TABLE (full width)

Cấu trúc 9 cột × 25 row default:

1. Checkbox cột chọn (header có checkbox select-all với indeterminate)
2. Số HĐ — mono font, có icon copy hover, link → drawer detail
3. Ngày phát hành — format "DD/MM/YYYY HH:mm"
4. Khách hàng — name + MST mono caption
5. Kênh — badge icon Web/POS/Admin/API
6. Tổng tiền — mono align-right, VND format dấu chấm ngăn ngàn
7. Trạng thái — badge semantic
8. AI flags — col nhỏ, icon ⚠ hover tooltip mô tả risk
9. Action menu (⋯) — popover: "Xem chi tiết / Tải PDF / Gửi lại / Điều chỉnh / Thay thế"
   (KHÔNG có "Hủy")

Row state:
- Default: bg surface
- Hover: bg surface-hover
- Selected: bg primary-soft + border-left 3px primary
- Risk highlight (NCC cảnh báo): bg --hv-danger-soft nhạt + dot đỏ trước số HĐ

Status badge variants:
- Đã phát hành (success)
- Đang chờ CQT (warning + dot pulsing)
- Bị từ chối (danger)
- Đã điều chỉnh (info)
- Đã thay thế (info)
- Bản nháp (muted)

═══════════════════════════════════════════
MOCK DATA (25 row đa dạng)

Mix:
- 18 row "Đã phát hành" thường
- 2 row "Đang chờ CQT" với dot pulse
- 1 row "Bị từ chối" với highlight đỏ + tooltip lý do
- 2 row "Đã điều chỉnh" có badge lineage "← HĐ-2026-0142"
- 1 row "Đã thay thế"
- 1 row risk highlight NCC cảnh báo
- Mix kênh: 12 Web, 8 POS, 3 Admin, 2 API
- Khách hàng đa dạng: cá nhân + DN có MST 10 số + DN có MST 13 số (chi nhánh)

Tên doanh nghiệp mẫu:
- Công ty TNHH Cà phê Trung Nguyên Legend
- Công ty Cổ phần Vàng bạc Đá quý DOJI
- Công ty TNHH Một thành viên Vinamilk
- Công ty Cổ phần FPT
- Công ty TNHH Bánh Bao Tinh Tuý
- (cá nhân) Nguyễn Văn An — không có MST
- ...

═══════════════════════════════════════════
PAGINATION + DENSITY

Footer table:
- Left: dropdown "25 / trang ▾" (10/25/50/100)
- Center: pagination cursor "← Trước · 1-25 / 1.247 · Sau →" với jump-to-page input nhỏ
- Right: density toggle button ti-baseline-density-medium (Comfortable / Compact / Spacious)

═══════════════════════════════════════════
DRAWER DETAIL (snapshot, không animate)

Trượt từ phải, width 480px desktop, full mobile:

Header:
- Close button ti-x trái
- Số HĐ mono lớn + badge trạng thái + icon copy
- 3 dot menu (⋯) phải

Body chia tabs:
- Thông tin chung (default)
- Mặt hàng (line items)
- Lịch sử (timeline)
- Tài liệu (PDF, biên bản, XML link)

Tab "Thông tin chung":
- Section "Người bán" — tên DN, MST, địa chỉ, người ký
- Section "Người mua" — tên, MST với badge "Verified 02/05/2026", địa chỉ, email, SĐT (PII redact: "0312***" hiển thị)
- Section "Tổng cộng" — bảng tax breakdown: Tiền hàng, Chiết khấu, Thuế suất 8%/10%, Tổng tiền VND
- Section "Tham chiếu" — Order Haravan link, Channel, Branch, Người lập, Hilo invoice ID mono, CQT receipt code mono
- Section "AI flags" (nếu có) — list các flag với reference rule

Footer drawer:
- Button outline "Tải PDF" (ti-file-download)
- Button outline "Gửi lại email" (ti-mail)
- Button primary "Điều chỉnh / Thay thế" — dropdown 2 option (KHÔNG có hủy)

═══════════════════════════════════════════
STATE COVERAGE (toggle góc dưới)

1. Filled (default)
2. Empty (tenant mới): empty illustration ti-receipt-off + "Chưa có hóa đơn nào" + CTA "Phát hành hóa đơn đầu tiên" + link "Hoặc import từ Excel"
3. Empty (filter quá hẹp): "Không tìm thấy hóa đơn khớp filter" + button "Reset filter"
4. Loading: skeleton 25 row pulse
5. Error: banner đỏ + button "Thử lại" + trace_id "TRX-4521"
6. Partial (1 row bị reject in filled state): luôn render trong default

═══════════════════════════════════════════
ACCEPTANCE

- Đúng shell 02
- Tab + filter + bulk + table + drawer đầy đủ
- KHÔNG action "Hủy" ở bất kỳ menu/button nào
- AI flag tooltip hover hoạt động (CSS :hover hoặc JS tooltip)
- Row click → drawer mở (JS toggle hidden class)
- Bulk select toggle → bulk action bar slide-in (JS)
- Mock data realistic VN
- Mono cho mọi số HĐ, MST, tiền
- Dark mode pass

═══════════════════════════════════════════
OUTPUT

Trả 1 file HTML. Header comment:

<!--
  Generated from: vibe_design_prompts/04_invoice_list.md
  Screen: Danh sách hóa đơn
  Persona: Kế toán + Owner audit
  JTBD: Tìm nhanh + filter cuối tháng + xử lý reject
  States: filled / empty / empty-filtered / loading / error
-->

Sau artifact, list:
- Row total + breakdown theo status
- Tỉ lệ row có AI flag (verify 1-2 row)
- Drawer width thực tế trên 1280/768/375
- Đề xuất A/B layout filter rail bên phải vs top
```

---

## Variants

- **Card grid view:** "Variant: thay table bằng card grid 3-col, mỗi card invoice mini, thích hợp tablet POS"
- **Mobile-first list:** "Variant mobile: collapse table thành stack, mỗi row là card padding 12px, hide cột thứ yếu"
- **Saved filter views:** "Thêm dropdown bên trái 'Filter của tôi' với 3 saved view: Hôm nay, Đợi CQT, Bị reject"
