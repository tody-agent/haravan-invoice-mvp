import { describe, it, expect } from 'vitest';
import app from '../index';

describe('Health API', () => {
  it('GET /api/v1/health returns status', async () => {
    const res = await app.request('/api/v1/health');
    const json = await res.json() as Record<string, any>;
    expect(json.success).toBeDefined();
    expect(json.data.timestamp).toBeDefined();
  });
});
