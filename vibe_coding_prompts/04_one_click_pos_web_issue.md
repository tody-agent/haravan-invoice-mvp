# FEATURE PROMPT — One-Click Issue từ POS/Web (Top RICE 68.400)

**Phase:** 1 · **Effort:** 3-4 ngày · **Persona:** Backend + Frontend
**Pre-read:** Phase 1 §"Portal UI Design" 5 user flow, Master Context §6 (RICE)

---

## Mục tiêu

Reduce phát hành hóa đơn từ flow nhiều bước (Hilo redirect/iframe) xuống **1 click** trong Haravan Admin / POS. Trigger có thể là: (a) tự động khi order paid (Web), (b) checkbox + 1 click trong POS checkout, (c) button "Xuất hóa đơn" trong Order detail Admin.

## Acceptance Criteria

- [ ] 3 trigger work: auto-on-paid, POS checkout, Admin button
- [ ] Latency end-to-end <3s p95 (từ click đến hóa đơn issued)
- [ ] UX: 1 click thực sự (không modal confirm cho flow tự động, có confirm cho flow manual)
- [ ] Pre-fill toàn bộ data từ Order: buyer, items, totals, tax breakdown
- [ ] Error gracefully: nếu fail, hiển thị error rõ + retry button + không block POS flow
- [ ] Status sync: invoice status → order page real-time (qua WebSocket hoặc poll)
- [ ] Optimistic UI: hiển thị "đang phát hành" ngay, sau đó update khi xong
- [ ] Audit log đầy đủ: who clicked, when, source channel
- [ ] E2E test cover 3 trigger

## Prompt cho AI

```
Build feature One-Click Issue từ POS/Web. Đây là feature TOP RICE
(68.400 điểm) — UX phải mượt tuyệt đối.

3 trigger:

A. AUTO khi Order Web paid:
   - Subscribe Haravan Order event 'order.paid'
   - Check merchant config: auto_issue_on_paid = true?
   - Nếu có MST trong Customer Profile → auto-issue
   - Nếu không có MST → tạo invoice draft với buyer = "Khách lẻ", note
     "MST chưa có, kiểm tra"
   - Notify merchant qua in-app notification "Đã phát hành HĐ #X"

B. POS CHECKOUT (Hararetail):
   - Trong POS checkout screen có checkbox "Xuất hóa đơn"
   - Nếu khách có MST: input field MST appear
   - Nhân viên click "Thanh toán + Phát hành" (1 button gộp)
   - Backend xử lý song song payment + invoice issue
   - Hiển thị thẻ status: thanh toán ✓, hóa đơn ✓ (kèm QR check)
   - In nhanh receipt + invoice link

C. ADMIN button:
   - Trong Order detail có button "Xuất hóa đơn"
   - Modal confirm với pre-filled info (cho phép edit MST nếu cần)
   - Submit → issue → toast success → invoice status visible trong order

Implement chi tiết:

1. apps/gateway/src/services/auto-issue.service.ts:
   - Function autoIssueFromOrder(orderId, trigger: 'auto' | 'pos' | 'admin')
   - Fetch order data từ Haravan Order API
   - Map order → CanonicalInvoice (helper mapper):
     * buyer: từ customer profile, fallback "Khách lẻ"
     * items: order line items với tax rate per item
     * totals: tự tính từ items
     * payment: từ order payment status
     * metadata: orderId, channel, branchId, cashierId
   - Call InvoiceService.issue() với idempotency key = `order-{orderId}`
   - Update order metadata với invoiceId
   - Emit event 'invoice.issued' cho UI subscribe

2. Haravan Order Event subscription:
   - apps/gateway/src/workers/order-event.worker.ts
   - Subscribe Kafka topic 'haravan.orders.events'
   - Filter event type = 'paid'
   - Check merchant config (cache 1h)
   - Call autoIssueFromOrder('auto')

3. Merchant config endpoint:
   - GET /v1/config/merchant
   - PATCH /v1/config/merchant với { auto_issue_on_paid: bool, ... }
   - Persist trong DB table merchant_config

4. POS integration:
   - POST /v1/invoices/from-pos endpoint nhận: orderId, mst (optional),
     buyerInfo (optional)
   - Process synchronously (POS UX cần response ngay)
   - Timeout 5s, nếu vượt → return 'pending' status, POS hiển thị
     "Đang phát hành, kiểm tra sau"

5. Frontend (Portal UI):
   a) Order detail page (Haravan Admin):
      - Section "Hóa đơn" với status badge
      - Nếu chưa có invoice: button "Xuất hóa đơn" → modal confirm
      - Nếu có invoice: link tới detail invoice + status

   b) POS Hararetail (cross-team coordinator, không trong scope code này):
      - Tài liệu spec API cho POS team integrate
      - Postman collection để POS team test

6. Real-time status update:
   - Option 1: WebSocket connection từ Portal UI
   - Option 2: TanStack Query refetch on focus + polling 5s khi status
     'pending'
   Khuyến nghị: Option 2 cho Phase 1 (đơn giản), Option 1 nếu có sẵn
   infra WebSocket Haravan.

7. Error handling:
   - Hilo API fail → status 'failed', error message clear
   - Pre-validate trước khi call Hilo (saving 1 round trip):
     * MST format
     * Total > 0
     * Items không empty
     * Tax rate hợp lệ
   - Retry button trong UI cho failed invoice (idempotency cùng key)

8. Performance:
   - Pre-fetch merchant config + customer info trong parallel
   - Cache hot path: merchant config 1h, customer info 5m
   - Database query optimize: eager load order with items

9. Audit:
   - Log: who clicked, source channel, idempotency key, latency
   - Trace: span 'invoice.one-click-issue' với attribute trigger type

10. Tests:
    - Unit: orderToCanonical mapper với 5+ scenario
    - Integration: full flow auto từ Kafka event
    - E2E: POS checkout flow, Admin button flow
    - Performance: load test 100 req/s, p95 latency <3s

Mark `// TODO`:
- Haravan Order API endpoint exact (cần Haravan core team confirm)
- Kafka topic name + schema
- POS Hararetail integration API (cross-team meeting tuần đầu)
```

## Verification Checklist

- [ ] Click "Xuất hóa đơn" trong Order Admin → 1 modal confirm → success <3s
- [ ] POS checkout → tick "Xuất hóa đơn" → "Thanh toán + Phát hành" → in receipt + invoice
- [ ] Order Web paid → check after 5s → invoice tự động issued (auto mode)
- [ ] Hilo down → user thấy error rõ, retry work
- [ ] Concurrent 50 click cùng lúc → no double-issue (idempotency work)
- [ ] Audit log có đủ context cho mỗi issue
- [ ] Latency p95 <3s trong load test
