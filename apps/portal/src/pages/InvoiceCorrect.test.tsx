import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import InvoiceCorrect from './InvoiceCorrect';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(
    <MemoryRouter initialEntries={['/invoices/inv-001/correct']}>
      <Routes>
        <Route path="/invoices/:id/correct" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('InvoiceCorrect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: {
          id: 'inv-001',
          haravanId: 'HRV-INV-001-001',
          status: 'issued',
          buyer: { name: 'Công ty ABC', mst: '0123456789' },
          items: [{ name: 'Laptop Dell', quantity: 2, unitPrice: 15000000, total: 33000000 }],
          totals: { subtotal: 30000000, taxAmount: 3000000, total: 33000000 },
        },
      }),
    });
  });

  it('renders correction form', async () => {
    renderWithRouter(<InvoiceCorrect />);
    await waitFor(() => {
      expect(screen.getByText(/điều chỉnh|thay thế|sửa/i)).toBeInTheDocument();
    });
  });

  it('shows original invoice info', async () => {
    renderWithRouter(<InvoiceCorrect />);
    await waitFor(() => {
      expect(screen.getByText('HRV-INV-001-001')).toBeInTheDocument();
    });
  });
});
