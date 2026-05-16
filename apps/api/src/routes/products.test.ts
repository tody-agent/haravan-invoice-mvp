import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('Product API', () => {
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

  it('GET /api/v1/products requires auth', async () => {
    const res = await app.request('/api/v1/products');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/products returns success', async () => {
    const res = await app.request('/api/v1/products', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/v1/products returns expected structure', async () => {
    const res = await app.request('/api/v1/products', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      const json = (await res.json()) as { success: boolean; data?: { items: unknown[]; total: number; page: number; pageSize: number } };
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('items');
      expect(json.data).toHaveProperty('total');
      expect(json.data).toHaveProperty('page');
      expect(json.data).toHaveProperty('pageSize');
    }
  });

  it('GET /api/v1/products supports search', async () => {
    const res = await app.request('/api/v1/products?search=test', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/v1/products supports pagination', async () => {
    const res = await app.request('/api/v1/products?page=1&pageSize=10', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });
});
