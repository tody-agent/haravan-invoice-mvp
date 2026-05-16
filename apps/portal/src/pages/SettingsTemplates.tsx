import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function SettingsTemplates() {
  const [templates, setTemplates] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/v1/settings/templates`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success) setTemplates(json.data); })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/v1/settings/templates`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(templates),
      });
      const json = await res.json();
      if (json.success) { setToast('Đã lưu'); setTimeout(() => setToast(''), 3000); }
    } catch { setToast('Lỗi lưu'); }
    finally { setSaving(false); }
  };

  if (!templates) return <div className="hv-skeleton hv-skeleton-chart" style={{ height: 300 }}></div>;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-4)' }}>
        <Link to="/settings" style={{ color: 'var(--hv-text-link)' }}><i className="ti ti-arrow-left"></i></Link>
        <h2 className="text-h2">Mẫu hóa đơn</h2>
      </div>

      {toast && <div className="hv-toast hv-toast-success" style={{ position: 'fixed', top: 70, right: 16, zIndex: 2000 }}><i className="ti ti-check"></i> {toast}</div>}

      <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card-header"><div className="hv-card-title">Cấu hình mẫu</div></div>
        <div style={{ display: 'grid', gap: 'var(--hv-space-4)' }}>
          <div>
            <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Mẫu số</label>
            <select className="hv-select" value={templates.mauSo} onChange={e => setTemplates({ ...templates, mauSo: e.target.value })} style={{ width: '100%' }}>
              <option value="01GTKT0/001">01GTKT0/001 - Hóa đơn GTGT</option>
              <option value="02GTTT0/001">02GTTT0/001 - Hóa đơn bán hàng</option>
              <option value="06HDXK0/001">06HDXK0/001 - Hóa đơn xuất khẩu</option>
            </select>
          </div>
          <div>
            <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Ký hiệu</label>
            <input className="hv-input" value={templates.kyHieu} onChange={e => setTemplates({ ...templates, kyHieu: e.target.value })} style={{ width: '100%' }} placeholder="AA/20E" />
          </div>
          <div>
            <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Tên mẫu</label>
            <input className="hv-input" value={templates.templateName} onChange={e => setTemplates({ ...templates, templateName: e.target.value })} style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <button className="hv-btn hv-btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? <><i className="ti ti-loader-2"></i> Đang lưu...</> : <><i className="ti ti-device-floppy"></i> Lưu cấu hình</>}
      </button>
    </>
  );
}
