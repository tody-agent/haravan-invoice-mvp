# FEATURE PROMPT — AI Copilot Chat

**Phase:** 4 · **Effort:** 6-8 ngày · **Persona:** Backend + Frontend + ML
**Pre-read:** Phase 4 §"Feature 1"

---

## Mục tiêu

Floating chat assistant trong Haravan Admin, context-aware, có thể trả lời query về data merchant, đề xuất action, execute với confirmation.

## Acceptance Criteria

- [ ] Floating chat widget, expandable sidebar
- [ ] Context-aware: biết user đang ở page nào, có data context page đó
- [ ] Read-only query: trả lời tức thì
- [ ] Mutation action: confirm UI trước execute
- [ ] Tool calling: invoice issue/query/list/adjust/replace, customer lookup, etc.
- [ ] Voice input (Phase 4.5 nếu có time)
- [ ] Multi-turn conversation với memory trong session
- [ ] Audit log mọi chat + action
- [ ] Cost monitoring per merchant
- [ ] Latency p95 <3s cho response

## Prompt cho AI

```
Build AI Copilot Chat. Tham chiếu Phase 4 plan §Feature 1.

Architecture:

A. Backend (apps/gateway/src/services/copilot/):

1. CopilotService.ts:
   - chat(merchantId, userId, conversationId, message, pageContext)
     → AsyncIterable<ChatChunk>
   - Stream response (SSE) cho UX nhanh

2. LLM provider: Claude Sonnet 4.6 (default)
   - Reason: tốt cho tool use, multi-turn, dài context
   - Fallback: GPT-4o, Gemini 2.5

3. Tool definitions (tool calling JSON Schema):
   - query_invoices(filter): list invoice
   - get_invoice(id): detail
   - issue_invoice(data): tạo mới
   - adjust_invoice(id, adjustment): điều chỉnh
   - replace_invoice(id, replacement): thay thế
   - get_customer(id): customer info
   - search_customers(query): tìm
   - get_dashboard_kpi(period): KPI
   - aggregate_daily(date): trigger gộp đơn lẻ
   - send_invoice(id, channels): gửi lại
   - get_audit_log(filter): tra cứu audit
   - get_compliance_status(): compliance
   - escalate_to_human(reason): chuyển CSM

4. System prompt:
   ```
   Bạn là Copilot AI cho Haravan Invoice. Hỗ trợ chủ shop / kế toán
   Việt Nam quản lý hóa đơn điện tử.

   Quy tắc:
   1. Trả lời ngắn gọn, thân thiện, tiếng Việt.
   2. Trước khi thực hiện action có side-effect (tạo/sửa/xóa hóa đơn,
      gửi notification), luôn xác nhận với user.
   3. Đưa ra explanation cho mọi action.
   4. Nếu không chắc, hỏi user clarification.
   5. Nếu vượt khả năng, escalate tới human qua tool escalate_to_human.
   6. Tuân compliance: KHÔNG xuất hóa đơn cho MST không hợp lệ. KHÔNG
      thay đổi hóa đơn đã CQT chấp nhận mà không qua wizard.
   7. Tôn trọng RBAC: chỉ thực hiện action user có quyền.

   Context hiện tại:
   - Merchant: {{merchant_name}}
   - User role: {{user_role}}
   - Page: {{current_page}}
   - Page data: {{page_context_json}}

   Lịch sử conversation:
   {{conversation_history}}
   ```

5. Conversation memory:
   - Persist trong DB table copilot_conversations
   - Schema: id, merchant_id, user_id, started_at, last_active, summary
   - Messages: id, conversation_id, role (user|assistant|tool),
     content, tool_calls, timestamp
   - Auto-summarize sau 20 messages để giữ context manageable

6. Confirmation flow:
   - Khi LLM trigger tool có side-effect:
     - Backend không execute ngay
     - Stream chunk type='confirmation' với { tool, args, summary }
     - Frontend hiển thị confirmation card
     - User click "Confirm" → frontend call POST /copilot/execute với tool+args
     - Backend execute + return result
     - Append result vào conversation, LLM nhận tiếp

7. RBAC check:
   - Mỗi tool có required permission
   - Verify trước execute
   - Reject với explanation nếu không đủ quyền

B. Frontend (apps/portal/src/components/copilot/):

1. CopilotWidget:
   - Floating button góc dưới phải, badge nếu có thông báo
   - Click → expand sidebar 400px (desktop), full screen (mobile)

2. CopilotChat:
   - Message list (user, assistant, tool result, confirmation card)
   - Input box với multi-line, send button, voice button (optional)
   - Streaming indicator khi assistant đang typing
   - Quick action buttons (suggested by LLM)

3. ConfirmationCard:
   - Hiển thị action description: "Sẽ phát hành hóa đơn cho order #X
     với total Y VND"
   - Pre-filled data preview
   - Buttons: "Xác nhận", "Sửa", "Hủy"
   - "Sửa" → mở form prefilled, user adjust

4. ContextPanel:
   - Tự động pull context từ current page
   - User có thể explicit attach: "Sử dụng dashboard data này"

5. Voice input (optional):
   - Web Speech API, recognize tiếng Việt
   - Show transcribed text trước khi send
   - Edit nếu sai

C. Cost & rate limit:

1. Per-merchant quota:
   - Free tier: 50 message/day
   - Pro: 500 message/day
   - Enterprise: unlimited
   - Quota enforce in middleware

2. Cost monitoring:
   - Track tokens per message per merchant
   - Daily report
   - Alert nếu spend >$X

3. Caching cho query phổ biến:
   - "Hôm nay phát hành bao nhiêu" → cache 5 phút

D. Tests:

- Unit: tool dispatching, RBAC check
- Integration: conversation flow với mock LLM
- E2E: user query → tool call → confirm → execute → response
- Load: 100 concurrent conversations

E. Monitoring:

- Metric: messages per merchant per day
- Metric: tool usage frequency
- Metric: confirmation accept/reject rate
- Metric: latency
- Alert: latency >5s p95

F. Safety:

- Audit log mọi message + tool call + user action
- Sandbox: nếu tool fail, không expose stack trace, return friendly error
- Rate limit per user (10 message/minute) chống abuse
- Content filter: detect prompt injection, refuse với rule

Mark `// TODO`:
- Voice input (Phase 4.5 nếu có time)
- Mobile UI optimization
- Multi-language (en) sau khi vi-VN stable
- Personalization: learn user preference (tone, format)
```

## Verification Checklist

- [ ] Chat widget render, input/output work
- [ ] Streaming response work (chunked)
- [ ] Tool call work cho 12 tools
- [ ] Confirmation card hiển thị + execute đúng khi user accept
- [ ] RBAC reject khi user không quyền
- [ ] Cost stay <budget
- [ ] Latency p95 <3s
- [ ] Audit log đủ chi tiết
- [ ] Voice input work (nếu có)
