# FEATURE PROMPT — Wizard Xử lý Sai sót Hóa đơn

**Phase:** 2 · **Effort:** 4-5 ngày · **Persona:** Backend + Frontend + Tax counsel review
**Pre-read:** Phase 2 §"Feature 3", Master Context §11 (NĐ 70/2025: bỏ thủ tục hủy)

---

## Mục tiêu

Giảm thời gian kế toán xử lý sai sót hóa đơn từ 15-30 phút xuống <5 phút. Wizard 5 bước decision tree, auto-generate biên bản điều chỉnh đúng template TT 32/2025, workflow ký xác nhận đơn giản (Phase 2) hoặc e-sign (Phase 3).

## Acceptance Criteria

- [ ] Wizard 5-step UI với progress indicator
- [ ] Decision tree dẫn đúng nghiệp vụ: điều chỉnh / thay thế (theo NĐ 70 không còn hủy)
- [ ] Auto-generate biên bản PDF chuẩn TT 32 với placeholder điền sẵn
- [ ] Ký xác nhận đơn giản (OTP qua email/SMS) cho Phase 2
- [ ] Audit trail đầy đủ: ai làm, lý do, before/after
- [ ] Time-to-process target <5 phút (đo từ click → submit)
- [ ] Compliance: tax counsel approval cho biên bản template
- [ ] Edge case: hóa đơn pending CQT, hóa đơn đã CQT chấp nhận, hóa đơn replaced trước đó

## Prompt cho AI

```
Build Wizard xử lý sai sót feature. CRITICAL: theo NĐ 70/2025 đã BỎ
thủ tục "hủy" → chuyển sang "điều chỉnh" hoặc "thay thế". UI/copy
phải dùng đúng terminology mới.

Decision tree (5 step):

Step 1: "Bạn muốn sửa gì?"
  Options:
  - Sai MST khách
  - Sai địa chỉ khách
  - Sai số tiền (tăng / giảm)
  - Sai sản phẩm (thêm / bớt / sửa qty)
  - Sai thuế suất
  - Khách trả hàng (return)
  - Khách hủy đơn (cancel)
  - Khác (custom note)

Step 2: "Hóa đơn đã được CQT chấp nhận chưa?"
  - Yes → flow điều chỉnh / thay thế
  - No (đang pending) → flow recall (hủy ngầm khi chưa CQT chấp nhận)

Step 3: System đề xuất nghiệp vụ
  Logic theo NĐ 70:
  - Sai MST/địa chỉ + đã CQT accept → ĐIỀU CHỈNH (chỉ sửa info, giữ tổng)
  - Sai số tiền (tăng) → ĐIỀU CHỈNH TĂNG
  - Sai số tiền (giảm) → ĐIỀU CHỈNH GIẢM
  - Sai sản phẩm / khách trả → THAY THẾ (tạo hóa đơn mới, mark cũ
    "đã thay thế")
  - Khách hủy hoàn toàn + chưa CQT accept → RECALL (hủy ngầm)
  - Khách hủy hoàn toàn + đã CQT accept → THAY THẾ với amount = 0 hoặc
    ĐIỀU CHỈNH GIẢM toàn bộ

  UI: hiển thị "Hệ thống đề xuất: [nghiệp vụ]. Lý do: [...]" + button
  "Đồng ý" / "Chọn nghiệp vụ khác"

Step 4: Form điều chỉnh / thay thế
  - Pre-fill data từ hóa đơn gốc
  - Highlight field user phải sửa
  - Preview biên bản điều chỉnh PDF inline (right pane)
  - Validation real-time

Step 5: Submit + Workflow ký
  - Generate biên bản PDF cuối cùng
  - Action options:
    a) "Phát hành ngay" (cho trường hợp biên bản đã ký offline)
    b) "Gửi khách ký xác nhận" → flow OTP
       - System gửi link cho khách qua email/Zalo
       - Khách click → web view biên bản → nhập OTP từ SMS/email →
         confirm
       - Sau khách ký → tự động submit Hilo
    c) "Lưu nháp" → status 'draft', kế toán review later

Implement chi tiết:

1. Backend service apps/gateway/src/services/correction/:
   - CorrectionService.suggest(invoiceId, errorType): trả nghiệp vụ đề xuất
   - CorrectionService.preview(invoiceId, correctionData): generate biên bản preview
   - CorrectionService.submit(invoiceId, correctionData, signMethod): execute

2. Biên bản template (PDF generation):
   - Library: PDFKit hoặc Puppeteer (HTML → PDF, dễ template)
   - Template HTML: chuẩn TT 32/2025 layout, header logo, body với
     bảng before/after, footer chữ ký
   - Placeholder: ${oldInvoiceNumber}, ${newInvoiceNumber}, ${reason},
     ${oldAmount}, ${newAmount}, ${itemsBefore}, ${itemsAfter}, etc.
   - Generate Vietnamese layout đúng

3. Hilo API integration:
   - Call HiloAdapter.adjust() hoặc .replace() tùy nghiệp vụ
   - Map correctionData → Hilo schema
   - Handle Hilo error response

4. OTP flow (apps/gateway/src/services/correction/otp.service.ts):
   - generateOtp(target: email|phone): tạo 6-digit OTP, lưu Redis 5 phút
   - sendOtp(target, otp, context): gửi qua email/SMS provider
   - verifyOtp(target, otp): check Redis, mark used

5. Customer signing portal (web view public):
   - URL: /correction-sign/{shortToken}
   - Page hiển thị biên bản, button "Đồng ý ký", input OTP, submit
   - Sau ký → trigger backend execute correction
   - UI hiển thị "Cảm ơn quý khách đã xác nhận"

6. Frontend wizard UI (apps/portal/src/pages/invoices/correction/):
   - 5-step wizard component (dùng react-hook-form + zod)
   - Progress bar
   - Back/Next button
   - Sidebar preview pdf inline
   - Submit confirm modal

7. Edge cases:
   - Hóa đơn đã thay thế trước đó → block correction trên hóa đơn gốc,
     redirect tới hóa đơn replacement
   - Hóa đơn pending CQT >24h → flag warning "Chờ CQT response trước
     khi correct"
   - Customer email/phone không có → bypass OTP, kế toán ký giấy upload

8. Audit log:
   - Log: original invoice ID, new invoice ID (nếu thay thế), error
     type, user who corrected, timestamp, signing method, OTP
     verification timestamp, before/after data snapshot

9. Tests:
   - Unit: decision tree logic 10+ scenario
   - Snapshot: biên bản template render đúng
   - Integration: full flow → Hilo adjust/replace → status update
   - E2E: wizard 5 step → submit OTP flow

10. Compliance:
    - Tax counsel review:
      * Biên bản template format đúng TT 32/2025
      * Decision tree logic đúng NĐ 70 (nghiệp vụ thay hủy = thay thế)
      * Audit retention requirement
    - Document approval signed off

11. Performance:
    - Wizard load <1s
    - PDF generation <2s
    - Submit end-to-end <5s

Mark `// TODO`:
- Tax counsel review template biên bản
- Email/SMS provider chọn cho OTP
- E-signature integration (Phase 3 enhancement)
```

## Verification Checklist

- [ ] Wizard 5 step navigation work
- [ ] Decision tree đề xuất đúng nghiệp vụ cho 8 error type
- [ ] PDF biên bản render đúng template, validate bởi tax counsel
- [ ] OTP gửi + verify thành công
- [ ] Customer signing portal mobile responsive
- [ ] Time-to-process <5 phút trong test thật với 5 kế toán
- [ ] Audit trail đầy đủ trace từ click → submit
- [ ] Edge case "đã replaced" handle đúng
