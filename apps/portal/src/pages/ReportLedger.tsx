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

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'issued', label: 'Đã phát hành' },
  { value: 'cqt_accepted', label: 'CQT chấp nhận' },
  { value: 'adjusted', label: 'Điều chỉnh' },
  { value: 'replaced', label: 'Thay thế' },
];

export default function ReportLedger() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ dateFrom, dateTo });
    if (status) params.set('status', status);

    setLoading(true);
    fetch(`${API_URL}/v1/reports/ledger?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => { if (json.success) setData(json.data?.items || json.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dateFrom, dateTo, status]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-4)' }}>
        <Link to="/reports" style={{ color: 'var(--hv-text-link)' }}><i className="ti ti-arrow-left"></i></Link>
        <h2 className="text-h2">Bảng kê hóa đơn</h2>
      </div>

      <div className="hv-filter-bar" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-filter-group">
          <span className="hv-filter-label">Trạng thái:</span>
          <select className="hv-select" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="hv-filter-divider"></div>
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
          <div>{[1,2,3,4,5,6,7,8].map(i => <div key={i} className="hv-skeleton hv-skeleton-row" style={{ marginBottom: 4 }}></div>)}</div>
        ) : data.length === 0 ? (
          <div className="hv-empty-state" style={{ display: 'flex' }}>
            <i className="ti ti-list hv-empty-state-icon" aria-hidden="true"></i>
            <div className="hv-empty-state-title">Không có dữ liệu</div>
            <div className="hv-empty-state-desc">Thử thay đổi bộ lọc hoặc khoảng thời gian.</div>
          </div>
        ) : (
          <div className="hv-table-scroll">
            <table className="hv-table">
              <thead><tr>
                <th>STT</th>
                <th>Số HĐ</th>
                <th>Ngày lập</th>
                <th>Người mua</th>
                <th>MST</th>
                <th className="hv-text-right">Tổng tiền</th>
                <th>Trạng thái</th>
              </tr></thead>
              <tbody>
                {data.map((item: any, i: number) => (
                  <tr key={item.id || i}>
                    <td className="text-caption">{i + 1}</td>
                    <td><span className="text-mono" style={{ color: 'var(--hv-text-link)' }}>{item.haravanId || item.invoiceNo}</span></td>
                    <td>{formatDate(item.issueDate || item.createdAt)}</td>
                    <td>{item.buyerName || item.buyer?.name}</td>
                    <td><span className="text-caption">{item.buyerMst || item.buyer?.mst || '-'}</span></td>
                    <td className="hv-text-right text-body-strong">{formatCurrency(item.total || item.totals?.total || 0)}</td>
                    <td><span className="hv-badge hv-badge-info">{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data.length > 0 && (
          <div style={{ padding: 'var(--hv-space-3) var(--hv-space-4)', borderTop: '1px solid var(--hv-border)' }}>
            <span className="text-caption">Tổng: {data.length} hóa đơn</span>
          </div>
        )}
      </div>
    </>
  );
}
