# MVP Spec Delta — Foundation v1

**Capability:** `mvp` (NEW)
**Change:** `mvp-foundation-cf-google`
**Date:** 2026-05-14

> Đây là spec delta cho capability **mới** `mvp`, song song với capability `prototype` (giữ nguyên).
> Mọi requirement bên dưới đều prefix `ADDED` vì capability này lần đầu xuất hiện.
> Sau khi change merge, file này được copy sang `openspec/specs/mvp/spec.md`.

---

## Purpose

MVP Foundation là **phiên bản prototype đầu tiên có thể deploy được** của Haravan Invoice Wrapper, chạy trên stack serverless **Cloudflare + Google**. Nó phục vụ:

1. Beta merchant pool 10-15 store phát hành hóa đơn thật qua T-VAN Hilo.
2. Validate technical assumption (latency Hilo, idempotency, audit log immutable, compliance enforcement).
3. UX baseline production thay cho prototype HTML.
4. Foundation cho Phase 1.1, 2, 3, 4 (mở rộng feature, AI, multi-T-VAN, Public API).

MVP **không thay thế** prototype HTML; cả 2 coexist với mục đích khác nhau.

---

## Infrastructure requirements

### ADDED Requirement: MVP SHALL host frontend trên Cloudflare Pages

Frontend SHALL được build dưới dạng SPA và serve qua Cloudflare Pages với edge cache toàn cầu, có preview deployment cho mỗi pull request.

#### Scenario: Production deploy
- WHEN code merge vào branch `main`
- THEN GitHub Actions trigger build và deploy lên Cloudflare Pages production
- AND domain `mvp.haravan-invoice.dev` serve bundle mới nhất qua edge POP

#### Scenario: PR preview
- WHEN một pull request được mở
- THEN Cloudflare Pages tạo preview URL `pr-<n>.mvp-haravan-invoice.pages.dev`
- AND comment URL vào PR

### ADDED Requirement: MVP SHALL chạy API gateway trên Cloudflare Workers

Mọi API call từ frontend SHALL đi qua một Cloudflare Worker viết bằng TypeScript với Hono framework, làm gateway giữa Pages, D1, R2, KV, Queues, và Hilo upstream.

#### Scenario: Worker bindings
- WHEN Worker khởi tạo
- THEN nó có bindings tới D1 (DB), R2 (artifact bucket), KV (cache/session/idempotency), và Queues (delivery, audit sink)

#### Scenario: Cold start budget
- WHEN một request lạnh chạm Worker ở POP HKG/SIN
- THEN cold start + first byte < 100ms

### ADDED Requirement: MVP SHALL dùng Cloudflare D1 làm metadata DB

D1 SHALL lưu metadata invoice, audit log, compliance rules, tenants, RBAC. KHÔNG được lưu XML pháp lý gốc (XML ở Hilo).

#### Scenario: Audit log append-only
- WHEN application code cố gắng UPDATE hoặc DELETE record trong bảng `audit_log`
- THEN repository layer reject và throw `AuditImmutableError`
- AND code review checklist verify không có path nào bypass

#### Scenario: PII encryption at rest
- WHEN ghi `buyer_name`, `buyer_address` vào D1
- THEN giá trị được mã hóa AES-256-GCM với key trong Workers Secret trước khi ghi
- AND read out decrypt trong Worker, không expose plaintext ngoài

### ADDED Requirement: MVP SHALL dùng R2 cho artifact storage

R2 SHALL lưu PDF preview hóa đơn, biên bản điều chỉnh, attachment khách hàng gửi. Truy cập qua signed URL TTL ≤5 phút.

#### Scenario: Artifact upload
- WHEN issue hóa đơn xong và Hilo trả PDF preview URL
- THEN Worker tải PDF về và upload vào R2 với key `<tenant_id>/invoices/<invoice_id>.pdf`
- AND signed URL được cấp cho frontend hiển thị

#### Scenario: Signed URL expire
- WHEN signed URL > 5 phút
- THEN truy cập R2 fail 403

### ADDED Requirement: MVP SHALL dùng KV cho session, cache, idempotency

KV SHALL quản lý session JWT blacklist, MST verify cache (30 ngày), rate limit counter, idempotency key (24 giờ).

#### Scenario: Idempotency replay
- WHEN client gửi 2 request mutation cùng `Idempotency-Key`
- THEN Worker trả cached response từ KV cho lần thứ 2
- AND không ghi double-write vào D1, không gọi Hilo lần 2

### ADDED Requirement: MVP SHALL dùng Queues cho async workflow

Cloudflare Queues SHALL chạy delivery (email/Zalo OA mock), audit sink sang GCP, retry webhook, và background job. Queue có dead letter sau 3 retry fail.

#### Scenario: Delivery retry
- WHEN gửi email thất bại do upstream timeout
- THEN Queue retry exponential backoff (1m, 5m, 30m)
- AND sau 3 lần fail → DLQ + alert ops

---

## Authentication & authorization requirements

### ADDED Requirement: MVP SHALL dùng Haravan OAuth2 làm primary auth cho merchant

Merchant SHALL login qua Haravan SSO (OAuth2 Authorization Code Flow with PKCE). Session quản lý qua signed JWT trong cookie `__Host-mvp_session` (Secure, HttpOnly, SameSite=Strict).

#### Scenario: Login lần đầu
- WHEN merchant truy cập MVP lần đầu
- THEN redirect tới Haravan IdP authorize endpoint với PKCE challenge
- AND callback exchange code → access_token → MVP session JWT 8h

#### Scenario: Logout
- WHEN merchant click logout
- THEN cookie clear AND session JTI vào KV blacklist với TTL = JWT expire

### ADDED Requirement: MVP SHALL dùng Cloudflare Access + Google Workspace cho staff

Endpoint `/admin/*` SHALL protected bởi Cloudflare Access với Google Workspace IdP, restrict domain `@haravan.com`.

#### Scenario: Staff access /admin
- WHEN staff truy cập `/admin/dashboard`
- THEN Cloudflare Access intercept, redirect Google Workspace SAML login
- AND chỉ user `@haravan.com` mới access được
- AND Worker verify CF Access JWT có `aud` đúng

### ADDED Requirement: MVP SHALL enforce RBAC tenant-scoped

Mỗi user SHALL có role trong context tenant (Owner, Accountant, Cashier, ReadOnly). Permission check ở Worker middleware trước khi truy cập resource.

#### Scenario: Cashier không issue được điều chỉnh
- WHEN user role `Cashier` gọi `POST /api/invoices/:id/adjust`
- THEN Worker trả 403 với mã `INSUFFICIENT_PERMISSION`
- AND audit log entry ghi attempt với deny reason

---

## Gateway behavior requirements

### ADDED Requirement: Gateway SHALL implement idempotency cho mọi mutation endpoint

Mọi `POST/PUT/PATCH/DELETE` endpoint SHALL accept header `Idempotency-Key`. Worker check KV, replay cached response nếu trùng, store kết quả final với TTL 24h.

#### Scenario: Idempotency hit
- WHEN client gửi 2 request `POST /api/invoices/issue` cùng key trong 24h
- THEN response thứ 2 đến từ KV cache, không gọi lại Hilo

### ADDED Requirement: Gateway SHALL implement rate limit sliding window

Mỗi route critical SHALL có rate limit configurable (default: 60 req/min/IP/tenant). Vượt limit → 429 với header `Retry-After`.

#### Scenario: Brute force MST lookup
- WHEN một IP gửi >120 request `/api/mst/verify` trong 60s
- THEN Worker trả 429
- AND audit log entry ghi event suspect-bruteforce

### ADDED Requirement: Gateway SHALL implement circuit breaker cho Hilo upstream

Mỗi Hilo endpoint SHALL có circuit breaker. Khi error rate >50% trong 30s → open circuit 60s, request mới trả 503 ngay không gọi Hilo.

#### Scenario: Circuit open
- WHEN Hilo trả 5xx >50% trong 30s
- THEN circuit breaker open
- AND subsequent request trả 503 với mã `UPSTREAM_UNAVAILABLE` trong 60s
- AND sau 60s thử half-open

### ADDED Requirement: Gateway SHALL trace mọi request qua OpenTelemetry

Mỗi request SHALL có `trace_id` (W3C TraceContext). Worker tạo span cho từng downstream call (D1, KV, Hilo). Trace export dual sink CF Trace + GCP Cloud Trace.

#### Scenario: Trace propagation
- WHEN frontend gọi `/api/invoices/issue` với header `traceparent`
- THEN Worker preserve trace_id, tạo span con
- AND khi gọi Hilo, forward `traceparent` (nếu Hilo support)

---

## Multi-T-VAN abstraction requirements

### ADDED Requirement: System SHALL define TVanAdapter interface

Code SHALL có interface `TVanAdapter` với method `verifyMst`, `issueInvoice`, `adjustInvoice`, `replaceInvoice`, `getInvoiceStatus`. KHÔNG có method `cancelInvoice` (đã bỏ theo NĐ 70/2025).

#### Scenario: Interface compliance check
- WHEN code review một adapter implementation mới
- THEN reviewer verify implements đủ 5 method, không thêm `cancelInvoice`

### ADDED Requirement: MVP SHALL implement HiloAdapter

HiloAdapter SHALL implement TVanAdapter, gọi Hilo API thật, có retry + circuit breaker + error mapping.

#### Scenario: Hilo error mapping
- WHEN Hilo trả error code `MST_INVALID`
- THEN HiloAdapter map sang app error `BUYER_MST_INVALID` với reference rule

### ADDED Requirement: System SHALL support multi-tenant T-VAN selection

Tenant config SHALL có field `tvan_provider`. MVP chỉ accept `'hilo'`. Adapter resolver theo tenant config.

#### Scenario: Unsupported provider
- WHEN tenant.tvan_provider = `'viettel'`
- THEN adapter resolver throw `UnsupportedProviderError`
- AND UI hiển thị card disabled với label "Available Phase 4"

---

## Compliance requirements

### ADDED Requirement: MVP SHALL NOT expose endpoint hoặc UI cho hành động "Hủy hóa đơn"

NĐ 70/2025 đã bỏ thủ tục hủy hóa đơn. MVP SHALL chỉ có "điều chỉnh" và "thay thế" trong cả API và UI.

#### Scenario: API surface check
- WHEN audit endpoint surface với OpenAPI
- THEN không có path nào chứa `cancel`, `void`, `huy`
- AND HiloAdapter interface không có method `cancelInvoice`

#### Scenario: UI surface check
- WHEN user xem màn hình bất kỳ
- THEN không có button/menu "Hủy hóa đơn"
- AND wizard sai sót chỉ đề xuất "Điều chỉnh" hoặc "Thay thế"

### ADDED Requirement: Compliance Center SHALL load rule từ rule engine config-driven

Mỗi compliance rule SHALL lưu ở D1 `compliance_rules` table với reference NĐ/TT/QĐ rõ ràng. Rule update không cần deploy code, chỉ update DB → KV cache invalidate.

#### Scenario: Rule update không cần deploy
- WHEN legal team update rule `preflight.mst.verified` (đổi config từ 30d → 60d)
- THEN admin tool update D1 + bump version
- AND KV cache invalidate trong 5 phút
- AND Worker tiếp theo dùng rule mới

### ADDED Requirement: MVP SHALL ghi audit log cho mọi mutation

Mọi action `ISSUE`, `ADJUST`, `REPLACE`, `EXPORT`, `VIEW_SENSITIVE`, `LOGIN`, `LOGOUT`, `REVOKE` SHALL ghi audit log entry với actor, action, entity, trace_id, ip_hash, payload diff.

#### Scenario: Issue invoice audit
- WHEN merchant issue invoice thành công
- THEN audit_log có entry với `action=ISSUE`, `entity_type=invoice`, `entity_id=<uuid>`, `actor_type=merchant`, `trace_id=<otel>`, `payload_json=<diff>`

#### Scenario: Audit sink kép
- WHEN audit-critical event (ISSUE/ADJUST/REPLACE) ghi vào D1
- THEN Worker enqueue queue `audit-sink-gcp`
- AND GCP Cloud Logging nhận event trong < 60s

### ADDED Requirement: Compliance Center SHALL reference NĐ 70/2025 + TT 32/2025 + QĐ 1510

Mỗi rule trong checklist SHALL có reference document và clause. Banner regulation update SHALL hiển thị khi có thay đổi.

#### Scenario: Rule reference
- WHEN user xem compliance rule list
- THEN mỗi rule có cột "Tham chiếu" với link đến NĐ 70 §<x>, TT 32 §<y>, QĐ 1510 §<z>

#### Scenario: Regulation banner
- WHEN admin tool publish bản tin "Dự thảo NĐ 2026 đã ban hành"
- THEN tất cả tenant thấy banner ở Compliance Center và Notification Center
- AND link tới change-log chi tiết

---

## UI / UX requirements

### ADDED Requirement: MVP SHALL có Haravan-like admin shell

UI SHALL có topbar 56px + sidebar 248px + main content scroll, theo phong cách Haravan Admin. Token màu trong package `@haravan-invoice/ui`.

#### Scenario: Shell render
- WHEN user vào MVP sau login
- THEN thấy topbar trắng với breadcrumb + notification bell + avatar
- AND sidebar xám nhạt với section Hóa đơn expanded
- AND main canvas xám lạnh hơn sidebar

### ADDED Requirement: MVP SHALL responsive 3 breakpoint

UI SHALL render đúng trên desktop (≥1280px), tablet (768-1023px), và mobile (<768px). POS mode `?mode=pos` SHALL có touch target ≥44px.

#### Scenario: Tablet POS
- WHEN viewport 768px với `?mode=pos`
- THEN sidebar collapse drawer, form simplified, button ≥44px

#### Scenario: Mobile bottom nav
- WHEN viewport <768px
- THEN bottom navigation 4 mục (Tổng quan, Danh sách, Phát hành, Tài khoản)

### ADDED Requirement: MVP SHALL có 7 màn hình core

MVP SHALL có 7 màn hình: Dashboard, Danh sách hóa đơn, Phát hành mới, Wizard sai sót, Compliance Center, Kết nối T-VAN, Notification Center.

#### Scenario: Navigation hierarchy
- WHEN user xem sidebar
- THEN section Hóa đơn có 7 sub-route đúng thứ tự trên

### ADDED Requirement: MVP SHALL có state coverage loading/empty/error/success cho mọi list/form

Mỗi screen có data fetch SHALL có 4 state visual: loading skeleton, empty state với CTA, error state với retry, success state.

#### Scenario: Empty state Danh sách
- WHEN tenant mới chưa có HĐ
- THEN list hiển thị empty state với CTA "Phát hành hóa đơn đầu tiên"

#### Scenario: Error state
- WHEN API fail
- THEN UI hiển thị error message + button "Thử lại" + trace_id để support

### ADDED Requirement: MVP SHALL dùng tiếng Việt làm UI primary

Tất cả string UI SHALL trong locale file `vi-VN.json`. EN scaffold tồn tại nhưng có thể rỗng cho MVP.

#### Scenario: Locale switch (Phase 4 sẵn sàng)
- WHEN user đổi locale qua URL `?lng=en`
- THEN i18next load EN bundle (scaffold)
- AND fall back vi-VN cho key chưa dịch

### ADDED Requirement: MVP SHALL dark mode auto + manual toggle

UI SHALL switch palette tự động theo system preference, đồng thời có manual toggle topbar lưu localStorage.

#### Scenario: System dark
- WHEN OS dark mode + chưa override
- THEN UI render dark palette

#### Scenario: Manual override
- WHEN user click toggle dark mode
- THEN giá trị lưu localStorage và áp dụng đến khi clear

### ADDED Requirement: MVP SHALL pass WCAG 2.1 AA

Tất cả màn hình SHALL pass contrast AA, keyboard navigation, ARIA label cho table/form/wizard.

#### Scenario: Keyboard nav wizard
- WHEN user dùng Tab/Enter để qua 5 step wizard
- THEN focus rõ ràng, không trap

---

## Performance & reliability requirements

### ADDED Requirement: Issue endpoint SHALL có p95 latency < 2.5s

`POST /api/invoices/issue` SHALL có p95 end-to-end (frontend ↔ Hilo) < 2.5s. p99 < 5s.

#### Scenario: Load test pre-beta
- WHEN k6 chạy 100 RPS issue trong 5 phút trên staging
- THEN p95 < 2.5s và error rate < 0.1%

### ADDED Requirement: MVP SHALL có uptime ≥ 99.5% trong beta

Tracked qua status page + CF Analytics + GCP Monitoring. Vượt 0.5% downtime/tháng → post-mortem.

#### Scenario: Incident recovery
- WHEN production incident
- THEN runbook follow, rollback time < 10 phút

### ADDED Requirement: MVP SHALL không bị mất data khi rollback

D1 migration SHALL có reverse migration. Workers version rollback không phá D1 state.

#### Scenario: Worker rollback
- WHEN `wrangler rollback` về version trước
- THEN data D1 không đổi, request tiếp tục serve

---

## Security requirements

### ADDED Requirement: MVP SHALL enforce HTTPS + HSTS preload

Toàn bộ traffic SHALL HTTPS. Header `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.

#### Scenario: HTTP redirect
- WHEN request HTTP
- THEN Cloudflare redirect 301 → HTTPS

### ADDED Requirement: MVP SHALL có CSP strict + CSRF protection

CSP header strict (no inline script trừ nonce). CSRF protection qua SameSite=Strict + double-submit token cho mutation.

#### Scenario: Inline script blocked
- WHEN attacker thử inject `<script>...</script>`
- THEN browser block do CSP

### ADDED Requirement: MVP SHALL không log PII raw

Logging layer SHALL hash hoặc redact MST, phone, email, CCCD trước khi ghi.

#### Scenario: Log scrubber
- WHEN audit log entry có buyer_email
- THEN log entry chỉ lưu hash SHA256 prefix 8 char + domain

### ADDED Requirement: MVP SHALL rotate secret 90 ngày

Workers Secret và GCP Secret Manager SHALL rotate auto qua GitHub Action.

#### Scenario: Rotation pipeline
- WHEN cron trigger 90d
- THEN action generate new secret, update CF + GCP, restart Worker để pick up

### ADDED Requirement: MVP SHALL pass penetration test pre-beta

Pen test bên thứ ba (Verichains/CMC hoặc internal) SHALL không có finding severity Critical hoặc High.

---

## Observability requirements

### ADDED Requirement: MVP SHALL có dashboard Grafana với 4 panel chính

Grafana Cloud workspace SHALL có dashboard hiển thị: request rate, p50/p95/p99 latency, error rate per endpoint, Hilo upstream latency.

### ADDED Requirement: MVP SHALL có alert policy 4 trigger

Alert policy SHALL bao gồm: p95 issue > 3s, error rate > 1%, Hilo error > 5%, compliance violation count > 0.

#### Scenario: Alert routing
- WHEN p95 issue > 3s 5 phút sustained
- THEN PagerDuty alert + Slack #ops channel

### ADDED Requirement: MVP SHALL có status page public

Status page SHALL public hiển thị uptime, incident, scheduled maintenance.

---

## Out of scope (KHÔNG có trong MVP capability này)

- Bulk operations full flow (defer Phase 1.1)
- Inbound Invoice AI workbench (defer Phase 2)
- Automation Builder (Phase 4)
- Public API + Marketplace (Phase 4)
- Multi-T-VAN real failover (Phase 4, MVP chỉ adapter interface)
- AI tiền-kiểm deep (Phase 3)
- AI cảnh báo rủi ro NCC (Phase 3)
- Zalo OA delivery real (Phase 2)
- Máy tính tiền NĐ 70 connectivity (Phase 1.1)
- Migration dữ liệu cũ từ Hilo portal (Phase 1 production)
- Voice-based invoice creation (Phase 3 nếu market validate)
