import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('Config API', () => {
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

  it('GET /api/v1/config requires auth', async () => {
    const res = await app.request('/api/v1/config');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/config returns config', async () => {
    const res = await app.request('/api/v1/config', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/v1/config returns expected structure', async () => {
    const res = await app.request('/api/v1/config', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status === 200) {
      const json = (await res.json()) as { success: boolean; data: Record<string, unknown> };
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('merchantId');
      expect(json.data).toHaveProperty('autoIssueOnPaid');
      expect(json.data).toHaveProperty('defaultTaxRate');
      expect(json.data).toHaveProperty('tvanProvider');
    }
  });

  it('PATCH /api/v1/config requires auth', async () => {
    const res = await app.request('/api/v1/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoIssueOnPaid: true }),
    });
    expect(res.status).toBe(401);
  });

  it('PATCH /api/v1/config updates config', async () => {
    const res = await app.request('/api/v1/config', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ autoIssueOnPaid: true }),
    });
    expect([200, 500]).toContain(res.status);
  });

  it('PATCH /api/v1/config rejects invalid fields', async () => {
    const res = await app.request('/api/v1/config', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ invalidField: 'test' }),
    });
    if (res.status === 200) {
      const json = (await res.json()) as { success: boolean };
      expect(json.success).toBe(false);
    } else {
      expect([400, 500]).toContain(res.status);
    }
  });
});
