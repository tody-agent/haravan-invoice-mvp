-- Haravan Invoice MVP - D1 Schema
-- Cloudflare D1 (SQLite-compatible)

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  haravan_id TEXT UNIQUE NOT NULL,
  tvan_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','pending','issued','cqt_accepted','cqt_rejected','adjusted','replaced')),
  issue_date TEXT,
  buyer_name TEXT NOT NULL DEFAULT '',
  buyer_mst TEXT,
  buyer_address TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  seller_name TEXT NOT NULL DEFAULT '',
  seller_mst TEXT NOT NULL DEFAULT '',
  seller_address TEXT,
  seller_email TEXT,
  items TEXT NOT NULL DEFAULT '[]',
  subtotal INTEGER NOT NULL DEFAULT 0,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  discount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  tax_rate REAL DEFAULT 0.1,
  payment_method TEXT DEFAULT 'transfer' CHECK(payment_method IN ('cash','transfer','card','cod','other')),
  channel TEXT DEFAULT 'admin' CHECK(channel IN ('admin','pos','web','auto')),
  store_id TEXT,
  platform TEXT CHECK(platform IN ('shopee','lazada','tiktok','haravan','pos','website','livestream','other')),
  order_id TEXT,
  replaced_by TEXT REFERENCES invoices(id),
  replaces TEXT REFERENCES invoices(id),
  adjusted_by TEXT REFERENCES invoices(id),
  adjusts TEXT REFERENCES invoices(id),
  metadata TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  version INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT 'system',
  details TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

CREATE TABLE IF NOT EXISTS merchant_config (
  merchant_id TEXT PRIMARY KEY,
  auto_issue_on_paid INTEGER DEFAULT 0,
  default_tax_rate REAL DEFAULT 0.1,
  seller_name TEXT,
  seller_mst TEXT,
  seller_address TEXT,
  tvan_provider TEXT DEFAULT 'mock' CHECK(tvan_provider IN ('mock','hilo','viettel','misa')),
  mau_so TEXT DEFAULT '01GTKT0/001',
  ky_hieu TEXT DEFAULT 'AA/20E',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  response TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mst TEXT,
  address TEXT,
  email TEXT,
  phone TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_haravan ON invoices(haravan_id);
CREATE INDEX IF NOT EXISTS idx_invoices_buyer_mst ON invoices(buyer_mst);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_store ON invoices(store_id);
CREATE INDEX IF NOT EXISTS idx_invoices_platform ON invoices(platform);
CREATE INDEX IF NOT EXISTS idx_audit_invoice ON audit_logs(invoice_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_mst ON customers(mst);
