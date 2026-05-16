# FEATURE PROMPT — Gộp đơn lẻ cuối ngày (TT 78 / TT 32)

**Phase:** 2 · **Effort:** 4-5 ngày · **Persona:** Backend + Frontend + Tax counsel review
**Pre-read:** Phase 2 §"Feature 2", Master Context §11 (compliance landmark)

---

## Mục tiêu

Tự động gộp các giao dịch bán lẻ cuối ngày (khách không lấy hóa đơn, không có MST) thành 1 hóa đơn tổng theo TT 78/TT 32. Cho phép merchant config rule, manual override, và xem báo cáo gộp.

## Acceptance Criteria

- [ ] Cron job daily 23:30 chạy gộp cho ngày đó
- [ ] Manual button "Gộp ngay" trong Hóa đơn → Daily Summary
- [ ] Rule engine configurable per merchant (ngưỡng tiền, branch, exclude category)
- [ ] Hóa đơn tổng có format chuẩn TT 78 (mỗi line item = 1 ngày tổng theo SKU/category)
- [ ] Drill-down: từ hóa đơn tổng → list các phiếu tính tiền gốc
- [ ] Export báo cáo CSV/Excel cho kế toán
- [ ] Compliance: tax counsel review approval trước launch
- [ ] Audit log: thời điểm gộp, ai trigger, source data

## Prompt cho AI

```
Build feature Gộp đơn lẻ cuối ngày. CRITICAL compliance: phải đúng
TT 78 (và bản sửa đổi TT 32/2025). Trước khi launch BẮT BUỘC tax
counsel review.

Step-by-step:

1. Domain model (apps/gateway/src/services/daily-aggregation/):
   - DailyAggregationRule:
     * merchantId, branchId (optional, null = all)
     * eligibleCondition:
       - hasMst: false (mặc định: chỉ gộp đơn không có MST)
       - maxAmount: number (mặc định: 200000 VND, configurable)
       - includeChannels: ['pos', 'web'] (configurable)
       - excludeCategories: string[] (vd: xăng dầu nếu áp dụng đặc thù)
     * groupBy: 'merchant' | 'branch' (1 hóa đơn tổng/merchant hay /branch)
     * aggregationLevel: 'sku' | 'category' | 'tax_rate' (line item của
       hóa đơn tổng group theo gì)
     * scheduledAt: time (mặc định 23:30)

   - Persistence: table merchant_aggregation_rules

2. Aggregation job:
   - Cron daily 23:30 (hoặc giờ user config)
   - Worker apps/gateway/src/workers/daily-aggregation.worker.ts
   - Cho mỗi merchant có rule active:
     * Query orders/POS transactions của ngày D với criteria match rule
     * Group + aggregate theo aggregationLevel
     * Build CanonicalInvoice với:
       - buyer: { name: 'Khách lẻ không lấy hóa đơn', mst: undefined }
       - items: aggregated line items
       - totals: sum
       - metadata: aggregationRunId, sourceTransactionIds (array), date
     * Call InvoiceService.issue() với idempotency key
       = `daily-agg-{merchantId}-{branchId?}-{date}`
     * Persist link giữa hóa đơn tổng và source transactions

3. Manual trigger:
   - POST /v1/invoices/aggregate-daily với { merchantId, date, branchId? }
   - Validation: chỉ cho gộp ngày trong quá khứ (không today nếu chưa
     hết ngày — tax counsel review condition này)
   - Gửi job vào queue, return jobId
   - Polling job status

4. Reporting endpoint:
   - GET /v1/invoices/aggregations?period=...&merchantId=...
   - Trả list aggregation runs với: date, branch, totalSourceCount,
     aggregatedInvoiceId, status
   - GET /v1/invoices/aggregations/{runId}/sources
   - Trả list source transactions trong 1 aggregation

5. Frontend (Portal UI):
   a) Settings page: Config rule
      - Form với fields tương ứng AggregationRule
      - Preview "Hôm nay sẽ gộp X giao dịch trị giá Y VND"
      - Save với confirm

   b) Daily summary page: /invoices/daily-summary
      - Calendar view: mỗi ngày có badge "X giao dịch chờ gộp" hoặc
        "Đã gộp"
      - Click ngày → detail
      - Button "Gộp ngay" (chỉ show nếu chưa gộp)
      - Status real-time

   c) Aggregated invoice detail:
      - View như invoice thường
      - Section "Source transactions" với expandable list
      - Drill-down link

   d) Export:
      - Button "Xuất Excel" cho 1 aggregation hoặc cả period
      - Format: 1 sheet aggregated invoices, 1 sheet source transactions

6. Edge case handling:
   - Khách yêu cầu hóa đơn sau khi đã gộp (out-of-band): kế toán phải
     xử lý điều chỉnh cả hóa đơn tổng + tạo hóa đơn riêng cho khách đó.
     UX: button "Tách giao dịch khỏi hóa đơn tổng" → wizard flow.
   - Branch riêng: cho phép merchant chọn gộp riêng từng branch hoặc tổng
   - Merchant config sai ngưỡng → preview phải show clearly
   - Xăng dầu (theo TT 78 article riêng): rule khác, hiện tại defer Phase
     2 (rare in Haravan), nhưng documented để Phase 3-4 add

7. Compliance verification:
   - Tax counsel review document:
     * Format hóa đơn tổng: tên người mua, MST, line items aggregation
       method, tax breakdown
     * Timing: cuối ngày D xuất cho ngày D, retention reference
     * Edge case: khách yêu cầu hóa đơn riêng sau gộp
   - Get approval signed off trước launch

8. Tests:
   - Unit: aggregation logic với 10+ scenario (multi-tax-rate,
     multi-branch, edge case rounding)
   - Integration: cron job → query → aggregate → call adapter
   - Tax compliance: snapshot test format hóa đơn tổng, compare với
     official TT 78 sample

9. Monitoring:
   - Metric: số aggregation/day per merchant
   - Alert: nếu cron fail hoặc job stuck >1h
   - Dashboard: timeline aggregation runs với success/fail

10. Documentation:
    - User guide cho merchant: cách config rule, cách kiểm tra báo cáo
    - Compliance doc: mapping feature → điều TT 78/TT 32
    - Troubleshooting: top 10 issue thường gặp

Mark `// TODO`:
- Tax counsel review confirmation cho format hóa đơn tổng
- Edge case xăng dầu nếu merchant base có
- Integration với Hararetail POS để pull dữ liệu đầy đủ
```

## Verification Checklist

- [ ] Cron 23:30 chạy auto, gộp đúng theo rule
- [ ] Manual "Gộp ngay" work
- [ ] Format hóa đơn tổng pass tax counsel review
- [ ] Drill-down từ aggregated → source transaction work
- [ ] Export Excel format đúng cho kế toán
- [ ] Edge case "khách xin lại hóa đơn sau gộp" có flow xử lý
- [ ] Snapshot test compliance không fail sau code change
- [ ] No double-aggregation (idempotency)
