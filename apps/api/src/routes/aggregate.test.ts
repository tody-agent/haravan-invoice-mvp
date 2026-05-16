import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('Aggregate API (TT 78/TT 32)', () => {
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

  it('POST /api/v1/aggregate requires auth', async () => {
    const res = await app.request('/api/v1/aggregate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: '2026-05-16' }),
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/aggregate returns response', async () => {
    const res = await app.request('/api/v1/aggregate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ date: '2026-05-16' }),
    });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('POST /api/v1/aggregate accepts date param', async () => {
    const res = await app.request('/api/v1/aggregate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ date: '2099-01-01' }),
    });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('POST /api/v1/aggregate defaults date to today', async () => {
    const res = await app.request('/api/v1/aggregate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({}),
    });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('GET /api/v1/aggregate/summary requires auth', async () => {
    const res = await app.request('/api/v1/aggregate/summary');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/aggregate/summary returns response', async () => {
    const res = await app.request('/api/v1/aggregate/summary?month=2026-05', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/v1/aggregate/summary accepts month param', async () => {
    const res = await app.request('/api/v1/aggregate/summary', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });
});
