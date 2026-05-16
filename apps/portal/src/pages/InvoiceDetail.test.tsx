import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import InvoiceDetail from './InvoiceDetail';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(
    <MemoryRouter initialEntries={['/invoices/inv-001']}>
      <Routes>
        <Route path="/invoices/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('InvoiceDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: {
          id: 'inv-001',
          haravanId: 'HRV-INV-001-001',
          status: 'cqt_accepted',
          buyer: { name: 'Công ty ABC', mst: '0123456789' },
          items: [{ name: 'Laptop Dell', quantity: 2, unitPrice: 15000000, total: 33000000 }],
          totals: { subtotal: 30000000, taxAmount: 3000000, total: 33000000 },
        },
      }),
    });
  });

  it('renders invoice details', async () => {
    renderWithRouter(<InvoiceDetail />);
    await waitFor(() => {
      expect(screen.getByText('HRV-INV-001-001')).toBeInTheDocument();
    });
  });

  it('shows buyer info', async () => {
    renderWithRouter(<InvoiceDetail />);
    await waitFor(() => {
      expect(screen.getByText('Công ty ABC')).toBeInTheDocument();
    });
  });
});
