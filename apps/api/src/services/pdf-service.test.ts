import { describe, it, expect } from 'vitest';
import { PDFService } from './pdf-service';
import type { Invoice } from '@haravan/shared';

describe('PDFService', () => {
  const pdfService = new PDFService();

  const mockInvoice: Invoice = {
    id: 'inv-001',
    haravanId: 'HRV-INV-001-001',
    status: 'cqt_accepted',
    issueDate: '2026-05-01T10:00:00Z',
    buyer: { name: 'Công ty ABC', mst: '0123456789', address: '123 Nguyễn Huệ, Q1' },
    seller: { name: 'Công ty XYZ', mst: '9876543210', address: '456 Lê Lợi, Q3' },
    items: [
      { name: 'Laptop Dell', quantity: 2, unitPrice: 15000000, taxRate: 0.1, total: 33000000 },
    ],
    totals: { subtotal: 30000000, taxAmount: 3000000, discount: 0, total: 33000000 },
    paymentMethod: 'transfer',
    channel: 'admin',
    tvanId: 'MOCK-123',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z',
    version: 1,
  };

  it('generates valid HTML', () => {
    const html = pdfService.generateHTML(mockInvoice);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('HRV-INV-001-001');
    expect(html).toContain('Công ty ABC');
    expect(html).toContain('Laptop Dell');
  });

  it('includes seller and buyer info', () => {
    const html = pdfService.generateHTML(mockInvoice);
    expect(html).toContain('0123456789');
    expect(html).toContain('9876543210');
  });

  it('includes totals', () => {
    const html = pdfService.generateHTML(mockInvoice);
    expect(html).toContain('33.000.000');
  });

  it('includes TVAN ID', () => {
    const html = pdfService.generateHTML(mockInvoice);
    expect(html).toContain('MOCK-123');
  });
});
