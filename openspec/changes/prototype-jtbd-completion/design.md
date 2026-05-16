# Design: Prototype JTBD Completion

## Context & Technical Approach

### Goal

Hoàn thiện prototype theo hướng **Option C: Layered JTBD Prototype System**, bắt đầu từ việc nâng `prototype/haravan_invoice_admin_mockup.html` thành một **fullscreen Haravan-like admin shell** có visual gần với Haravan Admin, rồi mở rộng dần thành hệ prototype theo persona/JTBD.

### Why this approach

- User muốn “bóc tách prototype fullscreen” và “chỉnh lại màu sắc cho giống Haravan”.
- Repo hiện mới có 1 file HTML master và chưa có stack production prototype thực thụ.
- Chuyển sang React/Vite ngay ở bước này sẽ làm tăng scope và làm chậm vòng lặp visual/demo.
- Cần một kế hoạch có thể thực thi theo batch: chỉnh shell trước, rồi mới cắm thêm các module JTBD sâu hơn.

### Key Decisions

1. **Batch 1 giữ single-file HTML master** để refactor nhanh layout, IA, màu sắc, states, và storytelling.
2. **Prototype master chuyển sang fullscreen app shell**: `100vw x 100vh`, topbar cố định, sidebar cố định, content scroll nội bộ.
3. **Visual system bám gần Haravan screenshot** theo phong cách “light admin workspace”: neutral gray surfaces, white cards, blue primary, green status accents, border mềm, shadow nhẹ.
4. **Layered architecture**:
   - Layer 1: executive demo shell trong file master
   - Layer 2: admin workbench core vẫn nằm trong master hoặc tách section logic
   - Layer 3: companion mockups tách file riêng cho POS / inbound / automation / customer portal / mobile owner
5. **Không giả định đây là Hara DS chính thức**. Token palette ở batch đầu được suy luận từ screenshot reference và sẽ được ghi rõ là “inferred visual benchmark”.

### Assumptions

| Assumption | Status | Notes |
|---|---|---|
| Screenshot user gửi là benchmark visual mong muốn gần đúng | Verified | Dùng làm reference chính cho color/layout direction |
| Chưa cần convert prototype master sang React trong batch đầu | Needs confirmation | Plan giả định ưu tiên visual + IA trước |
| Có thể tạo thêm nhiều file mockup trong `prototype/` | Verified | `prototype/README.md` đã gợi ý hướng này |
| Mục tiêu trước mắt là prototype demo/interview, không phải production-ready frontend | Verified | Khớp `openspec/project.md` |

### Target Visual Direction

#### Fullscreen Shell

- Bỏ `page-head` centered container hiện tại.
- `body` trở thành canvas fullscreen, không padding ngoài.
- Shell mới:
  - topbar trắng, cao khoảng `56px`
  - sidebar trái `248-256px`, nền xám rất nhạt
  - content region nền xám sáng hơn sidebar
  - content có scroll riêng, topbar/sidebar đứng yên

#### Haravan-like Token Direction

Các token sau là **ước lượng theo screenshot**, không phải token export chính thức:

- `--hv-bg-app: #f4f6fa`
- `--hv-bg-sidebar: #eef2f7`
- `--hv-bg-surface: #ffffff`
- `--hv-bg-surface-hover: #f8fbff`
- `--hv-border: #dbe3ef`
- `--hv-border-strong: #c9d4e5`
- `--hv-text-primary: #1f2937`
- `--hv-text-secondary: #667085`
- `--hv-text-muted: #98a2b3`
- `--hv-primary: #2f6bff`
- `--hv-primary-hover: #255ae8`
- `--hv-primary-soft: #eaf1ff`
- `--hv-success: #22c55e`
- `--hv-success-soft: #e9f9ef`
- `--hv-warning: #f59e0b`
- `--hv-warning-soft: #fff4dd`
- `--hv-danger: #ef4444`
- `--hv-danger-soft: #feecec`

#### Surface & Spacing

- Card radius giảm nhẹ so với bản hiện tại: `12-16px`.
- Border mảnh, ưu tiên `1px`.
- Shadow rất nhẹ, tránh feel “marketing card”.
- Sidebar list item bo tròn capsule hơn, active state dùng fill nhẹ thay vì border trái đậm.

## Proposed Changes

### 1. `prototype/haravan_invoice_admin_mockup.html`

#### Layout Refactor

- Chuyển toàn bộ prototype từ `max-width: 1200px` sang fullscreen app shell.
- Tạo cấu trúc:
  - `app-frame`
  - `app-topbar`
  - `app-sidebar`
  - `app-main`
  - `app-stage`
  - `app-rail` (cho persona / guided demo / state switch nếu cần)
- Sidebar, topbar, content có hierarchy gần screenshot tham chiếu.

#### Haravan-like Branding Refresh

- Thay bộ màu hiện tại bằng token Haravan-like.
- Tăng độ tương phản của primary blue cho các hành động chính.
- Chuyển background canvas từ beige/cream hiện tại sang neutral cool gray gần Haravan.
- Update avatar, badges, nav item, search bar, pills, table headers, floating copilot để đồng bộ.

#### Fullscreen Interaction Model

- Sidebar cố định và scroll riêng nếu nội dung dài.
- Main content scroll riêng.
- Bỏ cảm giác “demo card giữa trang”, thay bằng cảm giác “đang ở trong Haravan Admin thật”.

#### Persona + Demo Layer

- Thêm một control nhỏ ở topbar hoặc context rail:
  - `Owner`
  - `Kế toán`
  - `Thu ngân`
  - `Khách cuối`
- Thêm “Demo scenario switcher” hoặc quick links:
  - Phát hành 1-click
  - Xử lý sai sót
  - Inbound AI
  - Gộp đơn cuối ngày
  - Compliance update

#### State Coverage

Batch 1 cần có state scaffolding ở master prototype:
- loading
- empty
- error
- pending
- partial success
- success

Không nhất thiết mọi state đều full flow, nhưng phải có entry point để demo/QA.

### 2. Layer 1 — Executive Demo Shell

Mục tiêu: dùng cho stakeholder walkthrough.

Bao gồm:
- fullscreen Haravan-like shell
- dashboard tổng quan
- danh sách hóa đơn
- phát hành mới
- wizard sai sót
- compliance
- kết nối T-VAN
- floating copilot
- persona mode + scenario shortcuts

### 3. Layer 2 — Admin Workbench Core

Mục tiêu: đi sâu JTBD kế toán/vận hành.

Được plan để bổ sung trong master shell theo batch:
- bulk actions + background progress
- daily aggregation center
- inbound AI workbench
- notification center
- onboarding/settings/template/chữ ký số
- customer delivery/signing detail state

### 4. Layer 3 — Companion Mockups

Các file đề xuất trong `prototype/`:
- `pos_tablet_mockup.html`
- `inbound_ai_mockup.html`
- `automation_builder_mockup.html`
- `customer_portal_mockup.html`
- `mobile_owner_mockup.html`

Master shell sẽ link sang các file này như “specialized deep-dive views”.

### 5. Information Architecture

#### Navigation

Sidebar sẽ được tổ chức lại để gần screenshot hơn:
- Search đầu sidebar
- Nhóm điều hướng chính theo admin shell Haravan
- `Hóa đơn` là section đang active với child routes
- Các section khác chỉ đóng vai trò shell context, không phải trọng tâm demo

#### Topbar

Topbar nên gần screenshot hơn:
- breadcrumb trái
- icon utilities phải
- merchant/workspace switch pill
- avatar

#### Main Stage

Main stage ưu tiên:
- page title lớn
- action bar/phụ filter ngay dưới title
- content cards/table theo spacing ổn định

## Batch Plan

### Batch 1 — Fullscreen Haravan Shell v2

Phạm vi:
- fullscreen layout
- Haravan-like palette
- refreshed sidebar/topbar/main stage
- persona switcher
- scenario launcher
- state scaffolding

### Batch 2 — Accounting JTBD Depth

Phạm vi:
- one-click issue entry points
- bulk operation panel
- daily aggregation flow
- inbound AI workbench preview
- customer signing preview

### Batch 3 — Companion Prototypes

Phạm vi:
- POS tablet
- automation builder
- customer portal
- mobile owner
- cross-linking giữa master shell và mockup vệ tinh

## Verification

### Visual Verification

- Master prototype mở fullscreen không còn cảm giác centered demo card.
- So với screenshot tham chiếu:
  - topbar/left nav/surface hierarchy gần phong cách Haravan
  - primary blue và green accents gần benchmark
  - sidebar active state và search feel giống hệ admin hơn hiện trạng

### UX Verification

- Có thể demo ít nhất 5 câu chuyện:
  - Owner xem tổng quan và compliance
  - Kế toán phát hành nhanh
  - Kế toán xử lý sai sót
  - Kế toán xử lý inbound/bulk
  - Owner xem automation / điều phối

### Structural Verification

- Master shell vẫn mở trực tiếp bằng browser, không cần build.
- Companion mockups có naming rõ ràng trong `prototype/`.
- Prototype có traceability về phase docs và proposal hiện tại.
