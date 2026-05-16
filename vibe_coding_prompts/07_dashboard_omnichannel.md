# FEATURE PROMPT — Dashboard Omnichannel

**Phase:** 2 · **Effort:** 5-6 ngày · **Persona:** Backend + Frontend + Data Engineer
**Pre-read:** Phase 2 §"Feature 4"

---

## Mục tiêu

Dashboard tổng hợp doanh thu + hóa đơn theo kênh (POS, Web, Marketplace), branch, sản phẩm. Drill-down từ chart → list hóa đơn → detail. Đây là "moat" Haravan có vs T-VAN độc lập.

## Acceptance Criteria

- [ ] 4 KPI card: tổng doanh thu, tổng hóa đơn, % invoice/order, error rate
- [ ] Chart line: doanh thu vs hóa đơn theo ngày (period configurable)
- [ ] Chart pie: phân bổ theo channel + theo branch
- [ ] Table top 20 customer + top 10 SKU
- [ ] Drill-down từ chart → filtered list → detail
- [ ] Period selector: Today / 7d / 30d / 90d / Custom
- [ ] Filter: branch, channel, customer segment
- [ ] Performance: load <2s với 100k invoice
- [ ] Refresh near-realtime: lag <5 phút
- [ ] Export PDF/PNG cho dashboard

## Prompt cho AI

```
Build Dashboard Omnichannel feature. Tận dụng Haravan data có sẵn
(Order, POS, Marketplace) join với invoice metadata.

Architecture:

A. Data pipeline:
   - ETL: stream Order events từ Haravan + POS + Marketplace into
     fact_invoice_summary (Postgres materialized view hoặc separate
     table)
   - Refresh: Kafka consumer realtime + materialized view refresh 5
     phút cho aggregations
   - Schema fact_invoice_summary:
     * invoice_id, merchant_id, issue_date, channel ('pos'|'web'|'marketplace_shopee'|'marketplace_lazada'|'marketplace_tiki'|'manual'),
       branch_id, customer_id, customer_segment, sku, qty, revenue,
       tax, status, has_mst

   - Schema dim_branch, dim_channel, dim_customer (slowly changing)

B. Backend API:

1. apps/gateway/src/api/dashboard.controller.ts:
   - GET /v1/dashboard/kpi?period=...&filters=...
     → { totalRevenue, totalInvoices, invoicePerOrderRate, errorRate, change_pct_vs_prev }
   - GET /v1/dashboard/timeseries?period=...&groupBy=day&filters=...
     → { series: [{ date, revenue, invoiceCount }, ...] }
   - GET /v1/dashboard/breakdown?dimension=channel|branch&filters=...
     → { items: [{ name, revenue, invoiceCount, pct }, ...] }
   - GET /v1/dashboard/top?dimension=customer|sku&limit=20&filters=...
     → { items: [{ id, name, value, pct }, ...] }

2. Caching:
   - Redis cache mỗi response, key = hash(query params), TTL 5 phút
   - Stale-while-revalidate: trả cached + trigger refresh background

3. Performance:
   - Materialized view + index trên (merchant_id, issue_date, channel, branch_id)
   - Pre-aggregate cho period phổ biến (7d, 30d) trong rollup table
   - Pagination cho list endpoint (limit 100)
   - Connection pool tuning

C. Frontend (apps/portal/src/pages/dashboard/):

1. Layout: grid 12 cột responsive
   - Row 1: 4 KPI card (3 col mỗi card)
   - Row 2: Chart line full width (12 col)
   - Row 3: 2 chart pie (6 col mỗi)
   - Row 4: 2 table top (6 col mỗi)

2. Period selector ở header:
   - Today / 7d / 30d / 90d / Custom date range
   - Stick to top khi scroll
   - State sync với URL query param

3. Filter sidebar (collapsible):
   - Branch (multi-select dropdown từ /v1/branches)
   - Channel (multi-select)
   - Customer segment (vd: B2C, B2B, VIP)

4. Components:
   - KpiCard: number lớn + change % (green/red arrow) + sparkline
   - LineChart: dùng Recharts hoặc Chart.js, dual y-axis
     (revenue + invoiceCount), tooltip detailed, click point → drill
   - PieChart: 6-8 slice max, "Others" gộp phần dư, click slice → drill
   - TopTable: sortable column, % bar visual

5. Drill-down:
   - Click point trên chart → navigate /invoices?date=X&channel=Y
   - Filter pre-applied
   - Back button để quay dashboard với state preserved

6. Export:
   - Button "Tải xuống" → modal chọn format PDF / PNG / CSV
   - PDF: render dashboard + period info + filter info, branding Haravan
   - CSV: raw data của widget user chọn

7. Performance frontend:
   - TanStack Query với staleTime 5 phút (match backend cache)
   - Lazy load chart library (dynamic import)
   - Skeleton loading thay vì spinner
   - Memoize chart data transformation

8. Responsive:
   - Mobile (<768): stack vertical, KPI 2/row, chart full width, table
     scroll horizontal
   - Tablet: 2-col KPI, charts adaptive
   - Desktop: full grid

9. Tests:
   - Unit: data transformation utility
   - Integration API: assert response shape, performance budget
   - E2E: change period → KPI update, click chart → drill work
   - Performance: load 100k invoice dataset → <2s render

10. Monitoring:
    - Track render time per dashboard page
    - Alert nếu p95 >3s
    - Usage analytics: which widget most viewed

Mark `// TODO`:
- Haravan Order/POS/Marketplace event schema (cần data team confirm)
- Customer segmentation logic (có sẵn từ Haravan CDP hay phải define)
- Branding cho PDF export (logo, color)
```

## Verification Checklist

- [ ] Dashboard load <2s với 100k invoice trong 30d
- [ ] Period selector update toàn bộ widget
- [ ] Filter sidebar work với multi-select
- [ ] Drill-down từ chart → list filter pre-applied
- [ ] Export PDF render đúng layout
- [ ] Mobile responsive, không broken layout
- [ ] Cache hit rate ≥70% sau 1 ngày
- [ ] Realtime update (5 phút lag) verified
