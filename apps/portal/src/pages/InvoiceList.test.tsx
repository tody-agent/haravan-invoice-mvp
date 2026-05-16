import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InvoiceList from './InvoiceList';

const mockInvoices = {
  success: true,
  data: {
    items: [
      { id: '1', haravanId: 'INV001', status: 'issued', total: 1100000, buyerName: 'Customer A', issueDate: '2026-05-01' },
      { id: '2', haravanId: 'INV002', status: 'pending', total: 2200000, buyerName: 'Customer B', issueDate: '2026-05-02' },
    ],
    total: 2,
    page: 1,
    pageSize: 20,
  },
};

describe('InvoiceList', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton initially', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<BrowserRouter><InvoiceList /></BrowserRouter>);
    expect(document.querySelector('.hv-skeleton')).toBeTruthy();
  });

  it('renders invoice table after fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockInvoices,
    } as Response);

    render(<BrowserRouter><InvoiceList /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('INV001')).toBeTruthy();
      expect(screen.getByText('INV002')).toBeTruthy();
    });
  });

  it('renders filter bar', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockInvoices,
    } as Response);

    render(<BrowserRouter><InvoiceList /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Tìm kiếm...')).toBeTruthy();
    });
  });

  it('renders empty state when no invoices', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0 } }),
    } as Response);

    render(<BrowserRouter><InvoiceList /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy hóa đơn')).toBeTruthy();
    });
  });
});
