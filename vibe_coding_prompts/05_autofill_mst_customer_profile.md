# FEATURE PROMPT — Auto-fill MST từ Customer Profile (RICE 81.000)

**Phase:** 2 · **Effort:** 3-4 ngày · **Persona:** Backend + Frontend
**Pre-read:** Phase 2 §"Feature 1"

---

## Mục tiêu

Loại bỏ thao tác kế toán/thu ngân nhập MST thủ công khi khách đã có MST trong Customer Profile của Haravan. Tích hợp tra cứu doanh nghiệp qua API CQT, validate real-time, prompt cập nhật khi MST mới.

## Acceptance Criteria

- [ ] Form phát hành tự fill MST khi chọn customer có MST trong profile
- [ ] Badge "MST đã verify ngày X" nếu MST đã verify <30 ngày
- [ ] Validate format real-time (debounce 500ms)
- [ ] Lookup CQT API → trả tên doanh nghiệp + địa chỉ + status active
- [ ] Cache lookup 24h (Redis)
- [ ] Prompt "Lưu MST này vào profile khách?" sau khi save invoice với MST mới
- [ ] Block submit nếu MST không hợp lệ hoặc doanh nghiệp ngừng hoạt động
- [ ] Audit log: ai update MST, khi nào, source (manual/auto/lookup)

## Prompt cho AI

```
Build Auto-fill MST feature. Tham chiếu Phase 2 plan §Feature 1.

Step-by-step:

1. Backend service: apps/gateway/src/services/mst-lookup.service.ts
   - Function validateMstFormat(mst: string): { valid: boolean; reason?: string }
     * Rule: 10 hoặc 13 ký tự số, checksum theo công thức TCT
     * Test cases: '0123456789', '0123456789-001', '0100109106' (real
       MST check valid), 'abc', '12345', ''
   - Function lookupBusinessByMst(mst: string): Promise<BusinessInfo | null>
     * Cache key: `mst:lookup:${mst}`, TTL 24h
     * Fallback nếu API CQT down: trả null + log warning
     * Note: API CQT công khai có rate limit, implement queue/throttle

2. API endpoint:
   - GET /v1/mst/validate?mst={mst} → { valid, reason, business?: BusinessInfo }
   - Auth required, rate limit per merchant 60 req/min

3. Customer Profile integration:
   - Read: GET /v1/customers/{id}/mst → trả MST + verifiedAt + verifiedBy
   - Write: PATCH /v1/customers/{id}/mst với { mst, source: 'manual' | 'auto' | 'lookup' }
   - Auto-update: khi user save invoice với MST khác customer profile,
     trigger prompt "Cập nhật MST cho khách [Tên]?" → checkbox opt-in

4. Frontend integration trong Invoice Form (apps/portal/src/components/invoice/InvoiceForm.tsx):
   - MSTValidator component:
     - Input field, debounce 500ms
     - Trigger validate format → trigger lookup CQT
     - Show inline:
       * Loading spinner khi đang lookup
       * Green check + tên doanh nghiệp nếu valid + active
       * Red X + reason nếu invalid hoặc inactive
       * Yellow warning nếu lookup fail (network) — cho phép submit
         với confirm
   - Auto-fill khi customer chọn:
     - Check customer.mst exist?
     - Nếu có: auto-fill + show badge "Đã verify ngày X"
     - Nếu không: input rỗng, placeholder "Nhập MST khách (nếu có)"
   - "Tra cứu doanh nghiệp" button: explicit trigger lookup nếu user
     muốn re-verify

5. Customer autocomplete:
   - Trong form phát hành, field "Khách hàng" là autocomplete
   - Search by tên/SDT/email từ Customer API
   - Show dropdown với tên + MST (nếu có) + last invoice date
   - Onselect → fill toàn bộ customer info + MST

6. Save invoice flow:
   - Validate MST trước submit (block nếu invalid)
   - Sau success: nếu MST khác customer profile → prompt cập nhật
   - Cập nhật trigger PATCH /v1/customers/{id}/mst

7. Migration / campaign cho merchant chưa có MST trong Customer Profile:
   - One-time job scan: list customer chưa có MST nhưng đã có invoice
     có MST trong 6 tháng → auto-populate (với consent flag)
   - Email merchant: "Có 234 khách đã có MST trong hóa đơn nhưng
     Customer Profile chưa cập nhật. [Đồng ý cập nhật tất cả]"

8. Tests:
   - Unit: validateMstFormat với 20+ test case (edge: leading zero,
     all same digit, etc.)
   - Mock CQT API response cho test lookup
   - Component test MSTValidator: typing → debounce → lookup → result
   - E2E: form phát hành với customer có MST → auto-fill work

9. Performance:
   - Lookup latency p95 <800ms (bao gồm CQT call)
   - Cache hit rate target ≥80%
   - Batch lookup endpoint cho campaign migration: POST /v1/mst/batch-lookup

10. Compliance:
    - Audit log mọi cập nhật MST
    - Customer consent flag nếu auto-update MST (opt-in mặc định off)
    - Document GDPR/PDPA compliance (Vietnam data privacy)

Mark `// TODO`:
- API CQT public endpoint exact URL + rate limit (cần verify thực tế)
- Customer API Haravan endpoint exact
- Checksum algorithm cho MST 13 ký tự (cần xác nhận với accountant)
```

## Verification Checklist

- [ ] Chọn customer có MST → form tự fill, badge verify hiển thị
- [ ] Type MST mới → debounce 500ms → lookup → tên doanh nghiệp hiển thị
- [ ] Type MST invalid → red X + reason rõ
- [ ] Type MST của doanh nghiệp ngừng hoạt động → block submit
- [ ] Save invoice với MST mới → prompt cập nhật profile
- [ ] CQT API down → graceful degrade, vẫn cho submit với warning
- [ ] Cache hit rate ≥80% sau 24h chạy thật
- [ ] 20+ test case validate format pass
