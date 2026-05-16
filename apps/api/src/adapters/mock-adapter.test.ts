import { describe, it, expect } from 'vitest';
import { MockAdapter } from './mock-adapter';

describe('MockAdapter', () => {
  const adapter = new MockAdapter(0);

  const mockInvoice = {
    id: 'inv-test',
    haravanId: 'HRV-TEST-001',
    status: 'pending' as const,
    buyer: { name: 'Test Buyer', mst: '0123456789' },
    seller: { name: 'Test Seller', mst: '9876543210' },
    items: [{ name: 'Test Item', quantity: 1, unitPrice: 100000, taxRate: 0.1 as const, total: 110000 }],
    totals: { subtotal: 100000, taxAmount: 10000, discount: 0, total: 110000 },
    paymentMethod: 'transfer' as const,
    channel: 'admin' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  };

  it('issue returns success with tvanId', async () => {
    const result = await adapter.issue(mockInvoice);
    expect(result.success).toBe(true);
    expect(result.tvanId).toMatch(/^MOCK-/);
    expect(result.cqtConfirmation).toBeDefined();
    expect(result.cqtConfirmation?.id).toMatch(/^CQT-/);
  });

  it('replace returns success', async () => {
    const result = await adapter.replace('inv-original', mockInvoice);
    expect(result.success).toBe(true);
    expect(result.tvanId).toMatch(/^MOCK-RPL-/);
  });

  it('adjust returns success', async () => {
    const result = await adapter.adjust('inv-original', {
      type: 'increase',
      items: [{ total: 50000 }],
    });
    expect(result.success).toBe(true);
    expect(result.tvanId).toMatch(/^MOCK-ADJ-/);
  });

  it('query returns status', async () => {
    const result = await adapter.query('MOCK-123');
    expect(result.status).toBe('cqt_accepted');
    expect(result.data).toBeDefined();
  });

  it('has correct provider name', () => {
    expect(adapter.provider).toBe('mock');
  });
});

describe('MockAdapter with errors', () => {
  it('returns error when random fails', async () => {
    const adapter = new MockAdapter(1);
    const mockInvoice = {
      id: 'inv-test',
      haravanId: 'HRV-TEST-001',
      status: 'pending' as const,
      buyer: { name: 'Test' },
      seller: { name: 'Test' },
      items: [{ name: 'Test', quantity: 1, unitPrice: 100, taxRate: 0 as const, total: 100 }],
      totals: { subtotal: 100, taxAmount: 0, discount: 0, total: 100 },
      paymentMethod: 'cash' as const,
      channel: 'pos' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    const result = await adapter.issue(mockInvoice);
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('MOCK_ERROR');
  });
});
