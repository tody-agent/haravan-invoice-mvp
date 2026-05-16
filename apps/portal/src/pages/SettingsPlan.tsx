import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function SettingsPlan() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/v1/settings/plan`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success) setPlan(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="hv-skeleton hv-skeleton-chart" style={{ height: 300 }}></div>;
  if (!plan) return null;

  const invoicePct = plan.invoiceLimit > 0 ? (plan.invoiceUsed / plan.invoiceLimit * 100) : 0;
  const storagePct = plan.storageLimit > 0 ? (plan.storageUsed / plan.storageLimit * 100) : 0;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-4)' }}>
        <Link to="/settings" style={{ color: 'var(--hv-text-link)' }}><i className="ti ti-arrow-left"></i></Link>
        <h2 className="text-h2">Gói dịch vụ</h2>
      </div>

      <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card-header"><div className="hv-card-title">Gói hiện tại</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-4)', padding: 'var(--hv-space-4)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 'var(--hv-radius-lg)', background: 'var(--hv-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-rocket" style={{ fontSize: 32, color: 'var(--hv-primary)' }}></i>
          </div>
          <div>
            <h3 className="text-h2" style={{ color: 'var(--hv-primary)' }}>{plan.plan}</h3>
            <p className="text-caption">Miễn phí • {plan.invoiceLimit} hóa đơn/tháng</p>
          </div>
        </div>
      </div>

      <div className="hv-grid-2" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card">
          <div className="hv-card-header"><div className="hv-card-title">Hóa đơn</div></div>
          <div style={{ padding: 'var(--hv-space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="text-caption">{plan.invoiceUsed} / {plan.invoiceLimit}</span>
              <span className="text-body-strong">{invoicePct.toFixed(0)}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--hv-bg-soft)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(invoicePct, 100)}%`, background: invoicePct > 80 ? 'var(--hv-warning)' : 'var(--hv-primary)', borderRadius: 4, transition: 'width 300ms' }}></div>
            </div>
          </div>
        </div>

        <div className="hv-card">
          <div className="hv-card-header"><div className="hv-card-title">Lưu trữ</div></div>
          <div style={{ padding: 'var(--hv-space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="text-caption">{plan.storageUsed} / {plan.storageLimit} MB</span>
              <span className="text-body-strong">{storagePct.toFixed(0)}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--hv-bg-soft)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(storagePct, 100)}%`, background: 'var(--hv-success)', borderRadius: 4, transition: 'width 300ms' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="hv-card">
        <div className="hv-card-header"><div className="hv-card-title">Tính năng</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--hv-space-3)', padding: 'var(--hv-space-4)' }}>
          {[
            { icon: 'ti ti-receipt', label: 'Phát hành HĐ', enabled: true },
            { icon: 'ti ti-chart-bar', label: 'Báo cáo', enabled: true },
            { icon: 'ti ti-download', label: 'Xuất PDF', enabled: true },
            { icon: 'ti ti-users', label: 'Quản lý KH', enabled: true },
            { icon: 'ti ti-bolt', label: 'Tự động hóa', enabled: plan.plan !== 'Free' },
            { icon: 'ti ti-robot', label: 'AI Tiền-kiểm', enabled: plan.plan === 'Enterprise' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: f.enabled ? 1 : 0.4 }}>
              <i className={f.icon} style={{ fontSize: 18, color: f.enabled ? 'var(--hv-success)' : 'var(--hv-text-muted)' }}></i>
              <span className="text-body">{f.label}</span>
              {f.enabled ? <i className="ti ti-check" style={{ marginLeft: 'auto', color: 'var(--hv-success)' }}></i> : <i className="ti ti-lock" style={{ marginLeft: 'auto', color: 'var(--hv-text-muted)' }}></i>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
