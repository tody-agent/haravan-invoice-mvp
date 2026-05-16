# Changelog

## [0.1.0] — 2026-05-16

### Added
- **Invoice CRUD** — Create, list, detail, replace, adjust invoices with D1 persistence
- **Reports** — Sales, ledger, quarterly, replaced, modified, deleted reports
- **Dashboard** — KPI cards, charts, recent invoices, top customers, top SKUs
- **Analytics** — Omnichannel distribution, drill-down by channel, top customers, top SKUs
- **Products** — Product catalog with search and pagination (D1-backed)
- **Customers** — Customer list, detail page with analytics (D1-backed)
- **Notifications** — Real-time notification center with filter, mark-as-read (D1-backed)
- **Settings** — Templates, automation rules, plan management (D1-backed)
- **Compliance Center** — TT 78/TT 32 compliance tracking
- **Daily Aggregate** — Gộp đơn lẻ cuối ngày (TT 78) with D1 persistence
- **One-Click Issue** — From POS, from Order via InvoiceService
- **MST Lookup** — Auto-fill customer tax code with KV caching
- **PDF Generation** — Invoice HTML template renderer
- **Audit Logs** — Full audit trail for all invoice operations
- **18 Frontend Tests** — Vitest + Testing Library for all pages
- **Integration Test Script** — `scripts/integration-test.sh`
- **E2E Smoke Test Script** — `scripts/e2e-smoke.sh`

### Changed
- Replaced mock notifications array with D1 `notifications` table
- All routes now use D1 queries (no hardcoded mock data)
- Notifications persisted in D1 with merchant_id filtering
- Analytics computed from real invoice data via D1 aggregates
- Customer analytics computed from real D1 data
- Settings persisted in D1 `merchant_config` table
- Products extracted from invoice items via D1 queries

### Removed
- `mockNotifications` array from `routes/notifications.ts`
- All hardcoded mock data from route handlers

### Technical
- D1 schema: `invoices`, `audit_logs`, `merchant_config`, `customers`, `products`, `notifications`
- 17 API routes, 28 frontend pages
- 15+ API test files, 18 frontend test files
- MockAdapter retained for Hilo integration (swap when API available)
- Coverage threshold: 80% statements/branches/functions/lines
