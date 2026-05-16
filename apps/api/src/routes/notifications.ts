import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database; KV: KVNamespace };

const notifications = new Hono<{ Bindings: Bindings }>();
notifications.use('*', authMiddleware());

notifications.get('/', async (c) => {
  const user = c.get('user');
  const filter = c.req.query('filter') || 'all';
  const type = c.req.query('type');

  let query = 'SELECT * FROM notifications WHERE merchant_id = ?';
  const params: unknown[] = [user.merchantId];

  if (filter === 'unread') {
    query += ' AND read = 0';
  }
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }
  query += ' ORDER BY created_at DESC';

  const rows = await c.env.DB.prepare(query).bind(...params).all();

  const unreadCount = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM notifications WHERE merchant_id = ? AND read = 0'
  ).bind(user.merchantId).first() as { count: number };

  return c.json({
    success: true,
    data: {
      items: (rows.results || []).map(r => ({
        id: r.id,
        type: r.type,
        title: r.title,
        message: r.message,
        time: r.created_at,
        read: Boolean(r.read),
        link: r.link || '',
        category: r.category || 'system',
      })),
      total: (rows.results || []).length,
      unreadCount: unreadCount?.count || 0,
    },
  });
});

notifications.patch('/:id/read', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');

  await c.env.DB.prepare(
    'UPDATE notifications SET read = 1 WHERE id = ? AND merchant_id = ?'
  ).bind(id, user.merchantId).run();

  return c.json({ success: true });
});

notifications.post('/read-all', async (c) => {
  const user = c.get('user');

  await c.env.DB.prepare(
    'UPDATE notifications SET read = 1 WHERE merchant_id = ?'
  ).bind(user.merchantId).run();

  return c.json({ success: true, message: 'Đã đánh dấu tất cả đã đọc' });
});

notifications.get('/unread-count', async (c) => {
  const user = c.get('user');

  const result = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM notifications WHERE merchant_id = ? AND read = 0'
  ).bind(user.merchantId).first() as { count: number };

  return c.json({ success: true, data: { count: result?.count || 0 } });
});

export default notifications;
