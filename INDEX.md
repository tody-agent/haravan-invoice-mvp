# Haravan Invoice Wrapper — Master Plan Index
**Phiên bản:** v1.0 · **Ngày:** 13/05/2026 · **Owner:** Tody

> Bộ kế hoạch hoàn chỉnh cho dự án Haravan Invoice Wrapper trên nền T-VAN Hilo. Bắt đầu từ file `00_master_context.md`, sau đó đọc theo thứ tự phase, cuối cùng dùng `vibe_coding_prompts/` khi build code.

---

## 📋 Cấu trúc thư mục

```
Invoice/
├── INDEX.md                      ← bạn đang ở đây
├── invoice_research.md           ← file gốc (bộ prompt template)
│
├── 00_master_context.md          ← Single source of truth, dán vào project knowledge của AI
├── 01_phase0_discovery.md        ← Foundation & Discovery (4-6 tuần)
├── 02_phase1_parity.md           ← Parity & Foundation (3 tháng)
├── 03_phase2_differentiation.md  ← Differentiation (3-4 tháng)
├── 04_phase3_intelligence.md     ← Intelligence / AI (4-5 tháng)
├── 05_phase4_platform.md         ← Platform & Ecosystem (3-4 tháng)
├── 99_audit_framework.md         ← Cross-phase consistency check
│
└── vibe_coding_prompts/          ← Prompt sẵn sàng paste vào Claude Code / Cursor
    ├── README.md                 ← Hướng dẫn dùng
    ├── 00_setup_repo_and_ci.md
    ├── 01_gateway_scaffold.md
    ├── 02_portal_ui_scaffold.md
    ├── 03_hilo_adapter_multi_tvan.md
    ├── 04_one_click_pos_web_issue.md
    ├── 05_autofill_mst_customer_profile.md
    ├── 06_gop_don_le_cuoi_ngay.md
    ├── 07_dashboard_omnichannel.md
    ├── 08_zalo_oa_invoice_delivery.md
    ├── 09_wizard_xu_ly_sai_sot.md
    ├── 10_compliance_center_audit_trail.md
    ├── 11_ai_tien_kiem.md
    ├── 12_ai_canh_bao_ncc.md
    ├── 13_inbound_invoice_ai.md
    ├── 14_ai_copilot_chat.md
    └── 15_automation_builder_no_code.md
```

---

## 🚀 Quy trình dùng (5 bước)

**Bước 1 — Setup project knowledge.** Paste `00_master_context.md` vào project knowledge của AI tool (Claude Project, ChatGPT custom GPT, Cursor docs). Đây là context anchor xuyên suốt dự án.

**Bước 2 — Chạy phase plan tuần tự.** Mỗi phase có session riêng:
- Trước session: paste lại Master Context + Kickoff Brief từ phase trước
- Trong session: paste phase plan tương ứng (`01_phase0_discovery.md`, …)
- Sau session: lưu Kickoff Brief output → input cho phase tiếp theo

**Bước 3 — Audit định kỳ.** Sau khi có draft đủ 5 phase, chạy `99_audit_framework.md` qua AI agent với 7 file phase. Nhận audit report → fix → version bump.

**Bước 4 — Vibe coding.** Khi đến giai đoạn build code, dùng `vibe_coding_prompts/` per feature. Mỗi prompt là 1 feature self-contained: scope rõ, AC, file structure đề xuất, prompt template paste vào Claude Code/Cursor, verification checklist.

**Bước 5 — Version control.** Mỗi update file: bump version (v1.0 → v1.1), log change ở cuối file. Conflict giữa phase plan và master → master phải được cập nhật trước, không drift ngầm.

---

## 📊 Tổng quan timeline

| Phase | Thời lượng | Team | Theme | Output chính |
|---|---|---|---|---|
| **0** | 4-6 tuần | 4-5 | Foundation & Discovery | 5 ADR + Partnership Hilo + Research Report + Phase 1 Backlog |
| **1** | 3 tháng | 8 | Sở hữu lại trải nghiệm | Gateway production + Portal UI v1 + 100% migration |
| **2** | 3-4 tháng | 8-10 | Lý do chọn Haravan | 8 features đặc thù Haravan ecosystem |
| **3** | 4-5 tháng | 10-12 (+ML) | AI biến hóa đơn thành insight | 5 AI features |
| **4** | 3-4 tháng | 10-12 (+DevRel) | Nền tảng mở | Multi-T-VAN, Public API, Automation Builder, Marketplace |

**Tổng:** 17-22 tháng lý tưởng, realistic 24 tháng (cộng buffer 20%).

---

## 🎯 Nguyên tắc xuyên suốt (từ Master)

1. **KHÔNG reimplement T-VAN** của Hilo — chỉ gọi API
2. **KHÔNG lưu XML pháp lý** tại Haravan — chỉ metadata
3. **TUÂN THỦ tuyệt đối** NĐ 123 + TT 78 + QĐ 1510 + **NĐ 70/2025** + **TT 32/2025**, monitor dự thảo NĐ 2026
4. **THIẾT KẾ multi-T-VAN abstraction** từ Day 1 (adapter pattern)
5. **ƯU TIÊN tiếng Việt** UI, technical docs có thể tiếng Anh
6. **Double Diamond** mọi phase: Discover → Define → Develop → Deliver

---

## 🏗️ Top 10 RICE Features → Phase mapping

| # | Feature | RICE | Phase | Vibe prompt |
|---|---|---|---|---|
| 1 | Phát hành 1-click POS/Web | 68.400 | 1 | `04_one_click_pos_web_issue.md` |
| 2 | Auto-fill MST từ Customer Profile | 57.600 → 81.000 | 2 | `05_autofill_mst_customer_profile.md` |
| 3 | UI portal Haravan Admin | 36.000 | 1 | `02_portal_ui_scaffold.md` |
| 4 | Compliance Center | 36.000 | 1 (MVP) → 2 | `10_compliance_center_audit_trail.md` |
| 5 | Dashboard omnichannel | 36.300 | 2 | `07_dashboard_omnichannel.md` |
| 6 | Gộp đơn lẻ cuối ngày | 34.000 | 2 | `06_gop_don_le_cuoi_ngay.md` |
| 7 | Wizard xử lý sai sót | 33.600 | 2 | `09_wizard_xu_ly_sai_sot.md` |
| 8 | AI cảnh báo rủi ro NCC | 28.000 | 3 | `12_ai_canh_bao_ncc.md` |
| 9 | Gateway service | 25.300 | 1 | `01_gateway_scaffold.md` + `03_hilo_adapter_multi_tvan.md` |
| 10 | AI tiền-kiểm | 25.200 | 3 | `11_ai_tien_kiem.md` |

---

## 🔑 Compliance landmark cần track

| Văn bản | Hiệu lực | Tác động |
|---|---|---|
| NĐ 123/2020/NĐ-CP | 1/7/2022 | Khung tổng |
| TT 78/2021/TT-BTC | 1/7/2022 | Hướng dẫn chi tiết |
| QĐ 1510/QĐ-TCT | 2022 | Format dữ liệu CQT |
| **NĐ 70/2025/NĐ-CP** | **1/6/2025** | Sửa 40/61 điều NĐ 123. HKD ≥1B doanh thu bắt buộc máy tính tiền. Bỏ thủ tục hủy → điều chỉnh/thay thế |
| **TT 32/2025/TT-BTC** | **1/6/2025** | Thay thế TT 78 |
| Dự thảo NĐ thay thế NĐ 123+70 | Đang thẩm định 4/2026 | Có thể banh hành 6-18 tháng tới — phải có process monitor |

---

## 📦 Differentiation vs đối thủ (May 2026 snapshot)

**MISA meInvoice + AVA** (đối thủ #1 segment SMB):
- Mạnh: AI Agent end-to-end, Auto accounting với learning, Risk supplier list, Voice creation
- Yếu: không có ecosystem commerce native, không sở hữu kênh bán

**Viettel SInvoice / VNPT / EFY**:
- Mạnh: compliance ổn định, pricing theo volume
- Yếu: UX cũ, không AI sâu, không ecosystem

**Hilo** (partner):
- Mạnh: T-VAN ổn định, gói enterprise (hospital, UPS, Haravan, Payoo)
- Yếu: không UX native, không AI

**Haravan win game ở:**
1. Commerce-native AI: hiểu Order/Product/Customer Haravan
2. Omnichannel data: POS + Web + Marketplace
3. Workflow F&B đặc thù: tách/gộp bill, COD refund auto, Zalo OA
4. Trải nghiệm tích hợp: 1 click trong Haravan Admin
5. Migration story: enterprise hub thống nhất

---

## ✅ Checklist trước khi kickoff Phase 0

- [ ] PM/Tech Lead/CTO/Head of Product đọc xong Master Context
- [ ] 4-5 người team Phase 0 sẵn sàng (PM, Tech Lead, 1 BE, 1 Designer, 1 Researcher)
- [ ] External legal counsel commit thời gian (compliance review)
- [ ] Hilo contact đã warm, NDA template sẵn sàng ký
- [ ] Beta merchant pool 10-15 candidate đã pre-identified
- [ ] Budget Phase 0 approved (ước tính: salary 4-5 người × 6 tuần + legal counsel + research voucher merchant)
- [ ] JIRA project + Slack channel + repo placeholder khởi tạo

Khi tất cả ✓ → kickoff Phase 0 với Master + `01_phase0_discovery.md`.
