import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database };

const customerAnalytics = new Hono<{ Bindings: Bindings }>();
customerAnalytics.use('*', authMiddleware());

// GET /api/v1/customers/:id/analytics — customer analytics
customerAnalytics.get('/:id/analytics', async (c) => {
  const id = c.req.param('id');
  
  const customer = await c.env.DB.prepare('SELECT * FROM customers WHERE id = ?').bind(id).first();
  if (!customer) return c.json({ success: false, error: { code: 'NOT_FOUND' } }, 404);

  // Get invoice stats for this customer
  const stats = await c.env.DB.prepare(
    "SELECT COUNT(*) as count, SUM(total) as totalRevenue, AVG(total) as avgOrderValue, MIN(created_at) as firstInvoice, MAX(created_at) as lastInvoice FROM invoices WHERE buyer_mst = ? AND status IN ('issued','cqt_accepted')"
  ).bind(customer.mst).first();

  // Get monthly trend
  const monthly = await c.env.DB.prepare(
    "SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count, SUM(total) as total FROM invoices WHERE buyer_mst = ? AND status IN ('issued','cqt_accepted') GROUP BY month ORDER BY month DESC LIMIT 12"
  ).bind(customer.mst).all();

  // Get channel breakdown
  const channels = await c.env.DB.prepare(
    "SELECT channel, COUNT(*) as count, SUM(total) as total FROM invoices WHERE buyer_mst = ? AND status IN ('issued','cqt_accepted') GROUP BY channel"
  ).bind(customer.mst).all();

  return c.json({
    success: true,
    data: {
      customer: { id: customer.id, name: customer.name, mst: customer.mst, address: customer.address, email: customer.email, phone: customer.phone },
      stats: {
        totalInvoices: (stats as any)?.count || 0,
        totalRevenue: (stats as any)?.totalRevenue || 0,
        avgOrderValue: (stats as any)?.avgOrderValue || 0,
        firstInvoice: (stats as any)?.firstInvoice,
        lastInvoice: (stats as any)?.lastInvoice,
      },
      monthly: (monthly.results || []).map(r => ({ month: r.month, count: r.count, total: r.total })),
      channels: (channels.results || []).map(r => ({ channel: r.channel, count: r.count, total: r.total })),
    },
  });
});

export default customerAnalytics;
