# Prompt 4 — Customer Detail Enhancement + Customer API

> **Chạy song song được với:** Prompt 1, 2, 3, 5, 6 (không conflict file)

## Context
- Project: `/Volumes/Data/Invoice/`
- Stack: Hono + D1 + React + Cloudflare
- Customer API đã có: `apps/api/src/routes/customers.ts`
- Customer pages đã có: `apps/portal/src/pages/CustomerList.tsx`, `CustomerDetail.tsx`

## Task

### Backend — Tạo file MỚI `apps/api/src/routes/customer-analytics.ts`:

```typescript
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
```

### Cập nhật `apps/api/src/routes/index.ts` — THÊM:
```typescript
export { default as customerAnalyticsRoutes } from './customer-analytics';
```

### Cập nhật `apps/api/src/index.ts` — THÊM:
```typescript
import { customerAnalyticsRoutes } from './routes';
app.route('/api/v1/customers', customerAnalyticsRoutes);
```

### Frontend — Tạo file MỚI `apps/portal/src/pages/CustomerDetail.tsx` (REPLACE):

```tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { STATUS_LABELS } from '@haravan/shared';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_URL}/v1/customers/${id}`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/v1/customers/${id}/analytics`, { headers }).then(r => r.json()),
    ])
      .then(([custRes, analyticsRes]) => {
        if (custRes.success) { setCustomer(custRes.data); setInvoices(custRes.data.recentInvoices || []); }
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="hv-skeleton hv-skeleton-chart" style={{ height: 400 }}></div>;
  if (!customer) return <div className="hv-empty-state" style={{ display: 'flex' }}><div className="hv-empty-state-title">Không tìm thấy</div></div>;

  const sv: Record<string, string> = {
    draft: 'hv-badge-neutral', pending: 'hv-badge-warning', issued: 'hv-badge-info',
    cqt_accepted: 'hv-badge-success', cqt_rejected: 'hv-badge-danger',
    adjusted: 'hv-badge-purple', replaced: 'hv-badge-warning',
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-4)' }}>
        <Link to="/customers" style={{ color: 'var(--hv-text-link)' }}><i className="ti ti-arrow-left"></i></Link>
        <h2 className="text-h2">{customer.name}</h2>
      </div>

      {/* KPI Cards */}
      {analytics?.stats && (
        <div className="hv-grid-4" style={{ marginBottom: 'var(--hv-space-4)' }}>
          <div className="hv-kpi">
            <div className="hv-kpi-icon hv-kpi-icon-blue"><i className="ti ti-receipt"></i></div>
            <div className="hv-kpi-label">Tổng hóa đơn</div>
            <div className="hv-kpi-value">{analytics.stats.totalInvoices}</div>
          </div>
          <div className="hv-kpi">
            <div className="hv-kpi-icon hv-kpi-icon-green"><i className="ti ti-chart-line"></i></div>
            <div className="hv-kpi-label">Tổng doanh thu</div>
            <div className="hv-kpi-value">{fmt(analytics.stats.totalRevenue)}</div>
          </div>
          <div className="hv-kpi">
            <div className="hv-kpi-icon hv-kpi-icon-purple"><i className="ti ti-calculator"></i></div>
            <div className="hv-kpi-label">Giá trị TB</div>
            <div className="hv-kpi-value">{fmt(analytics.stats.avgOrderValue)}</div>
          </div>
          <div className="hv-kpi">
            <div className="hv-kpi-icon hv-kpi-icon-orange"><i className="ti ti-calendar"></i></div>
            <div className="hv-kpi-label">Giao dịch gần nhất</div>
            <div className="hv-kpi-value" style={{ fontSize: 14 }}>{analytics.stats.lastInvoice ? new Date(analytics.stats.lastInvoice).toLocaleDateString('vi-VN') : 'N/A'}</div>
          </div>
        </div>
      )}

      <div className="hv-grid-2" style={{ marginBottom: 'var(--hv-space-4)' }}>
        {/* Customer Info */}
        <div className="hv-card">
          <div className="hv-card-header"><div className="hv-card-title">Thông tin khách hàng</div></div>
          <div style={{ display: 'grid', gap: 'var(--hv-space-2)' }}>
            <div><span className="text-caption">Tên:</span> <strong>{customer.name}</strong></div>
            <div><span className="text-caption">MST:</span> <span className="text-mono">{customer.mst || '-'}</span></div>
            <div><span className="text-caption">Địa chỉ:</span> {customer.address || '-'}</div>
            <div><span className="text-caption">Email:</span> {customer.email || '-'}</div>
            <div><span className="text-caption">Điện thoại:</span> {customer.phone || '-'}</div>
          </div>
        </div>

        {/* Channel Breakdown */}
        {analytics?.channels?.length > 0 && (
          <div className="hv-card">
            <div className="hv-card-header"><div className="hv-card-title">Theo kênh</div></div>
            <div className="hv-table-scroll">
              <table className="hv-table">
                <thead><tr><th>Kênh</th><th className="hv-text-right">HĐ</th><th className="hv-text-right">Tổng</th></tr></thead>
                <tbody>
                  {analytics.channels.map((ch: any, i: number) => (
                    <tr key={i}>
                      <td className="text-body-strong">{ch.channel?.toUpperCase()}</td>
                      <td className="hv-text-right">{ch.count}</td>
                      <td className="hv-text-right">{fmt(ch.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recent Invoices */}
      {invoices.length > 0 && (
        <div className="hv-card">
          <div className="hv-card-header"><div className="hv-card-title">Hóa đơn gần đây</div></div>
          <div className="hv-table-scroll">
            <table className="hv-table">
              <thead><tr><th>Số HĐ</th><th>Trạng thái</th><th className="hv-text-right">Tổng tiền</th><th className="hv-text-right">Ngày</th></tr></thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv.id}>
                    <td><Link to={`/invoices/${inv.id}`} className="text-mono" style={{ color: 'var(--hv-text-link)' }}>{inv.haravanId}</Link></td>
                    <td><span className={`hv-badge ${sv[inv.status] || 'hv-badge-neutral'}`}><i className="ti ti-circle-filled"></i> {STATUS_LABELS[inv.status]}</span></td>
                    <td className="hv-text-right text-body-strong">{fmt(inv.total)}</td>
                    <td className="hv-text-right text-caption">{inv.issueDate ? new Date(inv.issueDate).toLocaleDateString('vi-VN') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
```

## Verification
```bash
cd /Volumes/Data/Invoice
pnpm --filter @haravan/api test
pnpm --filter @haravan/portal typecheck
```
