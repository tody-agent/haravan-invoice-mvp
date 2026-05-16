import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { InvoiceService } from '../services/invoice-service';
import { createAdapter } from '../adapters';

type Bindings = { DB: D1Database; KV: KVNamespace; R2: R2Bucket };

const oneClick = new Hono<{ Bindings: Bindings }>();
oneClick.use('*', authMiddleware());

oneClick.post('/from-pos', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const adapter = createAdapter('mock');
  const service = new InvoiceService(c.env.DB, adapter);

  if (!body.items?.length) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Phải có ít nhất 1 sản phẩm' } }, 400);
  }

  const { invoice, errors } = await service.create({
    buyer: body.buyer || { name: 'Khách lẻ' },
    items: body.items,
    paymentMethod: body.paymentMethod || 'cash',
    channel: 'pos',
    orderId: body.orderId,
  }, user.merchantId);

  if (errors.length > 0) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors.join('; ') } }, 400);
  }

  return c.json({ success: true, data: invoice }, 201);
});

oneClick.post('/from-order', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const adapter = createAdapter('mock');
  const service = new InvoiceService(c.env.DB, adapter);

  const buyer = {
    name: body.customerName || body.buyerName || 'Khách lẻ',
    mst: body.customerMst || '',
    address: body.customerAddress || '',
    email: body.customerEmail || '',
  };

  const items = (body.orderItems || body.items || []).map((item: Record<string, unknown>) => ({
    name: (item.name || item.productName || 'Sản phẩm') as string,
    quantity: (item.quantity as number) || 1,
    unitPrice: ((item.price || item.unitPrice) as number) || 0,
    taxRate: (item.taxRate as number) || 0.1,
    total: ((item.quantity as number) || 1) * (((item.price || item.unitPrice) as number) || 0) * (1 + ((item.taxRate as number) || 0.1)),
  }));

  const { invoice, errors } = await service.create({
    buyer,
    items,
    paymentMethod: body.paymentMethod || 'transfer',
    channel: body.channel || 'web',
    orderId: body.orderId,
  }, user.merchantId);

  if (errors.length > 0) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors.join('; ') } }, 400);
  }

  return c.json({ success: true, data: invoice }, 201);
});

oneClick.get('/:id/status', async (c) => {
  const adapter = createAdapter('mock');
  const service = new InvoiceService(c.env.DB, adapter);
  const invoice = await service.getById(c.req.param('id'));

  if (!invoice) {
    return c.json({ success: false, error: { code: 'NOT_FOUND' } }, 404);
  }

  return c.json({
    success: true,
    data: {
      id: invoice.id,
      status: invoice.status,
      tvanId: invoice.tvanId,
      updatedAt: invoice.updatedAt,
    },
  });
});

export default oneClick;
