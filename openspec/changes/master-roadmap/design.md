# Design: Master Roadmap — Haravan Invoice MVP

## Context

MVP hiện tại: 22 pages, 20 API endpoints, 47 tests. Cần hoàn thiện còn lại ~60% tính năng theo vibe_coding_prompts (16 features) + vibe_design_prompts (12 screens).

**Stack:** Hono + D1 + KV + R2 + React + Cloudflare Pages (free tier)
**Target:** Production-ready MVP cho 50-100 merchants

## Technical Approach

**Strategy:** 5 phases, mỗi phase 3-5 ngày, chạy song song 2-4 sub-agents mỗi phase.

**Adaptation từ vibe_coding_prompts:**
- Fastify → Hono
- Postgres → D1
- Redis → KV
- Kafka → Background Workers (Cloudflare Workers)
- OpenTelemetry → Cloudflare Analytics

## Phase 1: Core Features (Ngày 1-5)

### 1.1 One-Click Issue (RICE #1, 68.400 điểm)
**Source:** `vibe_coding_prompts/04_one_click_pos_web_issue.md`
- Auto-issue on order paid (polling Haravan Order API)
- POS endpoint: `POST /api/v1/invoices/from-pos`
- Admin button: "Xuất hóa đơn" trong order detail
- Optimistic UI + error handling

### 1.2 Auto-fill MST (RICE #81.000)
**Source:** `vibe_coding_prompts/05_autofill_mst_customer_profile.md`
- Customer profile lookup → auto-fill MST
- MST validation real-time (debounce 500ms)
- CQT lookup → verify MST active
- Cache lookup 24h trong KV

### 1.3 Compliance Center
**Source:** `vibe_coding_prompts/10_compliance_center_audit_trail.md`
- Audit trail timeline (đã có basic version)
- Compliance dashboard: % CQT accepted/rejected
- Regulation reference cards (NĐ 70, TT 32, QĐ 1510)
- Export compliance report

## Phase 2: Differentiation (Ngày 6-10)

### 2.1 Gộp đơn lẻ cuối ngày (TT 78/TT 32)
**Source:** `vibe_coding_prompts/06_gop_don_le_cuoi_ngay.md`
- Cron job daily 23:30
- Manual "Gộp ngay" button
- Rule engine configurable per merchant
- Hóa đơn tổng format TT 78

### 2.2 Dashboard Omnichannel
**Source:** `vibe_coding_prompts/07_dashboard_omnichannel.md`
- Charts: revenue by channel, by branch
- Drill-down: chart → filtered list → detail
- Top 20 customers + Top 10 SKUs
- Export PDF/PNG

### 2.3 Zalo OA Delivery
**Source:** `vibe_coding_prompts/08_zalo_oa_invoice_delivery.md`
- Auto-send Zalo OA after issue
- Template message + CTA mini-app
- Tracking: delivered/read/clicked
- Fallback email

### 2.4 Product Catalog
- `GET /api/v1/products` — list + search
- `/products` page — table + filters

## Phase 3: AI Features (Ngày 11-15)

### 3.1 AI Tiền-kiểm (Pre-issue Check)
**Source:** `vibe_coding_prompts/11_ai_tien_kiem.md`
- Rule-based check inline (<50ms)
- LLM check async cho edge case (<2s)
- Warning inline trong form
- Block submit khi severity = error

### 3.2 AI Cảnh báo NCC Rủi ro
**Source:** `vibe_coding_prompts/12_ai_canh_bao_ncc.md`
- Risk score 0-1 per supplier
- Alert badge trong form + list
- Explainability: top 3 reasons

### 3.3 Inbound Invoice + AI Classify
**Source:** `vibe_coding_prompts/13_inbound_invoice_ai.md`
- Auto-fetch inbound từ Hilo
- OCR upload ảnh hóa đơn
- AI classify category
- AI match PO

## Phase 4: Platform (Ngày 16-20)

### 4.1 AI Copilot Chat
**Source:** `vibe_coding_prompts/14_ai_copilot_chat.md`
- Floating chat widget
- Context-aware queries
- Tool calling: invoice CRUD
- Multi-turn conversation

### 4.2 Automation Builder
**Source:** `vibe_coding_prompts/15_automation_builder_no_code.md`
- Drag-drop canvas (React Flow)
- 8+ triggers, 12+ actions
- Template library (20-30)
- Run history + replay

## Phase 5: Polish & Deploy (Ngày 21-25)

### 5.1 Design System Alignment
- Audit all pages against prototype
- Pixel-perfect matching
- Dark mode support
- Mobile responsive

### 5.2 Testing & QA
- E2E tests (Playwright)
- Performance optimization
- Security audit
- Accessibility (WCAG AA)

### 5.3 Production Deploy
- Cloudflare Pages + Workers
- Custom domain
- Monitoring + alerting
- Documentation

## Verification Criteria

- [ ] All 16 features from vibe_coding_prompts implemented
- [ ] All 12 screens from vibe_design_prompts matching prototype
- [ ] 100+ tests passing
- [ ] Performance: page load <2s, API <500ms
- [ ] Mobile responsive (375px - 1440px)
- [ ] Vietnamese locale throughout
- [ ] NĐ 70/2025 compliance enforced
