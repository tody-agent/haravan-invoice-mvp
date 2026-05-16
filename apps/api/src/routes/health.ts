import { Hono } from 'hono';

type Bindings = { DB: D1Database; KV: KVNamespace };

const health = new Hono<{ Bindings: Bindings }>();

health.get('/', async (c) => {
  const checks: Record<string, string> = {};
  let healthy = true;

  // DB check
  try {
    await c.env.DB.prepare('SELECT 1').first();
    checks.db = 'ok';
  } catch (e) {
    checks.db = 'error';
    healthy = false;
  }

  // KV check
  try {
    await c.env.KV.get('__health__');
    checks.kv = 'ok';
  } catch (e) {
    checks.kv = 'error';
    healthy = false;
  }

  return c.json(
    {
      success: healthy,
      data: {
        status: healthy ? 'ok' : 'degraded',
        checks,
        timestamp: new Date().toISOString(),
      },
    },
    healthy ? 200 : 503
  );
});

export default health;
