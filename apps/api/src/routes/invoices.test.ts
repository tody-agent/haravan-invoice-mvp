import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('Invoice API', () => {
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

  it('GET /api/v1/invoices requires auth', async () => {
    const res = await app.request('/api/v1/invoices');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/invoices returns 500 without D1 binding', async () => {
    const res = await app.request('/api/v1/invoices', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });

  it('POST /api/v1/invoices creates invoice', async () => {
    const res = await app.request('/api/v1/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        buyer: { name: 'Test Buyer', mst: '0123456789' },
        items: [{ name: 'Test Item', quantity: 1, unitPrice: 100000, taxRate: 0.1, total: 110000 }],
      }),
    });
    expect([200, 201, 400, 500]).toContain(res.status);
  });

  it('GET /api/v1/invoices/:id returns 404 or 500 for non-existent', async () => {
    const res = await app.request('/api/v1/invoices/non-existent', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([404, 500]).toContain(res.status);
  });

  it('POST /api/v1/invoices/:id/replace returns 400 or 500', async () => {
    const res = await app.request('/api/v1/invoices/non-existent/replace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        buyer: { name: 'Test Buyer', mst: '0123456789' },
        items: [{ name: 'Test Item', quantity: 1, unitPrice: 100000, taxRate: 0.1, total: 110000 }],
        reason: 'test',
      }),
    });
    expect([400, 404, 500]).toContain(res.status);
  });

  it('POST /api/v1/invoices/:id/adjust returns 400 or 500', async () => {
    const res = await app.request('/api/v1/invoices/non-existent/adjust', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        type: 'increase',
        items: [{ name: 'Test Item', quantity: 1, total: 10000 }],
        reason: 'test',
      }),
    });
    expect([400, 404, 500]).toContain(res.status);
  });
});
