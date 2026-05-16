# 12 — State Patterns Library

> **Cách dùng:** Paste prompt để generate `states-library.html` — bộ pattern reference cho mọi state operation (loading/empty/error/partial/success). Dùng làm thư viện để dev copy snippet, không phải screen độc lập trong app.

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01).

Task: Generate `states-library.html` — pattern library cho operational states.
Mục tiêu: dev có 1 file reference với 30+ pattern state có thể copy class/HTML snippet áp dụng vào mọi screen.

═══════════════════════════════════════════
LAYOUT

Sidebar TOC 240px sticky + content scroll.

Section anchor:
1. Loading states (6 pattern)
2. Empty states (8 pattern)
3. Error states (6 pattern)
4. Partial success states (4 pattern)
5. Success/Confirm states (4 pattern)
6. Skeleton library (10 component skeleton)
7. Progressive disclosure & pending (4 pattern)

Mỗi pattern: title H3 + use case caption + preview live + HTML snippet copy code.

═══════════════════════════════════════════
PHẦN 1 — Loading states (6 pattern)

1. Inline button loading: button có spinner inline trái + text "Đang xử lý..."
2. Full page loading: center spinner lớn + caption brand
3. Skeleton list: 6 row pulse animation
4. Skeleton table: 5 col × 8 row pulse
5. Skeleton card grid: 4 card pulse
6. Progressive disclosure loading: section đã render + section sau lazy load với spinner inline

═══════════════════════════════════════════
PHẦN 2 — Empty states (8 pattern)

Mỗi empty state: illustration mock (Tabler icon size 64 hoặc SVG đơn giản) + H2 + body + 1-2 CTA.

1. Empty list "Chưa có hóa đơn nào" + "Phát hành hóa đơn đầu tiên" (primary) + "Import từ Excel" (secondary)
2. Empty filter "Không tìm thấy hóa đơn khớp filter" + "Reset filter" (primary) + "Đổi khoảng thời gian"
3. Empty search "Không có kết quả cho 'XYZ'" + tips "Thử tìm bằng MST hoặc số đơn hàng"
4. Empty notification "🎉 Bạn đã xử lý hết thông báo" + CTA "Xem cài đặt thông báo"
5. Empty audit log "Tenant mới, chưa có hoạt động" + tip "Sau khi phát hành HĐ đầu tiên, audit log sẽ hiện ở đây"
6. Empty T-VAN "Chưa kết nối T-VAN nào" + CTA "Bắt đầu wizard onboarding"
7. Empty AI insight (Phase 3) "Cần ít nhất 30 ngày dữ liệu để AI phân tích" + progress "Bạn đã có 12/30 ngày"
8. Empty selection "Chưa chọn hóa đơn nào" + tip "Tick checkbox để bắt đầu thao tác bulk"

═══════════════════════════════════════════
PHẦN 3 — Error states (6 pattern)

1. Inline error banner top "Không tải được dữ liệu — Mã lỗi TRX-4521" + button "Thử lại" + link "Báo lỗi"
2. Field validation error "MST không hợp lệ — chỉ chấp nhận 10 hoặc 13 chữ số" border đỏ + icon
3. Full page error 500 "Hệ thống đang gặp sự cố" + retry + status page link
4. Network offline "Bạn đang offline — đã lưu thay đổi local" + auto reconnect indicator
5. CQT reject "HĐ-2026-0184 bị CQT từ chối với mã M042" + reason + button "Mở wizard sai sót"
6. Rate limit "Bạn đã thao tác quá nhanh — vui lòng chờ 30 giây" + countdown

═══════════════════════════════════════════
PHẦN 4 — Partial success states (4 pattern)

1. Bulk issue "28/30 HĐ thành công, 2 HĐ lỗi" + button "Xem 2 lỗi" + button "Phát hành lại 2 HĐ"
2. Import Excel "120 dòng OK, 5 dòng cảnh báo, 3 dòng lỗi" + tabs review
3. Email delivery "Đã gửi 100 email, 3 bounce" + list 3 bounce email với button "Sửa địa chỉ"
4. Multi-channel delivery "Email sent ✓ · Zalo OA wait · Portal link OK" — mixed status

═══════════════════════════════════════════
PHẦN 5 — Success states (4 pattern)

1. Toast success top-right "Phát hành thành công HĐ-2026-0185" + link "Xem chi tiết"
2. Modal success post-action với icon big + summary + 3 CTA (đã render ở screen 05)
3. Inline confirmation "✓ Đã lưu cấu hình" fade-in 2s rồi mất
4. Page-level success "Hoàn tất setup MVP — 8 bước done" với confetti minimal

═══════════════════════════════════════════
PHẦN 6 — Skeleton library (10 component)

Skeleton block cho 10 component thường dùng:
- Card KPI skeleton
- Table row skeleton
- Avatar list skeleton
- Form input skeleton
- Tab nav skeleton
- Chart skeleton
- Drawer detail skeleton
- Notification item skeleton
- Filter chip row skeleton
- Stepper skeleton

Animation: subtle pulse 1.5s ease-in-out infinite, không quá flashy.

═══════════════════════════════════════════
PHẦN 7 — Progressive disclosure & pending (4 pattern)

1. CQT pending "Đang chờ CQT xác nhận..." với dot pulse + auto refresh 30s
2. Background job progress "Bulk issue: 12/30 HĐ done" + progress bar + "Background — bạn có thể đóng tab"
3. Signing wait "Đang chờ khách ký số (4 giờ trước)" + button "Nhắc lại qua Zalo"
4. Lazy section "Xem 21 rule khác ▾" expandable

═══════════════════════════════════════════
INTERACTION

- Mỗi pattern có button "Copy HTML" copy snippet vào clipboard
- Toggle "Light / Dark" preview
- Toggle "Mobile / Desktop" preview (CSS resize iframe)

═══════════════════════════════════════════
ACCEPTANCE

- Đủ 7 phần với count đúng
- Mỗi pattern có HTML snippet rõ + class utility
- Skeleton animation hoạt động
- Toast position đúng (top-right desktop, top-center mobile)
- Empty state có illustration + CTA + tip
- Error state có error code mock + retry
- Dark mode pass tất cả

═══════════════════════════════════════════
OUTPUT

1 file HTML.

<!--
  Generated from: vibe_design_prompts/12_states_patterns.md
  Screen: State Patterns Library
  Purpose: Reference cho dev copy snippet áp dụng vào screen 03-11
  Sections: 7 (loading/empty/error/partial/success/skeleton/pending)
-->

Sau artifact, list:
- Pattern count tổng
- Section nào thiếu nếu bạn detect screen 03-11 cần thêm pattern khác
- Snippet copy feature hoạt động
```

---

## Variants

- **VN tone variant:** "Variant copy text dùng từ ngữ chuẩn nghiệp vụ kế toán VN, tránh dịch từ Anh"
- **Multi-language scaffold:** "Thêm dropdown switch VI/EN cho mỗi pattern để chuẩn bị i18n Phase 4"
