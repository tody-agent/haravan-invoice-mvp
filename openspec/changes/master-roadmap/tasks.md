# Implementation Checklist — Master Roadmap

**Goal:** Hoàn thiện 16 features + 12 screens còn thiếu từ vibe_coding_prompts + vibe_design_prompts
**Timeline:** 25 ngày (5 phases × 5 ngày)
**Strategy:** Parallel sub-agents, 2-4 agents per phase
**Stack:** Hono + D1 + KV + R2 + React + Cloudflare Pages

---

## Phase 1: Core Features (Ngày 1-5)

### 1.1 One-Click Issue (RICE #1)
- [ ] 1.1.1 `POST /api/v1/invoices/from-pos` — sync endpoint cho POS (<5s timeout)
- [ ] 1.1.2 `POST /api/v1/invoices/from-order` — auto-issue từ order data
- [ ] 1.1.3 Order→Invoice mapper: buyer, items, totals, tax from Order API
- [ ] 1.1.4 Optimistic UI: "Đang phát hành" immediately, update on success
- [ ] 1.1.5 Error handling: retry button + clear error message
- [ ] 1.1.6 Merchant config: `auto_issue_on_paid` toggle
- [ ] 1.1.7 Tests: 3 triggers work, latency <3s p95
- [ ] **Gate:** cURL 3 endpoints → success, no double-issue

### 1.2 Auto-fill MST
- [ ] 1.2.1 Customer profile lookup API: `GET /api/v1/customers/lookup?mst=`
- [ ] 1.2.2 MST validation real-time (debounce 500ms) trong InvoiceCreate form
- [ ] 1.2.3 CQT lookup integration (mock cho MVP)
- [ ] 1.2.4 Cache lookup 24h trong KV
- [ ] 1.2.5 "Lưu MST vào profile" prompt sau khi save invoice
- [ ] 1.2.6 Block submit nếu MST invalid
- [ ] **Gate:** MST auto-fill + validate + cache hoạt động

### 1.3 Compliance Center
- [ ] 1.3.1 Compliance dashboard: % CQT accepted/rejected/error
- [ ] 1.3.2 Regulation reference cards (NĐ 70, TT 32, QĐ 1510)
- [ ] 1.3.3 Compliance status: 7 rule checklist (pass/warning/fail)
- [ ] 1.3.4 Export compliance report (PDF/Excel)
- [ ] **Gate:** Compliance page render đúng rules + export

---

## Phase 2: Differentiation (Ngày 6-10)

### 2.1 Gộp đơn lẻ cuối ngày (TT 78)
- [ ] 2.1.1 `POST /api/v1/invoices/aggregate` — gộp đơn lẻ
- [ ] 2.1.2 Rule engine: ngưỡng tiền, branch, exclude category
- [ ] 2.1.3 Cron trigger: daily 23:30 (Cloudflare Cron Triggers)
- [ ] 2.1.4 Manual "Gộp ngay" button trong Reports
- [ ] 2.1.5 Hóa đơn tổng format TT 78 (line items = daily totals)
- [ ] 2.1.6 Drill-down: từ aggregate → list original invoices
- [ ] **Gate:** Aggregate tạo hóa đơn tổng đúng format

### 2.2 Dashboard Omnichannel
- [ ] 2.2.1 `GET /api/v1/analytics/channels` — revenue by channel
- [ ] 2.2.2 `GET /api/v1/analytics/branches` — revenue by branch
- [ ] 2.2.3 Chart components: line chart + pie chart (SVG-based)
- [ ] 2.2.4 Drill-down: click chart → filtered invoice list
- [ ] 2.2.5 Top 20 customers + Top 10 SKUs tables
- [ ] 2.2.6 Export dashboard as PDF/PNG
- [ ] **Gate:** Charts render, drill-down works, export works

### 2.3 Zalo OA Delivery
- [ ] 2.3.1 `POST /api/v1/delivery/zalo` — send Zalo OA message
- [ ] 2.3.2 Template message + CTA mini-app link
- [ ] 2.3.3 Delivery status tracking (sent/delivered/read/clicked)
- [ ] 2.3.4 Fallback email if Zalo fail
- [ ] 2.3.5 Per-customer preference (Zalo/Email/SMS)
- [ ] **Gate:** Send Zalo → track status → fallback email

### 2.4 Product Catalog
- [ ] 2.4.1 `GET /api/v1/products` — list + search + pagination
- [ ] 2.4.2 `/products` page — table with filters
- [ ] 2.4.3 `/products/:id` page — detail + recent invoices
- [ ] **Gate:** Product list + detail hoạt động

---

## Phase 3: AI Features (Ngày 11-15)

### 3.1 AI Tiền-kiểm
- [ ] 3.1.1 Rule-based check engine (<50ms)
- [ ] 3.1.2 LLM check integration (Gemini API, async)
- [ ] 3.1.3 Warning inline trong InvoiceCreate form
- [ ] 3.1.4 Block submit khi severity = error
- [ ] 3.1.5 Audit log: ai check, result, action taken
- [ ] **Gate:** Pre-issue check blocks invalid, warns suspicious

### 3.2 AI Cảnh báo NCC
- [ ] 3.2.1 Risk score calculation (0-1)
- [ ] 3.2.2 Alert badge trong customer list + invoice form
- [ ] 3.2.3 Explainability: top 3 reasons
- [ ] 3.2.4 Configurable threshold per merchant
- [ ] **Gate:** Risk score hiển thị, alert đúng

### 3.3 Inbound Invoice AI
- [ ] 3.3.1 `GET /api/v1/inbound` — list inbound invoices
- [ ] 3.3.2 OCR upload integration (mock cho MVP)
- [ ] 3.3.3 AI classify category (mock cho MVP)
- [ ] 3.3.4 AI match PO (mock cho MVP)
- [ ] 3.3.5 `/inbound` page — workbench UI
- [ ] **Gate:** Inbound list + classify + match hoạt động

---

## Phase 4: Platform (Ngày 16-20)

### 4.1 AI Copilot Chat
- [ ] 4.1.1 Chat widget component (floating button → expandable sidebar)
- [ ] 4.1.2 Context-aware: know current page + data
- [ ] 4.1.3 Query API: `POST /api/v1/ai/chat`
- [ ] 4.1.4 Tool calling: invoice CRUD, customer lookup
- [ ] 4.1.5 Multi-turn conversation với memory
- [ ] **Gate:** Chat widget hoạt động, can query data

### 4.2 Automation Builder
- [ ] 4.2.1 Canvas component (React Flow)
- [ ] 4.2.2 8+ trigger types (invoice.created, status.changed, etc.)
- [ ] 4.2.3 12+ action types (send email, update status, notify, etc.)
- [ ] 4.2.4 Template library (20+ templates)
- [ ] 4.2.5 Test run với sample data
- [ ] 4.2.6 Run history + replay
- [ ] **Gate:** Drag-drop builder + template + test run

---

## Phase 5: Polish & Deploy (Ngày 21-25)

### 5.1 Design System Alignment
- [ ] 5.1.1 Audit all pages against prototype
- [ ] 5.1.2 Pixel-perfect matching for key pages
- [ ] 5.1.3 Dark mode support
- [ ] 5.1.4 Mobile responsive (375px - 1440px)
- [ ] 5.1.5 Loading/empty/error states for all pages

### 5.2 Testing & QA
- [ ] 5.2.1 E2E tests (Playwright) for 10 critical flows
- [ ] 5.2.2 Performance: page load <2s, API <500ms
- [ ] 5.2.3 Security audit: no PII in logs, input sanitization
- [ ] 5.2.4 Accessibility: WCAG AA compliance
- [ ] 5.2.5 Vietnamese locale verification

### 5.3 Production Deploy
- [ ] 5.3.1 Cloudflare Pages deploy
- [ ] 5.3.2 Custom domain setup
- [ ] 5.3.3 Monitoring + alerting
- [ ] 5.3.4 Documentation (API docs, merchant guide)
- [ ] 5.3.5 Beta merchant onboarding (5-10 merchants)

---

## Summary

| Phase | Ngày | Features | Tasks | Parallel Agents |
|-------|------|----------|-------|-----------------|
| 1 | 1-5 | One-Click + MST + Compliance | 20 | 3 |
| 2 | 6-10 | Gộp đơn + Dashboard + Zalo + Products | 18 | 4 |
| 3 | 11-15 | AI Pre-check + Risk + Inbound | 15 | 3 |
| 4 | 16-20 | Copilot + Automation | 11 | 2 |
| 5 | 21-25 | Polish + Test + Deploy | 15 | 3 |
| **Total** | **25 ngày** | **16 features** | **79 tasks** | **15 agents** |

---

## Parallel Execution Strategy

```
Phase 1 (Ngày 1-5):
  [1.1 One-Click] [1.2 MST] [1.3 Compliance]  ← 3 agents parallel

Phase 2 (Ngày 6-10):
  [2.1 Gộp đơn] [2.2 Dashboard] [2.3 Zalo] [2.4 Products]  ← 4 agents parallel

Phase 3 (Ngày 11-15):
  [3.1 AI Pre-check] [3.2 AI Risk] [3.3 Inbound]  ← 3 agents parallel

Phase 4 (Ngày 16-20):
  [4.1 Copilot] [4.2 Automation]  ← 2 agents parallel

Phase 5 (Ngày 21-25):
  [5.1 Design] [5.2 Testing] [5.3 Deploy]  ← 3 agents sequential
```

## Testing Strategy

- **Unit tests:** Vitest cho business logic (validation, services)
- **Integration tests:** API endpoints với D1 bindings
- **E2E tests:** Playwright cho critical flows
- **Performance tests:** Load test 100 req/s
- **Accessibility tests:** axe-core cho WCAG AA

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI API costs | Mock cho MVP, real API cho production |
| Zalo OA integration | Mock cho MVP, real integration Phase 2 |
| CQT API unavailable | Mock responses, retry with backoff |
| D1 performance limits | Optimize queries, add indexes |
| Cloudflare free tier limits | Monitor usage, upgrade when needed |
