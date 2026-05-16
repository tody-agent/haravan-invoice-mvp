import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export default function ReportModified() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(() => new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10));
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`${API_URL}/v1/reports/modified?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => { if (json.success) setData(json.data?.items || json.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dateFrom, dateTo]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-4)' }}>
        <Link to="/reports" style={{ color: 'var(--hv-text-link)' }}><i className="ti ti-arrow-left"></i></Link>
        <h2 className="text-h2">Hóa đơn điều chỉnh</h2>
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
        ) : data.length === 0 ? (
          <div className="hv-empty-state" style={{ display: 'flex' }}>
            <i className="ti ti-edit hv-empty-state-icon" aria-hidden="true"></i>
            <div className="hv-empty-state-title">Không có hóa đơn điều chỉnh</div>
            <div className="hv-empty-state-desc">Thử thay đổi khoảng thời gian.</div>
          </div>
        ) : (
          <div className="hv-table-scroll">
            <table className="hv-table">
              <thead><tr>
                <th>Số HĐ gốc</th>
                <th>Số HĐ điều chỉnh</th>
                <th>Ngày điều chỉnh</th>
                <th>Khách hàng</th>
                <th className="hv-text-right">Tổng tiền</th>
                <th>Nội dung</th>
              </tr></thead>
              <tbody>
                {data.map((item: any, i: number) => (
                  <tr key={item.id || i}>
                    <td><span className="text-mono" style={{ color: 'var(--hv-text-link)' }}>{item.originalInvoiceNo || item.haravanId}</span></td>
                    <td><span className="text-mono">{item.adjustedInvoiceNo || item.adjustedHaravanId || '-'}</span></td>
                    <td>{formatDate(item.adjustedDate || item.updatedAt)}</td>
                    <td>{item.buyerName || item.buyer?.name}</td>
                    <td className="hv-text-right text-body-strong">{formatCurrency(item.total || item.totals?.total || 0)}</td>
                    <td><span className="text-caption">{item.adjustmentContent || item.reason || '-'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data.length > 0 && (
          <div style={{ padding: 'var(--hv-space-3) var(--hv-space-4)', borderTop: '1px solid var(--hv-border)' }}>
            <span className="text-caption">Tổng: {data.length} hóa đơn điều chỉnh</span>
          </div>
        )}
      </div>
    </>
  );
}
