# 05 — PHASE 4 PLAN: Platform & Ecosystem
**Tham chiếu:** Master Context v1.0 + Phase 3 Kickoff Brief
**Thời lượng:** 3-4 tháng (12-16 tuần) · **Team:** 10-12 người (+1 DevRel)
**Theme:** *"Biến Haravan Invoice từ product thành nền tảng mở"*

---

## Executive Summary

Phase 4 chuyển từ "product mạnh" sang "nền tảng có network effect". Mở rộng theo 3 hướng: (1) cho merchant tự dev (Public API + Automation Builder no-code), (2) cho partner cắm vào (Marketplace + Custom Dashboard widget), (3) cho enterprise chọn multi-T-VAN. Đây là phase **bet dài hạn** — nếu market chưa sẵn sàng, defer xuống mức "soft launch developer preview" thay vì full platform. Critical decision đầu phase: dựa trên Phase 3 data, có đủ enterprise demand cho Multi-T-VAN không? Có đủ partner ecosystem (MISA SME, Fast, Bravo) muốn tích hợp không? Risk lớn: platform complexity hurt core UX nếu không có guardrail. Mitigation: feature flag tier merchant, Public API chỉ enable cho Pro/Enterprise.

---

## Pre-requisite từ Phase 3

- [ ] Core product + AI mature, churn rate <5%/quarter
- [ ] Enterprise/power user signal: ≥10 enterprise xin Public API trong Phase 2-3
- [ ] AI cost/quality stable, không drift bất thường
- [ ] Engineering capacity dư ≥40% (Phase 2-3 đã foundational)
- [ ] Partnership team commit thời gian outreach
- [ ] DevRel role hire xong
- [ ] Multi-T-VAN abstraction (từ Phase 0 ADR-002) tested với Viettel sandbox

---

## DIAMOND 1 — PROBLEM SPACE

### DISCOVER (tuần 1-3)

**1. Enterprise needs interview** — top 20 enterprise merchants:
- Đang dùng tool nào ngoài Haravan Invoice? Custom report, integration với ERP cũ?
- Workflow nào đang manual mà muốn automate?
- Có dev team in-house không? Năng lực nào?
- Multi-T-VAN: hiện tại có dùng nhiều T-VAN parallel không? Lý do?

**2. Developer survey** — gửi survey + interview 30-50 dev đang làm cho merchant Haravan:
- API gì muốn? Endpoint, format, auth model preferred?
- SDK ngôn ngữ nào? PHP, Node, Python, .NET, Java?
- Documentation expectation?
- Sandbox needs?

**3. Partner landscape**

Phần mềm kế toán Việt:
- **MISA SME / AMIS Kế toán**: dominant market share. Tích hợp = win-win nếu MISA đồng ý (nhưng cũng là đối thủ trong meInvoice space). Cần positioning rõ.
- **Fast Accounting**: target SMB. Open API có sẵn.
- **Bravo**: target enterprise. Custom integration.
- **3TSoft, Effect, Smart Pro**: niche, ít prio.

ERP:
- **SAP, Oracle, Odoo**: cho enterprise lớn, qua connector chuẩn (REST + OAuth).
- **Custom in-house ERP**: support qua webhook + API.

CRM:
- **Salesforce, HubSpot**: ít overlap với Haravan merchant base, defer.

**4. Multi-T-VAN demand**

Đo từ Phase 2-3 data: bao nhiêu enterprise đã hỏi "có cách nào dùng nhiều T-VAN parallel không?". Hypothesis: 5-10% enterprise có nhu cầu (vd: Hilo cho Haravan, Viettel cho hệ thống cũ).

Verify với 5-10 enterprise interview.

**5. Automation use cases**

Pattern automation phổ biến từ Phase 2-3 logs:
- "Khi order paid > 1M VND → tự động phát hành hóa đơn + gửi email"
- "Mỗi cuối ngày → gộp đơn lẻ + email báo cáo cho kế toán"
- "Khi customer mới có MST → cập nhật Customer Profile + tạo greeting email"
- "Khi inbound invoice >X từ NCC mới → notify owner"

Catalog top 20 patterns.

### DEFINE (tuần 4)

**Platform vision statement:** *"Haravan Invoice không chỉ là tool xuất hóa đơn — là nền tảng để merchant tự dệt workflow tài chính cho doanh nghiệp mình, với hệ sinh thái partner cùng tham gia."*

**Partner program structure (3 tier):**

| Tier | Quyền lợi | Điều kiện |
|---|---|---|
| **Listed Partner** | App listed trên marketplace, basic API access | Pass review process, bảo hiểm trách nhiệm |
| **Preferred Partner** | Co-marketing, training, leads share | Active development, ≥100 install, NPS >40 |
| **Strategic Partner** | Revenue share, joint roadmap, dedicated support | Top 5 partners, exec relationship |

**Pricing model platform tier:**

- **Free tier**: 100 API call/day, sandbox unlimited, no SLA
- **Pro tier**: 10k API call/day, $99-299/tháng, SLA 99%
- **Enterprise tier**: unlimited, custom pricing, SLA 99.9%, dedicated CSM

**Governance:**
- API versioning: SemVer, breaking change → new major version, deprecation 12 tháng
- Deprecation policy: notify 6 tháng trước sunset, migration tool provided
- SLA tier: tương ứng pricing
- Security: OAuth 2.0, rate limit, audit log, GDPR-compliant

---

## DIAMOND 2 — SOLUTION SPACE

### DEVELOP (tuần 5-12)

#### 1. AI Copilot Chat

**Architecture:** LLM (Claude Sonnet 4.6 hoặc Gemini Pro) + RAG over merchant data + tool calling

**Capability:**
- Trả lời query về data merchant: "Tháng trước phát hành bao nhiêu hóa đơn? Top 5 khách hàng?"
- Action với confirmation: "Phát hành lại hóa đơn cho order #12345" → AI prepare → confirm UI → execute
- Suggest insight proactively: "Tuần này có 3 hóa đơn pending >24h, kiểm tra ngay?"

**Context-aware:** Copilot biết merchant đang ở page nào, có context page đó

**Safety:**
- Mọi action có side-effect (issue/edit/delete) phải confirm UI trước execute
- Read-only query không cần confirm
- Audit log mọi chat + action

**UX:** floating chat widget góc dưới phải, expand thành sidebar, hỗ trợ voice input (tận dụng device mic).

#### 2. Automation Builder (No-code)

**Concept tương tự Zapier/Make.com nhưng vertical hóa cho invoice:**

**Triggers:**
- Order created / paid / cancelled / refunded
- Payment received / failed
- Customer created / updated MST
- Schedule (every X minutes, daily, weekly, cron)
- Webhook from external system
- Invoice status change (issued / accepted / rejected)
- Manual button trigger

**Actions:**
- Phát hành hóa đơn
- Gộp hóa đơn (theo rule)
- Gửi hóa đơn (email / Zalo / SMS)
- Điều chỉnh / Thay thế
- Notify (email / Zalo / Slack webhook)
- Update Customer Profile
- Call external webhook
- AI action (classify, summarize, extract)

**UI:**
- Drag-drop flow canvas (React Flow library)
- Pre-made templates: 20-30 templates phổ biến (vd: "F&B daily summary", "B2B monthly bulk")
- Test run với sample data
- Versioning, enable/disable, run history

**Limits per tier:**
- Free: 5 automation, 100 run/day
- Pro: 50 automation, 10k run/day
- Enterprise: unlimited

#### 3. Custom Dashboard với Widget

**Library widget:**
- KPI Card (number, change %, sparkline)
- Line/Bar/Pie/Area chart
- Table với filter
- Funnel
- Geo map (per-branch)
- Custom HTML/iframe (cho enterprise)

**Layout:** drag-drop grid, save dashboard template, share template với team / public marketplace.

**Data source:** Haravan data (Order/Customer/Invoice) + custom SQL query (Pro/Enterprise) + external webhook data.

#### 4. Public API & Webhook

**REST API documentation portal**: dùng Stoplight/Redoc/Swagger UI. Hosted ở `developers.haravan.com/invoice`.

**OAuth 2.0:**
- Authorization Code flow cho 3rd party app
- Client Credentials cho machine-to-machine
- Refresh token, scope-based permission (read:invoice, write:invoice, admin:invoice)

**Rate limiting tier theo plan** (như bảng trên).

**SDK:**
- JavaScript (Node + Browser)
- PHP (composer package)
- Python (pip)
- (Optional Phase 4.5) .NET, Java

**Webhook:**
- Subscribe events qua dashboard hoặc API
- Signed payload (HMAC-SHA256)
- Retry policy: exponential backoff, max 5 attempts, dead letter queue
- Replay tool cho debugging

#### 5. Multi-T-VAN Abstraction

**Adapter pattern (đã design Phase 0):**

Implement 2-3 adapter mới ngoài Hilo:
- **ViettelAdapter** (qua Viettel SInvoice API)
- **MISAAdapter** (qua MISA meInvoice API) — dù MISA là đối thủ, có khả năng họ cho integration vì revenue
- *(Optional)* EFYAdapter, VNPTAdapter

**Migration tool giữa T-VAN:**
- Export merchant data từ T-VAN cũ qua adapter
- Import vào T-VAN mới
- Verify consistency, dual-write period 30 ngày
- Switch primary

**Failover automatic:**
- Nếu primary T-VAN down >5 phút → auto failover sang secondary (chỉ enterprise tier có 2 T-VAN active)
- Notification cho merchant + internal team

**Pricing implication:** multi-T-VAN là enterprise feature, charge premium.

#### 6. Partner Marketplace

**Onboarding flow cho partner developer:**
1. Apply qua portal → review identity + business
2. Get sandbox + dev resources
3. Build app + submit for review
4. Review process: code review, security scan, UX review (2-4 tuần)
5. Approve → list trên marketplace

**App review process:**
- Security: scan dependency, check secret leak, OAuth scope minimum
- UX: design system compliant, đáp ứng accessibility AA
- Documentation: README, support contact, pricing transparent
- Legal: terms of service, privacy policy

**Revenue share model:**
- Default 70/30 (partner / Haravan)
- Listing fee: free cho Listed, $99/tháng cho Preferred
- Strategic Partner: custom

**Marketplace UI:**
- Browse by category, search
- Reviews, install count, screenshots
- One-click install (OAuth flow)
- Manage installed apps in merchant dashboard

### DELIVER (tuần 13-16)

| Tuần | Activity |
|---|---|
| 13 | Developer Preview với 10-20 partners (closed) |
| 14 | Public Beta launch, marketing campaign, Developer Portal live |
| 15 | Hackathon "Build on Haravan Invoice" (online + 1 city offline) |
| 16 | Iterate based on feedback, GA launch, partner roadshow |

**Marketing assets:** developer conference talk, video tutorial series 10 video, case study 3 launching partners, blog post weekly.

---

## Câu hỏi nghiên cứu cụ thể

1. **Bao nhiêu merchants có in-house dev team đủ năng lực dùng API?** Hypothesis 5-10% (≈ 4-8k merchants), validate trong Discover.
2. **Pricing model partner ecosystem nào win?** Test với 10 partner candidate: % revenue vs flat listing fee vs free.
3. **Multi-T-VAN có conflict legal?** Verify với tax counsel: 1 merchant dùng nhiều T-VAN parallel có ổn không (mỗi T-VAN cho 1 phạm vi nghiệp vụ).
4. **Security model 3rd party app access merchant data?** OAuth scope granular, audit log, ability to revoke.
5. **Cần phân biệt API tier (free/pro/enterprise)?** Yes — protect platform stability, monetize.

---

## Deliverables

1. **Platform features production**: AI Copilot, Automation Builder, Custom Dashboard, Public API, Webhook, Multi-T-VAN, Marketplace
2. **Developer Portal** với docs, sandbox, examples, community forum
3. **Partner Program** với ≥5 launching partners
4. **Multi-T-VAN tested** với ≥1 alternative active in production
5. **Platform pricing & packaging** finalized
6. **Long-term roadmap post-Phase 4** (BAU mode)

---

## Success Metrics — Exit Criteria

- [ ] 20% enterprise merchants dùng Public API
- [ ] 10% merchants dùng Automation Builder (chạy ≥1 automation)
- [ ] ≥5 partner apps trên marketplace với active install
- [ ] ≥1 enterprise customer dùng multi-T-VAN successfully (live production)
- [ ] Developer NPS ≥50
- [ ] Platform revenue contributing ≥15% tổng revenue invoice product
- [ ] Marketplace install ≥1000 total

---

## Risks & Mitigations

| ID | Risk | Prob | Impact | Mitigation |
|---|---|---|---|---|
| P4-R1 | Platform complexity hurt core UX | 3 | 5 | Strict guardrails, feature flag, separate platform settings |
| P4-R2 | Partner low quality flood marketplace | 3 | 4 | Review process strict, rating system, suspend mechanism |
| P4-R3 | API abuse (DDoS, scraping) | 4 | 3 | Rate limit + monitoring + WAF |
| P4-R4 | Multi-T-VAN compliance gray area | 3 | 4 | Legal sign-off per scenario, document boundaries |
| P4-R5 | Market chưa sẵn sàng platform tier | 3 | 4 | Có "soft launch" path: developer preview → public beta → GA, có thể defer GA nếu signal yếu |
| P4-R6 | Hilo unhappy về multi-T-VAN | 3 | 4 | Đàm phán Hilo trước Phase 4, có thể slot Hilo làm "preferred" tier |
| P4-R7 | LLM cost cho Copilot vượt control | 4 | 3 | Per-merchant quota, free tier query rate-limit |
| P4-R8 | Marketplace 0 partner ban đầu | 3 | 4 | Pre-recruit 5 partner trong Phase 3, launch with critical mass |
| P4-R9 | Dev portal docs lỗi thời | 4 | 3 | Auto-generate from OpenAPI spec, weekly review |
| P4-R10 | Migration tool T-VAN có data loss | 2 | 5 | Dual-write mandatory 30d, restore from backup procedure |

---

## Handoff to BAU (Business As Usual)

Sau Phase 4, sản phẩm vào maintenance + iterate mode. Cần thiết lập:

**Quarterly roadmap process:**
- Đầu mỗi quarter: review metric, RICE recompute, roadmap planning
- Stakeholder review: Head of Product, CTO, Partner team
- Output: roadmap cho 3 tháng tới + backlog 6-12 tháng

**Partner program operating model:**
- Dedicated team 2-3 người (DevRel, Partner Success)
- Quarterly partner summit
- Co-marketing budget per quarter

**Continuous improvement framework:**
- Monthly NPS survey
- Weekly support ticket triage → product backlog
- Quarterly competitive teardown
- Bi-annual major version release

**Compliance monitoring (perpetual):**
- Subscribe official sources (Tổng Cục Thuế, Bộ Tài chính)
- Monthly check regulation updates
- Hire/retain external tax counsel

**AI continuous learning:**
- Monthly accuracy review
- Quarterly retraining or prompt update
- Cost monitoring real-time
