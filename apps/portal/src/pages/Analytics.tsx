import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STATUS_LABELS } from '@haravan/shared';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function Analytics() {
  const [channels, setChannels] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [topSkus, setTopSkus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/v1/analytics/channels?days=${period}`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/v1/analytics/top-customers?days=${period}`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/v1/analytics/top-skus?days=${period}`, { headers }).then(r => r.json()),
    ])
      .then(([ch, cust, sku]) => {
        if (ch.success) setChannels(ch.data || []);
        if (cust.success) setTopCustomers(cust.data || []);
        if (sku.success) setTopSkus(sku.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  const totalRevenue = channels.reduce((s, c) => s + (c.total || 0), 0);
  const totalCount = channels.reduce((s, c) => s + (c.count || 0), 0);

  const channelColors: Record<string, string> = {
    admin: '#2962ff', pos: '#16a34a', web: '#0ea5e9', 'pos-aggregate': '#f59e0b',
  };

  return (
    <>
      <h2 className="text-h2" style={{ marginBottom: 'var(--hv-space-4)' }}>Phân tích</h2>

      {/* Period tabs */}
      <div className="hv-period-tabs" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-tabs">
          {['7', '30', '90'].map(d => (
            <button key={d} className={`hv-tab${period === d ? ' hv-tab-active' : ''}`} onClick={() => setPeriod(d)}>{d} ngày</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="hv-grid-4" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-kpi">
          <div className="hv-kpi-icon hv-kpi-icon-blue"><i className="ti ti-chart-line"></i></div>
          <div className="hv-kpi-label">Tổng doanh thu</div>
          <div className="hv-kpi-value">{fmt(totalRevenue)}</div>
        </div>
        <div className="hv-kpi">
          <div className="hv-kpi-icon hv-kpi-icon-green"><i className="ti ti-receipt"></i></div>
          <div className="hv-kpi-label">Tổng hóa đơn</div>
          <div className="hv-kpi-value">{totalCount.toLocaleString('vi-VN')}</div>
        </div>
        <div className="hv-kpi">
          <div className="hv-kpi-icon hv-kpi-icon-purple"><i className="ti ti-users"></i></div>
          <div className="hv-kpi-label">Khách hàng</div>
          <div className="hv-kpi-value">{topCustomers.length}</div>
        </div>
        <div className="hv-kpi">
          <div className="hv-kpi-icon hv-kpi-icon-orange"><i className="ti ti-package"></i></div>
          <div className="hv-kpi-label">Sản phẩm</div>
          <div className="hv-kpi-value">{topSkus.length}</div>
        </div>
      </div>

      {/* Channel Distribution */}
      <div className="hv-charts-row" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card hv-chart-card">
          <div className="hv-card-header">
            <div className="hv-card-title">Theo kênh bán hàng</div>
            <span className="text-caption">{period} ngày</span>
          </div>
          <div className="hv-pie-layout">
            <div className="hv-chart-wrapper" style={{ width: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 160, height: 160 }}>
                <svg viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  {(() => {
                    let offset = 0;
                    return channels.map((ch, i) => {
                      const pct = totalRevenue > 0 ? ch.total / totalRevenue : 0;
                      const dasharray = `${pct * 502.65} 502.65`;
                      const el = <circle key={i} cx="80" cy="80" r="80" fill="none"
                        stroke={channelColors[ch.channel] || '#8a93a4'} strokeWidth="24"
                        strokeDasharray={dasharray} strokeDashoffset={-offset} />;
                      offset += pct * 502.65;
                      return el;
                    });
                  })()}
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>{totalCount}</span>
                  <span className="text-caption">HĐ</span>
                </div>
              </div>
            </div>
            <div className="hv-pie-legend">
              {channels.map((ch, i) => (
                <div key={i} className="hv-pie-legend-item">
                  <div className="hv-pie-legend-dot" style={{ background: channelColors[ch.channel] || '#8a93a4' }}></div>
                  <span className="hv-pie-legend-label">{ch.channel === 'pos-aggregate' ? 'POS (gộp)' : ch.channel?.toUpperCase()}</span>
                  <span className="hv-pie-legend-value">{totalRevenue > 0 ? ((ch.total / totalRevenue) * 100).toFixed(0) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="hv-card">
          <div className="hv-card-header">
            <div className="hv-card-title">Top khách hàng</div>
            <Link to="/customers" className="hv-btn hv-btn-sm hv-btn-tertiary">Xem tất cả</Link>
          </div>
          <div className="hv-table-scroll" style={{ maxHeight: 300, overflowY: 'auto' }}>
            <table className="hv-table">
              <thead><tr><th style={{ width: 40 }}>#</th><th>Khách hàng</th><th>MST</th><th className="hv-text-right">HĐ</th><th className="hv-text-right">Tổng</th></tr></thead>
              <tbody>
                {loading ? [1,2,3,4,5].map(i => <tr key={i}><td colSpan={5}><div className="hv-skeleton hv-skeleton-row"></div></td></tr>) :
                  topCustomers.slice(0, 5).map((c, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td className="text-body-strong">{c.name}</td>
                      <td className="text-mono text-caption">{c.mst || '-'}</td>
                      <td className="hv-text-right">{c.invoiceCount}</td>
                      <td className="hv-text-right">{fmt(c.total)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top SKUs */}
      <div className="hv-card">
        <div className="hv-card-header">
          <div className="hv-card-title">Top 10 sản phẩm</div>
          <Link to="/products" className="hv-btn hv-btn-sm hv-btn-tertiary">Xem tất cả</Link>
        </div>
        <div className="hv-table-scroll">
          <table className="hv-table">
            <thead><tr><th style={{ width: 40 }}>#</th><th>SKU</th><th>Tên sản phẩm</th><th className="hv-text-right">SL</th><th className="hv-text-right">Doanh thu</th></tr></thead>
            <tbody>
              {loading ? [1,2,3,4,5].map(i => <tr key={i}><td colSpan={5}><div className="hv-skeleton hv-skeleton-row"></div></td></tr>) :
                topSkus.map((s, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="text-mono text-caption">{s.sku || '-'}</td>
                    <td className="text-body-strong">{s.name}</td>
                    <td className="hv-text-right">{s.qty}</td>
                    <td className="hv-text-right">{fmt(s.revenue)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
