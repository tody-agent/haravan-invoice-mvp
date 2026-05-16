# Settings API

## Overview

The Settings API provides configuration management for invoice templates, automation rules, and plan/usage information. All settings are scoped per merchant and stored in the `merchant_config` table (D1).

## Authentication

All endpoints require Bearer token authentication.

```
Authorization: Bearer <token>
```

---

## GET /api/v1/settings/templates

Get the current invoice template configuration for the authenticated merchant.

### Response

**200 OK**
```json
{
  "success": true,
  "data": {
    "mauSo": "01GTKT0/001",
    "kyHieu": "AA/20E",
    "templateName": "Hóa đơn GTGT",
    "status": "active"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `mauSo` | string | Mẫu số — invoice template code per Circular 78/2021 |
| `kyHieu` | string | Ký hiệu — invoice symbol/series identifier |
| `templateName` | string | Human-readable template name |
| `status` | string | Template status: `active`, `inactive` |

### Mẫu số Reference

| Mẫu số | Description |
|--------|-------------|
| `01GTKT0/001` | Hóa đơn giá trị gia tăng (VAT invoice) |
| `02GTTT0/001` | Hóa đơn bán hàng (Sales invoice) |
| `06HDXK0/001` | Hóa đơn xuất khẩu (Export invoice) |

---

## PATCH /api/v1/settings/templates

Update the invoice template configuration.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mauSo` | string | No | Mẫu số (default: `01GTKT0/001`) |
| `kyHieu` | string | No | Ký hiệu (default: `AA/20E`) |

### Example Request

```json
{
  "mauSo": "02GTTT0/001",
  "kyHieu": "BB/21E"
}
```

### Response

**200 OK**
```json
{
  "success": true,
  "message": "Đã cập nhật mẫu hóa đơn"
}
```

---

## GET /api/v1/settings/automation

Get the current automation rules for the authenticated merchant.

### Response

**200 OK**
```json
{
  "success": true,
  "data": {
    "autoIssueOnPaid": false,
    "channels": ["web", "pos"],
    "delayMinutes": 0,
    "notifyOnIssue": true,
    "notifyOnError": true
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `autoIssueOnPaid` | boolean | Auto-issue invoice when order is paid |
| `channels` | string[] | Channels to apply auto-issue: `web`, `pos`, `admin` |
| `delayMinutes` | number | Delay (minutes) before auto-issuing (0 = immediate) |
| `notifyOnIssue` | boolean | Send notification on successful issue |
| `notifyOnError` | boolean | Send notification on issue error |

---

## PATCH /api/v1/settings/automation

Update automation rules.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `autoIssueOnPaid` | boolean | No | Auto-issue on paid toggle |

### Example Request

```json
{
  "autoIssueOnPaid": true
}
```

### Response

**200 OK**
```json
{
  "success": true,
  "message": "Đã cập nhật quy tắc tự động"
}
```

---

## GET /api/v1/settings/plan

Get the current plan information and usage statistics.

### Response

**200 OK**
```json
{
  "success": true,
  "data": {
    "plan": "Free",
    "invoiceLimit": 100,
    "invoiceUsed": 42,
    "storageLimit": 1024,
    "storageUsed": 0,
    "features": ["basic_invoice", "reports", "pdf_export"],
    "expiresAt": null
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `plan` | string | Current plan: `Free`, `Pro`, `Enterprise` |
| `invoiceLimit` | number | Monthly invoice limit |
| `invoiceUsed` | number | Invoices issued this month |
| `storageLimit` | number | Storage limit in MB |
| `storageUsed` | number | Storage used in MB |
| `features` | string[] | Enabled feature keys |
| `expiresAt` | string \| null | Plan expiration date (ISO 8601), null for Free |

### Feature Keys

| Key | Label | Free | Pro | Enterprise |
|-----|-------|:----:|:---:|:----------:|
| `basic_invoice` | Phát hành HĐ | ✅ | ✅ | ✅ |
| `reports` | Báo cáo | ✅ | ✅ | ✅ |
| `pdf_export` | Xuất PDF | ✅ | ✅ | ✅ |
| `customer_management` | Quản lý KH | ✅ | ✅ | ✅ |
| `automation` | Tự động hóa | ❌ | ✅ | ✅ |
| `ai_pre_check` | AI Tiền-kiểm | ❌ | ❌ | ✅ |

---

## Examples

**Get template config**
```bash
curl -H "Authorization: Bearer <token>" \
  https://api.example.com/api/v1/settings/templates
```

**Update template config**
```bash
curl -X PATCH -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"mauSo":"02GTTT0/001","kyHieu":"BB/21E"}' \
  https://api.example.com/api/v1/settings/templates
```

**Get automation rules**
```bash
curl -H "Authorization: Bearer <token>" \
  https://api.example.com/api/v1/settings/automation
```

**Enable auto-issue on paid**
```bash
curl -X PATCH -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"autoIssueOnPaid":true}' \
  https://api.example.com/api/v1/settings/automation
```

**Get plan info**
```bash
curl -H "Authorization: Bearer <token>" \
  https://api.example.com/api/v1/settings/plan
```

---

## Database Schema

Settings are stored in the `merchant_config` table:

```sql
CREATE TABLE merchant_config (
  merchant_id TEXT PRIMARY KEY,
  auto_issue_on_paid INTEGER DEFAULT 0,
  default_tax_rate REAL DEFAULT 0.1,
  seller_name TEXT,
  seller_mst TEXT,
  seller_address TEXT,
  tvan_provider TEXT DEFAULT 'mock',
  mau_so TEXT DEFAULT '01GTKT0/001',
  ky_hieu TEXT DEFAULT 'AA/20E',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

## Notes

- `mau_so` and `ky_hieu` default to `01GTKT0/001` and `AA/20E` for new merchants
- `auto_issue_on_paid` is stored as INTEGER (0/1) in SQLite, returned as boolean
- `invoiceUsed` counts invoices created in the current calendar month
- Plan features are currently hardcoded; will be driven by subscription system in production
