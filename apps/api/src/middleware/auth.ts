import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

export interface AuthUser {
  merchantId: string;
  userId: string;
  role: 'admin' | 'user';
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser;
  }
}

export function authMiddleware(required = true) {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      if (required) {
        throw new HTTPException(401, { message: 'Missing or invalid Authorization header' });
      }
      return next();
    }

    const token = authHeader.slice(7);

    // Mock JWT: just decode base64 payload
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token format');

      const payload = JSON.parse(atob(parts[1]));

      c.set('user', {
        merchantId: payload.merchantId || 'merchant-001',
        userId: payload.userId || 'user-001',
        role: payload.role || 'admin',
      });
    } catch {
      if (required) {
        throw new HTTPException(401, { message: 'Invalid token' });
      }
    }

    await next();
  };
}

export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    if (!user || !roles.includes(user.role)) {
      throw new HTTPException(403, { message: 'Insufficient permissions' });
    }
    await next();
  };
}
