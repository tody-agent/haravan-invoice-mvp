# 03 — PHASE 2 PLAN: Differentiation
**Tham chiếu:** Master Context v1.0 + Phase 1 Kickoff Brief
**Thời lượng:** 3-4 tháng (14-16 tuần) · **Team:** 8-10 người
**Theme:** *"Tạo lý do để merchant chọn Haravan Invoice thay vì T-VAN khác"*

---

## Executive Summary

Phase 2 chuyển từ "parity với Hilo" sang "vượt T-VAN truyền thống". 8 feature chiến lược tận dụng asset độc nhất của Haravan: Customer Profile, Order, POS, HaraSocial Zalo OA, Shipping integration. Đặc biệt focus 3 segment cho ROI cao nhất — F&B (tách/gộp bill, NĐ 70 máy tính tiền), Retail (gộp đơn lẻ cuối ngày theo TT 78), B2C E-commerce (auto-fill MST + Zalo delivery). Phase 2 không cố cạnh tranh với MISA AVA về AI (đó là Phase 3) — mà cạnh tranh về **trải nghiệm tích hợp omnichannel** mà MISA không thể có vì không sở hữu kênh bán. Risk lớn: scope creep — 8 feature dễ thành 14, kỷ luật prioritization gate là bắt buộc.

---

## Pre-requisite từ Phase 1

- [ ] Gateway production stable, capacity dư ≥30% cho feature mới
- [ ] Portal UI framework có pattern để mở rộng module
- [ ] Merchant feedback Phase 1 đã synthesize, Top 10 wishlist
- [ ] Data foundation: Customer Profile MST field accessible, Order data clean
- [ ] HaraSocial Zalo OA + Haravan POS team commit timeline integration
- [ ] Designer có time mới (vì Phase 2 nhiều UX task)

---

## DIAMOND 1 — PROBLEM SPACE

### DISCOVER (tuần 1-3)

**1. Segment Deep-dive** — 5 segment, mỗi segment shadowing 3-5 merchant 1 ngày:

- **F&B** (nhà hàng, cafe, chuỗi đồ uống): pain = tách bill khi khách đông, in nhanh, NĐ 70 máy tính tiền compliance, COD không có (mostly tại quán nên không refund nhiều)
- **Fashion Retail**: pain = gộp đơn cuối ngày cho khách lẻ không lấy hóa đơn, return/exchange phức tạp, multi-location consolidation
- **B2C E-commerce** (web + marketplace): pain = MST nhập tay sai, COD refund nhiều, gửi hóa đơn qua nhiều channel khác nhau
- **B2B Wholesale**: pain = bulk issue cuối tháng, MST validation chính xác, biên bản đối chiếu công nợ kèm hóa đơn
- **Marketplace Seller** (Shopee/Lazada/Tiki + Haravan): pain = data fragmented giữa marketplace và Haravan, hóa đơn từ marketplace order khó link

**2. Competitive feature audit** — update từ Phase 0:

MISA meInvoice / AVA tính năng Haravan ghen tị: Auto recognize file structure, Auto accounting entry với learning, Risk supplier list, Voice creation. **Đáp:** Phase 3 build AI tier 1 (tiền-kiểm, NCC), defer Voice và Auto accounting đến Phase 4 (Copilot).

Tính năng Haravan có lợi thế hơn khi build: Omnichannel data (POS+Web+Marketplace), Zalo OA delivery, COD refund auto, Tách/gộp bill F&B. **Đáp:** Đây là Phase 2 backbone.

**3. Haravan asset audit** (số liệu cần lấy từ data team):

- Customer Profile có MST field: yes. **Tỉ lệ filled bao nhiêu?** Cần đo. Hypothesis: <20% — nên cần campaign onboard MST.
- HaraSocial Zalo OA penetration: bao nhiêu % merchant active dùng? Hypothesis: 30-40% (cần verify).
- POS data: bao nhiêu % transaction qua Hararetail có invoice (hiện tại)?
- Shipping integration: GHN/GHTK/AhaMove webhook event "delivery_failed" / "return" có sẵn?

**4. Workflow shadowing** — 5-10 merchants on-site 1 ngày mỗi:

- Tracking ngón tay làm mỗi step phát hành
- Đo thời gian từ "khách yêu cầu hóa đơn" → "hóa đơn vào tay khách"
- Bottleneck thực tế (vd: kế toán đang gõ MST trong khi khách chờ)

**5. Data analysis Phase 1 logs** — top 5 friction point:

- Top page abandon rate trong portal Phase 1
- Top action có error rate cao
- Top action user lặp đi lặp lại nhiều lần (signal redundant work)

### DEFINE (tuần 4)

**Problem statements (5-7 cụ thể theo segment):**

1. *(F&B)* HMW giúp nhà hàng phát hành hóa đơn ngay khi khách thanh toán mà không phải thoát Hararetail?
2. *(Retail)* HMW gộp tất cả đơn lẻ không có MST cuối ngày thành 1 hóa đơn tổng theo đúng TT 78/TT 32?
3. *(E-commerce)* HMW tự động điền MST khi customer đã có trong Customer Profile, và giúp customer tự cập nhật MST?
4. *(All)* HMW giảm thời gian xử lý điều chỉnh sai sót từ 15-30 phút xuống <5 phút?
5. *(All)* HMW gửi hóa đơn qua kênh khách thích (email/Zalo/SMS) mà không cần thao tác?
6. *(Multi-location)* HMW xem 1 dashboard tổng cho tất cả branch + channel?
7. *(B2B)* HMW xử lý 500-5000 hóa đơn cuối tháng trong vài phút?

**Prioritization (RICE recompute với data thật):**

| # | Feature | Reach | Impact | Confidence | Effort | RICE |
|---|---|---|---|---|---|---|
| 1 | Auto-fill MST từ Customer Profile | 60k | 3 | 90% | 2 | 81.000 |
| 2 | Gộp đơn lẻ cuối ngày | 25k | 3 | 90% | 2 | 33.750 |
| 3 | Wizard xử lý sai sót | 70k | 2 | 80% | 3 | 37.333 |
| 4 | Dashboard omnichannel | 40k | 2 | 85% | 4 | 17.000 |
| 5 | Zalo OA delivery | 30k | 2 | 75% | 2 | 22.500 |
| 6 | Bulk operations | 8k | 4 | 90% | 3 | 9.600 |
| 7 | COD refund auto-handling | 20k | 3 | 70% | 4 | 10.500 |
| 8 | Tách/gộp bill F&B (Hararetail) | 12k | 4 | 85% | 5 | 8.160 |

> Số liệu Reach là giả định baseline cần update từ Phase 1 data thật.

**Scope boundary:** in-scope 8 feature trên. Out-of-scope: AI features (Phase 3), Public API (Phase 4), Multi-T-VAN actual switch (Phase 4 mặc dù abstraction đã sẵn từ Phase 0).

---

## DIAMOND 2 — SOLUTION SPACE

### DEVELOP (tuần 5-10)

#### Feature 1 — Auto-fill MST từ Customer Profile

**UX flow:**
1. User chọn customer trong form phát hành (autocomplete tên/SDT)
2. Nếu Customer Profile có MST → tự fill, badge "Đã verified ngày X"
3. Nếu chưa có MST → prompt "Nhập MST khách" + button "Tra cứu doanh nghiệp" (call API CQT lookup)
4. Sau khi save, MST đó update vào Customer Profile (opt-in checkbox "Lưu cho lần sau")
5. Validation real-time format MST (10 hoặc 13 số), call API CQT verify "doanh nghiệp đang hoạt động" trước khi submit Hilo

**Schema sync** Customer DB ↔ Invoice metadata: dùng customer_id làm key, MST stored trên Customer side, Invoice chỉ snapshot tại thời điểm issue.

**Tích hợp tra cứu doanh nghiệp**: API thuế công khai `gdt.gov.vn` lookup MST → trả về tên + địa chỉ + status active. Cache 24h.

**Acceptance criteria:**
- Form phát hành tự fill MST khi chọn customer có MST
- Badge "verified" hiển thị nếu MST đã verify <30 ngày trước
- Cảnh báo block submit nếu MST không hợp lệ
- Customer Profile cập nhật MST ngay khi save invoice (nếu opt-in)

#### Feature 2 — Gộp đơn lẻ cuối ngày (TT 78 / TT 32)

**Rule engine (configurable per merchant):**
- Tiêu chí mặc định: cùng ngày, không có MST khách, dưới ngưỡng (vd: <200k VND), cùng tax rate, cùng channel
- Merchant tự config: ngưỡng tiền, exclude category, exclude branch

**Scheduling:**
- Default: cron 23:30 mỗi ngày, chạy gộp cho ngày đó
- Manual override: button "Gộp ngay" trong Hóa đơn → Daily summary
- Option: gộp theo branch (1 hóa đơn tổng/branch) hay 1 hóa đơn tổng cho merchant

**Reporting:**
- Trang "Báo cáo gộp đơn" hiển thị: hóa đơn tổng X bao gồm Y đơn nhỏ (link drill-down)
- Export CSV/Excel cho kế toán

**Compliance check:** đảm bảo tuân TT 78 Article về gộp đơn — hiện tại điều khoản này vẫn hiệu lực sau TT 32, nhưng có thể có nuance, **PM phải re-verify với tax counsel**.

**Edge case xăng dầu**: đối với merchant retail xăng dầu, bắt buộc gộp 1 hóa đơn tổng/ngày bất kể có MST hay không. Phase 2 không support segment này (rare in Haravan), defer.

#### Feature 3 — Wizard xử lý sai sót

**Decision tree (5-step wizard):**

1. "Bạn muốn sửa gì?" → các tình huống: Sai MST, Sai địa chỉ, Sai số tiền, Sai sản phẩm, Hóa đơn không hợp lệ, Khách trả hàng, Khách hủy đơn
2. "Hóa đơn đã được CQT chấp nhận chưa?" → Yes → flow điều chỉnh/thay thế. No (đang pending) → flow recall
3. Tự động đề xuất nghiệp vụ: điều chỉnh (cộng thêm/trừ bớt) hay thay thế (hủy + phát hành mới) theo NĐ 70/2025
4. Auto-generate biên bản điều chỉnh PDF (template từ TT 32) với placeholder điền sẵn từ data
5. Workflow ký: gửi link cho khách qua email/Zalo, khách click → ký điện tử (e-sign integration ở Phase 3, Phase 2 dùng "ký xác nhận đơn giản" qua OTP)

**Acceptance criteria:**
- Time-to-process từ click "sửa" đến phát hành mới < 5 phút (target 50% giảm so baseline)
- Biên bản điều chỉnh đúng template chuẩn
- Audit trail đầy đủ ai/khi nào/sửa gì

#### Feature 4 — Dashboard Omnichannel

**Data model:**
- ETL từ Order (Web + POS + Marketplace + Manual) → fact_invoice
- Dimension: branch, channel, product, customer_segment, time
- Refresh near-realtime (5 phút lag) qua Kafka stream từ Order events

**Widget design (Phase 2 minimal viable):**

- KPI cards: tổng doanh thu (theo period), tổng số hóa đơn, % hóa đơn so với order, error rate
- Chart line: doanh thu vs hóa đơn theo ngày (7d / 30d / 90d / custom)
- Pie: phân bổ hóa đơn theo channel
- Pie: phân bổ theo branch
- Table: top 20 customer theo giá trị hóa đơn
- Table: top 10 SKU theo số lượng

**Drill-down:** click chart → list hóa đơn filter sẵn → click row → detail page.

**Performance:** dùng materialized view Postgres + Redis cache, target <2s load dashboard.

#### Feature 5 — Zalo OA Invoice Delivery

**Tích hợp HaraSocial Zalo OA API:**

- Sau khi hóa đơn issue thành công, trigger send Zalo template message (nếu customer có Zalo OA ID linked)
- Template message: "Hóa đơn #X từ [Shop] đã sẵn sàng. [Tải PDF]"
- CTA mở mini-app hoặc browser link → hiển thị PDF + QR check CQT
- Tracking: đã gửi / đã nhận / đã đọc / đã tải (qua Zalo OA webhook)

**Fallback:** nếu Zalo gửi fail (timeout, customer block) → fall back sang email. Nếu cả 2 fail → mark "needs manual delivery" badge trên hóa đơn.

**Compliance:** đảm bảo opt-in receive marketing/transactional message theo Zalo OA policy.

#### Feature 6 — Bulk Operations

**UI bảng** với:
- Filter (period, channel, status, customer segment)
- Multi-select row
- Bulk actions: Phát hành, Gửi lại, Tải xuống PDF/XML, Mark reviewed, Export Excel

**Background job queue:**
- Submit bulk action → tạo job ID
- Worker xử lý từng item, progress reported per 10 items
- Tracking page: progress %, success/fail count, error report download

**Throttling:** respect Hilo rate limit, tự động pace để không trigger 429.

#### Feature 7 — COD Refund Auto-handling

**Sync với shipping (GHN, GHTK, AhaMove):**
- Subscribe webhook "delivery_returned" / "delivery_failed"
- Trigger: nếu order đã issue invoice → tự động tạo "điều chỉnh giảm" hoặc "thay thế" tùy quy tắc
- Trước khi auto-execute, gửi notification cho merchant approve (default 24h, nếu không action thì auto-execute)

**Edge case:**
- Partial return: chỉ điều chỉnh phần return
- Customer giữ 1 phần, trả 1 phần: split flow

**Acceptance criteria:** COD refund flow tự động giảm 80% manual effort cho merchant.

#### Feature 8 — Tách/Gộp Bill F&B (Hararetail)

**UX trên POS Hararetail (yêu cầu cross-team với POS team):**

- Tách bill: chọn món → "Tách thành bill mới" → assigne cho khách khác
- Gộp bill: chọn các bill → "Gộp thành 1 bill" → assigne cho 1 khách
- Logic chia tiền: chia đều / theo món / theo người / custom %
- Sau split/merge → flow phát hành như bình thường, mỗi bill 1 hóa đơn riêng (hoặc 1 hóa đơn cho merged)

**Bug-prone area:** đảm bảo tax calculation không sai sau split (rounding error). Test case extensive.

### DELIVER (tuần 11-16)

**Release theo batch 2-3 features mỗi 2 tuần:**

| Batch | Tuần | Features | Beta merchants |
|---|---|---|---|
| B1 | 11-12 | Auto-fill MST + Wizard sai sót | 30 merchants e-commerce |
| B2 | 13-14 | Gộp đơn cuối ngày + Bulk ops | 30 merchants retail |
| B3 | 15 | Dashboard omnichannel + Zalo OA delivery | 30 merchants multi-channel |
| B4 | 16 | COD refund auto + Tách/gộp bill F&B | 20 merchants F&B + e-commerce |

**A/B test framework:** mỗi feature roll out 50% merchants → measure adoption + NPS shift trong 2 tuần → quyết định ramp 100% hoặc iterate.

**Marketing campaign kèm release:** mỗi batch có blog post, in-app banner, webinar 30-60 phút.

**Customer education:** video tutorial mỗi feature, FAQ doc, in-app tooltip onboarding lần đầu dùng.

---

## Câu hỏi nghiên cứu cụ thể

1. **% Customer Profile có MST hiện tại?** Cần campaign fill nếu <30%.
2. **TT 78/TT 32 quy định gộp đơn cuối ngày chính xác?** Verify với tax counsel: ngưỡng nào, format nào, retention.
3. **Haravan POS bao nhiêu % F&B vs Retail?** Để pri scope tách/gộp bill.
4. **HaraSocial Zalo OA penetration?** Nếu thấp <30%, Zalo delivery không impact lớn → defer hoặc reduce scope.
5. **Top 5 reasons merchants điều chỉnh hóa đơn?** Để wizard cover đúng pain.

---

## Deliverables

1. **8 features production-ready** với documentation
2. **Adoption playbook**: cách roll out + educate merchants per feature
3. **Case studies**: ≥5 merchants thật chia sẻ giá trị (video + viết)
4. **Competitive positioning doc** updated: Haravan vs MISA vs Viettel
5. **Phase 3 Kickoff Brief**

---

## Success Metrics — Exit Criteria

- [ ] Auto-fill MST adoption ≥60% trong segment B2C có MST customer
- [ ] Gộp đơn cuối ngày adoption ≥40% segment retail
- [ ] Dashboard omnichannel DAU ≥30% owners
- [ ] Zalo OA delivery adoption ≥50% merchants có Zalo OA
- [ ] Wizard sai sót giảm 50% time-to-process so baseline
- [ ] NPS tăng ≥15 điểm so Phase 1 baseline
- [ ] Churn rate giảm ≥30% so Phase 1 baseline
- [ ] ≥5 case studies merchants chuyển từ T-VAN khác (MISA/Viettel) sang Haravan Invoice

---

## Risks & Mitigations

| ID | Risk | Prob | Impact | Mitigation |
|---|---|---|---|---|
| P2-R1 | Scope creep từ 8 → 14 feature | 4 | 4 | Strict prioritization gate, 1 feature mới = 1 feature drop |
| P2-R2 | Adoption thấp do merchant không biết | 4 | 4 | Marketing + in-app onboarding + CSM proactive outreach |
| P2-R3 | Integration HaraSocial / POS chậm trễ | 3 | 4 | Cross-team sync sớm tuần 1, có owner cross-team |
| P2-R4 | Customer Profile MST coverage thấp → auto-fill ít impact | 3 | 4 | Campaign "Cập nhật MST nhận quà" trước launch |
| P2-R5 | Tax rule edge case (gộp đơn) sai | 2 | 5 | Tax counsel review, extensive test case |
| P2-R6 | Performance dashboard chậm với merchant data lớn | 3 | 3 | Materialized view + cache + pagination |
| P2-R7 | Zalo OA quota/policy thay đổi | 2 | 3 | Fallback email luôn enabled |
| P2-R8 | Tách/gộp bill F&B tax rounding bug | 3 | 4 | Property-based test, beta restaurant 2 tuần |
| P2-R9 | Bulk operations crash khi >10k items | 3 | 3 | Throttle + chunk, monitoring queue depth |
| P2-R10 | NĐ thay đổi giữa Phase 2 (dự thảo 2026) | 2 | 5 | Compliance officer monitor weekly, plan B sẵn |

---

## Handoff to Phase 3

**Phase 3 Kickoff Brief outline:**

1. **Data foundation cho AI**:
   - Data đã clean và accessible: list dataset
   - Volume sufficient cho train/finetune chưa
   - Customer Profile MST coverage % (sau campaign Phase 2)
   - Order/Invoice history cleanness score

2. **AI use case validated** từ merchant feedback Phase 2:
   - Top 3 AI feature merchants xin
   - Willingness to pay cho AI pack

3. **ML infrastructure needs**:
   - Hosting: cloud GPU? Hay full LLM API (Claude/GPT)?
   - Training pipeline: cần build hay skip nếu dùng full API?
   - Inference serving: latency budget?
   - Monitoring: AI accuracy drift detection

4. **Hiring readiness**: ML engineer (1-2) đã onboard chưa
5. **Compliance scaffold**: AI explainability requirement, audit log mở rộng cho AI decision
