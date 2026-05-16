# 01 — PHASE 0 PLAN: Foundation & Discovery
**Tham chiếu:** Master Context v1.0 — đã load
**Thời lượng:** 4-6 tuần · **Team:** 4-5 người (PM, Tech Lead, 1 Backend, 1 Designer, 1 Researcher)
**Theme:** *"Hiểu trước, build sau"*

---

## Executive Summary

Phase 0 tồn tại để **không phải redo Phase 1**. Trong 4-6 tuần, team gói gọn 4-5 người chạy 2 vòng Double Diamond song song trên Problem Space (compliance, Hilo, merchant pain) và Solution Space (architecture, partnership, migration). Output cuối phase là 6 tài liệu chốt (5 ADR, partnership term sheet, research synthesis, compliance playbook, Phase 1 backlog refined, risk register) — đủ để tuần 1 Phase 1 có thể code ngay mà không phải vừa code vừa nghiên cứu. Rủi ro lớn nhất phase này: **không lấy được Hilo API spec đủ chi tiết** → toàn bộ ADR sẽ là giả định. Mitigation: chốt LOI/NDA với Hilo tuần 1, có sandbox tuần 2.

---

## DIAMOND 1 — PROBLEM SPACE

### DISCOVER (tuần 1-2)

Mục tiêu: thu thập rộng, không kết luận. 5 mặt cần khám phá song song.

**1. Hilo API Surface — Tech Lead + 1 Backend lead**

Cần lấy được từ Hilo (qua partnership channel, Hilo public docs giới hạn nên phải đàm phán trực tiếp):

- Endpoint catalogue đầy đủ: phát hành (issue), thay thế (replace), điều chỉnh (adjust), hủy, tra cứu, inbound, signing, status check, lookup MST.
- Auth model: OAuth 2.0 / API key / mTLS / signed request.
- Rate limit: per-merchant, per-app, peak burst handling. Yêu cầu Hilo confirm bằng văn bản số liệu cụ thể (vd: 100 req/s, burst 500).
- Webhook: có hay không, latency, retry policy, signature verification, replay protection.
- Sandbox: URL, MST test, test data setup, có cycle reset không.
- Partner provisioning: tự động (API call) hay manual (form submit). Quan trọng cho onboard merchant scale.
- SLA cam kết: uptime, mean time to recovery, escalation channel.
- Pricing per-invoice cho Haravan (whitelabel partner rate).
- Behavior khi CQT downtime: queue local hay reject? Retry policy? Notification mechanism?
- Data export/portability: nếu Haravan muốn migrate merchant sang T-VAN khác, lấy data ra format gì?

**Method:** 2 buổi technical workshop với Hilo (mỗi buổi 3h, 1 buổi business 1 buổi tech), API exploration plan với 20 test case viết sẵn, document review checklist 30 mục.

**2. Compliance Landscape — PM + Legal counsel (external)**

- NĐ 123/2020, TT 78/2021, QĐ 1510/2022 — đọc full text + commentary.
- **NĐ 70/2025/NĐ-CP** (hiệu lực 1/6/2025) — sửa 40/61 điều NĐ 123. Đặc biệt: máy tính tiền cho HKD ≥1 tỷ, bỏ thủ tục hủy, NCC nước ngoài.
- **TT 32/2025/TT-BTC** (hiệu lực 1/6/2025) — thay thế TT 78.
- **Dự thảo NĐ thay thế NĐ 123+70** (Bộ Tư pháp công bố tài liệu thẩm định 21/4/2026). Liên hệ Hilo + 1 luật sư thuế để lấy bản dự thảo và assessment khả năng banh hành.
- 14 nghiệp vụ thay đổi theo NĐ 70 — mapping ra feature tương ứng cần build.
- Quy định gộp đơn lẻ cuối ngày (TT 78 + TT 32): điều kiện áp dụng, edge case xăng dầu, retail, nhà hàng.
- Quy định AI trong fintech (nếu có) và yêu cầu audit/explainability cho AI quyết định liên quan tài chính.

**Method:** Document review checklist + 1 buổi consult với chuyên gia thuế.

**3. Merchant Research — Researcher dẫn đầu**

20-30 merchants Haravan đa segment:
- 6-8 F&B (nhà hàng, quán cafe, chuỗi đồ uống)
- 6-8 Fashion retail
- 4-5 Electronics & gadget
- 3-4 B2B wholesale
- 3-4 Marketplace seller (Shopee, Lazada, Tiki + có web Haravan)
- 2-3 Multi-location enterprise

**Interview script outline (45-60 phút mỗi buổi):**

Phần 1 — Background (5 phút): segment, doanh thu/tháng, số lượng đơn, % cần xuất hóa đơn, ai là người xuất.

Phần 2 — Current invoice flow (15 phút): mô tả từng bước phát hành 1 hóa đơn từ lúc khách yêu cầu đến lúc gửi cho khách. Quay video nếu được. Pain point nào mất nhiều thời gian/sai sót nhất?

Phần 3 — Edge case (10 phút): lần gần nhất phải điều chỉnh/hủy hóa đơn? Tại sao? Quy trình thế nào? Mất bao lâu?

Phần 4 — Tools used (10 phút): đang dùng Haravan Invoice + tool gì khác? MISA AMIS Kế toán? Excel? File giấy?

Phần 5 — Wishlist (10 phút): 3 điều ước về invoice. Phân biệt nice-to-have và must-have.

Phần 6 — Willingness to pay (5 phút): nếu có AI tự động làm X, sẵn sàng trả thêm bao nhiêu/tháng?

**Method:** Phỏng vấn 1-1 video call hoặc on-site (5 merchants on-site shadowing 1 ngày). Record + transcribe. Synthesize qua affinity diagram + JTBD framework.

**4. Internal Audit Haravan — PM + 1 Backend**

Mapping mọi touchpoint Haravan có thể leverage cho invoice:

- **Order**: trigger phát hành, line items, tax breakdown, customer ID.
- **Customer Profile**: MST, địa chỉ, email, Zalo OA ID, lịch sử giao dịch.
- **POS**: phát hành tại quầy, tách/gộp bill, in nhanh.
- **Payment**: phương thức thanh toán → ảnh hưởng thời điểm xuất.
- **Shipping (GHN, GHTK, AhaMove)**: COD success/fail → trigger điều chỉnh.
- **Loyalty**: voucher, point → ảnh hưởng số tiền hóa đơn.
- **HaraSocial**: kênh delivery hóa đơn qua Zalo OA.
- **Webhook/Event bus** Haravan: có sẵn event nào để Gateway subscribe?
- **Reporting/Analytics**: data warehouse có data invoice không? Cần ETL bổ sung?

Output: data flow diagram + integration point inventory với owner.

**5. Competitor Deep-dive — Researcher + Designer**

Tài khoản dùng thử 4 đối thủ + đọc public docs:

- **MISA meInvoice + AVA**: đăng ký dùng thử, ghi lại screenshot/screencast 5 use case (phát hành, gộp đơn, sai sót, AI tiền-kiểm, AI cảnh báo NCC). Note rõ tính năng nào "wow", tính năng nào kém.
- **Viettel SInvoice**: dùng thử qua Viettel Telecom, focus vào enterprise feature (bulk, ký số hàng loạt 10k/tháng).
- **EFY-iHOADON**: focus vào pricing và simplicity cho SMB.
- **VNPT Invoice**: focus vào tích hợp máy tính tiền theo NĐ 70.

Output: feature comparison matrix + UX teardown + "what to steal, what to skip".

### DEFINE (tuần 3)

Sau Discover, hội tụ thành:

**5-7 "How Might We" statements ưu tiên:**

1. *How might we* khiến phát hành hóa đơn từ POS/Web chỉ tốn 1 click thay vì flow Hilo hiện tại?
2. *How might we* migrate 80k merchants sang Gateway mới mà không gây downtime hay tăng error rate?
3. *How might we* tận dụng Customer Profile của Haravan để loại bỏ thao tác nhập MST thủ công?
4. *How might we* giúp merchant F&B tách/gộp bill mà không phải thoát Haravan POS?
5. *How might we* đảm bảo compliance khi NĐ/TT thay đổi mà không phải release urgent mỗi lần?
6. *How might we* xây kiến trúc cho phép swap T-VAN trong tương lai mà không refactor lớn?
7. *How might we* cạnh tranh với MISA AVA về AI mà không phải tự train model từ đầu?

**Validated assumptions** (đánh dấu ✓ những gì merchant interview xác nhận):
- Owner thực sự muốn dashboard tổng hợp (chưa biết ưu tiên gì)
- Kế toán đang đau với điều chỉnh sai sót (mất 15-30 phút/lần)
- Thu ngân từ chối tool nào chậm hơn 2s

**Invalidated assumptions** (những gì interview phủ định):
- Giả định "merchants muốn tự làm AI training" — thực tế họ chỉ muốn ra kết quả
- Giả định "Zalo OA delivery là must" — thực tế email vẫn primary, Zalo nice-to-have
- (cập nhật từ data interview thật)

**Top 3 risk areas:**
- **R1 — Hilo API không đủ rich** cho use case mới: nếu Hilo không expose được endpoint cho gộp đơn, bulk, tra cứu chi tiết → blocker cho Phase 2.
- **R2 — Regulation thay đổi giữa Phase 1**: dự thảo 2026 nếu banh hành sớm sẽ buộc rework feature.
- **R3 — Migration risk**: 80k merchants migrate cùng lúc, downtime 1h cũng là khủng hoảng support.

**Constraint map:**

| Loại | Constraint cụ thể |
|---|---|
| Legal | T-VAN role tách bạch, không lưu XML gốc, phải tuân NĐ 70 từ 1/6/2025 |
| Technical | Hilo API spec hiện chưa đầy đủ, rate limit cần xác nhận |
| Commercial | Partnership Hilo có exclusive period? Pricing whitelabel? |
| Organizational | Team 8-10, chưa có ML engineer cho Phase 0-2 |

---

## DIAMOND 2 — SOLUTION SPACE

### DEVELOP (tuần 4-5)

**Brainstorm 3 kiến trúc Gateway alternatives:**

| Option | Pros | Cons | Khi nào chọn |
|---|---|---|---|
| **A. Monolith Service** (Node/Java/.NET) | Simple, dev fast, deploy 1 unit, dễ debug | Scale theo single binary, blast radius lớn khi crash | MVP Phase 1, traffic <500 invoice/s |
| **B. Microservice** (Gateway + Workers + Adapters tách) | Scale từng phần, fault isolation, dễ swap | Dev overhead, infra phức tạp, observability đắt | Khi vol >2000/s và team >12 |
| **C. Serverless** (Lambda/CloudRun + queue) | Auto-scale, pay-per-use, không lo infra | Cold start, debugging khó, lock-in cloud | Traffic spike rất uneven, team nhỏ |

**Recommendation:** **Option A** cho Phase 1, kiến trúc module rõ để chuyển sang B khi cần.

**Multi-T-VAN abstraction strategy:**

| Strategy | Mô tả | Trade-off |
|---|---|---|
| **Adapter pattern** (recommended) | Interface `TVANAdapter` chung, implement riêng cho Hilo/Viettel/MISA | Dev cost vừa phải, dễ mở rộng |
| **Plugin (dynamic load)** | Adapter là package riêng load runtime | Overkill cho Phase 1, hữu ích Phase 4 marketplace |
| **Unified schema (canonical model)** | Define data model chung, mỗi T-VAN map vào model đó | Phải đầu tư schema design upfront, ROI cao về dài hạn |

**Recommendation:** Combine **Adapter + Canonical model**. Plugin defer Phase 4.

**Partnership models với Hilo:**

| Model | Mô tả | Phù hợp khi |
|---|---|---|
| Revenue share | Haravan trả Hilo % theo invoice volume | Long-term, scale lớn |
| Flat partner fee | Haravan trả 1 khoản cố định/tháng/merchant | Predictable cost, dễ pricing với merchant |
| Hybrid | Flat fee + variable theo bracket volume | Cân bằng cost & risk |

**Recommendation:** **Hybrid** với Hilo, tier 0-1k/1k-10k/10k+ invoice/tháng.

**Migration strategy** cho merchants đang dùng Haravan Invoice cũ: phased rollout 1% → 10% → 50% → 100% trong 6 tuần, dual-write period 30 ngày để verify consistency, feature flag system cho per-merchant control, rollback plan: 1 click revert flag + DB snapshot.

**Test data strategy:** sandbox MST test do Hilo cung cấp + 5 merchant friendly volunteer cho UAT thật. Tạo dataset 1000 hóa đơn variety (bình thường, edge case, sai sót) để regression test.

### DELIVER (tuần 6) — 7 deliverables chốt

**1. Architecture Decision Records (ADR)** — tối thiểu 5:

- **ADR-001**: Monolith Phase 1, modular để chuyển microservice. Owner: Tech Lead.
- **ADR-002**: Adapter + Canonical Model cho Multi-T-VAN. Owner: Tech Lead.
- **ADR-003**: Stack chính (vd: Node.js + TypeScript + Postgres + Redis + Kafka — chốt theo team familiarity). Owner: Tech Lead + CTO.
- **ADR-004**: Auth model giữa Haravan App ↔ Gateway (OAuth bearer + signed request). Owner: Tech Lead.
- **ADR-005**: Observability stack (OpenTelemetry + Grafana/Datadog + alert rules). Owner: Tech Lead.
- **ADR-006** (bonus): Idempotency strategy (idempotency-key header + Redis dedupe 24h). Owner: Backend lead.
- **ADR-007** (bonus): Compliance log retention 10 năm theo NĐ 123. Owner: Tech Lead + Legal.

Mỗi ADR theo format: Context / Decision / Consequences / Alternatives considered / Status.

**2. Partnership Agreement Draft với Hilo** (term sheet) — gồm: pricing model (Hybrid), SLA cam kết (uptime 99.9%, response time API p95 < 1s), data ownership, termination + migration assistance, exclusive period (negotiate 12 tháng), roadmap shared (notify nhau khi có breaking change).

**3. Research Report từ merchant interview** — top 10 insights với evidence quotes, persona deepdive, JTBD map, opportunity solution tree.

**4. Compliance Playbook** — mapping điều luật NĐ 123 / TT 78 / NĐ 70 / TT 32 vào feature backlog. Mỗi feature có flag "compliance-blocking" (phải có để launch) hay "compliance-optional".

**5. Phase 1 Backlog refined** — ≥30 stories đã estimate (story point + person-day), acceptance criteria viết theo Gherkin (Given/When/Then), priority MoSCoW.

**6. Risk Register** — ≥15 risks, mỗi risk: ID / description / probability (1-5) / impact (1-5) / score / owner / mitigation / trigger / fallback.

**7. Team Hiring Plan** — confirm 8-10 người baseline đủ cho Phase 1, plan tuyển ML engineer cho Phase 3 (start tuyển từ giữa Phase 2 vì lead time 2-3 tháng).

---

## Câu hỏi nghiên cứu phải trả lời được

1. **Hilo có cung cấp partner provisioning API không?** Nếu không: workaround = batch onboarding qua CSV upload + Hilo manual provision trong 24h.
2. **Webhook từ Hilo realtime hay polling?** Nếu polling: build polling service với cadence 5s cho status critical, 60s cho status non-critical.
3. **Khi CQT downtime, Hilo behavior?** Phải document rõ: Hilo queue local hay reject? Notification cho Haravan ra sao? Haravan UX hiển thị "đang chờ CQT" hay "lỗi"?
4. **Hilo rate limit có đủ cho merchant peak 1000 hóa đơn/phút?** Critical cho Black Friday / Tết. Negotiate burst tier với Hilo.
5. **Data export portability nếu Haravan muốn đổi T-VAN?** Phải có clause trong contract.
6. **Merchant Haravan đau nhất khâu nào trong invoice flow hiện tại?** Sẽ ra từ interview.
7. **Tỉ lệ F&B vs Retail vs B2B trong base Haravan?** Lấy từ internal data Haravan.
8. **% merchant phát hành >1000 hóa đơn/tháng?** Lấy từ Hilo data + Haravan data.

---

## Acceptance Criteria — Phase 0 exit

- [ ] Ký LOI hoặc partnership agreement với Hilo (đầy đủ điều khoản pricing, SLA, data, exclusive)
- [ ] Sandbox Hilo hoạt động: test thành công 5 nghiệp vụ cốt lõi (phát hành, thay thế, điều chỉnh, tra cứu, inbound)
- [ ] 20+ merchant interview hoàn thành, synthesis report approved
- [ ] 5+ ADR approved bởi Tech Lead và CTO
- [ ] Phase 1 backlog ≥30 stories refined + estimated
- [ ] Risk register ≥15 risks với owner + mitigation
- [ ] Compliance Playbook reviewed bởi external tax counsel
- [ ] Hiring plan confirmed với HR

---

## Deliverable timeline cụ thể

| Tuần | Milestone |
|---|---|
| 1 | Kickoff, sign NDA Hilo, start research, interview booking |
| 2 | Hoàn thành 70% interview, sandbox Hilo có quyền truy cập |
| 3 | Synthesis interview, viết HMW + assumption map, draft 2 ADR đầu |
| 4 | Brainstorm architecture options, prototype 2 adapter + 1 use case |
| 5 | Chốt ADR còn lại, draft partnership term sheet, refine backlog |
| 6 | Final review, approval ADR, ký LOI Hilo, Phase 1 Kickoff Brief |

---

## Risks & Mitigations (Phase 0 nội bộ)

| ID | Risk | Prob | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| P0-R1 | Hilo không cung cấp đủ API spec | 4 | 5 | NDA sớm, escalate qua exec sponsor | PM |
| P0-R2 | Merchant không chịu phỏng vấn | 3 | 4 | Voucher 500k Haravan, leverage CSM | Researcher |
| P0-R3 | Regulation thay đổi giữa Phase 0 | 2 | 5 | Subscribe news source thuế, weekly check | PM |
| P0-R4 | Team busy với BAU không tập trung | 3 | 4 | Carve-out time 70%, exec sponsor block calendar | Tech Lead |
| P0-R5 | Sandbox Hilo có bug / unstable | 3 | 3 | Daily smoke test, escalate | Backend |
| P0-R6 | Internal Haravan data khó access | 3 | 3 | Sponsor approval data access ngay tuần 1 | PM |
| P0-R7 | ADR không đạt consensus | 3 | 4 | RACI rõ, Tech Lead làm final tiebreaker | Tech Lead |

---

## Handoff to Phase 1 — "Phase 1 Kickoff Brief" template

Cuối Phase 0, output document `phase1_kickoff_brief.md` gồm:

1. **Validated problem statements** Phase 1 phải giải quyết (3-5 statements concise)
2. **Confirmed architecture** (link tới ADR-001 đến ADR-007)
3. **Hilo API contract version** đã agree với Hilo team
4. **Refined backlog** với top 30 stories prioritized
5. **Open questions / acceptable risks** Phase 1 sẽ address
6. **Dependencies** cần ready trước kickoff (sandbox stable, infra provisioned, design system)
7. **Team allocation** week-by-week cho 12 tuần Phase 1
8. **Success metrics** (latency baseline, error rate baseline, NPS baseline để measure later)
9. **Decision deferred** (vd: chốt provider e-sign cho Phase 3, defer)

---

## Checklist trước khi vào Phase 1

- [ ] Phase 1 Kickoff Brief approved bởi PM, Tech Lead, Head of Product
- [ ] Hiring offer cho 2 Backend còn thiếu (nếu có) đã gửi
- [ ] Sandbox Hilo + production credentials provisioned
- [ ] Repo skeleton + CI/CD pipeline set up (ưu tiên dùng template Haravan core)
- [ ] Design system Hara DS available cho Designer
- [ ] Slack channel + JIRA project khởi tạo
- [ ] Beta merchant pool (10-15 friendly merchants) đã commit tham gia Phase 1 testing
