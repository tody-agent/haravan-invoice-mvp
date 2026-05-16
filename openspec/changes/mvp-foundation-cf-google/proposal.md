# Proposal: MVP Foundation — Cloudflare + Google Serverless Stack

**Change ID:** `mvp-foundation-cf-google`
**Generated:** 2026-05-14
**Owner:** Tody
**Status:** Draft — chờ review Tech Lead + CTO
**Parent docs:** `00_master_context.md` (v1.0), `02_phase1_parity.md`, `openspec/specs/prototype/spec.md`
**Capability:** `mvp` (NEW — song song với capability `prototype` đang tồn tại)

---

## 1. Why we're doing this

### 1.1 Qualified problem

**For** Haravan SMB merchants (Owner, Kế toán, Thu ngân) đang dùng Haravan Invoice trên embed/redirect của Hilo,
**Who** cần một trải nghiệm hóa đơn liền mạch trong Haravan Admin và compliance NĐ 70/2025 + TT 32/2025 ngay lập tức,
**The** trải nghiệm hiện tại là `embed iframe / redirect` sang portal Hilo — Haravan không sở hữu UX, không có data invoice để feed lại merchant, không thể thêm tính năng đặc thù (POS 1-click, omnichannel dashboard, AI tiền-kiểm),
**That** prototype HTML clickable (`prototype/*.html`) đã chứng minh vision và UX direction nhưng **không phải code thật** — không deploy được, không call Hilo API thật, không lưu metadata, không có auth, không có security boundary,
**Unlike** một MVP working production-grade có thể deploy lên Cloudflare edge cho beta merchant pool 10-15 stores, ghi metadata vào D1, gọi Hilo qua adapter có circuit breaker/idempotency, login bằng Haravan SSO, và pass 7 compliance rule pháp lý cốt lõi,
**Our approach** dựng **foundation hạ tầng serverless** trên stack **Cloudflare + Google** (Pages + Workers + D1 + R2 + KV + Queues + Access cho data plane, Google Workspace SSO + Gemini API cho identity & AI), shipped như **phiên bản prototype đầu tiên deploy được** — chứa đủ các must-have feature của Phase 1 (RICE #1, #3, #4, #9) cộng với scaffolding cho Phase 2-3.

### 1.2 Root causes

1. **Architecture root cause** — prototype hiện là static HTML, không có gateway layer, không có DB, không có auth → không validate được những giả định technical (Hilo API latency, idempotency contract, ký số flow, audit log immutable).
2. **Compliance root cause** — NĐ 70/2025 + TT 32/2025 hiệu lực 1/6/2025 đã yêu cầu HKD ≥1B doanh thu kết nối máy tính tiền + bỏ thủ tục hủy hóa đơn. Prototype HTML chỉ mô phỏng visual; MVP cần xử lý workflow điều chỉnh/thay thế **trên data thật**.
3. **Business root cause** — Haravan đang phụ thuộc UX Hilo 100%. Mỗi tháng trôi qua chưa có MVP riêng = chưa thể test pricing, chưa có data để feed AI Phase 3, chưa có moat khác biệt với MISA meInvoice + AVA.
4. **Operational root cause** — chưa có infra contract: rate limit, retry, circuit breaker, observability, audit log đều đang ở mức "khi build sẽ làm". Trade-off này tạo rủi ro launch ngầm khi vào Phase 1 production.

### 1.3 Impact nếu không làm

- **Business impact** — Phase 1 production launch sẽ trượt vì không có foundation đã được validate trên môi trường thật. Mỗi tuần trượt ≈ ~80k merchant không có lý do "ở lại Haravan" khác biệt với MISA.
- **Compliance impact** — risk NĐ 70/2025 audit khi merchant pool tăng. CQT có thể flag nếu Haravan vẫn route 100% qua Hilo iframe mà không có audit trail nội bộ minh bạch.
- **Technical debt impact** — designer/dev sẽ tiếp tục build feature mới trên prototype HTML và phải refactor toàn bộ khi vào React/Workers production → 2-3x effort, tăng drift giữa spec và code.
- **Strategy impact** — không có MVP nghĩa là không có metric thật để feed AI Phase 3 (RICE #8, #10). Cả lộ trình bị shift right.

### 1.4 Current-state summary

| Artifact | Tình trạng | Gap với MVP working |
|---|---|---|
| `prototype/*.html` | 14 HTML files, fullscreen Haravan-like shell, multi-page navigation client-side | Không có backend, auth, DB, deploy pipeline, security |
| `openspec/specs/prototype/spec.md` | Spec cho clickable prototype | Không cover infra, runtime, compliance enforcement |
| Phase 1 plan (`02_phase1_parity.md`) | Có roadmap 3 tháng, 8 người | Chưa có spec triển khai chi tiết stack/security/data plane |
| Vibe prompts `01_gateway_scaffold.md`, `02_portal_ui_scaffold.md`, `03_hilo_adapter_multi_tvan.md` | Có template prompt | Chưa có spec ràng buộc để vibe coding khớp với architecture |

---

## 2. What's changing

### 2.1 Tóm tắt (TL;DR)

Tạo **capability mới `mvp`** trong `openspec/specs/mvp/` (sẽ apply sau khi change merge), tách biệt với `prototype` (giữ nguyên). MVP là codebase mới ở `apps/mvp/` (frontend) + `services/gateway/` (Workers) + `infra/cloudflare/` (IaC) + `infra/google/` (auth + AI), deploy được lên `mvp.haravan-invoice.dev` cho beta merchant. Stack chốt: **Cloudflare Pages + Workers + D1 + R2 + KV + Queues + Access + Turnstile + WAF**, cộng **Google Workspace SSO + Gemini API + Cloud Logging**. Auth chính là **Haravan SSO OAuth2**, fallback Google Workspace cho staff.

### 2.2 Phạm vi must-have (MVP scope cứng)

| # | Feature | Source RICE/Phase | Rationale must-have |
|---|---|---|---|
| F1 | Haravan Admin embed shell (sidebar + topbar + content scroll) responsive desktop/tablet/mobile | RICE #3 (Phase 1) | Không có shell = không nhúng được vào Haravan Admin → user không thể truy cập |
| F2 | Dashboard tổng quan với 4 KPI omnichannel (Doanh thu, Số HĐ, % CQT chấp nhận, Cảnh báo NCC) | RICE #5 baseline | Là entry screen, định hình vibe sản phẩm. Bản MVP scope-cut: 4 KPI + recent invoices, không có AI insight |
| F3 | Danh sách hóa đơn với filter (period/status/channel), search MST/tên KH, pagination, drawer chi tiết | Phase 1 parity | Use case tần suất cao nhất cho kế toán |
| F4 | Phát hành 1-click POS/Web/Admin với auto-fill MST + pre-flight check 9 rule + routing Hilo | RICE #1 (top) | RICE cao nhất, defining moment cho UX khác biệt |
| F5 | Wizard xử lý sai sót 5 step theo NĐ 70/2025 (điều chỉnh/thay thế, KHÔNG có "hủy") | RICE #7 | Compliance landmark hiệu lực 1/6/2025 — bắt buộc đúng |
| F6 | Compliance Center MVP với 7 rule checklist + audit log immutable (append-only) | RICE #4 | Pre-empt audit CQT, build trust với owner |
| F7 | Kết nối T-VAN (Hilo primary status + usage + chứng thư số expire alert) | Phase 1 §gateway | Visibility cho owner, foundation cho multi-T-VAN Phase 4 |
| F8 | Auth: Haravan SSO OAuth2 (merchant) + Google Workspace SSO (Haravan staff), session qua KV | Phase 1 §security | Không có auth = không launch được |
| F9 | Notification center (regulation update, signing wait, job failure) | Phase 1 §UX | Owner cần thấy "việc cần làm" mà không vào từng screen |
| F10 | Customer delivery preview (Email, Zalo OA link, Portal lookup) — chỉ trigger, không full Zalo OA integration | Phase 1 §delivery | Closing the loop với khách cuối, test pricing perception |

### 2.3 Infrastructure must-have (foundation scope)

| # | Capability | Service | Rationale |
|---|---|---|---|
| I1 | Frontend hosting + CDN edge | Cloudflare Pages | Static SPA build, edge cache toàn cầu, preview deployment per PR |
| I2 | API gateway + business logic | Cloudflare Workers (TypeScript, Hono framework) | Edge compute, cold start <50ms, scale 0→∞, dùng được Bindings |
| I3 | Relational metadata DB | Cloudflare D1 (SQLite) | Order↔Invoice mapping, audit log, settings, RBAC. <10GB/db, đủ MVP 12-18 tháng |
| I4 | Object storage | Cloudflare R2 | PDF preview, biên bản điều chỉnh, attachment. KHÔNG lưu XML pháp lý (Hilo giữ) |
| I5 | Cache + session | Cloudflare KV | Session token, MST verify cache 30 ngày, rate limit counter |
| I6 | Async queue | Cloudflare Queues | Bulk issue, daily aggregation, email/Zalo delivery, webhook retry |
| I7 | Staff access (Zero Trust) | Cloudflare Access + Google Workspace IdP | Haravan ops/dev truy cập admin endpoint không cần VPN |
| I8 | Merchant auth | Haravan OAuth2 partner app | Primary identity layer cho merchant — không bắt user login lại |
| I9 | Bot protection | Cloudflare Turnstile + WAF + Rate Limiting | Chống brute force MST lookup, spam HĐ test |
| I10 | AI inference | Google Gemini API (Phase 1 chỉ pre-check rule-based + MST extract, AI Phase 3) | Defer LLM-deep, MVP dùng Gemini cho OCR MST + suggest auto-fill |
| I11 | Observability | Cloudflare Analytics + Workers Logs + Google Cloud Logging (sink) | Audit log redundant 2 nơi, alert PagerDuty-compatible |
| I12 | Secrets management | Cloudflare Workers Secrets + Google Secret Manager | Hilo API key, OAuth client secret, signing key |
| I13 | CI/CD | GitHub Actions → Wrangler deploy Pages+Workers, terraform plan/apply cho Cloudflare + Google IaC | PR preview, staged rollout (staging → canary 10% → prod) |
| I14 | Observability tracing | OpenTelemetry → Cloudflare Workers Trace + GCP Cloud Trace | Trace request: merchant → Worker → Hilo, p95 SLA |

### 2.4 Non-functional must-have

- **Performance**: p95 latency phát hành 1-click < 2.5s end-to-end (Worker → Hilo → response). p99 < 5s.
- **Availability**: 99.5% trong MVP (3.6h downtime/tháng chấp nhận). Production sẽ tăng 99.9%.
- **Security**:
  - All API qua HTTPS + HSTS, mTLS giữa Worker và Hilo nếu Hilo support.
  - Audit log immutable (D1 + append-only) + redundant sink GCP Cloud Logging.
  - PII không log: MST, số điện thoại, email khách hàng cuối hash khi log.
  - OWASP Top 10: XSS, CSRF, SQL injection (D1 prepared statement), SSRF.
  - Secret rotation 90 ngày auto.
- **Compliance**:
  - NĐ 70/2025: KHÔNG cho phép action "hủy hóa đơn", chỉ "điều chỉnh" hoặc "thay thế".
  - TT 32/2025: format dữ liệu nghiệp vụ truyền nhận theo QĐ 1510 chuẩn (mapping ở adapter layer).
  - GDPR/PDPL Việt Nam: consent + data retention 10 năm theo Luật Kế toán.
- **Responsive**:
  - Desktop ≥1280px primary (Haravan Admin embed)
  - Tablet 768-1024px (POS Hararetail use case)
  - Mobile 375px+ (owner snapshot, customer delivery link)
- **Accessibility**: WCAG 2.1 AA — contrast, keyboard nav, ARIA cho table/wizard, screen reader cho status badge.
- **i18n**: vi-VN primary, key trong locale file, không hardcode. EN scaffold cho Phase 4.

### 2.5 Design system

- Phỏng theo Haravan Admin (tokens đã được suy luận và document trong `prototype-jtbd-completion/design.md`).
- MVP sẽ ship cùng **Hara DS Proxy v1**: package nội bộ `@haravan-invoice/ui` wrap Tailwind config + shadcn/ui component với token từ prototype.
- Khi Haravan release Hara DS NPM chính thức → swap import paths, không cần refactor component tree.

---

## 3. Out of scope (MVP cứng KHÔNG làm)

- KHÔNG implement AI tiền-kiểm deep (Phase 3) — MVP chỉ rule-based 9 check.
- KHÔNG implement AI cảnh báo rủi ro NCC (Phase 3).
- KHÔNG implement Automation Builder (Phase 4).
- KHÔNG implement Public API + Marketplace (Phase 4).
- KHÔNG implement Bulk operations full (defer Phase 1.1 — MVP chỉ skeleton entry point).
- KHÔNG implement Inbound Invoice AI full (Phase 2-3 — MVP chỉ preview UI).
- KHÔNG implement Zalo OA delivery real (Phase 2 — MVP chỉ trigger + mock).
- KHÔNG implement Multi-T-VAN failover (Phase 4 — MVP chỉ Hilo adapter, nhưng interface multi-tenant).
- KHÔNG implement máy tính tiền NĐ 70 connectivity (Phase 1.2 — MVP scaffold field).
- KHÔNG migrate dữ liệu cũ từ Hilo portal (Phase 1 production).
- KHÔNG replace prototype HTML files — vẫn để `prototype/*.html` cho merchant interview, demo team.

---

## 4. Impact

### 4.1 Repo layout sau change

```
Invoice/
├── prototype/                    ← GIỮ NGUYÊN, không touch
├── apps/
│   └── mvp/                      ← NEW: React 18 + Vite + TS frontend
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.ts
├── services/
│   └── gateway/                  ← NEW: Cloudflare Worker (Hono)
│       ├── src/
│       ├── wrangler.toml
│       └── package.json
├── packages/
│   ├── ui/                       ← NEW: Hara DS Proxy v1
│   ├── hilo-adapter/             ← NEW: Hilo API SDK + adapter interface
│   └── shared/                   ← NEW: types, schema, locale
├── infra/
│   ├── cloudflare/               ← NEW: Terraform CF resources
│   └── google/                   ← NEW: Terraform GCP resources
├── .github/workflows/            ← NEW: deploy pipelines
└── openspec/
    ├── specs/
    │   ├── prototype/            ← unchanged
    │   └── mvp/                  ← NEW (apply sau khi change merge)
    └── changes/
        └── mvp-foundation-cf-google/   ← THIS CHANGE
```

### 4.2 Team & timeline

- **Đề xuất 8 người** (Phase 1 baseline): 1 PM, 1 Tech Lead, 3 BE (Workers + D1 + Hilo adapter), 2 FE (React + Hara DS proxy), 1 Designer, 1 QA.
- **Timeline đề xuất**: 10-12 tuần từ kickoff đến canary beta (10 merchant). Có buffer 20% → 14 tuần realistic.
- **Phụ thuộc cứng** (block kickoff):
  - Haravan OAuth2 partner app provision (~2 tuần với Haravan Identity team)
  - Hilo API credential staging (~1 tuần partnership)
  - Cloudflare Workers Paid plan + D1 production tier
  - Google Workspace Business+ cho staff SSO
  - DNS `mvp.haravan-invoice.dev` ready

### 4.3 Migration story (prototype → MVP)

- Prototype HTML **không** migrate code; nó vẫn là demo artifact.
- Visual design tokens trong `prototype/assets/css/tokens.css` được **copy + adapt** vào `packages/ui/tokens.ts`.
- Mock data trong `prototype/assets/js/data.js` được **port** sang seed file cho D1 development environment.
- Spec `openspec/specs/prototype/spec.md` giữ nguyên, không sửa.

### 4.4 Risks & mitigations

| # | Risk | Severity | Mitigation | Owner |
|---|---|---|---|---|
| R1 | Haravan OAuth2 partner app chậm provision → block auth | High | Sprint 0 đẩy ngay; fallback: Google Workspace SSO cho closed beta 5 internal merchant Haravan-owned | PM + Haravan Identity |
| R2 | Cloudflare D1 < 10GB limit không scale → cần migrate Firestore | Medium | Audit dung lượng dự kiến (200 byte/invoice × 1M invoice/tháng × 12 tháng = ~2.4GB), an toàn 2-3 năm; có exit plan sang Firestore documented | Tech Lead |
| R3 | Hilo API rate limit không document → throttling không lường | Medium | Phase 0 negotiate SLA rate limit; gateway implement adaptive throttle dùng KV counter | BE Lead |
| R4 | NĐ 70/2025 + dự thảo NĐ 2026 thay đổi workflow → MVP cần rework | High | Compliance Center build modular rule engine (config-driven, không hard-code rule); monitor process bằng task định kỳ | PM + Legal |
| R5 | Cloudflare Workers cold start ở region xa VN | Low | Workers chạy edge VN (HKG/SIN POP); benchmark p95 trong sprint 1 | Tech Lead |
| R6 | Audit log sink double-write CF Logs + GCP Logging tăng cost | Low | MVP chỉ sink GCP cho audit-critical event (issue/adjust/sign), non-critical chỉ CF | BE |
| R7 | Hara DS chính thức release giữa MVP → component drift | Medium | Hara DS Proxy có abstraction layer (`@haravan-invoice/ui`); swap implementation, không phải usage | Designer + FE |
| R8 | Mobile responsive break ở POS tablet Hararetail real device | Medium | Test 3 thiết bị thật trong sprint 4 (iPad Air, Samsung Tab A8, Lenovo Tab) | QA |

---

## 5. Acceptance criteria (gate ra khỏi MVP)

MVP được coi là done khi:

- [ ] 10 beta merchant đã onboard và phát hành ≥1 hóa đơn thật qua MVP.
- [ ] 99.5% uptime trong 4 tuần beta liên tục.
- [ ] p95 issue latency < 2.5s.
- [ ] 0 compliance violation log (action "hủy" attempt = 0 vì UI không cho phép).
- [ ] Audit log của 100% transaction issue/adjust/replace có trace ID đầy đủ Worker → Hilo.
- [ ] Lighthouse score ≥ 85 (Performance + Accessibility) trên desktop và tablet.
- [ ] Penetration test pass (no critical/high finding) — chạy bởi internal security hoặc bên thứ ba.
- [ ] Tài liệu runbook deploy + rollback hoàn thành.
- [ ] Kickoff brief cho Phase 1.1 (bulk + máy tính tiền NĐ 70 connectivity) sẵn sàng.

---

## 6. Open questions

1. **Haravan OAuth2 partner app**: tenant model là gì? Multi-store cùng MST → 1 workspace hay nhiều? → cần verify với Haravan Identity team.
2. **Hilo API contract**: idempotency key format Hilo support? — cần lấy từ partnership doc.
3. **CQT format**: QĐ 1510 chuẩn nhưng có local extension nào không? — verify với Hilo + 1 partner kế toán.
4. **Google Workspace tier**: Business Standard đủ hay cần Plus cho audit log retention? — coordinate với Haravan IT.
5. **Gemini API region**: có endpoint ở Asia (SIN) không hay phải qua US? — ảnh hưởng latency MST OCR.
6. **DNS strategy**: `mvp.haravan-invoice.dev` standalone hay `invoice.haravan.com/mvp/*` reverse proxy? — coordinate Haravan Platform team.

---

## 7. Traceability

- `00_master_context.md` §3 Kiến trúc 5 tầng, §6 Top 10 RICE, §7 Ràng buộc, §11 Compliance landmark
- `02_phase1_parity.md` (Phase 1 — Parity & Foundation theme)
- `openspec/project.md` (stack baseline cho prototype, sẽ kế thừa concept ở MVP)
- `openspec/specs/prototype/spec.md` (current state baseline, MVP không thay)
- `vibe_coding_prompts/01_gateway_scaffold.md`
- `vibe_coding_prompts/02_portal_ui_scaffold.md`
- `vibe_coding_prompts/03_hilo_adapter_multi_tvan.md`
- `vibe_coding_prompts/04_one_click_pos_web_issue.md`
- `vibe_coding_prompts/05_autofill_mst_customer_profile.md`
- `vibe_coding_prompts/09_wizard_xu_ly_sai_sot.md`
- `vibe_coding_prompts/10_compliance_center_audit_trail.md`

---

## 8. Sign-off required

- [ ] PM (Tody) — scope + timeline
- [ ] Tech Lead — architecture + stack
- [ ] CTO — security + compliance posture
- [ ] Head of Product — UX baseline
- [ ] Legal counsel — compliance NĐ 70/TT 32 mapping
- [ ] Hilo partnership contact — API SLA + idempotency contract
