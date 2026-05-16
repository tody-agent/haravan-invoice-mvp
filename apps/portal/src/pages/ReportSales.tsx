import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export default function ReportSales() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`${API_URL}/v1/reports/sales?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => { if (json.success) setData(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dateFrom, dateTo]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-4)' }}>
        <Link to="/reports" style={{ color: 'var(--hv-text-link)' }}><i className="ti ti-arrow-left"></i></Link>
        <h2 className="text-h2">Chi tiết bán hàng</h2>
      </div>

      <div className="hv-filter-bar" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-filter-group">
          <span className="hv-filter-label">Từ:</span>
          <input type="date" className="hv-input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>
        <div className="hv-filter-group">
          <span className="hv-filter-label">Đến:</span>
          <input type="date" className="hv-input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
      </div>

      <div className="hv-card">
        {loading ? (
          <div>{[1,2,3,4,5].map(i => <div key={i} className="hv-skeleton hv-skeleton-row" style={{ marginBottom: 4 }}></div>)}</div>
        ) : (data?.days || []).length === 0 ? (
          <div className="hv-empty-state" style={{ display: 'flex' }}>
            <i className="ti ti-chart-bar hv-empty-state-icon" aria-hidden="true"></i>
            <div className="hv-empty-state-title">Không có dữ liệu</div>
            <div className="hv-empty-state-desc">Thử thay đổi khoảng thời gian.</div>
          </div>
        ) : (
          <div className="hv-table-scroll">
            <table className="hv-table">
              <thead><tr>
                <th>Ngày</th>
                <th className="hv-text-right">Số HĐ</th>
                <th className="hv-text-right">Tạm tính</th>
                <th className="hv-text-right">Thuế</th>
                <th className="hv-text-right">Tổng cộng</th>
              </tr></thead>
              <tbody>
                {(data?.days || []).map((d: any, i: number) => (
                  <tr key={i}>
                    <td>{new Date(d.date).toLocaleDateString('vi-VN')}</td>
                    <td className="hv-text-right">{d.count}</td>
                    <td className="hv-text-right">{formatCurrency(d.subtotal)}</td>
                    <td className="hv-text-right">{formatCurrency(d.tax)}</td>
                    <td className="hv-text-right text-body-strong">{formatCurrency(d.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data?.summary && (
          <div style={{ padding: 'var(--hv-space-4)', borderTop: '1px solid var(--hv-border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--hv-space-5)' }}>
            <div><span className="text-caption">Tổng HĐ:</span> <strong>{data.summary.count}</strong></div>
            <div><span className="text-caption">Tổng tiền:</span> <strong style={{ color: 'var(--hv-primary)' }}>{formatCurrency(data.summary.total)}</strong></div>
          </div>
        )}
      </div>
    </>
  );
}
