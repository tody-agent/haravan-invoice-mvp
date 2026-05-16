# 07 — Compliance Center

> **Cách dùng:** Paste prompt để generate `compliance-center.html`. Persona: Owner + Kế toán. RICE #4 — pre-empt audit CQT, build trust.

---

## Prompt to paste vào Claude

```
Tham chiếu Master Context Haravan Invoice MVP v1.0 + Design System (01) + App Shell (02).

Task: Generate `compliance-center.html` — màn hình Compliance Center với 7 rule checklist,
audit timeline real-time, banner regulation update.

═══════════════════════════════════════════
PERSONA + JTBD

Persona: Owner (yên tâm), Kế toán (chuẩn bị audit), Internal compliance officer (review).
JTBD:
- "Khi CQT có thể audit bất cứ lúc nào, tôi muốn biết hệ thống đang compliance ở mức nào,
  có rule nào đang fail không, để fix trước khi bị catch."
- "Khi quy định mới ban hành (vd dự thảo NĐ 2026), tôi muốn được biết và biết phải làm gì."

═══════════════════════════════════════════
PAGE HEADER

Breadcrumb: Hóa đơn › Tuân thủ
H1: "Trung tâm Tuân thủ"
Subtitle: "Theo dõi compliance NĐ 123/2020 + NĐ 70/2025 + TT 32/2025 + QĐ 1510/2022"
Right actions:
- Button outline "Tải báo cáo compliance (PDF)" (ti-file-download)
- Button outline "Lịch sử kiểm toán nội bộ" (ti-history)
- Dropdown "Kỳ báo cáo: Tháng 05/2026 ▾"

═══════════════════════════════════════════
SECTION 1 — Regulation update banner (top)

Banner alert info large (full width, dismissible per banner):
- Icon ti-megaphone lớn
- Title: "📢 Đang theo dõi: Dự thảo NĐ thay thế NĐ 123+70 (thẩm định 21/04/2026)"
- Body: "Bộ Tư pháp đã công bố tài liệu thẩm định. Có thể ban hành trong 6-18 tháng. Haravan đang map các thay đổi tiềm năng và sẽ cập nhật Compliance Center khi có hiệu lực chính thức."
- CTA: button "Xem timeline regulation" + link "Đăng ký nhận thông báo"

Banner success (collapsible):
- "✓ NĐ 70/2025 + TT 32/2025 đã được system enforce từ 01/06/2025"
- Link "Xem 12 thay đổi đã apply →"

═══════════════════════════════════════════
SECTION 2 — 3 KPI compliance cards (row)

Mỗi card với big stat + progress bar:

1. "Tỷ lệ rule PASS" — 96% (27/28 rule)
   * Progress bar 96% success color
   * Caption "1 rule WARNING, 0 rule FAIL"
2. "HĐ vi phạm 30 ngày qua" — 0
   * Caption green "Không có vi phạm"
   * Icon ti-shield-check
3. "Audit event 30 ngày" — 8.234
   * Caption "Tất cả đều có trace_id đầy đủ"
   * Sparkline mini

═══════════════════════════════════════════
SECTION 3 — Compliance Rules checklist (full width)

Card với header "Checklist compliance rules" + tabs filter "Tất cả (28) / Pass (27) / Warning (1) / Fail (0) / Disabled (0)" + search rule input

Table/list 7 rule core PASS + 1 rule WARNING + extra (collapse expand for 28 total):

Format mỗi rule row:
┌──────────────────────────────────────────────────────────────────┐
│ [Status icon] [Rule name]              [Severity badge] [Toggle] │
│ Reference: NĐ X §Y · TT Z §W                                     │
│ Description: ngắn 1-2 dòng                                       │
│ Last checked: 2 phút trước · Affected: 1.247 invoices            │
│ [Show detail ▾]                                                  │
└──────────────────────────────────────────────────────────────────┘

7 rule chính render đầy đủ:
1. ✓ MST người mua phải verify với CQT trong 30 ngày
   - Reference: NĐ 123/2020 §10
   - "Hệ thống tự động check MST trong cache 30 ngày + lookup CQT khi miss"
2. ✓ Mọi hóa đơn phải có chứng thư số người ký còn hạn
   - Reference: NĐ 70/2025 §5
   - "Cảnh báo 30 ngày trước khi chứng thư hết hạn"
3. ✓ KHÔNG cho phép hủy hóa đơn — chỉ điều chỉnh/thay thế
   - Reference: NĐ 70/2025 §7
   - "UI không có button Hủy, API không có endpoint cancel"
4. ✓ Định dạng dữ liệu truyền CQT đúng QĐ 1510
   - Reference: QĐ 1510/QĐ-TCT
   - "Gateway map domain Haravan ↔ Hilo theo schema 1510"
5. ✓ Audit log immutable cho mọi hành động trên hóa đơn
   - Reference: NĐ 123 §6.4 + best practice
   - "D1 append-only + dual sink GCP Cloud Logging"
6. ⚠ HKD ≥1 tỷ doanh thu phải kết nối máy tính tiền
   - Reference: NĐ 70/2025 §1 + §11
   - WARNING: "1 cửa hàng (Trung Nguyên Q1) đã vượt ngưỡng nhưng chưa cấu hình kết nối máy tính tiền. Cần xử lý trước 30/06/2026."
   - CTA inline: "Cấu hình máy tính tiền →"
7. ✓ Báo cáo doanh thu định kỳ với CQT
   - Reference: NĐ 123 §22 + TT 32 §8
   - "Tự động generate báo cáo cuối tháng, gửi qua Hilo"

Còn 21 rule khác → "Hiển thị 21 rule khác ▾" (collapsible)

═══════════════════════════════════════════
SECTION 4 — Audit timeline (real-time)

Card 8-col bên trái + Stat panel 4-col bên phải:

Audit timeline (left):
- Header: H3 "Audit log real-time" + filter chip "30 ngày qua" + button "Export"
- Vertical timeline 15 event, mỗi event:
  * Icon theo loại action
  * Timestamp "Hôm nay 14:47" + user avatar
  * Action description: "Phát hành HĐ-2026-0185 cho Vinamilk (12.450.000 ₫)"
  * Trace_id mono nhỏ "TRX-9c7f4a..."
  * Badge action type: ISSUE / ADJUST / REPLACE / EXPORT / LOGIN / SETTINGS
- Pagination cursor footer

Stat panel (right) — sticky:
- Card "Audit event breakdown 30 ngày"
- Stacked bar chart mock + legend:
  * ISSUE 6.823
  * ADJUST 142
  * REPLACE 38
  * EXPORT 412
  * LOGIN 1.823
  * SETTINGS 18
- Caption "Mọi event có trace_id đầy đủ. Sink dự phòng GCP Cloud Logging."

═══════════════════════════════════════════
SECTION 5 — Document references

Card với H3 "Văn bản pháp luật áp dụng"

Bảng 4 col × 6 row:
| Văn bản | Hiệu lực | Trạng thái system | Link |
|---------|----------|-------------------|------|
| NĐ 123/2020/NĐ-CP | 01/07/2022 | ✓ Đang enforce | chinhphu.vn |
| TT 78/2021/TT-BTC | 01/07/2022 | ⊝ Bị thay bởi TT 32 | thuvienphapluat.vn |
| QĐ 1510/QĐ-TCT 2022 | 2022 | ✓ Đang enforce | gdt.gov.vn |
| **NĐ 70/2025/NĐ-CP** | **01/06/2025** | ✓ Đang enforce | chinhphu.vn |
| **TT 32/2025/TT-BTC** | **01/06/2025** | ✓ Đang enforce | thuvienphapluat.vn |
| Dự thảo NĐ thay thế 2026 | Đang thẩm định | ⏳ Đang theo dõi | botuphap.gov.vn |

═══════════════════════════════════════════
SECTION 6 — Section "Recommendations từ Copilot" (bottom)

Card với icon ti-sparkles:
- "Copilot gợi ý 3 hành động ưu tiên cao để tăng compliance score:"
- List 3 item:
  1. "Cấu hình máy tính tiền cho cửa hàng Trung Nguyên Q1 trước 30/06/2026 (NĐ 70 §1)" — button "Bắt đầu cấu hình"
  2. "Cập nhật chữ ký số sắp hết hạn 18/07/2026 (còn 63 ngày)" — button "Gia hạn ngay"
  3. "Review template hóa đơn theo TT 32/2025 §2 — 1 template chưa migrate" — button "Mở template editor"

═══════════════════════════════════════════
STATE COVERAGE

- Default: 27 pass + 1 warning + 0 fail
- Variant Worst: 24 pass + 3 warning + 1 fail (banner đỏ top + Compliance score drop xuống 86%)
- Loading skeleton rule list
- Empty state nếu tenant mới chưa có audit event nào trong 30 ngày

═══════════════════════════════════════════
ACCEPTANCE

- 7 rule core đều có reference NĐ/TT/QĐ rõ ràng
- Banner regulation update nêu dự thảo NĐ 2026 — chỉ "đang theo dõi", chưa enforce
- Rule #3 EXPLICIT "KHÔNG cho phép hủy hóa đơn — chỉ điều chỉnh/thay thế" với reference NĐ 70/2025 §7
- Audit timeline có trace_id mono cho mỗi event
- Document table có cả TT 78 ở trạng thái "Bị thay" để thể hiện history
- Recommendations Copilot có 3 action có CTA inline
- Dark mode pass

═══════════════════════════════════════════
OUTPUT

Trả 1 file HTML. Header comment:

<!--
  Generated from: vibe_design_prompts/07_compliance_center.md
  Screen: Compliance Center
  Persona: Owner + Kế toán
  JTBD: Biết compliance hiện tại + pre-empt audit + theo dõi regulation
  Reference: NĐ 123 + NĐ 70/2025 + TT 32/2025 + QĐ 1510 + dự thảo NĐ 2026
  States: default-healthy / worst-with-fail / loading / empty
-->

Sau artifact, list:
- Rule với reference văn bản (7 core verify)
- Audit timeline event count + trace_id
- Verify rule #3 enforcement "KHÔNG hủy"
```

---

## Variants

- **Audit-mode (CQT actor view):** "Variant: ẩn Copilot recommendation, full audit log table với search/filter, export CSV"
- **Executive snapshot:** "1-page summary chỉ KPI + 3 recommendation + top regulation change"
