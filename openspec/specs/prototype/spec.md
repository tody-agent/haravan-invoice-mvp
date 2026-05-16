# Spec: Prototype (current state — v1.0)

Trạng thái hiện tại của prototype Haravan Invoice Wrapper, baseline tại thời điểm 13/05/2026. Mọi thay đổi sau này phải qua change trong `openspec/changes/`.

## Purpose

Prototype clickable single-file HTML demo concept giải pháp Haravan Invoice Wrapper trên nền T-VAN Hilo. Phục vụ stakeholder demo, merchant interview, và làm UX baseline cho Phase 1 build.

## Requirements

### Requirement: SHALL là single standalone HTML file

Prototype SHALL được đóng gói trong 1 file HTML duy nhất, mở được trực tiếp bằng trình duyệt mà không cần build step hay backend.

#### Scenario: Mở bằng double-click
- WHEN user double-click file `haravan_invoice_admin_mockup.html`
- THEN trình duyệt mặc định mở và render đầy đủ UI trong <2s

#### Scenario: External dependency tối thiểu
- WHEN prototype load
- THEN chỉ phụ thuộc 1 CSS Tabler Icons từ jsDelivr CDN
- AND không phụ thuộc framework JavaScript external

### Requirement: SHALL có 6 màn hình admin chính

Prototype SHALL hiển thị 6 màn hình core của giải pháp Haravan Invoice, navigate được qua sub-menu sidebar.

#### Scenario: Default view khi mở
- WHEN user mở prototype
- THEN màn hình "Tổng quan" hiển thị mặc định
- AND breadcrumb hiển thị "Hóa đơn › Tổng quan"

#### Scenario: Switch giữa các màn hình
- WHEN user click 1 trong 6 sub-menu (Tổng quan, Danh sách, Phát hành mới, Xử lý sai sót, Tuân thủ, Kết nối T-VAN)
- THEN màn hình tương ứng hiển thị
- AND breadcrumb cập nhật
- AND sub-menu được highlight active

### Requirement: SHALL emulate shell Haravan Admin

Prototype SHALL có shell layout giống Haravan Admin: sidebar trái với navigation chính, top bar với breadcrumb + notification + avatar, main content area.

#### Scenario: Sidebar navigation hierarchy
- WHEN user xem sidebar
- THEN có các mục: Tổng quan, Đơn hàng, Vận chuyển, Sản phẩm, Khách hàng, Hóa đơn (expanded với 6 sub), Sổ quỹ, Khuyến mãi, Báo cáo, Marketing section, Kênh bán hàng section
- AND mục "Hóa đơn" có badge "AI"

### Requirement: SHALL hiển thị Dashboard Tổng quan với KPI omnichannel

Màn hình Tổng quan SHALL có 4 KPI cards, AI insight banner, breakdown theo kênh, top branch table, recent invoices table.

#### Scenario: KPI cards
- WHEN user xem Tổng quan
- THEN hiển thị 4 KPI: Doanh thu hôm nay, Hóa đơn hôm nay, % CQT chấp nhận, Cảnh báo NCC
- AND mỗi KPI có change indicator (vs prev period)

### Requirement: SHALL hiển thị Danh sách hóa đơn meInvoice-style

Màn hình Danh sách SHALL có tabs phân loại, filter chips, table hóa đơn với cột AI flags + risk indicators.

#### Scenario: Tabs phân loại
- WHEN user xem Danh sách
- THEN có 6 tabs: Tất cả, HĐ điện tử, HĐ máy tính tiền (NĐ70), Hóa đơn đầu vào, Đã điều chỉnh, Đã thay thế

#### Scenario: Risk indicator nội bảng
- WHEN row có MST của NCC trong risk list
- THEN row được highlight nền cảnh báo
- AND cột "AI flags" hiển thị badge "⚠ NCC risk [score]"

### Requirement: SHALL hiển thị form Phát hành mới với AI tiền-kiểm

Màn hình Phát hành mới SHALL có form người mua với auto-fill MST, table hàng hóa, pre-flight check 9 rules, routing T-VAN, AI gợi ý.

#### Scenario: MST verified badge
- WHEN customer được chọn có MST đã verify CQT trong 30 ngày
- THEN field MST hiển thị badge "Verified [date]"

#### Scenario: Pre-flight check pass
- WHEN tất cả 9 rule pass
- THEN sidebar hiển thị "9/9 ✓" và button "Phát hành" enabled

### Requirement: SHALL hiển thị Wizard xử lý sai sót 5 step

Màn hình Wizard SHALL có stepper 5-step, decision tree theo NĐ 70/2025, đề xuất nghiệp vụ phù hợp.

#### Scenario: Đề xuất nghiệp vụ theo NĐ 70
- WHEN user chọn "Sai MST khách" + hóa đơn đã có ID Hilo nhưng CQT từ chối
- THEN hệ thống đề xuất "Điều chỉnh thông tin"
- AND giải thích lý do tham chiếu NĐ 70/2025

#### Scenario: KHÔNG đề xuất "Hủy"
- WHEN user xem decision tree
- THEN KHÔNG có option "Hủy hóa đơn" (đã bỏ theo NĐ 70/2025)

### Requirement: SHALL hiển thị Compliance Center với checklist

Màn hình Tuân thủ SHALL có 3 KPI compliance, checklist 7 rule pháp lý, audit timeline real-time, banner cập nhật regulation.

#### Scenario: Compliance checklist references
- WHEN user xem checklist
- THEN mỗi item reference rõ điều luật (NĐ 123 §5.2, NĐ 70 §7, TT 32 §3, QĐ 1510, …)
- AND status: Pass / Warning / Fail

### Requirement: SHALL hiển thị Multi-T-VAN abstraction

Màn hình Kết nối T-VAN SHALL hiển thị 4 T-VAN providers (Hilo primary, Viettel standby, MISA + EFY chưa connect), chứng thư số, automation list.

#### Scenario: Hilo primary
- WHEN user xem T-VAN
- THEN Hilo hiển thị badge "Active" + "Primary"
- AND có usage indicator (X/Y HĐ trong gói)

### Requirement: SHALL có Copilot AI floating widget

Prototype SHALL có Copilot widget góc dưới phải, demo conversation flow + confirmation card cho action có side-effect.

#### Scenario: Confirmation flow
- WHEN AI nhận command có side-effect (vd: "Phát hành lại HĐ #X")
- THEN hiển thị confirmation card với mô tả action chi tiết
- AND có 3 button: Sửa / Hủy / Xác nhận

### Requirement: SHALL responsive cho desktop và tablet

Prototype SHALL render đúng trên desktop ≥1280px và tablet 768-1024px (POS use case). Mobile chấp nhận degradation.

#### Scenario: Desktop primary
- WHEN viewport ≥1280px
- THEN sidebar 200px + main area chiếm hết phần còn lại
- AND tất cả table cell hiển thị đầy đủ không truncate

### Requirement: SHALL support dark mode auto

Prototype SHALL tự detect system preference dark mode và switch palette tương ứng qua CSS variables.

#### Scenario: System dark mode on
- WHEN OS user set dark mode
- THEN prototype hiển thị với palette dark (background đen, text trắng)
- AND tất cả màu accent vẫn pass contrast WCAG AA

### Requirement: SHALL có realistic Vietnamese mock data

Mock data trong prototype SHALL dùng MST thật/giống thật của doanh nghiệp Việt Nam, tên doanh nghiệp tiếng Việt, địa chỉ TP HCM/Hà Nội, sản phẩm/dịch vụ phù hợp ngành (F&B, retail, hotel).

#### Scenario: Không Lorem Ipsum
- WHEN user xem bất kỳ data trong prototype
- THEN không có placeholder "Lorem ipsum", "John Doe", "Test Company"

## Out of scope (current state)

- KHÔNG có route thật / multi-page navigation (single HTML file)
- KHÔNG có form validation interactive thật (chỉ visual)
- KHÔNG có animation/transition (chỉ basic hover state)
- KHÔNG có persistence (state mất khi refresh)
- KHÔNG có mock API layer (data hardcoded)
- KHÔNG có i18n switching (chỉ vi-VN hardcoded)
- KHÔNG có Inbound Invoice screen
- KHÔNG có POS Hararetail mockup
- KHÔNG có Customer signing portal
- KHÔNG có Bulk operations UI
- KHÔNG có Automation Builder
- KHÔNG có Mobile owner view
- KHÔNG có loading/empty/error states
- KHÔNG có template editor
- KHÔNG có onboarding wizard
- KHÔNG có notification center
- KHÔNG có RBAC settings
- KHÔNG có e-signature mobile flow
