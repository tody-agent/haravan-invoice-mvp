# FEATURE PROMPT — Gateway Service Scaffold

**Phase:** 1 · **Effort:** 5-7 ngày · **Persona:** Backend
**Pre-read:** Master Context §3, Phase 1 §"Gateway Service Design"

---

## Mục tiêu

Build Gateway service backbone với REST API contract, OpenAPI spec, reliability patterns (idempotency, retry, circuit breaker, rate limit), observability, security baseline. Chưa connect Hilo (đó là prompt 03), chỉ scaffold + 1 mock adapter để chạy E2E test.

## Acceptance Criteria

- [ ] OpenAPI 3.1 spec đầy đủ cho 10 endpoint chính
- [ ] Fastify server với route handler skeleton
- [ ] Middleware: auth (OAuth bearer), idempotency, rate limit, request ID, metrics
- [ ] Circuit breaker library (cockatiel hoặc opossum) wrapped quanh adapter call
- [ ] Retry với exponential backoff + jitter
- [ ] Postgres schema migration cho `invoices`, `audit_logs`, `idempotency_keys`
- [ ] Redis client cho cache + idempotency dedupe
- [ ] OpenTelemetry instrumentation (auto + manual span quan trọng)
- [ ] Mock TVANAdapter cho test (return canned response)
- [ ] Health check endpoint `/v1/health` check DB + Redis + adapter
- [ ] Unit test ≥80% coverage cho core logic
- [ ] Integration test end-to-end issue → query happy path

## API Contract (10 endpoint)

```
POST   /v1/invoices              # phát hành (idempotent)
GET    /v1/invoices/{id}         # tra cứu
GET    /v1/invoices              # list + filter (page, period, status)
POST   /v1/invoices/{id}/replace # thay thế (NĐ 70/2025)
POST   /v1/invoices/{id}/adjust  # điều chỉnh
GET    /v1/invoices/{id}/pdf     # download PDF
GET    /v1/invoices/{id}/xml     # download XML
POST   /v1/inbound/sync          # trigger sync inbound
GET    /v1/inbound               # list inbound
GET    /v1/health
GET    /v1/audit?invoice_id=...
```

## Canonical Invoice Model (lập trong shared-types)

```typescript
export interface CanonicalInvoice {
  haravanId: string;         // HRV-INV-{merchant}-{seq}
  tvanId?: string;
  tvanProvider: 'hilo' | 'viettel' | 'misa';
  status: 'draft' | 'pending' | 'issued' | 'cqt_accepted' | 'cqt_rejected' | 'adjusted' | 'replaced';
  issueDate: string;         // ISO 8601
  buyer: Party;
  seller: Party;
  items: LineItem[];
  totals: Totals;
  payment: PaymentInfo;
  metadata: { orderId?: string; channel?: string; branchId?: string; cashierId?: string };
  cqt?: { confirmationId: string; confirmationAt: string; errorCode?: string };
  audit: AuditEntry[];
}

export interface Party { mst?: string; name: string; address?: string; email?: string; phone?: string }
export interface LineItem { sku?: string; name: string; qty: number; unitPrice: number; taxRate: number; discount?: number; total: number }
export interface Totals { subtotal: number; tax: number; discount: number; grandTotal: number }
export interface PaymentInfo { method: 'cash' | 'transfer' | 'card' | 'cod' | 'other'; status: 'pending' | 'paid' | 'failed'; ref?: string }
export interface AuditEntry { at: string; actor: string; action: string; details?: Record<string, unknown> }
```

## Prompt cho AI

```
Build Fastify-based Gateway service theo spec trên. Tham chiếu Master
Context §3 và Phase 1 plan §Gateway Service Design.

Step-by-step:

1. Tạo OpenAPI 3.1 spec tại docs/api/openapi.yaml. Cover 10 endpoint
   trên với request/response schema, error codes (400/401/403/404/409/
   422/429/500/502/503), example requests.

2. Generate Fastify route handler từ OpenAPI (dùng fastify-openapi-glue
   hoặc tương tự). Stub mỗi handler trả 501 Not Implemented.

3. Implement core middleware:
   - request-id: gắn UUID vào mỗi request, propagate downstream
   - auth: parse Bearer token, validate JWT (RS256), attach merchantId
     vào request.context. Mock JWT verifier cho dev.
   - idempotency: read X-Idempotency-Key header, check Redis dedupe
     (key=`idem:{merchantId}:{key}`, TTL 24h). Nếu exist → trả cached
     response. Nếu mới → process + cache response.
   - rate-limit: per-merchant 100 req/s, dùng Redis sliding window.
   - metrics: prometheus exporter, histogram cho latency, counter cho
     request count + error.

4. Implement TVANAdapter interface (xem prompt 03 chi tiết). Mock
   adapter trả canned response cho test.

5. Postgres schema (migration files):
   - invoices: id (UUID PK), haravan_id (UNIQUE), tvan_id, tvan_provider,
     status, issue_date, merchant_id, buyer (JSONB), seller (JSONB),
     items (JSONB), totals (JSONB), payment (JSONB), metadata (JSONB),
     cqt (JSONB), created_at, updated_at, version (optimistic lock)
   - audit_logs: id, invoice_id (FK), at, actor, action, details (JSONB),
     ip, user_agent
   - idempotency_keys: key (PK), merchant_id, response (JSONB),
     created_at, expires_at
   - Index: merchant_id + status, merchant_id + issue_date, haravan_id

6. Service layer (core/):
   - InvoiceService.issue(payload, idempotencyKey, merchantId)
     - Validate payload (business rules)
     - Persist với status 'draft'
     - Call adapter.issue() trong circuit breaker + retry
     - Update status theo response
     - Audit log
     - Return canonical
   - InvoiceService.query, .replace, .adjust similar pattern

7. Reliability:
   - Circuit breaker per adapter, opens at 50% error rate trong 1m,
     half-open sau 30s
   - Retry: exponential backoff (1s, 2s, 4s, 8s), max 4 attempts, only
     on 5xx/network. Jitter ±25%.
   - Timeout: client 30s, adapter call 25s

8. Observability:
   - OpenTelemetry SDK, auto-instrument fastify + http + pg + redis
   - Manual span quan trọng: 'invoice.issue', 'adapter.hilo.call'
   - Logs: pino with structured JSON, mask PII (mst, email, phone)

9. Tests:
   - Unit: validateInvoice, idempotency middleware, circuit breaker
   - Integration: full issue flow với mock adapter, Postgres + Redis
     containerized (testcontainers)
   - E2E: spin gateway + mock adapter, hit POST /v1/invoices, verify
     response + DB state + audit log

10. Health check `/v1/health`:
    - DB ping (timeout 1s)
    - Redis ping (timeout 500ms)
    - Adapter health (call TVANAdapter.healthCheck() if exists)
    - Return 200 OK + {db, redis, adapter} status, hoặc 503 nếu critical
      down

Output từng file. Mark `// TODO` cho:
- JWT verification implementation (chờ Haravan auth team confirm key)
- Hilo adapter actual implementation (prompt 03)
```

## Verification Checklist

- [ ] OpenAPI spec validate qua spectral lint
- [ ] `pnpm test` pass, coverage ≥80%
- [ ] `pnpm dev` chạy gateway, hit `GET /v1/health` trả 200
- [ ] POST `/v1/invoices` với mock adapter → tạo record DB + audit log
- [ ] Lặp request với cùng `X-Idempotency-Key` → trả cached response
- [ ] Spam 200 req/s → 429 sau threshold 100
- [ ] Circuit breaker mở khi mock adapter error 60% trong 1 phút
- [ ] OpenTelemetry trace hiển thị span đầy đủ qua Jaeger UI
