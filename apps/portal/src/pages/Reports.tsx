import { Link } from 'react-router-dom';

const reports = [
  { path: '/reports/sales', title: 'Chi tiết bán hàng', desc: 'Báo cáo doanh thu theo ngày', icon: 'ti ti-chart-bar', color: 'var(--hv-primary)' },
  { path: '/reports/ledger', title: 'Bảng kê hóa đơn', desc: 'Bảng kê chi tiết cho kế toán', icon: 'ti ti-list', color: 'var(--hv-success)' },
  { path: '/reports/quarterly', title: 'Báo cáo quý', desc: 'Tổng hợp theo quý', icon: 'ti ti-calendar', color: 'var(--hv-purple)' },
  { path: '/reports/replaced', title: 'Hóa đơn thay thế', desc: 'DS hóa đơn đã thay thế', icon: 'ti ti-refresh', color: 'var(--hv-warning)' },
  { path: '/reports/modified', title: 'Hóa đơn điều chỉnh', desc: 'DS hóa đơn đã điều chỉnh', icon: 'ti ti-edit', color: 'var(--hv-info)' },
  { path: '/reports/deleted', title: 'Hóa đơn xóa bỏ', desc: 'Theo NĐ 70/2025', icon: 'ti ti-trash', color: 'var(--hv-danger)' },
];

export default function Reports() {
  return (
    <>
      <h2 className="text-h2" style={{ marginBottom: 'var(--hv-space-4)' }}>Báo cáo</h2>
      <div className="hv-grid-3">
        {reports.map(r => (
          <Link key={r.path} to={r.path} className="hv-card" style={{ textDecoration: 'none', cursor: 'pointer', transition: 'box-shadow 150ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-2)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--hv-radius-md)', background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={r.icon} style={{ fontSize: 20, color: r.color }}></i>
              </div>
              <div className="text-h3">{r.title}</div>
            </div>
            <p className="text-caption">{r.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
