# FEATURE PROMPT — Automation Builder No-code

**Phase:** 4 · **Effort:** 8-10 ngày · **Persona:** Backend + Frontend
**Pre-read:** Phase 4 §"Feature 2"

---

## Mục tiêu

Cho merchant tự build automation flow (như Zapier vertical hóa cho invoice). Trigger → action với drag-drop UI. 20-30 template sẵn cho use case phổ biến.

## Acceptance Criteria

- [ ] Drag-drop canvas với React Flow
- [ ] 8+ trigger type, 12+ action type
- [ ] Pre-made template library 20-30 templates
- [ ] Test run với sample data trước khi enable
- [ ] Versioning: save draft, publish, rollback
- [ ] Run history với log + replay
- [ ] Per-tier limits (Free 5 / Pro 50 / Enterprise unlimited)
- [ ] Throttling: respect rate limit downstream
- [ ] Error handling: retry policy, notification on failure
- [ ] Audit log mọi automation execution

## Prompt cho AI

```
Build Automation Builder no-code. Inspired by Zapier/Make.com nhưng
vertical hóa cho invoice domain.

Architecture:

A. Domain model:

1. Automation:
   - id, merchant_id, name, description, status (draft|active|paused|archived),
     version, created_by, created_at, updated_at
   - flow_definition (JSONB): { nodes: [...], edges: [...] }

2. Node types:
   - Trigger: order_created, order_paid, order_cancelled, order_refunded,
     payment_received, payment_failed, customer_created,
     customer_updated_mst, schedule_cron, webhook_received,
     invoice_status_changed, manual_button
   - Action: issue_invoice, aggregate_daily, send_invoice (channels),
     adjust_invoice, replace_invoice, notify_email, notify_zalo,
     notify_slack_webhook, update_customer_profile, call_external_api,
     ai_classify_inbound, escalate_to_human
   - Logic: condition (if/else), loop (foreach item), delay (wait X
     minutes), parallel branch
   - Data transform: map fields, filter, format date/currency

3. Run:
   - id, automation_id, triggered_at, trigger_data, status (running|success|failed|partial),
     completed_at, error?, node_executions: Array<{node_id, status, input, output, duration}>

B. Backend (apps/gateway/src/services/automation/):

1. AutomationEngine:
   - validateFlow(flow): check graph, no cycle, types match
   - dryRun(flow, sampleData): execute trong sandbox, không side-effect
   - execute(automationId, triggerData): real execution

2. Trigger system:
   - apps/gateway/src/services/automation/triggers/:
     - Subscribe Kafka topics (order events)
     - Cron scheduler (node-cron) cho schedule_cron triggers
     - HTTP receiver (POST /v1/webhooks/automation/{id}) cho webhook triggers
   - Match trigger → enqueue automation execution

3. Action handlers:
   - Mỗi action type 1 handler implement IActionHandler:
     - validate(args)
     - execute(args, context): Promise<ActionResult>
   - Handler đăng ký registry, dispatch theo type

4. Execution worker:
   - Consume queue, execute flow node by node theo edges
   - Persist run state cho resumability
   - Retry failed node theo policy (exp backoff, max 3)
   - Timeout per node 60s default
   - Throttle outbound call respect rate limit

5. Sandbox (dry run):
   - Execute với mock action handler, return predicted result
   - Không persist, không call external

C. Template library:

1. apps/gateway/src/services/automation/templates/:
   - 20-30 JSON template files
   - Examples:
     a) "F&B Daily Summary": cron daily 23:30 → aggregate_daily →
        notify_email kế toán
     b) "Auto Issue on Paid": order_paid → check has_mst → issue_invoice
        → send_invoice(zalo+email)
     c) "Refund Auto Adjust": order_refunded → adjust_invoice (decrease)
        → notify_email
     d) "B2B Monthly Bulk": schedule monthly → loop pending B2B orders →
        issue_invoice each → send_invoice batch
     e) "VIP Customer Alert": customer_created (VIP segment) → notify_zalo
        owner + notify_slack
     f) "Inactive Supplier Block": invoice_pending + supplier_risk_high
        → escalate_to_human
     g) "Inbound Auto Classify": webhook_received Hilo inbound →
        ai_classify_inbound → notify_email kế toán
     h) ... (more)

2. Template marketplace UI: browse, search, "Use this template" → fork

D. Frontend (apps/portal/src/pages/automation/):

1. List page: list user's automations, filter status, search, "Create
   new" button

2. Builder page (canvas):
   - React Flow library
   - Sidebar: drag node from palette (trigger, action, logic, transform)
   - Drop on canvas, connect via edges
   - Node config panel right side: form theo schema của node type
   - Validate real-time, error inline
   - Save draft, Publish (active), Pause, Archive

3. Test runner:
   - "Test Run" button → modal nhập sample data
   - Execute dry run, hiển thị result per node
   - Edit và re-test

4. Run history:
   - List runs với status, duration, trigger source
   - Click → detail timeline node by node với input/output
   - Replay button (re-execute với same data)

5. Template browser:
   - Grid of templates với icon, name, description
   - Filter by category (F&B, Retail, B2B, ...)
   - Click "Use" → clone vào automation list

E. Limits per tier:

- Free: 5 active automations, 100 run/day
- Pro: 50 active, 10k run/day
- Enterprise: unlimited

Enforce in middleware + UI hiển thị usage.

F. Tests:

- Unit: AutomationEngine validation, action handlers
- Integration: trigger → execute end-to-end với mock external
- E2E: builder UI → save → trigger → verify run history
- Stress: 1000 concurrent runs, no data loss

G. Monitoring:

- Metric: active automation count, run count, success rate, avg duration
- Metric: per-tier usage
- Alert: failure rate >5% per automation
- Dashboard: top automations by usage

H. Security:

- Per-merchant isolation (automation chỉ access data merchant đó)
- Action handler validate data scope
- External API call: whitelist domain hoặc require approval

I. Audit:

- Log mỗi run: who created automation, when triggered, all node
  executions
- Compliance: trace back từ "Sao hóa đơn này phát hành?" → automation
  → trigger event

Mark `// TODO`:
- React Flow custom node design
- Template library editorial (cần product team curate)
- External API call security model (require approval workflow?)
```

## Verification Checklist

- [ ] Drag-drop canvas work, connect nodes, save flow
- [ ] 8+ trigger types subscribe đúng event source
- [ ] 12+ action types execute đúng
- [ ] Dry run không side-effect
- [ ] 20+ template available, "Use this" work
- [ ] Run history hiển thị đầy đủ trace
- [ ] Per-tier limits enforced
- [ ] Failure retry + notify work
- [ ] Stress 1000 concurrent runs no data loss
- [ ] Audit trace từ run → trigger → action
