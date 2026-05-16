import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database };

const audit = new Hono<{ Bindings: Bindings }>();
audit.use('*', authMiddleware());

audit.get('/:id/audit', async (c) => {
  const invoiceId = c.req.param('id');

  const logs = await c.env.DB.prepare(
    'SELECT * FROM audit_logs WHERE invoice_id = ? ORDER BY created_at ASC'
  ).bind(invoiceId).all();

  return c.json({
    success: true,
    data: (logs.results || []).map(row => ({
      id: row.id,
      invoiceId: row.invoice_id,
      action: row.action,
      actor: row.actor,
      details: JSON.parse(row.details as string || '{}'),
      createdAt: row.created_at,
    })),
  });
});

export default audit;
