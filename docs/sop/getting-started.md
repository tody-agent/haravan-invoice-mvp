---
title: 'Bắt đầu nhanh — Cài đặt và chạy Haravan Invoice MVP'
description: 'Hướng dẫn cài đặt, cấu hình và chạy Haravan Invoice MVP trên máy local với pnpm và Cloudflare Wrangler.'
keywords: 'bắt đầu, cài đặt, setup, getting started, local development, pnpm, wrangler'
robots: 'index, follow'
---

# Bắt đầu nhanh

> Hướng dẫn cài đặt và chạy Haravan Invoice MVP trên máy local trong 5 phút.

:::tip Tóm tắt
Haravan Invoice MVP yêu cầu Node.js >= 18, pnpm >= 9.0.0. Sau khi cài dependencies, chạy API trên port 8787 và Portal trên port 5173.
:::

## Yêu cầu hệ thống

| Thành phần | Phiên bản |
|---|---|
| Node.js | >= 18 |
| pnpm | >= 9.0.0 |
| Wrangler CLI | >= 4.14.0 |
| OS | macOS, Linux, Windows |

## Bước 1: Cài đặt dependencies

```bash
pnpm install
```

## Bước 2: Setup database

```bash
cd apps/api
pnpm db:migrate    # Tạo bảng D1
pnpm db:seed       # Seed dữ liệu mẫu
```

## Bước 3: Chạy API

```bash
# Từ thư mục gốc
pnpm dev
```

API chạy tại: `http://localhost:8787`

## Bước 4: Chạy Portal

Mở terminal mới:

```bash
pnpm dev:portal
```

Portal chạy tại: `http://localhost:5173`

## Bước 5: Đăng nhập

1. Mở trình duyệt: `http://localhost:5173`
2. Đăng nhập với mock credentials (bất kỳ email/password nào)
3. Vào Dashboard để xem tổng quan

## Cấu trúc project

```
haravan-invoice-mvp/
├── apps/
│   ├── api/          # Backend (Hono + Workers)
│   └── portal/       # Frontend (React + Pages)
├── packages/
│   └── shared/       # Shared types + validation
├── docs/             # Tài liệu (VitePress)
└── package.json      # Root workspace config
```

## Scripts available

| Script | Mô tả |
|---|---|
| `pnpm dev` | Chạy API (port 8787) |
| `pnpm dev:portal` | Chạy Portal (port 5173) |
| `pnpm dev:all` | Chạy cả API + Portal |
| `pnpm build` | Build tất cả |
| `pnpm test` | Chạy tests |
| `pnpm test:run` | Chạy tests (non-watch) |
| `pnpm lint` | Lint code |
| `pnpm typecheck` | Type check TypeScript |

## Troubleshooting

<details>
<summary>Lỗi "pnpm: command not found"</summary>

Cài đặt pnpm:

```bash
npm install -g pnpm
```

</details>

<details>
<summary>Lỗi D1 database không tồn tại</summary>

Tạo database local:

```bash
cd apps/api
npx wrangler d1 execute haravan-invoice-db --local --file=schema.sql
```

</details>

<details>
<summary>Portal không kết nối được API</summary>

Kiểm tra API đang chạy:

```bash
curl http://localhost:8787/api/v1/health
```

Nếu không có response, chạy lại `pnpm dev`.

</details>

## Liên kết liên quan

- [Kiến trúc hệ thống](../tech/architecture.md)
- [Hướng dẫn đăng nhập](./login.md)
- [Dashboard](./dashboard.md)
