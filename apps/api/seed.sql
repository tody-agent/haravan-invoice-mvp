-- Seed data for development
-- 10 realistic Vietnamese invoices

-- Merchant config
INSERT OR IGNORE INTO merchant_config (merchant_id, auto_issue_on_paid, default_tax_rate, seller_name, seller_mst, seller_address, tvan_provider)
VALUES ('merchant-001', 1, 0.1, 'Công ty TNHH Thương mại ABC', '0123456789', '123 Nguyễn Huệ, Quận 1, TP.HCM', 'mock');

-- Customers
INSERT OR IGNORE INTO customers (id, name, mst, address, email, phone) VALUES
('cust-001', 'Công ty TNHH Đầu tư XYZ', '9876543210', '456 Lê Lợi, Quận 3, TP.HCM', 'xyz@example.com', '0901234567'),
('cust-002', 'Nguyễn Văn A', '', '789 Trần Hưng Đạo, Quận 5, TP.HCM', 'nguyenvana@gmail.com', '0912345678'),
('cust-003', 'Cổ phần Dịch vụ DEF', '1122334455', '12 Võ Văn Tần, Quận 1, TP.HCM', 'def@example.com', '0923456789'),
('cust-004', 'Trần Thị B', '', '34 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'tranthib@yahoo.com', '0934567890'),
('cust-005', 'Công ty CP Xuất nhập khẩu GHI', '5566778899', '56 Hai Bà Trưng, Quận 1, TP.HCM', 'ghi@example.com', '0945678901');

-- Invoices (10 sample invoices)
INSERT OR IGNORE INTO invoices (id, haravan_id, status, issue_date, buyer_name, buyer_mst, buyer_address, seller_name, seller_mst, items, subtotal, tax_amount, total, tax_rate, payment_method, channel, created_at) VALUES
('inv-001', 'HRV-INV-001-001', 'cqt_accepted', '2026-05-01', 'Công ty TNHH Đầu tư XYZ', '9876543210', '456 Lê Lợi, Quận 3, TP.HCM', 'Công ty TNHH Thương mại ABC', '0123456789', '[{"name":"Laptop Dell Inspiron","quantity":2,"unitPrice":15000000,"taxRate":0.1,"total":33000000}]', 30000000, 3000000, 33000000, 0.1, 'transfer', 'admin', '2026-05-01T10:00:00Z'),
('inv-002', 'HRV-INV-001-002', 'issued', '2026-05-02', 'Nguyễn Văn A', '', '789 Trần Hưng Đạo, Quận 5, TP.HCM', 'Công ty TNHH Thương mại ABC', '0123456789', '[{"name":"Bàn phím cơ","quantity":5,"unitPrice":500000,"taxRate":0.1,"total":2750000}]', 2500000, 250000, 2750000, 0.1, 'cash', 'pos', '2026-05-02T14:30:00Z'),
('inv-003', 'HRV-INV-001-003', 'pending', '2026-05-03', 'Cổ phần Dịch vụ DEF', '1122334455', '12 Võ Văn Tần, Quận 1, TP.HCM', 'Công ty TNHH Thương mại ABC', '0123456789', '[{"name":"Chuột Logitech MX","quantity":10,"unitPrice":300000,"taxRate":0.1,"total":3300000}]', 3000000, 300000, 3300000, 0.1, 'transfer', 'admin', '2026-05-03T09:15:00Z'),
('inv-004', 'HRV-INV-001-004', 'cqt_accepted', '2026-05-04', 'Trần Thị B', '', '34 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'Công ty TNHH Thương mại ABC', '0123456789', '[{"name":"Màn hình Samsung 27\"","quantity":3,"unitPrice":5000000,"taxRate":0.1,"total":16500000}]', 15000000, 1500000, 16500000, 0.1, 'card', 'web', '2026-05-04T16:45:00Z'),
('inv-005', 'HRV-INV-001-005', 'replaced', '2026-05-05', 'Công ty CP Xuất nhập khẩu GHI', '5566778899', '56 Hai Bà Trưng, Quận 1, TP.HCM', 'Công ty TNHH Thương mại ABC', '0123456789', '[{"name":"SSD 1TB","quantity":20,"unitPrice":2000000,"taxRate":0.1,"total":44000000}]', 40000000, 4000000, 44000000, 0.1, 'transfer', 'admin', '2026-05-05T11:00:00Z'),
('inv-006', 'HRV-INV-001-006', 'draft', NULL, 'Công ty TNHH Đầu tư XYZ', '9876543210', '456 Lê Lợi, Quận 3, TP.HCM', 'Công ty TNHH Thương mại ABC', '0123456789', '[{"name":"RAM 16GB DDR5","quantity":8,"unitPrice":1500000,"taxRate":0.1,"total":13200000}]', 12000000, 1200000, 13200000, 0.1, 'transfer', 'admin', '2026-05-06T08:00:00Z'),
('inv-007', 'HRV-INV-001-007', 'issued', '2026-05-07', 'Nguyễn Văn A', '', '789 Trần Hưng Đạo, Quận 5, TP.HCM', 'Công ty TNHH Thương mại ABC', '0123456789', '[{"name":"Webcam Logitech C920","quantity":15,"unitPrice":800000,"taxRate":0.1,"total":13200000}]', 12000000, 1200000, 13200000, 0.1, 'cash', 'pos', '2026-05-07T13:20:00Z'),
('inv-008', 'HRV-INV-001-008', 'cqt_accepted', '2026-05-08', 'Cổ phần Dịch vụ DEF', '1122334455', '12 Võ Văn Tần, Quận 1, TP.HCM', 'Công ty TNHH Thương mại ABC', '0123456789', '[{"name":"Tai nghe Sony WH-1000XM5","quantity":6,"unitPrice":7000000,"taxRate":0.1,"total":46200000}]', 42000000, 4200000, 46200000, 0.1, 'transfer', 'admin', '2026-05-08T10:30:00Z'),
('inv-009', 'HRV-INV-001-009', 'pending', '2026-05-09', 'Trần Thị B', '', '34 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'Công ty TNHH Thương mại ABC', '0123456789', '[{"name":"Ổ cứng di động 2TB","quantity":4,"unitPrice":1800000,"taxRate":0.1,"total":7920000}]', 7200000, 720000, 7920000, 0.1, 'card', 'web', '2026-05-09T15:00:00Z'),
('inv-010', 'HRV-INV-001-010', 'adjusted', '2026-05-10', 'Công ty CP Xuất nhập khẩu GHI', '5566778899', '56 Hai Bà Trưng, Quận 1, TP.HCM', 'Công ty TNHH Thương mại ABC', '0123456789', '[{"name":"Card đồ họa RTX 4070","quantity":2,"unitPrice":15000000,"taxRate":0.1,"total":33000000}]', 30000000, 3000000, 33000000, 0.1, 'transfer', 'admin', '2026-05-10T09:45:00Z');

-- Audit logs
INSERT OR IGNORE INTO audit_logs (id, invoice_id, action, actor, details, created_at) VALUES
('audit-001', 'inv-001', 'created', 'system', '{"source":"auto-issue"}', '2026-05-01T10:00:00Z'),
('audit-002', 'inv-001', 'issued', 'system', '{"tvanId":"MOCK-001"}', '2026-05-01T10:00:05Z'),
('audit-003', 'inv-001', 'cqt_accepted', 'system', '{"confirmationId":"CQT-001"}', '2026-05-01T10:05:00Z'),
('audit-004', 'inv-002', 'created', 'user:cashier-01', '{"source":"pos"}', '2026-05-02T14:30:00Z'),
('audit-005', 'inv-002', 'issued', 'system', '{"tvanId":"MOCK-002"}', '2026-05-02T14:30:05Z'),
('audit-006', 'inv-005', 'replaced', 'user:admin', '{"newInvoiceId":"inv-005-r","reason":"Sai thông tin người mua"}', '2026-05-06T09:00:00Z');

-- Products
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

-- Notifications
INSERT OR IGNORE INTO notifications (id, merchant_id, type, title, message, category, read, created_at) VALUES
('notif-001', 'merchant-001', 'success', 'Hóa đơn đã phát hành', 'HRV-INV-001-001 đã được CQT chấp nhận', 'invoice', 0, datetime('now', '-5 minutes')),
('notif-002', 'merchant-001', 'warning', 'Hóa đơn chờ xử lý', 'HRV-INV-001-003 đang chờ CQT xác nhận', 'invoice', 0, datetime('now', '-15 minutes')),
('notif-003', 'merchant-001', 'error', 'Phát hành thất bại', 'HRV-INV-001-005 bị từ chối bởi CQT', 'invoice', 1, datetime('now', '-1 hour')),
('notif-004', 'merchant-001', 'info', 'Cập nhật hệ thống', 'Phiên bản mới đã sẵn sàng', 'system', 1, datetime('now', '-2 hours')),
('notif-005', 'merchant-001', 'success', 'Gộp đơn thành công', 'Đã gộp 15 đơn lẻ thành 1 hóa đơn tổng', 'aggregate', 1, datetime('now', '-1 day'));
