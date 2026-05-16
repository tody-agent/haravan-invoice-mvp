import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { STATUS_LABELS, amountToWords } from '@haravan/shared';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_URL}/v1/invoices/${id}`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/v1/invoices/${id}/audit`, { headers }).then(r => r.json()),
    ])
      .then(([invRes, auditRes]) => {
        if (invRes.success) setInvoice(invRes.data);
        if (auditRes.success) setAuditLogs(auditRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadPDF = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/v1/invoices/${id}/pdf`, { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `invoice-${invoice.haravanId}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (<div>
      <div className="hv-skeleton hv-skeleton-value" style={{ width: 200, marginBottom: 16 }}></div>
      <div className="hv-grid-2" style={{ marginBottom: 16 }}>
        <div className="hv-card"><div className="hv-skeleton hv-skeleton-row"></div></div>
        <div className="hv-card"><div className="hv-skeleton hv-skeleton-row"></div></div>
      </div>
      <div className="hv-card"><div className="hv-skeleton hv-skeleton-chart"></div></div>
    </div>);
  }

  if (!invoice) {
    return (
      <div className="hv-empty-state" style={{ display: 'flex' }}>
        <i className="ti ti-file-off hv-empty-state-icon"></i>
        <div className="hv-empty-state-title">Không tìm thấy hóa đơn</div>
        <Link to="/invoices" className="hv-btn hv-btn-primary" style={{ marginTop: 'var(--hv-space-4)' }}>Quay lại danh sách</Link>
      </div>
    );
  }

  const items = Array.isArray(invoice.items) ? invoice.items : JSON.parse(invoice.items || '[]');
  const sv: Record<string, string> = {
    draft: 'hv-badge-neutral', pending: 'hv-badge-warning', issued: 'hv-badge-info',
    cqt_accepted: 'hv-badge-success', cqt_rejected: 'hv-badge-danger',
    adjusted: 'hv-badge-purple', replaced: 'hv-badge-warning',
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--hv-space-4)' }}>
        <div>
          <Link to="/invoices" style={{ fontSize: 13, color: 'var(--hv-text-link)', textDecoration: 'none' }}>
            <i className="ti ti-arrow-left"></i> Danh sách
          </Link>
          <h2 className="text-h2" style={{ marginTop: 'var(--hv-space-1)' }}>
            <span className="text-mono">{invoice.haravanId}</span>
            <span className={`hv-badge ${sv[invoice.status] || 'hv-badge-neutral'}`} style={{ marginLeft: 12 }}>
              <i className="ti ti-circle-filled"></i> {STATUS_LABELS[invoice.status]}
            </span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 'var(--hv-space-2)' }}>
          <button className="hv-btn hv-btn-tertiary" onClick={handleDownloadPDF}>
            <i className="ti ti-download"></i> Tải PDF
          </button>
          {invoice.status !== 'replaced' && (
            <button className="hv-btn hv-btn-warning" onClick={() => navigate(`/invoices/${id}/correct`)}>
              <i className="ti ti-edit"></i> Xử lý sai sót
            </button>
          )}
        </div>
      </div>

      <div className="hv-grid-2" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card">
          <div className="hv-card-header"><div className="hv-card-title">Người bán</div></div>
          <p className="text-body-strong">{invoice.seller?.name}</p>
          <p className="text-caption">MST: {invoice.seller?.mst}</p>
          <p className="text-caption">{invoice.seller?.address}</p>
        </div>
        <div className="hv-card">
          <div className="hv-card-header"><div className="hv-card-title">Người mua</div></div>
          <p className="text-body-strong">{invoice.buyer?.name}</p>
          <p className="text-caption">MST: {invoice.buyer?.mst || '-'}</p>
          <p className="text-caption">{invoice.buyer?.address}</p>
        </div>
      </div>

      <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card-header"><div className="hv-card-title">Chi tiết hàng hóa</div></div>
        <div className="hv-table-scroll">
          <table className="hv-table">
            <thead><tr>
              <th scope="col" style={{ width: 40 }}>STT</th>
              <th scope="col">Tên</th>
              <th scope="col" className="hv-text-center">SL</th>
              <th scope="col" className="hv-text-right">Đơn giá</th>
              <th scope="col" className="hv-text-center">Thuế</th>
              <th scope="col" className="hv-text-right">Thành tiền</th>
            </tr></thead>
            <tbody>
              {items.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="hv-text-center">{i + 1}</td>
                  <td>{item.name}</td>
                  <td className="hv-text-center">{item.quantity}</td>
                  <td className="hv-text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="hv-text-center">{(item.taxRate * 100).toFixed(0)}%</td>
                  <td className="hv-text-right text-body-strong">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: 'var(--hv-space-4)', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--hv-space-2)' }}>
              <span className="text-caption">Tạm tính:</span><span>{formatCurrency(invoice.totals?.subtotal || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--hv-space-2)' }}>
              <span className="text-caption">Thuế GTGT:</span><span>{formatCurrency(invoice.totals?.taxAmount || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--hv-space-2)', borderTop: '1px solid var(--hv-border)', fontWeight: 700, fontSize: 16 }}>
              <span>Tổng cộng:</span><span style={{ color: 'var(--hv-primary)' }}>{formatCurrency(invoice.totals?.total || 0)}</span>
            </div>
            <p className="text-caption" style={{ marginTop: 'var(--hv-space-2)', fontStyle: 'italic' }}>
              Bằng chữ: {amountToWords(invoice.totals?.total || 0)}
            </p>
          </div>
        </div>
      </div>

      {auditLogs.length > 0 && (
        <div className="hv-card">
          <div className="hv-card-header"><div className="hv-card-title">Nhật ký hoạt động</div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--hv-space-3)' }}>
            {auditLogs.map((log: any) => (
              <div key={log.id} style={{ display: 'flex', gap: 'var(--hv-space-3)', alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--hv-primary)', marginTop: 6, flexShrink: 0 }}></div>
                <div>
                  <p className="text-body-strong">{log.action}</p>
                  <p className="text-caption">{log.actor} · {new Date(log.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
