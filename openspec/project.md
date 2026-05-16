# Project Context — Haravan Invoice Wrapper Prototype

## Sản phẩm

Prototype clickable cho **Haravan Invoice Wrapper** — giải pháp App Portal Wrapper trên nền T-VAN Hilo, mục tiêu là Haravan làm chủ trải nghiệm hóa đơn điện tử cho 80k+ merchant của mình. Prototype phục vụ 4 mục đích:

1. **Stakeholder demo** (CTO, Head of Product, Hilo partnership team) — minh họa vision trước khi commit Phase 0 budget.
2. **Merchant interview prop** — dùng làm visual aid trong 20-30 buổi phỏng vấn merchant Phase 0.
3. **UX baseline cho Phase 1 build** — designer/dev tham chiếu khi convert sang code production.
4. **Vibe coding seed** — paste mockup HTML vào AI agent code (Claude Code/Cursor) để generate component thật.

Prototype **không phải** production code, không cần connect backend thật. Dùng mock data + state in-browser. Mục tiêu là look-and-feel + flow chuẩn, không phải hiệu năng/security.

## Phạm vi hiện tại (baseline)

File `prototype/haravan_invoice_admin_mockup.html` — 1 file standalone HTML, 6 màn hình admin (Tổng quan, Danh sách, Phát hành mới, Wizard sai sót, Tuân thủ, Kết nối T-VAN), Copilot floating widget.

## Phạm vi mở rộng (change `expand-prototype-fidelity`)

Thêm 13 use case mới + nâng độ chân thực: real Hara DS, microinteraction, mock API, i18n, accessibility, multi-persona demo.

## Stack đề xuất

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui (proxy cho Hara DS chưa có npm public)
- **Routing:** TanStack Router (file-based)
- **State:** TanStack Query + Zustand (UI state nhẹ)
- **Mock API:** MSW (Mock Service Worker) — intercept fetch, trả mock data
- **i18n:** react-i18next với vi-VN primary
- **Icons:** Tabler Icons (outline only)
- **Testing:** Vitest + Testing Library (smoke test, không full coverage)

Quyết định stack chi tiết trong `openspec/changes/expand-prototype-fidelity/design.md`.

## Conventions

- **Ngôn ngữ UI:** tiếng Việt (vi-VN). String trong locale file, không hardcode.
- **Code:** TypeScript strict. Component PascalCase. File kebab-case.
- **Naming domain:** dùng từ vựng nghiệp vụ Việt (hóa đơn, MST, thuế suất, gộp đơn) — không dịch sang Anh trừ khi phổ biến hơn (T-VAN, OAuth, idempotency).
- **Component:** prefer composition over configuration. Mỗi component <200 dòng.
- **Mock data:** real Vietnamese MST + tên doanh nghiệp + địa chỉ + sản phẩm. Tránh "John Doe" / "Lorem Ipsum".
- **Dark mode:** mandatory, switch qua system preference + manual toggle.
- **Responsive:** desktop primary (≥1280px), tablet POS (768-1024px), mobile fallback (375px+).

## Ràng buộc

- KHÔNG call Hilo / CQT API thật trong prototype. Tất cả data mock.
- KHÔNG lưu PII thật vào localStorage / cookies.
- KHÔNG bịa quy định pháp luật — chỉ tham chiếu NĐ 123, NĐ 70/2025, TT 32/2025, QĐ 1510 thật.
- KHÔNG mô phỏng hành vi compliance sai (vd: cho phép "hủy" hóa đơn — đã bỏ theo NĐ 70).

## Stakeholders

- **PM:** Tody — owner sản phẩm, decide scope/priority
- **Tech Lead:** TBD — review architecture decision
- **Designer:** TBD — duyệt visual + Hara DS compliance
- **Reviewer:** Head of Product, CTO — approve major change

## Liên hệ với plan documents

Prototype này là 1 deliverable riêng, sống song song với plan files (`00_master_context.md` … `05_phase4_platform.md`). Khi plan thay đổi:
- Master Context update → AGENTS.md trong openspec phải cập nhật
- Feature priority đổi → tasks.md trong change tương ứng phải re-prioritize
- Compliance change → spec.md cập nhật ngay

## Repo layout liên quan

```
Invoice/
├── prototype/
│   ├── README.md
│   ├── haravan_invoice_admin_mockup.html  ← v1.0 baseline
│   └── (sau khi expand-prototype-fidelity hoàn thành: src/, public/, package.json, ...)
└── openspec/
    ├── project.md            ← bạn đang ở đây
    ├── AGENTS.md             ← hướng dẫn AI agent
    ├── specs/
    │   └── prototype/
    │       └── spec.md       ← current state requirements
    └── changes/
        └── expand-prototype-fidelity/
            ├── proposal.md
            ├── tasks.md
            ├── design.md
            └── specs/
                └── prototype/
                    └── spec.md  ← delta requirements
```
