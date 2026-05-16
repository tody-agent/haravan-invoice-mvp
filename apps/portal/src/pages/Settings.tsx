import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Config {
  merchantId: string;
  autoIssueOnPaid: boolean;
  defaultTaxRate: number;
  sellerName: string;
  sellerMst: string;
  sellerAddress: string;
  tvanProvider: string;
}

export default function Settings() {
  const [config, setConfig] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/v1/config`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => { if (json.success) setConfig(json.data); })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/v1/config`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      if (json.success) {
        setToast('Đã lưu cài đặt');
        setTimeout(() => setToast(''), 3000);
      }
    } catch {
      setToast('Lỗi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  if (!config) {
    return (
      <div>
        <div className="hv-skeleton hv-skeleton-value" style={{ width: 200, marginBottom: 16 }}></div>
        <div className="hv-skeleton hv-skeleton-row" style={{ marginBottom: 8 }}></div>
        <div className="hv-skeleton hv-skeleton-row" style={{ marginBottom: 8 }}></div>
        <div className="hv-skeleton hv-skeleton-row"></div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div className="hv-toast hv-toast-success" style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
          <i className="ti ti-check" aria-hidden="true"></i>
          <span>{toast}</span>
        </div>
      )}

      <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card-header">
          <div className="hv-card-title">Thông tin người bán</div>
        </div>
        <div style={{ display: 'grid', gap: 'var(--hv-space-4)' }}>
          <div>
            <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Tên doanh nghiệp</label>
            <input className="hv-input" value={config.sellerName || ''} onChange={e => setConfig({ ...config, sellerName: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div>
            <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Mã số thuế</label>
            <input className="hv-input" value={config.sellerMst || ''} onChange={e => setConfig({ ...config, sellerMst: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div>
            <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Địa chỉ</label>
            <input className="hv-input" value={config.sellerAddress || ''} onChange={e => setConfig({ ...config, sellerAddress: e.target.value })} style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card-header">
          <div className="hv-card-title">Cài đặt hóa đơn</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-4)' }}>
          <input type="checkbox" id="autoIssue" checked={config.autoIssueOnPaid} onChange={e => setConfig({ ...config, autoIssueOnPaid: e.target.checked })} />
          <label htmlFor="autoIssue" className="text-body">Tự động phát hành hóa đơn khi thanh toán</label>
        </div>
        <div>
          <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Thuế suất mặc định</label>
          <select className="hv-select" value={config.defaultTaxRate} onChange={e => setConfig({ ...config, defaultTaxRate: Number(e.target.value) })}>
            <option value={0}>0%</option>
            <option value={0.05}>5%</option>
            <option value={0.08}>8%</option>
            <option value={0.1}>10%</option>
          </select>
        </div>
      </div>

      <button className="hv-btn hv-btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? <><i className="ti ti-loader-2"></i> Đang lưu...</> : <><i className="ti ti-device-floppy"></i> Lưu cài đặt</>}
      </button>
    </>
  );
}
