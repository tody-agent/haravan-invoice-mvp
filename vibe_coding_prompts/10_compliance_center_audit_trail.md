# FEATURE PROMPT — Compliance Center MVP + Audit Trail

**Phase:** 1 (MVP) → Phase 2 (full) · **Effort:** 3-4 ngày MVP · **Persona:** Backend + Frontend + Compliance Officer
**Pre-read:** Phase 1 §"Compliance Center MVP", Master Context §11

---

## Mục tiêu

Build Compliance Center: audit trail đầy đủ mọi thao tác, notification cho regulation update, backup/restore, dashboard trạng thái compliance. Phase 1 MVP, Phase 2 mở rộng với e-sign workflow.

## Acceptance Criteria

- [ ] Audit log mọi action: who/when/what/from-where/why
- [ ] Audit retention 10 năm (NĐ 123 yêu cầu)
- [ ] Notification system cho law update (Phase 1 manual editorial)
- [ ] Daily backup DB + WAL archive, monthly restore test
- [ ] Compliance dashboard: tổng hóa đơn, % CQT accepted, % rejected, regulation alerts
- [ ] Export compliance report (PDF/Excel) cho CQT thanh tra
- [ ] Audit log search + filter performance: <2s với 1M rows

## Prompt cho AI

```
Build Compliance Center MVP. Critical: NĐ 123 yêu cầu lưu trữ 10 năm,
audit trail đầy đủ traceable.

Architecture:

A. Audit Log infrastructure:

1. Schema apps/gateway/src/db/migrations/audit_logs.sql:
   - id (UUID PK)
   - entity_type (invoice|customer|merchant|user|config)
   - entity_id (UUID)
   - action (create|update|delete|view|issue|adjust|replace|export|...)
   - actor_id (user UUID)
   - actor_role (owner|accountant|cashier|system|api)
   - merchant_id
   - timestamp (with timezone)
   - source (web|pos|api|automation|webhook)
   - ip_address
   - user_agent
   - request_id (correlation)
   - changes (JSONB: before/after diff)
   - metadata (JSONB: context like reason, comment)

   Index: (merchant_id, timestamp DESC), (entity_type, entity_id),
   (actor_id, timestamp), (action, timestamp)

   Partition table by month cho perf (1M+ rows)

2. AuditService apps/gateway/src/services/audit.service.ts:
   - log({entityType, entityId, action, actor, merchant, source, changes, metadata})
   - bulkLog([...])
   - query(filter, pagination)
   - export(filter, format: csv|pdf|excel)

3. Middleware tự động audit:
   - Wrap mọi mutation API với decorator @AuditLog
   - Capture before/after state
   - Mask sensitive fields (mst, email, phone, etc.) trong changes diff

4. Retention:
   - Hot: Postgres 90 ngày
   - Warm: archive S3 (parquet format) sau 90 ngày
   - Cold: glacier sau 2 năm
   - Restore tool: query archived → restore to query DB on-demand

B. Regulation Update Notifier:

1. Manual editorial Phase 1:
   - Admin UI cho compliance officer paste regulation update
   - Schema regulation_updates: id, title, summary, source_url, effective_date,
     impact_level (info|warning|critical), affected_features (array),
     created_by, published_at
   - Auto-publish to merchant via:
     * In-app notification banner
     * Email digest weekly
     * Webhook subscribers

2. Phase 2 enhancement (defer):
   - RSS feed scrape từ Bộ Tài chính, Tổng Cục Thuế
   - LLM summarize + classify impact
   - Auto-draft notification, compliance officer approve trước publish

C. Backup / Restore:

1. Postgres backup:
   - Daily full backup pg_dump → encrypted S3
   - Continuous WAL archive (point-in-time recovery)
   - Test restore monthly với automated job
   - Document RPO (1h), RTO (4h)

2. Disaster recovery runbook:
   - Step-by-step restore từ backup
   - Verify data integrity script
   - Communication template cho merchant

D. Compliance Dashboard:

1. Page apps/portal/src/pages/compliance/:
   - KPI: total invoice issued (period), CQT accepted %, CQT rejected %,
     pending count, audit events count
   - Chart: timeline issued + accepted + rejected
   - Recent regulation updates panel
   - Audit log search component (full-text + filter)
   - Backup status indicator

2. Audit log search UI:
   - Filter: date range, action type, actor, entity
   - Full-text search trong metadata/changes
   - Pagination + virtual scroll cho perf
   - Export selected → CSV/PDF

E. CQT thanh tra export:

1. API: POST /v1/compliance/export với { period, format, scope }
   - scope: 'all' | 'specific_invoice_ids' | 'specific_period'
   - format: 'csv' | 'pdf' | 'excel'
   - Generate background job (large export), email link khi xong

2. Export content:
   - Toàn bộ hóa đơn metadata (Haravan side, không bao gồm XML pháp lý
     vì lưu Hilo)
   - Audit log liên quan
   - Compliance certificate (Haravan ký xác nhận data integrity)

3. Watermark + signature:
   - PDF có watermark "Generated for [Tên CQT, Ngày]"
   - Digital signature từ Haravan để CQT verify

F. Compliance checklist (declarative):

1. apps/gateway/src/compliance/rules.ts:
   - Define rule:
     - 'NĐ 123/2020 §5.2: Invoice retention 10 năm'
     - 'NĐ 70/2025 §7: Bỏ thủ tục hủy, dùng điều chỉnh/thay thế'
     - 'TT 32/2025 §3: Định dạng hóa đơn điện tử'
     - ...
   - Rule check function: scan code/data periodic → flag violation

2. Compliance dashboard hiển thị:
   - Mỗi rule: ✓ pass / ⚠ warning / ✗ violation
   - Last checked timestamp
   - Drill-down detail nếu fail

G. Tests:

- Unit: audit middleware capture before/after correctly
- Integration: end-to-end audit log search
- Performance: 1M audit rows query <2s với index
- Backup/restore: automated test restore từ snapshot

H. Monitoring:

- Audit log volume per day (alert nếu drop bất thường = có thể audit bị tắt)
- Backup job success/fail
- Restore test outcome monthly
- Regulation update publish frequency

Mark `// TODO`:
- S3 bucket setup cho archive
- Compliance officer team structure (PM hỏi org)
- Tax counsel sign-off cho rule definition
- Digital signature solution cho export PDF
```

## Verification Checklist

- [ ] Mọi mutation API tự động log audit
- [ ] PII masked trong audit changes diff
- [ ] Audit search 1M rows <2s
- [ ] Backup daily success, restore test pass monthly
- [ ] Regulation update notification visible cho merchant
- [ ] Export compliance report cho thanh tra format đúng
- [ ] Compliance checklist trên dashboard reflect đúng status
