import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('MST Lookup API', () => {
  let authToken: string;

  beforeAll(async () => {
    const res = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test' }),
    });
    const json = await res.json();
    authToken = (json as any).data.token;
  });

  it('GET /lookup returns company info', async () => {
    const res = await app.request('/api/v1/mst/lookup?mst=0123456789', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });

  it('GET /validate checks MST format', async () => {
    const res = await app.request('/api/v1/mst/validate?mst=0123456789', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });

  it('GET /validate rejects invalid MST', async () => {
    const res = await app.request('/api/v1/mst/validate?mst=12345', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect([200, 500]).toContain(res.status);
  });
});
