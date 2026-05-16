import { describe, it, expect } from 'vitest';
import app from '../index';

describe('Auth API', () => {
  it('POST /api/v1/auth/login returns token', async () => {
    const res = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', password: 'test' }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.token).toBeDefined();
    expect(json.data.token.split('.')).toHaveLength(3);
  });
});
