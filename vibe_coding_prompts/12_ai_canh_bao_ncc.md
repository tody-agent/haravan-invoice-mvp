# FEATURE PROMPT — AI Cảnh báo NCC Rủi ro

**Phase:** 3 · **Effort:** 4-5 ngày · **Persona:** Backend + ML
**Pre-read:** Phase 3 §"Feature 2"

---

## Mục tiêu

Cảnh báo merchant trước khi giao dịch với NCC (nhà cung cấp) ngừng hoạt động hoặc rủi ro cao. Cạnh tranh trực diện với MISA AVA "Cảnh báo nhà cung cấp rủi ro".

## Acceptance Criteria

- [ ] Risk score 0-1 cho mỗi NCC, update real-time khi có signal mới
- [ ] Alert badge trong: form phát hành, Inbound list, Customer detail
- [ ] Risk score precision ≥90% (low false positive)
- [ ] Explainability: top 3 reasons cho mỗi alert
- [ ] Block hoặc warning theo threshold (configurable per merchant)
- [ ] Data sources: API CQT lookup, public risk list, internal pattern
- [ ] Daily refresh cho NCC active
- [ ] Performance: lookup <200ms (cached), refresh job complete <1h cho 10k merchants

## Prompt cho AI

```
Build AI Cảnh báo NCC Rủi ro. Tham chiếu MISA AVA "Cảnh báo nhà cung
cấp rủi ro" (R56 release) để hiểu baseline competitor.

Architecture:

A. Data sources:

1. API CQT lookup:
   - Endpoint công khai: gdt.gov.vn API hoặc tradeapi
   - Input: MST → output: { name, status: 'active'|'inactive'|'dissolved',
     last_changed_date, address, business_lines }
   - Cache 24h trong Redis
   - Rate limit: implement queue/throttle (CQT API có limit)

2. Public risk list:
   - Scrape weekly từ trang Tổng Cục Thuế và Bộ Tài chính (danh sách
     "doanh nghiệp rủi ro về thuế")
   - Persist trong DB table risky_suppliers với:
     - mst, source, listed_date, reason, severity, last_checked
   - Update mỗi tuần

3. Internal pattern (per-merchant):
   - Volume trung bình + std dev cho mỗi NCC trong 6 tháng gần nhất
   - Value trung bình per invoice
   - Frequency pattern (vd: monthly, weekly)
   - Tính toán periodic (nightly batch)

B. Risk scoring model:

1. apps/gateway/src/services/risk-scoring/supplier-risk.service.ts:
   - Function calculateRiskScore(merchantId, supplierMst): RiskScore

2. Scoring formula (initial hand-crafted, finetune sau):
   ```
   risk_score = w1 * mst_status_risk
              + w2 * tax_risk_list_signal
              + w3 * volume_anomaly
              + w4 * value_anomaly
              + w5 * new_supplier_flag
              + w6 * frequency_change
   ```

   - mst_status_risk: 1.0 nếu inactive/dissolved, 0.0 nếu active
   - tax_risk_list_signal: 1.0 nếu có trong list, 0.0 không
   - volume_anomaly: z-score của volume tháng này vs trung bình
   - value_anomaly: z-score của giá trị trung bình
   - new_supplier_flag: 0.5 nếu first time, 0.0 nếu đã có history
   - frequency_change: penalty nếu pattern thay đổi đột ngột

   - Initial weights: w1=0.4, w2=0.3, w3=0.1, w4=0.1, w5=0.05, w6=0.05
   - Sau 3 tháng có data: train logistic regression với label "thật sự
     có vấn đề" (manual labeled hoặc Hilo CQT reject)

3. Risk levels:
   - score >= 0.8: HIGH (red, block + override required)
   - 0.5-0.8: MEDIUM (yellow warning)
   - 0.2-0.5: LOW (info, audit)
   - <0.2: NONE

C. Alert UX:

1. Form phát hành (outbound):
   - Khi user nhập MST khách (nếu khách = NCC mình bán cho lại) hoặc
     trong Inbound khi user xử lý hóa đơn từ NCC:
   - Trigger lookup risk score
   - Display badge:
     * HIGH: red banner "Cảnh báo cao: NCC này có rủi ro" + reasons
       + button "Vẫn phát hành" (require confirm + audit)
     * MEDIUM: yellow warning, không block, prominent
     * LOW: passive, hiển thị trong audit
     * NONE: pass silently

2. Inbound list:
   - Column "Risk" với badge cho mỗi invoice
   - Filter "Hiển thị NCC rủi ro cao" toggle
   - Click row → detail có panel "Phân tích rủi ro NCC"

3. Supplier detail page (mới):
   - URL: /suppliers/{mst}
   - Hiển thị: profile, risk score, history transaction, timeline events
   - Risk explanation: "MST chuyển trạng thái 'ngừng hoạt động' ngày X.
     Volume tháng này tăng 250% so với trung bình."

D. Refresh job:

1. apps/gateway/src/workers/supplier-risk-refresh.worker.ts:
   - Daily cron, refresh tất cả NCC active của tất cả merchant
   - Batch lookup CQT (respect rate limit)
   - Re-compute risk score
   - Notify merchant nếu có NCC mới chuyển sang HIGH risk

2. Public risk list weekly scrape:
   - Cron weekly Sunday 02:00
   - Scrape Bộ Tài chính + Tổng Cục Thuế
   - Update DB
   - Trigger re-scoring cho affected NCC

E. Explainability:

1. Mỗi RiskScore object có:
   - score: number
   - level: 'NONE'|'LOW'|'MEDIUM'|'HIGH'
   - reasons: Array<{ factor, contribution, evidence }>
   - lastUpdated: timestamp

2. UI tooltip / panel hiển thị reasons
3. Reason format human-readable: "MST {mst} chuyển trạng thái 'ngừng
   hoạt động' ngày {date}. Source: CQT lookup."

F. Audit log:

- Mỗi risk score calculation logged
- User override (proceed dù HIGH) logged với reason
- Compliance can review override pattern

G. Tests:

- Unit: scoring formula với 20+ scenario
- Mock CQT API + risk list
- Integration: refresh job → DB update → API serve
- Performance: lookup <200ms (cached), <2s (uncached)
- Refresh job <1h cho 10k merchant × avg 50 NCC each = 500k lookup

H. Monitoring:

- Metric: risk score distribution per merchant
- Metric: false positive rate (merchant override count)
- Metric: refresh job runtime
- Alert: CQT API down → fall back to last cached
- Dashboard: trend NCC risk over time

Mark `// TODO`:
- API CQT exact endpoint + auth (cần partnership với CQT hoặc public lookup)
- Public risk list source URL exact (Bộ Tài chính trang scrape)
- ML team finetune weights sau 3 tháng
- Customer notification template khi NCC chuyển HIGH risk
```

## Verification Checklist

- [ ] Risk score calculate đúng cho 20 test scenario
- [ ] CQT lookup cached 24h, refresh on-demand
- [ ] Public risk list scrape weekly, parse đúng
- [ ] UI alert hiển thị 3 level đúng theo threshold
- [ ] Reasons explainable, dễ hiểu cho kế toán
- [ ] Refresh job daily complete <1h
- [ ] Override audit logged
- [ ] False positive rate <10%
