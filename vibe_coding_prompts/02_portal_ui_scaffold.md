# FEATURE PROMPT — Portal UI Scaffold (Haravan Admin Module)

**Phase:** 1 · **Effort:** 5-7 ngày · **Persona:** Frontend + Designer
**Pre-read:** Master Context §3 (Tầng 4), Phase 1 §"Portal UI Design"

---

## Mục tiêu

Xây Portal UI module nhúng vào Haravan Admin với 5 user flow chính của Phase 1: phát hành đơn lẻ, phát hành từ POS, tra cứu, điều chỉnh, thay thế. Dùng design system Hara DS, responsive cho POS tablet (iPad 10").

## Acceptance Criteria

- [ ] IA module "Hóa đơn" với 6 sub-page (theo IA trong Phase 1 plan)
- [ ] 5 user flow chạy E2E happy path
- [ ] Component compliant Hara DS, dùng token color/typography/spacing
- [ ] Responsive: desktop 1280+, tablet 768-1024 (POS use case), mobile 375+ fallback
- [ ] i18n setup (vi-VN primary, en-US ready), 100% string trong locale file
- [ ] Accessibility AA: keyboard navigation, ARIA labels, contrast 4.5:1
- [ ] Performance: First Contentful Paint <1.5s, TTI <3s trên 4G
- [ ] Error boundary + global error toast
- [ ] Loading state cho mọi async UI (skeleton, không spinner generic)
- [ ] E2E test (Playwright) cover 5 user flow

## File Structure (apps/portal)

```
apps/portal/src/
├── pages/
│   ├── invoices/
│   │   ├── outbound/
│   │   │   ├── list.page.tsx          # /invoices/outbound
│   │   │   ├── create.page.tsx        # /invoices/outbound/new
│   │   │   ├── detail.page.tsx        # /invoices/outbound/:id
│   │   │   ├── adjust.page.tsx        # /invoices/outbound/:id/adjust
│   │   │   └── replace.page.tsx       # /invoices/outbound/:id/replace
│   │   ├── inbound/
│   │   │   └── list.page.tsx          # Phase 2 mở rộng
│   │   ├── config/
│   │   │   ├── templates.page.tsx
│   │   │   ├── company-info.page.tsx
│   │   │   ├── digital-cert.page.tsx
│   │   │   └── connect-hilo.page.tsx
│   │   └── audit.page.tsx             # Nhật ký & Tuân thủ
│   └── layout.tsx
├── components/
│   ├── invoice/
│   │   ├── InvoiceForm.tsx
│   │   ├── InvoiceList.tsx
│   │   ├── InvoiceDetail.tsx
│   │   ├── InvoiceStatusBadge.tsx
│   │   ├── MSTValidator.tsx
│   │   ├── TaxRateSelector.tsx
│   │   ├── BienBanPreview.tsx
│   │   └── AuditTimeline.tsx
│   ├── ui/                            # re-export Hara DS với theme
│   └── layout/
├── hooks/
│   ├── useInvoices.ts                # TanStack Query
│   ├── useIssueInvoice.ts
│   ├── useReplaceInvoice.ts
│   └── useAuth.ts
├── api/
│   ├── client.ts                     # axios/fetch wrapper với auth
│   ├── invoices.api.ts
│   └── types.ts                      # re-export shared-types
├── locales/
│   ├── vi-VN.json
│   └── en-US.json
├── routes.tsx                        # TanStack Router config
└── main.tsx
```

## Prompt cho AI

```
Bạn là Senior Frontend Engineer. Build Portal UI scaffold theo file
structure trên. Stack: React 18 + TypeScript + Vite + TanStack Query
+ TanStack Router + Hara DS (giả định npm @haravan/design-system, nếu
chưa có dùng Tailwind + Radix UI làm proxy).

Step-by-step:

1. Setup TanStack Router file-based hoặc code-based với 6 pages
   trong file structure.

2. Layout component: header với breadcrumb, sidebar nav (re-use Haravan
   Admin shell nếu có hook nhúng, không thì standalone).

3. API client (api/client.ts):
   - Wrap fetch hoặc axios
   - Auto-attach Bearer token từ auth context
   - Auto-retry GET 1 lần với 5xx
   - Throw typed error (NetworkError, AuthError, ValidationError, ServerError)
   - Generate idempotency key cho POST mutating

4. Hooks với TanStack Query:
   - useInvoices(filter): list + pagination
   - useInvoice(id): detail
   - useIssueInvoice(): mutation, optimistic update
   - useReplaceInvoice(): mutation
   - useAdjustInvoice(): mutation
   Cache key strategy: ['invoices', merchantId, filterHash]

5. Pages:
   a) outbound/list:
      - Filter bar: period (date range), status (multi-select), search MST/name
      - Table với pagination 20/page, sortable column (date, total, status)
      - Bulk action stub (Phase 2 mở rộng): "Phát hành lại", "Tải PDF"
      - Empty state với CTA "Phát hành mới"

   b) outbound/create:
      - Form với react-hook-form + zod validation
      - Sections: Người mua (MST autocomplete từ Customer Profile),
        Người bán (auto-fill merchant info), Sản phẩm (line items
        repeater, tax rate dropdown), Tổng (auto-calculate)
      - Submit button: "Phát hành" với loading state, sau success
        navigate detail page với toast

   c) outbound/detail:
      - Header: trạng thái badge + action button (Tải PDF, Tải XML,
        Điều chỉnh, Thay thế, In)
      - Section: thông tin chung, line items, totals, audit timeline
      - Action button: confirm modal trước khi destructive

   d) outbound/adjust:
      - Form điều chỉnh: lý do, line item nào sửa, preview biên bản
      - Submit → call adjust API → status update → navigate back

   e) outbound/replace:
      - Form thay thế (NĐ 70/2025): lý do + form hóa đơn mới
      - Submit → call replace API → mark original "đã thay thế"

   f) audit:
      - Timeline view, filter by invoice/actor/action
      - Export CSV

6. Components quan trọng:
   - MSTValidator: input MST với real-time validate format + lookup
     CQT (debounce 500ms), badge "đang hoạt động" nếu pass
   - InvoiceStatusBadge: 7 trạng thái với màu + icon, tooltip giải thích
   - BienBanPreview: render PDF preview của biên bản điều chỉnh
   - AuditTimeline: vertical timeline với icon per action type

7. i18n: dùng react-i18next, mọi string trong locales/vi-VN.json. KHÔNG
   hardcode tiếng Việt trong component.

8. Accessibility:
   - Mọi button có aria-label
   - Form input có label rõ
   - Color contrast pass WCAG AA
   - Keyboard navigable (Tab, Enter, Esc)
   - Focus visible

9. Responsive:
   - Mobile: hamburger menu, table → card view
   - Tablet (POS use case): full table, button size lớn hơn (touch target ≥44x44)
   - Desktop: layout chuẩn

10. Error handling:
    - ErrorBoundary global wrap App, fallback UI thân thiện
    - Toast cho non-critical (network error retry)
    - Modal cho critical (auth expired → redirect login)

11. Tests:
    - Unit: hooks, validators, utility
    - Component: Testing Library cho key component (form, table)
    - E2E: Playwright cho 5 user flow (mock API qua MSW)

Mark `// TODO` cho:
- Hara DS component nếu chưa có npm package
- Auth context tích hợp với Haravan Admin shell (cần Haravan core team confirm)
- Mock data cho dev (sử dụng faker.js)
```

## Verification Checklist

- [ ] `pnpm dev` chạy portal port 5173, navigate được 6 page
- [ ] Form phát hành validate đúng, submit success
- [ ] Tra cứu list filter, sort, pagination work
- [ ] Lighthouse score ≥90 cho Performance, Accessibility, Best Practices
- [ ] Test responsive: iPad portrait + landscape, iPhone, desktop
- [ ] axe-core không error accessibility
- [ ] E2E Playwright pass 5 flow
- [ ] Bundle size <500KB gzipped initial
