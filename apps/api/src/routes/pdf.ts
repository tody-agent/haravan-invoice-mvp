import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { InvoiceService } from '../services/invoice-service';
import { createAdapter } from '../adapters';
import { PDFService } from '../services/pdf-service';

type Bindings = { DB: D1Database; KV: KVNamespace; R2: R2Bucket };

const pdf = new Hono<{ Bindings: Bindings }>();
pdf.use('*', authMiddleware());

pdf.get('/:id/pdf', async (c) => {
  const id = c.req.param('id');
  const adapter = createAdapter('mock');
  const service = new InvoiceService(c.env.DB, adapter);
  const pdfService = new PDFService();

  const cacheKey = `pdf/${id}.html`;
  const cached = await c.env.R2.get(cacheKey);
  if (cached) {
    const html = await cached.text();
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="invoice-${id}.html"`,
      },
    });
  }

  const invoice = await service.getById(id);
  if (!invoice) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Hóa đơn không tồn tại' } }, 404);
  }

  const html = pdfService.generateHTML(invoice);

  await c.env.R2.put(cacheKey, html, {
    httpMetadata: { contentType: 'text/html; charset=utf-8' },
  });

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="invoice-${id}.html"`,
    },
  });
});

export default pdf;
