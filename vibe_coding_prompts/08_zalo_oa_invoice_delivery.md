# FEATURE PROMPT — Zalo OA Invoice Delivery

**Phase:** 2 · **Effort:** 3-4 ngày · **Persona:** Backend + Frontend
**Pre-read:** Phase 2 §"Feature 5", Master Context §10 (HaraSocial integration)

---

## Mục tiêu

Sau khi phát hành hóa đơn, tự động gửi qua Zalo OA cho khách (nếu khách linked Zalo OA với merchant). Tracking lifecycle: gửi / nhận / mở / tải. Fallback email nếu Zalo fail.

## Acceptance Criteria

- [ ] Sau invoice issued → trigger send Zalo OA message (async)
- [ ] Template message đúng chuẩn Zalo OA Notification Service
- [ ] CTA mở mini-app/web view hiển thị PDF + QR check CQT
- [ ] Tracking webhook từ Zalo OA: delivered / read / clicked
- [ ] Fallback email nếu Zalo fail (timeout, blocked, no Zalo ID)
- [ ] Per-customer preference: Zalo / Email / SMS / Cả 3
- [ ] Per-merchant on/off Zalo delivery
- [ ] Audit log + notification status visible trong invoice detail
- [ ] Compliance: opt-in framework, Zalo OA policy compliant

## Prompt cho AI

```
Build Zalo OA Invoice Delivery feature, tích hợp HaraSocial Zalo OA
API.

Architecture:

A. Service layer (apps/gateway/src/services/notification/):

1. NotificationService.sendInvoice(invoiceId, channels?: Array<'zalo'|'email'|'sms'>):
   - Fetch invoice + customer
   - Determine channels:
     * Default: customer preference, fallback merchant default
     * Override: nếu user explicit chọn channel
   - Cho mỗi channel: enqueue job
   - Return jobId batch

2. ZaloOaSender:
   - sendInvoiceMessage(merchantId, customerId, invoice):
     * Get Zalo OA token (cache với refresh)
     * Build message theo template (Zalo Notification Service)
     * Call Zalo OA API: POST /message/cs hoặc /message/notification
     * Persist messageId + status
     * Subscribe webhook update

3. EmailSender (fallback):
   - sendInvoiceEmail(customerEmail, invoice, pdfAttachment)

4. NotificationStatus tracking:
   - DB table notification_logs:
     * id, invoice_id, channel, status (queued|sent|delivered|read|clicked|failed),
       provider_id, attempts, last_error, created_at, updated_at
   - Update via webhook handler

B. Webhook handler:

1. POST /v1/webhooks/zalo:
   - Verify signature
   - Parse event: delivered, read, clicked
   - Update notification_logs

2. POST /v1/webhooks/email-provider (vd: SendGrid):
   - Similar pattern

C. Customer preference:

1. API:
   - GET /v1/customers/{id}/notification-preference
   - PATCH với { invoiceDelivery: ['zalo', 'email'], optOut: false }

2. Frontend trong Customer detail page (Phase 2 mở rộng):
   - Section "Tùy chọn nhận thông báo"
   - Checkbox cho mỗi channel
   - Hiển thị Zalo ID linked (nếu có)

D. Template Zalo OA:

Tham khảo Zalo OA Notification Service template structure:

```json
{
  "recipient": { "user_id": "...", "phone": "..." },
  "message": {
    "template_type": "transaction_alert",
    "template_id": "haravan_invoice_v1",
    "elements": {
      "title": "Hóa đơn #${invoiceNumber}",
      "subtitle": "${shopName} đã phát hành hóa đơn",
      "image_url": "${shopLogoUrl}",
      "table": [
        { "key": "Số hóa đơn", "value": "${invoiceNumber}" },
        { "key": "Ngày", "value": "${issueDate}" },
        { "key": "Tổng tiền", "value": "${grandTotal}" }
      ]
    },
    "buttons": [
      { "title": "Xem hóa đơn", "type": "oa.open.url", "payload": { "url": "${invoiceViewUrl}" } },
      { "title": "Tải PDF", "type": "oa.open.url", "payload": { "url": "${pdfUrl}" } }
    ]
  }
}
```

(Template structure chính xác phải verify với Zalo OA docs hiện tại.)

E. Mini-app / Web view:

1. Public URL: `https://invoice-view.haravan.com/{shortToken}`
   - shortToken: signed JWT chứa invoiceId + expiry 30 ngày
   - Mở web view không cần đăng nhập
   - Hiển thị invoice PDF preview + QR code check trên CQT website
   - Button "Tải PDF" + "Tải XML" (proxy qua Gateway, log access)
   - Mobile-first responsive

2. Security:
   - shortToken có expiry
   - Rate limit per token (chống abuse)
   - Audit log mỗi access

F. UI integration trong Invoice Detail page:

1. Section "Trạng thái gửi":
   - Cho mỗi channel: icon + status + timestamp
     * Zalo: "Đã gửi 14:32" → "Khách đã đọc 14:35" → "Đã mở 14:36"
     * Email: tương tự
   - Button "Gửi lại" cho channel failed

2. Button "Gửi lại" trong list view (bulk):
   - Chọn invoice → "Gửi lại Zalo" → confirm

G. Configuration:

1. Merchant settings:
   - Toggle Zalo delivery on/off
   - Default delivery channels
   - Customize template (advanced, optional)

H. Tests:

- Unit: template rendering, channel selection logic
- Integration: mock Zalo OA API, full flow send → webhook → status update
- E2E: phát hành invoice → check notification status timeline
- Failure scenarios: Zalo down → email fallback, customer no Zalo ID → skip

I. Monitoring:

- Metric: send success rate per channel, read rate, click rate
- Alert: success rate <90% trong 1h
- Dashboard: notification health per merchant

J. Compliance:

- Opt-in framework: customer phải explicitly opt-in Zalo notification
  (Zalo OA policy)
- Provide unsubscribe link trong email
- Honor "stop receiving" reply trong Zalo OA
- Document data retention cho notification log (30 ngày minimum, max
  90 ngày trừ khi customer request delete)

Mark `// TODO`:
- HaraSocial Zalo OA API endpoint exact (sync với HaraSocial team)
- Email provider chọn (SendGrid? AWS SES? Postmark?)
- Mini-app / web view design (cần Designer)
- Zalo OA template approval flow (Zalo cần approve template)
```

## Verification Checklist

- [ ] Phát hành invoice → 5s sau Zalo message gửi (verify trong sandbox)
- [ ] Customer click button → web view mở, hiển thị invoice
- [ ] Webhook Zalo OA cập nhật status read → UI hiển thị
- [ ] Zalo gửi fail → fallback email tự động
- [ ] Customer opt-out → không gửi Zalo lần sau
- [ ] Bulk "Gửi lại" 100 invoice → throttled, success >90%
- [ ] No customer data leaked qua logs
- [ ] Compliance: unsubscribe link work, opt-in flow đúng Zalo policy
