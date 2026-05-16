# Prompt 2 — Product Catalog (API + UI)

> **Chạy song song được với:** Prompt 1, 3, 4, 5, 6 (không conflict file)

## Context
- Project: `/Volumes/Data/Invoice/`
- Stack: Hono + D1 + React + Cloudflare
- Design system: `apps/portal/src/design-system.css`
- Tabler Icons: class="ti ti-{name}"

## Task

### Backend — Tạo file MỚI `apps/api/src/routes/products.ts`:

```typescript
import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database };

const products = new Hono<{ Bindings: Bindings }>();
products.use('*', authMiddleware());

// GET /api/v1/products — list + search + pagination
products.get('/', async (c) => {
  const search = c.req.query('search') || '';
  const page = Number(c.req.query('page')) || 1;
  const pageSize = Number(c.req.query('pageSize')) || 20;
  const offset = (page - 1) * pageSize;

  // Extract unique products from invoice items
  let where = '1=1';
  const params: unknown[] = [];

  if (search) {
    where += ' AND (name LIKE ? OR sku LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // Since we don't have a products table, extract from invoices
  const allInvoices = await c.env.DB.prepare('SELECT items FROM invoices').all();
  const productMap = new Map<string, { name: string; sku: string; totalQty: number; totalRevenue: number; invoiceCount: number }>();

  for (const inv of allInvoices.results || []) {
    const items = JSON.parse(inv.items as string || '[]');
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
    productList = productList.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    );
  }

  const total = productList.length;
  const items = productList.slice(offset, offset + pageSize);

  return c.json({ success: true, data: { items, total, page, pageSize } });
});

export default products;
```

### Cập nhật `apps/api/src/routes/index.ts` — THÊM:
```typescript
export { default as productRoutes } from './products';
```

### Cập nhật `apps/api/src/index.ts` — THÊM:
```typescript
import { productRoutes } from './routes';
app.route('/api/v1/products', productRoutes);
```

### Frontend — Tạo file MỚI `apps/portal/src/pages/ProductList.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`${API_URL}/v1/products?search=${search}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success) { setProducts(json.data.items || []); setTotal(json.data.total || 0); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <>
      <h2 className="text-h2" style={{ marginBottom: 'var(--hv-space-4)' }}>Sản phẩm</h2>

      <div className="hv-filter-bar" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-filter-search">
          <input type="text" className="hv-input" placeholder="Tìm sản phẩm..." value={search}
            onChange={e => { const p = new URLSearchParams(searchParams); p.set('search', e.target.value); setSearchParams(p); }} />
          <i className="ti ti-search"></i>
        </div>
      </div>

      <div className="hv-card">
        {loading ? (
          <div>{[1,2,3,4,5].map(i => <div key={i} className="hv-skeleton hv-skeleton-row" style={{ marginBottom: 4 }}></div>)}</div>
        ) : products.length === 0 ? (
          <div className="hv-empty-state" style={{ display: 'flex' }}>
            <i className="ti ti-package hv-empty-state-icon"></i>
            <div className="hv-empty-state-title">Chưa có sản phẩm</div>
            <div className="hv-empty-state-desc">Sản phẩm sẽ được tạo tự động từ hóa đơn.</div>
          </div>
        ) : (
          <div className="hv-table-scroll">
            <table className="hv-table">
              <thead><tr>
                <th>SKU</th>
                <th>Tên sản phẩm</th>
                <th className="hv-text-right">SL bán</th>
                <th className="hv-text-right">Doanh thu</th>
                <th className="hv-text-right">Số HĐ</th>
              </tr></thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td className="text-mono text-caption">{p.sku || '-'}</td>
                    <td className="text-body-strong">{p.name}</td>
                    <td className="hv-text-right">{p.totalQty}</td>
                    <td className="hv-text-right">{fmt(p.totalRevenue)}</td>
                    <td className="hv-text-right">{p.invoiceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="text-caption" style={{ padding: 'var(--hv-space-2) var(--hv-space-4)' }}>{total} sản phẩm</div>
      </div>
    </>
  );
}
```

### Cập nhật `apps/portal/src/App.tsx` — THAY ComingSoon cho products:
```tsx
<Route path="products" element={<ProductList />} />
```

## Verification
```bash
cd /Volumes/Data/Invoice
pnpm --filter @haravan/api test
pnpm --filter @haravan/portal typecheck
```
