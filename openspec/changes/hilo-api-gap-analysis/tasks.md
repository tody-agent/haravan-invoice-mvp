# Implementation Checklist — Thick Gateway (Option B)

**Strategy:** Self-sufficient Gateway. Hilo = 4 API only. Request 5 must-haves.
**Timeline:** 4-5 tháng · **Team:** 3-4 devs

---

## Sprint 0 — Hilo Must-Have Request + Foundation (Tuần 1-2)

### 0.1 Request Hilo (PM track — song song với dev)
- [ ] 0.1.1 Gửi email Hilo yêu cầu 5 must-haves (XML schema, error codes, sandbox, webhook, PDF)
- [ ] 0.1.2 Schedule meeting kỹ thuật Hilo (deadline: tuần 2)
- [ ] 0.1.3 Xác nhận HSM signing flow (Hilo ký thay hay merchant ký?)
- [ ] 0.1.4 Nhận sandbox credentials hoặc xác nhận `apitctn` là sandbox

### 0.2 Gateway Scaffold (Dev track)
- [ ] 0.2.1 Setup repo: monorepo (pnpm workspace), `apps/gateway` + `packages/shared-types`
- [ ] 0.2.2 Fastify server skeleton + OpenAPI spec (10 endpoints)
- [ ] 0.2.3 Middleware: request-id, auth (JWT mock), rate-limit, metrics
- [ ] 0.2.4 D1 schema migration: `invoices`, `audit_logs`, `idempotency_keys`, `merchant_config`
- [ ] 0.2.5 KV setup: idempotency dedupe + session cache
- [ ] 0.2.6 Health check `/v1/health` (DB + KV ping)
- [ ] 0.2.7 MockAdapter implement (`TVANAdapter` interface, canned responses)
- [ ] 0.2.8 Unit test scaffold (Vitest, ≥80% coverage target)
- [ ] **Verify:** `pnpm dev` → `GET /v1/health` → 200 ✅

---

## Sprint 1 — HiloAdapter + Validation Engine (Tuần 3-4)

### 1.1 HiloAdapter Core
- [ ] 1.1.1 `TVANAdapter` interface trong `shared-types` (9 methods, JSDoc)
- [ ] 1.1.2 `HiloAdapter.authenticate()` — call `/api/authentication/gettoken`, cache token KV
- [ ] 1.1.3 `HiloAdapter.issue()` — call `/api/einvoicesolution/send` hoặc `/sendpos`
- [ ] 1.1.4 `HiloAdapter.query()` — call `/api/einvoicesolution/get`, parse response
- [ ] 1.1.5 `HiloAdapter.querySuccess()` — call `/getsuccess`, parse response
- [ ] 1.1.6 Token rotation: auto-refresh trước expire, retry on 401
- [ ] 1.1.7 Circuit breaker: 50% error rate 1m → open, 30s half-open
- [ ] 1.1.8 Retry: exponential backoff (1s,2s,4s,8s), max 4, only 5xx+network
- [ ] **Verify:** Auth → send → get với sandbox (hoặc mock nếu chưa có sandbox) ✅

### 1.2 XML Builder
- [ ] 1.2.1 Reverse-engineer XML format từ QĐ 1510 XSD + Hilo sandbox response
- [ ] 1.2.2 `canonicalToHiloXml(invoice)` — build XML cho phát hành mới
- [ ] 1.2.3 `canonicalToReplaceXml(original, replacement)` — XML thay thế
- [ ] 1.2.4 `canonicalToAdjustXml(original, adjustment)` — XML điều chỉnh
- [ ] 1.2.5 `hiloResponseToCanonical(xmlResponse)` — parse Hilo response
- [ ] 1.2.6 Unit test: 10+ cases, validate XML output against XSD
- [ ] **Verify:** Generated XML validate against QĐ 1510 schema ✅

### 1.3 Validation Engine
- [ ] 1.3.1 `validateMST(mst)` — 10/13 chữ số, checksum
- [ ] 1.3.2 `validateInvoice(canonical)` — completeness + business rules
- [ ] 1.3.3 `validateTaxRate(rate)` — 0%, 5%, 8%, 10%, KCT, KKKNT
- [ ] 1.3.4 `amountToWords(amount)` — VND bằng chữ
- [ ] 1.3.5 NĐ 70/2025 rules: block "hủy", enforce thay thế/điều chỉnh
- [ ] 1.3.6 Pre-issue validation gate middleware
- [ ] 1.3.7 Unit test: 20+ cases, edge cases (0 amount, empty items, invalid MST)
- [ ] **Verify:** Invalid invoice → clear error message, valid → pass through ✅

---

## Sprint 2 — Invoice Service + Event Bridge (Tuần 5-6)

### 2.1 Invoice Service
- [ ] 2.1.1 `InvoiceService.issue(payload, idempotencyKey, merchantId)`
- [ ] 2.1.2 `InvoiceService.query(id)` — from local DB first, fallback Hilo
- [ ] 2.1.3 `InvoiceService.list(filter)` — D1 query with pagination
- [ ] 2.1.4 `InvoiceService.replace(id, replacement)` — validate → XML → send → update
- [ ] 2.1.5 `InvoiceService.adjust(id, adjustment)` — validate → XML → send → update
- [ ] 2.1.6 Status state machine with transition validation
- [ ] 2.1.7 Idempotency middleware integration (KV dedupe)
- [ ] 2.1.8 Audit log on every mutation
- [ ] **Verify:** Full CRUD + replace + adjust với MockAdapter E2E ✅

### 2.2 Polling→Event Bridge
- [ ] 2.2.1 Background worker: poll `HiloAdapter.query()` cho pending invoices
- [ ] 2.2.2 Diff detection: compare local status vs Hilo status
- [ ] 2.2.3 Emit events: `invoice.issued`, `invoice.rejected`, `invoice.status_changed`
- [ ] 2.2.4 Polling schedule: 30s when pending, 5m when idle
- [ ] 2.2.5 Dead letter handling: 10 consecutive failures → alert
- [ ] **Verify:** Send invoice → poll detects status change → event emitted ✅

---

## Sprint 3 — Portal UI + One-Click Issue (Tuần 7-9)

### 3.1 Portal UI Scaffold
- [ ] 3.1.1 React app setup (Vite + TypeScript + Hara DS tokens)
- [ ] 3.1.2 App shell: sidebar + topbar + responsive canvas
- [ ] 3.1.3 Auth flow: Haravan SSO redirect → callback → session
- [ ] 3.1.4 Invoice list page: table + filters + pagination + status badges
- [ ] 3.1.5 Invoice detail page: view + actions (thay thế, điều chỉnh)
- [ ] 3.1.6 State patterns: loading, empty, error, success
- [ ] **Verify:** Login → list → detail → actions visible ✅

### 3.2 One-Click Issue (Top RICE 68.400)
- [ ] 3.2.1 Auto-issue worker: subscribe order.paid → issue if config enabled
- [ ] 3.2.2 POS endpoint: `POST /v1/invoices/from-pos` (sync, <5s timeout)
- [ ] 3.2.3 Admin button: "Xuất hóa đơn" → modal confirm → issue
- [ ] 3.2.4 Order→Invoice mapper: buyer, items, totals, tax from Order API
- [ ] 3.2.5 Optimistic UI: "Đang phát hành" immediately, update on event
- [ ] 3.2.6 Error handling: retry button, clear error message
- [ ] 3.2.7 Merchant config: `auto_issue_on_paid` toggle
- [ ] **Verify:** 3 triggers work, latency <3s p95, no double-issue ✅

---

## Sprint 4 — Wizard + PDF + Compliance (Tuần 10-12)

### 4.1 Wizard Xử lý Sai sót
- [ ] 4.1.1 5-step wizard UI: Chọn HĐ → Lập biên bản → Nhập thông tin → Xác nhận → Hoàn tất
- [ ] 4.1.2 Replace flow: biên bản thu hồi → hóa đơn thay thế
- [ ] 4.1.3 Adjust flow: chọn loại (tăng/giảm/thông tin) → nhập → submit
- [ ] 4.1.4 NĐ 70/2025 compliance: reference văn bản đúng
- [ ] **Verify:** Replace + Adjust E2E qua wizard ✅

### 4.2 PDF Renderer
- [ ] 4.2.1 Invoice PDF template (React-PDF hoặc Handlebars)
- [ ] 4.2.2 QĐ 1510 format compliance
- [ ] 4.2.3 QR code generation (CQT verification URL)
- [ ] 4.2.4 Cache rendered PDF → R2 storage
- [ ] 4.2.5 Download endpoint: `GET /v1/invoices/{id}/pdf`
- [ ] **Verify:** PDF output matches template, QR scannable ✅

### 4.3 Compliance Center MVP
- [ ] 4.3.1 Audit trail timeline UI
- [ ] 4.3.2 Regulation reference cards (NĐ 70, TT 32, QĐ 1510)
- [ ] 4.3.3 Compliance status dashboard (missing items, deadlines)
- [ ] **Verify:** View audit trail for any invoice ✅

---

## Sprint 5 — Reporting + Dashboard + Polish (Tuần 13-16)

### 5.1 Reporting Engine
- [ ] 5.1.1 Monthly invoice summary report
- [ ] 5.1.2 Sales detail report
- [ ] 5.1.3 Adjustment report (sửa đổi)
- [ ] 5.1.4 Replacement report (thay thế)
- [ ] 5.1.5 Export CSV/Excel
- [ ] **Verify:** 4 reports generate correctly from test data ✅

### 5.2 Dashboard
- [ ] 5.2.1 4 KPI cards: total issued, pending, error rate, this month revenue
- [ ] 5.2.2 Chart: daily issue volume (7/30 days)
- [ ] 5.2.3 Recent activity feed
- [ ] 5.2.4 Quick actions: issue, search, report
- [ ] **Verify:** Dashboard loads <2s, data accurate ✅

### 5.3 Polish + Migration
- [ ] 5.3.1 E2E test suite (Playwright, 10+ scenarios)
- [ ] 5.3.2 Performance: load test 100 req/s, p95 <3s
- [ ] 5.3.3 Security review: no PII in logs, input sanitization
- [ ] 5.3.4 Beta merchant onboarding (5-10 merchants)
- [ ] 5.3.5 Documentation: API docs, merchant guide, ops runbook
- [ ] **Verify:** Beta merchants complete full invoice lifecycle ✅

---

## Summary: 5 Sprints, 16 Tuần, ~55 Tasks

| Sprint | Tuần | Focus | Gate |
|--------|------|-------|------|
| 0 | 1-2 | Scaffold + Hilo request | Health check 200 |
| 1 | 3-4 | Adapter + XML + Validation | Sandbox send success |
| 2 | 5-6 | Invoice Service + Events | Full CRUD E2E |
| 3 | 7-9 | Portal UI + One-Click | 3 triggers <3s |
| 4 | 10-12 | Wizard + PDF + Compliance | Replace/Adjust E2E |
| 5 | 13-16 | Reports + Dashboard + Beta | Beta merchants live |
