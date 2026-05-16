import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database };

const products = new Hono<{ Bindings: Bindings }>();
products.use('*', authMiddleware());

products.get('/', async (c) => {
  const search = c.req.query('search') || '';
  const page = Number(c.req.query('page')) || 1;
  const pageSize = Number(c.req.query('pageSize')) || 20;
  const offset = (page - 1) * pageSize;

  const allInvoices = await c.env.DB.prepare('SELECT items FROM invoices').all();
  const productMap = new Map<string, { name: string; sku: string; totalQty: number; totalRevenue: number; invoiceCount: number }>();

  for (const inv of allInvoices.results || []) {
    const items = JSON.parse((inv.items as string) || '[]');
    for (const item of items) {
      const key = item.sku || item.name;
      if (!productMap.has(key)) {
        productMap.set(key, { name: item.name, sku: item.sku || '', totalQty: 0, totalRevenue: 0, invoiceCount: 0 });
      }
      const p = productMap.get(key)!;
      p.totalQty += item.quantity || 0;
      p.totalRevenue += item.total || 0;
      p.invoiceCount++;
    }
  }

  let productList = Array.from(productMap.values());
  if (search) {
    productList = productList.filter(
      (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const total = productList.length;
  const items = productList.slice(offset, offset + pageSize);

  return c.json({ success: true, data: { items, total, page, pageSize } });
});

export default products;
