# Design: Phase 2 — Complete Features

## Context

MVP hiện có 8 trang hoạt động + 7 Coming Soon placeholders. Prototype có 29 trang. Cần hoàn thiện các trang còn thiếu để match prototype.

## Technical Approach

**Strategy:** Implement theo priority, mỗi feature là 1 sub-agent task độc lập.

**Stack hiện tại:**
- Frontend: React 18 + TypeScript + Vite
- Backend: Hono on Cloudflare Workers
- Database: D1 (SQLite)
- Design System: design-system.css (2117 lines, Haravan tokens)

## Proposed Changes

### 1. Reports Module (6 pages)
Trang báo cáo theo prototype: Sales, Ledger, Quarterly, Deleted, Modified, Replaced.

**API endpoints mới:**
- `GET /api/v1/reports/sales` — Chi tiết bán hàng
- `GET /api/v1/reports/ledger` — Bảng kê
- `GET /api/v1/reports/quarterly` — Quý
- `GET /api/v1/reports/deleted` — Xóa bỏ (→ thay thế theo NĐ 70)
- `GET /api/v1/reports/modified` — Sửa đổi (điều chỉnh)
- `GET /api/v1/reports/replaced` — Thay thế

**UI pattern:** Table + filters + export CSV button.

### 2. Customer Catalog
Quản lý khách hàng: list, search, view detail.

**API endpoints:**
- `GET /api/v1/customers` — List + search
- `GET /api/v1/customers/:id` — Detail

**UI:** Table với search, MST autofill integration.

### 3. Settings Pages (3 pages)
Templates, Automation, Plan pages.

**UI:** Form-based settings matching prototype.

### 4. Analytics Dashboard
Biểu đồ + metrics nâng cao.

**API:** Aggregate từ invoices data.

### 5. Notification Center
Thông báo hệ thống.

### 6. Reports Page (Main)
Trang tổng hợp báo cáo với links đến 6 sub-reports.

## Verification

- [ ] Mỗi trang render đúng design system tokens
- [ ] API endpoints trả data đúng format
- [ ] Navigation không có broken links
- [ ] Responsive trên mobile/tablet
- [ ] Loading/empty/error states
