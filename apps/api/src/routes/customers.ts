import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database };

const customers = new Hono<{ Bindings: Bindings }>();
customers.use('*', authMiddleware());

// GET /api/v1/customers — list + search + pagination
customers.get('/', async (c) => {
  const search = c.req.query('search') || '';
  const page = Number(c.req.query('page')) || 1;
  const pageSize = Number(c.req.query('pageSize')) || 20;
  const offset = (page - 1) * pageSize;

  let where = '1=1';
  const params: unknown[] = [];

  if (search) {
    where += ' AND (name LIKE ? OR mst LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const countResult = await c.env.DB.prepare(`SELECT COUNT(*) as total FROM customers WHERE ${where}`)
    .bind(...params).first() as { total: number };

  const rows = await c.env.DB.prepare(`SELECT * FROM customers WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .bind(...params, pageSize, offset).all();

  return c.json({
    success: true,
    data: {
      items: (rows.results || []).map(row => ({
        id: row.id, name: row.name, mst: row.mst, address: row.address,
        email: row.email, phone: row.phone, createdAt: row.created_at,
      })),
      total: countResult.total, page, pageSize,
    },
  });
});

// GET /api/v1/customers/:id — detail
customers.get('/:id', async (c) => {
  const row = await c.env.DB.prepare('SELECT * FROM customers WHERE id = ?')
    .bind(c.req.param('id')).first();

  if (!row) return c.json({ success: false, error: { code: 'NOT_FOUND' } }, 404);

  // Get recent invoices for this customer
  const invoices = await c.env.DB.prepare(
    "SELECT id, haravan_id, status, total, issue_date FROM invoices WHERE buyer_mst = ? ORDER BY created_at DESC LIMIT 5"
  ).bind(row.mst).all();

  return c.json({
    success: true,
    data: {
      id: row.id, name: row.name, mst: row.mst, address: row.address,
      email: row.email, phone: row.phone, createdAt: row.created_at,
      recentInvoices: (invoices.results || []).map(inv => ({
        id: inv.id, haravanId: inv.haravan_id, status: inv.status,
        total: inv.total, issueDate: inv.issue_date,
      })),
    },
  });
});

export default customers;
