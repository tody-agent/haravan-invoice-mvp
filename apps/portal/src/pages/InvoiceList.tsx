import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { STATUS_LABELS } from '@haravan/shared';
import type { InvoiceStatus } from '@haravan/shared';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const STATUS_OPTIONS: InvoiceStatus[] = ['draft', 'pending', 'issued', 'cqt_accepted', 'cqt_rejected', 'adjusted', 'replaced'];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export default function InvoiceList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || '';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (search) params.set('buyerName', search);
    params.set('page', String(page));
    params.set('pageSize', '20');

    setLoading(true);
    fetch(`${API_URL}/v1/invoices?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setInvoices(json.data.items || []);
          setTotal(json.data.total || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, status, dateFrom, dateTo, search]);

  const totalPages = Math.ceil(total / 20);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value); else newParams.delete(key);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--hv-space-4)' }}>
        <h2 className="text-h2">Danh sách hóa đơn</h2>
        <Link to="/invoices/new" className="hv-btn hv-btn-primary">
          <i className="ti ti-plus" aria-hidden="true"></i>
          Phát hành mới
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="hv-filter-bar" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-filter-search">
          <input type="text" className="hv-input" placeholder="Tìm kiếm..." aria-label="Tìm kiếm"
            value={search} onChange={e => updateFilter('search', e.target.value)} />
          <i className="ti ti-search" aria-hidden="true"></i>
        </div>
        <div className="hv-filter-group">
          <span className="hv-filter-label">Trạng thái:</span>
          <select className="hv-select" value={status} onChange={e => updateFilter('status', e.target.value)} aria-label="Trạng thái">
            <option value="">Tất cả</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div className="hv-filter-divider"></div>
        <div className="hv-filter-group">
          <span className="hv-filter-label">Từ:</span>
          <input type="date" className="hv-input" value={dateFrom} onChange={e => updateFilter('dateFrom', e.target.value)} style={{ width: 'auto' }} />
        </div>
        <div className="hv-filter-group">
          <span className="hv-filter-label">Đến:</span>
          <input type="date" className="hv-input" value={dateTo} onChange={e => updateFilter('dateTo', e.target.value)} style={{ width: 'auto' }} />
        </div>
      </div>

      {/* Table */}
      <div className="hv-card">
        {loading ? (
          <div>
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="hv-skeleton hv-skeleton-row" style={{ marginBottom: 4 }}></div>)}
          </div>
        ) : invoices.length === 0 ? (
          <div className="hv-empty-state" style={{ display: 'flex' }}>
            <i className="ti ti-receipt hv-empty-state-icon" aria-hidden="true"></i>
            <div className="hv-empty-state-title">Không tìm thấy hóa đơn</div>
            <div className="hv-empty-state-desc">Thử thay đổi bộ lọc hoặc phát hành hóa đơn mới.</div>
          </div>
        ) : (
          <>
            <div className="hv-table-scroll">
              <table className="hv-table" aria-label="Danh sách hóa đơn">
                <thead>
                  <tr>
                    <th scope="col">Số HĐ</th>
                    <th scope="col">Khách hàng</th>
                    <th scope="col">MST</th>
                    <th scope="col" className="hv-text-right">Tổng tiền</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col" className="hv-text-right">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} onClick={() => window.location.href = `/invoices/${inv.id}`}>
                      <td>
                        <Link to={`/invoices/${inv.id}`} className="text-mono" style={{ color: 'var(--hv-text-link)' }}>
                          {inv.haravanId}
                        </Link>
                      </td>
                      <td className="hv-td-name">{inv.buyer?.name || inv.buyerName}</td>
                      <td><span className="text-caption">{inv.buyer?.mst || inv.buyerMst || '-'}</span></td>
                      <td className="hv-text-right text-body-strong">{formatCurrency(inv.totals?.total || inv.total || 0)}</td>
                      <td><StatusBadge status={inv.status} /></td>
                      <td className="hv-text-right text-caption">{formatDate(inv.issueDate || inv.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ padding: 'var(--hv-space-3) var(--hv-space-4)', display: 'flex', justifyContent: 'center', gap: 'var(--hv-space-1)' }}>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('page', String(p));
                    setSearchParams(newParams);
                  }}
                    className={`hv-btn hv-btn-sm ${p === page ? 'hv-btn-primary' : 'hv-btn-tertiary'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}

            <div className="text-caption" style={{ padding: 'var(--hv-space-2) var(--hv-space-4)' }}>
              Hiển thị {invoices.length} / {total} hóa đơn
            </div>
          </>
        )}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    draft: 'hv-badge-neutral',
    pending: 'hv-badge-warning',
    issued: 'hv-badge-info',
    cqt_accepted: 'hv-badge-success',
    cqt_rejected: 'hv-badge-danger',
    adjusted: 'hv-badge-purple',
    replaced: 'hv-badge-warning',
  };
  return (
    <span className={`hv-badge ${variants[status] || 'hv-badge-neutral'}`}>
      <i className="ti ti-circle-filled" aria-hidden="true"></i>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
