# FEATURE PROMPT — AI Tiền-kiểm Trước Phát hành

**Phase:** 3 · **Effort:** 5-6 ngày · **Persona:** Backend + ML Engineer
**Pre-read:** Phase 3 §"Feature 1"

---

## Mục tiêu

Giảm 70% tỷ lệ hóa đơn bị CQT từ chối nhờ AI check trước khi gửi. Hybrid: rule-based check sync + LLM check async cho edge case.

## Acceptance Criteria

- [ ] Rule-based check chạy <50ms inline trong issue flow
- [ ] LLM check trigger conditional, async, <2s
- [ ] AI tiền-kiểm precision ≥95% (low false positive)
- [ ] UX: warning inline trong form, có "Vẫn phát hành" button (audit)
- [ ] Block submit khi check fail (severity = error)
- [ ] Cost per inference ≤$0.005
- [ ] Learning loop: log Hilo CQT rejection → improve rule
- [ ] Explainability: mỗi warning có "Tại sao" với top 3 reason
- [ ] Audit log: AI version, prompt version, input hash, output, user action

## Prompt cho AI

```
Build AI Tiền-kiểm feature. Hybrid approach: rule-based đầu tiên cho
fast feedback, LLM cho edge case phức tạp.

Architecture:

A. Rule-based layer (sync, <50ms):

1. apps/gateway/src/services/precheck/rules.ts:
   - Function checkRules(invoice: CanonicalInvoice): RuleCheckResult[]
   - Rules:
     R1. MST format: 10 hoặc 13 số, checksum hợp lệ
     R2. MST tồn tại CQT (cache 24h từ /v1/mst lookup)
     R3. MST đang 'hoạt động' (not 'ngừng hoạt động')
     R4. Tax rate hợp lệ với category:
         - VAT 10% mặc định cho hàng hóa thông thường
         - VAT 5% cho thực phẩm thiết yếu, dược phẩm, etc.
         - VAT 8% cho hàng giảm thuế theo NQ 142/2024 (nếu còn hiệu lực)
         - VAT 0% xuất khẩu
     R5. Total = sum(line items) ± rounding (1 VND tolerance)
     R6. Required fields filled: buyer name, items, totals
     R7. Date không tương lai (issue_date <= now)
     R8. Date không quá xa quá khứ (issue_date >= now - 7 days)
     R9. Invoice number tuân format Hilo

   - Mỗi rule:
     - id, severity (error|warning|info), check function, reason
       template, suggestion template
   - Return list violations với severity

2. apps/gateway/src/services/precheck/precheck.service.ts:
   - Function precheck(invoice): { rulebased: [...], llm?: Promise<...>, warnings: [...] }
   - Invoke checkRules sync
   - Conditional trigger LLM:
     * IF rule-based pass AND có "warning signal":
       - Line item description rất generic ("Hàng hóa", "Sản phẩm")
       - Total bất thường so với historical (z-score >2)
       - Customer mới (chưa có invoice trước)
       - Tax rate không khớp historical pattern
     * Trigger async LLM check, không block submit

B. LLM layer (async, 500-2000ms):

1. apps/gateway/src/services/precheck/llm-precheck.ts:
   - LLM provider: Claude Sonnet 4.6 (default), fallback GPT-4o, Gemini 2.5
   - System prompt: senior accountant Việt Nam, expert hóa đơn
   - User prompt template:
     ```
     Hãy đánh giá hóa đơn dưới đây có gì bất thường, có rủi ro CQT
     từ chối hay không.

     Hóa đơn:
     {{invoice_json}}

     Lịch sử 5 hóa đơn gần nhất của customer + seller:
     {{historical_invoices}}

     Trả về JSON:
     {
       "risk": "low" | "medium" | "high",
       "reasons": ["...", "...", "..."],
       "suggestions": ["...", "..."],
       "confidence": 0.0-1.0
     }
     ```
   - Response parsing với schema validation (zod)
   - Error handling: timeout, parse fail → fallback "skip LLM"

2. Caching:
   - Cache key: hash(invoice_normalized) → 1h TTL
   - Cache hit rate target ≥40%

3. Cost monitoring:
   - Track tokens per inference per merchant
   - Daily report
   - Per-merchant quota (default 100 inference/day, configurable)
   - Alert nếu spend >$X/day

C. UX integration:

1. Frontend trong InvoiceForm:
   - Box "AI Tiền-kiểm" hiển thị status:
     * Loading: "Đang kiểm tra..."
     * Pass: ✓ "Tất cả check đã pass"
     * Warning: ⚠ "Có {N} cảnh báo. Xem chi tiết"
     * Error: ✗ "Có {N} lỗi cần sửa trước khi phát hành"
   - Click "Xem chi tiết" → expand panel
   - Mỗi rule violation:
     * Severity badge
     * Reason
     * Suggestion (nếu có)
     * Field highlight trong form
   - Action button:
     * Error: disable submit
     * Warning: "Vẫn phát hành" với confirm modal (log audit)
     * Pass: enable submit

2. LLM result hiển thị riêng (vì async):
   - "AI đang phân tích sâu..." spinner
   - Khi xong: hiển thị risk + reasons + suggestions
   - Cho phép user proceed hoặc cancel

D. Learning loop:

1. apps/gateway/src/workers/precheck-learning.worker.ts:
   - Subscribe Hilo CQT rejection events
   - Log: invoice that rejected, reason from CQT, AI prediction (was
     it warned? severity?)
   - Weekly aggregate:
     * False negative count (AI said pass, CQT rejected) → review rule
     * False positive count (AI said warn, but actually pass) → tune
   - Manual review queue cho compliance team
   - Update rule weights / add new rule monthly

E. Explainability:

1. Mỗi LLM output phải có "reasons" array
2. Mỗi rule violation có reason template
3. UI tooltip "Tại sao?" trên mỗi warning

F. Audit log:

- Schema additions cho audit_logs.metadata:
  * ai_check_id (UUID)
  * model_version (vd: "claude-sonnet-4-6-2026-01")
  * prompt_version (vd: "v1.2")
  * input_hash
  * output_summary
  * confidence
  * user_action (proceed | abort | edit)

G. Tests:

- Unit: 9 rules với 30+ test case (positive + negative)
- LLM mock: golden dataset với expected output
- Integration: full flow precheck → form → submit → Hilo
- Performance: rule check <50ms p95, LLM <2s p95
- Cost: simulate 10k inference → estimate spend

H. Monitoring:

- Metric: precheck pass/warn/error rate
- Metric: LLM latency, cost per inference
- Metric: precision/recall (vs Hilo CQT result groundtruth)
- Alert: precision drop <90%

Mark `// TODO`:
- LLM provider DPA (data privacy agreement)
- VAT 8% rule expiry date (theo NQ 142/2024 hoặc updates)
- Historical invoice query optimization (potential perf hit)
```

## Verification Checklist

- [ ] Rule check 9 rule pass test 30+ case
- [ ] LLM check return valid JSON 100/100 sample
- [ ] Cache hit rate ≥40% sau 1 ngày
- [ ] Cost per inference ≤$0.005
- [ ] UX: warning inline, "Tại sao" tooltip work
- [ ] Submit blocked khi rule error, allowed với warning + confirm
- [ ] Learning loop: weekly report generated
- [ ] Audit log có đủ AI metadata
