# 99 — AUDIT FRAMEWORK: Cross-Phase Consistency Check
**Tham chiếu:** Master Context v1.0 + 5 phase plans (Phase 0-4)

---

## Mục đích

File này dùng định kỳ chạy AI agent ở chế độ "auditor" để kiểm tra tính nhất quán giữa Master Context và 5 phase plans. Phát hiện gap, conflict, redundancy, và đề xuất chỉnh sửa **trước khi execute**, tránh discovery muộn dẫn rework.

**Khuyến nghị tần suất chạy:**

| Lần | Khi nào | Mục tiêu |
|---|---|---|
| 1 | Sau khi có draft đủ 5 phase plan, trước khi execute Phase 0 | Align toàn bộ trước khi commit resource |
| 2 | Cuối Phase 1 (rollout xong, chuẩn bị Phase 2) | Verify Phase 2-4 vẫn relevant với learning Phase 1 |
| 3 | Cuối Phase 2 | Verify Phase 3-4 với data thật |
| 4 | Cuối Phase 3 | Verify Phase 4 với AI capability đã build |
| Adhoc | Khi có regulation change lớn, partnership change, market shift | React-mode audit |

---

## Audit Prompt (paste vào AI session với toàn bộ files)

```
# AUDIT REQUEST — Haravan Invoice Wrapper Project

Tôi là PM dự án Haravan Invoice Wrapper. Tôi cần bạn đóng vai
external auditor có 10+ năm kinh nghiệm fintech/SaaS, đọc kỹ 7 file
sau và output audit report:

1. 00_master_context.md
2. 01_phase0_discovery.md
3. 02_phase1_parity.md
4. 03_phase2_differentiation.md
5. 04_phase3_intelligence.md
6. 05_phase4_platform.md
7. (optional) Phase X Kickoff Brief gần nhất

Audit theo 8 dimension dưới đây. Output theo format Section A-F ở
cuối file 99_audit_framework.md. Không "soft" — flag mọi vấn đề
structural lớn nếu có.

## 8 Dimension Audit

### 1. Strategic Consistency
- Mỗi phase align với theme tổng thể không?
- Tổng các phase deliver được vision dự án không?
- Có phase nào lệch khỏi MVP-first principle không?

### 2. Architectural Consistency
- ADR Phase 0 có được respect ở Phase 1-4 không?
- Tech debt nào tạo ở phase trước không được address ở phase sau?
- Multi-T-VAN abstraction có thật sự thiết kế từ đầu không?
- Database schema có evolve hợp lý không?

### 3. Feature Consistency
- RICE priority từ master có được respect không?
- Feature nào xuất hiện 2 phase mà không clear ownership?
- Dependency giữa features có được mô hình hóa không?
- Feature nào nên làm sớm hơn nhưng bị xếp muộn (hoặc ngược lại)?

### 4. Resource & Timeline Consistency
- Tổng person-month khớp với capacity team 8-10 người không?
- Ramp-up team (vd: ML Phase 3) có realistic không?
- Phase nào overload hoặc underload?
- Buffer cho rework có đủ không?

### 5. Risk Consistency
- Risk từ phase trước có carry forward và monitor không?
- Risk mới ở phase sau làm invalidate plan phase trước không?
- Mitigation plan có ai own không?

### 6. Metric Consistency
- KPI có chain hợp lý không (NPS Phase 1 → 2 → 3 đo cùng cách)?
- Success criteria measurable thật không hay vague?
- Baseline có set rõ không?

### 7. Compliance Consistency
- Mọi phase có compliance check với NĐ 123, TT 78, NĐ 70, TT 32?
- AI compliance (Phase 3) có conflict với T-VAN role không?
- Data privacy có consistent không?
- Có theo dõi dự thảo NĐ 2026 thay thế NĐ 123+70 không?

### 8. Handoff Quality
- Mỗi Kickoff Brief đủ info để phase sau start chưa?
- Assumption nào ở phase sau invalidate khi phase trước xong?
- Decision deferred có được track không?
```

---

## Output Format chuẩn cho Audit Report

### Section A — Executive Summary
- Overall consistency score 1-10 (kèm rationale)
- Top 3 strengths của bộ plan
- Top 5 issues cần address (severity + estimated effort)

### Section B — Issue List (chi tiết)
Mỗi issue:
```
ID: AUD-XXX
Type: Strategic | Architectural | Feature | Resource | Risk | Metric | Compliance | Handoff
Severity: Critical | High | Medium | Low
Description: <vấn đề là gì>
Affected phases: <Phase X, Phase Y>
Evidence: <quote/reference cụ thể>
Recommended fix: <đề xuất sửa>
Effort to fix: S | M | L (story point)
Owner suggested: <role>
```

### Section C — Conflict Map
- List các điểm conflict giữa phase với nhau
- Format: "Phase X nói A vs Phase Y nói B → resolution đề xuất"

### Section D — Gap Analysis
- Yêu cầu trong Master chưa được cover ở phase nào
- Phase nên cover

### Section E — Optimization Suggestions
- Feature có thể defer (lùi phase sau hoặc out scope)
- Feature có thể accelerate (đẩy lên sớm hơn)
- Resource reallocation đề xuất

### Section F — Final Recommendations
- Có nên proceed với plan hiện tại?
- Cần revise phase nào trước khi kickoff?
- Stakeholder approval cần ai trước go-live?

---

## Scoring Rubric (consistency score 1-10)

| Score | Mô tả |
|---|---|
| 9-10 | Production-ready, zero critical issue, minor optimization opportunities |
| 7-8 | Solid plan, vài medium issue cần fix, có thể proceed sau revise |
| 5-6 | Có gap quan trọng, cần rework 1-2 phase trước khi proceed |
| 3-4 | Major structural issue, cần redo Discover/Define ở 1+ phase |
| 1-2 | Plan không feasible, restart approach |

---

## Decision Log Template

Khi audit phát hiện vấn đề và đưa ra fix, log lại:

```markdown
## Decision DEC-XXX (date: YYYY-MM-DD)

**Issue from audit:** AUD-XXX

**Decision:** <quyết định cụ thể>

**Rationale:** <lý do>

**Affected files:** <list files cần update>

**Owner:** <ai chịu trách nhiệm update>

**Deadline:** <bao giờ phải hoàn thành>

**Status:** Open | In Progress | Done

**Linked PR/commit:** <nếu có>
```

---

## Conflict Map Template

Khi audit phát hiện conflict giữa phase, document:

```markdown
## Conflict CFL-XXX

**Phase A statement:** "<quote từ phase A>"
**Phase B statement:** "<quote từ phase B>"

**Why conflict:** <giải thích mâu thuẫn>

**Impact if unresolved:** <hậu quả>

**Resolution options:**
1. Option 1: <mô tả + pros/cons>
2. Option 2: <mô tả + pros/cons>

**Recommended:** Option X

**Update needed:**
- File X: change Y
- File Z: change W
```

---

## Pre-built Checklist (chạy nhanh tay không cần AI)

### Strategic
- [ ] Mỗi phase plan có Executive Summary 5-7 dòng
- [ ] Theme phase được nhắc rõ
- [ ] Tham chiếu Master Context v[X.Y] explicit
- [ ] Pre-requisite từ phase trước được list

### Architectural
- [ ] Multi-T-VAN abstraction được nhắc tối thiểu Phase 1, 2, 3, 4
- [ ] ADR-001 đến ADR-007 được tham chiếu khi có decision liên quan
- [ ] Không có ý "tạm bypass abstraction để Phase 1 nhanh hơn"

### Feature
- [ ] RICE recompute documented cho mỗi phase
- [ ] Top 10 RICE master được track xuyên phase
- [ ] Mỗi feature có owner phase explicit (không "có thể Phase 2 hoặc 3")

### Resource
- [ ] Tổng person-month per phase tính ra số cụ thể
- [ ] Ramp-up ML engineer Phase 3 có timeline cụ thể (tuyển từ Phase 2)
- [ ] Buffer 20% timeline được cộng vào

### Risk
- [ ] Mỗi phase ≥10 risks
- [ ] Risk từ Phase X-1 mà chưa close được carry sang Phase X
- [ ] Mọi risk có owner

### Metric
- [ ] NPS measurement methodology giữ nhất quán xuyên phase
- [ ] Latency/error rate có baseline cụ thể
- [ ] Adoption metric clear definition

### Compliance
- [ ] NĐ 70/2025 + TT 32/2025 được nhắc trong Phase 1, 2
- [ ] Dự thảo NĐ 2026 có process monitor
- [ ] AI explainability requirement Phase 3
- [ ] T-VAN role boundary (không lưu XML gốc) consistent

### Handoff
- [ ] Mỗi Kickoff Brief outline có ≥7 mục
- [ ] Decision deferred có deadline resolve
- [ ] Open question có owner

---

## Common Issue Patterns (từ kinh nghiệm dự án tương tự)

**1. Scope creep từ "có thể tận dụng luôn"**
Phase 1 thường bị thêm feature từ Phase 2 vì "đã code vùng đó rồi, làm luôn". Audit phải catch và đẩy về backlog Phase 2.

**2. AI ROI optimistic**
Phase 3 dễ overpromise AI capability. Audit verify accuracy target có realistic theo benchmark thật, không phải "ước lượng đẹp".

**3. Multi-T-VAN dạng "lip service"**
Phase 0 nói có abstraction, nhưng Phase 1 code tight-coupled với Hilo, đến Phase 4 mới phát hiện không swap được. Audit check code structure, không chỉ doc.

**4. Compliance afterthought**
Phase 3-4 quên check compliance vì coi như đã handle ở Phase 1. Audit verify mỗi feature mới đều có compliance section.

**5. Migration risk underestimate**
Phase 1 migration thường khó hơn dự kiến 2-3x. Audit kiểm tra rollback plan có thực sự test được hay chỉ là document.

**6. Partnership fragility**
Hilo (hoặc bất kỳ external partner) có thể change priority, breaking change, M&A. Audit verify có Plan B.

**7. ML engineer timing**
Tuyển ML engineer cho Phase 3 thường mất 2-3 tháng. Phase 2 phải start sourcing. Audit catch nếu Phase 2 plan không mention hiring.

**8. Cost LLM unbounded**
Phase 3-4 dễ underestimate LLM cost. Audit verify cost monitor + circuit breaker được build từ Day 1.

---

## Sample Filled-in Audit (giả định, để format reference)

### Section A — Executive Summary
**Score:** 7/10. Strong foundation, nhưng có 3 gap quan trọng cần fix trước Phase 1 kickoff.

**Top 3 strengths:**
1. Multi-T-VAN abstraction được design ngay Phase 0 với ADR rõ
2. Compliance Phase 1 cover đầy đủ NĐ 70 + TT 32 với deadline 1/6/2025
3. RICE recompute mỗi phase, không cứng nhắc theo baseline

**Top 5 issues cần address:**
1. (Critical) Phase 3 AI cost estimate $10k/tháng nhưng không có cap mechanism nếu vượt → cần circuit breaker
2. (High) Phase 4 multi-T-VAN actual implement chỉ có 16 tuần → optimistic, đề nghị scope down hoặc kéo dài
3. (High) Phase 1 migration plan thiếu chi tiết về Tier A enterprise (rollout cuối) → thêm runbook cụ thể
4. (Medium) Hiring ML engineer mention Phase 3 nhưng Phase 2 plan không có sourcing milestone → thêm
5. (Medium) Dự thảo NĐ 2026 có process monitor nhưng không explicit owner → assign PM

### Section B — Issue List
... (chi tiết theo format)

### ... (Section C, D, E, F)

---

## Final note

Audit không phải để "tìm lỗi và đổ trách nhiệm". Mục đích là **phát hiện sớm** để fix cheap. Mỗi audit cycle nên kết thúc bằng team review buổi 60-90 phút, agree fix, log decision, update plan files với version bump.
