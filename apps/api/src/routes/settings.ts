import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database; KV: KVNamespace };

const settings = new Hono<{ Bindings: Bindings }>();
settings.use('*', authMiddleware());

// GET /api/v1/settings/templates — get invoice templates
settings.get('/templates', async (c) => {
  const user = c.get('user');
  const config = await c.env.DB.prepare('SELECT * FROM merchant_config WHERE merchant_id = ?').bind(user.merchantId).first();

  return c.json({
    success: true,
    data: {
      mauSo: config?.mau_so || '01GTKT0/001',
      kyHieu: config?.ky_hieu || 'AA/20E',
      templateName: 'Hóa đơn GTGT',
      status: 'active',
    },
  });
});

// PATCH /api/v1/settings/templates — update templates
settings.patch('/templates', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  await c.env.DB.prepare(
    "UPDATE merchant_config SET mau_so = ?, ky_hieu = ?, updated_at = datetime('now') WHERE merchant_id = ?"
  ).bind(body.mauSo || '01GTKT0/001', body.kyHieu || 'AA/20E', user.merchantId).run();

  return c.json({ success: true, message: 'Đã cập nhật mẫu hóa đơn' });
});

// GET /api/v1/settings/automation — get automation rules
settings.get('/automation', async (c) => {
  const user = c.get('user');
  const config = await c.env.DB.prepare('SELECT * FROM merchant_config WHERE merchant_id = ?').bind(user.merchantId).first();

  return c.json({
    success: true,
    data: {
      autoIssueOnPaid: Boolean(config?.auto_issue_on_paid),
      channels: ['web', 'pos'],
      delayMinutes: 0,
      notifyOnIssue: true,
      notifyOnError: true,
    },
  });
});

// PATCH /api/v1/settings/automation — update automation rules
settings.patch('/automation', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  await c.env.DB.prepare(
    "UPDATE merchant_config SET auto_issue_on_paid = ?, updated_at = datetime('now') WHERE merchant_id = ?"
  ).bind(body.autoIssueOnPaid ? 1 : 0, user.merchantId).run();

  return c.json({ success: true, message: 'Đã cập nhật quy tắc tự động' });
});

// GET /api/v1/settings/plan — get plan info
settings.get('/plan', async (c) => {
  const user = c.get('user');

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const invoiceCount = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM invoices WHERE created_at >= ?"
  ).bind(monthStart).first();

  return c.json({
    success: true,
    data: {
      plan: 'Free',
      invoiceLimit: 100,
      invoiceUsed: (invoiceCount as any)?.count || 0,
      storageLimit: 1024,
      storageUsed: 0,
      features: ['basic_invoice', 'reports', 'pdf_export'],
      expiresAt: null,
    },
  });
});

export default settings;
