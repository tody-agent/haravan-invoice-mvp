# 02 — PHASE 1 PLAN: Parity & Foundation
**Tham chiếu:** Master Context v1.0 + Phase 0 Kickoff Brief
**Thời lượng:** 3 tháng (12 tuần) · **Team:** 8 người full squad
**Theme:** *"Sở hữu lại trải nghiệm mà không mất tính năng hiện có"*

---

## Executive Summary

Phase 1 chuyển 100% volume hóa đơn Haravan từ flow trực tiếp Hilo qua Gateway của Haravan, đồng thời thay UI Hilo embed bằng Portal UI native trong Haravan Admin. Mục tiêu duy nhất: **parity tuyệt đối** — không thiếu tính năng, không tệ hơn về latency/error rate, không tăng support ticket. Migration phased rollout 6 tuần với feature flag per-merchant, dual-write 30 ngày để verify consistency. Zero feature mới ở Phase 1 (mọi đề xuất "tiện thể làm luôn" reject) — feature mới để Phase 2. Risk lớn nhất: Hilo API edge case chưa biết hết (vd: hành vi khi CQT downtime) → mitigation = beta merchant friendly tuần 9-10 để stress test trước rollout.

---

## Pre-requisite từ Phase 0

- [ ] Sandbox Hilo + Partnership agreement đã ký
- [ ] ADR-001 đến 007 approved
- [ ] Phase 1 backlog ≥30 stories estimated
- [ ] Beta merchant pool 10-15 đã commit
- [ ] Design system Hara DS ready

Nếu thiếu bất kỳ pre-requisite nào → KHÔNG kickoff Phase 1, kéo dài Phase 0 thêm 1-2 tuần.

---

## DIAMOND 1 — PROBLEM SPACE

### DISCOVER (tuần 1-2)

**1. Current state mapping** — list mọi touchpoint Haravan ↔ Hilo hiện tại:

- Phát hành từ Order trên Web (auto khi order paid)
- Phát hành từ POS (manual button trong POS UI)
- Phát hành từ Admin (manual cho B2B order)
- Tra cứu trong Customer Profile
- Điều chỉnh / hủy (chỉ qua portal Hilo trực tiếp hiện tại)
- Inbound invoice (chưa có UI Haravan, chỉ qua Hilo)
- Webhook Hilo callback về Haravan: status change

Method: code archaeology + interview 3 engineer Haravan đã work với Hilo integration.

**2. Edge case inventory** — list ≥30 edge case từ support log:

- Hóa đơn pending Hilo >30 phút chưa CQT response
- Retry sau timeout (idempotency cần đảm bảo không double-issue)
- Ký số fail (token expire, certificate revoked)
- CQT từ chối (sai format, MST không hợp lệ, doanh nghiệp ngừng hoạt động)
- Customer thay đổi MST sau khi đã issue
- Order cancel sau khi đã issue → cần điều chỉnh giảm
- Refund partial → tách hóa đơn
- POS offline lúc cần phát hành
- Network timeout giữa Haravan ↔ Hilo
- Hilo update breaking change

**3. User behavior data** — phân tích log/analytics 6 tháng gần nhất:

- Distribution thời gian phát hành: peak hour, peak day, peak month?
- Funnel: bao nhiêu % flow phát hành drop off ở step nào?
- Top 10 reasons merchants liên hệ support về invoice?
- Average time-to-issue end-to-end?

**4. Risk assessment migration** — segment merchants theo risk:

- Tier A (high risk, low priority): enterprise volume cao, phải sleep mode, migrate cuối cùng.
- Tier B (medium risk): SMB regular, migrate giai đoạn 50%.
- Tier C (low risk, beta-friendly): merchants nhỏ, cooperative, migrate 1% pilot.

**5. Compliance verification** — checklist Portal Haravan có đáp ứng:

- Lưu trữ link/ID hóa đơn 10 năm? Yes (metadata DB).
- Audit trail mọi thao tác (issue, view, edit, delete)? Yes.
- Traceability: từ order → invoice → CQT confirmation, có đầy đủ chain không? Yes.
- Khả năng cung cấp dữ liệu khi CQT thanh tra: export full history dưới 24h? Yes.

### DEFINE (tuần 3)

**Problem statement chính:** *"Làm sao migrate 80k merchants Haravan từ flow Hilo trực tiếp sang Gateway + Portal Haravan trong 3 tháng, không downtime, không tăng error rate, NPS không giảm."*

**Định nghĩa parity** — feature checklist phải match 100% với trạng thái cũ:

| Feature | Hiện trạng (Hilo) | Phase 1 Target |
|---|---|---|
| Phát hành từ Order Web | ✓ auto qua Hilo iframe | ✓ auto qua Gateway, UI native |
| Phát hành từ POS | ✓ qua Hilo redirect | ✓ qua Gateway, UI native trong POS |
| Phát hành từ Admin | ✓ qua Hilo portal | ✓ trong Haravan Admin |
| Tra cứu | ✓ qua Hilo portal | ✓ trong Haravan Admin |
| Điều chỉnh | ✓ chỉ qua Hilo portal | ✓ trong Haravan Admin (call Hilo API) |
| Hủy → Thay thế | ✓ qua Hilo | ✓ qua Gateway theo NĐ 70/2025 (bỏ hủy) |
| Inbound invoice | ✓ chỉ Hilo portal | ✓ list view trong Haravan (Phase 2 xử lý) |
| Audit trail | ✗ không có ở Haravan | ✓ có (compliance log) |

**Success criteria measurable:**

- Latency p50 < 1.5s, p95 < 3s, p99 < 5s cho phát hành
- Error rate < 0.5% (matching hoặc tốt hơn baseline Hilo)
- NPS portal mới ≥ NPS cũ (không giảm)
- Support ticket parity gap = 0 (không tăng so với baseline)
- Migration rate: 80% merchants migrated trong 6 tuần đầu rollout

**Out-of-scope** (defer Phase 2): Auto-fill MST, Gộp đơn cuối ngày, Dashboard omnichannel, Zalo OA delivery, Wizard sai sót advanced, AI tiền-kiểm.

---

## DIAMOND 2 — SOLUTION SPACE

### DEVELOP (tuần 4-8)

#### 1. Gateway Service Design

**API Contract Haravan ↔ Gateway** — REST/JSON, các endpoint chính:

```
POST   /v1/invoices              # phát hành (idempotent qua header)
GET    /v1/invoices/{id}         # tra cứu chi tiết
GET    /v1/invoices              # list + filter
POST   /v1/invoices/{id}/replace # thay thế
POST   /v1/invoices/{id}/adjust  # điều chỉnh
GET    /v1/invoices/{id}/pdf     # download PDF
GET    /v1/invoices/{id}/xml     # download XML (proxy từ Hilo)
POST   /v1/inbound/sync          # trigger sync inbound
GET    /v1/inbound               # list inbound
GET    /v1/health                # health check
GET    /v1/audit?invoice_id=...  # compliance audit log
```

**API Mapping Gateway ↔ Hilo** — adapter pattern:

```typescript
interface TVANAdapter {
  issue(canonical: CanonicalInvoice, idempotencyKey: string): Promise<TVANResult>
  replace(originalId: string, canonical: CanonicalInvoice): Promise<TVANResult>
  adjust(originalId: string, adjustment: AdjustmentSpec): Promise<TVANResult>
  query(filter: QueryFilter): Promise<CanonicalInvoice[]>
  downloadPdf(id: string): Promise<Buffer>
  downloadXml(id: string): Promise<string>
  syncInbound(merchantId: string, fromDate: Date): Promise<CanonicalInvoice[]>
}

class HiloAdapter implements TVANAdapter { /* ... */ }
// Phase 4: ViettelAdapter, MISAAdapter
```

**Canonical Invoice Model** — data shape độc lập T-VAN, dễ map:

```yaml
invoice:
  haravan_id: HRV-INV-{merchant}-{seq}
  tvan_id: HILO-{...}             # populated sau khi issue
  tvan_provider: hilo|viettel|misa
  status: draft|pending|issued|cqt_accepted|cqt_rejected|adjusted|replaced
  issue_date: ISO8601
  buyer: { mst, name, address, email, phone }
  seller: { mst, name, address }
  items: [ { sku, name, qty, unit_price, tax_rate, discount, total } ]
  totals: { subtotal, tax, discount, grand_total }
  payment: { method, status, ref }
  metadata: { order_id, channel, branch_id, cashier_id }
  cqt: { confirmation_id, confirmation_at, error_code }
  audit: [...]
```

**Reliability patterns:**

- **Idempotency**: header `X-Idempotency-Key`, dedupe trong Redis 24h. Key format `{merchant_id}:{order_id}:{event_type}`.
- **Retry**: exponential backoff (1s, 2s, 4s, 8s, 16s, max 5 attempts) với jitter ±25%. Chỉ retry khi 5xx hoặc network error, không retry 4xx.
- **Circuit breaker**: 3 trạng thái closed/open/half-open. Open khi error rate >50% trong 1 phút. Half-open sau 30s. Per-adapter (Hilo) breaker.
- **Timeout**: client timeout 30s, server timeout 25s, leaving 5s buffer.

**Caching strategy:**

- Tra cứu hóa đơn: cache trong Redis 5 phút (invalidate khi có status update từ webhook).
- Lookup MST doanh nghiệp (qua API CQT): cache 24h.
- Template / config per-merchant: cache 1h.

**Observability:**

- **Logs**: structured JSON, log level INFO/WARN/ERROR, không log MST/PII (mask).
- **Metrics**: latency histogram per endpoint, error rate, retry count, circuit breaker state, queue depth.
- **Traces**: OpenTelemetry span từ Haravan App → Gateway → Hilo. Sample rate 10% cho normal, 100% cho error.
- **Alerts**: error rate >1% trong 5 phút, p95 latency >5s, circuit breaker open >10 phút, queue depth >10k.

**Security:**

- Token rotation hằng tuần cho Hilo credential (lưu trong vault/KMS).
- Encryption at rest (DB) + transit (TLS 1.3).
- API auth: OAuth bearer cho Haravan App → Gateway, signed request HMAC cho Gateway → Hilo.
- Rate limit per-merchant: 100 req/s default, configurable per tier.

#### 2. Portal UI Design

**IA (Information Architecture)** trong Haravan Admin:

```
Haravan Admin
└── Hóa đơn (new section)
    ├── Bảng điều khiển         # dashboard nhẹ Phase 1, full Phase 2
    ├── Hóa đơn đầu ra
    │   ├── Danh sách           # list + filter
    │   ├── Phát hành mới       # form
    │   └── [chi tiết hóa đơn]  # view + actions
    ├── Hóa đơn đầu vào         # list view, defer Phase 2 cho AI
    ├── Cấu hình
    │   ├── Mẫu hóa đơn
    │   ├── Mã số thuế công ty
    │   ├── Chữ ký số
    │   └── Kết nối Hilo
    └── Nhật ký & Tuân thủ      # audit trail + compliance log
```

**5 user flow chính:**

1. **Phát hành đơn lẻ từ Web Order**: Order detail → button "Xuất hóa đơn" → preview info auto-fill → confirm → status "đang phát hành" → notification khi xong.
2. **Phát hành từ POS**: POS checkout → checkbox "xuất hóa đơn" → fill MST nếu khách yêu cầu → submit cùng payment → in mã QR + email.
3. **Tra cứu**: Hóa đơn → Danh sách → filter (ngày, MST, status) → click → detail view với download PDF/XML.
4. **Điều chỉnh**: detail view → button "Điều chỉnh" → form chọn lý do + line items → preview biên bản → submit → status "đã điều chỉnh".
5. **Thay thế** (theo NĐ 70/2025 thay cho hủy): detail view → button "Thay thế" → input lý do → form hóa đơn mới → submit → original "đã thay thế".

**Component library** kế thừa Hara DS:

- Dùng lại Button, Form, Table, Modal, Toast, Tabs, Drawer
- Custom: InvoiceStatusBadge, MSTValidator, TaxRateSelector, BienBanPreview, AuditTimeline

**Responsive cho POS**: tablet portrait/landscape primary, mobile fallback. POS thường iPad 10".

#### 3. Migration Strategy

**Phased rollout 6 tuần:**

| Tuần | % traffic | Cohort | Trigger rollback |
|---|---|---|---|
| 1 | 1% | 10 beta merchant friendly | Bất kỳ critical bug |
| 2 | 5% | + 50 merchant nhỏ | Error rate >1% |
| 3 | 10% | + 200 merchants | Error rate >0.7% |
| 4 | 25% | + 500 merchants | Error rate >0.6%, NPS drop |
| 5 | 50% | Half merchant base | Same |
| 6 | 100% | Full | Manual decision với war room |

**Feature flag system**: per-merchant flag `use_haravan_gateway`, default false. Operator UI để bật/tắt từng merchant. Ưu tiên CSM tự bật cho merchant cooperative.

**Dual-write period 30 ngày**: mọi thao tác đi qua cả Gateway mới (primary) và flow cũ (verify). Daily reconciliation job so sánh, alert nếu diff. Sau 30 ngày clean → tắt dual-write.

**Rollback plan**: 1 click revert flag → traffic về flow Hilo cũ. DB snapshot daily, có thể restore < 1h.

#### 4. Compliance Center MVP

- **Audit trail** mọi thao tác: who/when/what/from-where/why. Lưu Postgres + archive S3 sau 90 ngày.
- **Notification system** cho law update: subscribe email + in-app banner. Phase 1 manual editorial (PM xem dự thảo → đăng), Phase 2 RSS/scrape.
- **Backup/restore**: daily DB snapshot + WAL archive. Test restore monthly.

### DELIVER (tuần 9-12)

| Tuần | Deliverable |
|---|---|
| 9 | Code freeze, focus regression test, beta merchant onboarding (10) |
| 10 | Beta feedback fix, performance tuning, security audit |
| 11 | Soft launch 1% → 5% → 10%. War room daily standup |
| 12 | Rollout 25% → 50% → 100%. Postmortem + Phase 2 Kickoff Brief |

---

## Câu hỏi nghiên cứu cụ thể

1. **Bao nhiêu integration point Haravan ↔ Hilo hiện tại?** Output từ Phase 0 internal audit. Dự kiến 8-12 touchpoint.
2. **Volume hóa đơn peak/avg?** Cần data từ Hilo + Haravan internal. Lập sizing Gateway theo peak ×3 buffer.
3. **Top 10 lý do support ticket?** Từ analytics Phase 0. Mỗi lý do mapping ra story trong backlog.
4. **SLA cam kết với merchant hiện tại?** Đảm bảo Portal mới giữ hoặc tốt hơn.
5. **Có merchant enterprise dùng API custom?** Backward compat: maintain old endpoints 6 tháng, document deprecation timeline.

---

## Deliverables Phase 1

1. **Gateway service production** SLA 99.9%, đầy đủ endpoint trong API contract
2. **Portal UI v1.0** thay 100% UI Hilo cũ, Hara DS compliant
3. **Migration completion report** với metric so sánh trước/sau
4. **Operations runbook** cho on-call engineer (top 20 incident scenario)
5. **Compliance audit report** xác nhận đáp ứng NĐ 123 + NĐ 70 + TT 32
6. **Phase 2 Kickoff Brief**

---

## Success Metrics — Exit Criteria

- [ ] 100% volume hóa đơn qua Gateway
- [ ] Latency p95 < 3s phát hành
- [ ] Error rate < 0.5%
- [ ] NPS portal mới ≥ NPS cũ
- [ ] 80% merchants migrated trong 6 tuần đầu
- [ ] Zero data inconsistency vs Hilo trong 30 ngày dual-write
- [ ] Support ticket parity gap = 0
- [ ] Operations runbook approved by SRE/on-call lead

---

## Risks & Mitigations (≥10)

| ID | Risk | Prob | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| P1-R1 | Hilo API thay đổi đột ngột | 3 | 5 | Versioning strategy, contract clause notify ≥30d | Tech Lead |
| P1-R2 | Migration gây downtime | 2 | 5 | Phased rollout + feature flag + rollback test | Tech Lead |
| P1-R3 | Merchant complaint UI mới khó dùng | 4 | 4 | Beta + user testing, in-app onboarding tooltip | Designer + PM |
| P1-R4 | Data inconsistency Gateway vs Hilo | 3 | 5 | Dual-write 30d + reconciliation daily job | Backend |
| P1-R5 | Gateway latency vượt baseline | 3 | 4 | Load test trước launch, caching aggressive | Backend |
| P1-R6 | NĐ thay đổi giữa Phase 1 | 2 | 5 | Compliance officer monitor, kịch bản react sẵn | PM |
| P1-R7 | Support ticket spike khi rollout | 4 | 3 | Pre-train CSM, FAQ doc, in-app help | CSM lead |
| P1-R8 | Beta merchant data leak | 1 | 5 | NDA + sandbox separate, security audit | Tech Lead |
| P1-R9 | Hilo SLA breach | 2 | 4 | Contract penalty clause, escalation procedure | PM |
| P1-R10 | Team burnout cuối phase | 4 | 3 | Buffer week 12, rotate on-call | Tech Lead + PM |
| P1-R11 | Idempotency edge case (race condition) | 3 | 4 | Comprehensive test suite, chaos engineering | Backend |
| P1-R12 | POS tablet UI broken | 3 | 4 | Test trên iPad/Samsung Tab thật, không chỉ emulator | FE |

---

## Handoff to Phase 2 — Kickoff Brief outline

1. **Performance baseline đã đo**: latency, error rate, throughput per merchant tier
2. **Architectural debt** cần address: list explicit (vd: "monolith bắt đầu chật, plan tách worker service")
3. **Learnings từ merchant feedback**: top 10 wishlist Phase 2 nên ưu tiên
4. **Differentiation opportunities prioritized** (RICE recompute với data thật)
5. **Data foundation status**: Customer Profile MST coverage %, Order data cleanness
6. **HaraSocial / POS integration readiness** cho Phase 2 features
7. **Open questions / decisions deferred**: đặt deadline Phase 2 phải resolve
