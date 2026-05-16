# AGENTS.md — Hướng dẫn AI agent dùng OpenSpec workflow này

Nếu bạn là AI agent (Claude Code, Cursor, Windsurf, Cline, Aider…) đang làm việc với repo này, đọc kỹ trước khi bắt đầu.

## OpenSpec là gì

OpenSpec là quy ước spec-driven dev cho AI agent. Mọi change đáng kể phải được mô tả trong `openspec/changes/` TRƯỚC khi viết code, để:

1. **Người duyệt** nhìn vào spec biết bạn sẽ làm gì, không bị bất ngờ.
2. **Bạn (AI)** có cấu trúc rõ ràng để bám theo, không drift.
3. **Spec hiện tại** trong `openspec/specs/` luôn phản ánh trạng thái thật của hệ thống.

## Cấu trúc thư mục

```
openspec/
├── project.md            ← bối cảnh dự án, đọc đầu tiên
├── AGENTS.md             ← file này
├── specs/                ← TRUTH: hệ thống ĐANG là gì (current state)
│   └── <capability>/
│       └── spec.md       ← requirements format
└── changes/              ← PROPOSALS: hệ thống NÊN thay đổi gì
    └── <change-name>/
        ├── proposal.md   ← WHY + WHAT
        ├── tasks.md      ← HOW (actionable checklist)
        ├── design.md     ← technical decisions (optional)
        └── specs/
            └── <capability>/
                └── spec.md  ← DELTA requirements (ADDED/MODIFIED/REMOVED)
```

## Quy trình bạn PHẢI tuân theo

### Khi nhận task mới

1. **Đọc `project.md`** để nắm context, stack, conventions, ràng buộc.
2. **Liệt kê** các change đang mở trong `openspec/changes/`. Nếu task user đã có change tương ứng → tham chiếu nó.
3. **Đọc `specs/`** liên quan để biết hệ thống hiện trạng, tránh duplicate hoặc conflict.
4. Nếu task **chưa có** change tương ứng và scope > trivial → đề xuất tạo change mới qua proposal.md TRƯỚC khi code.

### Khi làm change đã có sẵn

1. Đọc `proposal.md` để hiểu WHY.
2. Đọc `design.md` để biết tech choice + constraint.
3. Theo `tasks.md` checklist, làm từng item, đánh dấu ✓ khi xong.
4. Tham chiếu `changes/<name>/specs/` để biết requirement chính xác.
5. KHÔNG sửa file ngoài scope change trừ khi cần thiết và document rõ.
6. Khi change hoàn thành & merge: chuyển spec từ `changes/<name>/specs/` sang `openspec/specs/` (apply delta).

### Format requirement trong spec.md

Dùng cấu trúc Requirement/Scenario:

```markdown
### Requirement: SHALL hiển thị danh sách hóa đơn với filter

Trang Danh sách hóa đơn SHALL cho phép user filter theo period, status,
channel, customer.

#### Scenario: Filter theo period mặc định 30 ngày
- WHEN user mở trang Danh sách lần đầu
- THEN system hiển thị hóa đơn 30 ngày gần nhất

#### Scenario: Filter rỗng kết quả
- WHEN filter không match invoice nào
- THEN system hiển thị empty state với CTA "Phát hành hóa đơn đầu tiên"
```

Trong delta (changes/<name>/specs/), dùng prefix:
- `### ADDED Requirement: …` cho requirement mới
- `### MODIFIED Requirement: …` cho thay đổi (kèm reasoning trong "Notes")
- `### REMOVED Requirement: …` cho gỡ

### Tone of voice

- Tiếng Việt cho prose, glossary nghiệp vụ Việt (hóa đơn, MST, thuế suất).
- Tiếng Anh cho identifier code (function, file, prop name) + thuật ngữ kỹ thuật phổ biến (component, state, hook).
- Concise — không "cảm ơn" mỗi câu trả lời, không markdown bloat.
- Mark uncertainty bằng `// TODO: verify` hoặc `?` rõ ràng. KHÔNG bịa.

## Khi nào cần hỏi user

**Hỏi (qua AskUserQuestion hoặc inline):**
- Khi task ambiguous về scope (vd: "thêm bulk action" — mà bulk action là gì cụ thể?)
- Khi tech choice có trade-off lớn không document trong design.md
- Khi compliance/legal — KHÔNG đoán

**Không hỏi:**
- Khi đã có rõ trong project.md / proposal.md / design.md
- Detail nhỏ (naming, ordering nhỏ) — quyết định và document trong PR

## Verification checklist trước khi commit

- [ ] Đã update `tasks.md` với ✓ cho item hoàn thành
- [ ] Code khớp với requirement trong `changes/<name>/specs/`
- [ ] Không touch file ngoài scope (hoặc document rõ tại sao)
- [ ] i18n: string mới đều trong locale file
- [ ] Accessibility: ARIA labels, keyboard nav, contrast pass
- [ ] Dark mode work
- [ ] Mock data realistic (không Lorem Ipsum)
- [ ] Test smoke pass

## Chạy validation

Khi OpenSpec CLI có sẵn, chạy:
```
openspec validate <change-name> --strict
```

Nếu CLI chưa setup, manual check:
- proposal.md có đủ section: Why / What Changes / Impact
- tasks.md là checklist actionable, không vague
- design.md có tech choice với rationale
- specs delta dùng đúng prefix ADDED/MODIFIED/REMOVED

## Common pitfalls

1. **Sửa specs/ trực tiếp** thay vì qua change → no audit trail, history mất.
2. **Code trước khi spec** → spec viết sau biased theo code, mất giá trị review.
3. **Bịa Hilo / CQT API** vì không có doc thật → tạo bug ngầm. Mark TODO + skip.
4. **Skip i18n** "vì là prototype" → khi convert production phải redo, tốn 2x.
5. **Hardcode color** thay vì CSS variable → dark mode break, theme swap break.

## Liên hệ với plan documents project

Project có 7 file plan ngoài openspec:
- `00_master_context.md` (single source of truth dự án)
- `01_phase0_discovery.md` … `05_phase4_platform.md` (5 phase plan)
- `99_audit_framework.md` (cross-phase audit)

Khi viết spec hoặc tasks, **luôn tham chiếu** số phase + tên feature từ plan files để traceability. Vd: "Implement Wizard sai sót theo Phase 2 §Feature 3, mapping với prompt `vibe_coding_prompts/09_wizard_xu_ly_sai_sot.md`".
