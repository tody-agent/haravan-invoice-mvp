# Prompt 7a — Migration + Seed Data

## Task

### 1. Tạo file `apps/api/migrations/002-audit-tables.sql`:

```sql
-- Migration 002: Notifications + Products tables
-- Run: wrangler d1 execute haravan-invoice-mvp --local --file=migrations/002-audit-tables.sql

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('success', 'warning', 'error', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  category TEXT CHECK(category IN ('invoice', 'system', 'aggregate', 'customer')),
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_notifications_merchant ON notifications(merchant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(merchant_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  sku TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  tax_rate REAL DEFAULT 0.1,
  unit TEXT DEFAULT 'cái',
  description TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_products_merchant ON products(merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(merchant_id, sku);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(merchant_id, active);

INSERT OR IGNORE INTO notifications (id, merchant_id, type, title, message, category, read, created_at) VALUES
('notif-001', 'merchant-001', 'success', 'Hóa đơn đã phát hành', 'HRV-INV-001-001 đã được CQT chấp nhận', 'invoice', 0, datetime('now', '-5 minutes')),
('notif-002', 'merchant-001', 'warning', 'Hóa đơn chờ xử lý', 'HRV-INV-001-003 đang chờ CQT xác nhận', 'invoice', 0, datetime('now', '-15 minutes')),
('notif-003', 'merchant-001', 'error', 'Phát hành thất bại', 'HRV-INV-001-005 bị từ chối bởi CQT', 'invoice', 1, datetime('now', '-1 hour')),
('notif-004', 'merchant-001', 'info', 'Cập nhật hệ thống', 'Phiên bản mới đã sẵn sàng', 'system', 1, datetime('now', '-2 hours')),
('notif-005', 'merchant-001', 'success', 'Gộp đơn thành công', 'Đã gộp 15 đơn lẻ thành 1 hóa đơn tổng', 'aggregate', 1, datetime('now', '-1 day'));

INSERT OR IGNORE INTO products (id, merchant_id, name, sku, price, tax_rate, unit, description) VALUES
('prod-001', 'merchant-001', 'Laptop Dell Inspiron 15', 'DELL-INS-15', 15000000, 0.1, 'cái', 'Laptop Dell Inspiron 15 inch'),
('prod-002', 'merchant-001', 'Bàn phím cơ Logitech', 'LOG-KB-001', 500000, 0.1, 'cái', 'Bàn phím cơ Logitech'),
('prod-003', 'merchant-001', 'Chuột Logitech MX Master', 'LOG-MX-001', 300000, 0.1, 'cái', 'Chuột không dây Logitech'),
('prod-004', 'merchant-001', 'Màn hình Samsung 27"', 'SAM-MON-27', 5000000, 0.1, 'cái', 'Màn hình Samsung 27 inch'),
('prod-005', 'merchant-001', 'SSD 1TB Samsung', 'SAM-SSD-1TB', 2000000, 0.1, 'cái', 'SSD Samsung 1TB'),
('prod-006', 'merchant-001', 'RAM 16GB DDR5', 'RAM-DDR5-16', 1500000, 0.1, 'cái', 'RAM DDR5 16GB'),
('prod-007', 'merchant-001', 'Webcam Logitech C920', 'LOG-WC-920', 800000, 0.1, 'cái', 'Webcam Logitech C920'),
('prod-008', 'merchant-001', 'Tai nghe Sony WH-1000XM5', 'SONY-WH-1000', 7000000, 0.1, 'cái', 'Tai nghe Sony WH-1000XM5'),
('prod-009', 'merchant-001', 'Ổ cứng di động 2TB', 'HDD-EXT-2TB', 1800000, 0.1, 'cái', 'Ổ cứng di động 2TB'),
('prod-010', 'merchant-001', 'Card đồ họa RTX 4070', 'NVIDIA-RTX-4070', 15000000, 0.1, 'cái', 'NVIDIA RTX 4070');
```

### 2. Append vào cuối `apps/api/seed.sql`:

Thêm products + notifications seed data vào cuối file seed.sql hiện tại.

### 3. Chạy migration

```bash
cd /Volumes/Data/Invoice/apps/api
wrangler d1 execute haravan-invoice-mvp --local --file=migrations/002-audit-tables.sql
```

### 4. Verify

```bash
wrangler d1 execute haravan-invoice-mvp --local --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```
