# FEATURE PROMPT — Inbound Invoice Module + AI Classify

**Phase:** 3 · **Effort:** 6-8 ngày · **Persona:** Backend + Frontend + ML + OCR
**Pre-read:** Phase 3 §"Feature 3"

---

## Mục tiêu

Xử lý hóa đơn đầu vào (mua từ NCC) end-to-end: auto-fetch từ Hilo, OCR backup cho hóa đơn giấy, AI phân loại chi phí, AI đối soát PO, AI gợi ý hạch toán. Giảm 80% time kế toán.

## Acceptance Criteria

- [ ] Auto-fetch inbound từ Hilo (poll 15 phút hoặc webhook)
- [ ] OCR upload ảnh hóa đơn giấy → extract MST/total/items
- [ ] AI classify category accuracy ≥85% top-1
- [ ] AI match PO accuracy ≥90% (matched/partial/unmatched)
- [ ] AI suggest accounting entry, kế toán confirm với 1 click
- [ ] Bulk processing: handle 1000 inbound/batch
- [ ] Time-to-process per inbound <30s (vs baseline 5-10 phút manual)
- [ ] Audit log AI decision đầy đủ
- [ ] Human-in-the-loop: kế toán luôn confirm trước post sổ

## Prompt cho AI

```
Build Inbound Invoice Module với AI. Đây là feature đáng giá nhất
Phase 3 cho kế toán (high-impact pain).

Architecture:

A. Inbound fetch:

1. apps/gateway/src/workers/inbound-fetch.worker.ts:
   - Cron 15 phút cho mỗi merchant active
   - Call HiloAdapter.syncInbound(merchantConfig, fromDate=lastSync)
   - Persist new inbound vào DB table inbound_invoices:
     - id, merchant_id, source ('hilo' | 'ocr'), tvan_id, supplier_mst,
       supplier_name, total, tax, items (JSONB), issue_date,
       status ('pending_review'|'reviewed'|'classified'|'matched'|'posted'|'rejected'),
       ai_classification (JSONB), ai_po_match (JSONB), ai_accounting (JSONB),
       reviewer_id, reviewed_at, posted_at

2. Webhook integration (nếu Hilo support):
   - POST /v1/webhooks/hilo/inbound
   - Verify signature
   - Insert ngay không chờ poll

B. OCR backup:

1. Endpoint: POST /v1/inbound/upload với multipart image
   - Limit 10MB, format jpg/png/pdf
   - Save to S3 với encryption
   - Trigger OCR job

2. apps/gateway/src/services/ocr/:
   - Provider: Google Document AI hoặc AWS Textract (test cả 2 chọn 1)
   - Extract: MST seller, MST buyer, total, tax, line items, date
   - Confidence score per field
   - Output: structured data + confidence + raw OCR result

3. UX:
   - Sau OCR, hiển thị form review: extracted data + confidence indicator
     (green ≥0.9, yellow 0.7-0.9, red <0.7)
   - Kế toán correct manually nếu cần
   - Submit → tạo inbound_invoice record

C. AI Classify category:

1. apps/gateway/src/services/inbound-ai/classifier.ts:
   - LLM provider: Claude Haiku (cheap, fast) hoặc GPT-4o-mini
   - System prompt: kế toán expert phân loại chi phí Việt Nam
   - User prompt:
     ```
     Phân loại hóa đơn dưới đây vào 1 trong các nhóm chi phí:
     - Nguyên vật liệu / Hàng hóa
     - Marketing / Quảng cáo
     - Chi phí văn phòng
     - Vận chuyển / Logistics
     - Lương / Nhân sự
     - Thuê mặt bằng
     - Tiện ích (điện, nước, internet, điện thoại)
     - Dịch vụ chuyên môn (kế toán, luật, tư vấn)
     - Bảo trì / Sửa chữa
     - Khác (specify)

     Hóa đơn:
     - NCC: {{supplier_name}} (MST: {{supplier_mst}})
     - Items: {{line_items}}
     - Total: {{total}}

     Trả về JSON: {
       "category": "...",
       "confidence": 0.0-1.0,
       "reasoning": "...",
       "alternative_categories": ["..."]
     }
     ```

2. Cache: hash(supplier_mst + items_summary) → 30 ngày TTL

3. Per-merchant custom categories:
   - Merchant có thể define categories riêng
   - Append vào prompt

D. AI PO matching:

1. apps/gateway/src/services/inbound-ai/po-matcher.ts:
   - Input: inbound invoice + list active PO của merchant
   - Match heuristic:
     * MST seller match
     * Total ± 5% tolerance
     * Line items overlap (fuzzy match name)
     * Date proximity (PO date ≤ invoice date ≤ PO date + 90d)
   - Output: { match: 'matched'|'partial'|'unmatched', poId?, confidence, gaps?: [...] }

2. Use LLM cho fuzzy line item matching:
   - Prompt: "Có khớp giữa line items này không? PO: {...}, Invoice: {...}.
     Trả về JSON {match: bool, gaps: [...]}"

E. AI Accounting entry suggestion:

1. apps/gateway/src/services/inbound-ai/accounting-suggester.ts:
   - Input: invoice + category + merchant accounting setup (chart of
     accounts)
   - LLM prompt với rule kế toán Việt Nam:
     - Vốn chi phí → Nợ TK 6xx, Có TK 331 (phải trả NCC)
     - VAT đầu vào → Nợ TK 1331
     - Nếu thanh toán ngay → Có TK 111/112
   - Output: { entries: [{debit_account, credit_account, amount, description}],
     confidence, alternatives: [...] }

2. Learning loop:
   - Khi kế toán edit AI suggestion → log original vs edited
   - Weekly aggregate:
     * Most edited fields
     * Per-supplier pattern (vd: NCC X luôn dùng TK 627 thay vì 642)
   - Update prompt với in-context learning examples

F. Frontend:

1. Page apps/portal/src/pages/invoices/inbound/:
   - List view với filter (status, date, supplier, category, risk)
   - Bulk action: classify all, match PO all, send for accounting
   - Per-row inline AI badge (category + confidence)

2. Inbound detail page:
   - Header: status, AI badges
   - Section "Thông tin hóa đơn" (auto-extracted)
   - Section "AI Phân loại": dropdown với suggestion + confidence
   - Section "AI Đối soát PO": match status + linked PO + gaps highlight
   - Section "AI Hạch toán": table debit/credit suggestion + edit inline
   - Action buttons: "Confirm All", "Reject", "Send to Accounting" (export)

3. Bulk processing UX:
   - Select multiple inbound → "AI Process All"
   - Progress bar
   - Auto-confirm if confidence ≥0.95, manual review otherwise

G. Tests:

- Unit: classification logic, PO matching heuristic
- LLM golden dataset: 500 labeled inbound → expected category, accuracy ≥85%
- E2E: upload OCR → AI process → confirm → export
- Performance: bulk 1000 inbound process <30 phút

H. Monitoring:

- Metric: AI classification accuracy (vs human correction)
- Metric: PO match rate
- Metric: time-to-process before/after AI
- Cost per inference
- Alert: accuracy drift >5%

I. Compliance:

- AI suggest only, kế toán confirm trước post sổ
- Audit log AI version + prompt + input + output + user action
- Data privacy: mask PII trước gửi LLM (or use enterprise tier)

Mark `// TODO`:
- OCR provider final pick (test Google vs AWS)
- Chart of accounts schema (mỗi merchant có riêng)
- PO module (Phase 2 hoặc Phase 3? Verify với product team)
- Export format cho external accounting (MISA SME, Fast, Bravo)
```

## Verification Checklist

- [ ] Auto-fetch inbound từ Hilo work, no duplicate
- [ ] OCR upload + extract field accuracy ≥80% trên test set
- [ ] AI classify accuracy ≥85% top-1 trên 500-sample test set
- [ ] PO match accuracy ≥90%
- [ ] AI accounting suggestion editable, learning loop captured
- [ ] Bulk 1000 inbound process <30 phút
- [ ] Time-to-process per inbound <30s
- [ ] Audit log đủ AI metadata
