import { Hono } from 'hono';
import type { InvoiceFilter } from '@haravan/shared';
import { authMiddleware } from '../middleware/auth';
import { InvoiceService } from '../services/invoice-service';
import { createAdapter } from '../adapters';

type Bindings = { DB: D1Database; KV: KVNamespace };

const invoices = new Hono<{ Bindings: Bindings }>();
invoices.use('*', authMiddleware());

invoices.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const adapter = createAdapter('mock');
  const service = new InvoiceService(c.env.DB, adapter);

  const idempotencyKey = c.req.header('X-Idempotency-Key');
  if (idempotencyKey) {
    const cached = await c.env.KV.get(`idem:${user.merchantId}:${idempotencyKey}`);
    if (cached) return c.json(JSON.parse(cached));
  }

  const { invoice, errors } = await service.create(body, user.merchantId);

  if (errors.length > 0) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors.join('; ') } }, 400);
  }

  const response = { success: true, data: invoice };
  if (idempotencyKey) {
    await c.env.KV.put(`idem:${user.merchantId}:${idempotencyKey}`, JSON.stringify(response), { expirationTtl: 86400 });
  }

  return c.json(response, 201);
});

invoices.get('/', async (c) => {
  const user = c.get('user');
  const adapter = createAdapter('mock');
  const service = new InvoiceService(c.env.DB, adapter);

  const filter = {
    status: c.req.query('status')?.split(',') as InvoiceFilter['status'],
    dateFrom: c.req.query('dateFrom'),
    dateTo: c.req.query('dateTo'),
    buyerMst: c.req.query('buyerMst'),
    buyerName: c.req.query('buyerName'),
    page: Number(c.req.query('page')) || 1,
    pageSize: Number(c.req.query('pageSize')) || 20,
  };

  const result = await service.list(filter, user.merchantId);
  return c.json({ success: true, data: result });
});

invoices.get('/:id', async (c) => {
  const adapter = createAdapter('mock');
  const service = new InvoiceService(c.env.DB, adapter);
  const invoice = await service.getById(c.req.param('id'));

  if (!invoice) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Hóa đơn không tồn tại' } }, 404);
  }

  return c.json({ success: true, data: invoice });
});

invoices.post('/:id/replace', async (c) => {
  const user = c.get('user');
  const adapter = createAdapter('mock');
  const service = new InvoiceService(c.env.DB, adapter);
  const body = await c.req.json();

  const { invoice, errors } = await service.replace(c.req.param('id'), body, user.merchantId);

  if (errors.length > 0) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors.join('; ') } }, 400);
  }

  return c.json({ success: true, data: invoice });
});

invoices.post('/:id/adjust', async (c) => {
  const user = c.get('user');
  const adapter = createAdapter('mock');
  const service = new InvoiceService(c.env.DB, adapter);
  const body = await c.req.json();

  const { invoice, errors } = await service.adjust(c.req.param('id'), body, user.merchantId);

  if (errors.length > 0) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors.join('; ') } }, 400);
  }

  return c.json({ success: true, data: invoice });
});

export default invoices;
