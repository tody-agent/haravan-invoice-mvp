import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validateMST, TAX_RATES } from '@haravan/shared';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface LineItem { name: string; quantity: number; unitPrice: number; taxRate: number; total: number; }

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export default function InvoiceCreate() {
  const navigate = useNavigate();
  const [buyerName, setBuyerName] = useState('');
  const [buyerMst, setBuyerMst] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ name: '', quantity: 1, unitPrice: 0, taxRate: 0.1, total: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice * (1 + newItems[index].taxRate);
    setItems(newItems);
  };
  const addItem = () => setItems([...items, { name: '', quantity: 1, unitPrice: 0, taxRate: 0.1, total: 0 }]);
  const removeItem = (index: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxAmount = items.reduce((s, i) => s + i.quantity * i.unitPrice * i.taxRate, 0);
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (buyerMst && validateMST(buyerMst)) { setError('Mã số thuế không hợp lệ'); return; }
    if (items.some(i => !i.name || i.unitPrice <= 0)) { setError('Vui lòng điền đầy đủ thông tin hàng hóa'); return; }
    setSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/v1/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ buyer: { name: buyerName, mst: buyerMst, address: buyerAddress, email: buyerEmail }, items, paymentMethod: 'transfer', channel: 'admin' }),
      });
      const json = await res.json();
      if (json.success) navigate(`/invoices/${json.data.id}`); else setError(json.error?.message || 'Lỗi phát hành');
    } catch { setError('Không thể kết nối server'); } finally { setSubmitting(false); }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-4)' }}>
        <Link to="/invoices" style={{ color: 'var(--hv-text-link)' }}><i className="ti ti-arrow-left"></i></Link>
        <h2 className="text-h2">Phát hành hóa đơn</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
          <div className="hv-card-header"><div className="hv-card-title">Thông tin người mua</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--hv-space-4)' }}>
            <div><label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Tên người mua *</label><input className="hv-input" value={buyerName} onChange={e => setBuyerName(e.target.value)} required style={{ width: '100%' }} placeholder="Công ty ABC" /></div>
            <div><label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Mã số thuế</label><input className="hv-input" value={buyerMst} onChange={e => setBuyerMst(e.target.value)} style={{ width: '100%' }} placeholder="0123456789" /></div>
            <div><label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Địa chỉ</label><input className="hv-input" value={buyerAddress} onChange={e => setBuyerAddress(e.target.value)} style={{ width: '100%' }} placeholder="123 Nguyễn Huệ, Q1" /></div>
            <div><label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Email</label><input className="hv-input" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} type="email" style={{ width: '100%' }} placeholder="email@example.com" /></div>
          </div>
        </div>

        <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
          <div className="hv-card-header"><div className="hv-card-title">Hàng hóa</div></div>
          <div className="hv-table-scroll">
            <table className="hv-table">
              <thead><tr><th>Tên *</th><th style={{ width: 80 }}>SL</th><th style={{ width: 120 }}>Đơn giá</th><th style={{ width: 100 }}>Thuế</th><th style={{ width: 120 }} className="hv-text-right">Thành tiền</th><th style={{ width: 40 }}></th></tr></thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td><input className="hv-input" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} placeholder="Sản phẩm" required style={{ width: '100%' }} /></td>
                    <td><input className="hv-input" type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} min={1} required style={{ width: '100%' }} /></td>
                    <td><input className="hv-input" type="number" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', Number(e.target.value))} min={0} required style={{ width: '100%' }} /></td>
                    <td><select className="hv-select" value={item.taxRate} onChange={e => updateItem(i, 'taxRate', Number(e.target.value))} style={{ width: '100%' }}>{TAX_RATES.map(r => <option key={r} value={r}>{(r * 100).toFixed(0)}%</option>)}</select></td>
                    <td className="hv-text-right text-body-strong">{formatCurrency(item.total)}</td>
                    <td><button type="button" className="hv-btn hv-btn-sm hv-btn-tertiary" onClick={() => removeItem(i)} aria-label="Xóa"><i className="ti ti-x"></i></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: 'var(--hv-space-3)' }}>
            <button type="button" className="hv-btn hv-btn-tertiary hv-btn-sm" onClick={addItem}><i className="ti ti-plus"></i> Thêm hàng hóa</button>
          </div>
          <div style={{ padding: 'var(--hv-space-4)', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--hv-border)' }}>
            <div style={{ width: 280 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--hv-space-2)' }}><span className="text-caption">Tạm tính:</span><span>{formatCurrency(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--hv-space-2)' }}><span className="text-caption">Thuế:</span><span>{formatCurrency(taxAmount)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--hv-space-2)', borderTop: '1px solid var(--hv-border)', fontWeight: 700, fontSize: 16 }}><span>Tổng:</span><span style={{ color: 'var(--hv-primary)' }}>{formatCurrency(total)}</span></div>
            </div>
          </div>
        </div>

        {error && <div className="hv-alert hv-alert-danger" style={{ marginBottom: 'var(--hv-space-4)' }}><i className="ti ti-alert-circle"></i><span>{error}</span></div>}

        <div style={{ display: 'flex', gap: 'var(--hv-space-2)' }}>
          <button type="submit" className="hv-btn hv-btn-primary" disabled={submitting}>{submitting ? <><i className="ti ti-loader-2"></i> Đang phát hành...</> : <><i className="ti ti-check"></i> Phát hành hóa đơn</>}</button>
          <Link to="/invoices" className="hv-btn hv-btn-tertiary">Hủy</Link>
        </div>
      </form>
    </>
  );
}
