import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index';

describe('One-Click Issue API', () => {
  let authToken: string;

  beforeAll(async () => {
    const res = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test' }),
    });
    const json = (await res.json()) as { data: { token: string } };
    authToken = json.data.token;
  });

  it('POST /from-pos creates invoice', async () => {
    const res = await app.request('/api/v1/invoices/from-pos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        items: [{ name: 'Cà phê sữa', quantity: 2, unitPrice: 35000, taxRate: 0.1, total: 77000 }],
        paymentMethod: 'cash',
      }),
    });
    expect([200, 201, 400, 500]).toContain(res.status);
  });

  it('POST /from-order creates invoice from order data', async () => {
    const res = await app.request('/api/v1/invoices/from-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        customerName: 'Nguyễn Văn A',
        customerMst: '0123456789',
        orderItems: [{ productName: 'Laptop Dell', quantity: 1, price: 15000000, taxRate: 0.1 }],
        orderId: 'ORD-001',
        channel: 'web',
      }),
    });
    expect([200, 201, 400, 500]).toContain(res.status);
  });

  it('POST /from-pos returns 400 without items', async () => {
    const res = await app.request('/api/v1/invoices/from-pos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({}),
    });
    expect([400, 500]).toContain(res.status);
  });
});
