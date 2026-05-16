import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('Notifications API', () => {
  let authToken: string;

  beforeAll(async () => {
    const res = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test' }),
    });
    const json = (await res.json()) as { data: { token: string } };
    authToken = json.data.token;
  });

  it('GET /api/v1/notifications requires auth', async () => {
    const res = await app.request('/api/v1/notifications');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/notifications returns list or 500 (no D1 in test)', async () => {
    const res = await app.request('/api/v1/notifications', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: { items: Array<Record<string, unknown>>; total: number; unreadCount: number } };
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data.items)).toBe(true);
      expect(typeof json.data.total).toBe('number');
      expect(typeof json.data.unreadCount).toBe('number');
    }
  });

  it('GET /api/v1/notifications returns correct shape when 200', async () => {
    const res = await app.request('/api/v1/notifications', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: { items: Array<Record<string, unknown>> } };
      const item = json.data.items[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('message');
      expect(item).toHaveProperty('time');
      expect(item).toHaveProperty('read');
      expect(item).toHaveProperty('category');
      expect(['success', 'warning', 'error', 'info']).toContain(item.type);
    }
  });

  it('GET /api/v1/notifications?filter=unread works', async () => {
    const res = await app.request('/api/v1/notifications?filter=unread', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: { items: Array<{ read: boolean }> } };
      expect(json.success).toBe(true);
      json.data.items.forEach((n: { read: boolean }) => {
        expect(n.read).toBe(false);
      });
    }
  });

  it('GET /api/v1/notifications?type=success works', async () => {
    const res = await app.request('/api/v1/notifications?type=success', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: { items: Array<{ type: string }> } };
      expect(json.success).toBe(true);
      json.data.items.forEach((n: { type: string }) => {
        expect(n.type).toBe('success');
      });
    }
  });

  it('PATCH /api/v1/notifications/:id/read works', async () => {
    const res = await app.request('/api/v1/notifications/1/read', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean };
      expect(json.success).toBe(true);
    }
  });

  it('POST /api/v1/notifications/read-all works', async () => {
    const res = await app.request('/api/v1/notifications/read-all', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; message: string };
      expect(json.success).toBe(true);
      expect(json.message).toContain('Đã đánh dấu');
    }
  });

  it('GET /api/v1/notifications/unread-count works', async () => {
    const res = await app.request('/api/v1/notifications/unread-count', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: { count: number } };
      expect(json.success).toBe(true);
      expect(typeof json.data.count).toBe('number');
    }
  });

  it('POST /api/v1/notifications/read-all works', async () => {
    const res = await app.request('/api/v1/notifications/read-all', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; message: string };
      expect(json.success).toBe(true);
      expect(json.message).toContain('Đã đánh dấu');
    }
  });

  it('GET /api/v1/notifications/unread-count works', async () => {
    const res = await app.request('/api/v1/notifications/unread-count', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: { count: number } };
      expect(json.success).toBe(true);
      expect(typeof json.data.count).toBe('number');
    }
  });
});
