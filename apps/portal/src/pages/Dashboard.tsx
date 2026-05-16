import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STATUS_LABELS } from '@haravan/shared';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Summary {
  totalIssued: number;
  totalPending: number;
  totalError: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

function pctChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const pct = ((current - previous) / previous * 100).toFixed(1);
  return Number(pct) >= 0 ? `+${pct}%` : `${pct}%`;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_URL}/v1/reports/summary`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/v1/invoices?pageSize=10`, { headers }).then(r => r.json()),
    ])
      .then(([summaryRes, invoicesRes]) => {
        if (summaryRes.success) setSummary(summaryRes.data);
        if (invoicesRes.success) setRecentInvoices(invoicesRes.data.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = summary ? [
    { label: 'Tổng doanh thu', value: formatCurrency(summary.revenueThisMonth), change: pctChange(summary.revenueThisMonth, summary.revenueLastMonth), up: summary.revenueThisMonth >= summary.revenueLastMonth, icon: 'ti ti-chart-line', iconClass: 'hv-kpi-icon-blue' },
    { label: 'Tổng hóa đơn', value: summary.totalIssued.toLocaleString('vi-VN'), change: null, up: true, icon: 'ti ti-receipt', iconClass: 'hv-kpi-icon-green' },
    { label: 'Tỷ lệ HĐ/ĐH', value: '78.5%', change: '+2.1%', up: true, icon: 'ti ti-percentage', iconClass: 'hv-kpi-icon-purple' },
    { label: 'Tỷ lệ lỗi', value: summary.totalIssued > 0 ? `${(summary.totalError / summary.totalIssued * 100).toFixed(1)}%` : '0%', change: null, up: false, icon: 'ti ti-alert-triangle', iconClass: 'hv-kpi-icon-orange' },
  ] : [];

  const statusVariant: Record<string, string> = {
    draft: 'hv-badge-neutral', pending: 'hv-badge-warning', issued: 'hv-badge-info',
    cqt_accepted: 'hv-badge-success', cqt_rejected: 'hv-badge-danger',
    adjusted: 'hv-badge-purple', replaced: 'hv-badge-warning',
  };

  return (
    <>
      {/* Period Tabs */}
      <div className="hv-period-tabs" role="tablist" aria-label="Chọn thời gian">
        <div className="hv-tabs">
          <button type="button" className="hv-tab" role="tab">Hôm nay <span className="hv-tab-count">42</span></button>
          <button type="button" className="hv-tab" role="tab">7 ngày <span className="hv-tab-count">287</span></button>
          <button type="button" className="hv-tab hv-tab-active" role="tab" aria-selected="true">30 ngày <span className="hv-tab-count">1.284</span></button>
          <button type="button" className="hv-tab" role="tab">90 ngày <span className="hv-tab-count">3.856</span></button>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="hv-grid-4" style={{ marginBottom: 'var(--hv-space-4)' }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="hv-kpi">
              <div className="hv-skeleton hv-skeleton-text" style={{ marginBottom: 12 }}></div>
              <div className="hv-skeleton hv-skeleton-value"></div>
              <div className="hv-skeleton hv-skeleton-change"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="hv-grid-4" style={{ marginBottom: 'var(--hv-space-4)' }}>
          {kpiCards.map((card, i) => (
            <div key={i} className="hv-kpi" role="button" tabIndex={0} aria-label={`${card.label}: ${card.value}`}>
              <div className={`hv-kpi-icon ${card.iconClass}`}><i className={card.icon} aria-hidden="true"></i></div>
              <div className="hv-kpi-label">{card.label}</div>
              <div className="hv-kpi-value">{card.value}</div>
              {card.change && (
                <div className={`hv-kpi-change ${card.up ? 'hv-kpi-change-up' : 'hv-kpi-change-down'}`}>
                  <i className={card.up ? 'ti ti-trending-up' : 'ti ti-trending-down'} aria-hidden="true"></i>
                  <span>{card.change} so với kỳ trước</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Filter Bar */}
      <div className="hv-filter-bar">
        <div className="hv-filter-search">
          <input type="text" className="hv-input" placeholder="Tìm kiếm..." aria-label="Tìm kiếm" />
          <i className="ti ti-search" aria-hidden="true"></i>
        </div>
        <div className="hv-filter-group" role="group" aria-label="Chi nhánh">
          <span className="hv-filter-label">Chi nhánh:</span>
          <select className="hv-select" aria-label="Chọn chi nhánh">
            <option value="">Tất cả</option>
            <option value="cn1">Chi nhánh 1</option>
            <option value="cn2">Chi nhánh 2</option>
          </select>
        </div>
        <div className="hv-filter-group" role="group" aria-label="Kênh bán hàng">
          <span className="hv-filter-label">Kênh:</span>
          <select className="hv-select" aria-label="Chọn kênh bán hàng">
            <option value="">Tất cả</option>
            <option value="pos">POS</option>
            <option value="web">Web</option>
            <option value="shopee">Shopee</option>
            <option value="lazada">Lazada</option>
          </select>
        </div>
        <div className="hv-filter-group" role="group" aria-label="Bộ lọc đang áp dụng">
          <span className="hv-filter-label">Đang lọc:</span>
          <div className="hv-filter-chip">
            30 ngày
            <button type="button" className="hv-filter-chip-close" aria-label="Xóa bộ lọc 30 ngày">×</button>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="hv-charts-row">
        <div className="hv-card hv-chart-card">
          <div className="hv-card-header">
            <div className="hv-card-title">Doanh thu &amp; Hóa đơn</div>
            <span style={{ fontSize: 11, color: 'var(--hv-text-muted)' }}>15/05/2026</span>
          </div>
          <div className="hv-chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
            <div style={{ textAlign: 'center', color: 'var(--hv-text-muted)' }}>
              <i className="ti ti-chart-line" style={{ fontSize: 48, marginBottom: 8 }}></i>
              <p>Biểu đồ sẽ hiển thị khi có dữ liệu</p>
            </div>
          </div>
          <div className="hv-chart-legend">
            <div className="hv-chart-legend-item">
              <div className="hv-chart-legend-dot" style={{ background: '#2962ff' }}></div>
              <span>Doanh thu (triệu đ)</span>
            </div>
            <div className="hv-chart-legend-item">
              <div className="hv-chart-legend-dot" style={{ background: '#16a34a' }}></div>
              <span>Số hóa đơn</span>
            </div>
          </div>
        </div>
        <div className="hv-card hv-chart-card">
          <div className="hv-card-header">
            <div className="hv-card-title">Theo kênh</div>
            <span style={{ fontSize: 11, color: 'var(--hv-text-muted)' }}>30 ngày</span>
          </div>
          <div className="hv-pie-layout">
            <div className="hv-chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 180 }}>
              <div style={{ textAlign: 'center', color: 'var(--hv-text-muted)' }}>
                <i className="ti ti-chart-pie" style={{ fontSize: 48 }}></i>
              </div>
            </div>
            <div className="hv-pie-legend">
              <div className="hv-pie-legend-item"><div className="hv-pie-legend-dot" style={{ background: '#2962ff' }}></div><span className="hv-pie-legend-label">Web</span><span className="hv-pie-legend-value">45%</span></div>
              <div className="hv-pie-legend-item"><div className="hv-pie-legend-dot" style={{ background: '#16a34a' }}></div><span className="hv-pie-legend-label">POS</span><span className="hv-pie-legend-value">30%</span></div>
              <div className="hv-pie-legend-item"><div className="hv-pie-legend-dot" style={{ background: '#f59e0b' }}></div><span className="hv-pie-legend-label">Shopee</span><span className="hv-pie-legend-value">15%</span></div>
              <div className="hv-pie-legend-item"><div className="hv-pie-legend-dot" style={{ background: '#7c3aed' }}></div><span className="hv-pie-legend-label">Lazada</span><span className="hv-pie-legend-value">10%</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="hv-grid-2">
        <div className="hv-card">
          <div className="hv-card-header">
            <div className="hv-card-title">Top 20 khách hàng</div>
            <Link to="/customers" className="hv-btn hv-btn-sm hv-btn-tertiary">Xem tất cả</Link>
          </div>
          <div className="hv-table-scroll">
            <table className="hv-table" aria-label="Top 20 khách hàng theo doanh thu">
              <thead><tr>
                <th scope="col" style={{ width: 40 }}>STT</th>
                <th scope="col">Tên khách hàng</th>
                <th scope="col">MST</th>
                <th scope="col" className="hv-text-right">HĐ</th>
                <th scope="col" className="hv-text-right">Tổng tiền</th>
                <th scope="col">TT</th>
              </tr></thead>
              <tbody>
                {loading ? (
                  [1,2,3,4,5].map(i => <tr key={i}><td colSpan={6}><div className="hv-skeleton hv-skeleton-row"></div></td></tr>)
                ) : recentInvoices.slice(0, 5).map((inv: any, i: number) => (
                  <tr key={inv.id}>
                    <td>{i + 1}</td>
                    <td><div className="customer-cell"><span className="name">{inv.buyer?.name || inv.buyerName}</span></div></td>
                    <td><span className="text-mono text-caption">{inv.buyer?.mst || inv.buyerMst || '-'}</span></td>
                    <td className="hv-text-right">1</td>
                    <td className="hv-text-right text-body-strong">{formatCurrency(inv.totals?.total || inv.total || 0)}</td>
                    <td><span className={`hv-badge ${statusVariant[inv.status] || 'hv-badge-neutral'}`}><i className="ti ti-circle-filled"></i> {STATUS_LABELS[inv.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="hv-card">
          <div className="hv-card-header">
            <div className="hv-card-title">Top 10 SKU</div>
            <Link to="/products" className="hv-btn hv-btn-sm hv-btn-tertiary">Xem tất cả</Link>
          </div>
          <div className="hv-table-scroll">
            <table className="hv-table" aria-label="Top 10 sản phẩm bán chạy">
              <thead><tr>
                <th scope="col" style={{ width: 40 }}>STT</th>
                <th scope="col">SKU</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col" className="hv-text-right">SL</th>
                <th scope="col" className="hv-text-right">Doanh thu</th>
                <th scope="col">Trend</th>
              </tr></thead>
              <tbody>
                {loading ? (
                  [1,2,3,4,5].map(i => <tr key={i}><td colSpan={6}><div className="hv-skeleton hv-skeleton-row"></div></td></tr>)
                ) : (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--hv-text-muted)' }}>Chưa có dữ liệu SKU</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
