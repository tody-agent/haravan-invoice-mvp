# Design: MVP Foundation — Cloudflare + Google Serverless Stack

**Change ID:** `mvp-foundation-cf-google`
**Date:** 2026-05-14
**Status:** Draft

---

## 1. Context & technical approach

### 1.1 Mục tiêu kỹ thuật

Dựng **foundation hạ tầng** để chạy MVP Haravan Invoice Wrapper trên environment thật, không phải mock. Foundation phải:

1. **Serverless toàn phần** — không có VM, không có Kubernetes; scale 0→∞ tự động, không pay-for-idle.
2. **Edge-first** — latency cho thị trường VN < 100ms cho static + < 500ms cho API call (chưa tính Hilo upstream).
3. **Security-by-default** — Zero Trust cho staff, OAuth2 cho merchant, mTLS upstream nếu Hilo support, audit log immutable.
4. **Multi-T-VAN từ Day 1** — adapter pattern, Phase 1 chỉ implement Hilo, nhưng interface đủ rộng để plug Viettel/MISA Phase 4.
5. **Compliance-as-code** — rule engine config-driven, không hardcode (phòng dự thảo NĐ 2026).
6. **Observable** — every request có trace ID, audit-critical event sink kép.

### 1.2 Why Cloudflare + Google (không phải AWS / Azure / Vercel)

| Tiêu chí | Cloudflare + Google | AWS Lambda + RDS | Vercel + PlanetScale |
|---|---|---|---|
| Edge POP ở VN | ✅ HKG + SIN | ⚠️ chỉ SIN | ⚠️ chỉ SIN |
| Pricing per-request (true serverless) | ✅ Workers $0.30/M | ⚠️ Lambda + ALB + NAT cost | ⚠️ Vercel Pro fee + execution |
| Zero Trust built-in | ✅ Cloudflare Access | ⚠️ AWS SSO + WAF combine | ❌ phải tự setup |
| AI inference giá tốt | ✅ Gemini 1.5 Flash $0.075/1M tokens | ⚠️ Bedrock đắt hơn | ⚠️ phải qua OpenAI/Anthropic |
| Compliance VN-friendly | ✅ Google có data residency Asia-Southeast | ⚠️ AWS chưa có VN region | ❌ |
| Vendor lock-in | ⚠️ medium (Workers-specific) | ⚠️ high (RDS + Lambda + S3) | ⚠️ high |
| Team skill needed | TypeScript + edge runtime | Cần DevOps team đủ | TypeScript thuần |
| MVP cost ~10k req/day | ~$20/tháng | ~$120/tháng | ~$80/tháng |

**Kết luận**: Cloudflare + Google ăn về cost, edge POP cho VN, và security defaults. Trade-off: D1 còn beta (GA 4/2024 nhưng vẫn evolving), Workers runtime restrictions (no Node native, 50ms CPU/request soft limit ở Bundled tier — phải dùng Unbound).

### 1.3 Out-of-band decisions đã chốt qua AskUserQuestion

| Decision | Chốt | Lý do |
|---|---|---|
| MVP coexist hay replace prototype HTML | **Coexist** | Giữ artifact demo cho merchant interview, giảm risk khi MVP chưa stable |
| Primary DB | **D1 + R2 + KV** (all Cloudflare) | Latency edge, cost, đủ scale cho MVP 12-18 tháng |
| Auth | **Haravan SSO primary + Google Workspace fallback** | Merchant đã login Haravan, không bắt login lại; staff dùng Google Workspace có sẵn |

---

## 2. Architecture overview

### 2.1 5-tầng kiến trúc (kế thừa từ Master Context §3, ánh xạ vào stack CF+Google)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Tầng 5 — AI / Intelligence Layer                                   │
│    Google Gemini 1.5 Flash API (MST OCR, auto-fill suggest)         │
│    [Phase 3 sẽ thêm Claude/Gemini Pro cho deep reasoning]           │
└──────────────────────────────────────────────────────────────────────┘
                                  ↑
┌──────────────────────────────────────────────────────────────────────┐
│  Tầng 4 — Portal UI                                                  │
│    Cloudflare Pages (React 18 + Vite + TS + Tailwind + Hara DS Proxy)│
│    - Embed iframe trong Haravan Admin (parent-frame postMessage)    │
│    - Standalone trên mvp.haravan-invoice.dev cho beta               │
│    - Responsive: desktop 1280+, tablet 768-1024, mobile 375+         │
└──────────────────────────────────────────────────────────────────────┘
                                  ↑
┌──────────────────────────────────────────────────────────────────────┐
│  Tầng 2 — Haravan Invoice Gateway                                    │
│    Cloudflare Workers (Hono framework, TypeScript)                   │
│    - Hilo Adapter (rate limit, retry exponential, circuit breaker)   │
│    - Idempotency (KV-backed, 24h TTL)                                │
│    - Auth middleware (Haravan OAuth2 + CF Access JWT verify)         │
│    - Rule engine (compliance pre-check, config-driven)               │
│    - OpenTelemetry instrumentation                                   │
└──────────────────────────────────────────────────────────────────────┘
                ↑                              ↓
┌──────────────────────────┐    ┌──────────────────────────────────────┐
│  Tầng 1 — Hilo Core      │    │  Tầng 3 — Metadata DB                │
│    Hilo T-VAN API        │    │    Cloudflare D1 (SQLite at edge)   │
│    - Ký số XML           │    │    - Order↔Invoice mapping          │
│    - Truyền CQT          │    │    - Audit log append-only          │
│    - Lưu XML pháp lý     │    │    - Compliance log                  │
│    [Haravan KHÔNG TOUCH] │    │    - Settings, RBAC                  │
└──────────────────────────┘    │    Cloudflare R2 (object storage)   │
                                │    - PDF preview, biên bản          │
                                │    - Attachment                      │
                                │    Cloudflare KV (cache + session)  │
                                │    - Session token, MST cache 30d   │
                                │    - Rate limit counter             │
                                │    - Idempotency key                │
                                └──────────────────────────────────────┘
```

### 2.2 Request flow chính: Phát hành 1-click POS

```
1. Cashier POS gõ "Phát hành" trong Haravan Admin
2. POS frontend → Cloudflare Pages JS bundle (đã cached edge)
3. Pages JS POST /api/invoices/issue tới Worker
4. Worker:
   a. Verify JWT (Haravan SSO token) — cache valid keys trong KV (1h TTL)
   b. Check idempotency key trong KV (24h TTL) → trả cached response nếu trùng
   c. Run compliance pre-check (9 rule engine, config từ D1)
   d. Write metadata draft vào D1 (status=PENDING, txn_id=uuid)
   e. Call Hilo Adapter:
      - GET MST verify (cache 30d KV)
      - POST issue-invoice (idempotency-key forward)
      - Receive Hilo invoice ID + CQT receipt code
   f. Update D1 metadata (status=ISSUED, hilo_id, cqt_code)
   g. Enqueue Cloudflare Queue: delivery-email + audit-sink-gcp
   h. Return 201 to frontend với invoice summary
5. Background:
   - Queue worker: gửi email merchant + log GCP Cloud Logging audit event
   - Cron worker (daily): aggregate metric, alert if SLA breach
```

**Latency budget**:
- Worker auth + idempotency check: 30ms
- D1 write draft: 20ms (regional D1 với SIN replica)
- Hilo API call: 1.5s p95 (assumption từ partnership)
- D1 update: 20ms
- Queue enqueue: 10ms
- **Total budget: ~1.6s p95, < 2.5s SLA**

---

## 3. Key decisions với rationale

### 3.1 DECISION: TypeScript + Hono framework cho Workers

**Why**: Hono là framework Worker-native, bundle nhỏ (~12kb), API giống Express, có middleware ecosystem (JWT, CORS, validator). Alternative: itty-router (quá thin), Wrangler raw (verbose).

**Trade-off**: Hono còn trẻ (2023), nhưng đã production ở nhiều dự án Cloudflare ref.

### 3.2 DECISION: D1 schema design

Bảng chính:

```sql
-- Tenant model: 1 Haravan store = 1 tenant
CREATE TABLE tenants (
  tenant_id TEXT PRIMARY KEY,          -- uuid
  haravan_store_id TEXT NOT NULL UNIQUE,
  mst TEXT NOT NULL,
  name TEXT NOT NULL,
  hilo_account_id TEXT,                -- partner reference
  created_at INTEGER NOT NULL,
  settings_json TEXT                   -- JSON blob cho settings nhẹ
);

-- Invoice metadata (KHÔNG lưu XML)
CREATE TABLE invoices (
  invoice_id TEXT PRIMARY KEY,         -- uuid internal
  tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id),
  hilo_invoice_id TEXT UNIQUE,         -- Hilo cấp sau khi issue
  cqt_code TEXT,                       -- mã CQT
  order_id TEXT,                       -- Haravan Order
  channel TEXT NOT NULL,               -- web/pos/admin/api
  status TEXT NOT NULL,                -- DRAFT/PENDING/ISSUED/ADJUSTED/REPLACED/REJECTED
  buyer_mst TEXT,
  buyer_name TEXT,                     -- encrypted at rest (Workers Crypto + KMS key)
  total_amount INTEGER,                -- VND, integer
  issued_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_invoices_tenant_status ON invoices(tenant_id, status);
CREATE INDEX idx_invoices_issued_at ON invoices(issued_at DESC);

-- Audit log append-only
CREATE TABLE audit_log (
  event_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  actor_type TEXT NOT NULL,            -- merchant/staff/system
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,                -- ISSUE/ADJUST/REPLACE/VIEW/EXPORT
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  trace_id TEXT NOT NULL,              -- OpenTelemetry trace
  ip_hash TEXT,                        -- SHA256 truncated, không lưu raw
  user_agent TEXT,
  payload_json TEXT,                   -- diff trước/sau
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_audit_tenant_time ON audit_log(tenant_id, created_at DESC);
-- Append-only enforced ở Worker layer (no DELETE/UPDATE qua application code)

-- Compliance rule engine config (hot-reload qua KV)
CREATE TABLE compliance_rules (
  rule_id TEXT PRIMARY KEY,
  rule_name TEXT NOT NULL,
  reference TEXT NOT NULL,             -- NĐ 70/2025 §7, TT 32/2025...
  rule_type TEXT NOT NULL,             -- PREFLIGHT/POSTFLIGHT/PERIODIC
  enabled INTEGER NOT NULL,
  config_json TEXT NOT NULL,
  effective_from INTEGER,
  effective_to INTEGER,
  version INTEGER NOT NULL
);

-- RBAC
CREATE TABLE roles (role_id TEXT PRIMARY KEY, name TEXT, permissions_json TEXT);
CREATE TABLE user_roles (tenant_id TEXT, user_id TEXT, role_id TEXT, PRIMARY KEY (tenant_id, user_id, role_id));
```

**Why SQLite/D1 chứ không Firestore**:
- Pricing: D1 $5/GB-month + $0.001/1k row write vs Firestore $0.18/100k read. MVP scale ~10k req/day → D1 rẻ hơn 5-10x.
- Latency edge: D1 replica gần Worker (SIN/HKG) < 20ms p95 vs Firestore SIN → Worker cross-region.
- SQL flexibility: audit log query phức tạp (filter theo tenant + time range + entity) dễ ở SQL.
- Trade-off: D1 < 10GB/db hard cap, no auto-sharding. Mitigation: shard theo tenant_id range nếu cần Phase 1.2.

### 3.3 DECISION: Idempotency contract

- Client (POS/Web) sinh `Idempotency-Key: <uuid v4>` cho mọi mutation request.
- Worker check KV `idem:<tenant_id>:<idem_key>`:
  - HIT → trả cached response (status, body, hash).
  - MISS → process request, sau khi success/error final → store response trong KV với TTL 24h.
- Hilo upstream nhận `idempotency-key` forward (cần verify Hilo support — flagged Open Question #2 ở proposal).

### 3.4 DECISION: Multi-T-VAN adapter pattern (Day 1)

```typescript
// packages/hilo-adapter/src/types.ts
export interface TVanAdapter {
  readonly providerId: 'hilo' | 'viettel' | 'misa' | 'efy' | 'vnpt';
  verifyMst(mst: string): Promise<MstVerifyResult>;
  issueInvoice(req: IssueInvoiceRequest): Promise<IssueInvoiceResponse>;
  adjustInvoice(req: AdjustInvoiceRequest): Promise<AdjustInvoiceResponse>;
  replaceInvoice(req: ReplaceInvoiceRequest): Promise<ReplaceInvoiceResponse>;
  getInvoiceStatus(hiloInvoiceId: string): Promise<InvoiceStatusResponse>;
  // NOTE: KHÔNG có method cancelInvoice — đã bỏ theo NĐ 70/2025
}

// packages/hilo-adapter/src/hilo.ts — Phase 1 implementation
export class HiloAdapter implements TVanAdapter { ... }

// packages/hilo-adapter/src/viettel.ts — Phase 4 stub
export class ViettelAdapter implements TVanAdapter { throw new Error('Not implemented yet'); }
```

Worker resolve adapter qua tenant settings:

```typescript
function getAdapter(tenant: Tenant): TVanAdapter {
  switch (tenant.settings.tvan_provider) {
    case 'hilo': return new HiloAdapter(env);
    default: throw new UnsupportedProviderError();
  }
}
```

### 3.5 DECISION: Auth flow

**Merchant flow (Haravan OAuth2)**:
```
1. Merchant click "Hóa đơn" trong Haravan Admin
2. Haravan Admin redirect: https://mvp.haravan-invoice.dev/auth/callback?code=...
3. Worker /auth/callback:
   a. Exchange code → access_token (Haravan IdP)
   b. Get profile: user_id, store_id, mst, role
   c. Issue MVP session JWT (HS256, 8h TTL), signing key từ Workers Secret
   d. Set cookie: __Host-mvp_session (Secure, HttpOnly, SameSite=Strict)
   e. Cache user profile trong KV (1h TTL)
   f. Redirect → /dashboard
4. Subsequent request: Worker verify session JWT từ cookie
   - JWT expire → 401, frontend re-auth
   - Token revoke check: KV blacklist `revoke:<jti>` (admin can revoke)
```

**Staff flow (Cloudflare Access + Google Workspace)**:
```
1. Staff truy cập /admin/*
2. Cloudflare Access intercept → Google Workspace OAuth (haravan.com domain only)
3. CF Access trả JWT signed by Cloudflare → Worker verify aud/iss
4. Worker map staff_email → internal staff_role (table D1 staff_roles)
```

### 3.6 DECISION: Rule engine cho Compliance Center

**Config-driven**, không hardcode rule pháp luật. Mỗi rule là JSON config:

```json
{
  "rule_id": "preflight.mst.verified",
  "rule_name": "MST khách hàng đã verify trong 30 ngày",
  "reference": "NĐ 123 §5.2",
  "rule_type": "PREFLIGHT",
  "enabled": true,
  "effective_from": 1640995200,
  "config": {
    "check": "buyer.mst_verified_at_within_days <= 30",
    "severity": "warning",
    "message_vi": "MST {{mst}} chưa verify trong 30 ngày, đề nghị verify lại trước khi phát hành",
    "auto_action": "verify_mst_now"
  }
}
```

Rule loader hot-reload từ KV cache (5 min TTL), source of truth ở D1. Update rule → bump version, log changelog. Phòng được scenario "dự thảo NĐ 2026 ban hành đột ngột → chỉ update config, không deploy code".

### 3.7 DECISION: Observability

- **Tracing**: OpenTelemetry SDK in Worker, export sang Cloudflare Trace + GCP Cloud Trace (dual sink).
- **Logs**: Workers Logs (structured JSON) — non-PII. Audit-critical event sink kép sang GCP Cloud Logging via Logging API.
- **Metrics**: Cloudflare Analytics Engine cho request count/latency. GCP Monitoring cho custom metric (invoice_issued_per_minute, hilo_error_rate).
- **Alerting**: GCP Monitoring Alert Policy → webhook PagerDuty / Slack.
- **Dashboard**: Grafana Cloud (free tier) data source Cloudflare + GCP.

### 3.8 DECISION: Security layers

| Layer | Control | Implementation |
|---|---|---|
| Edge | DDoS, WAF, Rate limit | Cloudflare auto + custom WAF rule |
| Edge | Bot | Cloudflare Turnstile cho public endpoint (MST lookup, signup) |
| Transport | TLS 1.3, HSTS preload | Cloudflare default |
| Auth | OAuth2 PKCE + session JWT | Hono `@hono/jwt` middleware |
| Authorization | RBAC qua D1 user_roles | Decorator-style middleware |
| Data at rest | AES-256-GCM (Workers Crypto API) cho PII column | Key trong Workers Secret, rotation 90d |
| Data in transit upstream | mTLS với Hilo (nếu Hilo support) hoặc TLS + signed JWT | Workers fetch với client cert binding |
| Audit | Append-only log + dual sink | Worker enforced, no DELETE/UPDATE allowed |
| Secrets | Workers Secrets + GCP Secret Manager | rotation pipeline GitHub Action |
| Vulnerability | npm audit + Dependabot + Snyk free tier | CI gate |
| Privacy | PII hash khi log, không lưu CCCD/CMND raw | Worker middleware redaction |

### 3.9 DECISION: Responsive strategy

- **Mobile-first CSS** với Tailwind breakpoint default (`sm/md/lg/xl`).
- **3 layout mode**:
  - `desktop` (≥1280px): sidebar 248px + main + optional rail
  - `tablet` (768-1023px): sidebar collapse → drawer, topbar compact, POS-friendly touch target ≥44px
  - `mobile` (<768px): bottom nav, drawer cho sidebar, list-view-first
- **POS tablet**: separate `mode=pos` query param → larger touch target, simplified flow (skip auto-fill, focus 1-click).
- **Mobile owner snapshot**: subset of dashboard, không full feature.

### 3.10 DECISION: Deployment strategy

- **Environments**: `dev` (auto deploy main), `staging` (manual promote), `prod` (canary 10% → 100%).
- **Wrangler config** chia environment trong `wrangler.toml`:
  ```toml
  [env.dev]
  d1_databases = [{ binding = "DB", database_id = "<dev-d1-id>" }]
  [env.staging]
  d1_databases = [{ binding = "DB", database_id = "<staging-d1-id>" }]
  [env.prod]
  d1_databases = [{ binding = "DB", database_id = "<prod-d1-id>" }]
  ```
- **Migration**: D1 migration qua Wrangler CLI, version-controlled trong `services/gateway/migrations/`.
- **Rollback**: Workers version rollback qua Wrangler (`wrangler rollback`), DB rollback qua reverse migration script.

---

## 4. Module structure

### 4.1 `apps/mvp/` (frontend)

```
apps/mvp/
├── src/
│   ├── app.tsx                  # Root, providers
│   ├── routes/                  # TanStack Router file-based
│   │   ├── _shell.tsx           # Haravan-like shell
│   │   ├── dashboard.tsx
│   │   ├── invoices/
│   │   │   ├── index.tsx        # Danh sách
│   │   │   ├── new.tsx          # Phát hành mới
│   │   │   ├── $invoiceId.tsx   # Detail drawer
│   │   │   └── correction/$id.tsx  # Wizard
│   │   ├── compliance.tsx
│   │   ├── tvan.tsx
│   │   └── notifications.tsx
│   ├── features/
│   │   ├── auth/
│   │   ├── invoice-issue/
│   │   ├── invoice-list/
│   │   ├── correction-wizard/
│   │   ├── compliance-center/
│   │   └── notification-center/
│   ├── api/                     # TanStack Query hooks
│   ├── lib/
│   │   ├── api-client.ts        # fetch wrapper với CSRF, retry
│   │   ├── auth.ts
│   │   └── i18n.ts
│   └── locales/
│       └── vi-VN.json
├── public/
└── package.json
```

### 4.2 `services/gateway/` (Worker)

```
services/gateway/
├── src/
│   ├── index.ts                 # Hono app entry
│   ├── routes/
│   │   ├── auth.ts              # /auth/callback, /auth/logout
│   │   ├── invoices.ts          # /api/invoices/*
│   │   ├── compliance.ts        # /api/compliance/*
│   │   ├── tvan.ts              # /api/tvan/*
│   │   └── webhooks.ts          # /webhooks/hilo (callback từ Hilo)
│   ├── middleware/
│   │   ├── auth.ts              # JWT verify
│   │   ├── rbac.ts
│   │   ├── idempotency.ts
│   │   ├── rate-limit.ts
│   │   ├── audit.ts             # auto audit-log writer
│   │   └── telemetry.ts         # OpenTelemetry span
│   ├── services/
│   │   ├── rule-engine.ts
│   │   ├── compliance-checker.ts
│   │   ├── invoice-service.ts
│   │   └── notification-service.ts
│   ├── repositories/            # D1 access
│   │   ├── invoice-repo.ts
│   │   ├── tenant-repo.ts
│   │   └── audit-repo.ts
│   └── queues/                  # Queue consumer
│       ├── delivery-consumer.ts
│       └── audit-sink-consumer.ts
├── migrations/                  # D1 schema versioned
│   ├── 0001_initial.sql
│   ├── 0002_audit_log.sql
│   └── ...
├── wrangler.toml
└── package.json
```

### 4.3 `packages/`

```
packages/
├── ui/                          # Hara DS Proxy
│   ├── src/
│   │   ├── tokens.ts            # Color, spacing, typography
│   │   ├── components/          # Button, Card, Table, Drawer, Tabs, Stepper
│   │   └── tailwind-preset.ts
│   └── package.json
├── hilo-adapter/
│   ├── src/
│   │   ├── types.ts             # TVanAdapter interface
│   │   ├── hilo.ts              # HiloAdapter impl
│   │   ├── errors.ts
│   │   └── client.ts            # HTTP fetch wrapper
│   └── package.json
└── shared/
    ├── src/
    │   ├── schemas/             # Zod schemas
    │   ├── types/
    │   └── locale/
    └── package.json
```

### 4.4 `infra/`

```
infra/
├── cloudflare/
│   ├── main.tf                  # Pages, Workers, D1, R2, KV, Queues, Access app
│   ├── variables.tf
│   ├── waf.tf                   # Custom WAF rules
│   └── access.tf                # Zero Trust app cho /admin
└── google/
    ├── main.tf                  # Workspace SSO config, Secret Manager, Cloud Logging sink
    └── variables.tf
```

---

## 5. Constraints reaffirmed (từ Master Context)

1. KHÔNG reimplement T-VAN function — chỉ gọi Hilo API.
2. KHÔNG lưu XML pháp lý ở D1/R2 — chỉ metadata + R2 chứa PDF preview render từ Hilo response.
3. KHÔNG cho phép action "Hủy hóa đơn" (bỏ theo NĐ 70/2025) — không có endpoint, không có UI.
4. Adapter interface multi-T-VAN từ Day 1, nhưng MVP chỉ ship Hilo.
5. UI vi-VN primary, technical docs có thể EN.
6. Audit log: actor + action + entity + trace ID đầy đủ, immutable.

---

## 6. Trade-offs đã chấp nhận

| Trade-off | Đổi gì lấy gì |
|---|---|
| D1 thay vì Firestore | Cost thấp + edge latency tốt; đổi lại scale cap 10GB/db, phải shard nếu vượt |
| Hono thay vì raw Workers | Developer velocity; đổi lại framework dependency, có thể đổi major version |
| Cloudflare Pages thay vì Vercel | Cost + edge; đổi lại DX yếu hơn Vercel (no instant rollback UI gọn) |
| Workers Unbound thay vì Bundled | CPU time generous; đổi lại $0.50/M req thay vì $0.30/M |
| Single-region D1 với read replica | Đơn giản; đổi lại nếu mở rộng global region cần redesign |
| Coexist prototype HTML + MVP | Maintenance 2 artifact; đổi lại không mất demo tool khi MVP chưa stable |
| Defer Zalo OA real → mock | Ship MVP đúng timeline; đổi lại merchant chưa thấy full delivery flow |

---

## 7. Verification approach

### 7.1 Smoke test (mỗi PR merge)

- Build Pages + Worker pass
- Wrangler dev local boot < 10s
- 5 critical endpoint return 200 với mock auth: `/dashboard`, `/api/invoices` (list), `/api/invoices/preflight` (rule check)

### 7.2 Integration test (nightly)

- Staging environment + Hilo sandbox API
- Run 20 scenario: issue valid, issue rejected, adjust, replace, MST verify, idempotency replay, rate limit, auth failure

### 7.3 Load test (pre-beta)

- k6 hoặc Artillery: 100 RPS sustained 5 phút trên staging
- p95 < 2.5s, error rate < 0.1%, no 5xx cascading

### 7.4 Security test (pre-beta)

- OWASP ZAP automated scan
- Manual penetration test bởi internal team hoặc bên thứ ba (Verichains/CMC)
- Compliance review checklist với legal counsel

### 7.5 Accessibility & responsive (pre-beta)

- Axe-core CI gate
- Lighthouse score ≥ 85
- Test thật trên 5 device: MacBook 13", iPad Air, Samsung Tab A8, iPhone 13, Pixel 7

---

## 8. References

- `proposal.md` (cùng change)
- `00_master_context.md` v1.0
- `02_phase1_parity.md`
- Cloudflare Workers docs: https://developers.cloudflare.com/workers/
- Cloudflare D1 limits: https://developers.cloudflare.com/d1/platform/limits/
- Hono framework: https://hono.dev/
- TanStack Router: https://tanstack.com/router
- NĐ 70/2025: chinhphu.vn (reference từ Master Context §11)
- TT 32/2025: thuvienphapluat.vn (reference từ Master Context §11)
