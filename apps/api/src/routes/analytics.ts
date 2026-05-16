import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database };

const analytics = new Hono<{ Bindings: Bindings }>();
analytics.use('*', authMiddleware());

analytics.get('/channels', async (c) => {
  const days = Number(c.req.query('days')) || 30;
  const dateFrom = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  const rows = await c.env.DB.prepare(
    "SELECT channel, COUNT(*) as count, SUM(total) as total FROM invoices WHERE date(created_at) >= ? AND status IN ('issued','cqt_accepted') GROUP BY channel"
  ).bind(dateFrom).all();

  return c.json({
    success: true,
    data: (rows.results || []).map((r: Record<string, unknown>) => ({
      channel: r.channel,
      count: r.count,
      total: r.total,
    })),
  });
});

analytics.get('/top-customers', async (c) => {
  const days = Number(c.req.query('days')) || 30;
  const dateFrom = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  const rows = await c.env.DB.prepare(
    "SELECT buyer_name as name, buyer_mst as mst, COUNT(*) as invoiceCount, SUM(total) as total FROM invoices WHERE date(created_at) >= ? AND status IN ('issued','cqt_accepted') GROUP BY buyer_mst, buyer_name ORDER BY total DESC LIMIT 20"
  ).bind(dateFrom).all();

  return c.json({
    success: true,
    data: (rows.results || []).map((r: Record<string, unknown>) => ({
      name: r.name,
      mst: r.mst,
      invoiceCount: r.invoiceCount,
      total: r.total,
    })),
  });
});

analytics.get('/top-skus', async (c) => {
  const days = Number(c.req.query('days')) || 30;
  const dateFrom = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  const invoices = await c.env.DB.prepare(
    "SELECT items FROM invoices WHERE date(created_at) >= ? AND status IN ('issued','cqt_accepted')"
  ).bind(dateFrom).all();

  const skuMap = new Map<string, { name: string; sku: string; qty: number; revenue: number }>();

  for (const inv of invoices.results || []) {
    const items = JSON.parse((inv as Record<string, unknown>).items as string || '[]');
    for (const item of items) {
      const key = item.sku || item.name;
      if (!skuMap.has(key)) skuMap.set(key, { name: item.name, sku: item.sku || '', qty: 0, revenue: 0 });
      const s = skuMap.get(key)!;
      s.qty += item.quantity || 0;
      s.revenue += item.total || 0;
    }
  }

  const topSkus = Array.from(skuMap.values()).sort((a, b) => b.qty - a.qty).slice(0, 10);

  return c.json({ success: true, data: topSkus });
});

export default analytics;
