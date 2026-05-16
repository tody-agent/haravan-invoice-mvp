# Implementation Checklist — MVP Mock Hilo + Real Cloudflare

**Goal:** Working MVP, Hilo mocked, mọi thứ khác thật trên Cloudflare free tier
**Timeline:** 3-4 tuần (1 dev full-time hoặc 2 dev part-time)
**Stack:** Hono + D1 + R2 + KV + React + Cloudflare Pages

---

## Sprint 1 — Backend Foundation (Tuần 1, ~5 ngày)

### 1.1 Project Setup
- [ ] 1.1.1 Init monorepo: `pnpm init`, workspace config (`apps/api`, `apps/portal`, `packages/shared`)
- [ ] 1.1.2 `apps/api`: Hono + Wrangler setup, `wrangler.toml` config D1 + R2 + KV bindings
- [ ] 1.1.3 `packages/shared`: TypeScript interfaces (CanonicalInvoice, TVANAdapter, TVANResult)
- [ ] 1.1.4 D1 migration: tạo 5 tables (invoices, audit_logs, merchant_config, idempotency_keys, customers)
- [ ] 1.1.5 Seed data: 10 fake invoices, 5 customers, 1 merchant config
- [ ] 1.1.6 `wrangler dev` → `GET /api/v1/health` → 200 ✅
- [ ] **Gate:** Health check chạy local + D1 connected

### 1.2 MockAdapter + Core Types
- [ ] 1.2.1 `TVANAdapter` interface (issue, replace, adjust, query — 4 methods MVP)
- [ ] 1.2.2 `MockAdapter` implement: fake success response, 500ms delay, 5% error rate
- [ ] 1.2.3 `AdapterFactory`: return MockAdapter (hardcode MVP)
- [ ] 1.2.4 Unit test: MockAdapter 4 methods
- [ ] **Gate:** MockAdapter trả response đúng shape

### 1.3 Invoice Service + API Routes
- [ ] 1.3.1 `POST /api/v1/invoices` — validate → save D1 → call MockAdapter → update status → audit log
- [ ] 1.3.2 `GET /api/v1/invoices` — list from D1, filter: status, date range, buyer MST, pagination
- [ ] 1.3.3 `GET /api/v1/invoices/:id` — detail from D1
- [ ] 1.3.4 `POST /api/v1/invoices/:id/replace` — validate → create replacement → MockAdapter → audit
- [ ] 1.3.5 `POST /api/v1/invoices/:id/adjust` — validate → create adjustment → MockAdapter → audit
- [ ] 1.3.6 Auth middleware: mock JWT (decode header, extract user, no real verify)
- [ ] 1.3.7 `POST /api/v1/auth/login` — return mock JWT token cho test user
- [ ] 1.3.8 Error handling: 400 validation, 404 not found, 409 conflict, 500 internal
- [ ] **Gate:** cURL tạo invoice → list → detail → replace → adjust = success

### 1.4 Validation Engine
- [ ] 1.4.1 `validateMST(mst)` — 10/13 digits, checksum
- [ ] 1.4.2 `validateInvoice(data)` — required fields, items not empty, total > 0
- [ ] 1.4.3 `validateTaxRate(rate)` — 0%, 5%, 8%, 10%
- [ ] 1.4.4 `amountToWords(amount)` — VND bằng chữ (thư viện hoặc tự write)
- [ ] 1.4.5 Business rules: không cho "hủy", chỉ thay thế/điều chỉnh
- [ ] 1.4.6 Unit test: 15+ cases
- [ ] **Gate:** Invalid data → clear Vietnamese error message

---

## Sprint 2 — PDF + Reporting + Config (Tuần 2, ~5 ngày)

### 2.1 PDF Renderer
- [ ] 2.1.1 Invoice PDF template (HTML → PDF via `@cloudflare/puppeteer` hoặc html-to-pdf worker)
- [ ] 2.1.2 Template: header (seller info), buyer info, items table, totals, footer (compliance ref)
- [ ] 2.1.3 QR code: embed CQT verification URL (mock URL cho MVP)
- [ ] 2.1.4 `GET /api/v1/invoices/:id/pdf` — render + cache R2 + return
- [ ] 2.1.5 Số tiền bằng chữ hiển thị trong PDF
- [ ] **Gate:** Download PDF, mở được, format chuyên nghiệp

### 2.2 Reporting
- [ ] 2.2.1 `GET /api/v1/reports/summary` — total issued, pending, error, revenue (aggregate D1)
- [ ] 2.2.2 `GET /api/v1/reports/monthly?month=2026-05` — bảng kê tháng
- [ ] 2.2.3 Report response: JSON data (Portal UI render chart/table)
- [ ] **Gate:** Reports trả data chính xác từ seed data

### 2.3 Config + Audit
- [ ] 2.3.1 `GET /api/v1/config` — merchant settings from D1
- [ ] 2.3.2 `PATCH /api/v1/config` — update settings
- [ ] 2.3.3 `GET /api/v1/invoices/:id/audit` — audit trail cho invoice
- [ ] 2.3.4 Audit auto-log: mọi POST/PATCH endpoint → audit_logs insert
- [ ] **Gate:** Config update + audit trail visible

### 2.4 Deploy Backend
- [ ] 2.4.1 `wrangler deploy` → live Workers URL
- [ ] 2.4.2 D1 production database + migration
- [ ] 2.4.3 R2 bucket + KV namespace tạo
- [ ] 2.4.4 Test live endpoints via cURL
- [ ] **Gate:** API chạy trên *.workers.dev URL

---

## Sprint 3 — Portal UI Core (Tuần 3, ~5 ngày)

### 3.1 UI Setup
- [ ] 3.1.1 `apps/portal`: Vite + React 18 + TypeScript
- [ ] 3.1.2 Design tokens CSS variables (từ `vibe_design_prompts/01`)
- [ ] 3.1.3 App shell: sidebar nav + topbar + responsive layout
- [ ] 3.1.4 Router: React Router v6 (7 routes)
- [ ] 3.1.5 API client: fetch wrapper trỏ Workers URL
- [ ] 3.1.6 Auth context: store mock JWT, redirect login
- [ ] **Gate:** Shell renders, nav works, responsive 375px-1440px

### 3.2 Dashboard
- [ ] 3.2.1 4 KPI cards: Tổng phát hành, Chờ xử lý, Tỷ lệ lỗi, Doanh thu tháng
- [ ] 3.2.2 Recent invoices table (last 10)
- [ ] 3.2.3 Quick action buttons: Phát hành mới, Tìm kiếm
- [ ] **Gate:** Dashboard load <2s, KPI data từ API

### 3.3 Invoice List
- [ ] 3.3.1 Table: columns (số HĐ, khách hàng, MST, ngày, tổng tiền, trạng thái)
- [ ] 3.3.2 Status badges (color-coded: draft=gray, issued=blue, accepted=green, rejected=red)
- [ ] 3.3.3 Filters: date range, status dropdown, search buyer
- [ ] 3.3.4 Pagination
- [ ] 3.3.5 Row click → navigate to detail
- [ ] **Gate:** Filter + pagination work, status badges visible

### 3.4 Invoice Detail + Issue
- [ ] 3.4.1 Detail page: seller, buyer, items table, totals, audit trail
- [ ] 3.4.2 Actions: "Thay thế", "Điều chỉnh" buttons (dẫn tới wizard)
- [ ] 3.4.3 PDF download button → call API → download file
- [ ] 3.4.4 Issue form: buyer info + items + tax → validate → submit → toast success
- [ ] 3.4.5 Customer autofill: type name → suggest from customers table
- [ ] **Gate:** Tạo mới → hiện trong list → xem detail → download PDF

---

## Sprint 4 — Wizard + Polish + Deploy (Tuần 4, ~5 ngày)

### 4.1 Wizard Xử lý Sai sót
- [ ] 4.1.1 Stepper UI: 3 steps (Chọn loại → Nhập thông tin → Xác nhận)
- [ ] 4.1.2 Thay thế flow: show original → edit new → confirm → submit
- [ ] 4.1.3 Điều chỉnh flow: select type (tăng/giảm) → edit items → confirm → submit
- [ ] 4.1.4 Compliance notice: reference NĐ 70/2025, TT 32/2025
- [ ] **Gate:** Replace + Adjust via wizard → original status updated

### 4.2 Settings + Login
- [ ] 4.2.1 Settings page: seller info, tax rate default, auto-issue toggle
- [ ] 4.2.2 Login page: simple form → mock JWT → redirect dashboard
- [ ] **Gate:** Config changes persist, login flow smooth

### 4.3 Polish
- [ ] 4.3.1 Loading states: skeleton loaders cho tables và cards
- [ ] 4.3.2 Empty states: illustration + CTA cho empty list
- [ ] 4.3.3 Error states: toast notifications, inline errors
- [ ] 4.3.4 Vietnamese locale: all text tiếng Việt, số tiền format "1.250.000"
- [ ] 4.3.5 Mobile responsive: test 375px, 768px, 1280px
- [ ] 4.3.6 Dark mode toggle (optional, tokens ready)
- [ ] **Gate:** All states handled, responsive, Vietnamese throughout

### 4.4 Deploy Full Stack
- [ ] 4.4.1 Cloudflare Pages deploy: `apps/portal` build → Pages
- [ ] 4.4.2 Custom domain setup (optional) hoặc dùng *.pages.dev
- [ ] 4.4.3 Workers API route binding từ Pages
- [ ] 4.4.4 Seed production D1 với demo data
- [ ] 4.4.5 Smoke test: full flow trên live URL
- [ ] 4.4.6 README.md: setup guide, architecture diagram, swap-to-real guide
- [ ] **Gate:** Live URL → login → tạo HĐ → PDF → replace → dashboard updated ✅

---

## Summary

| Sprint | Tuần | Deliverable | Tasks | Gate |
|--------|------|-------------|-------|------|
| 1 | 1 | Backend API (12 endpoints + MockAdapter) | 22 | cURL full CRUD |
| 2 | 2 | PDF + Reports + Deploy API | 14 | Live Workers URL |
| 3 | 3 | Portal UI (Dashboard + List + Detail + Issue) | 17 | UI connected to API |
| 4 | 4 | Wizard + Polish + Full Deploy | 15 | Live Pages URL, full flow |
| **Total** | **4 tuần** | **Working MVP** | **68 tasks** | **Live on Cloudflare** |

### Sau MVP → Next steps:
1. Swap `MockAdapter` → `HiloAdapter` khi có credentials
2. Swap mock auth → Haravan SSO
3. Add real order integration (Haravan Order API)
4. Phase 2 features: Zalo OA, gộp đơn, AI tiền-kiểm
