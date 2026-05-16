# Implementation Checklist — Phase 2 Features

**Goal:** Hoàn thiện 13 trang còn thiếu + 6 API endpoints mới
**Timeline:** 3-4 ngày
**Strategy:** Parallel sub-agents, mỗi agent làm 1 feature

---

## Sprint 1 — Reports Module (Ngày 1)

### 1.1 Reports API Endpoints
- [ ] 1.1.1 `GET /api/v1/reports/sales` — chi tiết bán hàng (group by date, channel)
- [ ] 1.1.2 `GET /api/v1/reports/ledger` — bảng kê hóa đơn (filter date, status)
- [ ] 1.1.3 `GET /api/v1/reports/quarterly` — tổng hợp theo quý
- [ ] 1.1.4 `GET /api/v1/reports/replaced` — danh sách hóa đơn thay thế
- [ ] 1.1.5 `GET /api/v1/reports/modified` — danh sách hóa đơn điều chỉnh
- [ ] 1.1.6 `GET /api/v1/reports/deleted` — danh sách hóa đơn xóa bỏ (NĐ 70 → thay thế)
- [ ] 1.1.7 Tests cho 6 endpoints
- [ ] **Gate:** cURL 6 endpoints → data chính xác

### 1.2 Reports Main Page
- [ ] 1.2.1 Trang `/reports` — grid 6 report cards với icon + description
- [ ] 1.2.2 Click card → navigate đến sub-report page
- [ ] **Gate:** Navigate /reports → 6 cards hiển thị

### 1.3 Sub-Report Pages (6 pages)
- [ ] 1.3.1 `/reports/sales` — table + date filter + export CSV
- [ ] 1.3.2 `/reports/ledger` — table + date range + status filter
- [ ] 1.3.3 `/reports/quarterly` — quarterly summary cards + table
- [ ] 1.3.4 `/reports/replaced` — table of replaced invoices
- [ ] 1.3.5 `/reports/modified` — table of adjusted invoices
- [ ] 1.3.6 `/reports/deleted` — table with NĐ 70 compliance note
- [ ] **Gate:** 6 pages render, filters work, data from API

---

## Sprint 2 — Customer + Settings (Ngày 2)

### 2.1 Customer Catalog
- [ ] 2.1.1 `GET /api/v1/customers` — list + search + pagination
- [ ] 2.1.2 `GET /api/v1/customers/:id` — detail + invoice history
- [ ] 2.1.3 `/customers` page — table + search + click → detail
- [ ] 2.1.4 `/customers/:id` page — info + recent invoices
- [ ] **Gate:** Customer list + detail hoạt động

### 2.2 Settings Pages
- [x] 2.2.1 `/settings/templates` — invoice template config
- [x] 2.2.2 `/settings/automation` — auto-issue rules
- [x] 2.2.3 `/settings/plan` — current plan + usage stats
- [x] **Gate:** 3 settings pages render với form elements

---

## Sprint 3 — Analytics + Notifications (Ngày 3)

### 3.1 Analytics Dashboard
- [ ] 3.1.1 `GET /api/v1/analytics/summary` — aggregate metrics
- [ ] 3.1.2 `/analytics` page — charts (revenue trend, channel split, top customers)
- [ ] 3.1.3 Period selector (7d, 30d, 90d)
- [ ] **Gate:** Analytics page hiển thị charts + metrics

### 3.2 Notification Center
- [ ] 3.2.1 `/notifications` page — list notifications
- [ ] 3.2.2 Mark as read, filter by type
- [ ] **Gate:** Notifications page hoạt động

---

## Sprint 4 — Polish + Integration (Ngày 4)

### 4.1 Update Routes
- [ ] 4.1.1 Cập nhật App.tsx — thay ComingSoon bằng real pages
- [ ] 4.1.2 Verify tất cả nav links hoạt động

### 4.2 Design System Alignment
- [ ] 4.2.1 Audit tất cả pages — dùng đúng design tokens
- [ ] 4.2.2 Loading skeletons cho mọi page
- [ ] 4.2.3 Empty states với CTA
- [ ] 4.2.4 Error states

### 4.3 Testing
- [ ] 4.3.1 Unit tests cho new API endpoints
- [ ] 4.3.2 Typecheck pass
- [ ] 4.3.3 Build success
- [ ] **Gate:** Full test suite pass, no broken routes

---

## Summary

| Sprint | Ngày | Features | Tasks |
|--------|------|----------|-------|
| 1 | 1 | Reports (6 pages + API) | 14 |
| 2 | 2 | Customer + Settings (5 pages) | 7 |
| 3 | 3 | Analytics + Notifications (2 pages) | 5 |
| 4 | 4 | Polish + Integration | 7 |
| **Total** | **4 ngày** | **13 pages + 8 API** | **33 tasks** |
