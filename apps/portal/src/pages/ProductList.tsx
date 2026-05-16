import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`${API_URL}/v1/products?search=${search}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success) { setProducts(json.data.items || []); setTotal(json.data.total || 0); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <>
      <h2 className="text-h2" style={{ marginBottom: 'var(--hv-space-4)' }}>Sản phẩm</h2>

      <div className="hv-filter-bar" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-filter-search">
          <input type="text" className="hv-input" placeholder="Tìm sản phẩm..." value={search}
            onChange={e => { const p = new URLSearchParams(searchParams); p.set('search', e.target.value); setSearchParams(p); }} />
          <i className="ti ti-search"></i>
        </div>
      </div>

      <div className="hv-card">
        {loading ? (
          <div>{[1,2,3,4,5].map(i => <div key={i} className="hv-skeleton hv-skeleton-row" style={{ marginBottom: 4 }}></div>)}</div>
        ) : products.length === 0 ? (
          <div className="hv-empty-state" style={{ display: 'flex' }}>
            <i className="ti ti-package hv-empty-state-icon"></i>
            <div className="hv-empty-state-title">Chưa có sản phẩm</div>
            <div className="hv-empty-state-desc">Sản phẩm sẽ được tạo tự động từ hóa đơn.</div>
          </div>
        ) : (
          <div className="hv-table-scroll">
            <table className="hv-table">
              <thead><tr>
                <th>SKU</th>
                <th>Tên sản phẩm</th>
                <th className="hv-text-right">SL bán</th>
                <th className="hv-text-right">Doanh thu</th>
                <th className="hv-text-right">Số HĐ</th>
              </tr></thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td className="text-mono text-caption">{p.sku || '-'}</td>
                    <td className="text-body-strong">{p.name}</td>
                    <td className="hv-text-right">{p.totalQty}</td>
                    <td className="hv-text-right">{fmt(p.totalRevenue)}</td>
                    <td className="hv-text-right">{p.invoiceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="text-caption" style={{ padding: 'var(--hv-space-2) var(--hv-space-4)' }}>{total} sản phẩm</div>
      </div>
    </>
  );
}
