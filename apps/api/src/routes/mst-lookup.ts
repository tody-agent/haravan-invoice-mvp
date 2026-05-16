import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database; KV: KVNamespace };

const mstLookup = new Hono<{ Bindings: Bindings }>();
mstLookup.use('*', authMiddleware());

// GET /api/v1/mst/lookup?mst=0123456789 — lookup MST info
mstLookup.get('/lookup', async (c) => {
  const mst = c.req.query('mst');
  if (!mst) {
    return c.json({ success: false, error: { code: 'MISSING_MST', message: 'Thiếu MST' } }, 400);
  }

  // Check cache first
  const cacheKey = `mst:${mst}`;
  const cached = await c.env.KV.get(cacheKey);
  if (cached) {
    return c.json({ success: true, data: JSON.parse(cached), cached: true });
  }

  // Mock CQT lookup (in production: call real CQT API)
  const mockCompanies: Record<string, any> = {
    '0123456789': { name: 'Công ty TNHH ABC', address: '123 Nguyễn Huệ, Q1, TP.HCM', status: 'active' },
    '9876543210': { name: 'Công ty CP XYZ', address: '456 Lê Lợi, Q3, TP.HCM', status: 'active' },
    '1122334455': { name: 'Cổ phần Dịch vụ DEF', address: '789 Trần Hưng Đạo, Q5, TP.HCM', status: 'active' },
  };

  const company = mockCompanies[mst];
  if (!company) {
    // Try to find in customers table
    const customer = await c.env.DB.prepare(
      'SELECT name, mst, address FROM customers WHERE mst = ?'
    ).bind(mst).first();

    if (customer) {
      const result = { name: customer.name, address: customer.address, status: 'active', source: 'customer_profile' };
      await c.env.KV.put(cacheKey, JSON.stringify(result), { expirationTtl: 86400 }); // 24h cache
      return c.json({ success: true, data: result });
    }

    return c.json({ success: true, data: { name: '', address: '', status: 'unknown', source: 'not_found' } });
  }

  // Cache result
  await c.env.KV.put(cacheKey, JSON.stringify({ ...company, source: 'cqt' }), { expirationTtl: 86400 });

  return c.json({ success: true, data: { ...company, source: 'cqt' } });
});

// GET /api/v1/mst/validate?mst=0123456789 — validate MST format
mstLookup.get('/validate', async (c) => {
  const mst = c.req.query('mst');
  if (!mst) {
    return c.json({ success: false, error: { code: 'MISSING_MST' } }, 400);
  }

  const isValid = /^\d{10}$|^\d{13}$/.test(mst);
  return c.json({
    success: true,
    data: {
      mst,
      valid: isValid,
      length: mst.length,
      type: mst.length === 10 ? 'organization' : mst.length === 13 ? 'individual' : 'invalid',
    },
  });
});

// POST /api/v1/mst/save-to-customer — save MST to customer profile
mstLookup.post('/save-to-customer', async (c) => {
  const body = await c.req.json<{ customerId?: string; mst: string; name?: string; address?: string }>();

  if (!body.mst) {
    return c.json({ success: false, error: { code: 'MISSING_MST' } }, 400);
  }

  // Update customer MST
  if (body.customerId) {
    await c.env.DB.prepare(
      'UPDATE customers SET mst = ?, address = COALESCE(?, address) WHERE id = ?'
    ).bind(body.mst, body.address || null, body.customerId).run();
  }

  return c.json({ success: true, message: 'Đã lưu MST vào profile khách hàng' });
});

export default mstLookup;
