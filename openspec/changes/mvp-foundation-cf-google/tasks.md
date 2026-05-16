# Implementation Checklist — MVP Foundation (Cloudflare + Google)

**Change ID:** `mvp-foundation-cf-google`
**Timeline target:** 10-12 tuần (realistic 14 tuần với 20% buffer)
**Team:** 8 người (1 PM, 1 TL, 3 BE, 2 FE, 1 Designer, 1 QA)

---

## Sprint 0 — Pre-kickoff dependencies (Tuần -2 → 0)

- [ ] 0.1 Provision Haravan OAuth2 partner app (client_id, client_secret, redirect_uri whitelist) — PM + Haravan Identity
- [ ] 0.2 Provision Hilo API staging credential + idempotency contract verify — PM + Hilo partnership
- [ ] 0.3 Cloudflare Account upgrade Workers Paid + D1 production tier + R2 + Queues + Access — Tech Lead
- [ ] 0.4 Google Workspace Business Plus provision cho `@haravan.com` staff — IT
- [ ] 0.5 DNS `mvp.haravan-invoice.dev` + SSL cert (Cloudflare auto) — Tech Lead
- [ ] 0.6 GitHub repo + branch protection + Dependabot + secret scanning bật — Tech Lead
- [ ] 0.7 Threat model document v1 (STRIDE) — Tech Lead + CTO
- [ ] 0.8 Compliance landmark mapping table (rule → NĐ/TT reference) ký bởi legal counsel — PM + Legal

---

## Batch 1 — Infrastructure foundation (Tuần 1-2)

### Cloudflare resources

- [ ] 1.1 `infra/cloudflare/main.tf`: provision Pages project + Workers script + D1 database (3 env: dev/staging/prod) + R2 bucket + KV namespace + Queues
- [ ] 1.2 `infra/cloudflare/access.tf`: Cloudflare Access app cho `/admin/*` với Google Workspace IdP, scope `haravan.com` only
- [ ] 1.3 `infra/cloudflare/waf.tf`: Custom WAF rule (rate limit per IP, suspicious payload, MST lookup throttle)
- [ ] 1.4 Cloudflare Turnstile site key + secret cho public endpoint
- [ ] 1.5 Terraform state remote backend (R2 + lock qua KV) hoặc Terraform Cloud free tier

### Google resources

- [ ] 1.6 `infra/google/main.tf`: Workspace IdP config (SAML metadata cho CF Access), Secret Manager, Cloud Logging sink, Cloud Monitoring workspace
- [ ] 1.7 Service account cho Worker → GCP API (Cloud Logging write, Secret Manager read), key rotation policy 90d
- [ ] 1.8 Gemini API project + quota request cho Asia-Southeast region

### Monorepo scaffold

- [ ] 1.9 Init monorepo (pnpm workspaces) với layout `apps/`, `services/`, `packages/`, `infra/`
- [ ] 1.10 Root `package.json` + shared tsconfig + ESLint + Prettier + Vitest config
- [ ] 1.11 GitHub Actions workflow: `lint`, `test`, `build`, `deploy-pages-dev`, `deploy-worker-dev`
- [ ] 1.12 Wrangler config `wrangler.toml` 3 environment với binding cho D1/R2/KV/Queues

### Acceptance criteria Batch 1

- [ ] 1.13 `terraform apply` thành công ở 3 environment
- [ ] 1.14 `wrangler dev` boot Worker local + ping `/health` trả 200
- [ ] 1.15 PR preview Pages deploy auto khi mở PR

---

## Batch 2 — Auth + Gateway core (Tuần 2-4)

### Auth

- [ ] 2.1 `services/gateway/src/routes/auth.ts`: implement Haravan OAuth2 callback (code → token exchange → session JWT issue)
- [ ] 2.2 Session JWT signing (HS256, key trong Workers Secret, 8h TTL)
- [ ] 2.3 Cookie `__Host-mvp_session` Secure/HttpOnly/SameSite=Strict
- [ ] 2.4 `middleware/auth.ts`: JWT verify + KV blacklist check (revoke list)
- [ ] 2.5 `/auth/logout`: clear cookie + revoke JTI vào KV (TTL = JWT expire time)
- [ ] 2.6 RBAC schema D1 (roles, user_roles, permissions JSON) + middleware `requirePermission()`
- [ ] 2.7 Staff endpoint `/admin/*` protected bởi CF Access (verify CF Access JWT trong Worker)

### Gateway core middleware

- [ ] 2.8 `middleware/idempotency.ts`: KV-backed, 24h TTL, response hash check
- [ ] 2.9 `middleware/rate-limit.ts`: KV counter sliding window 60s, configurable per route
- [ ] 2.10 `middleware/audit.ts`: tự động log mọi mutation request (action/actor/entity/trace_id) vào D1 + queue sang GCP sink
- [ ] 2.11 `middleware/telemetry.ts`: OpenTelemetry span, export dual sink CF Trace + GCP Trace
- [ ] 2.12 Error handler standardized (problem+json format: type, title, status, detail, trace_id)

### D1 schema + migration

- [ ] 2.13 Migration `0001_initial.sql`: tenants, invoices, audit_log, compliance_rules, roles, user_roles
- [ ] 2.14 Migration `0002_seed_compliance_rules.sql`: 9 preflight rule + 7 compliance center rule với reference NĐ/TT
- [ ] 2.15 Repository pattern: `invoice-repo.ts`, `tenant-repo.ts`, `audit-repo.ts` với prepared statement (no string concat)

### Acceptance criteria Batch 2

- [ ] 2.16 OAuth2 flow end-to-end với Haravan staging IdP
- [ ] 2.17 Postman/curl test 5 endpoint với valid + invalid JWT
- [ ] 2.18 Idempotency replay test: gọi 2 lần cùng key → response giống nhau, không double-write D1
- [ ] 2.19 Rate limit trigger sau N request → 429
- [ ] 2.20 Audit log entry xuất hiện ở D1 + GCP Cloud Logging cho mỗi mutation

---

## Batch 3 — Hilo adapter + Invoice core (Tuần 4-6)

### Hilo adapter

- [ ] 3.1 `packages/hilo-adapter/types.ts`: `TVanAdapter` interface (verifyMst, issueInvoice, adjustInvoice, replaceInvoice, getInvoiceStatus) — KHÔNG có `cancelInvoice`
- [ ] 3.2 `packages/hilo-adapter/hilo.ts`: HiloAdapter implementation theo Hilo API doc
- [ ] 3.3 Circuit breaker (opossum-port for edge runtime hoặc custom finite-state) cho mỗi Hilo endpoint
- [ ] 3.4 Exponential backoff retry (max 3 attempts, jitter)
- [ ] 3.5 mTLS client cert (nếu Hilo support) hoặc signed JWT request
- [ ] 3.6 Error mapping: Hilo error code → app error code (preserve trace)
- [ ] 3.7 Unit test với MSW mock Hilo response (success, 429, 500, timeout, network error)

### Invoice service

- [ ] 3.8 `services/gateway/src/services/invoice-service.ts`: `issue()`, `adjust()`, `replace()`, `list()`, `getById()`
- [ ] 3.9 `POST /api/invoices/issue`: preflight check 9 rule → D1 draft → Hilo issue → D1 update → queue delivery
- [ ] 3.10 `POST /api/invoices/:id/adjust`: validate state machine (chỉ allow từ ISSUED), Hilo adjust API, write biên bản R2
- [ ] 3.11 `POST /api/invoices/:id/replace`: validate state machine, Hilo replace API
- [ ] 3.12 `GET /api/invoices`: list với filter (period, status, channel, mst search), pagination cursor-based
- [ ] 3.13 `GET /api/invoices/:id`: detail với history (adjust/replace lineage)
- [ ] 3.14 KHÔNG implement endpoint `cancel` — verified ở code review checklist
- [ ] 3.15 MST verify endpoint: `POST /api/mst/verify` với cache KV 30d, fallback Hilo MST lookup

### Acceptance criteria Batch 3

- [ ] 3.16 Issue 1 hóa đơn end-to-end ở staging với Hilo sandbox
- [ ] 3.17 Adjust + replace flow chạy đúng state machine
- [ ] 3.18 Circuit breaker trip khi Hilo down 30s liên tục → fallback queue
- [ ] 3.19 Load test: 50 RPS issue trong 2 phút, p95 < 2.5s, no 5xx

---

## Batch 4 — Frontend shell + Hara DS Proxy (Tuần 3-6, parallel với Batch 2-3)

### Hara DS Proxy v1

- [ ] 4.1 `packages/ui/tokens.ts`: port toàn bộ token từ `prototype/assets/css/tokens.css` sang TS constant
- [ ] 4.2 `packages/ui/tailwind-preset.ts`: Tailwind config sharing
- [ ] 4.3 Component primitives: `Button`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Badge`, `Tag`, `Avatar`
- [ ] 4.4 Component composite: `Card`, `Modal`, `Drawer`, `Tabs`, `Table`, `Pagination`, `Stepper`, `Toast`, `Tooltip`
- [ ] 4.5 Component layout: `AppShell`, `Sidebar`, `TopBar`, `MainStage`, `ContextRail`
- [ ] 4.6 Storybook hoặc Ladle setup cho component preview
- [ ] 4.7 Dark mode token swap qua `data-theme` attribute, system preference auto detect

### App shell

- [ ] 4.8 `apps/mvp/src/app.tsx`: TanStack Router setup, providers (Query, i18next, Theme, Auth)
- [ ] 4.9 `routes/_shell.tsx`: Haravan-like fullscreen shell (topbar 56px + sidebar 248px + main scroll)
- [ ] 4.10 Sidebar nav với Hóa đơn section expanded (Tổng quan, Danh sách, Phát hành mới, Sai sót, Compliance, T-VAN, Notification)
- [ ] 4.11 Topbar: workspace switcher pill, search global, notification bell, avatar dropdown
- [ ] 4.12 Auth guard route → redirect `/auth/login` nếu chưa session
- [ ] 4.13 i18n vi-VN base + scaffold EN file rỗng

### Responsive

- [ ] 4.14 Breakpoint setup Tailwind: mobile-first
- [ ] 4.15 Sidebar collapse drawer ở tablet (<1024px)
- [ ] 4.16 Bottom nav ở mobile (<768px) cho 4 primary route
- [ ] 4.17 POS mode (`?mode=pos`): larger touch target ≥44px, simplified issue flow

### Acceptance criteria Batch 4

- [ ] 4.18 Lighthouse score Performance + Accessibility ≥ 85 trên desktop và tablet
- [ ] 4.19 Visual QA so với screenshot Haravan Admin reference (prototype/legacy/haravan_invoice_admin_mockup.html)
- [ ] 4.20 Storybook deploy preview link share team

---

## Batch 5 — MVP feature screens (Tuần 6-9)

### F2 Dashboard tổng quan

- [ ] 5.1 4 KPI card (Doanh thu hôm nay, Số HĐ hôm nay, % CQT chấp nhận, Cảnh báo NCC)
- [ ] 5.2 Recent invoices table (10 row mới nhất)
- [ ] 5.3 Empty state khi tenant chưa có HĐ nào
- [ ] 5.4 Loading skeleton

### F3 Danh sách hóa đơn

- [ ] 5.5 Tabs: Tất cả / HĐ điện tử / HĐ máy tính tiền / Đầu vào / Đã điều chỉnh / Đã thay thế
- [ ] 5.6 Filter chip: period, status, channel, customer
- [ ] 5.7 Search MST/tên KH/số HĐ
- [ ] 5.8 Table: số HĐ, ngày, khách, MST, kênh, tổng tiền, trạng thái, AI flags (placeholder)
- [ ] 5.9 Detail drawer khi click row
- [ ] 5.10 Pagination cursor 50/page
- [ ] 5.11 Empty + loading + error states

### F4 Phát hành mới 1-click

- [ ] 5.12 Form 3 trigger context: Web/POS/Admin (skin theo `?source=`)
- [ ] 5.13 Auto-fill MST từ Customer Profile Haravan (mock cho MVP, real Phase 1.1)
- [ ] 5.14 Pre-flight check 9 rule với indicator pass/warning/fail
- [ ] 5.15 Routing T-VAN dropdown (MVP chỉ Hilo, disabled khác)
- [ ] 5.16 Submit → idempotent, loading state, success → drawer detail
- [ ] 5.17 Error handling Hilo reject → wizard sai sót entry point

### F5 Wizard xử lý sai sót

- [ ] 5.18 5-step stepper UI
- [ ] 5.19 Step 1: chọn loại sai (MST khách, tên hàng, số lượng, đơn giá, thuế suất, …)
- [ ] 5.20 Step 2: decision tree theo NĐ 70/2025 → đề xuất điều chỉnh hoặc thay thế (KHÔNG có "hủy")
- [ ] 5.21 Step 3: nhập thông tin mới
- [ ] 5.22 Step 4: generate biên bản (PDF preview lưu R2)
- [ ] 5.23 Step 5: confirm + Hilo API call
- [ ] 5.24 Audit log entry với reference rule

### F6 Compliance Center MVP

- [ ] 5.25 3 KPI compliance (Tỷ lệ pass, Số rule warning, Audit event 30d)
- [ ] 5.26 Checklist 7 rule pháp lý core (load từ D1 rule engine)
- [ ] 5.27 Mỗi rule: reference NĐ/TT/QĐ, status (Pass/Warning/Fail), action nếu fail
- [ ] 5.28 Audit timeline real-time (last 50 event)
- [ ] 5.29 Banner regulation update (config-driven)

### F7 Kết nối T-VAN

- [ ] 5.30 Hilo card: status (Active), usage (X/Y HĐ trong gói), expire date chứng thư
- [ ] 5.31 Placeholder card cho Viettel/MISA/EFY/VNPT (disabled, "Available Phase 4")
- [ ] 5.32 Alert nếu chứng thư còn <30d expire

### F9 Notification center

- [ ] 5.33 Bell icon topbar với badge count unread
- [ ] 5.34 Dropdown 10 notification mới nhất, link tới screen liên quan
- [ ] 5.35 Full page `/notifications` với filter (regulation, signing, job, risk)
- [ ] 5.36 Mark read / mark all read

### F10 Customer delivery preview

- [ ] 5.37 Sau khi issue success: panel "Gửi cho khách" với 3 channel: Email (live mock), Zalo OA (mock), Portal link (live)
- [ ] 5.38 Status track: đã gửi, đã mở, đang chờ ký (Zalo OA mock chỉ visual)
- [ ] 5.39 Public portal `/p/:token` cho khách lookup HĐ (token rate-limited + Turnstile)

### Acceptance criteria Batch 5

- [ ] 5.40 5 demo scenario end-to-end pass:
  - Owner xem dashboard + compliance
  - Kế toán phát hành 1-click POS
  - Kế toán xử lý sai sót → adjust
  - Owner xem T-VAN status
  - Khách cuối lookup HĐ qua portal link

---

## Batch 6 — Background workflows + Queues (Tuần 8-9)

- [ ] 6.1 `queues/delivery-consumer.ts`: gửi email qua Cloudflare Email Routing hoặc SendGrid (Worker fetch)
- [ ] 6.2 `queues/audit-sink-consumer.ts`: sink audit-critical event sang GCP Cloud Logging
- [ ] 6.3 Cron Worker daily: aggregate metric (count, success rate, latency), update D1 daily_stats
- [ ] 6.4 Cron Worker hourly: kiểm tra chứng thư số sắp expire, push notification
- [ ] 6.5 Webhook handler `/webhooks/hilo`: nhận callback async từ Hilo (signature verify HMAC)
- [ ] 6.6 Dead letter queue cho fail-after-retry, alert ops

---

## Batch 7 — Security hardening (Tuần 9-10)

- [ ] 7.1 Content Security Policy header strict + report-uri
- [ ] 7.2 CSRF protection: SameSite=Strict cookie + double-submit token cho mutation
- [ ] 7.3 Input validation Zod schema cho mọi endpoint, reject unknown field
- [ ] 7.4 Output sanitization: HTML escape ở frontend, R2 attachment qua signed URL TTL 5 phút
- [ ] 7.5 PII encryption at rest: `buyer_name` D1 column AES-256-GCM với Workers Crypto API
- [ ] 7.6 PII redaction trong log: MST/phone/email hash SHA256 prefix
- [ ] 7.7 Secret rotation pipeline: GitHub Action 90d trigger, rotate Workers Secret + GCP Secret Manager
- [ ] 7.8 Dependency audit gate: `npm audit --audit-level=high` fail CI
- [ ] 7.9 OWASP ZAP automated scan trên staging weekly
- [ ] 7.10 Penetration test bên thứ ba (Verichains/CMC) trước canary
- [ ] 7.11 Threat model review v2 sau khi build (CTO sign-off)

---

## Batch 8 — Observability + Runbook (Tuần 10-11)

- [ ] 8.1 Grafana Cloud workspace + data source CF Analytics + GCP Monitoring
- [ ] 8.2 Dashboard: request rate, p50/p95/p99 latency, error rate per endpoint, Hilo upstream latency, D1 query time
- [ ] 8.3 Alert policy:
  - p95 issue latency > 3s 5min sustained → PagerDuty
  - Error rate > 1% 5min → PagerDuty
  - Hilo upstream error > 5% 10min → Slack ops channel
  - Daily compliance violation count > 0 → email legal
- [ ] 8.4 Runbook: deploy procedure, rollback procedure, incident response, on-call rotation
- [ ] 8.5 Status page setup (Cloudflare Pages static hoặc Atlassian Statuspage free)

---

## Batch 9 — Beta launch (Tuần 11-12)

- [ ] 9.1 Recruit 10 beta merchant từ Phase 0 pool (F&B, retail mix)
- [ ] 9.2 Onboarding playbook: Haravan partner team setup, training video 5 phút
- [ ] 9.3 Canary deploy 10% traffic cho 7 ngày, monitor metric
- [ ] 9.4 Full 100% sau canary pass acceptance
- [ ] 9.5 Daily standup với beta merchant trong tuần 1, weekly tuần 2-4
- [ ] 9.6 Feedback collection: in-app NPS + Calendly interview slot
- [ ] 9.7 Bug triage queue, SLA bug fix 48h

---

## Batch 10 — Verification + handoff (Tuần 12+)

- [ ] 10.1 Run full acceptance test theo proposal §5
- [ ] 10.2 Lighthouse audit final, contrast WCAG AA pass
- [ ] 10.3 Penetration test report no critical/high
- [ ] 10.4 Compliance review với legal counsel ký off NĐ 70/TT 32 mapping
- [ ] 10.5 Runbook + architecture doc final
- [ ] 10.6 Kickoff brief cho Phase 1.1 (Bulk operations, máy tính tiền NĐ 70, Customer Profile auto-fill real)
- [ ] 10.7 Apply spec delta: move `openspec/changes/mvp-foundation-cf-google/specs/mvp/spec.md` → `openspec/specs/mvp/spec.md`
- [ ] 10.8 Archive change vào `openspec/changes/archive/` sau khi merge

---

## Risk-driven verification (continuous, không theo batch)

- [ ] V1 Mỗi PR có file changed > 5 → require Tech Lead review
- [ ] V2 Mỗi PR touch `migrations/` → require Tech Lead + DBA-equivalent review
- [ ] V3 Mỗi PR touch `auth/` hoặc `compliance/` → require CTO review
- [ ] V4 Weekly compliance scan: rule engine config diff với baseline pháp luật
- [ ] V5 Monthly threat model review

---

## Out-of-scope (defer Phase 1.1+, KHÔNG làm trong change này)

- ❌ Bulk operations full (chỉ skeleton entry point)
- ❌ Inbound invoice AI workbench (chỉ preview placeholder)
- ❌ Automation Builder
- ❌ Public API + Marketplace
- ❌ Zalo OA real integration (mock)
- ❌ Multi-T-VAN real failover (chỉ adapter interface)
- ❌ Máy tính tiền NĐ 70 connectivity full
- ❌ Migration dữ liệu cũ từ Hilo portal
- ❌ AI tiền-kiểm deep
- ❌ AI cảnh báo rủi ro NCC
