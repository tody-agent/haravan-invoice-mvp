# Design: Hilo E-Invoice UX Refactor

## Context & Technical Approach
The goal is to clone and refactor the existing Hilo e-invoice product (which currently has poor UX) into a modern, intuitive, and highly functional web application. We are extracting the core features and user flows from the Hilo documentation.

**Core Features Extracted:**
1. Authentication & System Administration (Login, Company Info, User Management)
2. Master Data Management (Customers, Products)
3. E-Invoice Registration & Setup (Decision to apply e-invoice, Issuance notices)
4. Invoice Operations (Create, View, Issue, Upload batch data)
5. Invoice Processing (Replace, Adjust, Cancel/Delete)
6. Reporting & Analytics (Statistical reports, Monthly listings, Sales details)

**Technical Approach:**
- **Frontend Framework:** React-based Single Page Application (e.g., Next.js or Vite + React) for snappy, smooth transitions.
- **Styling/UI Kit:** TailwindCSS combined with a premium UI component library (like Shadcn UI) to ensure high-quality, modern aesthetics (glassmorphism, clean typography, responsive data tables).
- **UX Improvements:**
  - Consolidate fragmented pages into intuitive dashboards.
  - Replace complex multi-page forms with clean slide-over panels or multi-step wizards.
  - Implement bulk actions and advanced filtering on data tables (Invoices, Customers).
  - Provide a clear, visual status pipeline for Invoice states (Draft -> Issued -> Adjusted/Replaced).

## Proposed Changes

### 1. Navigation & Layout
- Implement a collapsible sidebar for main modules: Dashboard, Invoices (Creation & Processing), Master Data (Customers, Products), Reports, and Settings (Company, Users, Issuance Notices).

### 2. Core Modules UX Refactor
- **Settings & Registration:** Group "Thông tin đơn vị", "Quyết định áp dụng", and "Thông báo phát hành" into an intuitive "Company Setup Wizard".
- **Master Data:** Provide inline editing and bulk import/export for Customers and Products.
- **Invoice Creation:** A split-screen or step-by-step invoice creator showing a live preview of the invoice as the user fills in details.
- **Invoice Processing:** A unified dashboard for "Xử lý hóa đơn" where users can easily select an issued invoice and trigger an action (Thay thế, Điều chỉnh, Xóa bỏ) with clear visual warnings.

## Verification
- User flows must be tested against the original Hilo documentation scenarios to ensure no business logic or mandatory steps are lost in the new UI.
- All forms must have validation (required fields for e-invoices).
