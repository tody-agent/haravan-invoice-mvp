# Prototype Spec Delta: Batch 1 Shell Refresh

## MODIFIED Requirement: SHALL emulate shell Haravan Admin

Prototype SHALL hiển thị shell layout gần với Haravan Admin ở chế độ fullscreen, với top bar cố định, sidebar trái cố định, và content area scroll nội bộ thay vì centered demo canvas.

### Scenario: Fullscreen shell
- WHEN user mở `prototype/haravan_invoice_admin_mockup.html`
- THEN prototype chiếm toàn bộ viewport
- AND sidebar, top bar, main stage tạo cảm giác như một admin workspace thực tế

### Scenario: Haravan-like visual hierarchy
- WHEN user xem shell
- THEN sidebar dùng nền xám sáng
- AND top bar dùng nền trắng
- AND card/content surface dùng nền trắng trên canvas xám lạnh
- AND màu primary blue gần benchmark Haravan

## ADDED Requirement: SHALL support guided persona demo mode

Prototype SHALL có control để chuyển persona demo nhằm hỗ trợ walkthrough theo JTBD.

### Scenario: Persona switch
- WHEN user chọn `Owner`, `Kế toán`, `Thu ngân`, hoặc `Khách cuối`
- THEN UI hiển thị persona hiện tại rõ ràng
- AND rail ngữ cảnh cập nhật demo focus tương ứng

## ADDED Requirement: SHALL expose demo scenario launcher

Prototype SHALL có danh sách scenario launcher để người demo nhảy nhanh vào các use case trọng tâm.

### Scenario: Jump to scenario
- WHEN user click một scenario như `Phát hành 1-click` hoặc `Tuân thủ`
- THEN prototype chuyển tới màn hình liên quan
- AND breadcrumb/context cập nhật theo screen đó

## ADDED Requirement: SHALL scaffold key operational states

Prototype SHALL có scaffolding cho các trạng thái vận hành quan trọng để dùng trong demo và review UX.

### Scenario: State strip visible
- WHEN user xem master prototype
- THEN có thể thấy các trạng thái mẫu như `Loading`, `Empty`, `Pending`, `Success`, `Error`
- AND các trạng thái này được trình bày như artifact phục vụ demo/thiết kế

## ADDED Requirement: SHALL preview accounting workbench depth

Prototype SHALL mở rộng master shell để preview các flow kế toán/vận hành trọng yếu của Batch 2.

### Scenario: Bulk actions và daily aggregation
- WHEN user mở màn hình Danh sách hóa đơn
- THEN user thấy bulk action toolbar
- AND có panel tiến độ job nền
- AND có entry point sang gộp đơn lẻ cuối ngày

### Scenario: Inbound AI workbench
- WHEN user chuyển sang màn hình Inbound AI
- THEN prototype hiển thị danh sách hóa đơn đầu vào
- AND có AI classify, PO match, accounting suggest, và trạng thái review

## ADDED Requirement: SHALL preview customer delivery and signing flow

Prototype SHALL có preview cho flow gửi hóa đơn và ký xác nhận với khách cuối.

### Scenario: Delivery preview
- WHEN user ở màn hình Phát hành mới hoặc Wizard
- THEN prototype hiển thị các kênh gửi như Email, Zalo OA, Portal link
- AND có trạng thái giao hàng/ký như `đã gửi`, `đã mở`, `đang chờ ký`

## ADDED Requirement: SHALL expose notification and regulation center

Prototype SHALL có khu vực notification/regulation để owner hoặc kế toán thấy các cập nhật cần hành động.

### Scenario: Notification center visible
- WHEN user mở Compliance hoặc context rail
- THEN prototype hiển thị thông báo về regulation, pending job, signing wait, hoặc risk review
- AND các thông báo này gắn với action tiếp theo rõ ràng
