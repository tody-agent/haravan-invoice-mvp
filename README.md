# Haravan Invoice MVP

Quản lý hóa đơn điện tử cho 80k+ merchant Haravan. MVP sử dụng MockAdapter (fake Hilo), build thật mọi thứ khác trên Cloudflare free tier.

## Kiến trúc

```
┌──────────────────────────────────┐
│    Portal UI (React + Pages)     │  20+ screens: Dashboard, List, Detail,
│    apps/portal                   │  Issue, Wizard, Settings, Reports,
│                                  │  Analytics, Notifications, Customers, Products
└──────────┬───────────────────────┘
           │ REST API
┌──────────▼───────────────────────┐
│    Gateway API (Hono + Workers)  │  25+ endpoints: Auth, Invoice CRUD,
│    apps/api                      │  PDF, Reports, Config, Settings, Health,
│  ┌─────────────────────────────┐ │
│  │ Validation Engine           │ │  MST, tax rates, NĐ 70/2025
│  │ MockAdapter (fake Hilo)     │ │  → swap to HiloAdapter later
│  └─────────────────────────────┘ │
└──────┬───────────┬───────────────┘
       │           │
   ┌───▼───┐   ┌──▼──┐   ┌───▼───┐
   │  D1   │   │ R2  │   │  KV   │
   │(data) │   │(PDF)│   │(cache)│
   └───────┘   └─────┘   └───────┘
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite → Cloudflare Pages |
| Backend | Hono → Cloudflare Workers |
| Database | D1 (SQLite edge) + Drizzle ORM |
| Storage | R2 (PDF cache) |
| Cache | KV (sessions, idempotency) |
| Auth | Mock JWT → swap Haravan SSO later |
| Test | Vitest |

## Getting Started

```bash
# Install dependencies
pnpm install

# Setup local D1 database
cd apps/api
pnpm db:migrate
pnpm db:seed

# Start API (port 8787)
pnpm dev

# Start Portal (port 5173, in another terminal)
pnpm dev:portal
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/login | Mock login → JWT |
| GET | /api/v1/health | Health check |
| POST | /api/v1/invoices | Create + issue invoice |
| GET | /api/v1/invoices | List + filter + pagination |
| GET | /api/v1/invoices/:id | Invoice detail |
| POST | /api/v1/invoices/:id/replace | Replace invoice (NĐ 70) |
| POST | /api/v1/invoices/:id/adjust | Adjust invoice |
| GET | /api/v1/invoices/:id/pdf | Download PDF |
| GET | /api/v1/invoices/:id/audit | Audit trail |
| GET | /api/v1/reports/summary | KPI summary |
| GET | /api/v1/reports/monthly | Monthly report |
| GET | /api/v1/config | Merchant config |
| PATCH | /api/v1/config | Update config |
| GET | /api/v1/settings/templates | Invoice template config |
| PATCH | /api/v1/settings/templates | Update invoice template |
| GET | /api/v1/settings/automation | Automation rules |
| PATCH | /api/v1/settings/automation | Update automation rules |
| GET | /api/v1/settings/plan | Plan info + usage |

## Test

```bash
# Run all tests
pnpm test

# Run with coverage
npx vitest run --coverage
```

**Current: 98 tests passing across 14 test files**

## Project Structure

```
apps/
├── api/                    # Hono API on Cloudflare Workers
│   ├── src/
│   │   ├── adapters/       # TVANAdapter (MockAdapter)
│   │   ├── middleware/     # Auth (mock JWT)
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   ├── schema.sql          # D1 migration
│   └── seed.sql            # Dev seed data
└── portal/                 # React SPA on Cloudflare Pages
    └── src/
        ├── components/     # Layout, StatusBadge
        ├── hooks/          # useAuth
        └── pages/          # Dashboard, InvoiceList, etc.
packages/
└── shared/                 # Types + validation + constants
```

## Swap to Real Hilo

```typescript
// Current: apps/api/src/adapters/factory.ts
case 'mock': return new MockAdapter();

// Future: swap to real
case 'hilo': return new HiloAdapter(config);
```

Zero code change outside adapter. Gateway, Portal, DB, Validation — all stay the same.

## Deploy

```bash
# Deploy API to Workers
cd apps/api && pnpm deploy

# Deploy Portal to Pages
cd apps/portal && pnpm build
# Then upload dist/ to Cloudflare Pages
```
