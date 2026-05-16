import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

function getQuarterOptions() {
  const now = new Date();
  const year = now.getFullYear();
  const quarters = [];
  for (let y = year; y >= year - 2; y--) {
    for (let q = 4; q >= 1; q--) {
      if (y === year && q > Math.ceil((now.getMonth() + 1) / 3)) continue;
      quarters.push({ value: `${y}-Q${q}`, label: `Q${q}/${y}` });
    }
  }
  return quarters;
}

export default function ReportQuarterly() {
  const quarters = getQuarterOptions();
  const [quarter, setQuarter] = useState(quarters[0]?.value || '');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quarter) return;
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`${API_URL}/v1/reports/quarterly?quarter=${quarter}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => { if (json.success) setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [quarter]);

  const summaryCards = data?.summary ? [
    { label: 'Tổng hóa đơn', value: data.summary.count, icon: 'ti ti-receipt', color: 'var(--hv-primary)' },
    { label: 'Tổng doanh thu', value: formatCurrency(data.summary.total), icon: 'ti ti-chart-line', color: 'var(--hv-success)' },
    { label: 'Tổng thuế', value: formatCurrency(data.summary.tax), icon: 'ti ti-percentage', color: 'var(--hv-warning)' },
  ] : [];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-4)' }}>
        <Link to="/reports" style={{ color: 'var(--hv-text-link)' }}><i className="ti ti-arrow-left"></i></Link>
        <h2 className="text-h2">Báo cáo quý</h2>
      </div>

      <div className="hv-filter-bar" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-filter-group">
          <span className="hv-filter-label">Quý:</span>
          <select className="hv-select" value={quarter} onChange={e => setQuarter(e.target.value)}>
            {quarters.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="hv-grid-3" style={{ marginBottom: 'var(--hv-space-4)' }}>
          {[1,2,3].map(i => (
            <div key={i} className="hv-card">
              <div className="hv-skeleton hv-skeleton-text" style={{ marginBottom: 12 }}></div>
              <div className="hv-skeleton hv-skeleton-value"></div>
            </div>
          ))}
        </div>
      ) : data?.summary ? (
        <div className="hv-grid-3" style={{ marginBottom: 'var(--hv-space-4)' }}>
          {summaryCards.map((card, i) => (
            <div key={i} className="hv-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-2)', marginBottom: 'var(--hv-space-2)' }}>
                <i className={card.icon} style={{ color: card.color, fontSize: 18 }}></i>
                <span className="text-caption">{card.label}</span>
              </div>
              <div className="text-h2">{card.value}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="hv-card">
        <div className="hv-card-header">
          <div className="hv-card-title">Chi tiết theo tháng</div>
        </div>
        {loading ? (
          <div>{[1,2,3].map(i => <div key={i} className="hv-skeleton hv-skeleton-row" style={{ marginBottom: 4 }}></div>)}</div>
        ) : (data?.months || []).length === 0 ? (
          <div className="hv-empty-state" style={{ display: 'flex' }}>
            <i className="ti ti-calendar hv-empty-state-icon" aria-hidden="true"></i>
            <div className="hv-empty-state-title">Không có dữ liệu</div>
            <div className="hv-empty-state-desc">Chọn quý khác hoặc phát hành hóa đơn.</div>
          </div>
        ) : (
          <div className="hv-table-scroll">
            <table className="hv-table">
              <thead><tr>
                <th>Tháng</th>
                <th className="hv-text-right">Số HĐ</th>
                <th className="hv-text-right">Tạm tính</th>
                <th className="hv-text-right">Thuế</th>
                <th className="hv-text-right">Tổng cộng</th>
              </tr></thead>
              <tbody>
                {(data?.months || []).map((m: any, i: number) => (
                  <tr key={i}>
                    <td>Tháng {m.month}</td>
                    <td className="hv-text-right">{m.count}</td>
                    <td className="hv-text-right">{formatCurrency(m.subtotal)}</td>
                    <td className="hv-text-right">{formatCurrency(m.tax)}</td>
                    <td className="hv-text-right text-body-strong">{formatCurrency(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
