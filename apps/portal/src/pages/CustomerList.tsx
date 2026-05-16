import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function CustomerList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`${API_URL}/v1/customers?search=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => { if (json.success) { setCustomers(json.data.items || []); setTotal(json.data.total || 0); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <>
      <h2 className="text-h2" style={{ marginBottom: 'var(--hv-space-4)' }}>Khách hàng</h2>

      <div className="hv-filter-bar" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-filter-search">
          <input type="text" className="hv-input" placeholder="Tìm khách hàng..." value={search}
            onChange={e => { const p = new URLSearchParams(searchParams); p.set('search', e.target.value); p.set('page', '1'); setSearchParams(p); }} />
          <i className="ti ti-search"></i>
        </div>
      </div>

      <div className="hv-card">
        {loading ? (
          <div>{[1,2,3,4,5].map(i => <div key={i} className="hv-skeleton hv-skeleton-row" style={{ marginBottom: 4 }}></div>)}</div>
        ) : customers.length === 0 ? (
          <div className="hv-empty-state" style={{ display: 'flex' }}>
            <i className="ti ti-users hv-empty-state-icon"></i>
            <div className="hv-empty-state-title">Chưa có khách hàng</div>
          </div>
        ) : (
          <div className="hv-table-scroll">
            <table className="hv-table">
              <thead><tr>
                <th>Tên khách hàng</th>
                <th>MST</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th className="hv-text-right">Ngày tạo</th>
              </tr></thead>
              <tbody>
                {customers.map((c: any) => (
                  <tr key={c.id} onClick={() => window.location.href = `/customers/${c.id}`}>
                    <td><Link to={`/customers/${c.id}`} style={{ color: 'var(--hv-text-link)', fontWeight: 500 }}>{c.name}</Link></td>
                    <td className="text-mono">{c.mst || '-'}</td>
                    <td className="text-caption">{c.email || '-'}</td>
                    <td className="text-caption">{c.phone || '-'}</td>
                    <td className="hv-text-right text-caption">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="text-caption" style={{ padding: 'var(--hv-space-2) var(--hv-space-4)' }}>
          {total} khách hàng
        </div>
      </div>
    </>
  );
}
