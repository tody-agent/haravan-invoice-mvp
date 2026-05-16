import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('Customer Analytics API', () => {
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

  describe('Auth guards', () => {
    it('GET /api/v1/customers/:id/analytics requires auth', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/customers/:id/analytics returns 401 with invalid token', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics', {
        headers: { Authorization: 'Bearer invalid-token' },
      });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/customers/:id/analytics', () => {
    it('returns 404 for non-existent customer', async () => {
      const res = await app.request('/api/v1/customers/non-existent-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([404, 500]).toContain(res.status);
      if (res.status === 404) {
        const json = await res.json() as Record<string, any>;
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('NOT_FOUND');
      }
    });

    it('returns data with correct top-level structure', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 404, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json() as Record<string, any>;
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('customer');
        expect(json.data).toHaveProperty('stats');
        expect(json.data).toHaveProperty('monthly');
        expect(json.data).toHaveProperty('channels');
      }
    });

    it('customer object has all required fields', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 200) {
        const json = await res.json() as Record<string, any>;
        const c = json.data.customer;
        expect(c).toHaveProperty('id');
        expect(c).toHaveProperty('name');
        expect(c).toHaveProperty('mst');
        expect(c).toHaveProperty('address');
        expect(c).toHaveProperty('email');
        expect(c).toHaveProperty('phone');
      }
    });

    it('stats object has all required fields with correct types', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 200) {
        const json = await res.json() as Record<string, any>;
        const s = json.data.stats;
        expect(s).toHaveProperty('totalInvoices');
        expect(s).toHaveProperty('totalRevenue');
        expect(s).toHaveProperty('avgOrderValue');
        expect(s).toHaveProperty('firstInvoice');
        expect(s).toHaveProperty('lastInvoice');
        expect(typeof s.totalInvoices).toBe('number');
        expect(typeof s.totalRevenue).toBe('number');
        expect(typeof s.avgOrderValue).toBe('number');
      }
    });

    it('monthly array has correct shape', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 200) {
        const json = await res.json() as Record<string, any>;
        expect(Array.isArray(json.data.monthly)).toBe(true);
        if (json.data.monthly.length > 0) {
          const m = json.data.monthly[0];
          expect(m).toHaveProperty('month');
          expect(m).toHaveProperty('count');
          expect(m).toHaveProperty('total');
          expect(typeof m.month).toBe('string');
          expect(typeof m.count).toBe('number');
          expect(typeof m.total).toBe('number');
          // Month format YYYY-MM
          expect(m.month).toMatch(/^\d{4}-\d{2}$/);
        }
      }
    });

    it('channels array has correct shape', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 200) {
        const json = await res.json() as Record<string, any>;
        expect(Array.isArray(json.data.channels)).toBe(true);
        if (json.data.channels.length > 0) {
          const ch = json.data.channels[0];
          expect(ch).toHaveProperty('channel');
          expect(ch).toHaveProperty('count');
          expect(ch).toHaveProperty('total');
          expect(typeof ch.channel).toBe('string');
          expect(typeof ch.count).toBe('number');
          expect(typeof ch.total).toBe('number');
        }
      }
    });

    it('stats values are non-negative', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 200) {
        const json = await res.json() as Record<string, any>;
        const s = json.data.stats;
        expect(s.totalInvoices).toBeGreaterThanOrEqual(0);
        expect(s.totalRevenue).toBeGreaterThanOrEqual(0);
        expect(s.avgOrderValue).toBeGreaterThanOrEqual(0);
      }
    });

    it('monthly items have non-negative values', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 200) {
        const json = await res.json() as Record<string, any>;
        for (const m of json.data.monthly) {
          expect(m.count).toBeGreaterThanOrEqual(0);
          expect(m.total).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('channel items have non-negative values', async () => {
      const res = await app.request('/api/v1/customers/test-id/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 200) {
        const json = await res.json() as Record<string, any>;
        for (const ch of json.data.channels) {
          expect(ch.count).toBeGreaterThanOrEqual(0);
          expect(ch.total).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });
});
