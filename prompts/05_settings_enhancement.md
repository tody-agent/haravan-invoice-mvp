# Prompt 5 — Settings Enhancement (Templates + Automation + Plan)

> **Chạy song song được với:** Prompt 1, 2, 3, 4, 6 (không conflict file)

## Context
- Project: `/Volumes/Data/Invoice/`
- Stack: React + TypeScript + Cloudflare
- Settings pages đã có: `apps/portal/src/pages/Settings.tsx`, `SettingsTemplates.tsx`, `SettingsAutomation.tsx`, `SettingsPlan.tsx`

## Task

### Backend — Tạo file MỚI `apps/api/src/routes/settings.ts`:

```typescript
import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database; KV: KVNamespace };

const settings = new Hono<{ Bindings: Bindings }>();
settings.use('*', authMiddleware());

// GET /api/v1/settings/templates — get invoice templates
settings.get('/templates', async (c) => {
  const user = c.get('user');
  const config = await c.env.DB.prepare('SELECT * FROM merchant_config WHERE merchant_id = ?').bind(user.merchantId).first();
  
  return c.json({
    success: true,
    data: {
      mauSo: config?.mau_so || '01GTKT0/001',
      kyHieu: config?.ky_hieu || 'AA/20E',
      templateName: 'Hóa đơn GTGT',
      status: 'active',
    },
  });
});

// PATCH /api/v1/settings/templates — update templates
settings.patch('/templates', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  
  await c.env.DB.prepare(
    "UPDATE merchant_config SET mau_so = ?, ky_hieu = ?, updated_at = datetime('now') WHERE merchant_id = ?"
  ).bind(body.mauSo || '01GTKT0/001', body.kyHieu || 'AA/20E', user.merchantId).run();

  return c.json({ success: true, message: 'Đã cập nhật mẫu hóa đơn' });
});

// GET /api/v1/settings/automation — get automation rules
settings.get('/automation', async (c) => {
  const user = c.get('user');
  const config = await c.env.DB.prepare('SELECT * FROM merchant_config WHERE merchant_id = ?').bind(user.merchantId).first();

  return c.json({
    success: true,
    data: {
      autoIssueOnPaid: Boolean(config?.auto_issue_on_paid),
      channels: ['web', 'pos'],
      delayMinutes: 0,
      notifyOnIssue: true,
      notifyOnError: true,
    },
  });
});

// PATCH /api/v1/settings/automation — update automation rules
settings.patch('/automation', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  await c.env.DB.prepare(
    "UPDATE merchant_config SET auto_issue_on_paid = ?, updated_at = datetime('now') WHERE merchant_id = ?"
  ).bind(body.autoIssueOnPaid ? 1 : 0, user.merchantId).run();

  return c.json({ success: true, message: 'Đã cập nhật quy tắc tự động' });
});

// GET /api/v1/settings/plan — get plan info
settings.get('/plan', async (c) => {
  const user = c.get('user');
  
  // Count invoices this month
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const invoiceCount = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM invoices WHERE created_at >= ?"
  ).bind(monthStart).first();

  return c.json({
    success: true,
    data: {
      plan: 'Free',
      invoiceLimit: 100,
      invoiceUsed: (invoiceCount as any)?.count || 0,
      storageLimit: 1024, // MB
      storageUsed: 0,
      features: ['basic_invoice', 'reports', 'pdf_export'],
      expiresAt: null,
    },
  });
});

export default settings;
```

### Cập nhật `apps/api/src/routes/index.ts` — THÊM:
```typescript
export { default as settingsRoutes } from './settings';
```

### Cập nhật `apps/api/src/index.ts` — THÊM:
```typescript
import { settingsRoutes } from './routes';
app.route('/api/v1/settings', settingsRoutes);
```

### Frontend — Tạo file MỚI `apps/portal/src/pages/SettingsTemplates.tsx` (REPLACE):

```tsx
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
```

### Frontend — Tạo file MỚI `apps/portal/src/pages/SettingsAutomation.tsx` (REPLACE):

```tsx
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
```

### Frontend — Tạo file MỚI `apps/portal/src/pages/SettingsPlan.tsx` (REPLACE):

```tsx
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
```

## Verification
```bash
cd /Volumes/Data/Invoice
pnpm --filter @haravan/api test
pnpm --filter @haravan/portal typecheck
```
