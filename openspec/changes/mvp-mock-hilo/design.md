# Design: Haravan Invoice MVP — Mock Hilo, Real Everything Else

## Decision Record
- **Decision:** MVP với MockAdapter (không gọi Hilo thật), build thật toàn bộ Gateway + Portal trên Cloudflare free tier
- **Reason:** Ship working MVP nhanh, không phụ thuộc Hilo timeline. Khi có Hilo credentials → swap MockAdapter → HiloAdapter, code không đổi.
- **Date:** 2026-05-16

---

## 1. Context & Scope

### What IS in MVP scope (build thật)
- ✅ Gateway API (Cloudflare Workers) — full REST endpoints
- ✅ Portal UI (Cloudflare Pages) — React SPA, tất cả screens
- ✅ Database (D1) — invoices, audit, config, customers
- ✅ File storage (R2) — PDF cache
- ✅ Cache (KV) — session, idempotency
- ✅ Validation Engine — MST, tax, business rules
- ✅ PDF Renderer — generate PDF từ invoice data
- ✅ Reporting — 4 báo cáo cơ bản
- ✅ Audit Logger — mọi action được log
- ✅ Auth — mock JWT (Haravan SSO giả lập)

### What IS NOT in MVP scope (mock/skip)
- 🔶 HiloAdapter = **MockAdapter** (canned response, fake CQT confirmation)
- 🔶 XML Builder = **mock XML output** (structure đúng, không gửi CQT thật)
- 🔶 Haravan SSO = **mock auth** (hardcode test user)
- 🔶 Haravan Order API = **mock order data** (fake orders cho one-click test)
- ⏭️ AI Layer — Phase 3, skip hoàn toàn
- ⏭️ Zalo OA — Phase 2, skip
- ⏭️ Real digital signing — cần Hilo HSM

### Swap strategy khi có Hilo thật
```
MockAdapter.issue() → return fake {success: true, tvanId: "MOCK-xxx"}
                    ↓ swap
HiloAdapter.issue() → call /api/einvoicesolution/send → return real response
```
**Zero code change ngoài adapter.** Gateway, Portal, DB, Validation — tất cả giữ nguyên.

---

## 2. Cloudflare Free Tier Limits

| Service | Free Limit | MVP Usage Estimate | OK? |
|---------|------------|-------------------|-----|
| **Workers** | 100K requests/day, 10ms CPU/req | ~1K req/day MVP | ✅ |
| **D1** | 5GB storage, 5M reads/day, 100K writes/day | ~100MB data, ~5K reads | ✅ |
| **R2** | 10GB storage, 1M Class A ops/month | ~500MB PDFs | ✅ |
| **KV** | 100K reads/day, 1K writes/day | ~500 reads/day | ✅ |
| **Pages** | Unlimited bandwidth, 500 builds/month | SPA ~5MB | ✅ |

> [!NOTE]
> Free tier đủ cho MVP + beta 10-50 merchants. Production cần upgrade Workers Paid ($5/mo).

---

## 3. Tech Stack MVP

```
Frontend:  React 18 + TypeScript + Vite → Cloudflare Pages
Backend:   Hono (lightweight, Cloudflare Workers native) → Workers
Database:  D1 (SQLite edge) + Drizzle ORM
Storage:   R2 (PDF files)
Cache:     KV (sessions, idempotency keys)
Auth:      Mock JWT → swap Haravan SSO later
Test:      Vitest + Playwright
```

> **Hono thay Fastify** — Fastify không chạy native trên Workers. Hono là framework Workers-native, API tương đương, lighter.

---

## 4. Architecture — MVP Simplified

```
┌──────────────────────────────────────────┐
│          CLOUDFLARE PAGES                │
│    React Portal (SPA)                    │
│  Dashboard│List│Issue│Wizard│Compliance   │
└─────────────────┬────────────────────────┘
                  │ fetch /api/v1/*
┌─────────────────▼────────────────────────┐
│          CLOUDFLARE WORKERS              │
│    Hono Gateway API                      │
│                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Validation│ │ Invoice  │ │Reporting │ │
│  │ Engine   │ │ Service  │ │ Engine   │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  PDF     │ │  Audit   │ │  Config  │ │
│  │ Renderer │ │  Logger  │ │ Service  │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │     MockAdapter (fake Hilo)     │    │
│  │ issue()→fake success            │    │
│  │ query()→fake invoice data       │    │
│  │ replace()→fake confirmation     │    │
│  │ adjust()→fake confirmation      │    │
│  └──────────────────────────────────┘    │
└──────┬───────────┬───────────┬───────────┘
       │           │           │
   ┌───▼───┐   ┌──▼──┐   ┌───▼───┐
   │  D1   │   │ R2  │   │  KV   │
   │(data) │   │(PDF)│   │(cache)│
   └───────┘   └─────┘   └───────┘
```

---

## 5. API Contract — 12 Endpoints

```
# Auth
POST   /api/v1/auth/login          → mock JWT token

# Invoices (core)
POST   /api/v1/invoices             → tạo + phát hành (mock Hilo)
GET    /api/v1/invoices             → list + filter + pagination
GET    /api/v1/invoices/:id         → chi tiết
POST   /api/v1/invoices/:id/replace → thay thế (mock Hilo)
POST   /api/v1/invoices/:id/adjust  → điều chỉnh (mock Hilo)
GET    /api/v1/invoices/:id/pdf     → download PDF (real render)

# Reports
GET    /api/v1/reports/summary      → thống kê tổng hợp
GET    /api/v1/reports/monthly      → bảng kê tháng

# Config
GET    /api/v1/config               → merchant settings
PATCH  /api/v1/config               → update settings

# Health
GET    /api/v1/health               → DB + KV check
```

---

## 6. Database Schema (D1)

```sql
-- Invoices (source of truth)
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  haravan_id TEXT UNIQUE NOT NULL,
  tvan_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  -- CHECK(status IN ('draft','pending','issued','cqt_accepted','cqt_rejected','adjusted','replaced'))
  issue_date TEXT,
  buyer_name TEXT,
  buyer_mst TEXT,
  buyer_address TEXT,
  buyer_email TEXT,
  seller_name TEXT NOT NULL,
  seller_mst TEXT NOT NULL,
  items TEXT NOT NULL, -- JSON array
  subtotal INTEGER NOT NULL DEFAULT 0,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  tax_rate REAL DEFAULT 0.1,
  payment_method TEXT DEFAULT 'transfer',
  channel TEXT DEFAULT 'admin', -- admin/pos/web/auto
  order_id TEXT,
  metadata TEXT, -- JSON
  replaced_by TEXT, -- FK to invoices.id
  replaces TEXT,    -- FK to invoices.id  
  adjusted_by TEXT,
  adjusts TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  version INTEGER DEFAULT 1
);

-- Audit trail
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  details TEXT, -- JSON
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- Merchant config
CREATE TABLE merchant_config (
  merchant_id TEXT PRIMARY KEY,
  auto_issue_on_paid INTEGER DEFAULT 0,
  default_tax_rate REAL DEFAULT 0.1,
  seller_name TEXT,
  seller_mst TEXT,
  seller_address TEXT,
  tvan_provider TEXT DEFAULT 'mock',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Idempotency keys
CREATE TABLE idempotency_keys (
  key TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  response TEXT, -- JSON
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT
);

-- Customers (for autofill)
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mst TEXT,
  address TEXT,
  email TEXT,
  phone TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_merchant ON invoices(seller_mst, status);
CREATE INDEX idx_invoices_date ON invoices(issue_date);
CREATE INDEX idx_invoices_buyer ON invoices(buyer_mst);
CREATE INDEX idx_audit_invoice ON audit_logs(invoice_id);
```

---

## 7. MockAdapter Behavior

```typescript
class MockAdapter implements TVANAdapter {
  readonly provider = 'mock';

  async issue(invoice: CanonicalInvoice): Promise<TVANResult> {
    await delay(500); // simulate latency
    return {
      success: true,
      tvanId: `MOCK-${Date.now()}`,
      cqtConfirmation: {
        id: `CQT-${randomUUID().slice(0,8)}`,
        at: new Date().toISOString()
      }
    };
  }

  async replace(originalId: string, replacement: CanonicalInvoice): Promise<TVANResult> {
    await delay(800);
    return { success: true, tvanId: `MOCK-RPL-${Date.now()}` };
  }

  async adjust(originalId: string, adjustment: AdjustmentSpec): Promise<TVANResult> {
    await delay(600);
    return { success: true, tvanId: `MOCK-ADJ-${Date.now()}` };
  }

  // Configurable error rate for testing
  private errorRate = 0.05; // 5% random fail
}
```

---

## 8. Portal UI — 7 Screens MVP

| Screen | Route | Priority | Complexity |
|--------|-------|----------|------------|
| Login (mock) | `/login` | P0 | Low |
| Dashboard | `/` | P0 | Medium |
| Invoice List | `/invoices` | P0 | Medium |
| Invoice Detail | `/invoices/:id` | P0 | Medium |
| Issue Invoice (1-click) | `/invoices/new` | P0 | High |
| Wizard Sai sót | `/invoices/:id/correct` | P1 | High |
| Settings | `/settings` | P1 | Low |

Design system: Haravan tokens từ `vibe_design_prompts/01_design_system_polaris_haravan.md`.

---

## 9. Verification Criteria — MVP Done When

- [ ] Deploy Workers + Pages trên Cloudflare free → live URL
- [ ] Login → Dashboard → thấy 4 KPI cards
- [ ] Tạo hóa đơn mới → MockAdapter trả success → hiện trong list
- [ ] Xem chi tiết hóa đơn → thấy buyer, items, totals
- [ ] Download PDF → file mở được, format đúng
- [ ] Thay thế hóa đơn qua wizard → original status = 'replaced'
- [ ] Điều chỉnh hóa đơn → adjustment record created
- [ ] Validation: MST sai format → clear error
- [ ] Report: tháng hiện tại → thấy dữ liệu
- [ ] Audit: xem timeline mọi action trên 1 hóa đơn
- [ ] Mobile responsive: tablet 768px + mobile 375px
- [ ] Performance: page load <2s, API response <500ms

---

## 10. Assumptions

| # | Assumption | Status |
|---|-----------|--------|
| A1 | Cloudflare free tier đủ cho MVP + beta 50 merchants | ✅ Verified (limits above) |
| A2 | Hono framework chạy ổn trên Workers cho 12 endpoints | ✅ Verified (production-ready) |
| A3 | D1 SQLite đủ cho invoice data (no complex joins) | ✅ Verified |
| A4 | React-PDF hoặc @react-pdf/renderer chạy trong Workers | ❓ Needs test — fallback: render client-side |
| A5 | Mock auth đủ cho demo/beta, swap SSO later | ✅ Verified |
| A6 | Drizzle ORM support D1 | ✅ Verified (first-class support) |
