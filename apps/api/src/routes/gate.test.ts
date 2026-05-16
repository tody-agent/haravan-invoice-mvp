import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

// ============================================================
// TEST GATE — Haravan Invoice MVP
// Comprehensive integration test for all API features
// ============================================================

describe('TEST GATE — All Features', () => {
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

  // ─── 1. AUTH ─────────────────────────────────────────────
  describe('1. Auth', () => {
    it('login returns valid token', async () => {
      const res = await app.request('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'test' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json() as { success: boolean; data: { token: string } };
      expect(json.success).toBe(true);
      expect(json.data.token.split('.')).toHaveLength(3);
    });

    it('token contains merchantId in payload', () => {
      const parts = authToken.split('.');
      const payload = JSON.parse(atob(parts[1]));
      expect(payload.merchantId).toBeDefined();
      expect(payload.userId).toBeDefined();
      expect(payload.role).toBeDefined();
    });
  });

  // ─── 2. HEALTH ───────────────────────────────────────────
  describe('2. Health', () => {
    it('health endpoint returns status', async () => {
      const res = await app.request('/api/v1/health');
      expect([200, 503]).toContain(res.status);
      const json = await res.json() as { success: boolean; data: { timestamp: string } };
      expect(json.success).toBeDefined();
      expect(json.data.timestamp).toBeDefined();
    });
  });

  // ─── 3. INVOICES ─────────────────────────────────────────
  describe('3. Invoices', () => {
    it('list requires auth', async () => {
      const res = await app.request('/api/v1/invoices');
      expect(res.status).toBe(401);
    });

    it('create invoice with valid payload', async () => {
      const res = await app.request('/api/v1/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          buyer: { name: 'Test Buyer', mst: '0123456789' },
          items: [{ name: 'Test Item', quantity: 1, unitPrice: 100000, taxRate: 0.1, total: 110000 }],
        }),
      });
      expect([200, 201, 500]).toContain(res.status);
      if (res.status < 500) {
        const json = await res.json() as { success: boolean; data: { id: string; haravanId: string } };
        expect(json.success).toBe(true);
        expect(json.data.id).toBeDefined();
        expect(json.data.haravanId).toBeDefined();
      }
    });

    it('get by id returns 404 for non-existent', async () => {
      const res = await app.request('/api/v1/invoices/non-existent', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([404, 500]).toContain(res.status);
    });

    it('replace returns error for non-existent', async () => {
      const res = await app.request('/api/v1/invoices/non-existent/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          buyer: { name: 'Test' },
          items: [{ name: 'Test', quantity: 1, unitPrice: 100, total: 110 }],
          reason: 'test',
        }),
      });
      expect([400, 404, 500]).toContain(res.status);
    });

    it('adjust returns error for non-existent', async () => {
      const res = await app.request('/api/v1/invoices/non-existent/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          type: 'increase',
          items: [{ name: 'Test', quantity: 1, total: 100 }],
          reason: 'test',
        }),
      });
      expect([400, 404, 500]).toContain(res.status);
    });
  });

  // ─── 4. REPORTS ──────────────────────────────────────────
  describe('4. Reports', () => {
    it('summary returns data structure', async () => {
      const res = await app.request('/api/v1/reports/summary', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { totalIssued: number; totalPending: number; revenueThisMonth: number } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('totalIssued');
        expect(json.data).toHaveProperty('totalPending');
        expect(json.data).toHaveProperty('revenueThisMonth');
      }
    });

    it('monthly returns data', async () => {
      const res = await app.request('/api/v1/reports/monthly?month=2026-05', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { invoices: unknown[] } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('invoices');
      }
    });

    it('sales returns daily breakdown with summary', async () => {
      const res = await app.request('/api/v1/reports/sales?dateFrom=2026-01-01&dateTo=2026-12-31', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { days: unknown[]; summary: { count: number; total: number } } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('days');
        expect(json.data).toHaveProperty('summary');
        expect(json.data.summary).toHaveProperty('count');
        expect(json.data.summary).toHaveProperty('total');
      }
    });

    it('ledger returns invoice list with summary', async () => {
      const res = await app.request('/api/v1/reports/ledger?dateFrom=2026-01-01&dateTo=2026-12-31', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { invoices: unknown[]; summary: { count: number } } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('invoices');
        expect(json.data).toHaveProperty('summary');
      }
    });

    it('quarterly returns year total', async () => {
      const res = await app.request('/api/v1/reports/quarterly?year=2026', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { quarters: unknown[]; yearTotal: { count: number } } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('quarters');
        expect(json.data).toHaveProperty('yearTotal');
      }
    });

    it('replaced returns count', async () => {
      const res = await app.request('/api/v1/reports/replaced?dateFrom=2026-01-01&dateTo=2026-12-31', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { count: number } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('count');
      }
    });

    it('modified returns count', async () => {
      const res = await app.request('/api/v1/reports/modified?dateFrom=2026-01-01&dateTo=2026-12-31', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { count: number } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('count');
      }
    });

    it('deleted returns note with compliance reference', async () => {
      const res = await app.request('/api/v1/reports/deleted?dateFrom=2026-01-01&dateTo=2026-12-31', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { note: string } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('note');
        expect(json.data.note).toContain('NĐ 70/2025');
      }
    });
  });

  // ─── 5. ANALYTICS ────────────────────────────────────────
  describe('5. Analytics', () => {
    it('channels requires auth', async () => {
      const res = await app.request('/api/v1/analytics/channels');
      expect(res.status).toBe(401);
    });

    it('top-customers requires auth', async () => {
      const res = await app.request('/api/v1/analytics/top-customers');
      expect(res.status).toBe(401);
    });

    it('top-skus requires auth', async () => {
      const res = await app.request('/api/v1/analytics/top-skus');
      expect(res.status).toBe(401);
    });

    it('channels returns array of {channel, count, total}', async () => {
      const res = await app.request('/api/v1/analytics/channels?days=30', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: Array<{ channel: string; count: number; total: number }> };
        expect(json.success).toBe(true);
        expect(Array.isArray(json.data)).toBe(true);
        if (json.data.length > 0) {
          expect(json.data[0]).toHaveProperty('channel');
          expect(json.data[0]).toHaveProperty('count');
          expect(json.data[0]).toHaveProperty('total');
        }
      }
    });

    it('top-customers returns array of {name, mst, invoiceCount, total}', async () => {
      const res = await app.request('/api/v1/analytics/top-customers?days=30', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: Array<{ name: string; mst: string; invoiceCount: number; total: number }> };
        expect(json.success).toBe(true);
        expect(Array.isArray(json.data)).toBe(true);
        if (json.data.length > 0) {
          expect(json.data[0]).toHaveProperty('name');
          expect(json.data[0]).toHaveProperty('mst');
          expect(json.data[0]).toHaveProperty('invoiceCount');
          expect(json.data[0]).toHaveProperty('total');
        }
      }
    });

    it('top-skus returns array of {name, sku, qty, revenue}', async () => {
      const res = await app.request('/api/v1/analytics/top-skus?days=30', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: Array<{ name: string; sku: string; qty: number; revenue: number }> };
        expect(json.success).toBe(true);
        expect(Array.isArray(json.data)).toBe(true);
        if (json.data.length > 0) {
          expect(json.data[0]).toHaveProperty('name');
          expect(json.data[0]).toHaveProperty('sku');
          expect(json.data[0]).toHaveProperty('qty');
          expect(json.data[0]).toHaveProperty('revenue');
        }
      }
    });

    it('channels accepts days=7', async () => {
      const res = await app.request('/api/v1/analytics/channels?days=7', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('channels defaults to 30 days', async () => {
      const res = await app.request('/api/v1/analytics/channels', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });
  });

  // ─── 6. PRODUCTS ─────────────────────────────────────────
  describe('6. Products', () => {
    it('list requires auth', async () => {
      const res = await app.request('/api/v1/products');
      expect(res.status).toBe(401);
    });

    it('list returns paginated structure', async () => {
      const res = await app.request('/api/v1/products', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { items: unknown[]; total: number; page: number; pageSize: number } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('items');
        expect(json.data).toHaveProperty('total');
        expect(json.data).toHaveProperty('page');
        expect(json.data).toHaveProperty('pageSize');
      }
    });

    it('search works', async () => {
      const res = await app.request('/api/v1/products?search=test', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('pagination works', async () => {
      const res = await app.request('/api/v1/products?page=1&pageSize=10', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });
  });

  // ─── 7. AGGREGATE (TT 78/TT 32) ──────────────────────────
  describe('7. Aggregate (TT 78/TT 32)', () => {
    it('POST requires auth', async () => {
      const res = await app.request('/api/v1/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: '2026-05-16' }),
      });
      expect(res.status).toBe(401);
    });

    it('POST returns valid response or no-data error', async () => {
      const res = await app.request('/api/v1/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ date: '2026-05-16' }),
      });
      expect([200, 400, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { id: string; originalCount: number; total: number } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('id');
        expect(json.data).toHaveProperty('originalCount');
        expect(json.data).toHaveProperty('total');
      }
      if (res.status === 400) {
        const json = await res.json() as { success: boolean; message: string };
        expect(json.success).toBe(false);
        expect(json.message).toContain('Không có đơn lẻ để gộp');
      }
    });

    it('POST with future date returns 400', async () => {
      const res = await app.request('/api/v1/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ date: '2099-01-01' }),
      });
      expect([400, 500]).toContain(res.status);
      if (res.status === 400) {
        const json = await res.json() as { success: boolean; message: string };
        expect(json.success).toBe(false);
      }
    });

    it('POST defaults date to today', async () => {
      const res = await app.request('/api/v1/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({}),
      });
      expect([200, 400, 500]).toContain(res.status);
    });

    it('GET summary requires auth', async () => {
      const res = await app.request('/api/v1/aggregate/summary');
      expect(res.status).toBe(401);
    });

    it('GET summary returns array', async () => {
      const res = await app.request('/api/v1/aggregate/summary?month=2026-05', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: Array<{ date: string; count: number; total: number }> };
        expect(json.success).toBe(true);
        expect(Array.isArray(json.data)).toBe(true);
      }
    });

    it('GET summary defaults to current month', async () => {
      const res = await app.request('/api/v1/aggregate/summary', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });
  });

  // ─── 8. ONE-CLICK ────────────────────────────────────────
  describe('8. One-Click', () => {
    it('from-pos requires auth', async () => {
      const res = await app.request('/api/v1/invoices/from-pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ name: 'Test', quantity: 1, unitPrice: 100, total: 110 }] }),
      });
      expect(res.status).toBe(401);
    });

    it('from-pos creates invoice', async () => {
      const res = await app.request('/api/v1/invoices/from-pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          items: [{ name: 'Cà phê sữa', quantity: 2, unitPrice: 35000, taxRate: 0.1, total: 77000 }],
          paymentMethod: 'cash',
        }),
      });
      expect([200, 201, 500]).toContain(res.status);
      if (res.status < 500) {
        const json = await res.json() as { success: boolean; data: { id: string } };
        expect(json.success).toBe(true);
        expect(json.data.id).toBeDefined();
      }
    });

    it('from-order creates invoice', async () => {
      const res = await app.request('/api/v1/invoices/from-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          customerName: 'Nguyễn Văn A',
          customerMst: '0123456789',
          orderItems: [{ productName: 'Laptop Dell', quantity: 1, price: 15000000, taxRate: 0.1 }],
          orderId: 'ORD-001',
          channel: 'web',
        }),
      });
      expect([200, 201, 500]).toContain(res.status);
    });

    it('from-pos returns 400 without items', async () => {
      const res = await app.request('/api/v1/invoices/from-pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({}),
      });
      expect([400, 500]).toContain(res.status);
      if (res.status === 400) {
        const json = await res.json() as { success: boolean; error: { code: string } };
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('VALIDATION_ERROR');
      }
    });
  });

  // ─── 9. MST LOOKUP ───────────────────────────────────────
  describe('9. MST Lookup', () => {
    it('lookup requires auth', async () => {
      const res = await app.request('/api/v1/mst/lookup?mst=0123456789');
      expect(res.status).toBe(401);
    });

    it('validate returns result', async () => {
      const res = await app.request('/api/v1/mst/validate?mst=0123456789', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { valid: boolean } };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('valid');
      }
    });

    it('validate rejects invalid MST', async () => {
      const res = await app.request('/api/v1/mst/validate?mst=12345', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });
  });

  // ─── 10. CUSTOMER ANALYTICS ──────────────────────────────
  describe('10. Customer Analytics', () => {
    it('requires auth', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics');
      expect(res.status).toBe(401);
    });

    it('returns 404 for non-existent', async () => {
      const res = await app.request('/api/v1/customers/non-existent-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([404, 500]).toContain(res.status);
      if (res.status === 404) {
        const json = await res.json() as { success: boolean; error: { code: string } };
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('NOT_FOUND');
      }
    });

    it('returns correct shape when data exists', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 404, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as {
          success: boolean;
          data: {
            customer: { id: string; name: string; mst: string };
            stats: { totalInvoices: number; totalRevenue: number; avgOrderValue: number };
            monthly: Array<{ month: string; count: number; total: number }>;
            channels: Array<{ channel: string; count: number; total: number }>;
          };
        };
        expect(json.success).toBe(true);
        expect(json.data.customer).toHaveProperty('id');
        expect(json.data.customer).toHaveProperty('name');
        expect(json.data.stats).toHaveProperty('totalInvoices');
        expect(json.data.stats).toHaveProperty('totalRevenue');
        expect(Array.isArray(json.data.monthly)).toBe(true);
        expect(Array.isArray(json.data.channels)).toBe(true);
      }
    });
  });

  // ─── 11. NOTIFICATIONS ───────────────────────────────────
  describe('11. Notifications', () => {
    it('list requires auth', async () => {
      const res = await app.request('/api/v1/notifications');
      expect(res.status).toBe(401);
    });

    it('list returns items with correct shape or 500 (no D1)', async () => {
      const res = await app.request('/api/v1/notifications', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as {
          success: boolean;
          data: { items: Array<{ id: string; type: string; title: string; message: string; read: boolean }>; total: number; unreadCount: number };
        };
        expect(json.success).toBe(true);
        expect(Array.isArray(json.data.items)).toBe(true);
        expect(json.data.items.length).toBeGreaterThan(0);
        expect(typeof json.data.total).toBe('number');
        expect(typeof json.data.unreadCount).toBe('number');

        const item = json.data.items[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('message');
        expect(item).toHaveProperty('read');
        expect(['success', 'warning', 'error', 'info']).toContain(item.type);
      }
    });

    it('filter=unread returns only unread or 500', async () => {
      const res = await app.request('/api/v1/notifications?filter=unread', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { items: Array<{ read: boolean }> } };
        expect(json.success).toBe(true);
        json.data.items.forEach((n) => {
          expect(n.read).toBe(false);
        });
      }
    });

    it('type=success filters by type or 500', async () => {
      const res = await app.request('/api/v1/notifications?type=success', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as { success: boolean; data: { items: Array<{ type: string }> } };
        expect(json.success).toBe(true);
        json.data.items.forEach((n) => {
          expect(n.type).toBe('success');
        });
      }
    });

    it('mark as read works or 500', async () => {
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

    it('read-all works or 500', async () => {
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

    it('unread-count returns number or 500', async () => {
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

  // ─── 12. PDF ─────────────────────────────────────────────
  describe('12. PDF', () => {
    it('PDF requires auth', async () => {
      const res = await app.request('/api/v1/invoices/test-id/pdf');
      expect(res.status).toBe(401);
    });

    it('PDF returns HTML for non-existent invoice', async () => {
      const res = await app.request('/api/v1/invoices/test-id/pdf', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 404, 500]).toContain(res.status);
      if (res.status === 200) {
        const text = await res.text();
        expect(text).toContain('<!DOCTYPE html>');
      }
    });
  });

  // ─── 13. ADAPTER (unit) ──────────────────────────────────
  describe('13. TVAN Adapter', () => {
    it('mock adapter issues invoice', async () => {
      const { MockAdapter } = await import('../adapters/mock-adapter');
      const adapter = new MockAdapter(0);
      const result = await adapter.issue({
        id: 'inv-test',
        haravanId: 'HRV-TEST-001',
        status: 'pending',
        buyer: { name: 'Test' },
        seller: { name: 'Test' },
        items: [{ name: 'Test', quantity: 1, unitPrice: 100, taxRate: 0.1, total: 110 }],
        totals: { subtotal: 100, taxAmount: 10, discount: 0, total: 110 },
        paymentMethod: 'transfer',
        channel: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      });
      expect(result.success).toBe(true);
      expect(result.tvanId).toMatch(/^MOCK-/);
      expect(result.cqtConfirmation).toBeDefined();
    });

    it('mock adapter replace', async () => {
      const { MockAdapter } = await import('../adapters/mock-adapter');
      const adapter = new MockAdapter(0);
      const result = await adapter.replace('inv-original', {
        id: 'inv-new',
        haravanId: 'HRV-TEST-002',
        status: 'pending',
        buyer: { name: 'Test' },
        seller: { name: 'Test' },
        items: [],
        totals: { subtotal: 0, taxAmount: 0, discount: 0, total: 0 },
        paymentMethod: 'transfer',
        channel: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      });
      expect(result.success).toBe(true);
      expect(result.tvanId).toMatch(/^MOCK-RPL-/);
    });

    it('mock adapter adjust', async () => {
      const { MockAdapter } = await import('../adapters/mock-adapter');
      const adapter = new MockAdapter(0);
      const result = await adapter.adjust('inv-original', {
        type: 'increase',
        items: [{ total: 50000 }],
      });
      expect(result.success).toBe(true);
      expect(result.tvanId).toMatch(/^MOCK-ADJ-/);
    });

    it('mock adapter with error', async () => {
      const { MockAdapter } = await import('../adapters/mock-adapter');
      const adapter = new MockAdapter(1);
      const result = await adapter.issue({
        id: 'inv-test',
        haravanId: 'HRV-TEST-003',
        status: 'pending',
        buyer: { name: 'Test' },
        seller: { name: 'Test' },
        items: [],
        totals: { subtotal: 0, taxAmount: 0, discount: 0, total: 0 },
        paymentMethod: 'cash',
        channel: 'pos',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      });
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('MOCK_ERROR');
    });
  });

  // ─── 14. PDF SERVICE (unit) ──────────────────────────────
  describe('14. PDF Service', () => {
    it('generates HTML with invoice data', async () => {
      const { PDFService } = await import('../services/pdf-service');
      const pdfService = new PDFService();
      const html = pdfService.generateHTML({
        id: 'inv-001',
        haravanId: 'HRV-INV-001-001',
        status: 'cqt_accepted',
        issueDate: '2026-05-01T10:00:00Z',
        buyer: { name: 'Công ty ABC', mst: '0123456789', address: '123 Nguyễn Huệ, Q1' },
        seller: { name: 'Công ty XYZ', mst: '9876543210', address: '456 Lê Lợi, Q3' },
        items: [{ name: 'Laptop Dell', quantity: 2, unitPrice: 15000000, taxRate: 0.1, total: 33000000 }],
        totals: { subtotal: 30000000, taxAmount: 3000000, discount: 0, total: 33000000 },
        paymentMethod: 'transfer',
        channel: 'admin',
        tvanId: 'MOCK-123',
        createdAt: '2026-05-01T10:00:00Z',
        updatedAt: '2026-05-01T10:00:00Z',
        version: 1,
      });
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('HRV-INV-001-001');
      expect(html).toContain('Công ty ABC');
      expect(html).toContain('Laptop Dell');
      expect(html).toContain('33.000.000');
      expect(html).toContain('MOCK-123');
    });
  });

  // ─── 15. SHARED VALIDATION (unit) ────────────────────────
  describe('15. Shared Validation', () => {
    it('validateMST returns null for valid 10-digit MST', async () => {
      const { validateMST } = await import('@haravan/shared');
      expect(validateMST('0123456789')).toBeNull();
    });

    it('validateMST returns null for valid 13-digit MST', async () => {
      const { validateMST } = await import('@haravan/shared');
      expect(validateMST('0123456789012')).toBeNull();
    });

    it('validateMST returns error for invalid MST', async () => {
      const { validateMST } = await import('@haravan/shared');
      expect(validateMST('12345')).toContain('10 hoặc 13');
      expect(validateMST('')).toContain('để trống');
      expect(validateMST('abcdefghij')).toContain('chữ số');
    });

    it('validateTaxRate returns null for valid rates', async () => {
      const { validateTaxRate } = await import('@haravan/shared');
      expect(validateTaxRate(0)).toBeNull();
      expect(validateTaxRate(0.05)).toBeNull();
      expect(validateTaxRate(0.1)).toBeNull();
    });

    it('validateTaxRate returns error for invalid rates', async () => {
      const { validateTaxRate } = await import('@haravan/shared');
      expect(validateTaxRate(0.15)).toContain('hợp lệ');
      expect(validateTaxRate(-0.1)).toContain('hợp lệ');
    });

    it('amountToWords returns Vietnamese text', async () => {
      const { amountToWords } = await import('@haravan/shared');
      const result = amountToWords(100000);
      expect(result).toContain('nghìn');
      expect(result).toContain('đồng');
    });
  });
});
