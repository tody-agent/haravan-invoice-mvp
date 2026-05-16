-- Haravan Invoice MVP - Demo Seed Data (6 Merchants)
-- 3 ngành cơ bản + 1 Livestream + 1 Đa kênh + 1 Bán lẻ chuỗi

-- ============================================================
-- MERCHANT CONFIGS (6 merchants)
-- ============================================================

INSERT OR IGNORE INTO merchant_config (merchant_id, auto_issue_on_paid, default_tax_rate, seller_name, seller_mst, seller_address, tvan_provider, mau_so, ky_hieu)
VALUES
  ('merchant-fnb',         1, 0.1, 'Công ty TNHH F&B Saigon',              '0312345678', '15 Nguyễn Du, Quận 1, TP.HCM', 'mock', '01GTKT0/001', 'FNB/26A'),
  ('merchant-fashion',     1, 0.1, 'Công ty CP Thời Trang Việt',           '0318765432', '88 Đồng Khởi, Quận 1, TP.HCM', 'mock', '01GTKT0/002', 'TTV/26A'),
  ('merchant-cosmetics',   1, 0.1, 'Công ty TNHH Mỹ phẩm Thiên Nhiên',     '0319876543', '25 Lê Thánh Tôn, Quận 1, TP.HCM', 'mock', '01GTKT0/003', 'MPN/26A'),
  ('merchant-livestream',  1, 0.1, 'Công ty CP Livestream Commerce VN',    '0311122334', '100 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 'mock', '01GTKT0/004', 'LSC/26A'),
  ('merchant-omnichannel', 1, 0.1, 'Công ty TNHH Omnichannel Retail',      '0314455667', '50 Cách Mạng Tháng 8, Quận 10, TP.HCM', 'mock', '01GTKT0/005', 'OCR/26A'),
  ('merchant-retail',      1, 0.1, 'Công ty CP Bán Lẻ Tiện Ích VN',       '0317788990', '120 Trần Phú, Quận 5, TP.HCM', 'mock', '01GTKT0/006', 'BLT/26A');

-- ============================================================
-- CUSTOMERS (36 customers, 6 per merchant)
-- ============================================================

-- F&B Customers
INSERT OR IGNORE INTO customers (id, name, mst, address, email, phone) VALUES
  ('cust-fnb-01', 'Nguyễn Văn Hùng', '', '45 Bùi Viện, Quận 1, TP.HCM', 'hung.nguyen@gmail.com', '0901111111'),
  ('cust-fnb-02', 'Công ty TNHH Tech Solutions', '0315556666', 'Tầng 12 Bitexco, Quận 1, TP.HCM', 'admin@techsol.vn', '0902222222'),
  ('cust-fnb-03', 'Trần Thị Mai', '', '78 Nguyễn Trãi, Quận 5, TP.HCM', 'mai.tran@yahoo.com', '0903333333'),
  ('cust-fnb-04', 'Công ty CP Marketing Plus', '0316667777', '35 Pasteur, Quận 1, TP.HCM', 'info@mktplus.vn', '0904444444'),
  ('cust-fnb-05', 'Lê Hoàng Nam', '', '12 Võ Văn Tần, Quận 3, TP.HCM', 'nam.le@gmail.com', '0905555555'),
  ('cust-fnb-06', 'Phạm Thị Hương', '', '90 Lý Tự Trọng, Quận 1, TP.HCM', 'huong.pham@gmail.com', '0906666666');

-- Fashion Customers
INSERT OR IGNORE INTO customers (id, name, mst, address, email, phone) VALUES
  ('cust-fashion-01', 'Hoàng Thị Lan', '', '234 Nguyễn Văn Cừ, Quận 5, TP.HCM', 'lan.hoang@gmail.com', '0911111111'),
  ('cust-fashion-02', 'Công ty TNHH Design Studio', '0317778888', '15 Trương Định, Quận 3, TP.HCM', 'hello@designstudio.vn', '0912222222'),
  ('cust-fashion-03', 'Vũ Thị Hồng', '', '67 Hai Bà Trưng, Quận 1, TP.HCM', 'hong.vu@gmail.com', '0913333333'),
  ('cust-fashion-04', 'Đặng Minh Tuấn', '', '89 Lê Văn Sỹ, Quận 3, TP.HCM', 'tuan.dang@gmail.com', '0914444444'),
  ('cust-fashion-05', 'Công ty CP Truyền thông ABC', '0318889999', '200 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM', 'contact@abcmedia.vn', '0915555555'),
  ('cust-fashion-06', 'Phan Thị Ngọc', '', '56 Phan Xích Long, Phú Nhuận, TP.HCM', 'ngoc.phan@gmail.com', '0916666666');

-- Cosmetics Customers
INSERT OR IGNORE INTO customers (id, name, mst, address, email, phone) VALUES
  ('cust-cos-01', 'Đại lý Mỹ phẩm Hương Giang', '0319990000', '150 Nguyễn Huệ, TP.Huế', 'huonggiang.beauty@gmail.com', '0921111111'),
  ('cust-cos-02', 'Nguyễn Thị Thanh Hà', '', '45 Bà Huyện Thanh Quan, Quận 3, TP.HCM', 'ha.nguyen@gmail.com', '0922222222'),
  ('cust-cos-03', 'Spa & Beauty Queen', '0310001111', '88 Đồng Khởi, Quận 1, TP.HCM', 'info@beautyqueen.vn', '0923333333'),
  ('cust-cos-04', 'Trần Thị Kim Oanh', '', '12 Lý Thường Kiệt, Quận 10, TP.HCM', 'oanh.tran@gmail.com', '0924444444'),
  ('cust-cos-05', 'CTY TNHH Phân phối Mỹ phẩm An', '0311112222', '200 Nguyễn Chí Thanh, Quận 5, TP.HCM', 'sales@myphaman.vn', '0925555555'),
  ('cust-cos-06', 'Lê Thị Thu Trang', '', '78 Điện Biên Phủ, Bình Thạnh, TP.HCM', 'trang.le@gmail.com', '0926666666');

-- Livestream Customers
INSERT OR IGNORE INTO customers (id, name, mst, address, email, phone) VALUES
  ('cust-ls-01', 'Đặng Thị Mỹ Linh', '', '15 Nguyễn Cư Trinh, Quận 1, TP.HCM', 'linh.dang@gmail.com', '0931111111'),
  ('cust-ls-02', 'Phạm Quang Huy', '', '30 Lê Lợi, Quận 1, TP.HCM', 'huy.pham@gmail.com', '0932222222'),
  ('cust-ls-03', 'Hoàng Thị Yến', '', '55 Võ Thị Sáu, Quận 1, TP.HCM', 'yen.hoang@gmail.com', '0933333333'),
  ('cust-ls-04', 'Nguyễn Thị Bích Ngọc', '', '42 Trần Quang Khải, Quận 1, TP.HCM', 'ngoc.nguyen@gmail.com', '0934444444'),
  ('cust-ls-05', 'Võ Thành Đạt', '', '88 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'dat.vo@gmail.com', '0935555555'),
  ('cust-ls-06', 'Lý Thị Hương Trà', '', '20 Phan Bội Châu, Quận 1, TP.HCM', 'tra.ly@gmail.com', '0936666666');

-- Omnichannel Customers
INSERT OR IGNORE INTO customers (id, name, mst, address, email, phone) VALUES
  ('cust-omni-01', 'Công ty TNHH Shopee VN', '0312223333', 'Tòa nhà Etown, Quận Tân Bình, TP.HCM', 'partner@shopee.vn', '0941111111'),
  ('cust-omni-02', 'Trần Văn Khoa', '', '100 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM', 'khoa.tran@gmail.com', '0942222222'),
  ('cust-omni-03', 'Công ty TNHH Lazada VN', '0313334444', 'Tầng 15 Vincom Center, Quận 1, TP.HCM', 'vendor@lazada.vn', '0943333333'),
  ('cust-omni-04', 'Nguyễn Thị Hồng Nhung', '', '65 Lê Đại Hành, Quận 11, TP.HCM', 'nhung.nguyen@gmail.com', '0944444444'),
  ('cust-omni-05', 'Công ty CP TikTok Shop VN', '0314445555', 'Tầng 10 Saigon Centre, Quận 1, TP.HCM', 'seller@tiktokshop.vn', '0945555555'),
  ('cust-omni-06', 'Phạm Đức Anh', '', '30 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 'anh.pham@gmail.com', '0946666666');

-- Retail Customers
INSERT OR IGNORE INTO customers (id, name, mst, address, email, phone) VALUES
  ('cust-retail-01', 'Bùi Thị Thanh Tâm', '', '50 Nguyễn Văn Linh, Quận 7, TP.HCM', 'tam.bui@gmail.com', '0951111111'),
  ('cust-retail-02', 'Công ty TNHH Văn phòng phẩm An', '0315556677', '120 Hùng Vương, Quận 5, TP.HCM', 'order@vppan.vn', '0952222222'),
  ('cust-retail-03', 'Hoàng Thị Mai', '', '75 Cách Mạng Tháng 8, Quận 10, TP.HCM', 'mai.hoang@gmail.com', '0953333333'),
  ('cust-retail-04', 'Lê Văn Bình', '', '40 Nguyễn Tri Phương, Quận 10, TP.HCM', 'binh.le@gmail.com', '0954444444'),
  ('cust-retail-05', 'CTY CP Thực phẩm Xanh', '0316667788', '200 Nguyễn Văn Linh, Quận 7, TP.HCM', 'info@thucphamxanh.vn', '0955555555'),
  ('cust-retail-06', 'Trần Thị Ngọc Ánh', '', '88 Trần Hưng Đạo, Quận 1, TP.HCM', 'anh.tran@gmail.com', '0956666666');

-- ============================================================
-- PRODUCTS (54 products, 9 per merchant)
-- ============================================================

-- F&B Products
INSERT OR IGNORE INTO products (id, merchant_id, name, sku, price, tax_rate, unit, description) VALUES
  ('prod-fnb-01', 'merchant-fnb', 'Cà phê sữa đá', 'FNB-CPSD', 29000, 0.1, 'ly', 'Cà phê sữa đá truyền thống'),
  ('prod-fnb-02', 'merchant-fnb', 'Cappuccino', 'FNB-CAPU', 45000, 0.1, 'ly', 'Cappuccino pha máy'),
  ('prod-fnb-03', 'merchant-fnb', 'Bánh mì chảo', 'FNB-BMC', 55000, 0.1, 'phần', 'Bánh mì chảo đặc biệt'),
  ('prod-fnb-04', 'merchant-fnb', 'Phở bò tái nạm', 'FNB-PHN', 65000, 0.1, 'tô', 'Phở bò tái nạm Hà Nội'),
  ('prod-fnb-05', 'merchant-fnb', 'Trà đào cam sả', 'FNB-TDCS', 39000, 0.1, 'ly', 'Trà đào cam sả tươi'),
  ('prod-fnb-06', 'merchant-fnb', 'Combo sáng A', 'FNB-COMBO-A', 89000, 0.1, 'set', 'Cà phê + Bánh mì + Nước ép'),
  ('prod-fnb-07', 'merchant-fnb', 'Sinh tố bơ', 'FNB-STB', 42000, 0.1, 'ly', 'Sinh tố bơ sữa tươi'),
  ('prod-fnb-08', 'merchant-fnb', 'Cơm tấm sườn bì', 'FNB-CTSB', 59000, 0.1, 'phần', 'Cơm tấm sườn bì chả'),
  ('prod-fnb-09', 'merchant-fnb', 'Nước ép ổi', 'FNB-NEOI', 35000, 0.1, 'ly', 'Nước ép ổi tươi nguyên chất');

-- Fashion Products
INSERT OR IGNORE INTO products (id, merchant_id, name, sku, price, tax_rate, unit, description) VALUES
  ('prod-fashion-01', 'merchant-fashion', 'Áo thun Basic Unisex', 'FASH-ATB-M', 199000, 0.1, 'cái', 'Áo thun cotton basic, size M'),
  ('prod-fashion-02', 'merchant-fashion', 'Quần Jeans Slim Fit', 'FASH-QJS-30', 459000, 0.1, 'cái', 'Quần jeans slim fit, size 30'),
  ('prod-fashion-03', 'merchant-fashion', 'Đầm dự tiệc hoa', 'FASH-DDTH-S', 699000, 0.1, 'cái', 'Đầm dự tiệc họa tiết hoa, size S'),
  ('prod-fashion-04', 'merchant-fashion', 'Áo khoác denim', 'FASH-AKD-L', 559000, 0.1, 'cái', 'Áo khoác denim vintage, size L'),
  ('prod-fashion-05', 'merchant-fashion', 'Giày sneaker trắng', 'FASH-GST-39', 899000, 0.1, 'đôi', 'Giày sneaker trắng basic, size 39'),
  ('prod-fashion-06', 'merchant-fashion', 'Túi xách da nữ', 'FASH-TXD-01', 1299000, 0.1, 'cái', 'Túi xách da thật cao cấp'),
  ('prod-fashion-07', 'merchant-fashion', 'Áo sơ mi nam caro', 'FASH-ASM-M', 349000, 0.1, 'cái', 'Áo sơ mi nam caro, size M'),
  ('prod-fashion-08', 'merchant-fashion', 'Chân váy midi', 'FASH-CVM-S', 399000, 0.1, 'cái', 'Chân váy midi công sở, size S'),
  ('prod-fashion-09', 'merchant-fashion', 'Mũ bucket hat', 'FASH-MBH-01', 159000, 0.1, 'cái', 'Mũ bucket hat thời trang');

-- Cosmetics Products
INSERT OR IGNORE INTO products (id, merchant_id, name, sku, price, tax_rate, unit, description) VALUES
  ('prod-cos-01', 'merchant-cosmetics', 'Serum Vitamin C 30ml', 'COS-SVC-30', 450000, 0.1, 'chai', 'Serum Vitamin C sáng da'),
  ('prod-cos-02', 'merchant-cosmetics', 'Kem dưỡng ẩm HA 50g', 'COS-KDA-50', 380000, 0.1, 'hũ', 'Kem dưỡng ẩm Hyaluronic Acid'),
  ('prod-cos-03', 'merchant-cosmetics', 'Sữa rửa mặt trà xanh', 'COS-SRM-100', 180000, 0.1, 'tuýp', 'Sữa rửa mặt trà xanh 100ml'),
  ('prod-cos-04', 'merchant-cosmetics', 'Son môi matte #03', 'COS-SM-03', 250000, 0.1, 'cây', 'Son kem lì màu đỏ đất'),
  ('prod-cos-05', 'merchant-cosmetics', 'Tẩy trang Bioderma 500ml', 'COS-TTBD-500', 320000, 0.1, 'chai', 'Nước tẩy trang Bioderma'),
  ('prod-cos-06', 'merchant-cosmetics', 'Combo chăm sóc da cơ bản', 'COS-COMBO-01', 890000, 0.1, 'set', 'SRM + Serum + Kem dưỡng'),
  ('prod-cos-07', 'merchant-cosmetics', 'Mặt nạ giấy (hộp 10)', 'COS-MNG-10', 150000, 0.1, 'hộp', 'Mặt nạ giấy dưỡng ẩm'),
  ('prod-cos-08', 'merchant-cosmetics', 'Kem chống nắng SPF50', 'COS-KCN-50', 290000, 0.1, 'tuýp', 'Kem chống nắng SPF50+ PA++++'),
  ('prod-cos-09', 'merchant-cosmetics', 'Nước hoa hồng 200ml', 'COS-NHH-200', 220000, 0.1, 'chai', 'Nước hoa hồng cân bằng da');

-- Livestream Products
INSERT OR IGNORE INTO products (id, merchant_id, name, sku, price, tax_rate, unit, description) VALUES
  ('prod-ls-01', 'merchant-livestream', 'Áo thun Flash Sale', 'LS-ATFS', 79000, 0.1, 'cái', 'Áo thun promo livestream'),
  ('prod-ls-02', 'merchant-livestream', 'Tất vớ (combo 5 đôi)', 'LS-TV5', 49000, 0.1, 'set', 'Combo 5 đôi tất'),
  ('prod-ls-03', 'merchant-livestream', 'Khăn microfiber', 'LS-KMF', 35000, 0.1, 'cái', 'Khăn microfiber đa năng'),
  ('prod-ls-04', 'merchant-livestream', 'Ốp lưng điện thoại', 'LS-OLT', 29000, 0.1, 'cái', 'Ốp lưng silicone trong suốt'),
  ('prod-ls-05', 'merchant-livestream', 'Dây sạc nhanh Type-C', 'LS-DSN', 59000, 0.1, 'cái', 'Dây sạc nhanh 1m'),
  ('prod-ls-06', 'merchant-livestream', 'Balo mini thời trang', 'LS-BLM', 149000, 0.1, 'cái', 'Balo mini nữ thời trang'),
  ('prod-ls-07', 'merchant-livestream', 'Móc khóa dễ thương', 'LS-MKD', 19000, 0.1, 'cái', 'Móc khóa acrylic'),
  ('prod-ls-08', 'merchant-livestream', 'Cốc giữ nhiệt 500ml', 'LS-CGN', 129000, 0.1, 'cái', 'Cốc giữ nhiệt inox'),
  ('prod-ls-09', 'merchant-livestream', 'Kẹp tóc (set 10 cái)', 'LS-KT10', 25000, 0.1, 'set', 'Set 10 kẹp tóc nhiều màu');

-- Omnichannel Products
INSERT OR IGNORE INTO products (id, merchant_id, name, sku, price, tax_rate, unit, description) VALUES
  ('prod-omni-01', 'merchant-omnichannel', 'Tai nghe Bluetooth TWS', 'OMNI-TWS-01', 399000, 0.1, 'cái', 'Tai nghe Bluetooth True Wireless'),
  ('prod-omni-02', 'merchant-omnichannel', 'Chuột không dây', 'OMNI-CND-01', 199000, 0.1, 'cái', 'Chuột không dây ergonomic'),
  ('prod-omni-03', 'merchant-omnichannel', 'Bàn phím cơ 60%', 'OMNI-BPC-60', 699000, 0.1, 'cái', 'Bàn phím cơ 60% switch xanh'),
  ('prod-omni-04', 'merchant-omnichannel', 'Webcam Full HD', 'OMNI-WC-FHD', 549000, 0.1, 'cái', 'Webcam Full HD 1080p'),
  ('prod-omni-05', 'merchant-omnichannel', 'Hub USB-C 7in1', 'OMNI-HUB-7', 459000, 0.1, 'cái', 'Hub USB-C 7 cổng'),
  ('prod-omni-06', 'merchant-omnichannel', 'Đế sạc không dây', 'OMNI-DSK-01', 299000, 0.1, 'cái', 'Đế sạc nhanh không dây 15W'),
  ('prod-omni-07', 'merchant-omnichannel', 'Loa Bluetooth mini', 'OMNI-LBT-M', 349000, 0.1, 'cái', 'Loa Bluetooth mini di động'),
  ('prod-omni-08', 'merchant-omnichannel', 'Giá đỡ laptop', 'OMNI-GDL-01', 259000, 0.1, 'cái', 'Giá đỡ laptop nhôm'),
  ('prod-omni-09', 'merchant-omnichannel', 'Thảm chuột lớn', 'OMNI-TCL-01', 149000, 0.1, 'cái', 'Thảm chuột size lớn 80x30cm');

-- Retail Products
INSERT OR IGNORE INTO products (id, merchant_id, name, sku, price, tax_rate, unit, description) VALUES
  ('prod-retail-01', 'merchant-retail', 'Nước suối 500ml', 'RET-NS500', 5000, 0.08, 'chai', 'Nước suối tinh khiết'),
  ('prod-retail-02', 'merchant-retail', 'Bánh mì sandwich', 'RET-BMS', 15000, 0.08, 'gói', 'Bánh mì sandwich nhân phô mai'),
  ('prod-retail-03', 'merchant-retail', 'Sữa tươi 1L', 'RET-ST1L', 28000, 0.08, 'hộp', 'Sữa tươi thanh trùng 1L'),
  ('prod-retail-04', 'merchant-retail', 'Mì gói (thùng 30)', 'RET-MG30', 120000, 0.08, 'thùng', 'Thùng mì gói 30 gói'),
  ('prod-retail-05', 'merchant-retail', 'Nước ngọt 1.5L', 'RET-NS15', 15000, 0.1, 'chai', 'Nước ngọt Coca-Cola 1.5L'),
  ('prod-retail-06', 'merchant-retail', 'Bút bi (hộp 10)', 'RET-BB10', 25000, 0.08, 'hộp', 'Bút bi Thiên Long hộp 10'),
  ('prod-retail-07', 'merchant-retail', 'Giấy A4 (ream 500)', 'RET-GA4', 65000, 0.08, 'ream', 'Giấy in A4 Double A'),
  ('prod-retail-08', 'merchant-retail', 'Xà phòng Lifebuoy', 'RET-XPLB', 12000, 0.08, 'cục', 'Xà phòng Lifebuoy 100g'),
  ('prod-retail-09', 'merchant-retail', 'Bánh quy (hộp)', 'RET-BQH', 35000, 0.08, 'hộp', 'Bánh quy Denmark 454g');

-- ============================================================
-- INVOICES (~80 invoices across 6 merchants)
-- ============================================================

-- ============================================================
-- MERCHANT 1: F&B Saigon (12 invoices)
-- ============================================================
INSERT OR IGNORE INTO invoices (id, haravan_id, status, issue_date, buyer_name, buyer_mst, buyer_address, seller_name, seller_mst, items, subtotal, tax_amount, discount, total, tax_rate, payment_method, channel, store_id, platform, metadata, created_at) VALUES
  ('inv-fnb-01', 'FNB-001-001', 'cqt_accepted', '2026-05-01', 'Nguyễn Văn Hùng', '', '45 Bùi Viện, Quận 1, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Cà phê sữa đá","quantity":2,"unitPrice":29000,"taxRate":0.1,"total":63800},{"name":"Bánh mì chảo","quantity":1,"unitPrice":55000,"taxRate":0.1,"total":60500}]', 113000, 11300, 0, 124300, 0.1, 'cash', 'pos', 'store-fnb-q1', 'pos', '{}', '2026-05-01T07:30:00Z'),
  ('inv-fnb-02', 'FNB-001-002', 'cqt_accepted', '2026-05-01', 'Công ty TNHH Tech Solutions', '0315556666', 'Tầng 12 Bitexco, Quận 1, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Combo sáng A","quantity":5,"unitPrice":89000,"taxRate":0.1,"total":489500},{"name":"Cà phê sữa đá","quantity":5,"unitPrice":29000,"taxRate":0.1,"total":159500}]', 595000, 59500, 0, 654500, 0.1, 'transfer', 'pos', 'store-fnb-q1', 'pos', '{}', '2026-05-01T08:00:00Z'),
  ('inv-fnb-03', 'FNB-001-003', 'issued', '2026-05-02', 'Trần Thị Mai', '', '78 Nguyễn Trãi, Quận 5, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Phở bò tái nạm","quantity":1,"unitPrice":65000,"taxRate":0.1,"total":71500},{"name":"Trà đào cam sả","quantity":1,"unitPrice":39000,"taxRate":0.1,"total":42900}]', 104000, 10400, 0, 114400, 0.1, 'cash', 'pos', 'store-fnb-q3', 'pos', '{}', '2026-05-02T11:15:00Z'),
  ('inv-fnb-04', 'FNB-001-004', 'cqt_accepted', '2026-05-02', 'Công ty CP Marketing Plus', '0316667777', '35 Pasteur, Quận 1, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Cappuccino","quantity":10,"unitPrice":45000,"taxRate":0.1,"total":495000},{"name":"Sinh tố bơ","quantity":5,"unitPrice":42000,"taxRate":0.1,"total":231000}]', 660000, 66000, 50000, 676000, 0.1, 'transfer', 'web', 'store-fnb-q1', 'website', '{"order_id":"WEB-1001"}', '2026-05-02T14:00:00Z'),
  ('inv-fnb-05', 'FNB-001-005', 'issued', '2026-05-03', 'Lê Hoàng Nam', '', '12 Võ Văn Tần, Quận 3, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Cơm tấm sườn bì","quantity":1,"unitPrice":59000,"taxRate":0.1,"total":64900},{"name":"Cà phê sữa đá","quantity":1,"unitPrice":29000,"taxRate":0.1,"total":31900}]', 88000, 8800, 0, 96800, 0.1, 'cash', 'pos', 'store-fnb-q7', 'pos', '{}', '2026-05-03T12:00:00Z'),
  ('inv-fnb-06', 'FNB-001-006', 'draft', NULL, 'Phạm Thị Hương', '', '90 Lý Tự Trọng, Quận 1, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Trà đào cam sả","quantity":3,"unitPrice":39000,"taxRate":0.1,"total":128700}]', 117000, 11700, 0, 128700, 0.1, 'transfer', 'web', 'store-fnb-q1', 'website', '{"order_id":"WEB-1002"}', '2026-05-03T15:30:00Z'),
  ('inv-fnb-07', 'FNB-001-007', 'cqt_accepted', '2026-05-04', 'Nguyễn Văn Hùng', '', '45 Bùi Viện, Quận 1, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Nước ép ổi","quantity":2,"unitPrice":35000,"taxRate":0.1,"total":77000},{"name":"Bánh mì chảo","quantity":1,"unitPrice":55000,"taxRate":0.1,"total":60500}]', 125000, 12500, 0, 137500, 0.1, 'cash', 'pos', 'store-fnb-q1', 'pos', '{}', '2026-05-04T07:45:00Z'),
  ('inv-fnb-08', 'FNB-001-008', 'issued', '2026-05-04', 'Công ty TNHH Tech Solutions', '0315556666', 'Tầng 12 Bitexco, Quận 1, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Combo sáng A","quantity":10,"unitPrice":89000,"taxRate":0.1,"total":979000},{"name":"Cappuccino","quantity":10,"unitPrice":45000,"taxRate":0.1,"total":495000}]', 1375000, 137500, 100000, 1412500, 0.1, 'transfer', 'auto', 'store-fnb-q1', 'pos', '{"aggregate":true,"source_orders":["WEB-1003","WEB-1004"]}', '2026-05-04T08:00:00Z'),
  ('inv-fnb-09', 'FNB-001-009', 'pending', '2026-05-05', 'Trần Thị Mai', '', '78 Nguyễn Trãi, Quận 5, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Sinh tố bơ","quantity":2,"unitPrice":42000,"taxRate":0.1,"total":92400}]', 84000, 8400, 0, 92400, 0.1, 'cod', 'web', 'store-fnb-q3', 'website', '{"order_id":"WEB-1005"}', '2026-05-05T10:00:00Z'),
  ('inv-fnb-10', 'FNB-001-010', 'cqt_accepted', '2026-05-05', 'Lê Hoàng Nam', '', '12 Võ Văn Tần, Quận 3, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Phở bò tái nạm","quantity":2,"unitPrice":65000,"taxRate":0.1,"total":143000},{"name":"Nước ép ổi","quantity":2,"unitPrice":35000,"taxRate":0.1,"total":77000}]', 200000, 20000, 0, 220000, 0.1, 'cash', 'pos', 'store-fnb-q7', 'pos', '{}', '2026-05-05T12:30:00Z'),
  ('inv-fnb-11', 'FNB-001-011', 'issued', '2026-05-06', 'Phạm Thị Hương', '', '90 Lý Tự Trọng, Quận 1, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Cà phê sữa đá","quantity":1,"unitPrice":29000,"taxRate":0.1,"total":31900},{"name":"Cơm tấm sườn bì","quantity":1,"unitPrice":59000,"taxRate":0.1,"total":64900}]', 88000, 8800, 0, 96800, 0.1, 'cash', 'pos', 'store-fnb-q1', 'pos', '{}', '2026-05-06T07:15:00Z'),
  ('inv-fnb-12', 'FNB-001-012', 'draft', NULL, 'Công ty CP Marketing Plus', '0316667777', '35 Pasteur, Quận 1, TP.HCM', 'Công ty TNHH F&B Saigon', '0312345678', '[{"name":"Combo sáng A","quantity":20,"unitPrice":89000,"taxRate":0.1,"total":1958000}]', 1780000, 178000, 200000, 1758000, 0.1, 'transfer', 'web', 'store-fnb-q1', 'website', '{"order_id":"WEB-1006","corporate":true}', '2026-05-06T16:00:00Z');

-- ============================================================
-- MERCHANT 2: Thời Trang Việt (13 invoices)
-- ============================================================
INSERT OR IGNORE INTO invoices (id, haravan_id, status, issue_date, buyer_name, buyer_mst, buyer_address, seller_name, seller_mst, items, subtotal, tax_amount, discount, total, tax_rate, payment_method, channel, store_id, platform, metadata, created_at) VALUES
  ('inv-fashion-01', 'TTV-002-001', 'cqt_accepted', '2026-05-01', 'Hoàng Thị Lan', '', '234 Nguyễn Văn Cừ, Quận 5, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Áo thun Basic Unisex","quantity":2,"unitPrice":199000,"taxRate":0.1,"total":437800},{"name":"Quần Jeans Slim Fit","quantity":1,"unitPrice":459000,"taxRate":0.1,"total":504900}]', 857000, 85700, 50000, 892700, 0.1, 'transfer', 'web', 'store-fashion-online', 'website', '{"order_id":"WEB-2001","size":"M","color":"Trắng"}', '2026-05-01T10:00:00Z'),
  ('inv-fashion-02', 'TTV-002-002', 'issued', '2026-05-01', 'Công ty TNHH Design Studio', '0317778888', '15 Trương Định, Quận 3, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Áo sơ mi nam caro","quantity":5,"unitPrice":349000,"taxRate":0.1,"total":1919500}]', 1745000, 174500, 100000, 1819500, 0.1, 'transfer', 'web', 'store-fashion-online', 'website', '{"order_id":"WEB-2002","corporate":true}', '2026-05-01T14:30:00Z'),
  ('inv-fashion-03', 'TTV-002-003', 'cqt_accepted', '2026-05-02', 'Vũ Thị Hồng', '', '67 Hai Bà Trưng, Quận 1, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Đầm dự tiệc hoa","quantity":1,"unitPrice":699000,"taxRate":0.1,"total":768900},{"name":"Túi xách da nữ","quantity":1,"unitPrice":1299000,"taxRate":0.1,"total":1428900}]', 1998000, 199800, 0, 2197800, 0.1, 'card', 'pos', 'store-fashion-lelo', 'pos', '{}', '2026-05-02T11:00:00Z'),
  ('inv-fashion-04', 'TTV-002-004', 'adjusted', '2026-05-02', 'Đặng Minh Tuấn', '', '89 Lê Văn Sỹ, Quận 3, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Giày sneaker trắng","quantity":1,"unitPrice":899000,"taxRate":0.1,"total":988900}]', 899000, 89900, 0, 988900, 0.1, 'transfer', 'web', 'store-fashion-online', 'website', '{"order_id":"WEB-2003","adjust_reason":"Đổi size 39→41"}', '2026-05-02T15:00:00Z'),
  ('inv-fashion-05', 'TTV-002-005', 'issued', '2026-05-03', 'Công ty CP Truyền thông ABC', '0318889999', '200 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Áo thun Basic Unisex","quantity":20,"unitPrice":199000,"taxRate":0.1,"total":4378000},{"name":"Mũ bucket hat","quantity":20,"unitPrice":159000,"taxRate":0.1,"total":3498000}]', 7160000, 716000, 500000, 7376000, 0.1, 'transfer', 'web', 'store-fashion-online', 'website', '{"order_id":"WEB-2004","corporate":true,"uniform_order":true}', '2026-05-03T09:00:00Z'),
  ('inv-fashion-06', 'TTV-002-006', 'replaced', '2026-05-03', 'Phan Thị Ngọc', '', '56 Phan Xích Long, Phú Nhuận, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Chân váy midi","quantity":1,"unitPrice":399000,"taxRate":0.1,"total":438900}]', 399000, 39900, 0, 438900, 0.1, 'transfer', 'web', 'store-fashion-online', 'website', '{"order_id":"WEB-2005","replace_reason":"Sai màu"}', '2026-05-03T16:00:00Z'),
  ('inv-fashion-07', 'TTV-002-007', 'cqt_accepted', '2026-05-04', 'Hoàng Thị Lan', '', '234 Nguyễn Văn Cừ, Quận 5, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Áo khoác denim","quantity":1,"unitPrice":559000,"taxRate":0.1,"total":614900}]', 559000, 55900, 0, 614900, 0.1, 'cod', 'web', 'store-fashion-online', 'website', '{"order_id":"WEB-2006"}', '2026-05-04T10:30:00Z'),
  ('inv-fashion-08', 'TTV-002-008', 'issued', '2026-05-04', 'Vũ Thị Hồng', '', '67 Hai Bà Trưng, Quận 1, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Giày sneaker trắng","quantity":1,"unitPrice":899000,"taxRate":0.1,"total":988900},{"name":"Túi xách da nữ","quantity":1,"unitPrice":1299000,"taxRate":0.1,"total":1428900}]', 2198000, 219800, 100000, 2317800, 0.1, 'card', 'pos', 'store-fashion-nguyenhue', 'pos', '{}', '2026-05-04T14:00:00Z'),
  ('inv-fashion-09', 'TTV-002-009', 'adjusted', '2026-05-05', 'Đặng Minh Tuấn', '', '89 Lê Văn Sỹ, Quận 3, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Áo thun Basic Unisex","quantity":3,"unitPrice":199000,"taxRate":0.1,"total":656700}]', 597000, 59700, 0, 656700, 0.1, 'transfer', 'web', 'store-fashion-online', 'website', '{"order_id":"WEB-2007","adjust_reason":"Thêm số lượng"}', '2026-05-05T11:00:00Z'),
  ('inv-fashion-10', 'TTV-002-010', 'pending', '2026-05-05', 'Phan Thị Ngọc', '', '56 Phan Xích Long, Phú Nhuận, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Đầm dự tiệc hoa","quantity":1,"unitPrice":699000,"taxRate":0.1,"total":768900}]', 699000, 69900, 0, 768900, 0.1, 'transfer', 'web', 'store-fashion-online', 'website', '{"order_id":"WEB-2008"}', '2026-05-05T16:30:00Z'),
  ('inv-fashion-11', 'TTV-002-011', 'issued', '2026-05-06', 'Công ty TNHH Design Studio', '0317778888', '15 Trương Định, Quận 3, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Chân váy midi","quantity":3,"unitPrice":399000,"taxRate":0.1,"total":1316700},{"name":"Mũ bucket hat","quantity":3,"unitPrice":159000,"taxRate":0.1,"total":524700}]', 1674000, 167400, 0, 1841400, 0.1, 'transfer', 'pos', 'store-fashion-lelo', 'pos', '{}', '2026-05-06T10:00:00Z'),
  ('inv-fashion-12', 'TTV-002-012', 'replaced', '2026-05-06', 'Hoàng Thị Lan', '', '234 Nguyễn Văn Cừ, Quận 5, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Quần Jeans Slim Fit","quantity":2,"unitPrice":459000,"taxRate":0.1,"total":1009800}]', 918000, 91800, 0, 1009800, 0.1, 'transfer', 'web', 'store-fashion-online', 'website', '{"order_id":"WEB-2009","replace_reason":"Sai size"}', '2026-05-06T14:00:00Z'),
  ('inv-fashion-13', 'TTV-002-013', 'cqt_accepted', '2026-05-07', 'Công ty CP Truyền thông ABC', '0318889999', '200 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM', 'Công ty CP Thời Trang Việt', '0318765432', '[{"name":"Áo khoác denim","quantity":10,"unitPrice":559000,"taxRate":0.1,"total":6149000}]', 5590000, 559000, 300000, 5849000, 0.1, 'transfer', 'web', 'store-fashion-online', 'website', '{"order_id":"WEB-2010","corporate":true}', '2026-05-07T09:00:00Z');

-- ============================================================
-- MERCHANT 3: Mỹ phẩm Thiên Nhiên (13 invoices)
-- ============================================================
INSERT OR IGNORE INTO invoices (id, haravan_id, status, issue_date, buyer_name, buyer_mst, buyer_address, seller_name, seller_mst, items, subtotal, tax_amount, discount, total, tax_rate, payment_method, channel, store_id, platform, metadata, created_at) VALUES
  ('inv-cos-01', 'MPN-003-001', 'cqt_accepted', '2026-05-01', 'Đại lý Mỹ phẩm Hương Giang', '0319990000', '150 Nguyễn Huệ, TP.Huế', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Serum Vitamin C 30ml","quantity":20,"unitPrice":450000,"taxRate":0.1,"total":9900000},{"name":"Kem dưỡng ẩm HA 50g","quantity":20,"unitPrice":380000,"taxRate":0.1,"total":8360000}]', 16600000, 1660000, 1000000, 17260000, 0.1, 'transfer', 'admin', 'store-cosmetics-hq', 'haravan', '{"b2b":true,"dealer":"hương-giang"}', '2026-05-01T09:00:00Z'),
  ('inv-cos-02', 'MPN-003-002', 'cqt_accepted', '2026-05-01', 'Nguyễn Thị Thanh Hà', '', '45 Bà Huyện Thanh Quan, Quận 3, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Sữa rửa mặt trà xanh","quantity":1,"unitPrice":180000,"taxRate":0.1,"total":198000},{"name":"Nước hoa hồng 200ml","quantity":1,"unitPrice":220000,"taxRate":0.1,"total":242000}]', 400000, 40000, 0, 440000, 0.1, 'transfer', 'web', 'store-cosmetics-hq', 'website', '{"order_id":"WEB-3001"}', '2026-05-01T14:00:00Z'),
  ('inv-cos-03', 'MPN-003-003', 'cqt_accepted', '2026-05-02', 'Spa & Beauty Queen', '0310001111', '88 Đồng Khởi, Quận 1, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Kem dưỡng ẩm HA 50g","quantity":10,"unitPrice":380000,"taxRate":0.1,"total":4180000},{"name":"Mặt nạ giấy (hộp 10)","quantity":20,"unitPrice":150000,"taxRate":0.1,"total":3300000}]', 6800000, 680000, 500000, 6980000, 0.1, 'transfer', 'admin', 'store-cosmetics-hq', 'haravan', '{"b2b":true,"spa":true}', '2026-05-02T10:00:00Z'),
  ('inv-cos-04', 'MPN-003-004', 'issued', '2026-05-02', 'Trần Thị Kim Oanh', '', '12 Lý Thường Kiệt, Quận 10, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Combo chăm sóc da cơ bản","quantity":1,"unitPrice":890000,"taxRate":0.1,"total":979000}]', 890000, 89000, 0, 979000, 0.1, 'cod', 'web', 'store-cosmetics-hq', 'website', '{"order_id":"WEB-3002"}', '2026-05-02T16:00:00Z'),
  ('inv-cos-05', 'MPN-003-005', 'cqt_accepted', '2026-05-03', 'CTY TNHH Phân phối Mỹ phẩm An', '0311112222', '200 Nguyễn Chí Thanh, Quận 5, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Serum Vitamin C 30ml","quantity":50,"unitPrice":450000,"taxRate":0.1,"total":24750000},{"name":"Son môi matte #03","quantity":50,"unitPrice":250000,"taxRate":0.1,"total":13750000},{"name":"Kem chống nắng SPF50","quantity":50,"unitPrice":290000,"taxRate":0.1,"total":15950000}]', 50000000, 5000000, 3000000, 52000000, 0.1, 'transfer', 'admin', 'store-cosmetics-hq', 'haravan', '{"b2b":true,"distributor":"my-pham-an","loyalty_tier":"gold"}', '2026-05-03T09:00:00Z'),
  ('inv-cos-06', 'MPN-003-006', 'issued', '2026-05-03', 'Lê Thị Thu Trang', '', '78 Điện Biên Phủ, Bình Thạnh, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Tẩy trang Bioderma 500ml","quantity":1,"unitPrice":320000,"taxRate":0.1,"total":352000},{"name":"Son môi matte #03","quantity":2,"unitPrice":250000,"taxRate":0.1,"total":550000}]', 820000, 82000, 0, 902000, 0.1, 'transfer', 'web', 'store-cosmetics-hq', 'website', '{"order_id":"WEB-3003"}', '2026-05-03T11:30:00Z'),
  ('inv-cos-07', 'MPN-003-007', 'cqt_accepted', '2026-05-04', 'Nguyễn Thị Thanh Hà', '', '45 Bà Huyện Thanh Quan, Quận 3, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Kem chống nắng SPF50","quantity":2,"unitPrice":290000,"taxRate":0.1,"total":638000}]', 580000, 58000, 0, 638000, 0.1, 'transfer', 'web', 'store-cosmetics-hq', 'website', '{"order_id":"WEB-3004","loyalty_discount":5}', '2026-05-04T10:00:00Z'),
  ('inv-cos-08', 'MPN-003-008', 'pending', '2026-05-04', 'Đại lý Mỹ phẩm Hương Giang', '0319990000', '150 Nguyễn Huệ, TP.Huế', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Mặt nạ giấy (hộp 10)","quantity":50,"unitPrice":150000,"taxRate":0.1,"total":8250000},{"name":"Nước hoa hồng 200ml","quantity":30,"unitPrice":220000,"taxRate":0.1,"total":7260000}]', 14100000, 1410000, 800000, 14710000, 0.1, 'transfer', 'admin', 'store-cosmetics-dealer', 'haravan', '{"b2b":true,"dealer":"hương-giang","reorder":true}', '2026-05-04T14:00:00Z'),
  ('inv-cos-09', 'MPN-003-009', 'issued', '2026-05-05', 'Trần Thị Kim Oanh', '', '12 Lý Thường Kiệt, Quận 10, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Serum Vitamin C 30ml","quantity":1,"unitPrice":450000,"taxRate":0.1,"total":495000},{"name":"Kem dưỡng ẩm HA 50g","quantity":1,"unitPrice":380000,"taxRate":0.1,"total":418000}]', 830000, 83000, 0, 913000, 0.1, 'cod', 'web', 'store-cosmetics-hq', 'website', '{"order_id":"WEB-3005"}', '2026-05-05T09:30:00Z'),
  ('inv-cos-10', 'MPN-003-010', 'cqt_accepted', '2026-05-05', 'Spa & Beauty Queen', '0310001111', '88 Đồng Khởi, Quận 1, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Tẩy trang Bioderma 500ml","quantity":5,"unitPrice":320000,"taxRate":0.1,"total":1760000}]', 1600000, 160000, 0, 1760000, 0.1, 'transfer', 'admin', 'store-cosmetics-hq', 'haravan', '{"b2b":true,"spa":true}', '2026-05-05T11:00:00Z'),
  ('inv-cos-11', 'MPN-003-011', 'pending', '2026-05-06', 'Lê Thị Thu Trang', '', '78 Điện Biên Phủ, Bình Thạnh, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Combo chăm sóc da cơ bản","quantity":2,"unitPrice":890000,"taxRate":0.1,"total":1958000}]', 1780000, 178000, 0, 1958000, 0.1, 'transfer', 'web', 'store-cosmetics-hq', 'website', '{"order_id":"WEB-3006"}', '2026-05-06T15:00:00Z'),
  ('inv-cos-12', 'MPN-003-012', 'draft', NULL, 'CTY TNHH Phân phối Mỹ phẩm An', '0311112222', '200 Nguyễn Chí Thanh, Quận 5, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Serum Vitamin C 30ml","quantity":100,"unitPrice":450000,"taxRate":0.1,"total":49500000},{"name":"Kem chống nắng SPF50","quantity":100,"unitPrice":290000,"taxRate":0.1,"total":31900000}]', 74000000, 7400000, 5000000, 76400000, 0.1, 'transfer', 'admin', 'store-cosmetics-hq', 'haravan', '{"b2b":true,"distributor":"my-pham-an","bulk_order":true}', '2026-05-06T16:00:00Z'),
  ('inv-cos-13', 'MPN-003-013', 'issued', '2026-05-07', 'Nguyễn Thị Thanh Hà', '', '45 Bà Huyện Thanh Quan, Quận 3, TP.HCM', 'Công ty TNHH Mỹ phẩm Thiên Nhiên', '0319876543', '[{"name":"Mặt nạ giấy (hộp 10)","quantity":3,"unitPrice":150000,"taxRate":0.1,"total":495000}]', 450000, 45000, 0, 495000, 0.1, 'cod', 'web', 'store-cosmetics-hq', 'website', '{"order_id":"WEB-3007"}', '2026-05-07T10:00:00Z');

-- ============================================================
-- MERCHANT 4: Livestream Commerce (18 invoices)
-- ============================================================
INSERT OR IGNORE INTO invoices (id, haravan_id, status, issue_date, buyer_name, buyer_mst, buyer_address, seller_name, seller_mst, items, subtotal, tax_amount, discount, total, tax_rate, payment_method, channel, store_id, platform, metadata, created_at) VALUES
  ('inv-ls-01', 'LSC-004-001', 'issued', '2026-05-01', 'Đặng Thị Mỹ Linh', '', '15 Nguyễn Cư Trinh, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Áo thun Flash Sale","quantity":2,"unitPrice":79000,"taxRate":0.1,"total":173800}]', 158000, 15800, 0, 173800, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:05:30"}', '2026-05-01T20:05:30Z'),
  ('inv-ls-02', 'LSC-004-002', 'issued', '2026-05-01', 'Phạm Quang Huy', '', '30 Lê Lợi, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Tất vớ (combo 5 đôi)","quantity":3,"unitPrice":49000,"taxRate":0.1,"total":161700}]', 147000, 14700, 0, 161700, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:06:15"}', '2026-05-01T20:06:15Z'),
  ('inv-ls-03', 'LSC-004-003', 'issued', '2026-05-01', 'Hoàng Thị Yến', '', '55 Võ Thị Sáu, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Ốp lưng điện thoại","quantity":5,"unitPrice":29000,"taxRate":0.1,"total":159500}]', 145000, 14500, 0, 159500, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:07:00"}', '2026-05-01T20:07:00Z'),
  ('inv-ls-04', 'LSC-004-004', 'issued', '2026-05-01', 'Nguyễn Thị Bích Ngọc', '', '42 Trần Quang Khải, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Dây sạc nhanh Type-C","quantity":2,"unitPrice":59000,"taxRate":0.1,"total":129800}]', 118000, 11800, 0, 129800, 0.1, 'transfer', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:08:45"}', '2026-05-01T20:08:45Z'),
  ('inv-ls-05', 'LSC-004-005', 'issued', '2026-05-01', 'Võ Thành Đạt', '', '88 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Balo mini thời trang","quantity":1,"unitPrice":149000,"taxRate":0.1,"total":163900},{"name":"Móc khóa dễ thương","quantity":3,"unitPrice":19000,"taxRate":0.1,"total":62700}]', 206000, 20600, 0, 226600, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:10:20"}', '2026-05-01T20:10:20Z'),
  ('inv-ls-06', 'LSC-004-006', 'issued', '2026-05-01', 'Lý Thị Hương Trà', '', '20 Phan Bội Châu, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Cốc giữ nhiệt 500ml","quantity":2,"unitPrice":129000,"taxRate":0.1,"total":283800}]', 258000, 25800, 0, 283800, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:12:00"}', '2026-05-01T20:12:00Z'),
  ('inv-ls-07', 'LSC-004-007', 'issued', '2026-05-01', 'Đặng Thị Mỹ Linh', '', '15 Nguyễn Cư Trinh, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Kẹp tóc (set 10 cái)","quantity":5,"unitPrice":25000,"taxRate":0.1,"total":137500}]', 125000, 12500, 0, 137500, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:15:30"}', '2026-05-01T20:15:30Z'),
  ('inv-ls-08', 'LSC-004-008', 'issued', '2026-05-01', 'Phạm Quang Huy', '', '30 Lê Lợi, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Khăn microfiber","quantity":10,"unitPrice":35000,"taxRate":0.1,"total":385000}]', 350000, 35000, 0, 385000, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:18:00"}', '2026-05-01T20:18:00Z'),
  ('inv-ls-09', 'LSC-004-009', 'issued', '2026-05-01', 'Hoàng Thị Yến', '', '55 Võ Thị Sáu, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Áo thun Flash Sale","quantity":5,"unitPrice":79000,"taxRate":0.1,"total":434500}]', 395000, 39500, 0, 434500, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:20:15"}', '2026-05-01T20:20:15Z'),
  ('inv-ls-10', 'LSC-004-010', 'issued', '2026-05-01', 'Nguyễn Thị Bích Ngọc', '', '42 Trần Quang Khải, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Tất vớ (combo 5 đôi)","quantity":2,"unitPrice":49000,"taxRate":0.1,"total":107800},{"name":"Kẹp tóc (set 10 cái)","quantity":3,"unitPrice":25000,"taxRate":0.1,"total":82500}]', 173000, 17300, 0, 190300, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:25:00"}', '2026-05-01T20:25:00Z'),
  ('inv-ls-11', 'LSC-004-011', 'cqt_accepted', '2026-05-01', 'Võ Thành Đạt', '', '88 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Áo thun Flash Sale","quantity":3,"unitPrice":79000,"taxRate":0.1,"total":260700},{"name":"Tất vớ (combo 5 đôi)","quantity":2,"unitPrice":49000,"taxRate":0.1,"total":107800},{"name":"Ốp lưng điện thoại","quantity":2,"unitPrice":29000,"taxRate":0.1,"total":63800}]', 431000, 43100, 0, 474100, 0.1, 'transfer', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:30:00","aggregate_from":["inv-ls-011a","inv-ls-011b","inv-ls-011c"]}', '2026-05-01T20:30:00Z'),
  ('inv-ls-12', 'LSC-004-012', 'cqt_accepted', '2026-05-01', 'Lý Thị Hương Trà', '', '20 Phan Bội Châu, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Cốc giữ nhiệt 500ml","quantity":5,"unitPrice":129000,"taxRate":0.1,"total":709500}]', 645000, 64500, 0, 709500, 0.1, 'transfer', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:35:00"}', '2026-05-01T20:35:00Z'),
  ('inv-ls-13', 'LSC-004-013', 'cqt_accepted', '2026-05-01', 'Đặng Thị Mỹ Linh', '', '15 Nguyễn Cư Trinh, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Balo mini thời trang","quantity":2,"unitPrice":149000,"taxRate":0.1,"total":327800},{"name":"Dây sạc nhanh Type-C","quantity":3,"unitPrice":59000,"taxRate":0.1,"total":194700}]', 496000, 49600, 0, 545600, 0.1, 'transfer', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:40:00"}', '2026-05-01T20:40:00Z'),
  ('inv-ls-14', 'LSC-004-014', 'cqt_accepted', '2026-05-01', 'Phạm Quang Huy', '', '30 Lê Lợi, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Áo thun Flash Sale","quantity":10,"unitPrice":79000,"taxRate":0.1,"total":869000}]', 790000, 79000, 50000, 819000, 0.1, 'transfer', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:45:00","bulk_buyer":true}', '2026-05-01T20:45:00Z'),
  ('inv-ls-15', 'LSC-004-015', 'pending', '2026-05-01', 'Hoàng Thị Yến', '', '55 Võ Thị Sáu, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Cốc giữ nhiệt 500ml","quantity":3,"unitPrice":129000,"taxRate":0.1,"total":425700}]', 387000, 38700, 0, 425700, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:50:00"}', '2026-05-01T20:50:00Z'),
  ('inv-ls-16', 'LSC-004-016', 'pending', '2026-05-01', 'Nguyễn Thị Bích Ngọc', '', '42 Trần Quang Khải, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Khăn microfiber","quantity":5,"unitPrice":35000,"taxRate":0.1,"total":192500},{"name":"Móc khóa dễ thương","quantity":10,"unitPrice":19000,"taxRate":0.1,"total":209000}]', 380000, 38000, 0, 418000, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:55:00"}', '2026-05-01T20:55:00Z'),
  ('inv-ls-17', 'LSC-004-017', 'pending', '2026-05-01', 'Võ Thành Đạt', '', '88 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Ốp lưng điện thoại","quantity":10,"unitPrice":29000,"taxRate":0.1,"total":319000}]', 290000, 29000, 0, 319000, 0.1, 'cod', 'auto', 'store-livestream-studio', 'livestream', '{"livestream_session":"LS-20260501-01","order_time":"20:58:00"}', '2026-05-01T20:58:00Z'),
  ('inv-ls-18', 'LSC-004-018', 'cqt_accepted', '2026-05-01', 'Lý Thị Hương Trà', '', '20 Phan Bội Châu, Quận 1, TP.HCM', 'Công ty CP Livestream Commerce VN', '0311122334', '[{"name":"Áo thun Flash Sale","quantity":1,"unitPrice":79000,"taxRate":0.1,"total":86900},{"name":"Tất vớ (combo 5 đôi)","quantity":1,"unitPrice":49000,"taxRate":0.1,"total":53900},{"name":"Kẹp tóc (set 10 cái)","quantity":2,"unitPrice":25000,"taxRate":0.1,"total":55000}]', 153000, 15300, 0, 168300, 0.1, 'cod', 'web', 'store-livestream-studio', 'website', '{"order_id":"WEB-4001","post_livestream":true}', '2026-05-01T22:00:00Z');

-- ============================================================
-- MERCHANT 5: Omnichannel Retail (15 invoices)
-- ============================================================
INSERT OR IGNORE INTO invoices (id, haravan_id, status, issue_date, buyer_name, buyer_mst, buyer_address, seller_name, seller_mst, items, subtotal, tax_amount, discount, total, tax_rate, payment_method, channel, store_id, platform, metadata, created_at) VALUES
  ('inv-omni-01', 'OCR-005-001', 'cqt_accepted', '2026-05-01', 'Trần Văn Khoa', '', '100 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Tai nghe Bluetooth TWS","quantity":1,"unitPrice":399000,"taxRate":0.1,"total":438900}]', 399000, 39900, 0, 438900, 0.1, 'cod', 'web', 'store-omni-shopee', 'shopee', '{"shopee_order_id":"SP-20001","platform_fee":0.08,"commission":31920}', '2026-05-01T10:00:00Z'),
  ('inv-omni-02', 'OCR-005-002', 'cqt_accepted', '2026-05-01', 'Nguyễn Thị Hồng Nhung', '', '65 Lê Đại Hành, Quận 11, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Bàn phím cơ 60%","quantity":1,"unitPrice":699000,"taxRate":0.1,"total":768900},{"name":"Chuột không dây","quantity":1,"unitPrice":199000,"taxRate":0.1,"total":218900}]', 898000, 89800, 0, 987800, 0.1, 'cod', 'web', 'store-omni-lazada', 'lazada', '{"lazada_order_id":"LZ-30001","platform_fee":0.10,"commission":89800}', '2026-05-01T11:30:00Z'),
  ('inv-omni-03', 'OCR-005-003', 'issued', '2026-05-02', 'Phạm Đức Anh', '', '30 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Loa Bluetooth mini","quantity":2,"unitPrice":349000,"taxRate":0.1,"total":767800}]', 698000, 69800, 0, 767800, 0.1, 'transfer', 'web', 'store-omni-tiktok', 'tiktok', '{"tiktok_order_id":"TT-40001","platform_fee":0.05,"commission":34900}', '2026-05-02T14:00:00Z'),
  ('inv-omni-04', 'OCR-005-004', 'cqt_accepted', '2026-05-02', 'Trần Văn Khoa', '', '100 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Webcam Full HD","quantity":1,"unitPrice":549000,"taxRate":0.1,"total":603900},{"name":"Giá đỡ laptop","quantity":1,"unitPrice":259000,"taxRate":0.1,"total":284900}]', 808000, 80800, 0, 888800, 0.1, 'cod', 'web', 'store-omni-shopee', 'shopee', '{"shopee_order_id":"SP-20002","platform_fee":0.08,"commission":64640}', '2026-05-02T16:00:00Z'),
  ('inv-omni-05', 'OCR-005-005', 'adjusted', '2026-05-03', 'Nguyễn Thị Hồng Nhung', '', '65 Lê Đại Hành, Quận 11, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Hub USB-C 7in1","quantity":1,"unitPrice":459000,"taxRate":0.1,"total":504900}]', 459000, 45900, 0, 504900, 0.1, 'cod', 'web', 'store-omni-lazada', 'lazada', '{"lazada_order_id":"LZ-30002","adjust_reason":"Đổi hàng - lỗi cổng USB","platform_fee":0.10}', '2026-05-03T09:00:00Z'),
  ('inv-omni-06', 'OCR-005-006', 'issued', '2026-05-03', 'Phạm Đức Anh', '', '30 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Tai nghe Bluetooth TWS","quantity":2,"unitPrice":399000,"taxRate":0.1,"total":877800}]', 798000, 79800, 0, 877800, 0.1, 'transfer', 'web', 'store-omni-tiktok', 'tiktok', '{"tiktok_order_id":"TT-40002","platform_fee":0.05,"commission":39900}', '2026-05-03T11:00:00Z'),
  ('inv-omni-07', 'OCR-005-007', 'replaced', '2026-05-03', 'Trần Văn Khoa', '', '100 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Đế sạc không dây","quantity":1,"unitPrice":299000,"taxRate":0.1,"total":328900}]', 299000, 29900, 0, 328900, 0.1, 'cod', 'web', 'store-omni-shopee', 'shopee', '{"shopee_order_id":"SP-20003","replace_reason":"Hàng lỗi - đổi mới","platform_fee":0.08}', '2026-05-03T15:00:00Z'),
  ('inv-omni-08', 'OCR-005-008', 'cqt_accepted', '2026-05-04', 'Công ty TNHH Shopee VN', '0312223333', 'Tòa nhà Etown, Quận Tân Bình, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Chuột không dây","quantity":50,"unitPrice":199000,"taxRate":0.1,"total":10945000},{"name":"Bàn phím cơ 60%","quantity":20,"unitPrice":699000,"taxRate":0.1,"total":15378000}]', 23930000, 2393000, 1000000, 25323000, 0.1, 'transfer', 'admin', 'store-omni-web', 'haravan', '{"b2b":true,"shopee_bulk_order":true}', '2026-05-04T09:00:00Z'),
  ('inv-omni-09', 'OCR-005-009', 'issued', '2026-05-04', 'Nguyễn Thị Hồng Nhung', '', '65 Lê Đại Hành, Quận 11, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Thảm chuột lớn","quantity":2,"unitPrice":149000,"taxRate":0.1,"total":327800},{"name":"Giá đỡ laptop","quantity":1,"unitPrice":259000,"taxRate":0.1,"total":284900}]', 556000, 55600, 0, 611600, 0.1, 'cod', 'web', 'store-omni-lazada', 'lazada', '{"lazada_order_id":"LZ-30003","platform_fee":0.10,"commission":55600}', '2026-05-04T14:00:00Z'),
  ('inv-omni-10', 'OCR-005-010', 'pending', '2026-05-05', 'Phạm Đức Anh', '', '30 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Loa Bluetooth mini","quantity":1,"unitPrice":349000,"taxRate":0.1,"total":383900},{"name":"Đế sạc không dây","quantity":1,"unitPrice":299000,"taxRate":0.1,"total":328900}]', 648000, 64800, 0, 712800, 0.1, 'cod', 'web', 'store-omni-tiktok', 'tiktok', '{"tiktok_order_id":"TT-40003","platform_fee":0.05}', '2026-05-05T10:00:00Z'),
  ('inv-omni-11', 'OCR-005-011', 'cqt_accepted', '2026-05-05', 'Trần Văn Khoa', '', '100 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Hub USB-C 7in1","quantity":1,"unitPrice":459000,"taxRate":0.1,"total":504900}]', 459000, 45900, 0, 504900, 0.1, 'transfer', 'pos', 'store-omni-pos', 'pos', '{}', '2026-05-05T14:00:00Z'),
  ('inv-omni-12', 'OCR-005-012', 'adjusted', '2026-05-06', 'Công ty TNHH Lazada VN', '0313334444', 'Tầng 15 Vincom Center, Quận 1, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Webcam Full HD","quantity":10,"unitPrice":549000,"taxRate":0.1,"total":6039000}]', 5490000, 549000, 200000, 5839000, 0.1, 'transfer', 'admin', 'store-omni-web', 'haravan', '{"b2b":true,"lazada_bulk_order":true,"adjust_reason":"Giảm số lượng 15→10"}', '2026-05-06T09:00:00Z'),
  ('inv-omni-13', 'OCR-005-013', 'issued', '2026-05-06', 'Nguyễn Thị Hồng Nhung', '', '65 Lê Đại Hành, Quận 11, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Tai nghe Bluetooth TWS","quantity":1,"unitPrice":399000,"taxRate":0.1,"total":438900}]', 399000, 39900, 0, 438900, 0.1, 'cod', 'web', 'store-omni-lazada', 'lazada', '{"lazada_order_id":"LZ-30004","platform_fee":0.10,"commission":39900}', '2026-05-06T16:00:00Z'),
  ('inv-omni-14', 'OCR-005-014', 'pending', '2026-05-07', 'Phạm Đức Anh', '', '30 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Bàn phím cơ 60%","quantity":1,"unitPrice":699000,"taxRate":0.1,"total":768900}]', 699000, 69900, 0, 768900, 0.1, 'transfer', 'web', 'store-omni-tiktok', 'tiktok', '{"tiktok_order_id":"TT-40004","platform_fee":0.05}', '2026-05-07T11:00:00Z'),
  ('inv-omni-15', 'OCR-005-015', 'draft', NULL, 'Công ty CP TikTok Shop VN', '0314445555', 'Tầng 10 Saigon Centre, Quận 1, TP.HCM', 'Công ty TNHH Omnichannel Retail', '0314455667', '[{"name":"Loa Bluetooth mini","quantity":30,"unitPrice":349000,"taxRate":0.1,"total":11517000},{"name":"Đế sạc không dây","quantity":30,"unitPrice":299000,"taxRate":0.1,"total":9867000}]', 19440000, 1944000, 1500000, 19884000, 0.1, 'transfer', 'admin', 'store-omni-web', 'haravan', '{"b2b":true,"tiktok_bulk_order_pending":true}', '2026-05-07T16:00:00Z');

-- ============================================================
-- MERCHANT 6: Bán Lẻ Tiện Ích (12 invoices)
-- ============================================================
INSERT OR IGNORE INTO invoices (id, haravan_id, status, issue_date, buyer_name, buyer_mst, buyer_address, seller_name, seller_mst, items, subtotal, tax_amount, discount, total, tax_rate, payment_method, channel, store_id, platform, metadata, created_at) VALUES
  ('inv-retail-01', 'BLT-006-001', 'cqt_accepted', '2026-05-01', 'Bùi Thị Thanh Tâm', '', '50 Nguyễn Văn Linh, Quận 7, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Nước suối 500ml","quantity":6,"unitPrice":5000,"taxRate":0.08,"total":32400},{"name":"Bánh mì sandwich","quantity":3,"unitPrice":15000,"taxRate":0.08,"total":48600},{"name":"Sữa tươi 1L","quantity":2,"unitPrice":28000,"taxRate":0.08,"total":60480}]', 131000, 10480, 0, 141480, 0.08, 'cash', 'pos', 'store-retail-01', 'pos', '{}', '2026-05-01T08:00:00Z'),
  ('inv-retail-02', 'BLT-006-002', 'cqt_accepted', '2026-05-01', 'Công ty TNHH Văn phòng phẩm An', '0315556677', '120 Hùng Vương, Quận 5, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Giấy A4 (ream 500)","quantity":10,"unitPrice":65000,"taxRate":0.08,"total":702000},{"name":"Bút bi (hộp 10)","quantity":5,"unitPrice":25000,"taxRate":0.08,"total":135000}]', 775000, 62000, 0, 837000, 0.08, 'transfer', 'pos', 'store-retail-03', 'pos', '{"b2b":true}', '2026-05-01T10:00:00Z'),
  ('inv-retail-03', 'BLT-006-003', 'cqt_accepted', '2026-05-02', 'Hoàng Thị Mai', '', '75 Cách Mạng Tháng 8, Quận 10, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Nước ngọt 1.5L","quantity":4,"unitPrice":15000,"taxRate":0.1,"total":66000},{"name":"Bánh quy (hộp)","quantity":2,"unitPrice":35000,"taxRate":0.08,"total":75600}]', 130000, 11600, 0, 141600, 0.08, 'cash', 'pos', 'store-retail-05', 'pos', '{}', '2026-05-02T12:00:00Z'),
  ('inv-retail-04', 'BLT-006-004', 'cqt_accepted', '2026-05-02', 'Lê Văn Bình', '', '40 Nguyễn Tri Phương, Quận 10, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Mì gói (thùng 30)","quantity":2,"unitPrice":120000,"taxRate":0.08,"total":259200},{"name":"Xà phòng Lifebuoy","quantity":5,"unitPrice":12000,"taxRate":0.08,"total":64800}]', 300000, 24000, 0, 324000, 0.08, 'cash', 'pos', 'store-retail-07', 'pos', '{}', '2026-05-02T15:00:00Z'),
  ('inv-retail-05', 'BLT-006-005', 'issued', '2026-05-03', 'Bùi Thị Thanh Tâm', '', '50 Nguyễn Văn Linh, Quận 7, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Sữa tươi 1L","quantity":4,"unitPrice":28000,"taxRate":0.08,"total":120960},{"name":"Bánh mì sandwich","quantity":5,"unitPrice":15000,"taxRate":0.08,"total":81000}]', 192000, 15360, 0, 207360, 0.08, 'cash', 'pos', 'store-retail-01', 'pos', '{}', '2026-05-03T08:30:00Z'),
  ('inv-retail-06', 'BLT-006-006', 'cqt_accepted', '2026-05-03', 'CTY CP Thực phẩm Xanh', '0316667788', '200 Nguyễn Văn Linh, Quận 7, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Nước suối 500ml","quantity":50,"unitPrice":5000,"taxRate":0.08,"total":270000},{"name":"Nước ngọt 1.5L","quantity":30,"unitPrice":15000,"taxRate":0.1,"total":495000}]', 700000, 57500, 0, 757500, 0.08, 'transfer', 'pos', 'store-retail-02', 'pos', '{"b2b":true,"bulk_order":true}', '2026-05-03T10:00:00Z'),
  ('inv-retail-07', 'BLT-006-007', 'issued', '2026-05-04', 'Trần Thị Ngọc Ánh', '', '88 Trần Hưng Đạo, Quận 1, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Bánh quy (hộp)","quantity":3,"unitPrice":35000,"taxRate":0.08,"total":113400},{"name":"Sữa tươi 1L","quantity":2,"unitPrice":28000,"taxRate":0.08,"total":60480}]', 161000, 12880, 0, 173880, 0.08, 'cash', 'pos', 'store-retail-10', 'pos', '{}', '2026-05-04T14:00:00Z'),
  ('inv-retail-08', 'BLT-006-008', 'cqt_accepted', '2026-05-04', 'Hoàng Thị Mai', '', '75 Cách Mạng Tháng 8, Quận 10, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Giấy A4 (ream 500)","quantity":3,"unitPrice":65000,"taxRate":0.08,"total":210600},{"name":"Bút bi (hộp 10)","quantity":2,"unitPrice":25000,"taxRate":0.08,"total":54000}]', 245000, 19600, 0, 264600, 0.08, 'cash', 'pos', 'store-retail-05', 'pos', '{}', '2026-05-04T16:00:00Z'),
  ('inv-retail-09', 'BLT-006-009', 'issued', '2026-05-05', 'Lê Văn Bình', '', '40 Nguyễn Tri Phương, Quận 10, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Xà phòng Lifebuoy","quantity":10,"unitPrice":12000,"taxRate":0.08,"total":129600},{"name":"Nước suối 500ml","quantity":12,"unitPrice":5000,"taxRate":0.08,"total":64800}]', 180000, 14400, 0, 194400, 0.08, 'cash', 'pos', 'store-retail-07', 'pos', '{}', '2026-05-05T09:00:00Z'),
  ('inv-retail-10', 'BLT-006-010', 'draft', NULL, 'Công ty TNHH Văn phòng phẩm An', '0315556677', '120 Hùng Vương, Quận 5, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Giấy A4 (ream 500)","quantity":50,"unitPrice":65000,"taxRate":0.08,"total":3510000},{"name":"Bút bi (hộp 10)","quantity":20,"unitPrice":25000,"taxRate":0.08,"total":540000}]', 3750000, 300000, 100000, 3950000, 0.08, 'transfer', 'web', 'store-retail-03', 'website', '{"order_id":"WEB-6001","b2b":true,"monthly_order":true}', '2026-05-05T16:00:00Z'),
  ('inv-retail-11', 'BLT-006-011', 'issued', '2026-05-06', 'Bùi Thị Thanh Tâm', '', '50 Nguyễn Văn Linh, Quận 7, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Mì gói (thùng 30)","quantity":1,"unitPrice":120000,"taxRate":0.08,"total":129600},{"name":"Nước ngọt 1.5L","quantity":6,"unitPrice":15000,"taxRate":0.1,"total":99000}]', 210000, 17400, 0, 227400, 0.08, 'cash', 'pos', 'store-retail-01', 'pos', '{}', '2026-05-06T11:00:00Z'),
  ('inv-retail-12', 'BLT-006-012', 'draft', NULL, 'CTY CP Thực phẩm Xanh', '0316667788', '200 Nguyễn Văn Linh, Quận 7, TP.HCM', 'Công ty CP Bán Lẻ Tiện Ích VN', '0317788990', '[{"name":"Sữa tươi 1L","quantity":100,"unitPrice":28000,"taxRate":0.08,"total":3024000},{"name":"Bánh mì sandwich","quantity":200,"unitPrice":15000,"taxRate":0.08,"total":3240000}]', 5800000, 464000, 200000, 6064000, 0.08, 'transfer', 'web', 'store-retail-02', 'website', '{"order_id":"WEB-6002","b2b":true,"wholesale":true}', '2026-05-06T17:00:00Z');

-- ============================================================
-- AUDIT LOGS (30 entries covering all scenarios)
-- ============================================================

-- F&B audit logs
INSERT OR IGNORE INTO audit_logs (id, invoice_id, action, actor, details, created_at) VALUES
  ('audit-fnb-01', 'inv-fnb-01', 'created', 'user:cashier-q1', '{"source":"pos","store":"store-fnb-q1"}', '2026-05-01T07:30:00Z'),
  ('audit-fnb-02', 'inv-fnb-01', 'issued', 'system', '{"tvanId":"MOCK-FNB-001"}', '2026-05-01T07:30:05Z'),
  ('audit-fnb-03', 'inv-fnb-01', 'cqt_accepted', 'system', '{"confirmationId":"CQT-FNB-001"}', '2026-05-01T07:35:00Z'),
  ('audit-fnb-04', 'inv-fnb-08', 'created', 'system', '{"source":"auto-aggregate","orders":["WEB-1003","WEB-1004"]}', '2026-05-04T08:00:00Z');

-- Fashion audit logs
INSERT OR IGNORE INTO audit_logs (id, invoice_id, action, actor, details, created_at) VALUES
  ('audit-fashion-01', 'inv-fashion-01', 'created', 'user:admin', '{"source":"web","order_id":"WEB-2001"}', '2026-05-01T10:00:00Z'),
  ('audit-fashion-02', 'inv-fashion-01', 'issued', 'system', '{"tvanId":"MOCK-TTV-001"}', '2026-05-01T10:00:05Z'),
  ('audit-fashion-03', 'inv-fashion-01', 'cqt_accepted', 'system', '{"confirmationId":"CQT-TTV-001"}', '2026-05-01T10:05:00Z'),
  ('audit-fashion-04', 'inv-fashion-04', 'adjusted', 'user:admin', '{"reason":"Đổi size 39→41","newInvoiceId":"inv-fashion-04-adj"}', '2026-05-02T15:30:00Z'),
  ('audit-fashion-05', 'inv-fashion-06', 'replaced', 'user:admin', '{"reason":"Sai màu","newInvoiceId":"inv-fashion-06-r"}', '2026-05-03T16:30:00Z');

-- Cosmetics audit logs
INSERT OR IGNORE INTO audit_logs (id, invoice_id, action, actor, details, created_at) VALUES
  ('audit-cos-01', 'inv-cos-01', 'created', 'user:admin', '{"source":"admin","b2b":true}', '2026-05-01T09:00:00Z'),
  ('audit-cos-02', 'inv-cos-01', 'issued', 'system', '{"tvanId":"MOCK-MPN-001"}', '2026-05-01T09:00:05Z'),
  ('audit-cos-03', 'inv-cos-01', 'cqt_accepted', 'system', '{"confirmationId":"CQT-MPN-001"}', '2026-05-01T09:05:00Z'),
  ('audit-cos-04', 'inv-cos-05', 'created', 'user:admin', '{"source":"admin","b2b":true,"distributor":"my-pham-an","value":52000000}', '2026-05-03T09:00:00Z');

-- Livestream audit logs
INSERT OR IGNORE INTO audit_logs (id, invoice_id, action, actor, details, created_at) VALUES
  ('audit-ls-01', 'inv-ls-01', 'created', 'system', '{"source":"livestream-auto","session":"LS-20260501-01"}', '2026-05-01T20:05:30Z'),
  ('audit-ls-02', 'inv-ls-01', 'issued', 'system', '{"tvanId":"MOCK-LSC-001","auto_issue":true}', '2026-05-01T20:05:35Z'),
  ('audit-ls-03', 'inv-ls-11', 'created', 'system', '{"source":"livestream-aggregate","aggregate_from":["inv-ls-011a","inv-ls-011b","inv-ls-011c"]}', '2026-05-01T20:30:00Z'),
  ('audit-ls-04', 'inv-ls-11', 'issued', 'system', '{"tvanId":"MOCK-LSC-011","auto_issue":true}', '2026-05-01T20:30:05Z'),
  ('audit-ls-05', 'inv-ls-11', 'cqt_accepted', 'system', '{"confirmationId":"CQT-LSC-011"}', '2026-05-01T20:35:00Z');

-- Omnichannel audit logs
INSERT OR IGNORE INTO audit_logs (id, invoice_id, action, actor, details, created_at) VALUES
  ('audit-omni-01', 'inv-omni-01', 'created', 'system', '{"source":"shopee-sync","shopee_order_id":"SP-20001"}', '2026-05-01T10:00:00Z'),
  ('audit-omni-02', 'inv-omni-01', 'issued', 'system', '{"tvanId":"MOCK-OCR-001"}', '2026-05-01T10:00:05Z'),
  ('audit-omni-03', 'inv-omni-01', 'cqt_accepted', 'system', '{"confirmationId":"CQT-OCR-001"}', '2026-05-01T10:05:00Z'),
  ('audit-omni-04', 'inv-omni-05', 'adjusted', 'user:admin', '{"reason":"Đổi hàng - lỗi cổng USB","platform":"lazada"}', '2026-05-03T09:30:00Z'),
  ('audit-omni-05', 'inv-omni-07', 'replaced', 'user:admin', '{"reason":"Hàng lỗi - đổi mới","platform":"shopee"}', '2026-05-03T15:30:00Z');

-- Retail audit logs
INSERT OR IGNORE INTO audit_logs (id, invoice_id, action, actor, details, created_at) VALUES
  ('audit-retail-01', 'inv-retail-01', 'created', 'user:cashier-01', '{"source":"pos","store":"store-retail-01"}', '2026-05-01T08:00:00Z'),
  ('audit-retail-02', 'inv-retail-01', 'issued', 'system', '{"tvanId":"MOCK-BLT-001"}', '2026-05-01T08:00:05Z'),
  ('audit-retail-03', 'inv-retail-01', 'cqt_accepted', 'system', '{"confirmationId":"CQT-BLT-001"}', '2026-05-01T08:05:00Z'),
  ('audit-retail-04', 'inv-retail-06', 'created', 'user:cashier-02', '{"source":"pos","store":"store-retail-02","b2b":true}', '2026-05-03T10:00:00Z');

-- ============================================================
-- NOTIFICATIONS (24 entries, 4 per merchant)
-- ============================================================

INSERT OR IGNORE INTO notifications (id, merchant_id, type, title, message, category, read, created_at) VALUES
  -- F&B notifications
  ('notif-fnb-01', 'merchant-fnb', 'success', 'Hóa đơn đã phát hành', 'FNB-001-001 đã được CQT chấp nhận', 'invoice', 0, datetime('now', '-5 minutes')),
  ('notif-fnb-02', 'merchant-fnb', 'info', 'Gộp đơn thành công', 'Đã gộp 2 đơn Web thành hóa đơn FNB-001-008', 'aggregate', 0, datetime('now', '-15 minutes')),
  ('notif-fnb-03', 'merchant-fnb', 'warning', 'Hóa đơn chờ xử lý', 'FNB-001-009 đang chờ CQT xác nhận', 'invoice', 1, datetime('now', '-1 hour')),
  ('notif-fnb-04', 'merchant-fnb', 'success', 'Doanh thu hôm nay', '12 hóa đơn, tổng 3.2M từ 3 chi nhánh', 'report', 1, datetime('now', '-2 hours')),

  -- Fashion notifications
  ('notif-fashion-01', 'merchant-fashion', 'success', 'Hóa đơn đã phát hành', 'TTV-002-001 đã được CQT chấp nhận', 'invoice', 0, datetime('now', '-10 minutes')),
  ('notif-fashion-02', 'merchant-fashion', 'warning', 'Yêu cầu đổi hàng', 'TTV-002-004: Khách đổi size 39→41', 'adjustment', 0, datetime('now', '-30 minutes')),
  ('notif-fashion-03', 'merchant-fashion', 'info', 'Đơn hàng B2B lớn', 'CTY Truyền thông ABC đặt 20 áo thun + 20 mũ', 'invoice', 1, datetime('now', '-1 hour')),
  ('notif-fashion-04', 'merchant-fashion', 'error', 'Thay thế hóa đơn', 'TTV-002-006 bị thay thế do sai màu', 'replacement', 1, datetime('now', '-2 hours')),

  -- Cosmetics notifications
  ('notif-cos-01', 'merchant-cosmetics', 'success', 'Đơn B2B đã xác nhận', 'MPN-003-005: 52M từ Đại lý Mỹ phẩm An', 'invoice', 0, datetime('now', '-5 minutes')),
  ('notif-cos-02', 'merchant-cosmetics', 'info', 'Đại lý đặt hàng lại', 'Hương Giang reorder mặt nạ + nước hoa hồng', 'invoice', 0, datetime('now', '-20 minutes')),
  ('notif-cos-03', 'merchant-cosmetics', 'warning', 'Hóa đơn chờ xử lý', 'MPN-003-008 đang chờ CQT xác nhận', 'invoice', 1, datetime('now', '-1 hour')),
  ('notif-cos-04', 'merchant-cosmetics', 'success', 'Loyalty discount applied', 'Nguyễn Thị Thanh Hà được giảm 5%', 'loyalty', 1, datetime('now', '-3 hours')),

  -- Livestream notifications
  ('notif-ls-01', 'merchant-livestream', 'success', 'Livestream session hoàn tất', 'LS-20260501-01: 18 hóa đơn, tổng 4.2M', 'livestream', 0, datetime('now', '-1 minute')),
  ('notif-ls-02', 'merchant-livestream', 'info', 'Auto-issue thành công', '15/18 hóa đơn đã tự động phát hành', 'invoice', 0, datetime('now', '-3 minutes')),
  ('notif-ls-03', 'merchant-livestream', 'warning', '3 hóa đơn chờ xử lý', 'inv-ls-015, inv-ls-016, inv-ls-017 đang chờ', 'invoice', 0, datetime('now', '-5 minutes')),
  ('notif-ls-04', 'merchant-livestream', 'info', 'Gộp đơn tự động', 'inv-ls-011: Gộp 3 đơn nhỏ thành 1 hóa đơn', 'aggregate', 1, datetime('now', '-10 minutes')),

  -- Omnichannel notifications
  ('notif-omni-01', 'merchant-omnichannel', 'success', 'Sync Shopee thành công', 'SP-20001 đã đồng bộ và phát hành', 'sync', 0, datetime('now', '-5 minutes')),
  ('notif-omni-02', 'merchant-omnichannel', 'warning', 'Đổi hàng từ Lazada', 'LZ-30002: Khách đổi do lỗi cổng USB', 'adjustment', 0, datetime('now', '-30 minutes')),
  ('notif-omni-03', 'merchant-omnichannel', 'info', 'Đơn B2B Shopee', 'Shopee VN đặt 50 chuột + 20 bàn phím', 'invoice', 1, datetime('now', '-1 hour')),
  ('notif-omni-04', 'merchant-omnichannel', 'error', 'Thay thế hóa đơn', 'SP-20003: Hàng lỗi, đã thay thế', 'replacement', 1, datetime('now', '-2 hours')),

  -- Retail notifications
  ('notif-retail-01', 'merchant-retail', 'success', 'Hóa đơn đã phát hành', 'BLT-006-001 đã được CQT chấp nhận', 'invoice', 0, datetime('now', '-5 minutes')),
  ('notif-retail-02', 'merchant-retail', 'info', 'Báo cáo ngày', '6 hóa đơn từ 7 cửa hàng, tổng 2.1M', 'report', 0, datetime('now', '-30 minutes')),
  ('notif-retail-03', 'merchant-retail', 'warning', 'Đơn B2B chờ duyệt', 'WEB-6001: 50 ream giấy + 20 hộp bút', 'invoice', 1, datetime('now', '-1 hour')),
  ('notif-retail-04', 'merchant-retail', 'info', 'Wholesale order', 'Thực phẩm Xanh đặt 100 sữa + 200 bánh mì', 'invoice', 1, datetime('now', '-2 hours'));
