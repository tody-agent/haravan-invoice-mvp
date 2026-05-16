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
