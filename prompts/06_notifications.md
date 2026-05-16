# Prompt 6 — Notification Center + Delivery Tracking

> **Chạy song song được với:** Prompt 1, 2, 3, 4, 5 (không conflict file)

## Context
- Project: `/Volumes/Data/Invoice/`
- Stack: Hono + D1 + React + Cloudflare
- Notifications page đã có: `apps/portal/src/pages/Notifications.tsx`

## Task

### Backend — Tạo file MỚI `apps/api/src/routes/notifications.ts`:

```typescript
import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database; KV: KVNamespace };

const notifications = new Hono<{ Bindings: Bindings }>();
notifications.use('*', authMiddleware());

// Mock notifications (in production: from DB)
const mockNotifications = [
  { id: '1', type: 'success', title: 'Hóa đơn đã phát hành', message: 'HRV-INV-001-001 đã được CQT chấp nhận', time: new Date(Date.now() - 300000).toISOString(), read: false, link: '/invoices/inv-001', category: 'invoice' },
  { id: '2', type: 'warning', title: 'Hóa đơn chờ xử lý', message: 'HRV-INV-001-003 đang chờ CQT xác nhận', time: new Date(Date.now() - 900000).toISOString(), read: false, link: '/invoices/inv-003', category: 'invoice' },
  { id: '3', type: 'error', title: 'Phát hành thất bại', message: 'HRV-INV-001-005 bị từ chối bởi CQT', time: new Date(Date.now() - 3600000).toISOString(), read: true, link: '/invoices/inv-005', category: 'invoice' },
  { id: '4', type: 'info', title: 'Cập nhật hệ thống', message: 'Phiên bản mới đã sẵn sàng', time: new Date(Date.now() - 7200000).toISOString(), read: true, link: '', category: 'system' },
  { id: '5', type: 'success', title: 'Gộp đơn thành công', message: 'Đã gộp 15 đơn lẻ thành 1 hóa đơn tổng', time: new Date(Date.now() - 86400000).toISOString(), read: true, link: '/reports', category: 'aggregate' },
];

// GET /api/v1/notifications — list notifications
notifications.get('/', async (c) => {
  const filter = c.req.query('filter') || 'all';
  const type = c.req.query('type');

  let filtered = [...mockNotifications];
  if (filter === 'unread') filtered = filtered.filter(n => !n.read);
  if (type) filtered = filtered.filter(n => n.type === type);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return c.json({
    success: true,
    data: {
      items: filtered,
      total: filtered.length,
      unreadCount,
    },
  });
});

// PATCH /api/v1/notifications/:id/read — mark as read
notifications.patch('/:id/read', async (c) => {
  const id = c.req.param('id');
  const notif = mockNotifications.find(n => n.id === id);
  if (notif) notif.read = true;
  return c.json({ success: true });
});

// POST /api/v1/notifications/read-all — mark all as read
notifications.post('/read-all', async (c) => {
  mockNotifications.forEach(n => n.read = true);
  return c.json({ success: true, message: 'Đã đánh dấu tất cả đã đọc' });
});

// GET /api/v1/notifications/unread-count — get unread count
notifications.get('/unread-count', async (c) => {
  const count = mockNotifications.filter(n => !n.read).length;
  return c.json({ success: true, data: { count } });
});

export default notifications;
```

### Cập nhật `apps/api/src/routes/index.ts` — THÊM:
```typescript
export { default as notificationRoutes } from './notifications';
```

### Cập nhật `apps/api/src/index.ts` — THÊM:
```typescript
import { notificationRoutes } from './routes';
app.route('/api/v1/notifications', notificationRoutes);
```

### Frontend — Tạo file MỚI `apps/portal/src/pages/Notifications.tsx` (REPLACE):

```tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  category?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchNotifications = () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`${API_URL}/v1/notifications?filter=${filter}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setNotifications(json.data.items || []);
          setUnreadCount(json.data.unreadCount || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, [filter]);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/v1/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/v1/notifications/read-all`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const typeIcon: Record<string, string> = {
    success: 'ti ti-circle-check', warning: 'ti ti-alert-triangle',
    error: 'ti ti-circle-x', info: 'ti ti-info-circle',
  };
  const typeColor: Record<string, string> = {
    success: 'var(--hv-success)', warning: 'var(--hv-warning)',
    error: 'var(--hv-danger)', info: 'var(--hv-info)',
  };
  const categoryIcon: Record<string, string> = {
    invoice: 'ti ti-receipt', system: 'ti ti-settings', aggregate: 'ti ti-git-merge',
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return `${Math.floor(diff / 86400000)} ngày trước`;
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--hv-space-4)' }}>
        <h2 className="text-h2">
          Thông báo {unreadCount > 0 && <span className="hv-badge hv-badge-danger" style={{ marginLeft: 8 }}>{unreadCount}</span>}
        </h2>
        {unreadCount > 0 && (
          <button className="hv-btn hv-btn-tertiary hv-btn-sm" onClick={markAllAsRead}>
            <i className="ti ti-check-all"></i> Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="hv-tabs" style={{ marginBottom: 'var(--hv-space-4)' }}>
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'unread', label: 'Chưa đọc' },
        ].map(f => (
          <button key={f.key} className={`hv-tab${filter === f.key ? ' hv-tab-active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      {/* Notification list */}
      <div className="hv-card">
        {loading ? (
          <div>{[1,2,3,4,5].map(i => <div key={i} className="hv-skeleton hv-skeleton-row" style={{ margin: '0 var(--hv-space-4) 4px' }}></div>)}</div>
        ) : notifications.length === 0 ? (
          <div className="hv-empty-state" style={{ display: 'flex' }}>
            <i className="ti ti-bell-off hv-empty-state-icon"></i>
            <div className="hv-empty-state-title">Không có thông báo</div>
            <div className="hv-empty-state-desc">Bạn sẽ nhận thông báo khi có hóa đơn mới hoặc hệ thống cập nhật.</div>
          </div>
        ) : (
          <div>
            {notifications.map(n => (
              <div key={n.id}
                style={{
                  display: 'flex', gap: 'var(--hv-space-3)', padding: 'var(--hv-space-3) var(--hv-space-4)',
                  borderBottom: '1px solid var(--hv-border)',
                  background: n.read ? 'transparent' : 'var(--hv-bg-soft)',
                  cursor: n.link ? 'pointer' : 'default',
                  transition: 'background 150ms',
                }}
                onClick={() => { markAsRead(n.id); if (n.link) window.location.href = n.link; }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--hv-bg-row-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'var(--hv-bg-soft)')}
              >
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  <i className={typeIcon[n.type]} style={{ fontSize: 18, color: typeColor[n.type] }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-2)', marginBottom: 'var(--hv-space-1)' }}>
                    <span className="text-body-strong">{n.title}</span>
                    {n.category && <i className={categoryIcon[n.category] || 'ti ti-tag'} style={{ fontSize: 12, color: 'var(--hv-text-muted)' }}></i>}
                  </div>
                  <p className="text-caption">{n.message}</p>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className="text-caption">{timeAgo(n.time)}</span>
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--hv-primary)' }}></div>}
                </div>
              </div>
            ))}
          </div>
        )}
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
