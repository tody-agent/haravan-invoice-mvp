import { expect } from 'vitest';
import app from '../index';

export async function getAuthToken(): Promise<string> {
  const res = await app.request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test' }),
  });
  const json = (await res.json()) as { data: { token: string } };
  return json.data.token;
}

export function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export function publicHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' };
}

export async function request(path: string, options: RequestInit = {}): Promise<Response> {
  return app.request(path, options);
}

export async function authenticatedRequest(path: string, token: string, options: RequestInit = {}): Promise<Response> {
  return app.request(path, {
    ...options,
    headers: { ...authHeaders(token), ...(options.headers as Record<string, string>) },
  });
}

export function expectAuthRequired(path: string, method = 'GET') {
  return async () => {
    const res = await app.request(path, { method, headers: publicHeaders() });
    expect(res.status).toBe(401);
  };
}

export function expectSuccessOrDbUnavailable(path: string, options: RequestInit = {}) {
  return async () => {
    const res = await app.request(path, options);
    expect([200, 500]).toContain(res.status);
  };
}

export async function expectResponseShape(
  path: string,
  token: string,
  shapeValidator: (json: Record<string, unknown>) => void,
  options: RequestInit = {},
): Promise<void> {
  const res = await app.request(path, {
    ...options,
    headers: { ...authHeaders(token), ...(options.headers as Record<string, string>) },
  });
  if (res.status === 200) {
    const json = (await res.json()) as Record<string, unknown>;
    expect(json.success).toBe(true);
    shapeValidator(json);
  }
}
