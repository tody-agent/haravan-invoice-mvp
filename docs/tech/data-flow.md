---
title: 'Luồng dữ liệu Haravan Invoice MVP — Data Flow Diagrams'
description: 'Sơ đồ luồng dữ liệu từ Portal → Gateway → Database → TVAN Adapter cho các nghiệp vụ hóa đơn điện tử.'
keywords: 'data flow, sequence diagram, invoice lifecycle, request flow, event flow'
robots: 'index, follow'
---

# Luồng dữ liệu

> Sơ đồ luồng dữ liệu chi tiết cho các nghiệp vụ chính: tạo hóa đơn, thay thế, điều chỉnh, báo cáo và aggregate.

:::tip Tóm tắt
Tài liệu này mô tả luồng dữ liệu qua 3 lớp: Portal UI → Gateway API → Data Layer, với 5 luồng nghiệp vụ chính được minh họa bằng sequence diagrams.
:::

## 1. Luồng tạo & phát hành hóa đơn

```mermaid
sequenceDiagram
    participant U as User
    participant P as Portal
    participant G as Gateway
    participant A as Auth
    participant S as InvoiceService
    participant D as D1
    participant T as TVAN Adapter

    U->>P: Điền form hóa đơn
    P->>G: POST /api/v1/invoices
    G->>A: Verify JWT
    A-->>G: AuthUser {merchantId}
    G->>S: service.create(body, merchantId)
    S->>S: Validate invoice data
    S->>D: INSERT INTO invoices (status=draft)
    D-->>S: Invoice record
    S->>T: adapter.issue(invoice)
    T-->>S: TVANResult {success, tvanId}
    S->>D: UPDATE status='issued', tvan_id
    S->>D: INSERT INTO audit_logs
    S-->>G: {success, data: invoice}
    G-->>P: JSON 201
    P-->>U: Hiển thị kết quả
```

*Hình 1: Luồng tạo và phát hành hóa đơn*

## 2. Luồng thay thế hóa đơn (NĐ 70/2025)

```mermaid
sequenceDiagram
    participant U as User
    participant P as Portal
    participant G as Gateway
    participant S as InvoiceService
    participant D as D1
    participant T as TVAN Adapter

    U->>P: Chọn HĐ cần thay thế
    P->>G: POST /api/v1/invoices/:id/replace
    G->>S: service.replace(id, body, merchantId)
    S->>D: SELECT invoice WHERE id
    D-->>S: Original invoice
    S->>S: Validate replacement data
    S->>D: INSERT new invoice (status=draft)
    D-->>S: New invoice
    S->>T: adapter.replace(originalId, newInvoice)
    T-->>S: TVANResult {success, tvanId}
    S->>D: UPDATE original: status='replaced', replaced_by
    S->>D: UPDATE new: status='issued', replaces
    S->>D: INSERT audit_logs (x2)
    S-->>G: {success, data: newInvoice}
    G-->>P: JSON response
    P-->>U: Hiển thị HĐ thay thế
```

*Hình 2: Luồng thay thế hóa đơn*

## 3. Luồng điều chỉnh hóa đơn

```mermaid
sequenceDiagram
    participant U as User
    participant P as Portal
    participant G as Gateway
    participant S as InvoiceService
    participant D as D1
    participant T as TVAN Adapter

    U->>P: Chọn HĐ cần điều chỉnh
    P->>G: POST /api/v1/invoices/:id/adjust
    G->>S: service.adjust(id, body, merchantId)
    S->>D: SELECT invoice WHERE id
    D-->>S: Original invoice
    S->>S: Calculate adjusted totals
    S->>D: INSERT adjustment invoice
    D-->>S: Adjustment invoice
    S->>T: adapter.adjust(originalId, adjustment)
    T-->>S: TVANResult
    S->>D: UPDATE original: status='adjusted', adjusted_by
    S->>D: INSERT audit_logs (x2)
    S-->>G: {success, data: adjustmentInvoice}
    G-->>P: JSON response
    P-->>U: Hiển thị HĐ điều chỉnh
```

*Hình 3: Luồng điều chỉnh hóa đơn*

## 4. Luồng gộp hóa đơn cuối ngày (Aggregate)

```mermaid
sequenceDiagram
    participant P as Portal
    participant G as Gateway
    participant D as D1

    P->>G: GET /api/v1/aggregate?date=YYYY-MM-DD
    G->>D: SELECT COUNT, SUM WHERE channel IN ('pos','web') AND date = ?
    D-->>G: Aggregate data {totalQty, totalAmount, invoiceCount}
    G-->>P: JSON response
    P->>P: Hiển thị bảng tổng hợp
    P->>P: Nút "Gộp & gửi CQT"
```

*Hình 4: Luồng aggregate cuối ngày*

## 5. Luồng báo cáo

```mermaid
sequenceDiagram
    participant P as Portal
    participant G as Gateway
    participant D as D1

    P->>G: GET /api/v1/reports/summary
    G->>D: SELECT COUNT WHERE status='issued' AND month=now()
    G->>D: SELECT COUNT WHERE status='pending'
    G->>D: SELECT SUM(total) WHERE month=now()
    D-->>G: Summary data
    G-->>P: {totalIssued, totalPending, revenueThisMonth}
    P->>P: Render KPI cards

    P->>G: GET /api/v1/reports/monthly?month=YYYY-MM
    G->>D: SELECT * WHERE strftime('%Y-%m', issue_date) = ?
    D-->>G: Invoice list + summary
    G-->>P: {invoices[], summary{count, totalAmount, taxAmount}}
    P->>P: Render monthly report table
```

*Hình 5: Luồng báo cáo*

## Invoice Lifecycle

```mermaid
stateDiagram-v2
    [*] --> draft: Tạo hóa đơn
    draft --> pending: Gửi TVAN
    pending --> issued: TVAN thành công
    pending --> cqt_rejected: TVAN thất bại
    issued --> cqt_accepted: CQT xác nhận
    issued --> adjusted: Điều chỉnh
    issued --> replaced: Thay thế
    adjusted --> [*]: Hoàn tất
    replaced --> [*]: Hoàn tất
    cqt_rejected --> pending: Gửi lại
```

*Hình 6: Vòng đời hóa đơn*

## Liên kết liên quan

- [Kiến trúc hệ thống](./architecture.md)
- [Cơ sở dữ liệu](./database.md)
- [API Invoices](../api/invoices.md)
