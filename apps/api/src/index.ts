import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';
import { authRoutes, configRoutes, healthRoutes, invoiceRoutes, reportRoutes, auditRoutes, pdfRoutes, customerRoutes, customerAnalyticsRoutes, oneClickRoutes, mstLookupRoutes, analyticsRoutes, productRoutes, aggregateRoutes, settingsRoutes, notificationRoutes } from './routes';

type Bindings = {
  DB: D1Database;
  R2: R2Bucket;
  KV: KVNamespace;
  ENVIRONMENT: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', logger());
app.use('*', requestId());
app.use('*', cors());

// Mount routes
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/config', configRoutes);
app.route('/api/v1/health', healthRoutes);
app.route('/api/v1/invoices', invoiceRoutes);
app.route('/api/v1/reports', reportRoutes);
app.route('/api/v1/invoices', auditRoutes);
app.route('/api/v1/invoices', pdfRoutes);
app.route('/api/v1/customers', customerRoutes);
app.route('/api/v1/customers', customerAnalyticsRoutes);
app.route('/api/v1/invoices', oneClickRoutes);
app.route('/api/v1/mst', mstLookupRoutes);
app.route('/api/v1/analytics', analyticsRoutes);
app.route('/api/v1/products', productRoutes);
app.route('/api/v1/aggregate', aggregateRoutes);
app.route('/api/v1/settings', settingsRoutes);
app.route('/api/v1/notifications', notificationRoutes);

// Root
app.get('/', (c) => c.json({ name: 'Haravan Invoice MVP', version: '0.0.1' }));

export default app;
