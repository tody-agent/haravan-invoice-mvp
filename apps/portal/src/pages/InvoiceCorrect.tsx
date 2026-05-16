import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STATUS_LABELS, TAX_RATES } from '@haravan/shared';

const API_URL = import.meta.env.VITE_API_URL || '/api';

type CorrectionType = 'replace' | 'adjust_increase' | 'adjust_decrease';
type Step = 1 | 2 | 3;

export default function InvoiceCorrect() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [original, setOriginal] = useState<any>(null);
  const [step, setStep] = useState<Step>(1);
  const [correctionType, setCorrectionType] = useState<CorrectionType | null>(null);
  const [reason, setReason] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerMst, setBuyerMst] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/v1/invoices/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setOriginal(json.data);
          setBuyerName(json.data.buyer?.name || '');
          setBuyerMst(json.data.buyer?.mst || '');
          const invoiceItems = Array.isArray(json.data.items) ? json.data.items : JSON.parse(json.data.items || '[]');
          setItems(invoiceItems.map((item: any) => ({ ...item })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const token = localStorage.getItem('token');

    try {
      let res;
      if (correctionType === 'replace') {
        res = await fetch(`${API_URL}/v1/invoices/${id}/replace`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            buyer: { name: buyerName, mst: buyerMst },
            items,
            reason,
          }),
        });
      } else {
        res = await fetch(`${API_URL}/v1/invoices/${id}/adjust`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            type: correctionType === 'adjust_increase' ? 'increase' : 'decrease',
            items,
            reason,
          }),
        });
      }

      const json = await res.json();
      if (json.success) {
        navigate(`/invoices/${id}`);
      } else {
        setError(json.error?.message || 'Lỗi xử lý');
      }
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>;
  if (!original) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy hóa đơn</div>;

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Xử lý sai sót</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Hóa đơn: <strong>{original.haravanId}</strong> · Trạng thái: {STATUS_LABELS[original.status]}
      </p>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: s <= step ? '#1a73e8' : '#e0e0e0',
          }} />
        ))}
      </div>

      {/* Step 1: Chọn loại */}
      {step === 1 && (
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Bước 1: Chọn loại xử lý</h3>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
            Theo NĐ 70/2025, không được phép hủy hóa đơn. Chỉ có thể điều chỉnh hoặc thay thế.
          </p>

          <div style={{ display: 'grid', gap: 12 }}>
            <OptionCard
              selected={correctionType === 'replace'}
              onClick={() => setCorrectionType('replace')}
              title="Thay thế hóa đơn"
              desc="Phát hành hóa đơn mới thay thế hóa đơn này (biên bản thu hồi)"
              icon="🔄"
            />
            <OptionCard
              selected={correctionType === 'adjust_increase'}
              onClick={() => setCorrectionType('adjust_increase')}
              title="Điều chỉnh tăng"
              desc="Bổ sung thêm hàng hóa hoặc tăng giá trị"
              icon="📈"
            />
            <OptionCard
              selected={correctionType === 'adjust_decrease'}
              onClick={() => setCorrectionType('adjust_decrease')}
              title="Điều chỉnh giảm"
              desc="Giảm số lượng hoặc giảm giá trị"
              icon="📉"
            />
          </div>

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setStep(2)}
              disabled={!correctionType}
              style={{
                padding: '10px 24px',
                background: correctionType ? '#1a73e8' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: correctionType ? 'pointer' : 'not-allowed',
                fontWeight: 600,
              }}
            >
              Tiếp theo →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Nhập thông tin */}
      {step === 2 && (
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Bước 2: Nhập thông tin</h3>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Lý do *</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Nhập lý do xử lý sai sót..."
              required
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
            />
          </div>

          {correctionType === 'replace' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Tên người mua mới</label>
                <input value={buyerName} onChange={e => setBuyerName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>MST mới</label>
                <input value={buyerMst} onChange={e => setBuyerMst(e.target.value)} style={inputStyle} />
              </div>
            </div>
          )}

          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Hàng hóa</h4>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
              <input value={item.name} onChange={e => {
                const newItems = [...items];
                newItems[i] = { ...newItems[i], name: e.target.value };
                setItems(newItems);
              }} style={inputStyle} placeholder="Tên" />
              <input type="number" value={item.quantity} onChange={e => {
                const newItems = [...items];
                newItems[i] = { ...newItems[i], quantity: Number(e.target.value) };
                setItems(newItems);
              }} style={inputStyle} placeholder="SL" min={1} />
              <input type="number" value={item.unitPrice} onChange={e => {
                const newItems = [...items];
                newItems[i] = { ...newItems[i], unitPrice: Number(e.target.value) };
                setItems(newItems);
              }} style={inputStyle} placeholder="Đơn giá" min={0} />
              <select value={item.taxRate} onChange={e => {
                const newItems = [...items];
                newItems[i] = { ...newItems[i], taxRate: Number(e.target.value) };
                setItems(newItems);
              }} style={inputStyle}>
                {TAX_RATES.map(r => <option key={r} value={r}>{(r * 100).toFixed(0)}%</option>)}
              </select>
            </div>
          ))}

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} style={backBtnStyle}>← Quay lại</button>
            <button onClick={() => setStep(3)} disabled={!reason} style={{
              padding: '10px 24px', background: reason ? '#1a73e8' : '#ccc', color: 'white',
              border: 'none', borderRadius: 6, cursor: reason ? 'pointer' : 'not-allowed', fontWeight: 600,
            }}>
              Tiếp theo →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Xác nhận */}
      {step === 3 && (
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Bước 3: Xác nhận</h3>

          <div style={{ background: '#f8f9fa', borderRadius: 6, padding: 16, marginBottom: 20 }}>
            <p><strong>Loại xử lý:</strong> {
              correctionType === 'replace' ? 'Thay thế hóa đơn' :
              correctionType === 'adjust_increase' ? 'Điều chỉnh tăng' : 'Điều chỉnh giảm'
            }</p>
            <p><strong>Lý do:</strong> {reason}</p>
            <p><strong>Hóa đơn gốc:</strong> {original.haravanId}</p>
          </div>

          <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 6, padding: 16, marginBottom: 20 }}>
            <p style={{ fontSize: 13 }}>
              ⚠️ <strong>Lưu ý:</strong> Theo NĐ 70/2025, hóa đơn đã phát hành không thể hủy.
              {correctionType === 'replace' && ' Hóa đơn gốc sẽ được đánh dấu "Đã thay thế".'}
              {correctionType?.startsWith('adjust') && ' Hóa đơn gốc sẽ được đánh dấu "Đã điều chỉnh".'}
            </p>
          </div>

          {error && (
            <div style={{ background: '#fee', color: '#c00', padding: '12px', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(2)} style={backBtnStyle}>← Quay lại</button>
            <button onClick={handleSubmit} disabled={submitting} style={{
              padding: '12px 32px', background: submitting ? '#ccc' : '#dc2626', color: 'white',
              border: 'none', borderRadius: 6, cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 15,
            }}>
              {submitting ? 'Đang xử lý...' : 'Xác nhận xử lý'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OptionCard({ selected, onClick, title, desc, icon }: {
  selected: boolean; onClick: () => void; title: string; desc: string; icon: string;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 16,
        border: `2px solid ${selected ? '#1a73e8' : '#e0e0e0'}`,
        borderRadius: 8,
        cursor: 'pointer',
        background: selected ? '#f0f7ff' : 'white',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div>
        <p style={{ fontWeight: 600 }}>{title}</p>
        <p style={{ fontSize: 13, color: '#666' }}>{desc}</p>
      </div>
      <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? '#1a73e8' : '#ddd'}`, background: selected ? '#1a73e8' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: 8,
  padding: 24,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const sectionTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 4,
  color: '#333',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: 6,
  fontSize: 13,
};

const backBtnStyle: React.CSSProperties = {
  padding: '10px 24px',
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 14,
};
