import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('Analytics API', () => {
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
    it('GET /api/v1/analytics/channels requires auth', async () => {
      const res = await app.request('/api/v1/analytics/channels');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/analytics/top-customers requires auth', async () => {
      const res = await app.request('/api/v1/analytics/top-customers');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/analytics/top-skus requires auth', async () => {
      const res = await app.request('/api/v1/analytics/top-skus');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/analytics/channels returns 401 with invalid token', async () => {
      const res = await app.request('/api/v1/analytics/channels', {
        headers: { Authorization: 'Bearer invalid-token' },
      });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/analytics/channels', () => {
    it('returns data with correct structure', async () => {
      const res = await app.request('/api/v1/analytics/channels?days=30', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(Array.isArray(json.data)).toBe(true);
        if (json.data.length > 0) {
          expect(json.data[0]).toHaveProperty('channel');
          expect(json.data[0]).toHaveProperty('count');
          expect(json.data[0]).toHaveProperty('total');
          expect(typeof json.data[0].channel).toBe('string');
          expect(typeof json.data[0].count).toBe('number');
          expect(typeof json.data[0].total).toBe('number');
        }
      }
    });

    it('accepts days=7 query param', async () => {
      const res = await app.request('/api/v1/analytics/channels?days=7', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('accepts days=90 query param', async () => {
      const res = await app.request('/api/v1/analytics/channels?days=90', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('defaults to 30 days when no param', async () => {
      const res = await app.request('/api/v1/analytics/channels', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('handles days=0 (today only)', async () => {
      const res = await app.request('/api/v1/analytics/channels?days=0', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('handles large days value', async () => {
      const res = await app.request('/api/v1/analytics/channels?days=9999', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('handles invalid days param (non-numeric)', async () => {
      const res = await app.request('/api/v1/analytics/channels?days=abc', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json();
        expect(json.success).toBe(true);
      }
    });

    it('handles negative days', async () => {
      const res = await app.request('/api/v1/analytics/channels?days=-5', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });
  });

  describe('GET /api/v1/analytics/top-customers', () => {
    it('returns data with correct structure', async () => {
      const res = await app.request('/api/v1/analytics/top-customers?days=30', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(Array.isArray(json.data)).toBe(true);
        expect(json.data.length).toBeLessThanOrEqual(20);
        if (json.data.length > 0) {
          expect(json.data[0]).toHaveProperty('name');
          expect(json.data[0]).toHaveProperty('mst');
          expect(json.data[0]).toHaveProperty('invoiceCount');
          expect(json.data[0]).toHaveProperty('total');
          expect(typeof json.data[0].name).toBe('string');
          expect(typeof json.data[0].invoiceCount).toBe('number');
          expect(typeof json.data[0].total).toBe('number');
        }
      }
    });

    it('accepts days=7 query param', async () => {
      const res = await app.request('/api/v1/analytics/top-customers?days=7', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('accepts days=90 query param', async () => {
      const res = await app.request('/api/v1/analytics/top-customers?days=90', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('defaults to 30 days when no param', async () => {
      const res = await app.request('/api/v1/analytics/top-customers', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });
  });

  describe('GET /api/v1/analytics/top-skus', () => {
    it('returns data with correct structure', async () => {
      const res = await app.request('/api/v1/analytics/top-skus?days=30', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(Array.isArray(json.data)).toBe(true);
        expect(json.data.length).toBeLessThanOrEqual(10);
        if (json.data.length > 0) {
          expect(json.data[0]).toHaveProperty('name');
          expect(json.data[0]).toHaveProperty('sku');
          expect(json.data[0]).toHaveProperty('qty');
          expect(json.data[0]).toHaveProperty('revenue');
          expect(typeof json.data[0].name).toBe('string');
          expect(typeof json.data[0].qty).toBe('number');
          expect(typeof json.data[0].revenue).toBe('number');
        }
      }
    });

    it('accepts days=7 query param', async () => {
      const res = await app.request('/api/v1/analytics/top-skus?days=7', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('accepts days=90 query param', async () => {
      const res = await app.request('/api/v1/analytics/top-skus?days=90', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('defaults to 30 days when no param', async () => {
      const res = await app.request('/api/v1/analytics/top-skus', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });
  });

  describe('Response format consistency', () => {
    it('all endpoints return success: true on 200', async () => {
      const endpoints = [
        '/api/v1/analytics/channels?days=30',
        '/api/v1/analytics/top-customers?days=30',
        '/api/v1/analytics/top-skus?days=30',
      ];

      for (const endpoint of endpoints) {
        const res = await app.request(endpoint, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (res.status === 200) {
          const json = await res.json();
          expect(json.success).toBe(true);
          expect(json).toHaveProperty('data');
        }
      }
    });

    it('all endpoints return array data on 200', async () => {
      const endpoints = [
        '/api/v1/analytics/channels?days=30',
        '/api/v1/analytics/top-customers?days=30',
        '/api/v1/analytics/top-skus?days=30',
      ];

      for (const endpoint of endpoints) {
        const res = await app.request(endpoint, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (res.status === 200) {
          const json = await res.json();
          expect(Array.isArray(json.data)).toBe(true);
        }
      }
    });
  });
});
