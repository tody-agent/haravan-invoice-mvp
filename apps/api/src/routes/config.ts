import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database; KV: KVNamespace };

const config = new Hono<{ Bindings: Bindings }>();

config.use('*', authMiddleware());

// GET /api/v1/config
config.get('/', async (c) => {
  const user = c.get('user');

  const row = await c.env.DB.prepare('SELECT * FROM merchant_config WHERE merchant_id = ?')
    .bind(user.merchantId)
    .first();

  if (!row) {
    return c.json({
      success: true,
      data: {
        merchantId: user.merchantId,
        autoIssueOnPaid: false,
        defaultTaxRate: 0.1,
        tvanProvider: 'mock',
      },
    });
  }

  return c.json({
    success: true,
    data: {
      merchantId: row.merchant_id,
      autoIssueOnPaid: Boolean(row.auto_issue_on_paid),
      defaultTaxRate: row.default_tax_rate,
      sellerName: row.seller_name,
      sellerMst: row.seller_mst,
      sellerAddress: row.seller_address,
      tvanProvider: row.tvan_provider,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  });
});

// PATCH /api/v1/config
config.patch('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json<Record<string, unknown>>();

  const allowed = ['auto_issue_on_paid', 'default_tax_rate', 'seller_name', 'seller_mst', 'seller_address'];
  const updates: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(body)) {
    const snakeKey = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    if (allowed.includes(snakeKey)) {
      updates.push(`${snakeKey} = ?`);
      values.push(key === 'autoIssueOnPaid' ? (value ? 1 : 0) : value);
    }
  }

  if (updates.length === 0) {
    return c.json({ success: false, message: 'No valid fields to update' }, 400);
  }

  updates.push("updated_at = datetime('now')");
  values.push(user.merchantId);

  await c.env.DB.prepare(`UPDATE merchant_config SET ${updates.join(', ')} WHERE merchant_id = ?`)
    .bind(...values)
    .run();

  return c.json({ success: true, message: 'Config updated' });
});

export default config;
