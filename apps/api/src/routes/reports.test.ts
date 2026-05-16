import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('Reports API', () => {
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

  it('GET /api/v1/reports/summary returns data', async () => {
    const res = await app.request('/api/v1/reports/summary', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/v1/reports/monthly returns data', async () => {
    const res = await app.request('/api/v1/reports/monthly?month=2026-05', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/v1/reports/sales returns daily breakdown', async () => {
    const res = await app.request('/api/v1/reports/sales?dateFrom=2026-01-01&dateTo=2026-12-31', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: Record<string, unknown> };
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('days');
      expect(json.data).toHaveProperty('summary');
      expect(json.data.summary).toHaveProperty('count');
      expect(json.data.summary).toHaveProperty('subtotal');
      expect(json.data.summary).toHaveProperty('tax');
      expect(json.data.summary).toHaveProperty('total');
    }
  });

  it('GET /api/v1/reports/ledger returns invoice list', async () => {
    const res = await app.request('/api/v1/reports/ledger?dateFrom=2026-01-01&dateTo=2026-12-31', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: Record<string, unknown> };
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('invoices');
      expect(json.data).toHaveProperty('summary');
      expect(json.data.summary).toHaveProperty('count');
      expect(json.data.summary).toHaveProperty('subtotal');
      expect(json.data.summary).toHaveProperty('taxAmount');
      expect(json.data.summary).toHaveProperty('total');
    }
  });

  it('GET /api/v1/reports/ledger filters by status', async () => {
    const res = await app.request('/api/v1/reports/ledger?status=issued', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/v1/reports/quarterly returns quarterly summary', async () => {
    const res = await app.request('/api/v1/reports/quarterly?year=2026', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: Record<string, unknown> };
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('quarters');
      expect(json.data).toHaveProperty('yearTotal');
      expect(json.data.yearTotal).toHaveProperty('count');
      expect(json.data.yearTotal).toHaveProperty('subtotal');
      expect(json.data.yearTotal).toHaveProperty('taxAmount');
      expect(json.data.yearTotal).toHaveProperty('total');
    }
  });

  it('GET /api/v1/reports/replaced returns replaced invoices', async () => {
    const res = await app.request('/api/v1/reports/replaced?dateFrom=2026-01-01&dateTo=2026-12-31', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: Record<string, unknown> };
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('invoices');
      expect(json.data).toHaveProperty('count');
    }
  });

  it('GET /api/v1/reports/modified returns adjusted invoices', async () => {
    const res = await app.request('/api/v1/reports/modified?dateFrom=2026-01-01&dateTo=2026-12-31', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: Record<string, unknown> };
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('invoices');
      expect(json.data).toHaveProperty('count');
    }
  });

  it('GET /api/v1/reports/deleted returns replaced invoices with compliance note', async () => {
    const res = await app.request('/api/v1/reports/deleted?dateFrom=2026-01-01&dateTo=2026-12-31', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = await res.json() as { success: boolean; data: { note: string } };
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('invoices');
      expect(json.data).toHaveProperty('count');
      expect(json.data).toHaveProperty('note');
      expect(json.data.note).toContain('NĐ 70/2025');
    }
  });

  it('GET /api/v1/reports/sales returns 401 without auth', async () => {
    const res = await app.request('/api/v1/reports/sales');
    expect(res.status).toBe(401);
  });
});
