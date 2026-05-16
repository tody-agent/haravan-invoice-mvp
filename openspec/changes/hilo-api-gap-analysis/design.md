# Design: Haravan Invoice Thick Gateway — Option B

## Decision Record
- **Decision:** Option B — Thick Gateway, self-sufficient
- **Reason:** Hilo sẽ không mở thêm API. Chỉ request must-have endpoints + webhook.
- **Date:** 2026-05-16

---

## 1. Context & Technical Approach

### Chiến lược: "Thick Gateway, Thin Adapter"

Haravan tự build 80%+ logic. HiloAdapter chỉ gọi **4 API core hiện có** (auth, send, sendpos, get/getsuccess). Mọi thứ khác (validation, reporting, PDF, state management, event system) — Haravan own.

### Must-Have API Request cho Hilo (chỉ 5 items)

| # | Request | Lý do | Fallback nếu Hilo từ chối |
|---|---------|-------|---------------------------|
| 1 | **XML Schema cho MLTDiep** (các loại thông điệp: phát hành, thay thế, điều chỉnh) | Không có → không gửi được XML đúng format | Reverse-engineer từ sandbox |
| 2 | **Error code catalog** đầy đủ | Map lỗi cho user, retry logic | Build từ trial-and-error |
| 3 | **Sandbox credentials** + test URL | Test integration | Dùng production test account |
| 4 | **Webhook: invoice status changed** | Real-time status update | Polling `get` mỗi 30s |
| 5 | **PDF download URL** hoặc API | Preview cho user | Tự render PDF từ metadata |

> Ngoài 5 items này → KHÔNG request thêm. Tự build hết.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PORTAL UI (React)                     │
│  Dashboard │ Invoice List │ Issue │ Wizard │ Compliance  │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────────┐
│              HARAVAN INVOICE GATEWAY (Workers)            │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐ │
│  │Validation│ │ Invoice  │ │ Reporting │ │  Event    │ │
│  │ Engine   │ │ Service  │ │  Engine   │ │  Bridge   │ │
│  └──────────┘ └──────────┘ └───────────┘ └───────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐ │
│  │  PDF     │ │ Audit    │ │  Config   │ │  Queue    │ │
│  │ Renderer │ │  Logger  │ │  Service  │ │ (Retry)   │ │
│  └──────────┘ └──────────┘ └───────────┘ └───────────┘ │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐   │
│  │          TVANAdapter Interface                    │   │
│  │  ┌─────────────┐  ┌──────────────┐               │   │
│  │  │ HiloAdapter │  │ MockAdapter  │               │   │
│  │  │ (4 API only)│  │ (testing)    │               │   │
│  │  └─────────────┘  └──────────────┘               │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────┐   ┌──────────────────────┐
│     METADATA DB             │   │    HILO API          │
│  D1: invoices, audit,       │   │  4 endpoints only:   │
│      config, customers      │   │  - gettoken          │
│  R2: PDF cache              │   │  - send              │
│  KV: session, idempotency   │   │  - sendpos           │
│                             │   │  - get/getsuccess    │
└─────────────────────────────┘   └──────────────────────┘
```

---

## 3. Proposed Changes — 8 Gateway Modules

### Module 1: Validation Engine (tự build)
**Thay thế:** Hilo không có validate API
- MST format validation (10/13 chữ số, checksum Tổng cục Thuế)
- Invoice completeness check (buyer, items, totals)
- Tax rate validation (0%, 5%, 8%, 10%, KCT, KKKNT)
- NĐ 70/2025 compliance rules (không cho hủy, chỉ thay thế/điều chỉnh)
- Amount-in-words generator (VND)
- Pre-issue validation gate (block invalid trước khi gửi Hilo)

### Module 2: Invoice Service (core)
- CRUD invoice trong Haravan DB (source of truth cho metadata)
- Status state machine: `draft → pending → issued → cqt_accepted → cqt_rejected → adjusted → replaced`
- Idempotency via `X-Idempotency-Key` + KV store
- Map canonical invoice → Hilo XML → call adapter
- Handle Hilo response → update local state

### Module 3: Polling→Event Bridge (thay webhook)
**Thay thế:** Hilo không có webhook
- Background worker poll `GET /get` mỗi 30s cho pending invoices
- Diff detection: status changed → emit internal event
- Event types: `invoice.issued`, `invoice.rejected`, `invoice.status_changed`
- Backoff: poll mỗi 30s khi có pending, mỗi 5m khi idle
- Portal UI subscribe events via SSE hoặc TanStack Query polling

### Module 4: PDF Renderer (tự build hoặc Hilo PDF)
**Thay thế:** Hilo không có PDF API
- Primary: request Hilo cung cấp PDF URL (must-have #5)
- Fallback: tự render PDF từ invoice metadata
  - Template engine (Handlebars/React-PDF)
  - QĐ 1510 format compliance
  - QR code CQT verification
- Cache PDF trong R2 storage

### Module 5: Reporting Engine (tự build)
**Thay thế:** Hilo không có reporting API
- Aggregate từ Haravan DB (D1)
- 6 báo cáo theo user guide:
  1. Thống kê tổng hợp
  2. Bảng kê hàng tháng
  3. Chi tiết bán hàng
  4. Báo cáo xóa bỏ (→ thay thế, theo NĐ 70)
  5. Báo cáo sửa đổi (điều chỉnh)
  6. Báo cáo thay thế

### Module 6: Audit Logger
- Mọi action → audit_logs table
- Fields: who, when, action, invoice_id, ip, user_agent, details
- Immutable append-only
- Compliance Center UI query audit trail

### Module 7: Config Service
- Merchant settings: auto_issue_on_paid, default_tax_rate, T-VAN provider
- Invoice templates/patterns (mẫu số, ký hiệu) — config không API
- Persist D1, cache KV 1h

### Module 8: XML Builder (critical, tự build)
**Thay thế:** Hilo không document XML schema
- Build XML theo QĐ 1510 format
- Support MLTDiep types: phát hành mới, thay thế, điều chỉnh tăng, điều chỉnh giảm
- Reverse-engineer từ Hilo sandbox responses
- Unit test: XML validate against XSD schema CQT

---

## 4. Assumptions (cần verify)

| # | Assumption | Status | Verify how |
|---|-----------|--------|------------|
| A1 | `apitctn.hilo.com.vn` là test/sandbox URL | ❓ Needs confirm | Hỏi Hilo |
| A2 | `send` API accept XML cho thay thế/điều chỉnh (MLTDiep khác nhau) | ❓ Needs confirm | Test sandbox |
| A3 | `XmlReceive` trong `get` response chứa full XML pháp lý | ❓ Needs confirm | Test sandbox |
| A4 | Token expiration ~1h (typical OAuth) | ❓ Needs confirm | Test sandbox |
| A5 | QĐ 1510 XSD schema public available | ✅ Verified | Tổng cục Thuế website |
| A6 | Hilo ký HSM thay merchant (merchant không cần USB token) | ❓ Critical | Hỏi Hilo |

---

## 5. Verification

- [ ] Gateway scaffold `/v1/health` return 200 (DB + KV + Hilo ping)
- [ ] MockAdapter E2E: issue → query → replace → adjust
- [ ] HiloAdapter: auth → send → get/getsuccess với sandbox
- [ ] Validation engine: 20+ test cases (MST, amounts, tax rates)
- [ ] XML Builder: output validate against QĐ 1510 XSD
- [ ] Polling bridge: detect status change within 60s
- [ ] PDF render: output match template, QR code valid
- [ ] Reporting: 6 reports generate from test data
- [ ] Audit: every action logged, immutable
- [ ] One-click issue: POS + Admin < 3s p95
