# Vibe Coding Prompts — Haravan Invoice Wrapper

Bộ prompt sẵn sàng paste vào AI agent code (Claude Code / Cursor / Windsurf / Cline) để build từng feature trong roadmap. Mỗi file là 1 prompt self-contained, có scope rõ, acceptance criteria, file structure đề xuất, và test cases.

---

## Cách dùng

**Bước 1 — Setup project knowledge.** Trong AI tool, load:
- `00_master_context.md` (project knowledge / system prompt)
- Phase plan tương ứng (vd: `02_phase1_parity.md` cho feature Phase 1)
- File prompt feature cụ thể trong folder này

**Bước 2 — Paste prompt.** Mỗi prompt mở đầu bằng `# FEATURE PROMPT — <tên>`. Paste full vào chat.

**Bước 3 — AI confirm context.** Yêu cầu AI xác nhận đã đọc Master + Phase Plan trước khi code. Nếu skip step này, AI sẽ generate code generic không khớp kiến trúc.

**Bước 4 — Iterate.** AI generate skeleton + key logic. Bạn review, refine, ask AI fill gap, write tests.

**Bước 5 — Verify.** Mỗi prompt có "Verification checklist" cuối. Run qua trước khi merge.

---

## Index — 16 prompts

### Phase 1 — Foundation
- `00_setup_repo_and_ci.md` — Khởi tạo repo, CI/CD pipeline, dev environment
- `01_gateway_scaffold.md` — Gateway service skeleton (REST API, OpenAPI spec)
- `02_portal_ui_scaffold.md` — Portal UI Haravan Admin module
- `03_hilo_adapter_multi_tvan.md` — Adapter pattern + HiloAdapter implement
- `04_one_click_pos_web_issue.md` — Phát hành 1 click từ POS/Web (top RICE)
- `10_compliance_center_audit_trail.md` — Compliance Center MVP + audit trail

### Phase 2 — Differentiation
- `05_autofill_mst_customer_profile.md` — Auto-fill MST từ Customer Profile
- `06_gop_don_le_cuoi_ngay.md` — Gộp đơn lẻ cuối ngày (TT 78/TT 32)
- `07_dashboard_omnichannel.md` — Dashboard omnichannel
- `08_zalo_oa_invoice_delivery.md` — Zalo OA delivery integration
- `09_wizard_xu_ly_sai_sot.md` — Wizard xử lý sai sót

### Phase 3 — AI
- `11_ai_tien_kiem.md` — AI tiền-kiểm trước phát hành
- `12_ai_canh_bao_ncc.md` — AI cảnh báo NCC rủi ro
- `13_inbound_invoice_ai.md` — Inbound module + AI classify

### Phase 4 — Platform
- `14_ai_copilot_chat.md` — AI Copilot Chat
- `15_automation_builder_no_code.md` — Automation Builder no-code

---

## Quy ước chung trong prompt

**Stack giả định** (chỉnh theo ADR-003 thực tế của team):
- Backend: Node.js + TypeScript + Express/Fastify
- DB: Postgres + Redis
- Queue: Kafka hoặc RabbitMQ
- Frontend: React + TypeScript + Hara DS
- Test: Vitest/Jest + Playwright
- Infra: Docker + K8s, observability OpenTelemetry

**Naming convention:**
- API path: `/v1/<resource>` kebab-case
- DB table: snake_case
- TS interface: PascalCase
- TS function: camelCase
- File: kebab-case.ts

**Conventional commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`

**Test coverage target:** ≥80% line, ≥70% branch.

---

## Tip để vibe coding hiệu quả

**Đừng paste 1 prompt khổng lồ rồi chờ AI làm hết.** Chia nhỏ:
1. Generate skeleton (file structure, interface)
2. Fill từng module một
3. Write test ngay sau mỗi module
4. Refactor sau cùng

**Khi AI lười / generic:** challenge cụ thể. Vd thay vì "viết function check MST", nói "viết function `validateMST(mst: string): { valid: boolean; reason?: string }` với rule: 10 hoặc 13 số, checksum theo công thức Tổng cục Thuế, return reason cụ thể nếu fail. Test cases: ['0123456789', '0123456789-001', 'abc', '12345', '']. Output TypeScript với JSDoc."

**Khi AI bịa API endpoint Hilo:** stop, paste API spec thật vào, regenerate. Đừng để AI guess API contract.

**Yêu cầu AI flag uncertainty:** "Nếu có chỗ nào bạn không chắc, comment `// TODO: verify` thay vì bịa."
