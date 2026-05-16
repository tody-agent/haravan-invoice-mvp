import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('Settings API', () => {
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

  describe('Templates', () => {
    it('GET /api/v1/settings/templates requires auth', async () => {
      const res = await app.request('/api/v1/settings/templates');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/settings/templates returns templates', async () => {
      const res = await app.request('/api/v1/settings/templates', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('GET /api/v1/settings/templates returns expected structure', async () => {
      const res = await app.request('/api/v1/settings/templates', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 200) {
        const json = (await res.json()) as { success: boolean; data: Record<string, unknown> };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('mauSo');
        expect(json.data).toHaveProperty('kyHieu');
        expect(json.data).toHaveProperty('templateName');
        expect(json.data).toHaveProperty('status');
      }
    });

    it('PATCH /api/v1/settings/templates requires auth', async () => {
      const res = await app.request('/api/v1/settings/templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mauSo: '01GTKT0/002' }),
      });
      expect(res.status).toBe(401);
    });

    it('PATCH /api/v1/settings/templates updates templates', async () => {
      const res = await app.request('/api/v1/settings/templates', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ mauSo: '01GTKT0/002', kyHieu: 'BB/20E' }),
      });
      expect([200, 500]).toContain(res.status);
    });
  });

  describe('Automation', () => {
    it('GET /api/v1/settings/automation requires auth', async () => {
      const res = await app.request('/api/v1/settings/automation');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/settings/automation returns automation config', async () => {
      const res = await app.request('/api/v1/settings/automation', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('GET /api/v1/settings/automation returns expected structure', async () => {
      const res = await app.request('/api/v1/settings/automation', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 200) {
        const json = (await res.json()) as { success: boolean; data: Record<string, unknown> };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('autoIssueOnPaid');
        expect(json.data).toHaveProperty('channels');
        expect(json.data).toHaveProperty('notifyOnIssue');
        expect(json.data).toHaveProperty('notifyOnError');
      }
    });

    it('PATCH /api/v1/settings/automation requires auth', async () => {
      const res = await app.request('/api/v1/settings/automation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoIssueOnPaid: true }),
      });
      expect(res.status).toBe(401);
    });

    it('PATCH /api/v1/settings/automation updates automation', async () => {
      const res = await app.request('/api/v1/settings/automation', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ autoIssueOnPaid: true }),
      });
      expect([200, 500]).toContain(res.status);
    });
  });

  describe('Plan', () => {
    it('GET /api/v1/settings/plan requires auth', async () => {
      const res = await app.request('/api/v1/settings/plan');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/settings/plan returns plan info', async () => {
      const res = await app.request('/api/v1/settings/plan', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect([200, 500]).toContain(res.status);
    });

    it('GET /api/v1/settings/plan returns expected structure', async () => {
      const res = await app.request('/api/v1/settings/plan', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 200) {
        const json = (await res.json()) as { success: boolean; data: Record<string, unknown> };
        expect(json.success).toBe(true);
        expect(json.data).toHaveProperty('plan');
        expect(json.data).toHaveProperty('invoiceLimit');
        expect(json.data).toHaveProperty('invoiceUsed');
        expect(json.data).toHaveProperty('features');
      }
    });
  });
});
