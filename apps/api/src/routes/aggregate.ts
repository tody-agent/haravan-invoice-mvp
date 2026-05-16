import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database; KV: KVNamespace };

const aggregate = new Hono<{ Bindings: Bindings }>();
aggregate.use('*', authMiddleware());

aggregate.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json<{ date?: string }>();
  const targetDate = body.date || new Date().toISOString().slice(0, 10);

  const invoices = await c.env.DB.prepare(
    `SELECT * FROM invoices
     WHERE status IN ('draft','pending')
       AND date(created_at) = ?
       AND channel = 'pos'
       AND (buyer_mst = '' OR buyer_mst IS NULL)
     ORDER BY created_at`
  ).bind(targetDate).all();

  if (!invoices.results?.length) {
    return c.json({ success: false, message: 'Không có đơn lẻ để gộp' }, 400);
  }

  const allItems: Record<string, { name: string; quantity: number; total: number; taxRate: number }> = {};
  let subtotal = 0;
  let taxAmount = 0;

  for (const inv of invoices.results) {
    const items = JSON.parse((inv.items as string) || '[]');
    for (const item of items) {
      const key = item.name;
      if (!allItems[key]) allItems[key] = { name: item.name, quantity: 0, total: 0, taxRate: item.taxRate || 0.1 };
      allItems[key].quantity += item.quantity;
      allItems[key].total += item.total;
    }
    subtotal += inv.subtotal as number;
    taxAmount += inv.tax_amount as number;
  }

  const aggId = `agg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const haravanId = `HRV-AGG-${targetDate.replace(/-/g, '')}`;
  const total = subtotal + taxAmount;
  const mergedItems = Object.values(allItems).map(i => ({
    name: i.name,
    quantity: i.quantity,
    unitPrice: i.quantity > 0 ? Math.round(i.total / i.quantity) : 0,
    taxRate: i.taxRate,
    total: i.total,
  }));

  await c.env.DB.prepare(`
    INSERT INTO invoices (id, haravan_id, status, issue_date, buyer_name, seller_name, seller_mst,
      items, subtotal, tax_amount, total, tax_rate, payment_method, channel, metadata, created_at, updated_at)
    VALUES (?, ?, 'pending', datetime('now'), 'Khách lẻ tổng hợp', 'Merchant', ?,
      ?, ?, ?, ?, 0.1, 'cash', 'pos', ?, datetime('now'), datetime('now'))
  `).bind(
    aggId, haravanId, user.merchantId,
    JSON.stringify(mergedItems), subtotal, taxAmount, total,
    JSON.stringify({ source: 'aggregate', date: targetDate, originalCount: invoices.results.length })
  ).run();

  const originalIds = invoices.results.map(inv => inv.id as string);
  await c.env.DB.prepare(
    `UPDATE invoices SET status = 'replaced', replaced_by = ?, updated_at = datetime('now') WHERE id IN (${originalIds.map(() => '?').join(',')})`
  ).bind(aggId, ...originalIds).run();

  const auditId = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  await c.env.DB.prepare(
    'INSERT INTO audit_logs (id, invoice_id, action, actor, details) VALUES (?, ?, ?, ?, ?)'
  ).bind(
    auditId, aggId, 'aggregated', `user:${user.merchantId}`,
    JSON.stringify({ date: targetDate, count: invoices.results.length, originalIds })
  ).run();

  return c.json({
    success: true,
    data: {
      id: aggId,
      haravanId,
      date: targetDate,
      originalCount: invoices.results.length,
      subtotal,
      taxAmount,
      total,
      items: mergedItems,
    },
  });
});

aggregate.get('/summary', async (c) => {
  const month = c.req.query('month') || new Date().toISOString().slice(0, 7);

  const rows = await c.env.DB.prepare(
    `SELECT date(created_at) as date, COUNT(*) as count, SUM(total) as total
     FROM invoices
     WHERE channel = 'pos'
       AND metadata LIKE '%"source":"aggregate"%'
       AND created_at LIKE ? || '%'
     GROUP BY date(created_at)
     ORDER BY date DESC`
  ).bind(month).all();

  return c.json({
    success: true,
    data: (rows.results || []).map(r => ({
      date: r.date,
      count: r.count,
      total: r.total,
    })),
  });
});

export default aggregate;
