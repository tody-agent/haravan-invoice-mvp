# API Documentation — Haravan Invoice MVP v0.1.0

Base URL: `http://localhost:8787/api/v1`

## Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | ❌ | Login with username |

## Core

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | ❌ | Health check |
| GET | `/config` | ✅ | Get merchant config |
| PUT | `/config` | ✅ | Update merchant config |

## Invoices

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/invoices` | ✅ | List invoices (filter, pagination) |
| POST | `/invoices` | ✅ | Create invoice |
| GET | `/invoices/:id` | ✅ | Get invoice detail |
| POST | `/invoices/:id/replace` | ✅ | Replace invoice |
| POST | `/invoices/:id/adjust` | ✅ | Adjust invoice |
| GET | `/invoices/:id/pdf` | ✅ | Get PDF HTML |
| POST | `/invoices/from-pos` | ✅ | One-click from POS |
| POST | `/invoices/from-order` | ✅ | One-click from Order |
| GET | `/invoices/:id/status` | ✅ | Get invoice status |

## Reports

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/reports/summary` | ✅ | Report summary (KPIs) |
| GET | `/reports/monthly` | ✅ | Monthly invoice list |
| GET | `/reports/sales` | ✅ | Sales report (daily breakdown) |
| GET | `/reports/ledger` | ✅ | Ledger report |
| GET | `/reports/quarterly` | ✅ | Quarterly report |
| GET | `/reports/replaced` | ✅ | Replaced invoices |
| GET | `/reports/modified` | ✅ | Modified invoices |
| GET | `/reports/deleted` | ✅ | Deleted invoices note |

## Analytics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/analytics/channels` | ✅ | Channel distribution |
| GET | `/analytics/top-customers` | ✅ | Top customers by revenue |
| GET | `/analytics/top-skus` | ✅ | Top SKUs by quantity |

## Products

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/products` | ✅ | List products (search, pagination) |

## Customers

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/customers` | ✅ | List customers (search, pagination) |
| GET | `/customers/:id` | ✅ | Customer detail + recent invoices |
| GET | `/customers/:id/analytics` | ✅ | Customer analytics (stats, monthly, channels) |

## Notifications

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/notifications` | ✅ | List notifications (filter, type) |
| PATCH | `/notifications/:id/read` | ✅ | Mark as read |
| POST | `/notifications/read-all` | ✅ | Mark all as read |
| GET | `/notifications/unread-count` | ✅ | Unread count |

## Aggregate (TT 78)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/aggregate` | ✅ | Daily aggregate (gộp đơn lẻ) |
| GET | `/aggregate/summary` | ✅ | Aggregate summary by month |

## MST Lookup

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/mst/lookup` | ✅ | Lookup MST info (cached) |
| GET | `/mst/validate` | ✅ | Validate MST format |
| POST | `/mst/save-to-customer` | ✅ | Save MST to customer profile |

## Settings

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/settings/templates` | ✅ | Get invoice templates |
| PATCH | `/settings/templates` | ✅ | Update templates |
| GET | `/settings/automation` | ✅ | Get automation rules |
| PATCH | `/settings/automation` | ✅ | Update automation rules |
| GET | `/settings/plan` | ✅ | Get plan info |

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Missing or invalid token |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request payload |
| `MISSING_MST` | MST parameter required |
