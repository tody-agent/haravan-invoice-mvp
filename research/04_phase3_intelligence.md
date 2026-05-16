# 04 — PHASE 3 PLAN: Intelligence (AI Layer)
**Tham chiếu:** Master Context v1.0 + Phase 2 Kickoff Brief
**Thời lượng:** 4-5 tháng (16-20 tuần) · **Team:** 10-12 người (+1-2 ML Engineer)
**Theme:** *"AI biến hóa đơn từ chi phí thành insight"*

---

## Executive Summary

Phase 3 cạnh tranh trực diện với MISA AVA — đối thủ duy nhất có AI sâu trong segment hóa đơn Việt Nam. Chiến lược: **không tự train model**, dùng LLM (Claude/Gemini/GPT) phủ trên data Haravan đã có sẵn (Order, Customer, Inventory, Invoice metadata Phase 2). Focus 5 AI features có ROI rõ và risk thấp về compliance: tiền-kiểm trước phát hành, cảnh báo NCC rủi ro, Inbound module với AI classify, phân tích biến động chi phí, e-signature workflow. Tránh các AI tự ký tự gửi CQT (legal risk cao). Cost LLM kiểm soát qua: cache aggressive, smaller model fallback, batch inference. Risk lớn nhất: **AI hallucination** trong quyết định tài chính → mitigation = human-in-the-loop bắt buộc cho mọi action critical, AI chỉ suggest/warn.

---

## Pre-requisite từ Phase 2

- [ ] Data foundation: Customer/Order/Invoice metadata clean và accessible qua data warehouse
- [ ] Customer Profile MST coverage ≥40% (sau campaign Phase 2)
- [ ] Merchants đã trust portal Haravan Invoice (NPS phase 2 ≥40)
- [ ] ML infrastructure setup: training pipeline (nếu cần), inference serving, monitoring
- [ ] 1-2 ML Engineer đã onboard
- [ ] Legal/Compliance counsel commit time review AI features
- [ ] Budget LLM inference approved (estimate $5k-20k/tháng đầu)

---

## DIAMOND 1 — PROBLEM SPACE

### DISCOVER (tuần 1-4)

**1. AI Feasibility Study**

Compare 3 approach:

| Approach | Pros | Cons | Khi nào chọn |
|---|---|---|---|
| **LLM API (Claude/Gemini/GPT)** | No training cost, fast iterate, capability tăng theo thời gian, đa ngôn ngữ tốt | Cost per-inference, latency tùy provider, dependency 3rd party | Hầu hết use case Phase 3 |
| **Self-train fine-tuned model** | Cost rẻ ở scale, latency thấp, không lock-in | Cần data labeling, infra GPU, ML team mature | Chỉ khi LLM API không đáp ứng accuracy cụ thể |
| **Rule-based + ML hybrid** | Explainable, predictable, compliance-friendly | Cần expert craft rule, hard to scale variety | Pre-check / validation |

**Recommendation:**
- **AI tiền-kiểm**: rule-based + LLM check edge case
- **AI cảnh báo NCC**: rule-based + ML scoring (logistic regression đơn giản)
- **Inbound classify**: LLM API (Claude Haiku/GPT-4o-mini cho cost)
- **AI phân tích biến động**: LLM API với data summary
- **E-signature**: không cần AI, chỉ cần integration

**2. MISA AVA reverse-engineering**

User testing 3-5 buổi với MISA meInvoice (đăng ký dùng thử):
- AVA tiền-kiểm hóa đơn: input gì? Output gì? Confidence thể hiện ra sao? UX khi AI sai?
- AVA cảnh báo NCC: data source? Update tần suất? Threshold?
- AVA hạch toán: AI propose vs accountant accept rate?
- Voice creation: accuracy tiếng Việt số/công thức?

Document toàn bộ qua screencast + transcript. Output: "What MISA does well" + "Where MISA has gap".

**3. Data quality audit**

Check Haravan data:
- Order data: bao nhiêu % có complete tax info?
- Inventory: có category/group cho AI classify chi phí không?
- Customer: business vs individual flag chính xác bao nhiêu %?
- Invoice metadata Phase 2: dataset đủ lớn để train (≥100k rows) chưa?

Identify gap → labeling plan nếu cần.

**4. Compliance for AI**

- Hiện tại Việt Nam có quy định riêng AI trong fintech không? *(May 2026: chưa có Luật AI riêng, áp dụng quy định chung của Luật Bảo vệ dữ liệu cá nhân + chuẩn ngành tài chính)*
- Yêu cầu audit log cho AI decision: phải traceable, explainable
- Customer data privacy: data đưa lên LLM API có ổn không? Phải có DPA với provider, hoặc dùng EU/US deployment với clauses no-training-on-data
- Edge case: AI suggest sai → ai chịu trách nhiệm? Disclaimer + opt-in framework

**5. Merchant trust research**

Hỏi 20-30 kế toán + owners (interview):
- "Bạn có để AI tự động hạch toán mà không xem lại không?" — hypothesis: hầu hết "Không, chỉ muốn AI gợi ý"
- "Mức confidence bao nhiêu thì bạn trust AI?" — hypothesis: ≥85% mới trust
- "Bạn quan tâm AI giải thích được lý do không?" — hypothesis: rất quan tâm, đặc biệt khi AI sai

**6. Risk modeling NCC**

Define "rủi ro NCC":
- Hard signal: MST chuyển trạng thái "ngừng hoạt động" trên CQT
- Hard signal: NCC thuộc danh sách "rủi ro cao về thuế" công khai bởi Tổng Cục Thuế
- Soft signal: pattern bất thường trong lịch sử (volume tăng đột biến, giá trị bất thường, frequency change)
- Soft signal: NCC chưa từng giao dịch với merchant trước đó

Data source:
- API CQT lookup MST status (cache 24h)
- Public list "doanh nghiệp rủi ro" (scrape weekly)
- Internal: lịch sử giao dịch của merchant với từng NCC

### DEFINE (tuần 5)

**Problem statement cho từng AI feature:**

1. *(Tiền-kiểm)* HMW giảm 70% tỷ lệ hóa đơn bị CQT từ chối nhờ AI check trước khi gửi?
2. *(NCC rủi ro)* HMW cảnh báo merchant trước khi giao dịch với NCC ngừng hoạt động hoặc rủi ro cao?
3. *(Inbound)* HMW giảm 80% time kế toán xử lý hóa đơn đầu vào (load → check → classify → record)?
4. *(Phân tích biến động)* HMW giúp owner phát hiện anomaly chi phí trong dashboard mà không cần kế toán làm thủ công?
5. *(E-signature)* HMW workflow ký biên bản điều chỉnh giảm từ 2-3 ngày xuống <30 phút?

**AI safety boundaries:**

| Feature | AI tự động | Cần xác nhận | Cấm AI quyết |
|---|---|---|---|
| Tiền-kiểm | ✓ flag warning | Người duyệt warning | Tự sửa hóa đơn |
| Cảnh báo NCC | ✓ alert | - | Tự block transaction |
| Inbound classify | ✓ propose category | Kế toán confirm | Tự ghi sổ kế toán |
| Phân tích biến động | ✓ generate insight | - | Tự gửi cho stakeholder |
| E-signature | - | Khách ký, không phải AI | - |

**Accuracy target:**

- Tiền-kiểm precision ≥95% (false positive thấp, tránh phiền)
- NCC alert precision ≥90% (false positive ≤10%)
- Inbound classify accuracy ≥85% top-1, ≥95% top-3
- Phân tích biến động: anomaly detection F1 ≥0.7

**Explainability requirement:** mỗi AI decision phải kèm "Tại sao": top 3 lý do AI đưa ra kết luận này. Hiển thị trong UI dạng tooltip hoặc panel expand.

**Fallback strategy:** AI fail / down → fall back về rule-based hoặc skip AI step (UX không block flow chính).

---

## DIAMOND 2 — SOLUTION SPACE

### DEVELOP (tuần 6-14)

#### 1. AI Tiền-kiểm trước phát hành

**Architecture:** Rule-based layer trước → LLM check edge case sau (chỉ khi rule-based pass)

**Rule-based check (synchronous, <50ms):**
- MST format đúng (10 hoặc 13 số, checksum hợp lệ)
- MST tồn tại trong CQT lookup (cache 24h)
- MST đang "hoạt động" (not "ngừng hoạt động")
- Tax rate hợp lệ với category (vd: VAT 10% cho hàng hóa thông thường, 5% cho thực phẩm thiết yếu, 0% xuất khẩu)
- Total = sum(line items) ± rounding
- Required fields filled (buyer name, items, totals)
- Date không tương lai, không quá xa quá khứ

**LLM check (async, 500-2000ms):** chỉ trigger khi rule-based pass nhưng có "warning signal" (vd: line item description rất generic, total bất thường so với historical)
- Prompt: "Check hóa đơn này có gì bất thường không. So sánh với 5 hóa đơn gần nhất của customer/seller này. Trả về JSON {risk: low/med/high, reasons: [...]}"
- Cache key: hash of invoice data → 1h cache

**UX:**
- Form phát hành có box "AI tiền-kiểm" hiển thị status: ✓ pass / ⚠ warning / ✗ fail
- Warning hiển thị inline với reason + suggestion
- User có thể "Vẫn phát hành" cho warning (audit trail), nhưng "fail" thì block hoàn toàn

**Learning loop:** mỗi lần Hilo trả về CQT rejection → log lại → dùng làm dataset cải thiện rule + finetune prompt.

#### 2. AI Cảnh báo Rủi ro NCC

**Data source:**
- API lookup CQT (sync trên demand + batch refresh weekly cho NCC active)
- Scrape danh sách "doanh nghiệp rủi ro" công khai (vd: từ trang Tổng Cục Thuế hoặc Bộ Tài chính) — daily
- Internal pattern: tính moving average volume + std dev cho từng NCC

**Risk scoring model:**

```
risk_score = w1 * mst_status_risk + w2 * tax_risk_list + w3 * volume_anomaly + w4 * value_anomaly + w5 * new_supplier_flag
```

Trọng số ban đầu hand-crafted, sau 3 tháng có data thì dùng logistic regression để tối ưu.

**Action:**
- Risk score ≥0.8: red banner "Cảnh báo cao", default block + require override
- 0.5-0.8: yellow warning, không block nhưng prominent
- <0.5: passive, hiển thị trong audit nếu user xem

**Output explainability:** "MST này chuyển trạng thái 'ngừng hoạt động' ngày X. Volume giao dịch tháng này tăng 250% so với trung bình 6 tháng trước."

**UX:** banner trong: form phát hành (khi nhập NCC), Inbound list (highlight), dashboard "Rủi ro nhà cung cấp" view.

#### 3. Inbound Invoice Module

**Auto-fetch từ Hilo Inbound API**: poll mỗi 15 phút (hoặc webhook nếu Hilo support).

**OCR backup:** cho hóa đơn giấy upload ảnh → OCR (Google Vision / AWS Textract) → extract MST/total/items → user confirm.

**AI phân loại theo nhóm chi phí:**
- Train/prompt LLM với rule chi phí: nguyên liệu, marketing, văn phòng, vận chuyển, lương, thuế, khác
- Input: invoice item names + seller info + amount → Output: category + confidence
- LLM context: prompt include category list + 3 examples mỗi category (in-context learning)
- Cache: hash(item description + seller MST) → category với 30 ngày TTL

**AI đối soát với Purchase Order Haravan** (nếu merchant dùng PO module):
- Match invoice với PO theo: MST seller + tổng tiền ± 5% + line items overlap
- Output: matched / partial / unmatched
- Flag discrepancy cho kế toán review

**AI gợi ý hạch toán:**
- Input: category + amount + accounting setup của merchant
- Output: debit/credit entry suggestion
- **Quan trọng:** chỉ suggest, không tự post sổ kế toán. Kế toán click "Accept" hoặc "Edit" → post.

#### 4. AI Phân tích Biến động Chi phí

**Logic:**
- Mỗi tháng, so sánh chi phí period này vs period trước (MoM, YoY)
- Detect anomaly per category: nếu thay đổi >20% và z-score >2 → flag
- LLM generate "câu chuyện": "Chi phí marketing tháng 5 tăng 40% so tháng 4. Trong khi đó doanh thu chỉ tăng 5%. Nguyên nhân chính: tăng chi cho NCC X (250% so trung bình)."

**UI:** trong Dashboard, panel "Insight tài chính" với 3-5 insight tự động generate đầu tháng.

**Action button:** "Drill down" → list invoice của category đó. "Hide" / "Mark as expected" → AI học để không flag lần sau.

#### 5. E-signature cho Biên bản Điều chỉnh

**Integration với e-sign provider:** chọn 1-2 trong (FPT.eSign, MISA AMIS Signature, Viettel CA, BkavCA)

**Workflow:**
1. Kế toán dùng Wizard sai sót (Phase 2) tạo biên bản điều chỉnh
2. System gửi link cho khách qua email/Zalo OA
3. Khách click → mở web view → nhập OTP qua SMS/email → ký điện tử
4. Sau ký → tự động gửi confirmation cho cả 2 bên + lưu vào hồ sơ
5. Sau khi cả 2 ký → trigger flow điều chỉnh trong Hilo

**Edge case:**
- Khách không có e-sign provider account → dùng "ký xác nhận đơn giản" (OTP + IP log + timestamp) nếu legal cho phép cho amount nhỏ
- Khách từ chối ký → escalation flow

**Compliance:** đảm bảo e-signature có giá trị pháp lý theo Luật Giao dịch điện tử Việt Nam (rev 2023).

### DELIVER (tuần 15-20)

**Soft launch từng AI feature một (tránh overwhelm):**

| Tuần | Feature | Mode |
|---|---|---|
| 15 | AI Tiền-kiểm | Shadow mode (AI chạy ngầm, so sánh với CQT result, không show user) |
| 16 | AI Tiền-kiểm | Show beta 50 merchants, opt-in |
| 17 | Inbound Module + AI classify | Beta 30 merchants có inbound volume cao |
| 18 | AI Cảnh báo NCC | Beta 100 merchants |
| 19 | AI Phân tích biến động | Beta 50 owners |
| 20 | E-signature workflow | Beta 30 merchants có nhiều điều chỉnh |

**Continuous learning:**
- Mỗi user feedback (Accept / Edit / Reject AI suggestion) → log lại
- Weekly review: precision/recall, drift detection
- Re-prompt engineering hoặc finetune nếu accuracy drift >5%

**Public rollout:** sau beta thành công, A/B test 50/50 → measure adoption + NPS shift → ramp 100%.

---

## Câu hỏi nghiên cứu cụ thể

1. **LLM nào phù hợp Vietnamese fintech?** Test Claude Sonnet 4.6 + GPT-4o + Gemini 2.5 Pro trên dataset thật. Đo accuracy, latency, cost.
2. **Cost per inference budget?** Estimate: ~$0.001-0.005/inference với cached + small model. Budget initial $10k/tháng cho 10k merchants × 100 inference/merchant.
3. **AI accuracy minimum để launch?** Tiền-kiểm 95%, NCC alert 90%, Inbound classify 85%.
4. **Cần data labeling pipeline?** Cho Inbound classify: yes, ~5k labeled examples để bootstrap. Outsource MTurk-VN hoặc internal interns.
5. **Compliance: AI decision có cần audit log đặc biệt?** Yes — log: model version, prompt template, input data hash, output, confidence, user action sau đó.

---

## Deliverables

1. **5 AI features production** với monitoring + alert
2. **MLOps playbook**: training (nếu có), prompt versioning, deployment, monitoring, retraining trigger
3. **AI Explainability Doc**: mỗi feature giải thích được decision
4. **Accuracy report** monthly: precision/recall/F1 theo time
5. **Cost analysis**: cost per inference vs value created, ROI report
6. **Phase 4 Kickoff Brief**

---

## Success Metrics — Exit Criteria

- [ ] AI tiền-kiểm giảm ≥70% hóa đơn phát hành lỗi (CQT reject rate)
- [ ] AI accuracy ≥92% trên test set thực tế
- [ ] Inbound module adoption ≥50% merchants có >50 NCC
- [ ] AI hạch toán suggestion adoption ≥30% kế toán
- [ ] Time-to-process hóa đơn đầu vào giảm ≥80%
- [ ] Zero AI compliance incident (no AI-caused legal issue)
- [ ] AI features contributing ≥20% NPS uplift
- [ ] Cost per inference ≤target ($0.005)

---

## Risks & Mitigations

| ID | Risk | Prob | Impact | Mitigation |
|---|---|---|---|---|
| P3-R1 | AI hallucination → suggest wrong | 4 | 5 | Strict guardrails, human-in-loop, confidence threshold, never auto-act |
| P3-R2 | Compliance risk AI quyết định tài chính | 3 | 5 | Legal review trước launch, audit log đầy đủ, opt-in mode |
| P3-R3 | Cost LLM vượt budget | 4 | 4 | Cost monitor real-time, cache aggressive, smaller model fallback, batch inference |
| P3-R4 | Merchant distrust AI | 3 | 4 | Explainability + opt-in mode + visible confidence score |
| P3-R5 | Data privacy (LLM provider sees data) | 3 | 5 | DPA with provider, mask PII, on-premise option for enterprise |
| P3-R6 | LLM provider downtime | 3 | 3 | Multi-provider fallback (Claude → GPT → Gemini) |
| P3-R7 | Accuracy drift theo thời gian | 3 | 3 | Weekly monitoring, alert when drift >5%, retraining pipeline |
| P3-R8 | E-sign provider integration phức tạp | 3 | 3 | Pick 1-2 provider only Phase 3, defer rest |
| P3-R9 | Inbound OCR accuracy thấp với hóa đơn giấy | 3 | 3 | OCR confidence score, kế toán confirm trước khi pass to AI classify |
| P3-R10 | ML engineer không tuyển kịp | 3 | 4 | Start tuyển từ giữa Phase 2, có contractor backup |

---

## Handoff to Phase 4

**Phase 4 Kickoff Brief outline:**

1. **AI capability đã build có thể expose qua API/SDK chưa?** Audit từng feature để xem có "wrap-able" không
2. **Platform readiness assessment**: gateway có đủ hardening cho external developer chưa
3. **Ecosystem partner candidate list**: phần mềm kế toán Việt (MISA SME, Fast, Bravo) đã sounded chưa
4. **Multi-T-VAN implementation plan**: Phase 0 đã design abstraction, Phase 4 actual implement adapter Viettel/MISA
5. **Pricing model AI tier**: data Phase 3 cho phép confident pricing chưa
6. **Open compliance items**: AI-related regulation đang track
