import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function SettingsAutomation() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/v1/settings/automation`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success) setConfig(json.data); })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/v1/settings/automation`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      if (json.success) { setToast('Đã lưu'); setTimeout(() => setToast(''), 3000); }
    } catch { setToast('Lỗi lưu'); }
    finally { setSaving(false); }
  };

  if (!config) return <div className="hv-skeleton hv-skeleton-chart" style={{ height: 300 }}></div>;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-3)', marginBottom: 'var(--hv-space-4)' }}>
        <Link to="/settings" style={{ color: 'var(--hv-text-link)' }}><i className="ti ti-arrow-left"></i></Link>
        <h2 className="text-h2">Tự động hóa</h2>
      </div>

      {toast && <div className="hv-toast hv-toast-success" style={{ position: 'fixed', top: 70, right: 16, zIndex: 2000 }}><i className="ti ti-check"></i> {toast}</div>}

      <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card-header"><div className="hv-card-title">Quy tắc tự động</div></div>
        <div style={{ display: 'grid', gap: 'var(--hv-space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--hv-space-3)', background: 'var(--hv-bg-soft)', borderRadius: 'var(--hv-radius-md)' }}>
            <div>
              <p className="text-body-strong">Tự động phát hành khi thanh toán</p>
              <p className="text-caption">Phát hành HĐ ngay khi đơn hàng được thanh toán</p>
            </div>
            <label className="hv-switch">
              <input type="checkbox" checked={config.autoIssueOnPaid} onChange={e => setConfig({ ...config, autoIssueOnPaid: e.target.checked })} />
              <span className="hv-switch-slider"></span>
            </label>
          </div>

          <div>
            <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Kênh áp dụng</label>
            <div style={{ display: 'flex', gap: 'var(--hv-space-2)' }}>
              {['web', 'pos', 'admin'].map(ch => (
                <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="checkbox" checked={config.channels?.includes(ch)} onChange={e => {
                    const channels = e.target.checked ? [...(config.channels || []), ch] : (config.channels || []).filter((c: string) => c !== ch);
                    setConfig({ ...config, channels });
                  }} />
                  <span className="text-body">{ch.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>Delay (phút)</label>
            <input className="hv-input" type="number" value={config.delayMinutes} onChange={e => setConfig({ ...config, delayMinutes: Number(e.target.value) })} min={0} max={60} style={{ width: 120 }} />
            <p className="text-caption" style={{ marginTop: 4 }}>Thời gian chờ trước khi phát hành tự động</p>
          </div>
        </div>
      </div>

      <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card-header"><div className="hv-card-title">Thông báo</div></div>
        <div style={{ display: 'grid', gap: 'var(--hv-space-3)' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span className="text-body">Thông báo khi phát hành thành công</span>
            <input type="checkbox" checked={config.notifyOnIssue} onChange={e => setConfig({ ...config, notifyOnIssue: e.target.checked })} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span className="text-body">Thông báo khi có lỗi</span>
            <input type="checkbox" checked={config.notifyOnError} onChange={e => setConfig({ ...config, notifyOnError: e.target.checked })} />
          </label>
        </div>
      </div>

      <button className="hv-btn hv-btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? <><i className="ti ti-loader-2"></i> Đang lưu...</> : <><i className="ti ti-device-floppy"></i> Lưu quy tắc</>}
      </button>
    </>
  );
}
