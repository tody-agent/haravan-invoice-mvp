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
    fetch(`${API_URL}/v1/aggregate/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success) setSummary(json.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAggregate = async () => {
    setAggregating(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/v1/aggregate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date: new Date().toISOString().slice(0, 10) }),
      });
      const json = await res.json();
      if (json.success) {
        setToast(`Đã gộp ${json.data.originalCount} đơn thành 1 hóa đơn tổng`);
        const summaryRes = await fetch(`${API_URL}/v1/aggregate/summary`, { headers: { Authorization: `Bearer ${token}` } });
        const summaryJson = await summaryRes.json();
        if (summaryJson.success) setSummary(summaryJson.data || []);
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
                    <td><Link to={`/invoices?channel=pos&date=${row.date}`} className="hv-btn hv-btn-sm hv-btn-tertiary">Xem chi tiết</Link></td>
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
