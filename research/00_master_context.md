# 00 — MASTER CONTEXT (v1.0)
**Dự án:** Haravan Invoice Wrapper trên nền T-VAN Hilo
**Ngày phát hành:** 13/05/2026
**Owner:** Tody (PM/Strategist) · **Status:** Locked baseline cho Phase 0 kickoff

> File này là **single source of truth**. Mọi phase plan, ADR, prompt vibe coding đều phải tham chiếu lại đây. Khi update, bump version (v1.1, v1.2…) và log change ở cuối file. Phase plan phiên bản mới hơn nếu conflict thì master này phải được cập nhật trước, không để drift ngầm.

---

## 1. Vai trò của AI khi làm việc với master này

Khi paste prompt phase vào AI agent (Claude, ChatGPT, Cursor, Claude Code), agent đóng vai **Senior Product Strategist kiêm Technical Architect** với 10+ năm kinh nghiệm fintech/SaaS B2B Việt Nam, am hiểu đặc biệt về:

- Hóa đơn điện tử Việt Nam: NĐ 123/2020, TT 78/2021, QĐ 1510/2022, **NĐ 70/2025** (hiệu lực 1/6/2025), **TT 32/2025** (thay TT 78), và **dự thảo nghị định 2026** thay thế cả NĐ 123 + NĐ 70.
- Hệ sinh thái T-VAN: Hilo (đối tác chính), Viettel SInvoice, MISA meInvoice, EFY-iHOADON, VNPT Invoice, BkavCA, FPT.
- E-commerce platform: Haravan, Shopify, Sapo, KiotViet, Nhanh.vn, Pancake.
- Product discovery: JTBD, Story Mapping, RICE, Double Diamond, Opportunity Solution Tree.

Agent phải **chủ động flag** khi phát hiện assumption không nhất quán với master, không tự ý "fix" trong yên lặng.

---

## 2. Bối cảnh & Vision

Haravan đang dùng Hilo làm T-VAN backend (whitelabel) cho sản phẩm "Haravan Invoice". Hiện trạng: Haravan chỉ chạy automation flow gọi API Hilo, **toàn bộ UX do Hilo cung cấp** (embed iframe / redirect). Hệ quả:

- Merchant Haravan trải nghiệm gãy: thoát khỏi Haravan Admin → vào portal Hilo → quay lại.
- Haravan không thể bổ sung tính năng đặc thù tận dụng asset có sẵn (Customer Profile, POS, HaraSocial, Order, Shipping integration).
- Haravan không có data invoice insight để feed lại cho merchant.
- Lock-in Hilo: nếu cần đổi T-VAN sau này thì migration cost cực lớn.

**Vision (3 năm):** Haravan Invoice là **lý do để merchant chọn ở lại Haravan** — không chỉ là feature add-on. Trong segment SMB/F&B/retail Việt Nam, merchant nhắc đến hóa đơn nghĩ ngay đến trải nghiệm Haravan, vượt qua MISA meInvoice về UX và bằng MISA AVA về AI cho phân khúc commerce.

**Sứ mệnh ngắn hạn (12-18 tháng):** Build "App Portal Wrapper" để Haravan làm chủ trải nghiệm, bổ sung tính năng đặc thù cho merchant Haravan, học hỏi MISA về AI và workflow, **KHÔNG thay thế core Hilo** mà gọi API.

---

## 3. Kiến trúc 5 tầng (đã chốt)

| Tầng | Tên | Owner | Nội dung |
|---|---|---|---|
| 1 | **Hilo Core** | Hilo | T-VAN pháp lý, ký số, truyền nhận CQT, lưu trữ XML chuẩn QĐ 1510. **Giữ nguyên, chỉ gọi API.** |
| 2 | **Haravan Invoice Gateway** | Haravan | Proxy + orchestrator: rate limit, retry, idempotency, circuit breaker, observability, multi-T-VAN abstraction, transformation Haravan-domain ↔ Hilo-domain. |
| 3 | **Metadata DB** | Haravan | Mapping Order/Customer ↔ Invoice, audit trail, compliance log, không lưu XML pháp lý gốc. |
| 4 | **Portal UI** | Haravan | Nhúng trong Haravan Admin, design system Haravan (Hara DS), responsive cho POS tablet. Thay thế UI Hilo. |
| 5 | **AI / Intelligence Layer** | Haravan + LLM partner | LLM-based (Claude / Gemini / GPT) phủ trên data Hilo + data Haravan, generate insight, guardrail compliance. |

**Nguyên tắc kiến trúc:**
- Tầng 2 thiết kế **multi-T-VAN abstraction từ Day 1** (adapter pattern), kể cả khi Phase 1 chỉ plug Hilo. Tránh refactor đắt khi Phase 4 mở rộng.
- Tầng 3 không lưu XML gốc của hóa đơn (vẫn ở Hilo) — chỉ lưu metadata cần cho UX/audit/AI. Tránh tranh chấp pháp lý về vai trò T-VAN.
- Tầng 5 phải có guardrail: AI không được tự ký, tự gửi CQT — chỉ pre-check / suggest / auto-fill / classify. Người ra quyết định cuối luôn là kế toán/owner.

---

## 4. Roadmap 4 Phase + Phase 0

| Phase | Theme | Thời lượng | Team | Output chính |
|---|---|---|---|---|
| **Phase 0** | Foundation & Discovery | 4-6 tuần | 4-5 người | 5 ADR + Partnership Hilo + Research Report + Phase 1 Backlog |
| **Phase 1** | Parity & Foundation — *"Sở hữu lại trải nghiệm"* | 3 tháng | 8 người | Gateway production + Portal UI v1 + 100% migration |
| **Phase 2** | Differentiation — *"Lý do chọn Haravan"* | 3-4 tháng | 8-10 người | 8 features đặc thù Haravan ecosystem |
| **Phase 3** | Intelligence — *"AI biến hóa đơn thành insight"* | 4-5 tháng | 10-12 người (+1-2 ML) | 5 AI features production |
| **Phase 4** | Platform & Ecosystem — *"Nền tảng mở"* | 3-4 tháng | 10-12 người | Multi-T-VAN, Public API, Automation Builder, Marketplace |

**Tổng timeline lý tưởng:** 17-22 tháng từ kickoff Phase 0 đến exit Phase 4.

**Buffer thực tế:** cộng thêm 20% timeline cho rework, regulation change, partnership negotiation. Realistic 24 tháng.

---

## 5. Personas chính (4 nhóm)

**Owner / Chủ shop** — ra quyết định mua, xem dashboard, lo compliance và rủi ro. Ít thao tác hàng ngày nhưng quyết định ngân sách. Đo lường: NPS, churn, expansion revenue.

**Kế toán** — xử lý nghiệp vụ sai sót, đối soát, báo cáo thuế. Tần suất sử dụng cao, đặc biệt cuối tháng/cuối quý. Đo lường: time-to-process, error rate, ticket volume.

**Thu ngân / NV bán hàng** — phát hành nhanh tại POS, không muốn bị chậm dù 1 giây. Thường dùng tablet, đôi khi mobile. Đo lường: latency p95, % rollback do lỗi, training time.

**Khách hàng cuối** (B2C/B2B) — nhận hóa đơn qua email/Zalo/SMS, tra cứu lại khi cần. Đo lường: open rate, lookup success rate, complaint count.

> Mỗi feature trong phase plan phải explicit chỉ ra phục vụ persona nào, tránh build "cho ai cũng được" → không ai dùng.

---

## 6. Top 10 RICE Features (baseline đã đánh giá)

| # | Feature | RICE | Phase mapped |
|---|---|---|---|
| 1 | Phát hành 1-click POS/Web | 68.400 | Phase 1 (parity) |
| 2 | Auto-fill MST từ Customer Profile | 57.600 | Phase 2 |
| 3 | UI portal Haravan Admin | 36.000 | Phase 1 |
| 4 | Compliance Center | 36.000 | Phase 1 (MVP) → Phase 2 (full) |
| 5 | Dashboard omnichannel | 36.300 | Phase 2 |
| 6 | Gộp đơn lẻ cuối ngày (TT78/TT32) | 34.000 | Phase 2 |
| 7 | Wizard xử lý sai sót | 33.600 | Phase 2 |
| 8 | AI cảnh báo rủi ro NCC | 28.000 | Phase 3 |
| 9 | Gateway service | 25.300 | Phase 1 |
| 10 | AI tiền-kiểm | 25.200 | Phase 3 |

> RICE phải được **recompute lại đầu mỗi phase** với data thật từ phase trước (Reach, Impact, Confidence điều chỉnh theo merchant feedback). Phase plan nào đổi priority phải justify trong section "Changes from baseline".

---

## 7. Ràng buộc tuyệt đối

1. **KHÔNG reimplement T-VAN function của Hilo.** Mọi nghiệp vụ pháp lý (ký số, truyền CQT, lưu trữ XML) đều qua Hilo API.
2. **KHÔNG lưu XML pháp lý gốc tại Haravan.** Chỉ lưu metadata + URL/ID trỏ về Hilo. Tránh tranh chấp vai trò T-VAN với CQT.
3. **TUÂN THỦ tuyệt đối** NĐ 123/2020 + TT 78/2021 + QĐ 1510/2022 + **NĐ 70/2025** + **TT 32/2025**. Theo dõi sát **dự thảo nghị định 2026** thay thế NĐ 123+70 (Bộ Tư pháp công bố tài liệu thẩm định 21/4/2026).
4. **THIẾT KẾ multi-T-VAN abstraction từ Day 1.** Adapter pattern cho HiloAdapter, ViettelAdapter, MISAAdapter — Phase 1 chỉ implement HiloAdapter, nhưng interface phải đủ rộng.
5. **ƯU TIÊN tiếng Việt** cho UI và copywriting. Technical docs/ADR có thể tiếng Anh nếu team thấy hiệu quả hơn.
6. **TEAM 8-10 người baseline:** 1 PM, 1 Tech Lead, 3-4 Backend, 2 Frontend, 1 Designer, 1 QA. Phase 3 + 1-2 ML Engineer. Phase 4 + 1 DevRel.
7. **Bảo mật:** không log MST, số tài khoản, dữ liệu nhạy cảm cá nhân. Encryption at rest + transit. Audit log mọi thao tác có thể tracking.

---

## 8. Framework bắt buộc — Double Diamond

Mọi phase PHẢI áp dụng Double Diamond như shape của output:

**DIAMOND 1 — Problem Space**
- **DISCOVER:** research rộng, hiểu vấn đề, không kết luận sớm. Output: raw findings + evidence.
- **DEFINE:** hội tụ vấn đề, viết "How Might We" statement rõ ràng. Output: problem statement, validated/invalidated assumptions, constraint map.

**DIAMOND 2 — Solution Space**
- **DEVELOP:** brainstorm giải pháp rộng, prototype, không cam kết. Output: 2-3 alternatives với pros/cons trade-off.
- **DELIVER:** hội tụ giải pháp, plan triển khai chi tiết. Output: roadmap với owner, timeline, metric, runbook, rollback plan.

> Nếu phase nào skip Discover/Define mà nhảy thẳng vào Develop, **đó là red flag** — nhiều khả năng đang build cho assumption chưa validate.

---

## 9. Output format chuẩn cho mọi deliverable

Mỗi phase plan, mỗi prompt response từ AI, mỗi ADR phải có:

1. **Executive Summary** (5-7 dòng): tldr cho exec.
2. **Discover findings**: bullet với evidence link/quote/source.
3. **Define problem statements**: dạng "How Might We…" hoặc "Problem: …".
4. **Develop solution options**: ≥2 options, pros/cons, recommendation kèm rationale.
5. **Deliver plan**: timeline, owner, metric, dependencies.
6. **Risks & Mitigations**: ≥5 risks với severity + mitigation owner.
7. **Handoff to next phase**: assumptions chuyển giao, dependencies, open questions, decisions deferred.

---

## 10. Đối thủ & differentiation key (cập nhật từ research 5/2026)

**MISA meInvoice + AVA** (đối thủ trực diện ở segment SMB):
- Voice-based invoice creation
- AI Agent end-to-end: receipt → check → summarize → report
- Auto recognize file structure (no manual mapping)
- Auto accounting entry với learning loop (sửa 1 lần → AI nhớ)
- Auto bank reconciliation
- Risk supplier list (MST ngừng hoạt động, rủi ro cao)
- Tích hợp sâu với MISA AMIS Kế toán → moat lớn cho segment có dùng MISA accounting

**Viettel SInvoice / VNPT Invoice / EFY-iHOADON** (T-VAN truyền thống):
- Mạnh về compliance, gói pricing đa dạng theo volume
- Yếu về UX hiện đại, không có AI sâu, không có ecosystem commerce
- Tích hợp ERP (SAP, MISA, Fast) nhưng chủ yếu dạng connector tĩnh

**Hilo** (đối tác hiện tại):
- T-VAN ổn định, có gói cho doanh nghiệp lớn (hospital, UPS, Haravan, Payoo)
- Self-design template invoice
- API tích hợp SAP/CRM/ERP (không có public docs → cần lấy qua partnership)
- Pricing 750k–4M VND/gói tùy volume

**Differentiation Haravan có thể bám:**
1. **Commerce-native AI**: AI hiểu Order/Product/Customer của Haravan → auto-fill, auto-classify chính xác hơn AVA của MISA (vốn AI từ kế toán nhìn ra).
2. **Omnichannel context**: data từ POS + Web + Marketplace → dashboard và insight không T-VAN nào có.
3. **Workflow F&B đặc thù**: tách/gộp bill, COD refund auto-handling, Zalo OA delivery — MISA không build cho commerce.
4. **Trải nghiệm tích hợp**: 1 click trong Haravan Admin, không thoát ra portal khác.
5. **Migration story**: enterprise dùng MISA AMIS Kế toán + Haravan POS + Hilo invoice → Haravan làm hub thống nhất.

---

## 11. Compliance landmark phải nắm 2025-2026

| Văn bản | Hiệu lực | Tác động |
|---|---|---|
| NĐ 123/2020/NĐ-CP | 1/7/2022 | Khung tổng về hóa đơn, chứng từ điện tử |
| TT 78/2021/TT-BTC | 1/7/2022 | Hướng dẫn chi tiết NĐ 123 |
| QĐ 1510/QĐ-TCT (2022) | 2022 | Format dữ liệu nghiệp vụ truyền nhận với CQT |
| **NĐ 70/2025/NĐ-CP** | **1/6/2025** | Sửa 40/61 điều NĐ 123. Hộ KD ≥1 tỷ/năm bắt buộc máy tính tiền kết nối CQT. Bỏ thủ tục hủy → chuyển sang điều chỉnh/thay thế. NCC nước ngoài tự nguyện đăng ký |
| **TT 32/2025/TT-BTC** | **1/6/2025** | Thay thế TT 78 |
| Dự thảo NĐ thay thế NĐ 123+70 | Đang thẩm định (4/2026) | Có thể banh hành trong 6-18 tháng. Phải monitor sát, plan có kịch bản react |

> **Implication cho roadmap:** Phase 1 phải support đầy đủ **hóa đơn từ máy tính tiền** (Haravan POS) theo NĐ 70/2025. Phase 2-3 phải build cơ chế **regulation update notifier** vì dự thảo 2026 sẽ thay đổi format/workflow.

---

## 12. Pricing & Business Model (giả định baseline)

Phase 1-2: **không thu thêm phí** từ merchant Haravan đang dùng Haravan Invoice. Cost gateway và team Haravan absorb như feature investment cho retention.

Phase 3 (AI): xem xét **AI pack** add-on (vd: 199k-499k/tháng) hoặc bundle vào gói Haravan cao cấp. Logic: AI cost (LLM inference) thật, không giveaway được long-term.

Phase 4 (Platform): **Public API** chia tier theo rate limit (Free / Pro / Enterprise). Partner Marketplace revenue share 70/30 hoặc listing fee tùy partner type.

Partnership Hilo:
- Phase 1: revenue share theo invoice volume hoặc flat partner fee.
- Phase 4: nếu mở multi-T-VAN, đàm phán Hilo về exclusive period hoặc preferred partner status.

---

## 13. Cách dùng prompt phase

**Bước 1:** Paste master này vào project knowledge (Claude Project / ChatGPT custom GPT / Cursor docs).

**Bước 2:** Gửi prompt phase tương ứng (Phase 0 → Phase 4) trong session đã có master context. Yêu cầu agent **xác nhận đã đọc master** trước khi output.

**Bước 3:** Sau mỗi phase, agent output Kickoff Brief cho phase sau. Lưu brief riêng làm input cho session tiếp theo.

**Bước 4:** Định kỳ chạy Audit Prompt (file `99_audit_framework.md`) để cross-check consistency giữa các phase.

**Bước 5:** Khi vibe coding (build code thật), dùng prompt trong folder `vibe_coding_prompts/`. Mỗi prompt là 1 feature self-contained, paste vào Claude Code / Cursor để generate code + test.

---

## 14. Glossary

- **T-VAN**: Tổ chức cung cấp dịch vụ truyền nhận dữ liệu hóa đơn điện tử với cơ quan thuế.
- **CQT**: Cơ quan thuế (General Department of Taxation).
- **MST**: Mã số thuế.
- **HKD**: Hộ kinh doanh.
- **NĐ / TT / QĐ**: Nghị định / Thông tư / Quyết định.
- **Inbound invoice**: Hóa đơn đầu vào (mua từ NCC).
- **Outbound invoice**: Hóa đơn đầu ra (bán cho khách).
- **Idempotency**: Tính chất 1 thao tác lặp nhiều lần cùng kết quả như 1 lần.
- **Circuit breaker**: Pattern ngắt mạch khi downstream service down để không cascade failure.
- **Adapter pattern**: Design pattern wrap các API khác nhau dưới interface chung.

---

## 15. Change log

| Version | Date | Change | Author |
|---|---|---|---|
| v1.0 | 2026-05-13 | Initial baseline. Refined từ invoice_research.md với research 5/2026 (NĐ 70, TT 32, MISA AVA features mới, Hilo pricing) | Tody |

---

> **Reminder cho AI:** Sau khi đọc xong master này, xác nhận bằng 1 câu rồi chờ phase prompt. Trong mỗi phase response, đầu tiên ghi `**Tham chiếu:** Master Context v1.0 — đã load.` Nếu phát hiện conflict với phase trước, flag rõ ngay đầu response, không tự ý "fix".
