import { Hono } from 'hono';

const auth = new Hono();

interface MockUser {
  merchantId: string;
  role: 'admin' | 'cashier' | 'manager';
  name: string;
  industry: string;
  color: string;
}

const MOCK_USERS: Record<string, MockUser> = {
  fnb: {
    merchantId: 'merchant-fnb',
    role: 'admin',
    name: 'Admin F&B Saigon',
    industry: 'F&B - Chuỗi Coffee & Nhà hàng',
    color: '#f59e0b',
  },
  fashion: {
    merchantId: 'merchant-fashion',
    role: 'admin',
    name: 'Admin Thời Trang Việt',
    industry: 'Thời trang E-commerce',
    color: '#ec4899',
  },
  cosmetics: {
    merchantId: 'merchant-cosmetics',
    role: 'admin',
    name: 'Admin Mỹ phẩm Thiên Nhiên',
    industry: 'Mỹ phẩm B2B + B2C',
    color: '#8b5cf6',
  },
  livestream: {
    merchantId: 'merchant-livestream',
    role: 'admin',
    name: 'Admin Livestream Commerce',
    industry: 'Livestream - Sản lượng lớn',
    color: '#ef4444',
  },
  omnichannel: {
    merchantId: 'merchant-omnichannel',
    role: 'admin',
    name: 'Admin Omnichannel Retail',
    industry: 'Đa kênh Đa sàn',
    color: '#06b6d4',
  },
  retail: {
    merchantId: 'merchant-retail',
    role: 'admin',
    name: 'Admin Bán Lẻ Tiện Ích',
    industry: 'Bán lẻ Chuỗi Mini Mart',
    color: '#10b981',
  },
};

auth.post('/login', async (c) => {
  const body = await c.req.json<{ username?: string; password?: string }>();

  const username = body.username || 'admin';
  const user = MOCK_USERS[username] || {
    merchantId: 'merchant-001',
    role: 'admin' as const,
    name: username,
    industry: 'General',
    color: '#0088ff',
  };

  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      merchantId: user.merchantId,
      userId: `user-${username}`,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    })
  );
  const signature = 'mock-signature';

  const token = `${header}.${payload}.${signature}`;

  return c.json({
    success: true,
    data: {
      token,
      user: {
        merchantId: user.merchantId,
        userId: `user-${username}`,
        role: user.role,
        name: user.name,
        industry: user.industry,
        color: user.color,
      },
    },
  });
});

export default auth;
