import app from '../index';

export interface TestAuthToken {
  token: string;
  merchantId: string;
  userId: string;
  role: string;
}

export async function getTestAuthUser(username = 'test'): Promise<TestAuthToken> {
  const res = await app.request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  const json = (await res.json()) as { data: { token: string; user: { merchantId: string; userId: string; role: string } } };
  return {
    token: json.data.token,
    merchantId: json.data.user?.merchantId || 'merchant-001',
    userId: json.data.user?.userId || 'user-001',
    role: json.data.user?.role || 'admin',
  };
}

export function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export async function authenticatedRequest(
  url: string,
  token: string,
  options: { method?: string; body?: unknown } = {},
): Promise<Response> {
  const { method = 'GET', body } = options;
  const init: RequestInit = {
    method,
    headers: authHeaders(token),
  };
  if (body) {
    init.body = JSON.stringify(body);
  }
  return app.request(url, init);
}
