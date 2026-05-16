import { Hono } from 'hono';

const auth = new Hono();

auth.post('/login', async (c) => {
  const body = await c.req.json<{ username?: string; password?: string }>();

  // Mock auth: accept any credentials in dev
  const username = body.username || 'admin';

  // Create mock JWT (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      merchantId: 'merchant-001',
      userId: `user-${username}`,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24h
    })
  );
  const signature = 'mock-signature';

  const token = `${header}.${payload}.${signature}`;

  return c.json({
    success: true,
    data: {
      token,
      user: {
        merchantId: 'merchant-001',
        userId: `user-${username}`,
        role: 'admin',
        name: username,
      },
    },
  });
});

export default auth;
