# Prompt 1 — Gộp đơn lẻ cuối ngày (TT 78/TT 32)

> **Chạy song song được với:** Prompt 2, 3, 4, 5, 6 (không conflict file)

## Context
- Project: `/Volumes/Data/Invoice/`
- Stack: Hono + D1 + KV + R2 trên Cloudflare Workers
- Design system: `apps/portal/src/design-system.css` (2117 lines, Haravan tokens)
- Tabler Icons: class="ti ti-{name}"
- Types: `packages/shared/src/invoice.ts`

## Task

### Backend — Tạo file MỚI `apps/api/src/routes/aggregate.ts`:

```typescript
import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database; KV: KVNamespace };

const aggregate = new Hono<{ Bindings: Bindings }>();
aggregate.use('*', authMiddleware());

// POST /api/v1/invoices/aggregate — gộp đơn lẻ cuối ngày
aggregate.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json<{ date?: string; branchId?: string }>();
  const targetDate = body.date || new Date().toISOString().slice(0, 10);

  // Get all draft/pending invoices for the day that are small transactions
  const invoices = await c.env.DB.prepare(
    "SELECT * FROM invoices WHERE status IN ('draft','pending') AND date(created_at) = ? AND channel = 'pos' ORDER BY created_at"
  ).bind(targetDate).all();

  if (!invoices.results?.length) {
    return c.json({ success: false, message: 'Không có đơn lẻ để gộp' }, 400);
  }

  // Group items and create aggregate invoice
  const allItems: Record<string, { name: string; quantity: number; total: number }> = {};
  let subtotal = 0;
  let taxAmount = 0;

  for (const inv of invoices.results) {
    const items = JSON.parse(inv.items as string || '[]');
    for (const item of items) {
      const key = item.name;
      if (!allItems[key]) allItems[key] = { name: item.name, quantity: 0, total: 0 };
      allItems[key].quantity += item.quantity;
      allItems[key].total += item.total;
    }
    subtotal += inv.subtotal as number;
    taxAmount += inv.tax_amount as number;
  }

  // Create aggregate invoice
  const aggId = `agg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const haravanId = `HRV-AGG-${targetDate.replace(/-/g, '')}`;
  const total = subtotal + taxAmount;

  await c.env.DB.prepare(`
    INSERT INTO invoices (id, haravan_id, status, issue_date, buyer_name, seller_name, seller_mst, items, subtotal, tax_amount, total, payment_method, channel, metadata, created_at, updated_at)
    VALUES (?, ?, 'pending', datetime('now'), 'Khách lẻ tổng hợp', ?, ?, ?, ?, ?, ?, 'cash', 'pos-aggregate', ?, datetime('now'), datetime('now'))
  `).bind(
    aggId, haravanId, 'Merchant', user.merchantId,
    JSON.stringify(Object.values(allItems)), subtotal, taxAmount, total,
    JSON.stringify({ source: 'aggregate', date: targetDate, originalCount: invoices.results.length })
  ).run();

  // Mark original invoices as replaced
  for (const inv of invoices.results) {
    await c.env.DB.prepare(
      "UPDATE invoices SET status = 'replaced', replaced_by = ? WHERE id = ?"
    ).bind(aggId, inv.id).run();
  }

  // Audit log
  await c.env.DB.prepare(
    'INSERT INTO audit_logs (id, invoice_id, action, actor, details) VALUES (?, ?, ?, ?, ?)'
  ).bind(
    `audit-${Date.now()}`, aggId, 'aggregated', `user:${user.merchantId}`,
    JSON.stringify({ date: targetDate, count: invoices.results.length })
  ).run();

  return c.json({
    success: true,
    data: {
      id: aggId,
      haravanId,
      date: targetDate,
      originalCount: invoices.results.length,
      subtotal,
      taxAmount,
      total,
      items: Object.values(allItems),
    },
  });
});

// GET /api/v1/invoices/aggregate/summary — tổng hợp gộp theo ngày
aggregate.get('/summary', async (c) => {
  const month = c.req.query('month') || new Date().toISOString().slice(0, 7);

  const rows = await c.env.DB.prepare(
    "SELECT date(created_at) as date, COUNT(*) as count, SUM(total) as total FROM invoices WHERE channel = 'pos-aggregate' AND created_at LIKE ? || '%' GROUP BY date(created_at) ORDER BY date DESC"
  ).bind(month).all();

  return c.json({
    success: true,
    data: (rows.results || []).map(r => ({
      date: r.date,
      count: r.count,
      total: r.total,
    })),
  });
});

export default aggregate;
```

### Cập nhật `apps/api/src/routes/index.ts` — THÊM dòng:
```typescript
export { default as aggregateRoutes } from './aggregate';
```

### Cập nhật `apps/api/src/index.ts` — THÊM:
```typescript
import { aggregateRoutes } from './routes';
app.route('/api/v1/invoices/aggregate', aggregateRoutes);
```

### Frontend — Tạo file MỚI `apps/portal/src/pages/DailyAggregate.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function DailyAggregate() {
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aggregating, setAggregating] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/v1/invoices/aggregate/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success) setSummary(json.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAggregate = async () => {
    setAggregating(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/v1/invoices/aggregate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date: new Date().toISOString().slice(0, 10) }),
      });
      const json = await res.json();
      if (json.success) {
        setToast(`Đã gộp ${json.data.originalCount} đơn thành 1 hóa đơn tổng`);
        setTimeout(() => setToast(''), 3000);
      } else {
        setToast(json.message || 'Lỗi gộp đơn');
      }
    } catch { setToast('Lỗi kết nối'); }
    finally { setAggregating(false); }
  };

  return (
    <>
      <h2 className="text-h2" style={{ marginBottom: 'var(--hv-space-4)' }}>Gộp đơn lẻ cuối ngày</h2>

      {toast && (
        <div className="hv-toast hv-toast-success" style={{ position: 'fixed', top: 70, right: 16, zIndex: 2000 }}>
          <i className="ti ti-check"></i> {toast}
        </div>
      )}

      <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card-header">
          <div className="hv-card-title">Tổng hợp theo ngày</div>
          <button className="hv-btn hv-btn-primary" onClick={handleAggregate} disabled={aggregating}>
            {aggregating ? <><i className="ti ti-loader-2"></i> Đang gộp...</> : <><i className="ti ti-git-merge"></i> Gộp ngay</>}
          </button>
        </div>
        <p className="text-caption" style={{ padding: '0 var(--hv-space-4) var(--hv-space-3)' }}>
          Theo TT 78/TT 32: Gộp các giao dịch bán lẻ trong ngày (khách không lấy HĐ, không có MST) thành 1 hóa đơn tổng.
        </p>

        {loading ? (
          <div>{[1,2,3].map(i => <div key={i} className="hv-skeleton hv-skeleton-row" style={{ margin: '0 var(--hv-space-4) 4px' }}></div>)}</div>
        ) : summary.length === 0 ? (
          <div className="hv-empty-state" style={{ display: 'flex' }}>
            <i className="ti ti-git-merge hv-empty-state-icon"></i>
            <div className="hv-empty-state-title">Chưa có dữ liệu gộp</div>
            <div className="hv-empty-state-desc">Nhấn "Gộp ngay" để gộp đơn lẻ hôm nay.</div>
          </div>
        ) : (
          <div className="hv-table-scroll">
            <table className="hv-table">
              <thead><tr>
                <th>Ngày</th>
                <th className="hv-text-right">Số đơn gộp</th>
                <th className="hv-text-right">Tổng tiền</th>
                <th></th>
              </tr></thead>
              <tbody>
                {summary.map((row, i) => (
                  <tr key={i}>
                    <td>{new Date(row.date).toLocaleDateString('vi-VN')}</td>
                    <td className="hv-text-right">{row.count}</td>
                    <td className="hv-text-right text-body-strong">{fmt(row.total)}</td>
                    <td><Link to={`/invoices?channel=pos-aggregate&date=${row.date}`} className="hv-btn hv-btn-sm hv-btn-tertiary">Xem chi tiết</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="hv-card">
        <div className="hv-card-header"><div className="hv-card-title">Quy tắc gộp</div></div>
        <div style={{ padding: '0 var(--hv-space-4) var(--hv-space-4)' }}>
          <ul style={{ paddingLeft: 20, color: 'var(--hv-text-secondary)', fontSize: 13, lineHeight: 1.8 }}>
            <li>Chỉ gộp đơn POS trong ngày (khách lẻ, không có MST)</li>
            <li>Gộp theo SKU: cộng dồn số lượng cùng sản phẩm</li>
            <li>Hóa đơn tổng ghi chú "Theo TT 78/TT 32"</li>
            <li>Đơn gốc đánh dấu "Đã thay thế"</li>
            <li>Không gộp đơn đã phát hành HĐ riêng</li>
          </ul>
        </div>
      </div>
    </>
  );
}
```

### Cập nhật `apps/portal/src/App.tsx` — THÊM route:
```tsx
<Route path="aggregate" element={<DailyAggregate />} />
```

## Verification
```bash
cd /Volumes/Data/Invoice
pnpm --filter @haravan/api test
pnpm --filter @haravan/portal typecheck
```

## Kết quả mong đợi
- 1 file API mới (`aggregate.ts`) với 2 endpoints
- 1 file UI mới (`DailyAggregate.tsx`)
- Không sửa file nào của features khác
- Tests pass, typecheck pass
