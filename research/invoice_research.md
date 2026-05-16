## MASTER PROMPT (Context Anchor)

Master prompt này được dán vào đầu mọi session làm việc với AI, hoặc lưu thành system prompt/project knowledge. Đây là "single source of truth" về dự án.

```
# MASTER CONTEXT - HARAVAN INVOICE WRAPPER PROJECT

## Vai trò của bạn
Bạn là Senior Product Strategist kiêm Technical Architect, có 10+ năm kinh
nghiệm về fintech/SaaS B2B tại thị trường Việt Nam, đặc biệt am hiểu về:
- Hóa đơn điện tử Việt Nam (NĐ 123/2020, TT 78/2021, QĐ 1510/2022)
- Hệ sinh thái T-VAN (Hilo, Viettel, MISA, EFY, VNPT)
- E-commerce platform (Haravan, Shopify, Sapo, KiotViet)
- Product discovery framework (JTBD, Story Mapping, RICE, Double Diamond)

## Bối cảnh dự án
Haravan đang dùng Hilo làm T-VAN backend (whitelabel) cho sản phẩm Haravan
Invoice. Hiện trạng: Haravan chỉ chạy automation flow gọi API Hilo, UX hoàn
toàn do Hilo cung cấp. Mục tiêu: xây "App Portal Wrapper" để Haravan làm
chủ trải nghiệm, bổ sung tính năng đặc thù cho merchant Haravan, học hỏi
MISA meInvoice về AI và workflow, KHÔNG thay thế core của Hilo mà gọi API.

## Kiến trúc tổng thể đã chốt
- Tầng 1 (Hilo Core): giữ nguyên, T-VAN pháp lý, ký số, truyền nhận CQT
- Tầng 2 (Haravan Invoice Gateway): proxy + orchestrator do Haravan sở hữu
- Tầng 3 (Metadata DB): Haravan lưu mapping, audit, customer link
- Tầng 4 (Portal UI): nhúng trong Haravan Admin, design system Haravan
- Tầng 5 (AI/Intelligence Layer): LLM-based, phủ trên data Hilo

## Roadmap 4 phase đã thống nhất
- Phase 0: Foundation & Discovery (4-6 tuần)
- Phase 1: Parity & Foundation (3 tháng) - Theme: Sở hữu lại trải nghiệm
- Phase 2: Differentiation (3-4 tháng) - Theme: Lý do để chọn Haravan
- Phase 3: Intelligence (4-5 tháng) - Theme: AI biến hóa đơn thành insight
- Phase 4: Platform & Ecosystem (3-4 tháng) - Theme: Nền tảng mở

## Persona chính
- Owner/Chủ shop: ra quyết định, xem dashboard, lo compliance
- Kế toán: xử lý nghiệp vụ sai sót, đối soát, báo cáo thuế
- Thu ngân/NV bán: phát hành nhanh tại POS, không muốn bị chậm
- Khách hàng cuối (B2C/B2B): nhận hóa đơn, tra cứu

## Top RICE Features (đã đánh giá)
1. Phát hành 1-click POS/Web (68.400)
2. Auto-fill MST từ Customer Profile (57.600)
3. UI portal Haravan Admin (36.000)
4. Compliance Center (36.000)
5. Dashboard omnichannel (36.300)
6. Gộp đơn lẻ cuối ngày (34.000)
7. Wizard xử lý sai sót (33.600)
8. AI cảnh báo rủi ro NCC (28.000)
9. Gateway service (25.300)
10. AI tiền-kiểm (25.200)

## Ràng buộc và nguyên tắc
- KHÔNG reimplement T-VAN function của Hilo
- KHÔNG lưu XML pháp lý tại Haravan (chỉ metadata)
- TUÂN THỦ tuyệt đối NĐ 123, TT 78, QĐ 1510
- THIẾT KẾ multi-T-VAN abstraction từ đầu (tránh lock-in Hilo)
- ƯU TIÊN ngôn ngữ Việt cho UI, technical docs có thể tiếng Anh
- TEAM 8-10 người: 1 PM, 1 Tech Lead, 3-4 BE, 2 FE, 1 Designer, 1 QA,
  +1-2 ML từ Phase 3

## Framework bắt buộc dùng
Mỗi phase plan PHẢI áp dụng Double Diamond:
- DISCOVER: Research rộng, hiểu vấn đề, không kết luận sớm
- DEFINE: Hội tụ vấn đề, viết problem statement rõ ràng
- DEVELOP: Brainstorm giải pháp rộng, prototype, không cam kết
- DELIVER: Hội tụ giải pháp, plan triển khai chi tiết

## Output format chung
Mọi deliverable phải có:
- Executive Summary (5-7 dòng)
- Discover findings với evidence
- Define problem statements (How Might We)
- Develop solution options với pros/cons
- Deliver plan với timeline, owner, metric
- Risks & Mitigations
- Handoff to next phase (assumptions, dependencies, open questions)

## Ngôn ngữ
Trả lời tiếng Việt. Thuật ngữ kỹ thuật giữ tiếng Anh nếu phổ biến hơn
(API, webhook, idempotency, T-VAN...). Tránh viết quá dài, ưu tiên prose
tự nhiên, dùng bảng và bullet khi thực sự cần thiết.

## Khi tôi gọi phase prompt
Tôi sẽ gửi 1 trong các phase prompt (Phase 0-4) hoặc Audit Prompt. Bạn
PHẢI tham chiếu lại Master Context này, kiểm tra tính nhất quán, và flag
nếu có conflict với các phase trước.

---
Xác nhận đã nhận context bằng 1 câu, sau đó chờ phase prompt từ tôi.
```

---

## PHASE 0 PROMPT - Foundation & Discovery

```
# PHASE 0 PLAN - Foundation & Discovery
Tham chiếu: Master Context (đã load ở trên)
Thời lượng: 4-6 tuần | Team: 4-5 người (PM, Tech Lead, 1 BE, 1 Designer, 1 Researcher)

## Mục tiêu phase
Đặt nền móng pháp lý, kỹ thuật, và customer insight TRƯỚC khi build. Tránh
build sai do thiếu hiểu biết Hilo API hoặc merchant pain point thật.

## Yêu cầu áp dụng Double Diamond

### DIAMOND 1 - PROBLEM SPACE

**DISCOVER (tuần 1-2):**
Hãy nghiên cứu và liệt kê những điều cần khám phá:
1. Hilo API surface: endpoint nào có sẵn, rate limit, auth model, webhook,
   sandbox, partner provisioning, SLA, pricing cho high-volume merchants
2. Compliance landscape: NĐ 123, TT 78, QĐ 1510, các thay đổi 2024-2026,
   các pending regulation có thể ảnh hưởng
3. Merchant research: phỏng vấn 20-30 merchants Haravan đa segment (F&B,
   fashion, electronics, B2B, marketplace seller) - hỏi gì cụ thể?
4. Internal audit: Haravan có touchpoint nào liên quan invoice (Order,
   Customer, POS, Payment, Shipping, Loyalty)? Data nào có thể leverage?
5. Competitor deep-dive: MISA meInvoice, Viettel SInvoice, EFY-eINVOICE,
   VNPT Invoice - tính năng nào merchant Haravan ghen tị?

Đề xuất phương pháp research cụ thể cho từng mục (interview script,
API exploration plan, document review checklist).

**DEFINE (tuần 3):**
Sau Discover, viết:
- 5-7 "How Might We" statements ưu tiên cao nhất
- Validated assumptions vs Invalidated assumptions
- Top 3 risk areas cần mitigate trước khi build
- Constraint map (legal, technical, commercial, organizational)

### DIAMOND 2 - SOLUTION SPACE

**DEVELOP (tuần 4-5):**
Brainstorm:
- 3 kiến trúc Gateway alternatives (vd: monolith vs microservice vs
  serverless), so sánh trade-off
- 2-3 abstraction strategy cho multi-T-VAN (adapter pattern, plugin,
  unified schema)
- Partnership models với Hilo (revenue share, flat fee, hybrid)
- Migration strategy cho merchants đang dùng Haravan Invoice hiện tại
- Test data strategy (sandbox MST, dummy invoice volume)

**DELIVER (tuần 6):**
Output cuối phase:
1. **Architecture Decision Records (ADR)** - tối thiểu 5 ADR chốt các
   quyết định kỹ thuật lớn
2. **Partnership Agreement Draft** với Hilo (term sheet)
3. **Research Report** từ merchant interview với top 10 insights và
   evidence quotes
4. **Compliance Playbook** - mapping điều luật vào tính năng
5. **Phase 1 Backlog** đã refined với acceptance criteria
6. **Risk Register** với mitigation plan
7. **Team Hiring Plan** nếu cần thêm người

## Câu hỏi nghiên cứu cụ thể bạn phải trả lời
1. Hilo có cung cấp partner provisioning API không? Nếu không, workaround?
2. Webhook từ Hilo có realtime không hay phải polling?
3. Khi CQT downtime, Hilo behavior thế nào? Haravan phải xử lý gì?
4. Hilo rate limit có đủ cho merchant peak 1000 hóa đơn/phút không?
5. Data export/portability nếu Haravan muốn đổi T-VAN sau này?
6. Merchant Haravan đang đau nhất ở khâu nào trong invoice flow hiện tại?
7. Tỉ lệ merchants F&B vs Retail vs B2B trong base Haravan?
8. Có bao nhiêu % merchants đang phát hành >1000 hóa đơn/tháng?

## Acceptance Criteria của Phase 0
- [ ] Ký được partnership agreement (hoặc LOI) với Hilo
- [ ] Sandbox Hilo hoạt động, test được 5 nghiệp vụ cốt lõi
- [ ] 20+ merchant interview hoàn thành với synthesis report
- [ ] 5+ ADR được approve bởi Tech Lead và CTO
- [ ] Phase 1 backlog có >= 30 stories đã refined, estimated
- [ ] Risk register có >= 15 risks identified

## Handoff to Phase 1
Cuối Phase 0, output 1 document "Phase 1 Kickoff Brief" gồm:
- Validated problem statements để Phase 1 giải quyết
- Confirmed architecture để Phase 1 build
- Open questions còn lại (acceptable risks)
- Dependencies cần ready trước khi Phase 1 start

---
Hãy soạn plan Phase 0 chi tiết theo cấu trúc trên. Output tối đa 3000 từ,
ưu tiên độ sâu hơn độ rộng. Nếu cần thông tin thực tế (vd: API spec Hilo),
hãy gọi search/crawler tool trước khi viết plan.
```

---

## PHASE 1 PROMPT - Parity & Foundation

```
# PHASE 1 PLAN - Parity & Foundation
Tham chiếu: Master Context + Phase 0 Kickoff Brief
Thời lượng: 3 tháng | Team: 8 người full squad
Theme: "Sở hữu lại trải nghiệm mà không mất tính năng hiện có"

## Mục tiêu phase
Migration toàn bộ traffic Haravan Invoice hiện tại qua Gateway của Haravan.
Replace UI Hilo embed bằng portal Haravan-native. Đạt parity tuyệt đối,
không tạo gap chức năng so với trạng thái cũ.

## Pre-requisite từ Phase 0
- Sandbox Hilo + Partnership agreement đã có
- Architecture đã chốt qua ADR
- Phase 1 backlog đã refined

## Yêu cầu áp dụng Double Diamond

### DIAMOND 1 - PROBLEM SPACE

**DISCOVER (tuần 1-2):**
Nghiên cứu sâu các vấn đề migration:
1. Current state mapping: từng touchpoint Haravan Invoice hiện tại đang
   gọi Hilo như thế nào, qua channel nào (direct API, embed iframe,
   redirect)
2. Edge cases inventory: list tất cả corner cases hiện tại merchants gặp
   (vd: hóa đơn pending, retry sau timeout, ký số fail, CQT từ chối)
3. User behavior data: phân tích log/analytics flow phát hành hiện tại,
   xác định bottleneck UX
4. Risk assessment migration: merchants nào sẽ bị ảnh hưởng nếu migration
   sai, plan rollback thế nào
5. Compliance verification: portal mới có đáp ứng đủ yêu cầu T-VAN không
   (lưu trữ, audit trail, traceability)

**DEFINE (tuần 3):**
- Problem statement: "Làm sao migrate 80k merchants sang Gateway mới mà
  không gây downtime, không tăng error rate, không giảm trải nghiệm"
- Định nghĩa "parity" rõ ràng: feature checklist phải match 100% với
  Haravan Invoice cũ
- Success criteria measurable: latency, error rate, NPS, ticket volume
- Out-of-scope: tính năng mới (để Phase 2 làm)

### DIAMOND 2 - SOLUTION SPACE

**DEVELOP (tuần 4-8):**
Thiết kế chi tiết:
1. **Gateway service design**
   - API contract Haravan ↔ Gateway
   - API mapping Gateway ↔ Hilo
   - Retry policy, idempotency key, circuit breaker
   - Caching strategy (đặc biệt cho tra cứu)
   - Observability (logs, metrics, traces)
   - Security (token rotation, encryption at rest/transit)

2. **Portal UI design**
   - IA (information architecture) của portal mới
   - User flow cho 5 use case chính: phát hành đơn lẻ, phát hành từ POS,
     tra cứu, điều chỉnh, hủy
   - Component library kế thừa Haravan design system
   - Responsive cho mobile (POS thường dùng tablet)

3. **Migration strategy**
   - Phased rollout: 1% → 10% → 50% → 100% merchants
   - Feature flag system
   - Dual-write period để verify data consistency
   - Rollback plan cụ thể với trigger criteria

4. **Compliance Center MVP**
   - Audit trail mọi thao tác
   - Notification system cho law updates
   - Backup/restore strategy

**DELIVER (tuần 9-12):**
Triển khai và launch:
- Week 9-10: Code freeze cho features, focus testing
- Week 11: Beta với 5-10 merchants friendly
- Week 12: Rollout theo phased plan
- Continuous: hotfix, monitoring, support

## Câu hỏi nghiên cứu cụ thể
1. Hiện có bao nhiêu integration point giữa Haravan và Hilo? List đầy đủ.
2. Volume hóa đơn peak/avg hiện tại là bao nhiêu? Pattern theo ngày/tháng?
3. Top 10 reasons merchants liên hệ support về invoice hiện tại?
4. SLA cam kết với merchants hiện tại là gì? Portal mới có giữ được?
5. Có merchant enterprise nào dùng API custom không? Cần backward compat?

## Deliverables cụ thể của Phase 1
1. **Gateway service production** với 99.9% uptime SLA
2. **Portal UI v1.0** thay thế hoàn toàn UI cũ
3. **Migration completion report** với metrics so sánh trước/sau
4. **Operations runbook** cho team support
5. **Compliance audit report** xác nhận đủ chuẩn T-VAN
6. **Phase 2 Kickoff Brief**

## Success Metrics (Exit Criteria)
- [ ] 100% volume hóa đơn qua Gateway
- [ ] Latency p95 < 3s cho phát hành
- [ ] Error rate < 0.5% (matching hoặc tốt hơn baseline)
- [ ] NPS portal mới >= NPS cũ (không giảm)
- [ ] 80% merchants migrated trong 6 tuần
- [ ] Zero data inconsistency vs Hilo trong 30 ngày
- [ ] Support ticket parity gap = 0

## Risks & Mitigations
Phải identify ít nhất 10 risks. Ví dụ:
- Hilo API thay đổi đột ngột → Versioning strategy + Hilo SLA
- Migration gây downtime → Phased rollout + feature flag
- Merchant complaint UI mới → Beta + user testing trước
- Data inconsistency → Dual-write + reconciliation job

## Handoff to Phase 2
Cuối phase output "Phase 2 Kickoff Brief" gồm:
- Performance baseline đã đo được
- Architectural debt cần address
- Learnings từ merchant feedback
- Differentiation opportunities prioritized

---
Hãy soạn plan Phase 1 chi tiết. Trước khi viết, hãy CHECK xem có conflict
nào với Master Context và Phase 0 output không. Nếu Phase 0 chưa có
output, hãy giả định reasonable defaults và flag rõ assumption.
```

---

## PHASE 2 PROMPT - Differentiation

```
# PHASE 2 PLAN - Differentiation
Tham chiếu: Master Context + Phase 1 Kickoff Brief
Thời lượng: 3-4 tháng | Team: 8-10 người
Theme: "Tạo lý do để merchant chọn Haravan Invoice thay vì T-VAN khác"

## Mục tiêu phase
Build các tính năng tận dụng hệ sinh thái Haravan mà T-VAN độc lập (kể cả
MISA) không làm được: Customer Profile, Omnichannel data, HaraSocial, POS
flow đặc thù F&B/Retail.

## Pre-requisite từ Phase 1
- Gateway stable, có capacity dư để build feature
- Portal UI framework sẵn để mở rộng module
- Merchant feedback từ Phase 1 đã được synthesize

## Yêu cầu áp dụng Double Diamond

### DIAMOND 1 - PROBLEM SPACE

**DISCOVER (tuần 1-3):**
1. Segment deep-dive: F&B, Fashion Retail, B2C E-commerce, B2B Wholesale,
   Marketplace Seller - mỗi segment có pain point gì đặc thù với invoice?
2. Competitive feature audit: MISA, Viettel, EFY có tính năng gì merchant
   ghen tị? Tại sao Haravan có lợi thế hơn khi build?
3. Haravan asset audit: Customer Profile có field MST không, tỉ lệ
   filled? HaraSocial Zalo OA có active không? POS data nào có thể dùng?
4. Workflow shadowing: ngồi cạnh 5-10 merchants 1 ngày để thấy real flow
5. Data analysis: từ Phase 1 logs, đâu là top 5 friction points?

**DEFINE (tuần 4):**
- 5-7 problem statements cụ thể cho từng segment
- Prioritization: tính năng nào ROI cao nhất theo RICE recompute
- Scope boundary: rõ ràng feature nào in/out
- Success criteria: định lượng cho từng feature (adoption, retention)

### DIAMOND 2 - SOLUTION SPACE

**DEVELOP (tuần 5-10):**
Thiết kế từng tính năng:

1. **Auto-fill MST từ Customer Profile**
   - Schema sync giữa Customer DB và Invoice
   - UX khi MST chưa có (prompt nhập, validate format)
   - Tích hợp tra cứu doanh nghiệp qua API CQT

2. **Gộp đơn lẻ cuối ngày (TT78)**
   - Rule engine: tiêu chí gộp (cùng ngày, không có MST, dưới ngưỡng)
   - Scheduling: chạy lúc nào, có cho phép manual override không
   - Reporting: merchant xem được đơn nào đã gộp vào hóa đơn nào

3. **Dashboard Omnichannel**
   - Data model: union doanh thu từ POS, Web, Marketplace, COD
   - Widget design: doanh thu vs hóa đơn theo kênh/chi nhánh/sản phẩm
   - Drill-down: từ chart → list hóa đơn → detail

4. **Zalo OA Invoice Delivery**
   - Tích hợp HaraSocial API
   - Template message với CTA tải hóa đơn
   - Tracking: đã nhận, đã mở, đã tải

5. **Wizard xử lý sai sót**
   - Decision tree: hỏi gì, dẫn đến nghiệp vụ nào (điều chỉnh/thay thế/hủy)
   - Auto-generate biên bản điều chỉnh
   - E-signature flow cho khách ký

6. **Bulk Operations**
   - UI bảng với filter, multi-select
   - Background job queue cho bulk action
   - Progress tracking, error report

7. **COD Hoàn trả Auto-handling**
   - Sync với shipping integration (GHN, GHTK, AhaMove)
   - Rule: khi đơn refund → auto tạo điều chỉnh giảm

8. **Tách/Gộp bill F&B**
   - UX trên Haravan POS cho restaurant
   - Logic chia tiền (đều, theo món, theo người)

**DELIVER (tuần 11-16):**
- Release theo batch: 2-3 features mỗi 2 tuần
- A/B test với % merchants
- Marketing campaign kèm release
- Customer education materials

## Câu hỏi nghiên cứu cụ thể
1. Tỉ lệ Customer Profile có MST hiện tại là bao nhiêu? Cần campaign fill?
2. Quy định TT78 về gộp đơn lẻ chính xác như nào? Edge case?
3. Haravan POS bao nhiêu % là F&B vs Retail?
4. HaraSocial Zalo OA penetration trong merchant base?
5. Top 5 reasons merchants điều chỉnh hóa đơn hiện tại?

## Deliverables
1. 8 features production-ready với documentation
2. **Adoption playbook**: cách roll out, educate merchants
3. **Case studies**: ít nhất 5 merchants thật chia sẻ giá trị
4. **Competitive positioning doc**: so sánh với MISA, Viettel
5. **Phase 3 Kickoff Brief**

## Success Metrics (Exit Criteria)
- [ ] Auto-fill MST adoption >= 60%
- [ ] Gộp đơn cuối ngày adoption >= 40% trong segment retail
- [ ] Dashboard omnichannel DAU >= 30% owners
- [ ] Zalo OA delivery adoption >= 50%
- [ ] Wizard sai sót giảm 50% thời gian xử lý
- [ ] NPS tăng 15+ điểm so với baseline Phase 1
- [ ] Churn rate giảm 30% so với baseline
- [ ] 5+ case studies merchants chuyển từ T-VAN khác sang

## Risks & Mitigations
- Feature creep do scope không rõ → Strict prioritization gate
- Adoption thấp do merchants không biết → Marketing + in-app onboarding
- Integration HaraSocial/POS phức tạp → Cross-team sync sớm

## Handoff to Phase 3
Output "Phase 3 Kickoff Brief":
- Data foundation cho AI: data nào đã clean, đã accessible
- AI use case validated từ merchant feedback
- ML infrastructure needs

---
Soạn plan Phase 2 chi tiết. Check consistency với Master + Phase 0/1.
Nếu có RICE score change so với assessment ban đầu, justify rõ.
```

---

## PHASE 3 PROMPT - Intelligence

```
# PHASE 3 PLAN - Intelligence (AI Layer)
Tham chiếu: Master Context + Phase 2 Kickoff Brief
Thời lượng: 4-5 tháng | Team: 10-12 người (+1-2 ML Engineer)
Theme: "AI biến hóa đơn từ chi phí thành insight"

## Mục tiêu phase
Cạnh tranh trực diện với MISA AVA trên những điểm mạnh nhất của họ:
AI tiền-kiểm, AI cảnh báo NCC, Inbound AI, AI hạch toán. Tận dụng LLM
và data Haravan để tạo intelligence không T-VAN khác có.

## Pre-requisite từ Phase 2
- Data foundation đã sẵn (Customer Profile, Order, Invoice metadata)
- Merchants đã trust portal Haravan Invoice
- ML infrastructure được set up (training pipeline, inference, monitoring)

## Yêu cầu áp dụng Double Diamond

### DIAMOND 1 - PROBLEM SPACE

**DISCOVER (tuần 1-4):**
1. AI feasibility study: dùng LLM (Claude, GPT) hay tự train? Cost vs
   accuracy trade-off
2. MISA AVA reverse-engineering: AVA làm gì cụ thể, signal nào, output
   format nào (qua user testing, public docs)
3. Data quality audit: data Haravan đủ chất lượng để train chưa? Cần
   labeling không?
4. Compliance for AI: NĐ về AI trong tài chính, audit yêu cầu giải thích
   được quyết định AI
5. Merchant trust research: merchants có sẵn sàng cho AI tự động hạch
   toán không, hay chỉ muốn AI gợi ý?
6. Risk modeling NCC: data nào (từ CQT, từ pattern lịch sử) báo hiệu rủi
   ro? Định nghĩa "rủi ro" thế nào?

**DEFINE (tuần 5):**
- Problem statement cho từng AI feature
- AI safety boundaries: feature nào AI auto, feature nào AI gợi ý người
  quyết
- Accuracy target cho từng model
- Explainability requirement
- Fallback strategy khi AI fail

### DIAMOND 2 - SOLUTION SPACE

**DEVELOP (tuần 6-14):**
Thiết kế từng AI feature:

1. **AI Tiền-kiểm trước phát hành**
   - Rule-based + ML hybrid
   - Check: MST format, doanh nghiệp đang hoạt động, thuế suất hợp lý,
     completeness của các trường
   - UX: warning inline trước khi gọi Hilo API
   - Learning: từ Hilo rejection feedback

2. **AI Cảnh báo Rủi ro NCC**
   - Data source: CQT public lookup, lịch sử hóa đơn merchant
   - Signal: NCC ngừng hoạt động, MST chuyển trạng thái, pattern bất
     thường (volume tăng đột biến, giá trị bất thường)
   - Output: risk score + explain reasons
   - Action: cảnh báo merchant trước khi ghi nhận

3. **Inbound Invoice Module**
   - Auto-fetch từ Hilo Inbound API
   - OCR backup cho hóa đơn giấy (nếu cần)
   - AI phân loại theo nhóm chi phí (nguyên liệu, marketing, văn phòng...)
   - AI đối soát với Purchase Order trong Haravan
   - AI gợi ý hạch toán

4. **AI Phân tích Biến động Chi phí**
   - So sánh kỳ này vs kỳ trước
   - Phát hiện anomaly
   - Gợi ý hành động (vd: chi phí marketing tăng 40% trong khi doanh thu
     không tăng tương ứng)

5. **E-signature cho Biên bản Điều chỉnh**
   - Integration với e-sign provider (FPT, MISA, Viettel)
   - Workflow: tạo biên bản → gửi khách → khách ký → lưu trữ

**DELIVER (tuần 15-20):**
- Soft launch AI feature từng cái một
- Shadow mode trước (AI chạy ngầm, so sánh với human decision)
- Beta với power users
- Public rollout với A/B test
- Continuous learning: feedback loop từ user correction

## Câu hỏi nghiên cứu cụ thể
1. LLM nào phù hợp cho Vietnamese fintech context? Claude vs GPT vs local?
2. Cost per inference budget thế nào? Có scale được không?
3. AI accuracy minimum để launch là bao nhiêu? Phụ thuộc use case?
4. Có cần data labeling pipeline không? Outsource hay in-house?
5. Compliance: AI decision có cần audit log đặc biệt không?

## Deliverables
1. 5 AI features production với monitoring
2. **ML Ops playbook**: training, deployment, monitoring, retraining
3. **AI Explainability Doc**: mỗi quyết định AI giải thích được
4. **Accuracy report**: metrics theo thời gian
5. **Cost analysis**: cost per inference vs value created
6. **Phase 4 Kickoff Brief**

## Success Metrics (Exit Criteria)
- [ ] AI tiền-kiểm giảm 70% hóa đơn phát hành lỗi
- [ ] AI accuracy >= 92% trên test set thực tế
- [ ] Inbound module adoption >= 50% merchants có >50 NCC
- [ ] AI hạch toán adoption >= 30% kế toán
- [ ] Time-to-process hóa đơn đầu vào giảm 80%
- [ ] Zero AI compliance incident
- [ ] AI feature contributing to >= 20% NPS uplift

## Risks & Mitigations
- AI hallucination → Strict guardrails, human-in-the-loop
- Compliance risk → Legal review trước launch, audit log đầy đủ
- Cost vượt budget → Cost monitor + cache + smaller model fallback
- Merchant distrust → Explainability + opt-in mode
- Data privacy → On-premise option cho enterprise

## Handoff to Phase 4
Output "Phase 4 Kickoff Brief":
- AI capability đã build có thể expose qua API/SDK chưa
- Platform readiness assessment
- Ecosystem partner candidate list

---
Soạn plan Phase 3 chi tiết. Đặc biệt chú ý AI safety và compliance vì đây
là area sensitive nhất. Flag mọi assumption về data availability.
```

---

## PHASE 4 PROMPT - Platform & Ecosystem

```
# PHASE 4 PLAN - Platform & Ecosystem
Tham chiếu: Master Context + Phase 3 Kickoff Brief
Thời lượng: 3-4 tháng | Team: 10-12 người
Theme: "Biến Haravan Invoice thành nền tảng mở"

## Mục tiêu phase
Mở rộng từ product thành platform: cho merchants tự dev, cho partner cắm
vào, cho enterprise chọn multi-T-VAN. Tạo network effect bền vững.

## Pre-requisite từ Phase 3
- Core product + AI đã mature, churn thấp
- Có signal từ enterprise/power users muốn customize
- Engineering capacity dư để build platform

## Yêu cầu áp dụng Double Diamond

### DIAMOND 1 - PROBLEM SPACE

**DISCOVER (tuần 1-3):**
1. Enterprise needs: phỏng vấn top 20 merchants enterprise về unmet needs
2. Developer survey: dev team Haravan merchants muốn API gì
3. Partner landscape: phần mềm kế toán Việt (MISA SME, Fast, Bravo)
   muốn tích hợp không
4. Multi-T-VAN demand: bao nhiêu enterprise đang dùng nhiều T-VAN parallel
5. Automation use cases: pattern automation phổ biến để build Automation
   Builder

**DEFINE (tuần 4):**
- Platform vision statement
- Partner program structure
- Pricing model cho platform tier
- Governance: API versioning, deprecation policy, SLA tier

### DIAMOND 2 - SOLUTION SPACE

**DEVELOP (tuần 5-12):**
1. **AI Copilot Chat**
   - LLM-based, context-aware
   - Trả lời query về data của chính merchant
   - Action: gợi ý + thực thi với confirmation

2. **Automation Builder (No-code)**
   - Trigger: order created, payment received, refund, schedule
   - Action: phát hành, gộp, gửi, điều chỉnh
   - UI: drag-drop flow như Zapier

3. **Custom Dashboard với Widget**
   - Library widget: chart, table, KPI card
   - Save/share dashboard template

4. **Public API & Webhook**
   - REST API documentation portal
   - OAuth 2.0 cho 3rd party app
   - Rate limiting tier theo plan
   - SDK: JavaScript, PHP, Python

5. **Multi-T-VAN Abstraction**
   - Adapter pattern: ngoài Hilo có thể plug Viettel, MISA, EFY
   - Migration tool giữa T-VAN
   - Failover automatic

6. **Partner Marketplace**
   - Onboarding flow cho partner developer
   - App review process
   - Revenue share model

**DELIVER (tuần 13-16):**
- Developer Preview với 10-20 partners
- Public beta
- Marketing: developer conference, hackathon
- Documentation portal launch

## Câu hỏi nghiên cứu cụ thể
1. Bao nhiêu merchants có in-house dev team đủ năng lực dùng API?
2. Pricing model nào partner ecosystem (% revenue, listing fee, free)?
3. Multi-T-VAN có conflict legal không? Một merchant dùng nhiều T-VAN OK?
4. Security model cho 3rd party app access merchant data?
5. Có cần phân biệt tier API (free/pro/enterprise) không?

## Deliverables
1. Platform features production
2. **Developer Portal** với docs, sandbox, examples
3. **Partner Program** với 5+ launching partners
4. **Multi-T-VAN tested** với ít nhất 1 alternative active
5. **Platform pricing & packaging**
6. **Long-term roadmap** post-Phase 4

## Success Metrics (Exit Criteria)
- [ ] 20% enterprise merchants dùng Public API
- [ ] 10% merchants dùng Automation Builder
- [ ] 5+ partner apps trên marketplace với active install
- [ ] 1+ enterprise dùng multi-T-VAN successfully
- [ ] Developer NPS >= 50
- [ ] Platform revenue contributing >= 15% tổng revenue invoice product

## Risks & Mitigations
- Platform complexity hurt core UX → Strict guardrails
- Partner low quality → Review process strict
- API abuse → Rate limit + monitoring
- Multi-T-VAN compliance gray area → Legal sign-off

## Handoff to BAU (Business As Usual)
Cuối Phase 4, sản phẩm vào maintenance + iterate mode:
- Quarterly roadmap process
- Partner program operating model
- Continuous improvement framework

---
Soạn plan Phase 4 chi tiết. Đặc biệt validate market demand cho platform
features vì đây là bet dài hạn, nếu market chưa sẵn sàng có thể defer.
```

---

## AUDIT PROMPT - Consistency Check

```
# AUDIT PROMPT - Cross-Phase Consistency Check

## Mục đích
Sau khi đã chạy Phase 0-4 prompts và có 5 phase plans, prompt này dùng để
audit tổng thể: kiểm tra nhất quán, phát hiện gap, conflict, redundancy,
và đề xuất chỉnh sửa.

## Input cho prompt
1. Master Context (bản đã chốt)
2. Phase 0 plan output
3. Phase 1 plan output
4. Phase 2 plan output
5. Phase 3 plan output
6. Phase 4 plan output

## Yêu cầu Audit theo các dimension

### 1. Strategic Consistency
- Mỗi phase có align với theme tổng thể không?
- Tổng các phase có deliver được vision dự án không?
- Có phase nào lệch khỏi MVP-first principle không?

### 2. Architectural Consistency
- ADR ở Phase 0 có được respect ở Phase 1-4 không?
- Có tech debt nào tạo ở phase trước không được address ở phase sau?
- Multi-T-VAN abstraction có thật sự thiết kế từ đầu không?
- Database schema có evolve hợp lý không?

### 3. Feature Consistency
- RICE priority từ master có được respect không?
- Có feature nào xuất hiện 2 phase mà không clear ownership?
- Có dependency giữa features không được mô hình hóa?
- Feature nào đáng lẽ phải làm sớm hơn nhưng bị xếp muộn (hoặc ngược lại)?

### 4. Resource & Timeline Consistency
- Tổng person-month có khớp với capacity team 8-10 người không?
- Ramp-up team (vd: ML engineer Phase 3) có realistic không?
- Có phase nào overload hoặc underload không?
- Buffer cho rework có đủ không?

### 5. Risk Consistency
- Risk từ phase trước có được carry forward và monitor không?
- Có risk mới ở phase sau làm invalidate plan phase trước không?
- Mitigation plan có ai own không?

### 6. Metric Consistency
- KPI có chain hợp lý không (vd: NPS Phase 1 → Phase 2 → Phase 3 đo cùng
  cách không)?
- Success criteria có measurable thật không hay vague?
- Baseline có set rõ không?

### 7. Compliance Consistency
- Mọi phase có compliance check với NĐ 123, TT 78, QĐ 1510 không?
- AI compliance (Phase 3) có conflict với T-VAN role không?
- Data privacy có consistent không?

### 8. Handoff Quality
- Mỗi Kickoff Brief có đủ info để phase sau start không?
- Có assumption nào ở phase sau invalidate khi phase trước xong không?
- Decision deferred có được track không?

## Output Format

### Section A: Executive Summary
- Overall consistency score (1-10)
- Top 3 strengths
- Top 5 issues cần address

### Section B: Issue List (chi tiết)
Mỗi issue gồm:
- Issue ID
- Type (Strategic/Architectural/Feature/Resource/Risk/Metric/Compliance/Handoff)
- Severity (Critical/High/Medium/Low)
- Description
- Affected phases
- Recommended fix
- Estimated effort to fix

### Section C: Conflict Map
- List các điểm conflict giữa phase với nhau
- Đề xuất resolution

### Section D: Gap Analysis
- Tính năng/yêu cầu nào trong Master Context chưa được cover
- Phase nào nên cover

### Section E: Optimization Suggestions
- Tính năng có thể defer
- Tính năng có thể accelerate
- Resource reallocation đề xuất

### Section F: Final Recommendations
- Có nên proceed với plan hiện tại không?
- Cần revise phase nào trước khi kickoff?
- Stakeholder approval cần ai trước khi go-live?

## Nguyên tắc Audit
- Critical thinking: không assume plan đúng, challenge mọi assumption
- Evidence-based: mọi issue phải point đến phần cụ thể trong plan
- Constructive: mỗi issue phải đi kèm fix suggestion
- Holistic: nhìn tổng thể không chỉ từng phase riêng lẻ

---
Đọc kỹ toàn bộ Master Context + 5 phase plans. Output audit report theo
format trên. Không ngại flag issue lớn nếu thấy plan có vấn đề structural.
Target output: 2500-4000 từ, ưu tiên insight hơn liệt kê.
```

---

## Hướng dẫn sử dụng bộ prompt

Quy trình khuyến nghị để bộ prompt này hoạt động hiệu quả nhất:

Bước 1, set up Master Context. Dán Master Prompt vào project knowledge của Claude/ChatGPT, hoặc lưu thành document share cho cả team. Đảm bảo mọi người trong dự án đều reference cùng một Master Context, tránh drift.

Bước 2, chạy Phase 0 prompt. Gửi Phase 0 prompt vào session đã có Master Context. AI sẽ output Phase 0 plan. Review plan với stakeholders (CTO, Head of Product, Legal), chỉnh sửa nếu cần, chốt phiên bản final. Lưu Phase 0 Kickoff Brief thành document riêng.

Bước 3, chạy Phase 1 prompt sau khi Phase 0 thực thi xong (hoặc ít nhất có draft Kickoff Brief). Lý tưởng là Phase 0 đã có data thật từ merchant interview để feed vào Phase 1. Tương tự cho Phase 2, 3, 4.

Bước 4, định kỳ chạy Audit Prompt. Khuyến nghị chạy audit ít nhất 2 lần: lần 1 sau khi có draft tất cả 5 phase plans (để align trước khi execute), lần 2 giữa Phase 2 (để verify plan vẫn relevant với reality). Audit giữa các phase giúp catch drift sớm.

Bước 5, version control. Mỗi lần update Master Context hoặc phase plan, bump version (v1.0, v1.1...) và log change. Phase plans cũ giữ lại để reference, không xóa. Khi conflict, version mới hơn thắng nhưng phải justify trong audit log.

Tips để prompt chạy hiệu quả: trước mỗi phase prompt, refresh AI bằng cách paste lại Master Context + Kickoff Brief từ phase trước. Nếu output AI quá generic, hãy challenge bằng câu hỏi cụ thể ("Bạn vừa nói AI tiền-kiểm dùng rule-based + ML, hãy chi tiết hóa rule nào dùng cho MST validation"). Yêu cầu AI gọi search tool khi cần data thực tế (vd: Hilo API spec, MISA AVA capability mới), không để AI bịa.
